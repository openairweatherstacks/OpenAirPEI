import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb } from "@/lib/db";
import { photos, reviews } from "@/lib/db/schema";

const ADMIN_KEY = process.env.OPENAIR_ADMIN_KEY;

function parseId(raw: unknown): number | null {
  if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) {
    return raw;
  }
  if (typeof raw === "string" && raw.trim() !== "") {
    const n = Number(raw);
    if (Number.isFinite(n) && n > 0) {
      return n;
    }
  }
  return null;
}

// POST /api/reviews/approve  { id, type: "review" | "photo" }
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!ADMIN_KEY || authHeader !== `Bearer ${ADMIN_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as { id?: unknown; type?: string };
  const id = parseId(body.id);
  if (id === null) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const type = body.type === "photo" ? "photo" : "review";

  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  try {
    const db = getDb();
    if (type === "photo") {
      await db.update(photos).set({ approved: true }).where(eq(photos.id, id));
    } else {
      await db.update(reviews).set({ approved: true }).where(eq(reviews.id, id));
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
