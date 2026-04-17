import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Lazily initialized so the module can be imported at build time without
// crashing when NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are absent.
let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Supabase env vars are not configured (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)");
  }
  _client = createClient(url, serviceKey, { auth: { persistSession: false } });
  return _client;
}

// Convenience alias used throughout the codebase
export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    return (getSupabase() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export interface Review {
  id: string;
  location_id: string;
  author_name: string;
  rating: number;
  body: string;
  approved: boolean;
  created_at: string;
  photos?: Photo[];
}

export interface Photo {
  id: string;
  location_id: string;
  review_id: string;
  storage_path: string;
  approved: boolean;
  created_at: string;
}
