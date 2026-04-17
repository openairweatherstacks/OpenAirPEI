import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

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
