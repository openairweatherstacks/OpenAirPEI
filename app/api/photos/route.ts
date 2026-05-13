import { NextResponse } from "next/server";

import { uploadReviewPhoto } from "@/lib/blob";
import { getDb } from "@/lib/db";
import { photos, reviews } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

// POST /api/photos  (multipart form: reviewId, locationId, file)
export async function POST(request: Request) {
  const form = await request.formData();
  const reviewIdRaw = form.get("reviewId");
  const locationId = form.get("locationId") as string;
  const file = form.get("file") as File | null;

  const reviewIdStr = typeof reviewIdRaw === "string" ? reviewIdRaw : "";
  const reviewId = Number(reviewIdStr);
  if (!reviewIdStr || !Number.isFinite(reviewId) || reviewId <= 0) {
    return NextResponse.json({ error: "Invalid reviewId" }, { status: 400 });
  }

  if (!locationId || !file) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Only JPEG, PNG and WebP allowed" }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "File must be under 5MB" }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const db = getDb();
    const [review] = await db
      .select({ id: reviews.id })
      .from(reviews)
      .where(eq(reviews.id, reviewId))
      .limit(1);

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    const ext = file.name.split(".").pop() ?? "jpg";
    const pathname = `${locationId}/${reviewId}/${Date.now()}.${ext}`;
    const { url } = await uploadReviewPhoto(file, pathname);

    await db.insert(photos).values({
      reviewId,
      locationId,
      storagePath: url,
      approved: false,
    });

    return NextResponse.json({ success: true, path: url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
