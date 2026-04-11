import type { Location } from "@/lib/types";

export const PEI_STATIONS = {
  charlottetown: "8300300",
  summerside: "8300200",
  northRustico: "8301100",
  eastPoint: "8300500",
  borden: "8300100",
} as const;

export const PEI_AQHI = {
  charlottetown: "PEI-001",
  summerside: "PEI-002",
  wellington: "PEI-003",
} as const;

export const PEI_TIDE_STATIONS = {
  charlottetown: "5cebf1e23d0f4a073c4bbffa",
  summerside: "5cebf1de3d0f4a073c4bba15",
  georgetownHarbour: "5cebf1e43d0f4a073c4bc05c",
} as const;

export const PEI_LOCATIONS: Location[] = [
  {
    id: "cavendish",
    name: "Cavendish Beach",
    nameFr: "Plage de Cavendish",
    lat: 46.4943,
    lng: -63.3971,
    type: "beach",
    nearestStation: PEI_STATIONS.northRustico,
    activities: ["swimming", "cycling", "hiking"],
    icon: "🏖️",
  },
  {
    id: "charlottetown",
    name: "Charlottetown Waterfront",
    nameFr: "Front de mer de Charlottetown",
    lat: 46.2382,
    lng: -63.1311,
    type: "city",
    nearestStation: PEI_STATIONS.charlottetown,
    activities: ["walking", "cycling", "dining"],
    icon: "🏙️",
  },
  {
    id: "greenwich",
    name: "Greenwich Dunes",
    nameFr: "Dunes de Greenwich",
    lat: 46.4467,
    lng: -62.6889,
    type: "park",
    nearestStation: PEI_STATIONS.eastPoint,
    activities: ["hiking", "birdwatching", "photography"],
    icon: "🌿",
  },
  {
    id: "confederation-trail",
    name: "Confederation Trail - Kensington",
    nameFr: "Sentier de la Confederation - Kensington",
    lat: 46.4547,
    lng: -63.6343,
    type: "trail",
    nearestStation: PEI_STATIONS.summerside,
    activities: ["cycling", "walking", "running"],
    icon: "🚴",
  },
  {
    id: "confederation-bridge",
    name: "Confederation Bridge",
    nameFr: "Pont de la Confederation",
    lat: 46.15,
    lng: -63.7833,
    type: "bridge",
    nearestStation: PEI_STATIONS.borden,
    activities: ["driving", "motorcycling"],
    icon: "🌉",
  },
  {
    id: "victoria-park",
    name: "Victoria Park",
    nameFr: "Parc Victoria",
    lat: 46.231,
    lng: -63.12,
    type: "park",
    nearestStation: PEI_STATIONS.charlottetown,
    activities: ["walking", "picnic", "cycling"],
    icon: "🌳",
  },
  {
    id: "basin-head",
    name: "Basin Head (Singing Sands)",
    nameFr: "Basin Head (Sables chantants)",
    lat: 46.3589,
    lng: -62.0661,
    type: "beach",
    nearestStation: PEI_STATIONS.eastPoint,
    activities: ["swimming", "walking", "photography"],
    icon: "🎵",
  },
  {
    id: "north-cape",
    name: "North Cape",
    nameFr: "Cap-Nord",
    lat: 47.0583,
    lng: -63.9989,
    type: "landmark",
    nearestStation: PEI_STATIONS.summerside,
    activities: ["hiking", "whale-watching", "photography"],
    icon: "🐋",
  },
  {
    id: "charlottetown-airport",
    name: "Charlottetown Airport",
    nameFr: "Aéroport de Charlottetown",
    lat: 46.2900,
    lng: -63.1211,
    type: "airport",
    nearestStation: PEI_STATIONS.charlottetown,
    activities: ["flying", "driving", "travel-planning"],
    icon: "✈️",
  },
];

export const MAP_CONFIG = {
  center: [46.5107, -63.4168] as [number, number],
  zoom: 9,
  minZoom: 8,
  maxZoom: 14,
  tileUrl: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution: "© OpenStreetMap contributors",
};

export const RADAR_WMS = {
  url: "https://geo.weather.gc.ca/geomet",
  layers: "RADAR_RRAI_RATE",
  transparent: true,
  format: "image/png",
  opacity: 0.45,
};

export const CACHE_DURATIONS = {
  currentConditions: 10 * 60,
  aiSummary: 15 * 60,
  tides: 60 * 60,
  alerts: 5 * 60,
  radar: 6 * 60,
  aqhi: 10 * 60,
};
