"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import type { BikeRoute, TrailParking } from "@/lib/data/routes";
import type { GeoJSON } from "geojson";

interface SingleRouteMapClientProps {
  route: BikeRoute;
  geometry: GeoJSON.LineString;
  parking: TrailParking[];
}

// Prevent Leaflet marker icon issues
if (typeof window !== "undefined") {
  const iconDefault = L.Icon.Default.prototype as unknown as Record<string, unknown>;
  delete iconDefault._getIconUrl;
  type IconOptions = {
    iconRetinaUrl: string;
    iconUrl: string;
    shadowUrl: string;
  };
  const options: IconOptions = {
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  };
  L.Icon.Default.mergeOptions(options);
}

export function SingleRouteMapClient({ route, geometry, parking }: SingleRouteMapClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Layer[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    // Initialize map centered on PEI
    mapRef.current = L.map(containerRef.current).setView([46.2382, -63.1311], 9);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 16,
    }).addTo(mapRef.current);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current || !geometry) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Route color
    const color = route.type === "main" ? "#3A8C2F" : "#7DC832";

    // Convert GeoJSON coordinates [lng, lat] to Leaflet [lat, lng]
    const routeCoords = geometry.coordinates.map(([lng, lat]) => [lat, lng] as [number, number]);

    if (routeCoords.length < 2) return;

    // Draw route polyline
    const polyline = L.polyline(routeCoords, {
      color,
      weight: route.type === "main" ? 4 : 3,
      opacity: 0.9,
      dashArray: route.type === "branch" ? "5, 5" : undefined,
    }).addTo(mapRef.current);

    markersRef.current.push(polyline);

    // Start marker (green)
    const startMarker = L.circleMarker([route.startPoint.lat, route.startPoint.lng], {
      radius: 8,
      fillColor: "#3A8C2F",
      fillOpacity: 1,
      stroke: true,
      color: "white",
      weight: 2,
    })
      .addTo(mapRef.current)
      .bindPopup(`<strong>${route.startPoint.name}</strong><br/>${route.name}`);

    markersRef.current.push(startMarker);

    // End marker (orange/sun)
    const endMarker = L.circleMarker([route.endPoint.lat, route.endPoint.lng], {
      radius: 8,
      fillColor: "#F5A623",
      fillOpacity: 1,
      stroke: true,
      color: "white",
      weight: 2,
    })
      .addTo(mapRef.current)
      .bindPopup(`<strong>${route.endPoint.name}</strong><br/>${route.name}`);

    markersRef.current.push(endMarker);

    // Parking markers (up to 5 nearest)
    const nearestParking = parking.slice(0, 5);
    nearestParking.forEach((lot) => {
      const parkingIcon = L.divIcon({
        html: `<div style="
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          background-color: #4B9FD8;
          border-radius: 50%;
          color: white;
          font-weight: bold;
          font-size: 14px;
        ">P</div>`,
        iconSize: [32, 32],
        className: "",
      });

      const parkingMarker = L.marker([lot.lat, lot.lng], { icon: parkingIcon })
        .addTo(mapRef.current!)
        .bindPopup(`<strong>${lot.name}</strong><br/>${lot.address}`);

      markersRef.current.push(parkingMarker);
    });

    // Auto-zoom to route bounds
    try {
      const bounds = polyline.getBounds();
      if (bounds.isValid()) {
        mapRef.current.fitBounds(bounds, { padding: [40, 40] });
      } else {
        // Defensive fallback if bounds calculation fails
        mapRef.current.setView([route.startPoint.lat, route.startPoint.lng], 12);
      }
    } catch {
      // Fallback if getBounds throws
      mapRef.current.setView([route.startPoint.lat, route.startPoint.lng], 12);
    }
  }, [route, geometry, parking]);

  return <div ref={containerRef} className="h-[500px] rounded-2xl border border-border overflow-hidden shadow-sm" />;
}
