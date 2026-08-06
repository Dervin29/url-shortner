import { supabase } from "./supabase";
import { createRateLimiter, getClientKey, retryHint } from "@/lib/rateLimit";
import { rateLimitConfig } from "@/config/rateLimits";
import { assertValid, loginSchema, resetPasswordSchema, signupSchema } from "@/lib/validation";

// Guard against repeated failed attempts / signup spam. Supabase enforces its
// own server-side limits too; this is a client-side UX + abuse guard. Auth
// routes combine per-account and per-client (per-IP proxy) limits and grow the
// wait time exponentially on repeated attempts instead of a hard lockout.
const toAuthLimiters = ({ account, client, backoff }) => ({
  account: createRateLimiter({
    limit: account.limit,
    windowMs: account.windowMs,
    backoffFactor: backoff.factor,
    maxBackoffMs: backoff.maxMs,
    persist: true,
  }),
  client: createRateLimiter({
    limit: client.limit,
    windowMs: client.windowMs,
    backoffFactor: backoff.factor,
    maxBackoffMs: backoff.maxMs,
    persist: true,
  }),
});

const loginLimiters = toAuthLimiters(rateLimitConfig.auth);
const signupLimiters = toAuthLimiters(rateLimitConfig.signup);
const resetLimiters = toAuthLimiters(rateLimitConfig.passwordReset);

const checkAuthRate = (limiters, route, email) => {
  const accountKey = (email || "").toLowerCase();
  const accountCheck = limiters.account(`auth:${route}:account:${accountKey}`);
  const clientCheck = limiters.client(`auth:${route}:client:${getClientKey()}`);

  if (!accountCheck.allowed) {
    throw new Error(
      `Too many ${route} attempts for this account.${retryHint(accountCheck.retryAfterMs)}`,
    );
  }
  if (!clientCheck.allowed) {
    throw new Error(
      `Too many ${route} attempts from this device.${retryHint(clientCheck.retryAfterMs)}`,
    );
  }
};

export async function login({ email, password }) {
  assertValid(loginSchema, { email, password }, "Unable to sign in");

  checkAuthRate(loginLimiters, "login", email);

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function getCurrentUser() {
  const { data: session, error } = await supabase.auth.getSession();
  if (!session.session) return null;
  if (error) throw new Error(error.message);
  return session.session?.user;
}

export async function signup({ name, email, password, profile_pic }) {
  assertValid(signupSchema, { name, email, password, profile_pic }, "Unable to create account");

  checkAuthRate(signupLimiters, "signup", email);

  const filename = `dp-${name.split(" ").join("-")}-${Math.random()}`;

  const { error: storageError } = await supabase.storage
    .from("profile_pic")
    .upload(filename, profile_pic);

  if (storageError) throw new Error(storageError.message);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        profile_pic: `${import.meta.env.VITE_SUPABASE_URL}/storage/v1/object/public/profile_pic/${filename}`,
      },
    },
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function resetPassword({ email }) {
  assertValid(resetPasswordSchema, { email }, "Unable to send password reset");

  checkAuthRate(resetLimiters, "reset", email);

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${import.meta.env.VITE_APP_URL}/auth?tab=login`,
  });

  if (error) throw new Error(error.message);

  return { ok: true };
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) throw new Error(error.message);
}
