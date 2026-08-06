import { supabase } from "./supabase";
import { createRateLimiter, getClientKey, retryHint } from "@/lib/rateLimit";
import { rateLimitConfig } from "@/config/rateLimits";

// Rate-limit tiers: public reads (short-link redirect) get moderate limits;
// authenticated CRUD actions get loose per-user limits. Thresholds come from
// rateLimitConfig, not hardcoded here.
const publicLimiter = createRateLimiter({
  ...rateLimitConfig.public,
  persist: true,
});
const userLimiter = createRateLimiter({
  ...rateLimitConfig.user,
  persist: true,
});

const guard = (check) => {
  if (!check.allowed) {
    throw new Error(`Too many requests.${retryHint(check.retryAfterMs)}`);
  }
};

// Per-user key when the caller provides a user id, otherwise fall back to the
// per-browser key (these endpoints all sit behind auth walls anyway).
const scope = (user_id) => user_id || getClientKey();

// get all urls
export async function getUrls(user_id) {
  guard(userLimiter(`urls:list:${scope(user_id)}`));

  let { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    console.error(error);
    throw new Error("Unable to load URLs");
  }

  return data;
}

// get single url
export async function getUrl({ id, user_id }) {
  guard(userLimiter(`urls:get:${scope(user_id)}`));

  const { data, error } = await supabase
    .from("urls")
    .select("*")
    .eq("id", id)
    .eq("user_id", user_id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("Short Url not found");
  }

  return data;
}

// get long url
export async function getLongUrl(id) {
  guard(publicLimiter(`redirect:${getClientKey()}`));

  let { data: shortLinkData, error: shortLinkError } = await supabase
    .from("urls")
    .select("id, original_url")
    .or(`short_url.eq.${id},custom_url.eq.${id}`)
    .single();

  if (shortLinkError && shortLinkError.code !== "PGRST116") {
    console.error("Error fetching short link:", shortLinkError);
    return;
  }

  return shortLinkData;
}

// create url
export async function createUrl(
  { title, longUrl, customUrl, user_id },
  qrcode,
) {
  guard(userLimiter(`urls:create:${scope(user_id)}`));

  const short_url = Math.random().toString(36).substr(2, 6);
  const fileName = `qr-${short_url}`;

  const { error: storageError } = await supabase.storage
    .from("qrs")
    .upload(fileName, qrcode);

  if (storageError) throw new Error(storageError.message);

  const {
    data: { publicUrl },
    error: publicUrlError,
  } = supabase.storage.from("qrs").getPublicUrl(fileName);

  if (publicUrlError) throw new Error(publicUrlError.message);

  const qr = publicUrl;

  const { data, error } = await supabase
    .from("urls")
    .insert([
      {
        title,
        user_id,
        original_url: longUrl,
        custom_url: customUrl || null,
        short_url,
        qr,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error creating short URL");
  }

  return data;
}

// update url
export async function updateUrl(id, updates) {
  guard(userLimiter(`urls:update:${scope()}`));

  const { data, error } = await supabase
    .from("urls")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    throw new Error("Unable to update URL");
  }

  return data;
}

// delete url
export async function deleteUrl(id) {
  guard(userLimiter(`urls:delete:${scope()}`));

  const { data, error } = await supabase
    .from("urls")
    .delete()
    .eq("id", id)
    .select();

  if (error) {
    console.error(error);
    throw new Error("Unable to delete Url");
  }

  return data;
}

// bulk delete urls
export async function deleteUrls(ids) {
  guard(userLimiter(`urls:bulk-delete:${scope()}`));

  const { data, error } = await supabase
    .from("urls")
    .delete()
    .in("id", ids)
    .select();

  if (error) {
    console.error(error);
    throw new Error("Unable to delete selected URLs");
  }

  return data;
}
