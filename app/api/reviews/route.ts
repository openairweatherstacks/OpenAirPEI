import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// GET /api/reviews?locationId=cavendish
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locationId = searchParams.get("locationId");

  if (!locationId) {
    return NextResponse.json({ error: "locationId required" }, { status: 400 });
  }

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select("*, photos(*)")
    .eq("location_id", locationId)
    .eq("approved", true)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(reviews);
}

// POST /api/reviews
export async function POST(request: Request) {
  const body = await request.json() as {
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

  const { data, error } = await supabase
    .from("reviews")
    .insert({
      location_id: locationId,
      author_name: authorName.trim(),
      rating,
      body: reviewBody.trim(),
      approved: false,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: data.id });
}
