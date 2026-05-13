import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { photos, reviews } from "@/lib/db/schema";

type ReviewRow = typeof reviews.$inferSelect;
type PhotoRow = typeof photos.$inferSelect;

function toSnakeReview(r: ReviewRow & { photos: PhotoRow[] }) {
  return {
    id: String(r.id),
    location_id: r.locationId,
    author_name: r.authorName,
    rating: r.rating,
    body: r.body,
    approved: r.approved,
    created_at: r.createdAt,
    photos: r.photos.map((p) => ({
      id: String(p.id),
      location_id: p.locationId,
      review_id: String(p.reviewId),
      storage_path: p.storagePath,
      approved: p.approved,
      created_at: p.createdAt,
    })),
  };
}

// GET /api/reviews?locationId=cavendish
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locationId = searchParams.get("locationId");

  if (!locationId) {
    return NextResponse.json({ error: "locationId required" }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const db = getDb();
    const rows = await db.query.reviews.findMany({
      where: and(eq(reviews.locationId, locationId), eq(reviews.approved, true)),
      orderBy: [desc(reviews.createdAt)],
      with: {
        photos: {
          where: (p, { eq: eqFn }) => eqFn(p.approved, true),
        },
      },
    });
    return NextResponse.json(rows.map(toSnakeReview));
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST /api/reviews
export async function POST(request: Request) {
  const body = (await request.json()) as {
    locationId: string;
    authorName: string;
    rating: number;
    reviewBody: string;
  };

  const { locationId, authorName, rating, reviewBody } = body;

  if (!locationId || !authorName || !rating || !reviewBody) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1–5" }, { status: 400 });
  }

  if (reviewBody.trim().length < 10) {
    return NextResponse.json({ error: "Review is too short" }, { status: 400 });
  }

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const db = getDb();
    const [row] = await db
      .insert(reviews)
      .values({
        locationId,
        authorName: authorName.trim(),
        rating,
        body: reviewBody.trim(),
        approved: false,
      })
      .returning({ id: reviews.id });

    if (!row) {
      return NextResponse.json({ error: "Insert failed" }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: row.id });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
