import { NextResponse } from "next/server";
import { getTempestStationHistory } from "@/lib/tempest";

export const revalidate = 900; // 15 minutes

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = Math.min(90, Math.max(7, Number(searchParams.get("days") ?? 90)));

  const history = await getTempestStationHistory(days);

  if (!history.length) {
    return NextResponse.json({ error: "No Tempest history available" }, { status: 503 });
  }

  return NextResponse.json({ days, count: history.length, history });
}
