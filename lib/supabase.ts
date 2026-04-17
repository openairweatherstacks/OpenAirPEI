import { createClient } from "@supabase/supabase-js";

// Fall back to placeholder strings at build time so createClient doesn't
// throw when env vars are absent. Actual API calls will fail at runtime
// if the vars are missing, but the build succeeds.
const url =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "placeholder-service-key";

// Server-only client — never exposed to the browser
export const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false },
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
