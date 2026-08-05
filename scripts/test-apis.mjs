// Read-only API smoke test against the live Supabase project.
// Run with: node --env-file=.env scripts/test-apis.mjs
// Never mutates data: no inserts, no uploads, no signups.
import { createClient } from "@supabase/supabase-js";

const url = process.env.VITE_SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const results = [];
const record = (name, ok, detail) => {
  results.push({ name, ok, detail });
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? `  -> ${detail}` : ""}`);
};

if (!url || !key) {
  console.error("Missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key);
const anonHeaders = { apikey: key, Authorization: `Bearer ${key}` };

const run = async () => {
  // 1. Auth service health
  try {
    const res = await fetch(`${url}/auth/v1/health`, { headers: anonHeaders });
    const body = await res.json();
    record("auth health endpoint", res.ok, `${res.status} ${JSON.stringify(body)}`);
  } catch (e) {
    record("auth health endpoint", false, e.message);
  }

  // 2. REST gateway reachable (root usually 401/404 - reachability is what matters)
  try {
    const res = await fetch(`${url}/rest/v1/`, { headers: anonHeaders });
    record("REST gateway reachable", res.status < 500, `HTTP ${res.status}`);
  } catch (e) {
    record("REST gateway reachable", false, e.message);
  }

  // 3. Public redirect path: anon read by short/custom url.
  // PGRST116 = no rows (anon SELECT allowed -> redirect works).
  // 42501   = permission denied (RLS blocks anon -> public redirect BROKEN).
  try {
    const { data, error } = await supabase
      .from("urls")
      .select("id, original_url")
      .or("short_url.eq.__trimrr_missing__,custom_url.eq.__trimrr_missing__")
      .single();
    if (error && error.code === "PGRST116") {
      record("anon read urls by code (redirect path)", true, "anon SELECT allowed (no row matched)");
    } else if (error) {
      record("anon read urls by code (redirect path)", false, `${error.code}: ${error.message}`);
    } else {
      record("anon read urls by code (redirect path)", true, "unexpected match for dummy code");
    }
  } catch (e) {
    record("anon read urls by code (redirect path)", false, e.message);
  }

  // 3b. Anon read of urls with a filter - does RLS allow anon read at all?
  try {
    const { data, error } = await supabase.from("urls").select("id, short_url").limit(5);
    if (error) {
      record("anon SELECT urls (list)", false, `${error.code}: ${error.message}`);
    } else {
      record("anon SELECT urls (list)", true, `${data.length} row(s) visible to anon`);
    }
  } catch (e) {
    record("anon SELECT urls (list)", false, e.message);
  }

  // 4. Anon read of clicks - informational (should be hidden by RLS)
  try {
    const { data, error } = await supabase.from("clicks").select("id").limit(5);
    if (error) {
      record("anon SELECT clicks (should be blocked)", true, `${error.code}: ${error.message}`);
    } else {
      record("anon SELECT clicks (should be blocked)", false, `UNEXPECTED anon access (${data.length} rows)`);
    }
  } catch (e) {
    record("anon SELECT clicks (should be blocked)", true, e.message);
  }

  // 4b. Table row counts as anon (head-only; exact count, no row bodies)
  for (const table of ["urls", "clicks"]) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select("*", { count: "exact", head: true });
      record(
        `anon row count: '${table}'`,
        !error,
        error ? `${error.code}: ${error.message}` : `${count ?? 0} row(s)`,
      );
    } catch (e) {
      record(`anon row count: '${table}'`, false, e.message);
    }
  }

  // 5. Storage buckets exist? GET a nonexistent object: 404 = bucket exists
  for (const bucket of ["qrs", "profile_pic"]) {
    try {
      const res = await fetch(
        `${url}/storage/v1/object/public/${bucket}/__missing_trimrr__.png`,
        { headers: anonHeaders },
      );
      const bodyText = await res.text();
      const bucketMissing = /bucket not found|does not exist|No such bucket/i.test(bodyText);
      record(
        `storage bucket '${bucket}'`,
        !bucketMissing,
        bucketMissing
          ? `HTTP ${res.status}: ${bodyText.slice(0, 120)}`
          : `HTTP ${res.status}: ${bodyText.slice(0, 120) || "(empty body)"}`,
      );
    } catch (e) {
      record(`storage bucket '${bucket}'`, false, e.message);
    }
  }

  // 6. Auth sign-in endpoint reachable (fake creds; nothing created)
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: "no-such-user@trimrr-test.invalid",
      password: "definitely-wrong",
    });
    record(
      "signInWithPassword endpoint",
      !!error && /invalid/i.test(error.message),
      error ? `${error.status || "?"}: ${error.message}` : "unexpectedly succeeded",
    );
  } catch (e) {
    record("signInWithPassword endpoint", false, e.message);
  }

  // 7. Auth settings (signup on/off, autoconfirm, rate limits)
  try {
    const res = await fetch(`${url}/auth/v1/settings`, { headers: anonHeaders });
    const body = await res.json();
    record(
      "auth/settings",
      res.ok,
      res.ok
        ? `external:${JSON.stringify(body?.external ?? "n/a")}, disable_signup:${body?.disable_signup ?? "n/a"}, autoconfirm:${body?.autoconfirm ?? "n/a"}, rateLimits:${JSON.stringify(body?.rateLimits ?? "n/a")}`
        : `HTTP ${res.status}`,
    );
  } catch (e) {
    record("auth/settings", false, e.message);
  }

  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n${results.length - failed}/${results.length} checks passed`);
  process.exit(failed ? 1 : 0);
};

run();
