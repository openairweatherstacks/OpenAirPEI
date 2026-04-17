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
    tagline: "PEI's most iconic red sand beach — warm Gulf water, dunes, and Anne of Green Gables country.",
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
    tagline: "The birthplace of Canada — a lively harbour waterfront with restaurants, galleries, and ocean views.",
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
    tagline: "A rare parabolic dune system in PEI National Park — quieter than Cavendish, wilder than anywhere else.",
    lat: 46.4467,
    lng: -62.6889,
    type: "park",
    nearestStation: PEI_STATIONS.eastPoint,
    activities: ["hiking", "birdwatching", "photography"],
    icon: "🌿",
  },
  {
    id: "confederation-trail",
    name: "Confederation Trail — Kensington",
    nameFr: "Sentier de la Confédération — Kensington",
    tagline: "450 km of flat, car-free trail across the whole island — the best cycling in Atlantic Canada.",
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
    nameFr: "Pont de la Confédération",
    tagline: "The longest bridge over ice-covered water in the world — 12.9 km connecting PEI to New Brunswick.",
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
    tagline: "Charlottetown's green heart — ocean-view walking paths, a beach, and the best picnic spots in the city.",
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
    tagline: "The Singing Sands — squeaky quartz beach on the east end of the island, far from the tourist crowds.",
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
    tagline: "The windswept tip of the island — whale sightings, wind turbines, and the longest natural rock reef in North America.",
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
    tagline: "PEI's main gateway — check wind and visibility before you fly or pick someone up.",
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

// DFO/MEDS ocean buoys — free, no API key
// C44137 = Northumberland Strait (south shore), C44150 = Gulf of St. Lawrence (north shore)
export const BEACH_BUOYS: Record<string, string> = {
  cavendish: "C44150",
  "basin-head": "C44150",
  charlottetown: "C44137",
  "victoria-park": "C44137",
};

export const CACHE_DURATIONS = {
  currentConditions: 10 * 60,
  aiSummary: 15 * 60,
  tides: 60 * 60,
  alerts: 5 * 60,
  radar: 6 * 60,
  aqhi: 10 * 60,
};
