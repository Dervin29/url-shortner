import { supabase } from "./supabase";

// get all urls
export async function getUrls(user_id) {
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
  const { data, error } = await supabase.from("urls").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Unable to delete Url");
  }

  return data;
}

// bulk delete urls
export async function deleteUrls(ids) {
  const { data, error } = await supabase.from("urls").delete().in("id", ids);

  if (error) {
    console.error(error);
    throw new Error("Unable to delete selected URLs");
  }

  return data;
}
