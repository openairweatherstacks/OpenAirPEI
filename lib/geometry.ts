import { unstable_cache } from "next/cache";
import { fetchMainTrailGeometry, fetchBranchTrailGeometry } from "@/lib/osm";
import type { BikeRoute } from "@/lib/data/routes";
import type { GeoJSON } from "geojson";

const OSM_GEOMETRY_TTL = 60 * 60; // 1 hour

export const getMainTrailGeometry = unstable_cache(
  async (): Promise<GeoJSON.LineString | null> => {
    return fetchMainTrailGeometry();
  },
  ["main-trail-geometry"],
  { revalidate: OSM_GEOMETRY_TTL }
);

export const getBranchTrailGeometry = unstable_cache(
  async (
    routeId: string,
    startLat: number,
    startLng: number,
    endLat: number,
    endLng: number,
    nameHint: string
  ): Promise<GeoJSON.LineString | null> => {
    return fetchBranchTrailGeometry(routeId, startLat, startLng, endLat, endLng, nameHint);
  },
  ["branch-trail-geometry"],
  { revalidate: OSM_GEOMETRY_TTL }
);

export async function resolveRouteGeometry(route: BikeRoute): Promise<GeoJSON.LineString> {
  const osm =
    route.type === "main"
      ? await getMainTrailGeometry()
      : await getBranchTrailGeometry(
          route.id,
          route.startPoint.lat,
          route.startPoint.lng,
          route.endPoint.lat,
          route.endPoint.lng,
          route.name.split("—")[1]?.trim() || route.name
        );

  if (osm) return osm;

  // Fallback: two-point straight line
  return {
    type: "LineString",
    coordinates: [
      [route.startPoint.lng, route.startPoint.lat],
      [route.endPoint.lng, route.endPoint.lat],
    ],
  };
}
