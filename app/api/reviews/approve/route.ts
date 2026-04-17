import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const ADMIN_KEY = process.env.OPENAIR_ADMIN_KEY;

// POST /api/reviews/approve  { id, type: "review" | "photo" }
export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!ADMIN_KEY || authHeader !== `Bearer ${ADMIN_KEY}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id, type } = await request.json() as { id: string; type: "review" | "photo" };
  const table = type === "photo" ? "photos" : "reviews";

  const { error } = await supabase
    .from(table)
    .update({ approved: true })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
