import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

import { findNearbyRoutes } from "@/lib/routes";
import { scoreRoute } from "@/lib/score";
import type { WeatherSnapshot } from "@/lib/types";

interface NearbyRoutesProps {
  lat: number;
  lng: number;
  weather: WeatherSnapshot;
  maxDistance?: number;
}

export function NearbyRoutes({
  lat,
  lng,
  weather,
  maxDistance = 20,
}: NearbyRoutesProps) {
  const nearby = findNearbyRoutes(lat, lng, maxDistance);

  if (nearby.length === 0) {
    return null;
  }

  const routeScore = scoreRoute(weather);

  return (
    <section className="space-y-4">
      <div>
        <p className="eyebrow mb-2">Cycling</p>
        <h2 className="section-title text-2xl">Nearby bike routes</h2>
        <p className="section-copy mt-2">
          {nearby.length} route{nearby.length !== 1 ? "s" : ""} within {maxDistance} km
        </p>
      </div>

      <div className="space-y-3">
        {nearby.map(({ route, distanceToStart, distanceToEnd, nearestAccess }) => {
          const nearestDist = Math.min(distanceToStart, distanceToEnd);
          const accessPoint = nearestAccess === "start" ? route.startPoint : route.endPoint;

          return (
            <Link
              key={route.id}
              href="/routes"
              className="group overflow-hidden rounded-xl border border-border bg-white p-4 hover:border-forest-light hover:shadow-sm transition"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wide text-forest">
                      {route.type === "main" ? "Main Trail" : "Branch"}
                    </span>
                    {route.letterCode && (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-forest text-xs font-bold text-white">
                        {route.letterCode}
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-text-primary">{route.name}</p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className="text-xs text-text-muted">
                      <MapPin className="inline h-3 w-3 mr-1" />
                      {nearestDist.toFixed(1)} km to {accessPoint.name}
                    </span>
                    <span className="text-xs text-text-muted">
                      {route.distance} km total
                    </span>
                    <span className="text-xs text-text-muted">
                      {route.difficulty}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0 text-right">
                  <p className="text-sm font-semibold text-forest">{routeScore.score}/100</p>
                  <p className="text-xs text-text-muted">{routeScore.status}</p>
                  <ArrowRight className="mt-2 h-4 w-4 text-forest opacity-0 group-hover:opacity-100 transition" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="text-center">
        <Link
          href="/routes"
          className="inline-flex items-center gap-2 text-sm font-medium text-forest hover:text-forest-deep"
        >
          View all routes <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
