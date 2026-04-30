import { createClient } from "@supabase/supabase-js";

export const NOTES_TABLE = process.env.SUPABASE_TABLE_NAME || "posts";

export const getSupabaseServer = () => {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
    },
  });
};
