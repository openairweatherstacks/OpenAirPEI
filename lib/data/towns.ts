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
  "tea-hill": {
    slug: "tea-hill",
    locationId: "stratford",
    displayName: "Tea Hill Provincial Park",
    lede:
      "Live beach conditions, water temperature, and tide times for Tea Hill Provincial Park — Stratford's red-sand beach on Hillsborough Bay.",
    officialSiteUrl: "https://www.tourismpei.com/provincial-parks/tea-hill-provincial-park",
    parksAndTrailsUrl: "https://www.tourismpei.com/provincial-parks/tea-hill-provincial-park",
    heroImagePath: "/tea-hill-hero.jpg",
    heroImageAlt: "Tea Hill Provincial Park beach and Hillsborough Bay, Stratford PEI",
    intelSpots: [
      {
        key: "hillsborough-wind",
        label: "Hillsborough Bay wind",
        kind: "wind-commute",
        sourceLocationId: "charlottetown",
        note: "Crosswind reading from Charlottetown harbour — the closest active station to Tea Hill's open bay shoreline.",
      },
      {
        key: "tea-hill-water",
        label: "Hillsborough Bay water temperature",
        kind: "water-temp",
        buoyId: "C44137",
        note: "Live read from the Northumberland Strait DFO buoy — Hillsborough Bay connects directly to the Strait.",
      },
      {
        key: "next-tide",
        label: "Next Charlottetown harbour tide",
        kind: "tide",
        note: "DFO tide prediction for the Charlottetown station, the closest official tide gauge to Tea Hill.",
      },
    ],
    beaches: [
      {
        id: "tea-hill-main",
        name: "Tea Hill Beach",
        address: "492 Keppoch Road, Stratford, PE C1B 2J9",
        lat: 46.175,
        lng: -63.098,
        description:
          "A long sweep of red PEI sand fronting Hillsborough Bay — managed provincial park with full amenities, calm bay water warm enough for swimming by July, and a playground behind the dunes.",
        amenities: ["Washrooms", "Showers", "Playground", "Beach volleyball", "Parking", "Picnic tables"],
      },
    ],
    parks: [
      {
        id: "tea-hill-park",
        name: "Tea Hill Provincial Park",
        address: "492 Keppoch Road, Stratford, PE",
        highlights: "PEI's most popular family beach in the Charlottetown area — red sand, calm bay swimming, full amenities, and a playground. Open mid-May through early October.",
        trailKm: 1,
      },
    ],
    faqs: [
      {
        q: "Is Tea Hill Beach open today?",
        a: "Tea Hill Provincial Park runs mid-May through early October, with seasonal amenities (washrooms, showers, playground) available throughout. The beach itself is accessible year-round on foot. The OpenAir live verdict at the top of this page tells you whether conditions are good for swimming, beach walking, or staying home.",
      },
      {
        q: "What's the water temperature at Tea Hill Beach today?",
        a: "We pull a live water temperature reading from the Northumberland Strait DFO buoy — the same body of water that feeds Hillsborough Bay. Typical range is 15–22°C in July and August. The current reading appears in the intel block on this page.",
      },
      {
        q: "What's the weather at Tea Hill Beach right now?",
        a: "Tea Hill shares the Charlottetown weather station across Hillsborough Bay, so the temperature, wind, UV, and air quality on this page reflect what you'll feel on the beach. The OpenAir verdict at the top translates those readings into a plain-English swimming and beach call.",
      },
      {
        q: "Is Tea Hill Beach good for kids?",
        a: "Tea Hill is one of the best family beaches near Charlottetown — calm Hillsborough Bay water, no riptides, warm sand, a playground, and full washroom facilities. The water warms up faster than the north shore because the bay is more sheltered from the Gulf. Current water temp and UV index are on this page.",
      },
      {
        q: "What's the next high tide at Tea Hill?",
        a: "Tea Hill uses the Charlottetown harbour tide table from Fisheries and Oceans Canada — the closest official station. High tide brings deeper, calmer water for swimming; low tide exposes a wider beach and tide pools. The next high and low tide times appear in the intel block on this page.",
      },
      {
        q: "How far is Tea Hill from Charlottetown?",
        a: "Tea Hill Provincial Park is about 15 minutes from downtown Charlottetown — cross the Hillsborough Bridge into Stratford and follow Keppoch Road south. Free parking on site.",
      },
      {
        q: "Are dogs allowed at Tea Hill Beach?",
        a: "Dogs are generally not permitted on the managed beach area during the day in peak season (late June through Labour Day). Outside those hours and off-season, dogs on leash are usually welcome. Check with provincial parks for the current season's rules before you go.",
      },
    ],
    nearbyLocationIds: ["stratford", "charlottetown", "victoria-park", "belvedere-golf"],
  },
  kensington: {
    slug: "kensington",
    locationId: "kensington",
    displayName: "Kensington",
    lede:
      "Live conditions, tides, and outdoor verdicts for Kensington, PEI — the Island's fastest-growing town, home to the Confederation Trail trailhead and rolling potato-country farmland.",
    officialSiteUrl: "https://kensington.ca",
    parksAndTrailsUrl: "https://kensington.ca",
    intelSpots: [
      {
        key: "route-2-wind",
        label: "Route 2 wind",
        kind: "wind-commute",
        sourceLocationId: "kensington",
        note: "Wind reading from the Summerside observation station — the closest active station to the Route 2 corridor through Kensington.",
      },
      {
        key: "confederation-trail-status",
        label: "Confederation Trail (Kensington trailhead)",
        kind: "trail-status",
        note: "Walking and cycling verdict for the Confederation Trail crushed-gravel surface, scored against current Kensington conditions.",
      },
      {
        key: "next-tide",
        label: "Next Summerside tide",
        kind: "tide",
        note: "DFO tide prediction for the Summerside station — the closest official tide gauge to Kensington.",
      },
    ],
    beaches: [
      {
        id: "north-shore-stanley-bridge",
        name: "Stanley Bridge Beach",
        address: "Stanley Bridge, PE C0A 1E0",
        lat: 46.4856,
        lng: -63.5533,
        description:
          "A quiet north-shore beach about 10 km from Kensington — red PEI sand at the mouth of the Stanley River estuary. Calm Gulf water, good for families and wading. No formal facilities.",
        amenities: ["Informal parking", "Beach access"],
      },
      {
        id: "cavendish-20min",
        name: "Cavendish Beach (20 min)",
        address: "Cavendish, PE C0A 1N0",
        lat: 46.4943,
        lng: -63.3971,
        description:
          "Kensington's closest managed beach — a 20-minute drive northeast. Full PEI National Park amenities, red sand, and the warmest Gulf water on the north shore.",
        amenities: ["Washrooms", "Showers", "Parking (fee)", "Lifeguards in season", "Canteen"],
      },
      {
        id: "linkletter-beach-kensington",
        name: "Linkletter Provincial Park Beach (25 min)",
        address: "Route 11, Linkletter, PE",
        lat: 46.3583,
        lng: -63.8411,
        description:
          "The closest south-shore beach to Kensington — a 25-minute drive toward Summerside. Long red sand, warm Northumberland Strait water, full amenities.",
        amenities: ["Washrooms", "Showers", "Parking", "Picnic tables"],
      },
    ],
    parks: [
      {
        id: "confederation-trail-kensington",
        name: "Confederation Trail — Kensington Trailhead",
        address: "Victoria Street East, Kensington, PE",
        highlights: "The Island's flagship cycling and walking trail — flat, car-free crushed gravel running the full length of PEI. The Kensington trailhead is the most central on-ramp on the central route.",
        trailKm: 450,
      },
      {
        id: "kensington-park",
        name: "Kensington Town Park",
        address: "Victoria Street, Kensington, PE",
        highlights: "The town's central green space — playground, picnic area, and community gathering spot used for the annual Harvest Festival.",
      },
      {
        id: "credit-union-centre-kensington",
        name: "Credit Union Centre (EVK Memorial Pool)",
        address: "Kensington, PE",
        highlights: "Kensington's main recreation facility — indoor pool, fitness centre, and the town's hub for year-round physical activity.",
      },
      {
        id: "heritage-park-kensington",
        name: "Kensington Heritage Area",
        address: "Broadway Street, Kensington, PE",
        highlights: "The Kensington Heritage Library and surrounding green space — a quiet corner of the downtown for a short walk or a sit.",
      },
    ],
    faqs: [
      {
        q: "What's the weather like in Kensington, PEI right now?",
        a: "Kensington uses the Summerside weather station, about 25 kilometres to the west — the closest active Environment Canada observation site. Temperature, wind, UV index, and air quality on this page reflect what you'll feel in town. The OpenAir verdict at the top translates those readings into a plain-English call on whether now is good for outdoor plans.",
      },
      {
        q: "Is the Confederation Trail open near Kensington today?",
        a: "The Confederation Trail is open year-round for walking and cycling. The crushed-gravel surface dries quickly after rain and handles shoulder-season conditions well. We surface live wind, UV, and rainfall on this page so you can see whether it's a comfortable day for the trail before you head to the trailhead on Victoria Street East.",
      },
      {
        q: "Which beach near Kensington is best for swimming today?",
        a: "Cavendish Beach in PEI National Park is the most popular managed beach, about 20 minutes northeast with full amenities and warm Gulf water. Stanley Bridge Beach is closer and quieter, good for wading. Linkletter Provincial Park Beach near Summerside is the best south-shore option. The beach cards on this page show live conditions for each.",
      },
      {
        q: "What is there to do in Kensington, PEI?",
        a: "Kensington is the best base on the Island for the Confederation Trail — flat, car-free cycling in either direction through potato-country farmland. The town also hosts the Harvest Festival each fall, has the EVK Memorial Pool at the Credit Union Centre for rainy-day recreation, and sits 20 minutes from Cavendish Beach and the north shore.",
      },
      {
        q: "When is the Kensington Harvest Festival?",
        a: "The Kensington Harvest Festival runs annually in late September or early October, celebrating the Island's potato harvest with local food, live music, and community events in the town park. Check kensington.ca for the current year's dates. Weather for festival weekend appears at the top of this page.",
      },
      {
        q: "What's the next high tide near Kensington?",
        a: "Kensington is inland, but the closest tide reading is from the Summerside station on Fisheries and Oceans Canada — the gateway to Bedeque Bay, about 25 km west. Tide times appear in the intel block on this page, useful for planning a beach trip to the coast.",
      },
      {
        q: "When does the sun rise and set in Kensington?",
        a: "Sunrise and sunset times update daily on this page, calculated for Kensington's coordinates (46.443°N, 63.640°W). In peak summer, expect daylight from before 5:30 AM until after 9:00 PM; in midwinter, the window narrows to roughly 7:50 AM to 4:25 PM.",
      },
      {
        q: "How far is Kensington from Charlottetown?",
        a: "Kensington is about 53 kilometres west of Charlottetown along Route 2 — roughly a 40-minute drive. It sits almost exactly halfway between Charlottetown and the Confederation Bridge, making it a natural stopping point on a cross-island trip.",
      },
      {
        q: "How far is Kensington from Summerside?",
        a: "Kensington is about 25 kilometres east of Summerside along Route 2 — a 20-minute drive. Bedeque Bay and the Summerside waterfront are the nearest coastal options when the weather calls for it.",
      },
      {
        q: "Is Kensington good for cycling?",
        a: "It's one of the best cycling bases on the Island. The Confederation Trail trailhead on Victoria Street East puts you directly onto 450 km of flat, car-free crushed gravel in either direction — east toward Charlottetown or west toward Summerside and beyond. Live cycling conditions are scored on this page against current wind, UV, and precipitation.",
      },
    ],
    nearbyLocationIds: ["confederation-trail", "summerside", "cavendish", "confederation-bridge"],
  },
  "st-stephen": {
    slug: "st-stephen",
    locationId: "st-stephen-nb",
    displayName: "St. Stephen",
    lede:
      "Live weather conditions, parks, and outdoor verdicts for St. Stephen, New Brunswick — the chocolate capital of Canada on the St. Croix River.",
    officialSiteUrl: "https://town.ststephen.nb.ca",
    parksAndTrailsUrl: "https://town.ststephen.nb.ca/recreation",
    heroImagePath: "/ststephen.jpg",
    heroImageAlt: "St. Stephen, New Brunswick waterfront along the St. Croix River",
    intelSpots: [
      {
        key: "st-croix-wind",
        label: "St. Croix River wind",
        kind: "wind-commute",
        sourceLocationId: "st-stephen-nb",
        note: "Live wind from the St. Stephen observation station — key for the exposed river corridor and the international bridge crossing.",
      },
      {
        key: "st-croix-trail",
        label: "St. Croix Waterfront Trail",
        kind: "trail-status",
        note: "Walking verdict for the riverfront trail, scored against current St. Stephen conditions.",
      },
      {
        key: "next-tide",
        label: "Next St. Croix River tide",
        kind: "tide",
        note: "The St. Croix River is tidal — tide times from the nearest DFO gauge affect riverfront access and trail conditions.",
      },
    ],
    beaches: [],
    parks: [
      {
        id: "milltown-boardwalk",
        name: "Milltown Boardwalk & Waterfront Trail",
        address: "Milltown Boulevard, St. Stephen, NB",
        highlights: "A scenic riverfront boardwalk along the St. Croix River — the town's flagship walking route with views across to Calais, Maine.",
        trailKm: 2,
      },
      {
        id: "ganong-nature-park",
        name: "Ganong Nature Park",
        address: "Ganong Drive, St. Stephen, NB",
        highlights: "Named after the famous local chocolate family — forested walking trails and natural areas on the edge of town.",
        trailKm: 3,
      },
      {
        id: "st-stephen-memorial-garden",
        name: "Memorial Garden",
        address: "King Street, St. Stephen, NB",
        highlights: "Downtown park with gardens, benches, and war memorial — a quiet stop in the heart of the town centre.",
      },
      {
        id: "chocolate-museum-grounds",
        name: "Ganong Chocolatier Museum Grounds",
        address: "73 Milltown Boulevard, St. Stephen, NB",
        highlights: "The historic chocolate factory grounds — a cultural landmark and the centrepiece of the annual Chocolate Festival.",
      },
    ],
    faqs: [
      {
        q: "What's the weather like in St. Stephen, NB right now?",
        a: "St. Stephen sits in the St. Croix River valley on the New Brunswick–Maine border. The river valley can trap fog overnight and funnel wind along the corridor. The OpenAir verdict at the top of this page pulls live data from the St. Stephen observation station and translates it into a plain-English outdoor call.",
      },
      {
        q: "What outdoor activities are available in St. Stephen?",
        a: "The Milltown Boardwalk along the St. Croix River is the town's flagship walk — flat, paved, and scenic with views across to Calais, Maine. Ganong Nature Park has 3 km of forested trails. The Chocolate Trail connects cultural stops through the downtown. Live conditions for walking are scored on this page.",
      },
      {
        q: "When is the St. Stephen Chocolate Festival?",
        a: "The Chocolate Festival runs annually in August and celebrates St. Stephen's Ganong Bros. chocolate-making heritage — one of the oldest candy companies in Canada. The festival draws visitors from both sides of the border. Weather for the festival window appears at the top of this page.",
      },
      {
        q: "How does weather in St. Stephen compare to Fredericton or Saint John?",
        a: "St. Stephen is on the southwest coast of NB, which gives it milder winters than Fredericton (inland) but more fog than Saint John (open Bay of Fundy). The St. Croix valley traps cold air overnight in spring and fall, making morning temperatures feel sharper than the afternoon. Live readings on this page reflect those local patterns.",
      },
      {
        q: "Is the international bridge to Calais, Maine open today?",
        a: "The St. Stephen–Calais international bridge is operated by the Canada Border Services Agency and US Customs and Border Protection. OpenAir doesn't carry border wait times, but live wind conditions on this page are relevant if you're crossing on foot or by bike — the bridge deck is exposed to river crosswinds.",
      },
      {
        q: "What is there to do near St. Stephen, NB?",
        a: "St. Andrews by-the-Sea is a 45-minute drive south — a historic resort town on Passamaquoddy Bay with whale-watching tours, the Fairmont Algonquin, and a beautiful shoreline. St. George and the Fundy Isles ferry terminal at Black's Harbour are also within an hour. Live conditions for St. Stephen appear on this page; neighbouring destinations are worth checking before you go.",
      },
    ],
    nearbyLocationIds: ["confederation-bridge", "summerside", "charlottetown"],
  },
};

export function getTownProfile(slug: string): TownProfile | null {
  return TOWN_PROFILES[slug] ?? null;
}
