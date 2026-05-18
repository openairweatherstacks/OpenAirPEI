import { getAllLocationConditions } from "@/lib/environment";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");

  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const start = Date.now();
  const locations = await getAllLocationConditions();

  return Response.json({
    ok: true,
    warmed: locations.length,
    ms: Date.now() - start,
  });
}
