import { UAParser } from "ua-parser-js";
import { supabase } from "./supabase";

// export async function getClicks() {
//   let {data, error} = await supabase.from("clicks").select("*");

//   if (error) {
//     console.error(error);
//     throw new Error("Unable to load Stats");
//   }

//   return data;
// }

export async function getClicksForUrls(urlIds) {
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
