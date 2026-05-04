import type { BikeRoute } from "@/lib/data/routes";
import { ALL_CONFEDERATION_ROUTES } from "@/lib/data/routes";

// Haversine formula to calculate distance between two points
function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export interface NearbyRoute {
  route: BikeRoute;
  distanceToStart: number; // km to nearest access point
  distanceToEnd: number;
  nearestAccess: "start" | "end";
}

// Find routes within X km of a location
export function findNearbyRoutes(
  lat: number,
  lng: number,
  maxDistanceKm: number = 15,
): NearbyRoute[] {
  const nearby: NearbyRoute[] = [];

  ALL_CONFEDERATION_ROUTES.forEach((route) => {
    const distToStart = haversineDistance(lat, lng, route.startPoint.lat, route.startPoint.lng);
    const distToEnd = haversineDistance(lat, lng, route.endPoint.lat, route.endPoint.lng);
    const minDist = Math.min(distToStart, distToEnd);

    if (minDist <= maxDistanceKm) {
      nearby.push({
        route,
        distanceToStart: distToStart,
        distanceToEnd: distToEnd,
        nearestAccess: distToStart <= distToEnd ? "start" : "end",
      });
    }
  });

  return nearby.sort((a, b) => {
    const aMinDist = Math.min(a.distanceToStart, a.distanceToEnd);
    const bMinDist = Math.min(b.distanceToStart, b.distanceToEnd);
    return aMinDist - bMinDist;
  });
}

// Get the main trail (for quick access)
export function getMainTrail(): BikeRoute | undefined {
  return ALL_CONFEDERATION_ROUTES.find((r) => r.type === "main");
}

// Get all branches
export function getBranchRoutes(): BikeRoute[] {
  return ALL_CONFEDERATION_ROUTES.filter((r) => r.type === "branch");
}
