import type { GeoJSON } from "geojson";

export interface BikeRoute {
  id: string;
  name: string;
  nameFr: string;
  type: "main" | "branch";
  distance: number; // km
  elevation: string; // descriptive: "flat", "rolling", "hilly"
  trafficExposure: "none" | "low" | "moderate" | "high";
  surface: string; // "crushed stone", "paved", "mixed"
  difficulty: "easy" | "moderate" | "challenging";
  description: string;
  descriptionFr: string;
  activities: string[];
  startPoint: {
    name: string;
    lat: number;
    lng: number;
    km: number;
  };
  endPoint: {
    name: string;
    lat: number;
    lng: number;
    km: number;
  };
  letterCode?: string; // for branch trails (BC, C, LV, G, M, MH, S, WI)
  branches?: string[]; // IDs of connected branch trails
  geometry?: GeoJSON.LineString; // will be populated from OSM later
  parkingTrheads?: string[]; // IDs of nearby parking locations
  image?: string; // public image path
  icon?: string; // emoji or icon
}

export interface TrailParking {
  id: number;
  name: string;
  address: string;
  civic: number;
  lat: number;
  lng: number;
  trailSection?: string; // which trail section is nearest
}

export interface TrailPOI {
  id: string;
  name: string;
  nameFr?: string;
  type:
    | "parking"
    | "washroom"
    | "shelter"
    | "scenic-view"
    | "supplies"
    | "historic"
    | "museum"
    | "food"
    | "lighthouse"
    | "geocache";
  km?: number; // distance from trail start
  route?: string; // which route section
  lat: number;
  lng: number;
  description?: string;
}

// ── MAIN TRAIL ──────────────────────────────────────────────────────
export const CONFEDERATION_MAIN_TRAIL: BikeRoute = {
  id: "confederation-main-tignish-elmira",
  name: "Confederation Trail — Tip to Tip",
  nameFr: "Sentier de la Confédération — D'une pointe à l'autre",
  type: "main",
  distance: 273,
  elevation: "flat",
  trafficExposure: "none",
  surface: "crushed stone dust",
  difficulty: "easy",
  description:
    "The complete tip-to-tip trail from Tignish (west) to Elmira (east). Flat, well-maintained crushed stone surface suitable for all fitness levels and bike types. The trail spans PEI's full width with branch connections to coastal communities.",
  descriptionFr:
    "Le sentier complet d'une pointe à l'autre de Tignish (ouest) à Elmira (est). Surface de pierre concassée plate et bien entretenue, convient à tous les niveaux de forme physique et à tous les types de vélos. Le sentier s'étend sur toute la largeur de l'Î.-P.-É. avec des connexions aux communautés côtières.",
  activities: ["cycling", "walking", "running"],
  startPoint: {
    name: "Tignish",
    lat: 47.0622,
    lng: -63.9983,
    km: 0,
  },
  endPoint: {
    name: "Elmira",
    lat: 46.3875,
    lng: -62.0661,
    km: 273,
  },
  image: "/get-images/confederation-trail.jpg",
  icon: "🚴",
  branches: [
    "confederation-branch-emerald-borden",
    "confederation-branch-royalty-charlottetown",
    "confederation-branch-mtstewart-georgetown",
    "confederation-branch-mtstewart-lakverde",
    "confederation-branch-cardigan-montague",
    "confederation-branch-charlottetown-murrayharbour",
    "confederation-branch-woodislands",
    "confederation-branch-newharmony-souris",
  ],
};

