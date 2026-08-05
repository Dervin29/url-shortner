// Fixed-window rate limiter.
//
// Client-side only: it stops accidental/duplicate abuse (refresh spam, button
// mashing, signup storage spam) from the same browser. It is NOT a security
// boundary — real server-side enforcement belongs in Supabase Edge Functions
// or RLS. See README section in src/db.
const STORAGE_KEY = "trimrr-rate-limits";

const readStore = () => {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const writeStore = (store) => {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // sessionStorage unavailable (private mode) — in-memory only
  }
};

export const createRateLimiter = ({ limit, windowMs, persist = false }) => {
  const cache = new Map();

  if (persist) {
    const stored = readStore();
    const now = Date.now();
    for (const [key, value] of Object.entries(stored)) {
      if (value && typeof value.resetAt === "number" && value.resetAt > now) {
        cache.set(key, { count: value.count, resetAt: value.resetAt });
      }
    }
  }

  const sync = () => {
    if (!persist) return;
    const store = {};
    const now = Date.now();
    for (const [key, value] of cache) {
      if (value.resetAt > now) store[key] = value;
    }
    writeStore(store);
  };

  return (key) => {
    const now = Date.now();
    const entry = cache.get(key);
    let count = 0;
    let resetAt = now + windowMs;

    if (entry && now <= entry.resetAt) {
      count = entry.count;
      resetAt = entry.resetAt;
    }

    if (count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        retryAfterMs: Math.max(0, resetAt - now),
      };
    }

    count += 1;
    cache.set(key, { count, resetAt });
    sync();

    return {
      allowed: true,
      remaining: limit - count,
      retryAfterMs: Math.max(0, resetAt - now),
    };
  };
};
