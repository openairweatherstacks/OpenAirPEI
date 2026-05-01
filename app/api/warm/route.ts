import { getAllLocationConditions } from "@/lib/environment";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const secret = new URL(request.url).searchParams.get("secret");

  if (secret !== process.env.OPENAIR_ADMIN_KEY) {
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
