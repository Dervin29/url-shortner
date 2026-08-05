import { supabase } from "./supabase";
import { createRateLimiter } from "@/lib/rateLimit";

// Guard against repeated failed attempts / signup spam. Supabase enforces its
// own server-side limits too; this is a client-side UX + abuse guard.
const loginLimiter = createRateLimiter({ limit: 5, windowMs: 60_000, persist: true });
const loginGlobalLimiter = createRateLimiter({ limit: 10, windowMs: 60_000, persist: true });
const signupLimiter = createRateLimiter({ limit: 3, windowMs: 60_000, persist: true });
const signupGlobalLimiter = createRateLimiter({ limit: 5, windowMs: 60_000, persist: true });

const retryHint = (retryAfterMs) =>
  retryAfterMs > 0
    ? ` Please try again in ${Math.ceil(retryAfterMs / 1000)}s.`
    : "";

export async function login({ email, password }) {
  const check = loginLimiter(`login:${(email || "").toLowerCase()}`);
  const global = loginGlobalLimiter("login");
  if (!check.allowed) {
    throw new Error(`Too many login attempts.${retryHint(check.retryAfterMs)}`);
  }
  if (!global.allowed) {
    throw new Error(`Too many login attempts.${retryHint(global.retryAfterMs)}`);
  }

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
  const check = signupLimiter(`signup:${(email || "").toLowerCase()}`);
  const global = signupGlobalLimiter("signup");
  if (!check.allowed) {
    throw new Error(`Too many signup attempts.${retryHint(check.retryAfterMs)}`);
  }
  if (!global.allowed) {
    throw new Error(`Too many signup attempts.${retryHint(global.retryAfterMs)}`);
  }

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

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) throw new Error(error.message);
}

//https://zxusnycbxlblpabinvnd.supabase.co/storage/v1/object/public/profile_pic/L%20Lawliet.jif
