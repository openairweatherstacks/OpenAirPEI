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
  cornwall: {
    slug: "cornwall",
    locationId: "cornwall",
    displayName: "Cornwall",
    lede:
      "Live conditions, tides, and outdoor verdicts for Cornwall, PEI — Charlottetown's west-shore neighbour on the West River.",
    officialSiteUrl: "https://cornwallpe.ca",
    parksAndTrailsUrl: "https://cornwallpe.ca/recreation/",
    heroImagePath: "/cornwall-hero.png",
    heroImageAlt: "Cornwall, PEI boardwalk along the West River with the town in the background",
    intelSpots: [
      {
        key: "trans-canada-wind",
        label: "Trans-Canada (Route 1) wind",
        kind: "wind-commute",
        sourceLocationId: "charlottetown",
        note: "Crosswind reading from Charlottetown harbour — the closest active station to the Route 1 corridor through Cornwall.",
      },
      {
        key: "west-river-water",
        label: "West River water temperature",
        kind: "water-temp",
        buoyId: "C44137",
        note: "Live read from the Northumberland Strait DFO buoy — the same body of water that feeds the West River estuary.",
      },
      {
        key: "cornwall-boardwalk-trail",
        label: "Cornwall Boardwalk trail",
        kind: "trail-status",
        note: "Walking verdict for the paved West River boardwalk, scored against current Cornwall conditions.",
      },
      {
        key: "next-tide",
        label: "Next Charlottetown harbour tide",
        kind: "tide",
        note: "DFO tide prediction for the Charlottetown station, the closest official tide gauge to Cornwall's West River estuary.",
      },
    ],
    beaches: [
      {
        id: "argyle-shore",
        name: "Argyle Shore Provincial Park Beach",
        address: "Route 19, Argyle Shore, PE",
        lat: 46.1283,
        lng: -63.3611,
        description:
          "The closest red-sand beach to Cornwall — a managed provincial park on the south shore with warm Northumberland Strait water, picnic grounds, and a great view of Nova Scotia across the strait.",
        amenities: ["Washrooms", "Picnic shelter", "Parking", "Stairs to beach"],
      },
      {
        id: "canoe-cove",
        name: "Canoe Cove Beach",
        address: "Canoe Cove Road, Canoe Cove, PE",
        lat: 46.1078,
        lng: -63.3239,
        description:
          "Quiet south-shore beach a short drive from Cornwall — red sand, warm strait water, and tide pools at low tide. Informal access with no facilities.",
        amenities: ["Informal parking", "No facilities"],
      },
      {
        id: "rocky-point",
        name: "Rocky Point Beach",
        address: "Rocky Point, PE",
        lat: 46.1969,
        lng: -63.1411,
        description:
          "Across the harbour from Charlottetown — a quiet shoreline with views of the city skyline, Skmaqn–Port-la-Joye–Fort Amherst National Historic Site, and the Hillsborough Bay tide.",
        amenities: ["Parking at Fort Amherst", "Picnic tables", "Interpretive trails"],
      },
    ],
    parks: [
      {
        id: "cornwall-boardwalk",
        name: "Cornwall Boardwalk",
        address: "Cornwall Centennial Park, Cornwall, PE",
        highlights: "Paved waterfront boardwalk along the West River — the town's flagship walking trail with estuary views and benches throughout.",
        trailKm: 1.5,
      },
      {
        id: "terry-fox-sports-complex",
        name: "Terry Fox Sports Complex",
        address: "20 Centennial Drive, Cornwall, PE",
        highlights: "The town's main outdoor sports hub — soccer fields, baseball diamonds, playground, and a walking loop on landscaped grounds.",
      },
      {
        id: "apm-centre-grounds",
        name: "APM Centre Grounds",
        address: "1 Cornwall Road, Cornwall, PE",
        highlights: "Cornwall's twin-pad arena with adjacent green space, a playground, and the trailhead for the Cornwall Trail.",
      },
      {
        id: "cornwall-watershed-trails",
        name: "Cornwall & Area Watershed Trails",
        address: "North River Causeway, Cornwall, PE",
        highlights: "Natural trail network along the North River with marsh boardwalks and woodland sections — a quieter alternative to the main boardwalk.",
        trailKm: 3,
      },
      {
        id: "warren-grove-park",
        name: "Warren Grove Park",
        address: "Warren Grove Road, Cornwall, PE",
        highlights: "Neighbourhood park with playground and open green space, popular with families in the Warren Grove subdivision.",
      },
      {
        id: "meadowbank-park",
        name: "Meadowbank Park",
        address: "Meadowbank Road, Cornwall, PE",
        highlights: "Rural community park on the western edge of Cornwall — playground, ballfield, and quiet trails.",
      },
    ],
    faqs: [
      {
        q: "What's the weather like in Cornwall, PEI right now?",
        a: "Cornwall shares the Charlottetown weather station roughly nine kilometres east, so live temperature, wind, UV, and air quality all reflect what you'll feel on the West River. The OpenAir verdict at the top of this page combines those readings into a plain-English call on whether right now is good for outdoor plans.",
      },
      {
        q: "Which beach near Cornwall is best for swimming today?",
        a: "Argyle Shore Provincial Park is the closest managed beach — a 20-minute drive south on Route 19 with washrooms, picnic grounds, and warm strait water. Canoe Cove is quieter and good for wading, while Rocky Point Beach offers harbour views and tide pools. The beach cards on this page show live conditions for each, so pick whichever has the best Go/Caution/Skip rating right now.",
      },
      {
        q: "Is the Cornwall Boardwalk open today?",
        a: "The Cornwall Boardwalk along the West River is open year-round for walking, with the main season running from mid-May through October. We surface live wind, UV, and rainfall on this page so you can see if it's a comfortable day for the loop before you head out.",
      },
      {
        q: "What parks and trails are in Cornwall?",
        a: "Cornwall has the West River Boardwalk, the Terry Fox Sports Complex grounds, the APM Centre walking loop, the Cornwall & Area Watershed trails along the North River, and neighbourhood parks at Warren Grove and Meadowbank. Each is scored live on this page against current Cornwall conditions.",
      },
      {
        q: "How windy is Route 1 through Cornwall today?",
        a: "We pull the live wind reading from the Charlottetown harbour station, the closest active observation site to the Trans-Canada Highway as it runs through Cornwall. Sustained winds above 50 km/h make the bridge approaches and Route 1 open stretches noticeably gusty; above 70 km/h, expect provincial restrictions on the Confederation Bridge to the west.",
      },
      {
        q: "What's the next high tide on the West River?",
        a: "Cornwall uses the Charlottetown harbour tide table from Fisheries and Oceans Canada — the closest official station. The West River estuary tides closely follow the Charlottetown reading. The next high and low tide times appear in the Cornwall intel block on this page, refreshed throughout the day.",
      },
      {
        q: "When does the sun rise and set in Cornwall?",
        a: "Sunrise and sunset times update daily on this page, calculated for Cornwall's exact coordinates (46.237°N, 63.215°W). In peak summer, expect daylight from before 5:30 AM until after 9:00 PM; in midwinter, the window shrinks to roughly 7:45 AM to 4:30 PM.",
      },
      {
        q: "Where can I park in Cornwall?",
        a: "Free parking at the Terry Fox Sports Complex, the APM Centre, and along the Cornwall Boardwalk. The boardwalk lot fills up fastest on summer weekends with good weather — check the OpenAir verdict at the top of this page before deciding when to arrive.",
      },
      {
        q: "How far is Cornwall from Charlottetown?",
        a: "Cornwall is about nine kilometres west of downtown Charlottetown along Route 1 (Trans-Canada Highway) — a 12-minute drive in normal traffic. T3 Transit's Route 3 connects Cornwall to Charlottetown's downtown core throughout the day.",
      },
    ],
    nearbyLocationIds: ["charlottetown", "victoria-park", "fox-meadow-golf", "confederation-bridge"],
  },
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
  summerside: {
    slug: "summerside",
    locationId: "summerside",
    displayName: "Summerside",
    lede:
      "Live conditions, tides, and outdoor verdicts for Summerside, PEI — the Island's second city on Bedeque Bay.",
    officialSiteUrl: "https://www.summerside.ca",
    parksAndTrailsUrl: "https://www.summerside.ca/residents/recreation-and-parks",
    heroImagePath: "/summerside-hero.webp",
    heroImageAlt: "Summerside Waterfront boardwalk along Bedeque Bay at sunset",
    intelSpots: [
      {
        key: "bedeque-bay-wind",
        label: "Bedeque Bay wind",
        kind: "wind-commute",
        sourceLocationId: "summerside",
        note: "Live wind from the Summerside observation station — the closest active station to the bay waterfront and downtown.",
      },
      {
        key: "bedeque-bay-water",
        label: "Bedeque Bay water temperature",
        kind: "water-temp",
        buoyId: "C44137",
        note: "Live read from the Northumberland Strait DFO buoy — Bedeque Bay opens directly onto the Strait.",
      },
      {
        key: "rotary-trail",
        label: "Rotary Friendship Park trail",
        kind: "trail-status",
        note: "Walking verdict for the paved waterfront trail, scored against current Summerside conditions.",
      },
      {
        key: "next-tide",
        label: "Next Summerside tide",
        kind: "tide",
        note: "DFO tide prediction for the Charlottetown station — Bedeque Bay tides run roughly 20 minutes later.",
      },
    ],
    beaches: [
      {
        id: "linkletter-beach",
        name: "Linkletter Provincial Park Beach",
        address: "Route 11, Linkletter, PE",
        lat: 46.3583,
        lng: -63.8411,
        description:
          "The most popular beach near Summerside — managed provincial park on the south shore of Bedeque Bay with a long red-sand shoreline, warm Northumberland Strait water, and full amenities.",
        amenities: ["Washrooms", "Showers", "Parking", "Picnic tables", "Change rooms"],
      },
      {
        id: "cedar-dunes",
        name: "Cedar Dunes Provincial Park Beach",
        address: "Route 14, West Point, PE",
        lat: 46.6186,
        lng: -64.0711,
        description:
          "A 45-minute drive west of Summerside but worth it — a wide red-sand beach at the tip of the Island with the iconic West Point Lighthouse and warm Gulf water.",
        amenities: ["Washrooms", "Showers", "Playground", "Parking", "Lighthouse inn on site"],
      },
      {
        id: "summerside-rotary-beach",
        name: "Rotary Friendship Park Waterfront",
        address: "Rotary Drive, Summerside, PE",
        lat: 46.3889,
        lng: -63.7917,
        description:
          "Summerside's downtown waterfront — a paved walking trail along Bedeque Bay with harbour views, public art, and a small beach area popular for evening walks.",
        amenities: ["Parking", "Washrooms seasonal", "Picnic tables"],
      },
    ],
    parks: [
      {
        id: "rotary-friendship-park",
        name: "Rotary Friendship Park",
        address: "Rotary Drive, Summerside, PE",
        highlights: "Summerside's signature waterfront park — a 3 km paved trail loop along Bedeque Bay, bandshell, splash pad, and the city's main festival grounds.",
        trailKm: 3,
      },
      {
        id: "credit-union-place-grounds",
        name: "Credit Union Place Park",
        address: "511 Notre Dame Street, Summerside, PE",
        highlights: "Outdoor plaza beside the main arena with walking paths, community garden, and open green space.",
      },
      {
        id: "memorial-park",
        name: "Memorial Park",
        address: "Summer Street, Summerside, PE",
        highlights: "Downtown Summerside's central park — trees, benches, a monument, and the heart of summer events.",
      },
      {
        id: "wyatt-heritage",
        name: "Wyatt Centre Heritage Cultural District",
        address: "Spinnaker Drive, Summerside, PE",
        highlights: "Restored 19th-century buildings with public green space fronting Bedeque Bay — venue for theatre and cultural events.",
      },
      {
        id: "sunfish-pond-park",
        name: "Sunfish Pond Nature Park",
        address: "MacEwen Road, Summerside, PE",
        highlights: "Quiet nature park with a small pond, boardwalk sections, and bird habitat — popular with local birders and dog walkers.",
        trailKm: 1.5,
      },
    ],
    faqs: [
      {
        q: "What's the weather like in Summerside, PEI right now?",
        a: "Summerside has its own Environment Canada weather station, so the temperature, wind, UV index, and air quality on this page reflect conditions measured directly in the city. The OpenAir verdict at the top translates those readings into a plain-English call on whether right now is good for outdoor plans.",
      },
      {
        q: "Which beach near Summerside is best for swimming today?",
        a: "Linkletter Provincial Park is the closest managed beach — 15 minutes west on Route 11 with warm Bedeque Bay water and full facilities. Cedar Dunes Provincial Park at West Point is a longer drive but has some of the best swimming on the Island. The beach cards on this page show live conditions for each, so pick the one with the best Go/Caution/Skip rating right now.",
      },
      {
        q: "Is the Rotary Friendship Park trail open today?",
        a: "The Rotary Friendship Park waterfront trail is open year-round, with the paved 3 km loop accessible in all seasons. We surface live wind, UV, and rainfall on this page so you can see if it's a comfortable day for the walk before heading out.",
      },
      {
        q: "What parks and trails are in Summerside?",
        a: "Summerside's main outdoor spaces are Rotary Friendship Park (3 km waterfront trail), Memorial Park downtown, the Wyatt Heritage Cultural District waterfront, Credit Union Place Park, and Sunfish Pond Nature Park. The Confederation Trail also runs through Summerside, connecting east across the Island.",
      },
      {
        q: "How windy is Bedeque Bay today?",
        a: "We pull the live wind reading from the Summerside observation station, the closest active site to the bay. Sustained winds above 40 km/h make the exposed waterfront trail noticeably gusty; above 60 km/h, Linkletter Beach and the open bay shore can be uncomfortable for anything but photography.",
      },
      {
        q: "What's the next high tide in Summerside?",
        a: "Summerside uses Charlottetown harbour tide predictions from Fisheries and Oceans Canada — the closest official station, with Bedeque Bay tides running roughly 20 minutes later. The next high and low tide times appear in the Summerside intel block on this page, updated throughout the day.",
      },
      {
        q: "When does the sun rise and set in Summerside?",
        a: "Sunrise and sunset times update daily on this page, calculated for Summerside's coordinates (46.389°N, 63.791°W). In peak summer, expect daylight from before 5:30 AM until nearly 9:30 PM; in midwinter, the window narrows to roughly 7:50 AM to 4:20 PM.",
      },
      {
        q: "Is Summerside on the Confederation Trail?",
        a: "Yes — the Confederation Trail runs through Summerside and connects to the island-wide network. The paved section from the city links east toward Charlottetown and west toward Tignish across flat, car-free terrain. Live conditions for the nearest trail section appear on the Confederation Trail page.",
      },
      {
        q: "How far is Summerside from Charlottetown?",
        a: "Summerside is about 71 kilometres west of Charlottetown along the Trans-Canada Highway (Route 1) — roughly a 50-minute drive. T3 Transit's regional routes connect the two cities on weekdays.",
      },
    ],
    nearbyLocationIds: ["confederation-trail", "confederation-bridge", "charlottetown"],
  },
};

export function getTownProfile(slug: string): TownProfile | null {
  return TOWN_PROFILES[slug] ?? null;
}
