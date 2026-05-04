import type { GeoJSON } from "geojson";

export interface HikingTrail {
  id: string;
  name: string;
  nameFr: string;
  description: string;
  descriptionFr: string;
  difficulty: "easy" | "moderate" | "challenging";
  distance: number; // km
  duration: number; // minutes
  elevationGain: number; // meters
  elevation: "flat" | "rolling" | "hilly" | "steep";
  surface: string; // "packed dirt", "gravel", "rocky", "mixed"
  loopOrLinear: "loop" | "linear";

  region: string; // Central, North, East, South, West
  season: "year-round" | "spring-fall" | "summer" | "winter";

  trailhead: {
    name: string;
    lat: number;
    lng: number;
    civic?: number;
    address?: string;
  };

  features: Array<
    | "wheelchair-accessible"
    | "stroller-friendly"
    | "dog-friendly"
    | "scenic-views"
    | "waterfront"
    | "birdwatching"
    | "wildlife-spotting"
    | "historic-site"
    | "wildflowers"
    | "forest"
    | "coastal"
    | "mountain-views"
  >;

  activities: ("hiking" | "walking" | "running" | "photography" | "nature-study" | "swimming")[];

  hazards: Array<
    | "exposed-sections"
    | "steep-sections"
    | "wet-marshy"
    | "rocky-footing"
    | "no-shade"
    | "exposed-cliffs"
    | "tides"
  >;

  amenities: Array<
    | "parking"
    | "washroom"
    | "picnic-area"
    | "shelter"
    | "water-fountain"
    | "bench-seating"
    | "interpretive-signs"
    | "visitor-centre"
    | "lifeguard-summer"
    | "lighthouse-cafe"
    | "gift-shop"
    | "museum"
    | "cafe"
    | "historic-hotel"
    | "restaurant"
    | "viewing-platforms"
    | "monument-plaques"
  >;

  parking?: {
    nearby: number; // how many parking spots nearby
    accessible: boolean;
  };

  image?: string;
  geometry?: GeoJSON.LineString;

  highlights: string[]; // brief descriptions of key features
  bestTime?: string; // "Late spring to early fall", etc.
}

// ── HIKING & WALKING TRAILS ──────────────────────────────────────────────

