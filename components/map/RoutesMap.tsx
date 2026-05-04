"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import type { BikeRoute } from "@/lib/data/routes";

interface RoutesMapProps {
  routes: BikeRoute[];
  activeRouteId?: string;
}

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export function RoutesMap({ routes, activeRouteId }: RoutesMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Layer[]>([]);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

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
    if (!mapRef.current) return;

    markersRef.current.forEach((layer) => layer.remove());
    markersRef.current = [];

    const getColor = (route: BikeRoute) => {
      if (route.type === "main") return "#3A8C2F";
      return "#7DC832";
    };

    routes.forEach((route) => {
      const color = getColor(route);
      const isActive = route.id === activeRouteId;

      const startMarker = L.circleMarker([route.startPoint.lat, route.startPoint.lng], {
        radius: isActive ? 8 : 6,
        fillColor: color,
        fillOpacity: 1,
        stroke: true,
        color: "white",
        weight: 2,
      })
        .addTo(mapRef.current!)
        .bindPopup(`<strong>${route.startPoint.name}</strong><br/>${route.name}`);

      markersRef.current.push(startMarker);

      const endMarker = L.circleMarker([route.endPoint.lat, route.endPoint.lng], {
        radius: isActive ? 8 : 6,
        fillColor: color,
        fillOpacity: 1,
        stroke: true,
        color: "white",
        weight: 2,
      })
        .addTo(mapRef.current!)
        .bindPopup(`<strong>${route.endPoint.name}</strong><br/>${route.name}`);

      markersRef.current.push(endMarker);

      const polyline = L.polyline(
        [
          [route.startPoint.lat, route.startPoint.lng],
          [route.endPoint.lat, route.endPoint.lng],
        ],
        {
          color,
          weight: isActive ? 4 : 2,
          opacity: isActive ? 0.9 : 0.6,
          dashArray: route.type === "branch" ? "5, 5" : undefined,
        },
      ).addTo(mapRef.current!);

      markersRef.current.push(polyline);
    });
  }, [routes, activeRouteId]);

  return (
    <div
      ref={containerRef}
      className="h-[400px] rounded-2xl border border-border overflow-hidden shadow-sm"
    />
  );
}
