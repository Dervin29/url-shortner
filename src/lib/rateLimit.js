// Fixed-window rate limiter with optional exponential backoff.
//
// Client-side only: it stops accidental/duplicate abuse (refresh spam, button
// mashing, signup storage spam) from the same browser. It is NOT a security
// boundary — real server-side enforcement belongs in Supabase Edge Functions
// or RLS.
//
// Exponential backoff (auth routes): when `backoffFactor > 1` is set, each
// further blocked attempt while the lockout is active grows the wait to
// `windowMs * factor^(level - 1)` (capped at `maxBackoffMs`). The counter
// resets once the wait elapses, so there is never a hard/permanent lockout.
const STORAGE_KEY = "trimrr-rate-limits";
const CLIENT_KEY_STORAGE = "trimrr-client-id";
const MAX_BACKOFF_LEVEL = 20;

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

// Stable id for the current browser. Client-side code cannot read its own IP,
// so this persistent per-device key stands in for the "per-IP" half of the
// auth route limits.
export const getClientKey = () => {
  try {
    let id = window.localStorage.getItem(CLIENT_KEY_STORAGE);
    if (!id) {
      id =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
      window.localStorage.setItem(CLIENT_KEY_STORAGE, id);
    }
    return id;
  } catch {
    return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  }
};

// Human-friendly "try again in Xs / Xm Ys" hint for rate-limit errors.
export const retryHint = (retryAfterMs) => {
  if (!retryAfterMs || retryAfterMs <= 0) return "";
  const totalSec = Math.ceil(retryAfterMs / 1000);
  if (totalSec < 60) return ` Please try again in ${totalSec}s.`;
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  return ` Please try again in ${minutes}m${seconds > 0 ? ` ${seconds}s` : ""}.`;
};

export const createRateLimiter = ({
  limit,
  windowMs,
  persist = false,
  backoffFactor = 0,
  maxBackoffMs = 0,
}) => {
  const cache = new Map();
  const hasBackoff = backoffFactor > 1;

  if (persist) {
    const stored = readStore();
    const now = Date.now();
    for (const [key, value] of Object.entries(stored)) {
      if (value && typeof value.resetAt === "number" && value.resetAt > now) {
        cache.set(key, {
          count: value.count || 0,
          resetAt: value.resetAt,
          level: value.level || 0,
        });
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

  const lockoutMs = (level) => {
    const cap = maxBackoffMs > 0 ? maxBackoffMs : windowMs * 1024;
    return Math.min(cap, windowMs * backoffFactor ** (level - 1));
  };

  return (key) => {
    const now = Date.now();
    const entry = cache.get(key);
    let count = 1;
    let resetAt = now + windowMs;
    let level = 0;

    if (entry && now < entry.resetAt) {
      count = entry.count + 1;
      resetAt = entry.resetAt;
      level = entry.level;
    }

    if (count > limit) {
      if (hasBackoff) {
        level = Math.min(level + 1, MAX_BACKOFF_LEVEL);
        resetAt = now + lockoutMs(level);
        cache.set(key, { count, resetAt, level });
        sync();
        return {
          allowed: false,
          remaining: 0,
          retryAfterMs: resetAt - now,
          isBackoff: true,
        };
      }

      cache.set(key, { count, resetAt, level });
      sync();
      return {
        allowed: false,
        remaining: 0,
        retryAfterMs: Math.max(0, resetAt - now),
        isBackoff: false,
      };
    }

    cache.set(key, { count, resetAt, level });
    sync();
    return {
      allowed: true,
      remaining: limit - count,
      retryAfterMs: Math.max(0, resetAt - now),
      isBackoff: false,
    };
  };
};
