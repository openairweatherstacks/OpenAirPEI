import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// POST /api/photos  (multipart form: reviewId, locationId, file)
export async function POST(request: Request) {
  const form = await request.formData();
  const reviewId = form.get("reviewId") as string;
  const locationId = form.get("locationId") as string;
  const file = form.get("file") as File | null;

  if (!reviewId || !locationId || !file) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG and WebP allowed" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File must be under 5MB" }, { status: 400 });
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${locationId}/${reviewId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("location-photos")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { error: dbError } = await supabase.from("photos").insert({
    location_id: locationId,
    review_id: reviewId,
    storage_path: path,
    approved: false,
  });

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, path });
}
