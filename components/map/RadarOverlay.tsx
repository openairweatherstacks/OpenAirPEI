"use client";

import { WMSTileLayer } from "react-leaflet";

// Environment Canada GeoMet — free, no API key, updates every 6 minutes
export function RadarOverlay({ visible = true }: { visible?: boolean }) {
  if (!visible) return null;

  return (
    <WMSTileLayer
      url="https://geo.weather.gc.ca/geomet"
      layers="RADAR_1KM_RRAI"
      format="image/png"
      transparent
      opacity={0.6}
      version="1.3.0"
      attribution="© Environment and Climate Change Canada"
    />
  );
}
