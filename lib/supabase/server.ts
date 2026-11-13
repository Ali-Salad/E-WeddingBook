import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { isSupabaseConfigured } from "./client";

export function getSupabaseServerClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  // Prefer service role key on server if available, otherwise use anon key
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createClient<Database>(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
