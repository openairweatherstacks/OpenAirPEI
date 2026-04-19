"use client";

import { useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { CloudRain } from "lucide-react";

import { LocationMarker } from "@/components/map/LocationMarker";
import { RadarOverlay } from "@/components/map/RadarOverlay";
import { MAP_CONFIG } from "@/lib/data/locations";
import type { LocationConditions } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function PEIMapClient({
  locations,
  focusId,
}: {
  locations: LocationConditions[];
  focusId?: string;
}) {
  const [radarOn, setRadarOn] = useState(true);

  const focus = locations.find((location) => location.location.id === focusId);
  const center = focus ? ([focus.location.lat, focus.location.lng] as [number, number]) : MAP_CONFIG.center;
  const zoom = focus ? 11 : MAP_CONFIG.zoom;

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white shadow-[0_28px_90px_rgba(58,140,47,0.12)]">
      <MapContainer
        center={center}
        zoom={zoom}
        minZoom={MAP_CONFIG.minZoom}
        maxZoom={MAP_CONFIG.maxZoom}
        scrollWheelZoom
        className="h-[420px] w-full"
      >
        <TileLayer attribution={MAP_CONFIG.attribution} url={MAP_CONFIG.tileUrl} />
        <RadarOverlay visible={radarOn} />
        {locations.map((entry) => (
          <LocationMarker key={entry.location.id} entry={entry} />
        ))}
      </MapContainer>

      {/* Radar toggle — sits above the map, top-right */}
      <button
        onClick={() => setRadarOn((prev) => !prev)}
        className={cn(
          "absolute right-3 top-3 z-[1000] flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold shadow-md transition",
          radarOn
            ? "bg-forest-deep text-white"
            : "bg-white/90 text-text-secondary backdrop-blur hover:text-forest"
        )}
      >
        <CloudRain className="h-3.5 w-3.5" />
        {radarOn ? "Radar on" : "Radar off"}
      </button>

      {/* Live indicator */}
      {radarOn && (
        <div className="absolute bottom-3 left-3 z-[1000] flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-text-secondary shadow backdrop-blur">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-forest" />
          Live radar · EC GeoMet · updates every 6 min
        </div>
      )}
    </div>
  );
}
