import type { BikeRoute, TrailParking } from "@/lib/data/routes";
import { ALL_CONFEDERATION_ROUTES, TRAIL_PARKING } from "@/lib/data/routes";

// Haversine formula to calculate distance between two points
export function haversineDistance(
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

// Find parking locations near a route
export function findParkingNearRoute(
  route: BikeRoute,
  maxDistanceKm: number = 10
): TrailParking[] {
  return TRAIL_PARKING.filter((lot) => {
    const distToStart = haversineDistance(
      lot.lat,
      lot.lng,
      route.startPoint.lat,
      route.startPoint.lng
    );
    const distToEnd = haversineDistance(
      lot.lat,
      lot.lng,
      route.endPoint.lat,
      route.endPoint.lng
    );
    return Math.min(distToStart, distToEnd) <= maxDistanceKm;
  }).sort((a, b) => {
    const minDistA = Math.min(
      haversineDistance(a.lat, a.lng, route.startPoint.lat, route.startPoint.lng),
      haversineDistance(a.lat, a.lng, route.endPoint.lat, route.endPoint.lng)
    );
    const minDistB = Math.min(
      haversineDistance(b.lat, b.lng, route.startPoint.lat, route.startPoint.lng),
      haversineDistance(b.lat, b.lng, route.endPoint.lat, route.endPoint.lng)
    );
    return minDistA - minDistB;
  });
}
