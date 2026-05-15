import type { LocationFAQ } from "@/lib/types";

export type IntelSpotKind = "wind-commute" | "water-temp" | "trail-status" | "tide";

export interface IntelSpot {
  key: string;
  label: string;
  kind: IntelSpotKind;
  sourceLocationId?: string;
  buoyId?: string;
  note: string;
}

export interface TownBeach {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  description: string;
  amenities: string[];
}

export interface TownPark {
  id: string;
  name: string;
  address: string;
  highlights: string;
  acres?: number;
  trailKm?: number;
}

export interface TownProfile {
  slug: string;
  locationId: string;
  displayName: string;
  lede: string;
  officialSiteUrl: string;
  parksAndTrailsUrl: string;
  heroImagePath?: string;
  heroImageAlt?: string;
  intelSpots: IntelSpot[];
  beaches: TownBeach[];
  parks: TownPark[];
  faqs: LocationFAQ[];
  nearbyLocationIds: string[];
}

export const TOWN_PROFILES: Record<string, TownProfile> = {
  stratford: {
    slug: "stratford",
    locationId: "stratford",
    displayName: "Stratford",
    lede:
      "Live conditions, tides, and outdoor verdicts for Stratford, PEI — Charlottetown's east-shore neighbour.",
    officialSiteUrl: "https://www.townofstratford.ca",
    parksAndTrailsUrl: "https://townofstratford.ca/recreation-and-culture/recreational-facilities/parks-and-trails/",
    heroImagePath: "/stratford-hero.png",
    heroImageAlt: "Town of Stratford welcome sign at golden hour with the town hall in the background",
    intelSpots: [
      {
        key: "hillsborough-wind",
        label: "Hillsborough Bridge wind",
        kind: "wind-commute",
        sourceLocationId: "charlottetown",
        note: "Crosswind reading from Charlottetown harbour — the closest active station to the bridge deck.",
      },
      {
        key: "tea-hill-water",
        label: "Tea Hill water temperature",
        kind: "water-temp",
        buoyId: "C44137",
        note: "Live read from the Northumberland Strait DFO buoy — the same body of water that fronts Tea Hill Park.",
      },
      {
        key: "cotton-park-trail",
        label: "Robert Cotton Park trail",
        kind: "trail-status",
        note: "Walking verdict for the paved waterfront loop, scored against current Stratford conditions.",
      },
      {
        key: "next-tide",
        label: "Next Charlottetown harbour tide",
        kind: "tide",
        note: "DFO tide prediction for the Charlottetown station, four kilometres west of Stratford.",
      },
    ],
    beaches: [
      {
        id: "tea-hill",
        name: "Tea Hill Provincial Park Beach",
        address: "492 Keppoch Road, Stratford, PE C1B 2J9",
        lat: 46.175,
        lng: -63.098,
        description:
          "The most family-friendly beach in Stratford — managed provincial park with full amenities and a long sweep of red sand fronting Hillsborough Bay.",
        amenities: ["Washrooms", "Showers", "Playground", "Beach volleyball", "Parking", "Picnic tables"],
      },
      {
        id: "keppoch-beach",
        name: "Keppoch Beach",
        address: "End of Keppoch Road, Stratford",
        lat: 46.1957,
        lng: -63.1123,
        description:
          "Quiet stretch of red sand at the end of Keppoch Road — calm Hillsborough Bay water, good for walking and wading. No facilities.",
        amenities: ["No facilities"],
      },
      {
        id: "kinlock-beach",
        name: "Kinlock Beach",
        address: "End of Kinlock Road, Stratford",
        lat: 46.21,
        lng: -63.075,
        description:
          "Informal red sand beach popular as a kayak launch — the Bellevue Cove paddle starts from here. Great for paddling, less so for swimming.",
        amenities: ["Informal parking", "Kayak launch"],
      },
    ],
    parks: [
      {
        id: "fullertons-creek",
        name: "Fullerton's Creek Conservation Park",
        address: "41 MacIntosh Drive, Stratford",
        highlights: "140 acres of conservation land with a marsh viewpoint, 4 km of trails, and Great Blue Heron habitat.",
        acres: 140,
        trailKm: 4,
      },
      {
        id: "robert-cotton-park",
        name: "Robert Cotton Park",
        address: "57 Bunbury Road, Stratford, PE C1B 1T8",
        highlights: "17 acres of passive walking trails on a heritage nursery site, with the Stratford Youth Centre and Mayflower Seniors Club on grounds.",
        acres: 17,
      },
      {
        id: "kinlock-park",
        name: "Kinlock Park",
        address: "Kinlock Road, Stratford",
        highlights: "Tennis courts, baseball diamond, soccer field, and playground.",
      },
      {
        id: "keppoch-park",
        name: "Keppoch Park",
        address: "136 Keppoch Road, Stratford",
        highlights: "Soccer field and playground — easily reached on T3 Transit Route 7.",
      },
      {
        id: "reddin-park",
        name: "Reddin Park",
        address: "Stratford Road & Millennium Drive, Stratford",
        highlights: "Playground, creek walk, and tidal estuary views.",
      },
      {
        id: "pondside-park",
        name: "Pondside Park",
        address: "15 Keppoch Road, Stratford",
        highlights: "1 km natural trail through varied terrain along a stream.",
        trailKm: 1,
      },
    ],
    faqs: [
      {
        q: "What's the weather like in Stratford, PEI right now?",
        a: "Stratford shares the Charlottetown weather station four kilometres across the Hillsborough Bridge, so live temperature, wind, UV, and air quality all reflect what you'll feel here. The OpenAir verdict at the top of this page combines those readings into a plain-English call on whether right now is good for outdoor plans.",
      },
      {
        q: "Which beach in Stratford is best for swimming today?",
        a: "Tea Hill Provincial Park is the most family-friendly with washrooms, showers, and lifeguards in season — best for an afternoon out. Keppoch Beach is quieter and good for wading, while Kinlock Beach is preferred by paddlers. The beach cards on this page show live conditions for each, so pick whichever has the best Go/Caution/Skip rating right now.",
      },
      {
        q: "Is Tea Hill Beach open today?",
        a: "Tea Hill Park is open year-round for walking, with the seasonal beach amenities (washrooms, showers, lifeguards in some seasons) running from mid-May through early October. We surface live water temperature from the Northumberland Strait buoy on this page so you can see if it's swimmable before you drive over.",
      },
      {
        q: "What parks and trails are in Stratford?",
        a: "Stratford has six named parks: Fullerton's Creek Conservation Park (140 acres, 4 km of trails), Robert Cotton Park (17 acres on Bunbury Road), Kinlock Park (sports facilities), Keppoch Park, Reddin Park, and Pondside Park (1 km natural trail). The Trans Canada Trail also runs 7 km through Stratford, paved and accessible all year.",
      },
      {
        q: "How windy is the Hillsborough Bridge today?",
        a: "We pull the live wind reading from the Charlottetown harbour station, the closest active observation site to the bridge. Sustained winds above 50 km/h make the bridge uncomfortable for cyclists and high-sided vehicles; above 70 km/h, expect provincial restrictions on the larger Confederation Bridge — Hillsborough rarely closes outright.",
      },
      {
        q: "What's the next high tide at Stratford?",
        a: "Stratford uses the Charlottetown harbour tide table from Fisheries and Oceans Canada — the closest official station. The next high and low tide times appear in the Stratford intel block on this page, refreshed throughout the day.",
      },
      {
        q: "When does the sun rise and set in Stratford?",
        a: "Sunrise and sunset times update daily on this page, calculated for Stratford's exact coordinates (46.216°N, 63.088°W). In peak summer, expect daylight from before 5:30 AM until after 9:00 PM; in midwinter, the window shrinks to roughly 7:45 AM to 4:30 PM.",
      },
      {
        q: "Where can I park in Stratford?",
        a: "Free parking at Robert Cotton Park, Tea Hill Park, and along the waterfront trail. Both Tea Hill and Cotton Park lots fill up fastest on summer weekends with good weather — check the OpenAir verdict at the top of this page before deciding when to arrive.",
      },
      {
        q: "Is the Hillsborough Bridge open to bikes and pedestrians?",
        a: "Yes — the Hillsborough Bridge has a dedicated multi-use path that connects Stratford and Charlottetown's downtown core. We don't have a live status feed for the path itself, but the bridge wind reading on this page is the best proxy for whether crossing on foot or bike will be comfortable today.",
      },
    ],
    nearbyLocationIds: ["charlottetown", "victoria-park", "fox-meadow-golf", "belvedere-golf"],
  },
};

export function getTownProfile(slug: string): TownProfile | null {
  return TOWN_PROFILES[slug] ?? null;
}
