"use client";

import dynamic from "next/dynamic";
import type { BikeRoute, TrailParking } from "@/lib/data/routes";
import type { GeoJSON } from "geojson";

const SingleRouteMapClient = dynamic(
  () => import("@/components/map/SingleRouteMapClient").then((mod) => ({ default: mod.SingleRouteMapClient })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[500px] w-full items-center justify-center rounded-2xl border border-border bg-white/80 text-sm font-medium text-text-secondary">
        Loading route map...
      </div>
    ),
  }
);

interface SingleRouteMapProps {
  route: BikeRoute;
  geometry: GeoJSON.LineString;
  parking: TrailParking[];
}

export function SingleRouteMap({ route, geometry, parking }: SingleRouteMapProps) {
  return <SingleRouteMapClient route={route} geometry={geometry} parking={parking} />;
}
