"use client";

import Link from "next/link";
import { CircleMarker, Popup } from "react-leaflet";

import type { LocationConditions } from "@/lib/types";

const SCORE_COLORS = {
  Excellent: "#3A8C2F",
  Good: "#7DC832",
  Fair: "#F5A623",
  "Stay Inside": "#C0392B",
} as const;

export function LocationMarker({ entry }: { entry: LocationConditions }) {
  return (
    <CircleMarker
      center={[entry.location.lat, entry.location.lng]}
      radius={12}
      pathOptions={{
        color: "#FFFFFF",
        weight: 3,
        fillColor: SCORE_COLORS[entry.conditions.score],
        fillOpacity: 0.95,
      }}
    >
      <Popup>
        <div className="space-y-2 text-sm">
          <p className="font-semibold">{entry.location.name}</p>
          <p>{entry.conditions.headline}</p>
          <p>
            {entry.weather.temperature}°C · Wind {entry.weather.windSpeed} km/h {entry.weather.windDirection}
          </p>
          <div className="flex gap-2 pt-1">
            <Link className="font-semibold text-forest underline" href={`/location/${entry.location.id}`}>
              Full conditions
            </Link>
            <span className="text-gray-300">·</span>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${entry.location.lat},${entry.location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-sun-deep underline"
            >
              Get directions
            </a>
          </div>
        </div>
      </Popup>
    </CircleMarker>
  );
}