export const ALL_HIKING_TRAILS: HikingTrail[] = [
  {
    id: "black-marsh-nature-trail",
    name: "Black Marsh Nature Trail",
    nameFr: "Sentier de la nature du marais noir",
    description:
      "A flat, accessible trail through a protected salt marsh with views of terns, gulls, and cormorants. Ideal for wildlife spotting and photography. Features interpretive signage about coastal marsh ecosystems.",
    descriptionFr:
      "Un sentier plat et accessible à travers un marais salé protégé avec vue sur les sternes, les goélands et les cormorans. Idéal pour observer la faune et la photographie.",
    difficulty: "easy",
    distance: 3.5,
    duration: 45,
    elevationGain: 0,
    elevation: "flat",
    surface: "packed dirt, boardwalk sections",
    loopOrLinear: "loop",
    region: "East",
    season: "year-round",
    trailhead: {
      name: "Black Marsh Trailhead",
      lat: 46.3589,
      lng: -62.0661,
      civic: 5631,
      address: "Route 2, St. Peters",
    },
    features: [
      "wheelchair-accessible",
      "stroller-friendly",
      "birdwatching",
      "wildlife-spotting",
      "scenic-views",
      "waterfront",
    ],
    activities: ["hiking", "walking", "photography", "nature-study"],
    hazards: ["wet-marshy", "tides"],
    amenities: ["parking", "washroom", "picnic-area", "interpretive-signs"],
    parking: { nearby: 15, accessible: true },
    image: "/get-images/black-marsh.jpg",
    highlights: [
      "Salt marsh ecosystem",
      "Nesting terns and gulls",
      "Interpretive boardwalk",
      "Photography opportunities",
    ],
    bestTime: "May to September for peak wildlife activity",
  },

  {
    id: "greenwich-dunes-trails",
    name: "Greenwich Dunes — Sand Dunes Trail",
    nameFr: "Dunes de Greenwich — Sentier des dunes de sable",
    description:
      "A scenic 4.5 km loop through protected sand dunes with views of the Gulf of St. Lawrence. Features wooden boardwalks to protect fragile dune vegetation. Great for photography and understanding coastal dune ecology.",
    descriptionFr:
      "Une boucle pittoresque de 4,5 km à travers des dunes de sable protégées avec vue sur le golfe du Saint-Laurent.",
    difficulty: "easy",
    distance: 4.5,
    duration: 60,
    elevationGain: 40,
    elevation: "rolling",
    surface: "boardwalk, sand",
    loopOrLinear: "loop",
    region: "Central",
    season: "year-round",
    trailhead: {
      name: "Greenwich Dunes Visitor Centre",
      lat: 46.4467,
      lng: -62.6889,
      civic: 2845,
      address: "Route 232, Greenwich",
    },
    features: [
      "scenic-views",
      "waterfront",
      "wildflowers",
      "coastal",
      "birdwatching",
    ],
    activities: ["hiking", "walking", "photography"],
    hazards: ["exposed-sections", "no-shade"],
    amenities: ["parking", "washroom", "visitor-centre", "interpretive-signs"],
    parking: { nearby: 40, accessible: true },
    image: "/get-images/greenwich-dunes.jpg",
    highlights: [
      "Protected sand dunes",
      "Gulf views",
      "Rare dune flowers",
      "Boardwalk sections",
    ],
    bestTime: "June to September for wildflowers",
  },

  {
    id: "victoria-park-woodland-trail",
    name: "Victoria Park — Woodland Trail",
    nameFr: "Parc Victoria — Sentier forestier",
    description:
      "A peaceful 2.8 km loop through mature hardwood forest in Charlottetown's most historic park. Features a beaver pond, scenic bridges, and abundant birdlife. Easy navigation with well-marked paths.",
    descriptionFr:
      "Une boucle tranquille de 2,8 km à travers une forêt de feuillus matures du parc historique de Charlottetown.",
    difficulty: "easy",
    distance: 2.8,
    duration: 40,
    elevationGain: 15,
    elevation: "flat",
    surface: "packed dirt, gravel",
    loopOrLinear: "loop",
    region: "Central",
    season: "year-round",
    trailhead: {
      name: "Victoria Park Main Entrance",
      lat: 46.2310,
      lng: -63.1200,
      civic: 9,
      address: "Kent Street, Charlottetown",
    },
    features: ["forest", "birdwatching", "scenic-views", "wildlife-spotting"],
    activities: ["hiking", "walking", "nature-study"],
    hazards: ["wet-marshy"],
    amenities: ["parking", "washroom", "picnic-area", "bench-seating"],
    parking: { nearby: 60, accessible: true },
    image: "/get-images/victoria-park.jpg",
    highlights: [
      "Historic hardwood forest",
      "Beaver pond",
      "Stone bridges",
      "Abundant birds",
    ],
    bestTime: "May to October, spectacular in autumn",
  },

  {
    id: "cavendish-cliffs-trail",
    name: "Cavendish Red Cliffs Trail",
    nameFr: "Sentier des falaises rouges de Cavendish",
    description:
      "A spectacular 3 km coastal walk featuring PEI's iconic red sand cliffs towering 60+ meters above the beach. Features multiple viewpoints and a beach access point. Popular for photography and understanding coastal geology.",
    descriptionFr:
      "Une promenade côtière spectaculaire de 3 km mettant en vedette les célèbres falaises de sable rouge de l'Île-du-Prince-Édouard.",
    difficulty: "moderate",
    distance: 3.0,
    duration: 50,
    elevationGain: 80,
    elevation: "hilly",
    surface: "gravel, dirt, sand beach",
    loopOrLinear: "linear",
    region: "North",
    season: "spring-fall",
    trailhead: {
      name: "Cavendish Beach Parking",
      lat: 46.4943,
      lng: -63.3971,
      civic: 489,
      address: "Brackley Point Road, Cavendish",
    },
    features: ["scenic-views", "waterfront", "coastal"],
    activities: ["hiking", "walking", "photography"],
    hazards: ["exposed-cliffs", "exposed-sections"],
    amenities: ["parking", "washroom", "picnic-area", "lifeguard-summer"],
    parking: { nearby: 100, accessible: true },
    image: "/get-images/cavendish-cliffs.jpg",
    highlights: [
      "Red sand cliffs",
      "Beach access",
      "Coastal views",
      "Geology interpretation",
    ],
    bestTime: "May to October, avoid high tide",
  },

  {
    id: "north-cape-lighthouse-trail",
    name: "North Cape Lighthouse Trail",
    nameFr: "Sentier du phare du Cap-Nord",
    description:
      "A 5 km challenging coastal hike with dramatic ocean views, accessible lighthouse access, and windswept coastal landscape. Features a working lighthouse with gift shop and cafe. Best for experienced hikers comfortable with exposed terrain.",
    descriptionFr:
      "Une randonnée côtière stimulante de 5 km avec des vues spectaculaires sur l'océan et un accès au phare.",
    difficulty: "challenging",
    distance: 5.0,
    duration: 90,
    elevationGain: 120,
    elevation: "steep",
    surface: "rocky, gravel, coastal",
    loopOrLinear: "linear",
    region: "West",
    season: "spring-fall",
    trailhead: {
      name: "North Cape Parking Area",
      lat: 47.0583,
      lng: -63.9989,
      civic: 100,
      address: "Route 12, North Cape",
    },
    features: [
      "scenic-views",
      "coastal",
      "historic-site",
      "mountain-views",
      "birdwatching",
    ],
    activities: ["hiking", "photography", "nature-study"],
    hazards: ["exposed-cliffs", "exposed-sections", "no-shade", "steep-sections"],
    amenities: ["parking", "lighthouse-cafe", "gift-shop", "washroom"],
    parking: { nearby: 50, accessible: false },
    image: "/get-images/north-cape.jpg",
    highlights: [
      "Working lighthouse",
      "Windswept cliffs",
      "Ocean vistas",
      "Seabird viewing",
    ],
    bestTime: "June to September",
  },

  {
    id: "east-point-lighthouse-walk",
    name: "East Point Lighthouse Walk",
    nameFr: "Promenade du phare de la Pointe-Est",
    description:
      "A short 1.5 km easy walk to a historic lighthouse and museum at PEI's easternmost point. Features museum exhibits, gift shop, and views of where the Gulf meets the Atlantic. Ideal for families and those wanting a scenic lighthouse experience.",
    descriptionFr:
      "Une courte promenade facile de 1,5 km jusqu'à un phare historique et un musée au point le plus à l'est de l'Île-du-Prince-Édouard.",
    difficulty: "easy",
    distance: 1.5,
    duration: 30,
    elevationGain: 10,
    elevation: "flat",
    surface: "gravel, paved",
    loopOrLinear: "linear",
    region: "East",
    season: "year-round",
    trailhead: {
      name: "East Point Lighthouse Parking",
      lat: 46.3875,
      lng: -62.0661,
      civic: 457,
      address: "Route 16A, East Point",
    },
    features: ["historic-site", "scenic-views", "waterfront", "birdwatching"],
    activities: ["walking", "photography", "nature-study"],
    hazards: [],
    amenities: [
      "parking",
      "washroom",
      "museum",
      "gift-shop",
      "cafe",
      "bench-seating",
    ],
    parking: { nearby: 30, accessible: true },
    image: "/get-images/east-point.jpg",
    highlights: ["Historic lighthouse", "Museum", "Gulf/Atlantic views", "Easy access"],
    bestTime: "Year-round",
  },

  {
    id: "basin-head-singing-sands",
    name: "Basin Head — Singing Sands Trail",
    nameFr: "Basin Head — Sentier des sables chantants",
    description:
      "A 2 km easy trail to one of PEI's most unique beaches featuring sand that 'sings' when you walk on it. Warm gulf water, stunning red cliffs, and educational signage about the singing sand phenomenon. Great for families.",
    descriptionFr:
      "Un sentier facile de 2 km menant à l'une des plages les plus uniques de l'Île-du-Prince-Édouard avec du sable qui 'chante'.",
    difficulty: "easy",
    distance: 2.0,
    duration: 35,
    elevationGain: 20,
    elevation: "rolling",
    surface: "gravel, sand",
    loopOrLinear: "linear",
    region: "East",
    season: "spring-fall",
    trailhead: {
      name: "Basin Head Parking",
      lat: 46.3589,
      lng: -62.0661,
      civic: 5631,
      address: "Route 16, Basin Head",
    },
    features: ["scenic-views", "waterfront", "coastal", "birdwatching"],
    activities: ["hiking", "walking", "photography"],
    hazards: ["tides"],
    amenities: ["parking", "washroom", "picnic-area", "lifeguard-summer"],
    parking: { nearby: 45, accessible: true },
    image: "/get-images/singing-sands.webp",
    highlights: [
      "Singing sand phenomenon",
      "Warm gulf water",
      "Red cliffs",
      "Unique geology",
    ],
    bestTime: "June to September for water warmth",
  },

  {
    id: "orby-head-cliffs-trail",
    name: "Orby Head Cliffs Trail",
    nameFr: "Sentier des falaises d'Orby Head",
    description:
      "A 3.5 km moderate trail through coastal forest leading to dramatic red cliff viewpoints. Features multiple scenic overlooks and excellent birdwatching opportunities. Well-maintained path with some elevation gain.",
    descriptionFr:
      "Un sentier modéré de 3,5 km à travers une forêt côtière menant à des points de vue spectaculaires.",
    difficulty: "moderate",
    distance: 3.5,
    duration: 60,
    elevationGain: 90,
    elevation: "hilly",
    surface: "packed dirt, root sections",
    loopOrLinear: "loop",
    region: "South",
    season: "spring-fall",
    trailhead: {
      name: "Orby Head Trailhead",
      lat: 46.1500,
      lng: -63.0500,
      civic: 2500,
      address: "Route 4, Orby Head",
    },
    features: [
      "scenic-views",
      "coastal",
      "forest",
      "birdwatching",
      "wildlife-spotting",
    ],
    activities: ["hiking", "walking", "photography", "nature-study"],
    hazards: ["exposed-cliffs", "rocky-footing"],
    amenities: ["parking", "picnic-area", "bench-seating"],
    parking: { nearby: 20, accessible: false },
    image: "/get-images/orby-head.jpg",
    highlights: [
      "Coastal forest",
      "Cliff viewpoints",
      "Birdwatching",
      "Quiet trails",
    ],
    bestTime: "May to October",
  },

  {
    id: "confederation-park-trails",
    name: "Confederation Park — Heritage Trail Network",
    nameFr: "Parc de la Confédération — Réseau de sentiers patrimonial",
    description:
      "A 8 km network of interconnected easy trails through historic Charlottetown park. Multiple loop options from 2-8 km. Features monuments, historic plaques, river views, and peaceful woodland. Perfect for families and those wanting variable distance.",
    descriptionFr:
      "Un réseau de 8 km de sentiers reliés à travers le parc historique de Charlottetown.",
    difficulty: "easy",
    distance: 8.0,
    duration: 120,
    elevationGain: 30,
    elevation: "flat",
    surface: "paved, packed dirt",
    loopOrLinear: "loop",
    region: "Central",
    season: "year-round",
    trailhead: {
      name: "Confederation Park Main Gate",
      lat: 46.2310,
      lng: -63.1200,
      civic: 9,
      address: "Kent Street, Charlottetown",
    },
    features: ["historic-site", "forest", "scenic-views", "birdwatching"],
    activities: ["hiking", "walking", "running"],
    hazards: [],
    amenities: [
      "parking",
      "washroom",
      "picnic-area",
      "bench-seating",
      "interpretive-signs",
      "monument-plaques",
    ],
    parking: { nearby: 80, accessible: true },
    image: "/get-images/confederation-park.jpg",
    highlights: ["Historic monuments", "River views", "Multiple loops", "Year-round access"],
    bestTime: "Year-round",
  },

  {
    id: "dalvay-beach-nature-trail",
    name: "Dalvay Beach Nature Trail",
    nameFr: "Sentier de la nature de la plage Dalvay",
    description:
      "A 4 km loop through diverse ecosystems including forest, salt marsh, and beach. Features a historic hotel and restaurant. Beautiful for all seasons with interpretive signage about PEI's natural and cultural history.",
    descriptionFr:
      "Une boucle de 4 km à travers des écosystèmes diversifiés incluant forêt, marais salé et plage.",
    difficulty: "easy",
    distance: 4.0,
    duration: 65,
    elevationGain: 25,
    elevation: "rolling",
    surface: "gravel, boardwalk sections",
    loopOrLinear: "loop",
    region: "North",
    season: "year-round",
    trailhead: {
      name: "Dalvay Parking Area",
      lat: 46.4200,
      lng: -62.8500,
      civic: 156,
      address: "Route 6, Dalvay",
    },
    features: [
      "scenic-views",
      "waterfront",
      "forest",
      "wildlife-spotting",
      "historic-site",
    ],
    activities: ["hiking", "walking", "photography"],
    hazards: ["wet-marshy"],
    amenities: ["parking", "historic-hotel", "restaurant", "washroom", "picnic-area"],
    parking: { nearby: 40, accessible: true },
    image: "/get-images/dalvay.jpg",
    highlights: [
      "Diverse ecosystems",
      "Historic hotel",
      "Beach access",
      "Wildlife viewing",
    ],
    bestTime: "May to October",
  },

  {
    id: "kingsboro-shore-trail",
    name: "Kingsboro Shore Trail",
    nameFr: "Sentier du rivage de Kingsboro",
    description:
      "A scenic 5.5 km moderate coastal trail with views of fishing villages, sandstone cliffs, and traditional PEI landscapes. Features access to beaches and tide pools. Great for understanding PEI's fishing heritage and coastal geology.",
    descriptionFr:
      "Un sentier côtier pittoresque et modéré de 5,5 km avec des vues sur les villages de pêcheurs.",
    difficulty: "moderate",
    distance: 5.5,
    duration: 85,
    elevationGain: 110,
    elevation: "rolling",
    surface: "gravel, rocky, beach",
    loopOrLinear: "linear",
    region: "South",
    season: "spring-fall",
    trailhead: {
      name: "Kingsboro Parking",
      lat: 46.1000,
      lng: -62.5000,
      civic: 1200,
      address: "Route 4, Kingsboro",
    },
    features: [
      "coastal",
      "scenic-views",
      "waterfront",
      "historic-site",
      "birdwatching",
    ],
    activities: ["hiking", "photography", "nature-study"],
    hazards: ["rocky-footing", "tides", "exposed-sections"],
    amenities: ["parking", "picnic-area"],
    parking: { nearby: 15, accessible: false },
    image: "/get-images/kingsboro-shore.jpg",
    highlights: [
      "Fishing villages",
      "Sandstone cliffs",
      "Tide pools",
      "Coastal views",
    ],
    bestTime: "May to October, time for low tide",
  },

  {
    id: "morell-river-estuary-trail",
    name: "Morell River Estuary Trail",
    nameFr: "Sentier de l'estuaire de la rivière Morell",
    description:
      "A 3.2 km easy loop along a river estuary rich in wildlife. Features viewing platforms for bird and wildlife spotting. Excellent for nature photographers and those interested in freshwater ecosystems. Peaceful and quiet.",
    descriptionFr:
      "Une boucle facile de 3,2 km le long d'un estuaire de rivière riche en faune.",
    difficulty: "easy",
    distance: 3.2,
    duration: 50,
    elevationGain: 10,
    elevation: "flat",
    surface: "boardwalk, packed dirt",
    loopOrLinear: "loop",
    region: "East",
    season: "spring-fall",
    trailhead: {
      name: "Morell River Estuary Parking",
      lat: 46.2867,
      lng: -62.5367,
      civic: 7709,
      address: "Route 2, Morell",
    },
    features: [
      "waterfront",
      "birdwatching",
      "wildlife-spotting",
      "forest",
      "scenic-views",
    ],
    activities: ["hiking", "walking", "photography", "nature-study"],
    hazards: ["wet-marshy"],
    amenities: ["parking", "viewing-platforms", "picnic-area", "bench-seating"],
    parking: { nearby: 20, accessible: true },
    image: "/get-images/morell-estuary.jpg",
    highlights: ["Wildlife viewing", "Estuary ecosystem", "Photography spots", "Quiet"],
    bestTime: "May to September for migration and wildlife",
  },

  {
    id: "point-prim-lighthouse-walk",
    name: "Point Prim Lighthouse Walk",
    nameFr: "Promenade du phare de la Pointe-Prime",
    description:
      "A short 1 km easy walk to Canada's only PEI lighthouse (octagonal). Features a museum, gift shop, and restaurant with views across the Northumberland Strait. Perfect for families and lighthouse enthusiasts.",
    descriptionFr:
      "Une courte promenade facile de 1 km jusqu'à l'unique phare octogonal du Canada.",
    difficulty: "easy",
    distance: 1.0,
    duration: 20,
    elevationGain: 5,
    elevation: "flat",
    surface: "paved, gravel",
    loopOrLinear: "linear",
    region: "South",
    season: "year-round",
    trailhead: {
      name: "Point Prim Lighthouse Parking",
      lat: 46.1000,
      lng: -62.7000,
      civic: 800,
      address: "Route 209, Point Prim",
    },
    features: ["historic-site", "scenic-views", "waterfront"],
    activities: ["walking", "photography"],
    hazards: [],
    amenities: [
      "parking",
      "washroom",
      "museum",
      "gift-shop",
      "restaurant",
      "bench-seating",
    ],
    parking: { nearby: 25, accessible: true },
    image: "/get-images/point-prim.jpg",
    highlights: ["Unique octagonal lighthouse", "Museum", "Restaurant", "Strait views"],
    bestTime: "Year-round",
  },
];
