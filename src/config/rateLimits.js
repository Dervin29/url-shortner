// Central, env-driven rate-limit thresholds. Every number can be tuned with a
// VITE_RATE_LIMIT_* variable (see README "Rate Limiting") and falls back to a
// sensible default — nothing is hardcoded at call sites.
//
// Tiers:
//   auth / signup / passwordReset — stricter; per-account + per-client
//     (per-IP proxy) limits with exponential backoff instead of a hard lockout.
//   public                       — moderate; short-link reads and redirects.
//   clicks                       — moderate; click-recording dedupe.
//   user                         — looser; authenticated CRUD and analytics.

const int = (key, fallback) => {
  const value = Number(import.meta.env[key]);
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
};

const auth = {
  account: {
    limit: int("VITE_RATE_LIMIT_AUTH_ACCOUNT_LIMIT", 5),
    windowMs: int("VITE_RATE_LIMIT_AUTH_ACCOUNT_WINDOW_MS", 60_000),
  },
  client: {
    limit: int("VITE_RATE_LIMIT_AUTH_CLIENT_LIMIT", 10),
    windowMs: int("VITE_RATE_LIMIT_AUTH_CLIENT_WINDOW_MS", 60_000),
  },
  backoff: {
    factor: int("VITE_RATE_LIMIT_AUTH_BACKOFF_FACTOR", 2),
    maxMs: int("VITE_RATE_LIMIT_AUTH_BACKOFF_MAX_MS", 15 * 60_000),
  },
};

// Signup & password-reset share the auth windows/backoff but default to
// tighter per-account / per-client limits (override via env if needed).
const strictRoute = (route, accountLimit, clientLimit) => ({
  account: {
    limit: int(`VITE_RATE_LIMIT_${route}_ACCOUNT_LIMIT`, accountLimit),
    windowMs: int(
      `VITE_RATE_LIMIT_${route}_ACCOUNT_WINDOW_MS`,
      auth.account.windowMs,
    ),
  },
  client: {
    limit: int(`VITE_RATE_LIMIT_${route}_CLIENT_LIMIT`, clientLimit),
    windowMs: int(`VITE_RATE_LIMIT_${route}_CLIENT_WINDOW_MS`, auth.client.windowMs),
  },
  backoff: auth.backoff,
});

export const rateLimitConfig = {
  auth,
  signup: strictRoute("SIGNUP", 3, 5),
  passwordReset: strictRoute("RESET", 3, 5),
  public: {
    limit: int("VITE_RATE_LIMIT_PUBLIC_LIMIT", 30),
    windowMs: int("VITE_RATE_LIMIT_PUBLIC_WINDOW_MS", 60_000),
  },
  clicks: {
    perUrl: {
      limit: int("VITE_RATE_LIMIT_CLICK_URL_LIMIT", 1),
      windowMs: int("VITE_RATE_LIMIT_CLICK_URL_WINDOW_MS", 30_000),
    },
    perSession: {
      limit: int("VITE_RATE_LIMIT_CLICK_SESSION_LIMIT", 6),
      windowMs: int("VITE_RATE_LIMIT_CLICK_SESSION_WINDOW_MS", 60_000),
    },
  },
  user: {
    limit: int("VITE_RATE_LIMIT_USER_LIMIT", 120),
    windowMs: int("VITE_RATE_LIMIT_USER_WINDOW_MS", 60_000),
  },
};
