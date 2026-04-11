import { NextResponse } from "next/server";

import { getAllLocationConditions, getLocationConditions } from "@/lib/environment";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locationId = searchParams.get("locationId");

  if (locationId) {
    const entry = await getLocationConditions(locationId);
    if (!entry) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 });
    }

    return NextResponse.json({
      location: entry.location,
      tide: entry.tide,
    });
  }

  const locations = await getAllLocationConditions();
  return NextResponse.json(
    locations.map((entry) => ({
      location: entry.location,
      tide: entry.tide,
    })),
  );
}