// ── BRANCH TRAILS ──────────────────────────────────────────────────
export const CONFEDERATION_BRANCH_TRAILS: BikeRoute[] = [
  {
    id: "confederation-branch-emerald-borden",
    name: "Branch Trail — Emerald to Borden-Carleton",
    nameFr: "Sentier secondaire — Emerald à Borden-Carleton",
    type: "branch",
    distance: 18,
    elevation: "flat",
    trafficExposure: "none",
    surface: "crushed stone dust",
    difficulty: "easy",
    description:
      "Easy 18 km branch through farmland connecting the main trail to Borden-Carleton and the Confederation Bridge gateway. Access point to New Brunswick.",
    descriptionFr:
      "Facile embranchement de 18 km à travers les terres agricoles reliant le sentier principal à Borden-Carleton et la porte du pont de la Confédération.",
    activities: ["cycling", "walking", "commuting"],
    letterCode: "BC",
    startPoint: {
      name: "Emerald",
      lat: 46.3917,
      lng: -63.1917,
      km: 0,
    },
    endPoint: {
      name: "Borden-Carleton",
      lat: 46.1750,
      lng: -63.8083,
      km: 18,
    },
  },
  {
    id: "confederation-branch-royalty-charlottetown",
    name: "Branch Trail — Royalty to Charlottetown",
    nameFr: "Sentier secondaire — Royalty à Charlottetown",
    type: "branch",
    distance: 8,
    elevation: "flat",
    trafficExposure: "low",
    surface: "crushed stone + paved",
    difficulty: "easy",
    description:
      "Quick 8 km connection from Royalty Junction to downtown Charlottetown waterfront. Crosses the Hillsborough Bridge. Best for accessing restaurants, galleries, and city amenities.",
    descriptionFr:
      "Connexion rapide de 8 km de Royalty à Charlottetown. Traverse le pont Hillsborough. Idéal pour accéder aux restaurants, galeries et services urbains.",
    activities: ["cycling", "walking", "commuting", "dining"],
    letterCode: "C",
    startPoint: {
      name: "Royalty Junction",
      lat: 46.2533,
      lng: -63.1667,
      km: 0,
    },
    endPoint: {
      name: "Charlottetown Waterfront",
      lat: 46.2382,
      lng: -63.1311,
      km: 8,
    },
  },
  {
    id: "confederation-branch-mtstewart-georgetown",
    name: "Branch Trail — Mount Stewart to Georgetown",
    nameFr: "Sentier secondaire — Mount Stewart à Georgetown",
    type: "branch",
    distance: 39,
    elevation: "rolling",
    trafficExposure: "low",
    surface: "crushed stone",
    difficulty: "easy",
    description:
      "39 km branch through rural Queens County to the coastal town of Georgetown. Access to quiet beaches, local heritage, and Maritime charm.",
    descriptionFr:
      "Embranchement de 39 km à travers le comté de Queens vers la ville côtière de Georgetown. Accès aux plages tranquilles et au patrimoine local.",
    activities: ["cycling", "walking", "beach"],
    letterCode: "G",
    image: "/get-images/dunes.jpg",
    startPoint: {
      name: "Mount Stewart",
      lat: 46.3083,
      lng: -62.6833,
      km: 0,
    },
    endPoint: {
      name: "Georgetown",
      lat: 46.2000,
      lng: -62.5583,
      km: 39,
    },
  },
  {
    id: "confederation-branch-mtstewart-lakverde",
    name: "Branch Trail — Mount Stewart to Lake Verde",
    nameFr: "Sentier secondaire — Mount Stewart à Lake Verde",
    type: "branch",
    distance: 19,
    elevation: "rolling",
    trafficExposure: "low",
    surface: "crushed stone",
    difficulty: "easy",
    description:
      "19 km branch to Lake Verde and Pisquid West. Quieter route through forested areas with views of inland water bodies.",
    descriptionFr:
      "Embranchement de 19 km vers Lake Verde et Pisquid West. Route tranquille à travers les zones boisées.",
    activities: ["cycling", "walking", "nature"],
    letterCode: "LV",
    startPoint: {
      name: "Mount Stewart",
      lat: 46.3083,
      lng: -62.6833,
      km: 0,
    },
    endPoint: {
      name: "Lake Verde / Pisquid West",
      lat: 46.2667,
      lng: -62.5333,
      km: 19,
    },
  },
  {
    id: "confederation-branch-cardigan-montague",
    name: "Branch Trail — Cardigan Junction to Montague",
    nameFr: "Sentier secondaire — Cardigan Junction à Montague",
    type: "branch",
    distance: 10,
    elevation: "flat",
    trafficExposure: "low",
    surface: "crushed stone",
    difficulty: "easy",
    description:
      "Short 10 km branch to the historic town of Montague. Gateway to Murray Harbour and the Wood Islands ferry.",
    descriptionFr:
      "Court embranchement de 10 km vers la ville historique de Montague. Accès au port de Murray Harbour.",
    activities: ["cycling", "walking", "commuting"],
    letterCode: "M",
    startPoint: {
      name: "Cardigan Junction",
      lat: 46.2417,
      lng: -62.7417,
      km: 0,
    },
    endPoint: {
      name: "Montague",
      lat: 46.2083,
      lng: -62.6417,
      km: 10,
    },
  },
  {
    id: "confederation-branch-charlottetown-murrayharbour",
    name: "Branch Trail — Charlottetown to Murray Harbour",
    nameFr: "Sentier secondaire — Charlottetown à Murray Harbour",
    type: "branch",
    distance: 79,
    elevation: "rolling",
    trafficExposure: "low",
    surface: "crushed stone + paved",
    difficulty: "moderate",
    description:
      "Long 79 km branch from downtown Charlottetown across Hillsborough Bridge to Murray Harbour and Wood Islands ferry terminal. Longest possible single ride on the trail system.",
    descriptionFr:
      "Long embranchement de 79 km de Charlottetown au port de Murray Harbour. Plus long trajet possible sur le système de sentiers.",
    activities: ["cycling", "walking", "touring"],
    letterCode: "MH",
    image: "/get-images/singing sands.webp",
    startPoint: {
      name: "Charlottetown",
      lat: 46.2382,
      lng: -63.1311,
      km: 0,
    },
    endPoint: {
      name: "Murray Harbour / Wood Islands",
      lat: 46.0000,
      lng: -62.2833,
      km: 79,
    },
  },
  {
    id: "confederation-branch-woodislands",
    name: "Branch Trail — Wood Islands North Junction Area",
    nameFr: "Sentier secondaire — Zone de jonction de Wood Islands Nord",
    type: "branch",
    distance: 4,
    elevation: "flat",
    trafficExposure: "low",
    surface: "crushed stone",
    difficulty: "easy",
    description:
      "Short connector to Wood Islands Station (ferry terminal to Nova Scotia). Gateway to Northumberland Ferries.",
    descriptionFr:
      "Court sentier vers la gare de Wood Islands (terminal du traversier vers la Nouvelle-Écosse).",
    activities: ["cycling", "walking"],
    letterCode: "WI",
    image: "/brackley.webp",
    startPoint: {
      name: "Wood Islands North Junction",
      lat: 46.0667,
      lng: -62.1833,
      km: 0,
    },
    endPoint: {
      name: "Wood Islands Ferry Terminal",
      lat: 46.0417,
      lng: -62.2167,
      km: 4,
    },
  },
  {
    id: "confederation-branch-newharmony-souris",
    name: "Branch Trail — New Harmony to Souris",
    nameFr: "Sentier secondaire — New Harmony à Souris",
    type: "branch",
    distance: 8,
    elevation: "flat",
    trafficExposure: "low",
    surface: "crushed stone",
    difficulty: "easy",
    description:
      "Quick 8 km connector to the fishing town of Souris on the east shore. Access to coastal views and seafood restaurants.",
    descriptionFr:
      "Quick 8 km connector to the fishing town of Souris on the east shore. Accès aux restaurants de fruits de mer.",
    activities: ["cycling", "walking", "dining"],
    letterCode: "S",
    image: "/get-images/dunes.jpg",
    startPoint: {
      name: "New Harmony Junction",
      lat: 46.3500,
      lng: -61.9833,
      km: 0,
    },
    endPoint: {
      name: "Souris",
      lat: 46.3554,
      lng: -62.2536,
      km: 8,
    },
  },
];

