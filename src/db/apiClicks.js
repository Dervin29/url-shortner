import { UAParser } from "ua-parser-js";
import { supabase } from "./supabase";
import { createRateLimiter, getClientKey, retryHint } from "@/lib/rateLimit";
import { rateLimitConfig } from "@/config/rateLimits";

// Public redirect writes a `clicks` row + calls ipapi.co on every hit, so it
// is the most abuse-prone surface. Guard it client-side: dedupe the same URL
// (refresh/preview spam) and cap total recordings per browser. Thresholds come
// from rateLimitConfig.
const urlClickLimiter = createRateLimiter({
  ...rateLimitConfig.clicks.perUrl,
  persist: true,
});
const sessionClickLimiter = createRateLimiter({
  ...rateLimitConfig.clicks.perSession,
  persist: true,
});

// Authenticated analytics reads get loose per-user limits.
const userLimiter = createRateLimiter({
  ...rateLimitConfig.user,
  persist: true,
});

const guard = (check) => {
  if (!check.allowed) {
    throw new Error(`Too many requests.${retryHint(check.retryAfterMs)}`);
  }
};

const scope = (user_id) => user_id || getClientKey();

export async function getClicksForUrls(urlIds) {
  guard(userLimiter(`clicks:list:${scope()}`));

  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .in("url_id", urlIds);

  if (error) {
    console.error("Error fetching clicks:", error);
    return null;
  }

  return data;
}

export async function getClicksForUrl(url_id) {
  guard(userLimiter(`clicks:get:${scope()}`));

  const { data, error } = await supabase
    .from("clicks")
    .select("*")
    .eq("url_id", url_id);

  if (error) {
    console.error(error);
    throw new Error("Unable to load Stats");
  }

  return data;
}

const parser = new UAParser();

export const storeClicks = async ({ id, originalUrl }) => {
  try {
    const urlCheck = urlClickLimiter(`click:${id}`);
    const sessionCheck = sessionClickLimiter("clicks");
    if (!urlCheck.allowed || !sessionCheck.allowed) {
      // Rate-limited: still redirect, just don't record this visit.
      return;
    }

    const res = parser.getResult();

    const device = res.type || "desktop";

    let city = null;
    let country = null;

    try {
      const response = await fetch("https://ipapi.co/json");

      if (response.ok) {
        const location = await response.json();
        city = location.city;
        country = location.country_name;
      }
    } catch (err) {
      console.log("Location unavailable", err);
    }

    await supabase.from("clicks").insert({
      url_id: id,
      city,
      country,
      device,
    });
  } catch (err) {
    console.error(err);
  } finally {
    window.location.href = originalUrl;
  }
};