// ── ALL ROUTES COMBINED ──────────────────────────────────────────────
export const ALL_CONFEDERATION_ROUTES: BikeRoute[] = [
  CONFEDERATION_MAIN_TRAIL,
  ...CONFEDERATION_BRANCH_TRAILS,
];

// ── PARKING LOCATIONS (from 2026 official map) ───────────────────────
export const TRAIL_PARKING: TrailParking[] = [
  { id: 1, name: "Tignish", address: "School Street", civic: 95, lat: 47.0622, lng: -63.9983, trailSection: "main-start" },
  { id: 2, name: "Alma", address: "Center Line Rd/Rte 151", civic: 794, lat: 46.9895, lng: -63.8628 },
  { id: 3, name: "Elmsdale", address: "Western Rd/Rte 2", civic: 39908, lat: 46.9450, lng: -63.7717 },
  { id: 4, name: "Bloomfield", address: "O'Halloran Rd/Rte 145", civic: 2994, lat: 46.9033, lng: -63.7233 },
  { id: 5, name: "West Devon", address: "Beaton Rd/Rte 138", civic: 134, lat: 46.8650, lng: -63.6850 },
  { id: 6, name: "Portage", address: "Western Rd/Rte 2", civic: 35235, lat: 46.8083, lng: -63.6000 },
  { id: 7, name: "Ellerslie", address: "Ellerslie Rd/Rte 133", civic: 1057, lat: 46.7417, lng: -63.5283 },
  { id: 8, name: "Northam", address: "Northam Rd/Rte 132", civic: 487, lat: 46.6983, lng: -63.4667 },
  { id: 9, name: "Richmond", address: "Western Rd/Rte 2", civic: 31466, lat: 46.6250, lng: -63.3917 },
  { id: 10, name: "Wellington", address: "Wellington Rd", civic: 9, lat: 46.5583, lng: -63.3083 },
  { id: 11, name: "Miscouche", address: "Lady Slipper Dr", civic: 46, lat: 46.5033, lng: -63.2533 },
  { id: 12, name: "Traveller's Rest", address: "Rte 1A", civic: 3884, lat: 46.4900, lng: -63.2233 },
  { id: 13, name: "Kensington", address: "Broadway St", civic: 19, lat: 46.4547, lng: -63.6343, trailSection: "main-kensington" },
  { id: 14, name: "Kelvin Grove", address: "Blue Shank Rd/Rte 107", civic: 1985, lat: 46.4233, lng: -63.5367 },
  { id: 15, name: "Emerald", address: "County Line Rd/Rte 232", civic: 2845, lat: 46.3917, lng: -63.1917, trailSection: "branch-emerald-borden" },
  { id: 16, name: "Hunter River", address: "Hopedale Rd/Rte 13", civic: 4247, lat: 46.3517, lng: -63.1350 },
  { id: 17, name: "Hampshire", address: "Colville Rd/Rte 9", civic: 439, lat: 46.3250, lng: -63.0867 },
  { id: 18, name: "Milton Station", address: "North York River Rd/Rte 248", civic: 2725, lat: 46.2983, lng: -63.0483 },
  { id: 19, name: "Winsloe", address: "Winsloe United Church/Rte 223", civic: 121, lat: 46.2650, lng: -63.1183 },
  { id: 20, name: "Brackley", address: "Brackley Point Rd/Rte 15", civic: 489, lat: 46.2400, lng: -63.1950 },
  { id: 21, name: "Union", address: "Rd/Rte 221", civic: 529, lat: 46.2300, lng: -63.0700 },
  { id: 22, name: "York", address: "Rte 25", civic: 578, lat: 46.2233, lng: -63.0517 },
  { id: 23, name: "Suffolk", address: "Suffolk Rd/Rte 222", civic: 500, lat: 46.2150, lng: -62.9950 },
  { id: 24, name: "Mount Stewart", address: "Main St/Rte 22", civic: 100, lat: 46.3083, lng: -62.6833, trailSection: "branch-mtstewart" },
  { id: 25, name: "Morell", address: "St. Peters Rd/Rte 2", civic: 7709, lat: 46.2867, lng: -62.5367 },
  { id: 26, name: "Morell Red Head", address: "Red Head Rd", civic: 20, lat: 46.2917, lng: -62.5217 },
  { id: 27, name: "St. Peters", address: "Visitor's Information Centre/Rte 2", civic: 5631, lat: 46.2667, lng: -62.4467 },
  { id: 28, name: "New Zealand", address: "St. Charles Rd/Rte 308", civic: 1357, lat: 46.2167, lng: -62.2567 },
  { id: 29, name: "Souris Line Road", address: "Souris Line Rd/Rte 305", civic: 1290, lat: 46.2583, lng: -62.0433 },
  { id: 30, name: "Elmira", address: "Elmira Rd/Rte 16A", civic: 457, lat: 46.3875, lng: -62.0661, trailSection: "main-end" },
];

// ── KEY POINTS OF INTEREST ──────────────────────────────────────────
export const TRAIL_POI: TrailPOI[] = [
  {
    id: "kensington-station",
    name: "Kensington Railway Station — National Historic Site",
    nameFr: "Gare ferroviaire de Kensington — site historique national",
    type: "historic",
    km: 123,
    lat: 46.4547,
    lng: -63.6343,
  },
];

// ── GEOCACHING ON THE TRAIL ─────────────────────────────────────────
export const TRAIL_GEOCACHING_INFO = {
  totalCaches: 1700,
  description: "Geocaching is like a modern game of hide and seek. It is best defined as an adventure game for Global Positioning Device users. Caches are set up all over the trail.",
  resource: "https://www.geocaching.com/",
};
