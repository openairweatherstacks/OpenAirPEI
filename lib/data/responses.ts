// Pre-written condition responses per location.
// Key format: `${score}_${rainState}_${windFeel}`
//
// score:     excellent | good | fair | stay_inside
// rainState: none | incoming_120min | incoming_60min | incoming_30min | raining_now
// windFeel:  calm | light | breezy | gusty | dangerous
//
// Each key holds 5 variants — the app picks one at random so it never feels stale.
// Claude is still called for combinations not covered here.

export interface TemplateResponse {
  headline: string;
  summary: string;
  insight: string;
}

export type ResponseTemplates = Record<string, TemplateResponse[]>;

// ─── CAVENDISH BEACH ────────────────────────────────────────────────────────

const cavendish: ResponseTemplates = {
  excellent_none_calm: [
    {
      headline: "Cavendish is as good as it gets.",
      summary: "Red sand, warm gulf water, zero wind — this is the day you came to PEI for. Swim, walk the dunes, take your time. Conditions hold all afternoon.",
      insight: "The east end past the campground is half as crowded and just as beautiful. Walk 10 minutes and you'll feel like you have the beach to yourself.",
    },
    {
      headline: "Perfect beach day. Go now.",
      summary: "Calm, warm, and clear across the north shore. Water is comfortable and the sand is dry. Don't overthink it — this is the window.",
      insight: "Water at Cavendish is warmest in the last two weeks of July. If you're here now, you're hitting the sweet spot of the whole season.",
    },
    {
      headline: "North shore is firing right now.",
      summary: "Ideal conditions at Cavendish — comfortable temperature, flat water, clean air. Best swimming window of the week. Get there before the afternoon crowd peaks around noon.",
      insight: "Staying low in the dunes cuts any residual breeze completely. Locals spread out along the base of the dune line rather than the open flat.",
    },
    {
      headline: "Cavendish is dialled in today.",
      summary: "Everything lines up this morning — temp, wind, water. No rain on the horizon for hours. Go early for parking, stay as long as you want.",
      insight: "The boardwalk access at the west end of the main beach avoids the main lot entirely and drops you right at the quieter stretch.",
    },
    {
      headline: "Red sand and nothing stopping you.",
      summary: "Clean conditions across the board at Cavendish. Calm water, warm air, no incoming weather. This is a full-day beach window — use it.",
      insight: "The dune grass holds the sand in place — step over, not through, and the beach stays beautiful for everyone after you.",
    },
  ],

  excellent_none_light: [
    {
      headline: "Light breeze, perfect beach day.",
      summary: "A gentle onshore breeze keeps it comfortable without blowing your umbrella over. Water is warm, conditions are excellent. Head out now.",
      insight: "East end of Cavendish past the campground catches the breeze best and stays cooler on hot days — locals' favourite stretch.",
    },
    {
      headline: "Cavendish is in great shape.",
      summary: "Light wind from the southwest makes it feel fresher than the temperature alone. Swimming is ideal, the sand is firm, and you've got a long window of good conditions.",
      insight: "A light southwest wind means the water on the west side of the beach is slightly calmer. Good for kids and casual swimmers.",
    },
    {
      headline: "Go. Conditions are excellent.",
      summary: "Everything is working at Cavendish right now. Light breeze, warm water, clean air. No weather coming in for hours. Pack a lunch and stay.",
      insight: "Park at the Cavendish Campground lot if the main entrance is backed up — 5-minute walk to the same beach, usually half the crowd.",
    },
    {
      headline: "Best north shore window of the week.",
      summary: "Excellent conditions with a pleasant light breeze keeping the heat manageable. Water temperature is comfortable and surf is flat. Classic PEI beach day.",
      insight: "The warmest water on the whole north shore is usually in the shallow tidal pools east of the main beach — perfect for small kids.",
    },
    {
      headline: "Light wind, warm gulf, no excuses.",
      summary: "Cavendish is fully on today. Comfortable in every direction — air, water, and wind. Crowds build after 11am so earlier is better.",
      insight: "Morning light on the red sand cliffs east of Cavendish is worth the early start even if you never swim — photographers come from across the island for it.",
    },
  ],

  good_none_breezy: [
    {
      headline: "Bit gusty but still a great beach day.",
      summary: "Wind is up at 30–35 km/h off the water, which means umbrella owners will fight it and kite flyers will love it. Swimming is fine — just expect some chop. Stake your umbrella low or leave it in the car.",
      insight: "On breezy days the lee side of the main dune ridge is dead calm. Walk to the dune base and you'll lose the wind entirely.",
    },
    {
      headline: "Windy, worth it — go prepared.",
      summary: "North shore breeze is up today. The beach is still excellent for walking and swimming but bring a windbreaker and skip the beach umbrella. Surf is lively and fun.",
      insight: "Breezy north shore days push warm surface water toward the beach — the gulf water actually feels warmer when it's windy like this.",
    },
    {
      headline: "Cavendish is lively today.",
      summary: "A proper breeze off the gulf makes it feel more dynamic than a calm day. Water is choppier but still very swimmable. Towels and hats need weighing down.",
      insight: "The section of beach directly in front of the main parking lot takes the full force of north winds. Head east 200m for a noticeably calmer spot.",
    },
    {
      headline: "Good beach day — wind is the trade-off.",
      summary: "Conditions are solid overall with one catch: 35 km/h northwest wind makes the open beach breezy. Still worth going — just stay low and pack light.",
      insight: "Locals call these 'kite days' — the beach gets less crowded when it's breezy, which is actually when the regulars prefer it.",
    },
    {
      headline: "Worth the trip, bring a layer.",
      summary: "Cavendish is good today despite the wind. Surf is up, air is fresh, and it's genuinely enjoyable if you dress for it. Skip the parasol and lean into the energy.",
      insight: "The dune system acts as a massive windbreak. Sitting against the dune face rather than out in the open flat cuts the wind by more than half.",
    },
  ],

  good_incoming_120min: [
    {
      headline: "Good window — rain arrives in 2 hours.",
      summary: "Conditions are excellent right now but rain is tracking in. You have a solid two-hour window. Go now, plan to wrap up by then.",
      insight: "The Cavendish parking lot clears fast when rain starts — if you time your exit right, leaving just before the rain means smooth sailing out.",
    },
    {
      headline: "Go now, leave before the rain.",
      summary: "A clean two-hour window at Cavendish before showers arrive. Water is warm, conditions are comfortable. Head out immediately and keep an eye on the sky to the west.",
      insight: "Rain often holds off 20–30 minutes longer on the beach than it does inland — the gulf air slows the front slightly as it crosses the north shore.",
    },
    {
      headline: "Two good hours — use them.",
      summary: "Right now Cavendish is in great shape. Rain is coming but not for another two hours. A swim, a walk, a picnic — you have time. Start wrapping up at the 90-minute mark.",
      insight: "If you see the sky darkening to the west over the dunes, that's your 20-minute warning. The fronts that hit Cavendish come from that direction.",
    },
    {
      headline: "Solid beach window before the front.",
      summary: "Two hours of excellent conditions ahead. Surf is calm, temperature is comfortable, air is clean. Rain will end the party — make the most of the window you have.",
      insight: "The interpretation centre at the east end of Cavendish National Park makes a good rain shelter if you get caught — worth knowing before you head out.",
    },
    {
      headline: "Cavendish now — don't wait.",
      summary: "Good conditions with a time limit. Rain arrives in roughly two hours and it's worth beating. Get in the water, get your walk done, then head for food before the front hits.",
      insight: "Cavendish has great covered picnic shelters at the main beach — booking one in advance means rain just becomes atmosphere, not a reason to leave.",
    },
  ],

  good_incoming_60min: [
    {
      headline: "Quick swim — rain's 60 minutes out.",
      summary: "You have about an hour before conditions soften. A fast beach visit is absolutely worth it — just keep it short. Be back at the car before the front arrives.",
      insight: "The main parking lot can take 15 minutes to exit on a busy day. Factor that into your timing so you're not stuck in the lot when the rain hits.",
    },
    {
      headline: "Go fast — rain arrives around the hour.",
      summary: "Conditions are still good right now but the window is closing. A swim or a walk is completely doable — just don't linger. Watch the western sky.",
      insight: "When the wind suddenly drops and shifts direction at Cavendish, that's the front arriving. You'll have about 10 minutes before the rain starts after that.",
    },
    {
      headline: "One hour window. Worth it.",
      summary: "Beach is in solid shape right now. Rain is 60 minutes out. A quick swim and a walk is achievable — skip the full setup and just go light.",
      insight: "On short visits, the east end of Cavendish is better — parking is easier, shorter walk, and you can be in and out faster.",
    },
    {
      headline: "Move fast — rain is close.",
      summary: "Good conditions right now with rain arriving within the hour. A short beach trip is on the table. Go now, keep it tight, and you'll beat the weather.",
      insight: "The Cavendish boardwalk offers a dry 10-minute walk back to the lot under tree cover on the inland side — use it if rain catches you early.",
    },
    {
      headline: "Beach yes — keep it short.",
      summary: "You've got enough time for a proper beach visit before the rain moves in. Don't set up for the whole day. Go, enjoy an hour, and leave satisfied.",
      insight: "Local tip: the best part of a short Cavendish visit is the boardwalk and the view from the dune crest. You don't need more than 45 minutes to get the full experience.",
    },
  ],

  fair_raining_now_gusty: [
    {
      headline: "Cavendish is getting hammered.",
      summary: "Rain and gusty wind have taken over the north shore. Not a beach situation right now. Save it for tomorrow or head inland to Charlottetown for the afternoon.",
      insight: "When Cavendish is blown out, the Anne of Green Gables Heritage Place is 10 minutes away and completely sheltered — locals use it exactly this way.",
    },
    {
      headline: "Not today at Cavendish.",
      summary: "Wind and rain are making a mess of the north shore right now. The beach is unpleasant and conditions aren't improving soon. Best to pivot to an indoor option.",
      insight: "The Cavendish area has three excellent indoor options locals fall back on: the Wax Museum, Studio 6 mini golf, and Cows Creamery — all within 5 minutes.",
    },
    {
      headline: "Skip it — north shore is rough.",
      summary: "Gusty wind and active rain at Cavendish. This one isn't a quick wait-it-out situation — the front is sitting on the north shore. Come back tomorrow.",
      insight: "After a heavy north shore blow, the red sand shifts and the beach often looks dramatically different — sometimes better. Post-storm Cavendish is worth seeing.",
    },
    {
      headline: "Rain and wind — come back later.",
      summary: "Active precipitation and gusts are making Cavendish unworkable right now. This isn't borderline — it's a proper skip. Head south toward Charlottetown where conditions are better.",
      insight: "The south shore (Victoria, Argyle Shore) is almost always drier when the north shore is getting hit. It's a 40-minute drive but a completely different weather story.",
    },
    {
      headline: "North shore is closed for business.",
      summary: "Cavendish is taking a beating right now. Rain and strong gusts have made the beach uncomfortable and the water rough. Hold off until the system moves through.",
      insight: "North shore fronts typically move through in 2–4 hours. Check conditions again after lunch — Cavendish can flip from rough to beautiful surprisingly fast.",
    },
  ],

  stay_inside_raining_now_dangerous: [
    {
      headline: "Stay away from Cavendish today.",
      summary: "Dangerous wind and heavy rain on the north shore. This is a real weather event — not a beach inconvenience. Stay inland and wait it out.",
      insight: "Storm surge on the north shore can push water surprisingly far up the beach during strong northeast blows. The dunes take a beating in these events — the park closes sections for safety.",
    },
    {
      headline: "Cavendish is not safe right now.",
      summary: "Active severe weather on the north shore. High wind and heavy precipitation make beach access genuinely dangerous. Environment Canada has this area flagged — stay clear.",
      insight: "After major storms, Cavendish beach often reveals unexpected things — fossils, sand dollar beds, unusual shells. The day after a big blow is one of the best beach walks of the year.",
    },
  ],
};

// ─── CHARLOTTETOWN WATERFRONT ────────────────────────────────────────────────

const charlottetown: ResponseTemplates = {
  excellent_none_calm: [
    {
      headline: "Waterfront is perfect right now.",
      summary: "Calm, warm, and ideal for the boardwalk. The harbour is flat and the whole waterfront strip is open for business. Walk Peake's Wharf, grab something on Victoria Row, take your time.",
      insight: "Peake's Wharf faces southwest and catches the evening sun longer than anywhere else on the waterfront. The best sunset spot in the city is right at the end of the dock.",
    },
    {
      headline: "Best conditions for a harbour walk.",
      summary: "Everything is working on the Charlottetown waterfront today. Comfortable temperature, calm air, great visibility across the harbour. Perfect for cycling, walking, or just sitting on the dock.",
      insight: "The harbour breeze usually picks up around 2–3pm on calm days, creating a natural cooling effect that makes the afternoon waterfront feel fresher than anywhere else in the city.",
    },
    {
      headline: "Go spend time on the waterfront.",
      summary: "Excellent conditions across the board. The boardwalk is ideal, dining on the patios is comfortable, and the harbour is beautiful right now. One of those rare days where Charlottetown feels like a European city.",
      insight: "The boardwalk between Confederation Landing and Peake's Wharf is one of the flattest, most accessible stretches of public space in the Maritimes — locals forget how good it actually is.",
    },
    {
      headline: "Charlottetown waterfront is on today.",
      summary: "Clean weather, comfortable temperature, and no incoming changes for hours. The waterfront is fully alive right now — this is when the city shows its best side.",
      insight: "The Charlottetown Farmers Market on Saturday mornings is worth pairing with a waterfront walk — it's four blocks from Peake's Wharf and done by noon.",
    },
    {
      headline: "City weather is as good as it gets.",
      summary: "Ideal conditions for everything on the waterfront — cycling, walking, dining outside. No wind to fight, no rain to dodge. Stay as long as you want.",
      insight: "The waterfront is significantly more sheltered than the north shore beaches on most days — when Cavendish is breezy, Charlottetown feels calm. Today both are excellent.",
    },
  ],

  excellent_none_light: [
    {
      headline: "Light breeze, great harbour day.",
      summary: "A gentle wind off the harbour makes the waterfront feel alive without being uncomfortable. Perfect for patio dining or a long boardwalk ride. Go and take your time.",
      insight: "The afternoon sea breeze in Charlottetown is a reliable natural event on sunny days — it builds from around 2pm and makes the waterfront the coolest spot in the city.",
    },
    {
      headline: "Waterfront is working well right now.",
      summary: "Light and comfortable conditions on the harbour. Great for everything — cycling the boardwalk, walking to Confederation Landing, eating outside. No weather to worry about today.",
      insight: "Cycling from Peake's Wharf toward Victoria Park along the water is one of the best flat rides in Atlantic Canada. Light wind from the southwest is almost always a tailwind on the way out.",
    },
    {
      headline: "Perfect patio and boardwalk weather.",
      summary: "Excellent conditions with a pleasant light breeze keeping things comfortable. The waterfront restaurants will be at their best right now — book a patio table if you can.",
      insight: "The Charlottetown waterfront gets a distinctive smell of the sea when the wind is light from the south — that's Hillsborough Bay you're picking up. Locals notice it immediately.",
    },
    {
      headline: "Go enjoy the harbour today.",
      summary: "Light breeze and excellent conditions make this one of the better waterfront days of the season. Walk, cycle, eat — conditions hold well into the evening.",
      insight: "The best cycling loop from the waterfront is out to Victoria Park and back along Kent St — about 4km flat, sheltered from wind by the trees through the park section.",
    },
    {
      headline: "Charlottetown is showing off today.",
      summary: "Conditions are excellent on the waterfront. Light wind, comfortable temperature, clear harbour views. This is the version of the city that makes people move here.",
      insight: "On light wind days, the schooner tours from Peake's Wharf are at their best — the boat moves smoothly and the harbour views are unobstructed all the way to Rocky Point.",
    },
  ],

  good_incoming_120min: [
    {
      headline: "Two great hours before the rain.",
      summary: "Waterfront conditions are excellent right now with rain arriving in about two hours. Head out now — the boardwalk, the patios, a harbour walk. You have time to do it properly.",
      insight: "Rain on the Charlottetown waterfront is actually quite pleasant from a covered patio. If you time it right, you're eating outside when it's nice and watching the harbour in the rain with a drink.",
    },
    {
      headline: "Good window — rain by mid-afternoon.",
      summary: "You've got a solid two hours on the waterfront before conditions change. Comfortable right now, rain incoming later. Go enjoy the harbour, wrap up before the front hits.",
      insight: "The covered walkways along Water Street mean you can stay on the waterfront longer than you'd think in light rain — locals barely adjust their plans for drizzle.",
    },
    {
      headline: "Waterfront now — don't wait.",
      summary: "Conditions are great and the clock is ticking. Two hours before rain arrives. A harbour walk, a meal, a bike ride — pick one and go. The front will make the decision for you if you don't.",
      insight: "The Confederation Centre of the Arts is two blocks from the waterfront and makes a perfect rain plan B — check what's on before you head out.",
    },
    {
      headline: "Go now — rain two hours out.",
      summary: "Right now the Charlottetown waterfront is in great condition. Rain is tracked to arrive in about two hours. That's enough time for a proper visit. Get moving.",
      insight: "The waterfront is at its most photogenic in the hour before rain — the light goes dramatic, the harbour surface changes, and the usual tourist crowds thin out.",
    },
    {
      headline: "Solid window on the harbour today.",
      summary: "Good conditions with a two-hour window before the front moves through. Patio dining is comfortable, the boardwalk is clear. Go and keep an eye on the western sky.",
      insight: "When the sky over Charlottetown goes that particular dark blue-grey to the west, you've got about 25 minutes. Locals read it like a clock.",
    },
  ],

  fair_raining_now_breezy: [
    {
      headline: "Waterfront is wet and breezy.",
      summary: "Rain and wind have moved in off the harbour. Not the worst conditions — the city has cover — but the open boardwalk is uncomfortable right now. Head to Victoria Row or the Confederation Centre instead.",
      insight: "Victoria Row under the awnings is one of the best rainy-day spots in Atlantic Canada. Locals barely leave the waterfront area when it rains — they just move one block back.",
    },
    {
      headline: "Rain on the harbour — adjust your plan.",
      summary: "Breezy and wet on the Charlottetown waterfront right now. The open boardwalk isn't pleasant but the city's covered options are a 2-minute walk. This isn't a stay-inside day — just move indoors.",
      insight: "The Charlottetown Farmer's Market covered building on Belvedere Ave is open year-round on Saturday mornings and is one of the best rain shelters in the city.",
    },
    {
      headline: "Wet but the city has you covered.",
      summary: "Rain and a harbour breeze have made the open waterfront uncomfortable. The good news is Charlottetown's indoor waterfront scene — restaurants, galleries, the Confederation Centre — is all within 3 blocks.",
      insight: "The Guild on Queen Street is the kind of place locals end up on rainy afternoons — gallery, café, live performances. Two minutes from the waterfront.",
    },
    {
      headline: "Move off the boardwalk for now.",
      summary: "Active rain and wind on the harbour front. The covered sections of Water Street are fine but the open boardwalk is a wet fight right now. Take shelter and check back in an hour.",
      insight: "Charlottetown rain systems that come off the harbour usually clear in 1–2 hours. The city has enough covered options to wait it out comfortably without going far.",
    },
    {
      headline: "Rain and wind — pivot to covered options.",
      summary: "The waterfront is getting hit right now. Breezy and wet — not dangerous, just unpleasant outside. Great time for the indoor side of Charlottetown: restaurants, shops, the arts scene.",
      insight: "The area around Queen and Richmond Streets is the real heart of Charlottetown on a rainy day — more interesting than the waterfront and all under awnings.",
    },
  ],
};

// ─── GREENWICH DUNES ─────────────────────────────────────────────────────────

const greenwich: ResponseTemplates = {
  excellent_none_calm: [
    {
      headline: "Greenwich is stunning right now.",
      summary: "Calm, clear, and quiet — perfect conditions for the boardwalk and the dunes. The tombolo beach is as good as it gets today. Go early for the best light and the fewest people.",
      insight: "The floating boardwalk through the wetlands is magical before 9am when the mist sits on the water and the birds are most active. Worth the early start.",
    },
    {
      headline: "Best dune conditions of the season.",
      summary: "Excellent across the board at Greenwich. Clear visibility, comfortable temperature, no wind to speak of. The parabolic dunes are at their most impressive on calm clear days like this.",
      insight: "The tombolo — the sandbar connecting the dune system to the island — shifts after every storm. It looks different every visit. Today it's at its most defined.",
    },
    {
      headline: "Greenwich is all yours today.",
      summary: "Quiet, calm, and completely intact. This is what makes Greenwich special — on a calm day with low crowds, it feels like a wilderness that nobody knows about. Walk the full trail.",
      insight: "Greenwich gets a fraction of Cavendish's crowd even on peak days. If you want the PEI beach experience without the parking lot chaos, this is always the answer.",
    },
    {
      headline: "Ideal hiking and beach day.",
      summary: "Perfect conditions for the full Greenwich trail — boardwalk, dunes, and the beach at the end. Allow 2–3 hours. You won't want to rush this one.",
      insight: "The Greenwich Interpretation Centre at the trailhead has a free exhibit on the dune system's geology — worth 15 minutes before the walk, especially if you're with kids.",
    },
    {
      headline: "Go to Greenwich. You'll thank yourself.",
      summary: "Calm, beautiful, and uncrowded. Conditions are excellent for the full trail experience. This is one of the best natural sites in Atlantic Canada and today it's showing it.",
      insight: "The beach at the end of the Greenwich trail faces northeast — on calm days the water is noticeably warmer than the open north shore beaches because it's sheltered from the prevailing wind.",
    },
  ],

  good_none_breezy: [
    {
      headline: "Windy walk but worth every step.",
      summary: "A 30–35 km/h northeast breeze hits the dunes directly but the boardwalk section through the wetlands stays sheltered by the tree line. Full trail is still excellent — just bring a layer.",
      insight: "When east winds blow at Greenwich, the lee side of the dune crest is completely calm. Getting over the dune puts you in a different world — windy approach, dead calm arrival at the beach.",
    },
    {
      headline: "Greenwich is breezy and beautiful.",
      summary: "Wind is up today which actually makes the dune walk more dramatic. The grass is moving, the sand is lifting off the crests, and the beach energy is raw and alive. Bring a windbreaker.",
      insight: "The floating boardwalk is most impressive when the wind is up — the marsh reeds move like a single organism. Birdwatchers love these conditions.",
    },
    {
      headline: "Good trail day despite the wind.",
      summary: "Breezy conditions on the open dune sections but the forested boardwalk approach is sheltered. The beach at the end is lively. This isn't a sit-on-the-sand day — it's a walk-and-move day.",
      insight: "Strong easterly winds push the sand along the tombolo creating visible dune movement — you can actually watch the beach building in real time on days like this.",
    },
    {
      headline: "Windy but the trail is still open.",
      summary: "Northeast wind makes the exposed dune sections brisk. Layer up and enjoy the raw Atlantic conditions — Greenwich is one of those places that's worth seeing in every kind of weather.",
      insight: "The parabolic dune shape funnels wind into the centre of the dune field on east wind days. The edges of the dune stay calmer than the open face.",
    },
    {
      headline: "Bring a windbreaker — trail is great.",
      summary: "Breezy at Greenwich today but the trail is fully worth it. The wetlands section is sheltered and the dune crest views are spectacular in these conditions. Go prepared.",
      insight: "Bald eagles nest near the Greenwich sector and are most visible when the wind is up — they ride the thermals off the dune face effortlessly on days like this.",
    },
  ],

  fair_raining_now_gusty: [
    {
      headline: "Greenwich trail is rough right now.",
      summary: "Gusty wind and rain have made the open dune sections unpleasant. The boardwalk is slippery when wet. Not a good trail day — come back tomorrow when it will look completely different.",
      insight: "After heavy rain, Greenwich is one of the best places on PEI to spot wildlife — deer, foxes, and birds all move through the open dune areas in the hours after a front passes.",
    },
    {
      headline: "Wet and gusty — skip the dunes today.",
      summary: "Rain and gusts at Greenwich make the open sections uncomfortable and the exposed boardwalk unsafe for footing. This is a reschedule, not a push-through situation.",
      insight: "The Interpretation Centre at the trailhead is worth visiting in any weather — 45-minute immersive exhibit on the dune ecosystem, and it's free with a park pass.",
    },
    {
      headline: "Hold off on Greenwich today.",
      summary: "Active rain and gusts hitting the north shore directly. The dune trail is exposed in the worst sections and conditions are genuinely uncomfortable. Tomorrow will be better.",
      insight: "Post-storm Greenwich is one of PEI's great secrets — the tombolo reshapes, fresh sand is revealed, and the light after a frontal passage is extraordinary. Worth the return trip.",
    },
    {
      headline: "Rain and wind — not dune weather.",
      summary: "Greenwich is taking the full force of the north shore front right now. Save the trail for when conditions clear — the payoff is worth the wait.",
      insight: "The drive to Greenwich through the St. Peters Bay area is beautiful even in rain — the tidal inlets and red soil roads look dramatic in grey weather. The destination might wait but the drive doesn't.",
    },
    {
      headline: "Gusty and wet at Greenwich.",
      summary: "Conditions are poor on the north shore. Gusty wind and active rain make the dune trail unworkable. Head inland or south until this front moves through.",
      insight: "St. Peters, 10 minutes from Greenwich, has a good covered wharf and a café that locals use exactly when the north shore parks are inaccessible. Worth knowing.",
    },
  ],
};

// ─── CONFEDERATION TRAIL ─────────────────────────────────────────────────────

const confederationTrail: ResponseTemplates = {
  excellent_none_calm: [
    {
      headline: "Trail is perfect — go ride it.",
      summary: "Calm air, comfortable temperature, and dry crushed limestone all the way. The Confederation Trail doesn't get better than this. Head out from Kensington and go as far as you feel like — conditions hold all day.",
      insight: "The trail runs through a wind shadow for most of its interior sections. Even when the coast is breezy, the trail through the farmland barely moves. Today is especially calm.",
    },
    {
      headline: "Best cycling conditions of the season.",
      summary: "No wind, no rain, and a dry trail surface. The Confederation Trail from Kensington is as good as it gets — flat, car-free, and gorgeous right through the island's farmland heart. Go.",
      insight: "The Kensington section is the flattest stretch of trail on the whole island. New cyclists and families always start here — you can cover 20 km without breaking a sweat on a calm day like today.",
    },
    {
      headline: "Flat, calm, and ready for you.",
      summary: "Trail conditions are excellent in every direction from Kensington. The surface is dry, the air is still, and the fields are at their best. Take the westbound leg toward Summerside for the most open views.",
      insight: "The trail follows the old CN Rail bed — dead flat, gentle curves, and the original rail bridges still intact. The bridges over the small PEI rivers are some of the best spots to stop and take in the island quietly.",
    },
    {
      headline: "Car-free, calm, and all yours.",
      summary: "Perfect trail day. Calm conditions, comfortable temperature, and nothing but farmland and sky ahead of you. This is the ride that people move to PEI for.",
      insight: "Morning rides on the trail before 9am in summer are almost always traffic-free and dew-quiet. The light hits the red soil roads off the trailhead particularly well in the early hours.",
    },
    {
      headline: "Confederation Trail is fully on today.",
      summary: "Excellent conditions from Kensington in both directions. Dry surface, calm air, great visibility. Go as far as you want — there's no reason to turn around early today.",
      insight: "The trail passes through several small communities — Breadalbane, Hunter River — where you can stop for water. Locals along the route are always happy to help a trail cyclist.",
    },
  ],
  excellent_none_light: [
    {
      headline: "Light tailwind — ideal ride day.",
      summary: "A light breeze from the west makes the eastbound leg feel almost effortless. Comfortable temperature, dry trail, and a gentle push behind you. Classic Confederation Trail morning.",
      insight: "Westbound in the afternoon with the prevailing southwest wind means an easy ride out and a bit of work coming back. Eastbound in the morning is the classic local move — tailwind both ways if the wind shifts by 3pm.",
    },
    {
      headline: "Perfect cycling weather on the trail.",
      summary: "Light breeze, warm air, dry limestone surface. The trail is in ideal shape. Head out toward Summerside or east toward Hunter River — either direction is excellent right now.",
      insight: "The trail sections through the Kensington area have the best tree canopy cover, which makes the light particularly beautiful in morning and evening on clear days like this.",
    },
    {
      headline: "Trail is smooth and conditions are right.",
      summary: "Light wind and good temperature make this a high-quality ride day. The trail surface is firm and fast. Pack water and go as far as you have time for.",
      insight: "The crushed limestone surface drains quickly after rain — if you're here within a day of wet weather, check the surface at the trailhead. Dry conditions like today are when the trail rides best.",
    },
    {
      headline: "Go ride — conditions are excellent.",
      summary: "Light breeze, comfortable air, no incoming weather. The Confederation Trail is in prime condition right now. This is what Atlantic Canada cycling is supposed to feel like.",
      insight: "Cyclists who bring a fishing rod often drop a line at the river crossings along the trail. Several of the bridges span trout streams — worth a 10-minute stop if you have gear.",
    },
    {
      headline: "Light wind, long views, great ride.",
      summary: "Everything is working on the trail today. Light breeze keeps you comfortable without fighting it. The farmland scenery through this stretch is at its best in these conditions.",
      insight: "The trail between Kensington and Emerald passes through some of PEI's most photogenic farmland — rolling red fields, white farmhouses, and the Gulf visible on clear days from the high points.",
    },
  ],
  good_none_breezy: [
    {
      headline: "Breezy but absolutely worth riding.",
      summary: "Wind is up at 30–35 km/h but the trail's interior position keeps most of it off you. Exposed stretches near Summerside will feel it more — head east from Kensington for more shelter. Still a great ride day.",
      insight: "The trail's old railway grade means it cuts through low spots and berms that block most crosswinds. You'll feel the gusts at field crossings but the tree-lined sections are calm.",
    },
    {
      headline: "Wind is up — plan your direction.",
      summary: "Breezy conditions today. Ride into the wind first so the return leg is easier. East from Kensington is the more sheltered direction right now. A good ride day for riders who don't mind working a bit.",
      insight: "Experienced trail cyclists always check wind direction before choosing which end to start from. Going into a headwind first means a faster, more satisfying ride home — locals always do this.",
    },
    {
      headline: "Good trail day despite the breeze.",
      summary: "Wind is noticeable on open sections but the trail's interior route shelters you more than you'd expect. Dress for it and you'll have a great ride. The surface is dry and fast.",
      insight: "When it's breezy on the coast, the Confederation Trail through the island interior is almost always the better option than the beach. Locals make this switch automatically.",
    },
    {
      headline: "Breezy — go east for shelter.",
      summary: "Southwest wind at 30+ km/h makes some sections breezy. The eastbound leg from Kensington runs through more tree cover and is noticeably calmer. Still a good ride — just go the right direction.",
      insight: "The trail between Hunter River and Charlottetown has the densest tree canopy of any section — almost tunnel-like in places. It's the most wind-sheltered stretch on the whole trail.",
    },
    {
      headline: "Trail is good — wind is the trade-off.",
      summary: "Conditions are fine for cycling with one caveat: the open farmland sections will push back at 30–35 km/h. Manageable for most riders. Pack a layer and plan your route with the wind in mind.",
      insight: "Breezy days on the trail are when you most appreciate the rail-grade engineering — flat, straight, and low in the landscape. The old railway builders naturally chose the most sheltered corridors.",
    },
  ],
  good_incoming_120min: [
    {
      headline: "Two-hour ride window — go now.",
      summary: "Perfect trail conditions right now with rain arriving in about two hours. That's enough for a solid 30–40 km out and back. Leave immediately and keep an eye on the western sky.",
      insight: "The Kensington trailhead has covered picnic shelters near the parking lot — a good place to wait out a passing shower if you're caught slightly short of your window.",
    },
    {
      headline: "Go now — rain two hours out.",
      summary: "Conditions are excellent right now but a front is tracking in. Two hours on a flat trail is a serious amount of riding — get out and use the window.",
      insight: "The trail surface dries quickly after light rain — even if you get caught at the end of your window, a quick shower won't make the limestone surface dangerous for a few minutes.",
    },
    {
      headline: "Good window before the front.",
      summary: "Two solid hours of good conditions ahead. Ride out for 45–50 minutes and turn around — you'll be back at the car just as the rain arrives. Perfect timing.",
      insight: "Local cyclists use the two-hour window rule on the trail constantly — it's a flat surface so you always know exactly how far you can go and still make it back on time.",
    },
    {
      headline: "Ride now, rain comes later.",
      summary: "Trail conditions are ideal at the moment. Rain is coming in about two hours. Head out from Kensington, turn around at the 45-minute mark, and you'll beat it home.",
      insight: "There's a small café in Kensington town centre 5 minutes from the trailhead — the perfect rain plan if your timing is slightly off.",
    },
    {
      headline: "Two hours of excellent trail conditions.",
      summary: "Get on the trail now. Dry surface, comfortable air, no wind. Rain arrives in two hours and will end the session. Make the most of a clean window.",
      insight: "A two-hour flat ride from Kensington gets you to the community of Freeland and back — one of the prettiest sections through open farmland. Worth targeting.",
    },
  ],
  fair_raining_now_gusty: [
    {
      headline: "Trail is wet and gusty — not today.",
      summary: "Rain and wind have made the trail unpleasant. Wet limestone stays rideable but the combination with gusts makes it uncomfortable and potentially slippery on curves. Come back tomorrow.",
      insight: "The trail dries remarkably fast after rain in summer — a few hours of sun and you'd never know it rained. Tomorrow morning will almost certainly be better than right now.",
    },
    {
      headline: "Skip the trail today.",
      summary: "Active rain and gusts at 40+ km/h make the Confederation Trail a wet, gusty slog right now. Not dangerous, just miserable. Indoor cycling or rest day territory.",
      insight: "Kensington's covered market and heritage main street are a genuine reason to be in town even when the trail is washed out. Locals don't waste a rainy day.",
    },
    {
      headline: "Wet and gusty — hold off.",
      summary: "Rain and wind have combined to make trail cycling uncomfortable. The limestone surface gets slippery on corners when wet. Wait for the front to pass before riding.",
      insight: "The trail conditions app at the Kensington trailhead notice board updates daily — worth checking the posted status before any ride, especially after weather events.",
    },
    {
      headline: "Rain and wind shut down the trail.",
      summary: "Not a riding day. Gusty and wet across the interior. The trail will be in good shape again once this moves through — probably by late afternoon or tomorrow morning.",
      insight: "PEI rain fronts from the northwest move quickly across the island — the trail goes from wet to dry faster than you'd expect. Patience pays off here.",
    },
    {
      headline: "Come back when the front clears.",
      summary: "Gusty wind and rain make the trail uncomfortable and the surface slippery. A genuine rest day. The trail will reward your patience when it dries out.",
      insight: "Post-rain mornings on the Confederation Trail smell extraordinary — fresh grass, wet red soil, and clean Atlantic air. One of the island's best kept sensory secrets.",
    },
  ],
};

// ─── CONFEDERATION BRIDGE ─────────────────────────────────────────────────────

const confederationBridge: ResponseTemplates = {
  excellent_none_calm: [
    {
      headline: "Bridge is open — smooth crossing.",
      summary: "Wind is calm and all vehicles including motorcycles are clear to cross. Excellent visibility and no restrictions in effect. The 12.9 km crossing will take about 10 minutes at normal speed.",
      insight: "Morning crossings are almost always the calmest of the day. The bridge deck sits low and sheltered from northwest winds — the worst crossings come from the east and northeast.",
    },
    {
      headline: "All clear — drive or ride freely.",
      summary: "No wind restrictions. Calm conditions on the deck. Motorcycles, high-sided vehicles, and all traffic move freely. One of the cleaner crossing days of the season.",
      insight: "Wind readings on shore understate what you'll feel on the deck by 10–15 km/h. When shore readings are calm like today, the deck feels completely still — a rare treat.",
    },
    {
      headline: "Perfect crossing conditions.",
      summary: "Calm wind and clear visibility across Northumberland Strait. No restrictions, no delays. Whether you're coming or going, the bridge is fully open today.",
      insight: "The bridge deck is one of the best spots in Atlantic Canada to see the Milky Way on clear summer nights — there are no lights on the crossing itself and the elevation clears local light pollution.",
    },
    {
      headline: "Bridge wide open. No restrictions.",
      summary: "Ideal wind conditions on the crossing today. All vehicles proceed normally. The water view from the bridge deck is exceptional when it's this calm — worth slowing slightly to take it in.",
      insight: "The bridge curves slightly to prevent drivers from seeing straight across and getting hypnotised by the monotony — one of the engineering details most people never notice.",
    },
    {
      headline: "Clean crossing — zero restrictions.",
      summary: "Wind is calm and conditions are excellent on the bridge. All vehicles, including motorcycles and high-sided trucks, cross freely. Smooth trip to or from the mainland today.",
      insight: "The Northumberland Strait under the bridge is one of the warmest stretches of ocean in Canada — warmer than most of Nova Scotia's south shore even in July. You can see the colour change in the water from the deck.",
    },
  ],
  good_none_breezy: [
    {
      headline: "Breezy crossing — all vehicles clear.",
      summary: "Wind is 25–40 km/h on the deck but below restriction thresholds. All vehicles including motorcycles can cross. You'll feel the gusts — keep both hands on the wheel and give trucks extra space.",
      insight: "High-sided vehicles create turbulence for motorcycles and small cars when it's breezy. Stay well back from any trucks on the deck in these conditions — the buffeting is real.",
    },
    {
      headline: "Wind is up but no restrictions yet.",
      summary: "Breezy conditions on the crossing. Below the 60 km/h restriction threshold — all vehicles proceed. Motorcyclists will feel every gust. Drive with awareness.",
      insight: "The middle of the bridge is always windier than either end. The stretch between pillars 3–7 from the PEI side is where crosswinds hit hardest on northwest wind days.",
    },
    {
      headline: "All clear but wind is noticeable.",
      summary: "Wind at 30–35 km/h on the deck. No restrictions in effect — all vehicles proceed. High-sided drivers should expect lateral push. Motorcyclists: firm grip, steady throttle.",
      insight: "Bridge operators monitor wind continuously. The digital signs at the approach are updated in real time — always check them before you commit to the crossing, even when conditions look manageable.",
    },
    {
      headline: "Breezy but fully open to all traffic.",
      summary: "Gusty crossing conditions today but still within normal operating limits. All vehicles including motorcycles proceed. Extra care recommended — this isn't a casual hands-off-the-wheel situation.",
      insight: "The bridge is designed to handle wind loads that would close it for traffic long before any structural concern. When it says 'open,' it means it — but comfortable and safe aren't the same thing for motorcycles.",
    },
    {
      headline: "Manageable wind — open crossing.",
      summary: "Wind is present but below restriction levels. All traffic proceeds. Motorcycles cross at your own comfort level — conditions are legal but not trivial. Small vehicles feel the gusts more than expected.",
      insight: "Cyclists and pedestrians cannot cross the bridge under any conditions — it's vehicle-only. If you're on a bike, the ferry from Wood Islands or Caribou is the only option.",
    },
  ],
  good_none_gusty: [
    {
      headline: "High-sided vehicles restricted.",
      summary: "Sustained winds at 60–69 km/h have triggered restrictions for motorcycles and high-sided vehicles. Cars and SUVs cross freely. If you're on a motorcycle or in a transport truck, check the bridge status line before attempting.",
      insight: "The bridge restriction line is 1-877-882-7745 — save it in your phone if you cross regularly. Real-time status is also at confederationbridge.com.",
    },
    {
      headline: "Motorcycle restriction in effect.",
      summary: "Winds at 60+ km/h have put restrictions on motorcycles and high-sided vehicles. Passenger cars are fine. Check the approach signs — they show the current status in real time.",
      insight: "Motorcyclists caught by a sudden restriction have two options: wait at the Gateway Village until winds ease (usually 1–3 hours), or backtrack to the Wood Islands ferry. Gateway Village has a good café — not the worst wait.",
    },
    {
      headline: "Gusty — restrictions for bikes and trucks.",
      summary: "Wind has crossed the 60 km/h threshold. High-sided vehicles and motorcycles are restricted. All other vehicles cross normally. Check approach signs for current status before you commit.",
      insight: "When the bridge restricts motorcycles, locals know the wind on the deck is genuinely significant. Cars feel it too — lateral drift on gusts is real at 60+ km/h even in a normal passenger vehicle.",
    },
    {
      headline: "Bikes and high-siders — check before crossing.",
      summary: "Sustained 60+ km/h winds have triggered partial restrictions. Motorcycles and high-sided vehicles should confirm status at the approach signs. Passenger cars cross freely.",
      insight: "The restriction threshold of 60 km/h is for sustained wind, not gusts. Gusts can be significantly higher. Even if restrictions lift, the deck can still feel uncomfortable for motorcycles immediately after.",
    },
    {
      headline: "Wind restriction active — cars fine.",
      summary: "Motorcycle and high-sided vehicle restrictions are in effect. Passenger vehicles cross without issue. The deck is windy but safe for regular cars. Motorcyclists: wait it out or take the ferry.",
      insight: "Wind on the bridge deck typically eases by evening as the sea breeze dies down. If you're a motorcyclist facing a restriction in the afternoon, checking back after 7pm is often worth it.",
    },
  ],
  stay_inside_none_dangerous: [
    {
      headline: "Bridge closed to high-sided vehicles.",
      summary: "Winds above 70 km/h have triggered full closure for high-sided vehicles and motorcycles. Passenger cars still cross but conditions are severe. Approach signs will confirm current status.",
      insight: "A 70+ km/h closure is rare but serious. In these conditions, passenger cars crossing will feel significant lateral force on the deck. Legal doesn't always mean comfortable — use your judgement.",
    },
    {
      headline: "Severe wind — full restriction in effect.",
      summary: "The bridge is closed to motorcycles and all high-sided vehicles. Dangerous sustained winds on the deck. Passenger cars may still cross — verify at the approach signs. If in doubt, wait.",
      insight: "Full bridge closures for wind typically last 2–6 hours. The Gateway Village on the PEI side has full facilities — restaurants, washrooms, Wi-Fi. Not a bad place to wait a storm out.",
    },
  ],
};

// ─── VICTORIA PARK ────────────────────────────────────────────────────────────

const victoriapark: ResponseTemplates = {
  excellent_none_calm: [
    {
      headline: "Victoria Park is perfect right now.",
      summary: "Calm, warm, and green — the park is at its best today. Walk to the point for harbour views, cycle the perimeter, or just sit on the grass near the bandstand. No better spot in Charlottetown right now.",
      insight: "The point at the south end of Victoria Park catches the harbour breeze even on calm days and stays noticeably cooler than the rest of Charlottetown on hot afternoons. Locals know it as the best free air conditioning in the city.",
    },
    {
      headline: "Best park conditions of the season.",
      summary: "Excellent across the board. The trail around the park perimeter is clear and dry, the harbour views from the point are sharp, and the whole space feels alive. Go.",
      insight: "The tree canopy inside Victoria Park stays dry 10–15 minutes longer when rain starts than any open area in the city. Locals use this as a built-in shelter buffer on marginal days.",
    },
    {
      headline: "Go spend time in the park.",
      summary: "Calm, comfortable, and beautiful. Victoria Park is one of those places that earns its reputation on days exactly like this. Walk, cycle, picnic, or just sit and watch the harbour.",
      insight: "The perimeter cycling loop around Victoria Park is just under 3 km — flat, paved, and completely car-free in the interior. A perfect morning loop before the city wakes up.",
    },
    {
      headline: "Park and harbour are both calling.",
      summary: "Ideal conditions in Victoria Park and along the harbour edge. The bandstand area is sunny, the trails are dry, and the water is a flat, beautiful blue. A genuine afternoon-off day.",
      insight: "Victoria Park hosts summer concerts at the bandstand on weekend evenings through July and August. The best spot is in the grass to the left of the stage — shaded and with a harbour view.",
    },
    {
      headline: "Calm and clear — ideal park weather.",
      summary: "No wind, comfortable temperature, clean air. Victoria Park is as inviting as it gets today. Pack a picnic and stay longer than you planned.",
      insight: "The beach at the south end of the park — small and sheltered — is one of the most underused spots in Charlottetown. Most visitors walk past it without realising swimming is possible there.",
    },
  ],
  excellent_none_light: [
    {
      headline: "Light breeze, beautiful park day.",
      summary: "A gentle breeze off the harbour makes the park feel fresh and alive. Great for cycling the perimeter or walking to the point. The harbour is stunning with a bit of movement on the water.",
      insight: "The harbour breeze at Victoria Park typically builds through the afternoon and peaks around 3pm — the point becomes the best natural fan in the city on warm summer days.",
    },
    {
      headline: "Victoria Park is in great shape.",
      summary: "Light wind keeps it comfortable without being disruptive. Trails are dry, the grass is green, and the harbour edge is beautiful. A classic Charlottetown park day.",
      insight: "The mature hardwood trees on the north side of the park create a wind corridor that feels cooler than surrounding streets on warm afternoons. Locals use this section for lunchtime walks in July.",
    },
    {
      headline: "Great morning for the park loop.",
      summary: "Light breeze and excellent conditions through the park. The perimeter trail is at its best this time of day — quiet, scenic, and easy. Worth doing the full loop.",
      insight: "Cycling counterclockwise on the Victoria Park loop puts the harbour on your left for most of the ride — better views and a light tailwind on the long harbour-side stretch.",
    },
    {
      headline: "Go enjoy the park this morning.",
      summary: "Conditions are excellent with a pleasant light breeze. Victoria Park is calm and inviting right now. Whatever you were going to do today — the park should be part of it.",
      insight: "The grass section between the bandstand and the harbour is one of the best places on the island to fly a kite on light wind days exactly like this.",
    },
    {
      headline: "Harbour views are exceptional today.",
      summary: "Light wind and good visibility make the point at the end of Victoria Park worth the walk. Clear views across the harbour all the way to Rocky Point. Easy park conditions throughout.",
      insight: "Rocky Point across the harbour from Victoria Park is where the original French fort of Port-la-Joye stood in 1720 — visible as a green headland from the park's south end.",
    },
  ],
  good_incoming_120min: [
    {
      headline: "Two hours in the park before rain.",
      summary: "Excellent park conditions right now with rain arriving in about two hours. A walk, a cycle, a picnic — you have time. Start wrapping up at the 90-minute mark.",
      insight: "Victoria Park's interior tree canopy buys you extra time when rain starts — you'll have a dry exit even if you push the window slightly. The trees are dense enough to shelter a 10-minute rain.",
    },
    {
      headline: "Park is great — rain comes later.",
      summary: "Good conditions in Victoria Park right now, with a two-hour window before a front arrives. Get your walk or ride in now. The park is at its best before the weather changes.",
      insight: "The harbour at Victoria Park often goes a particular still, mirror-like silver just before rain arrives — one of the most beautiful moments the park offers. Worth watching for.",
    },
    {
      headline: "Go now, rain arrives in two hours.",
      summary: "Right now Victoria Park is in excellent shape. Comfortable, calm, and clear. Rain is coming but not for two hours — more than enough for a proper visit.",
      insight: "The covered pavilion near the bandstand gives you a dry seat to watch the storm roll in across the harbour if you stay too long — not a bad outcome actually.",
    },
    {
      headline: "Good window — use the park today.",
      summary: "Two hours of clean conditions ahead. Victoria Park is calm and comfortable right now. A picnic, a walk, or a cycle loop — pick one and go before the front arrives.",
      insight: "The park's east side trail along the harbour is the most exposed to incoming weather from the west. If you see the sky darkening, head to the interior tree section — you'll gain 15 minutes of dry cover.",
    },
    {
      headline: "Solid park window before the rain.",
      summary: "Victoria Park conditions are excellent right now. Rain is tracked to arrive in two hours. Plenty of time for a proper visit — just don't linger past the 90-minute mark.",
      insight: "Rain on Victoria Park's harbour edge is genuinely beautiful — locals who know the park sometimes time their walks to catch the front arriving across the water. If you're sheltered under the trees, it's worth staying.",
    },
  ],
  fair_raining_now_gusty: [
    {
      headline: "Park is wet and gusty — move inside.",
      summary: "Rain and wind have made Victoria Park uncomfortable. The open trails and harbour edge are unpleasant right now. The waterfront restaurants and downtown are a 5-minute walk — go there instead.",
      insight: "The Province House and Confederation Centre are literally across the road from Victoria Park's north entrance — the best dry alternative in Charlottetown when the park is washed out.",
    },
    {
      headline: "Rain and wind — skip the park.",
      summary: "Active rain and gusts have taken over Victoria Park. Not worth it right now. Come back in a couple of hours — the park clears fast after a front moves through.",
      insight: "Victoria Park after rain on a summer evening — when the grass is wet and the harbour is dramatic and there are almost no people — is one of the best versions of the place. The bad weather makes it better later.",
    },
    {
      headline: "Wet and gusty — go downtown instead.",
      summary: "The park is getting hit right now. Rain and wind make the trails and harbour walk uncomfortable. Charlottetown's covered indoor options are all within 10 minutes — better call right now.",
      insight: "The Confederation Centre Art Gallery is free admission and one of the best collections in Atlantic Canada. It's the perfect Victoria Park rain backup and most visitors never even know it exists.",
    },
    {
      headline: "Park is closed by weather.",
      summary: "Gusty wind and active rain have made Victoria Park a poor outdoor choice. Hold off, have coffee downtown, and come back when it clears.",
      insight: "The best view of Victoria Park in a storm is from the window of one of the restaurants on Great George Street — elevated, sheltered, and looking right down into the park's tree canopy.",
    },
    {
      headline: "Not a park day. Rain and gusts.",
      summary: "Active precipitation and wind are making Victoria Park uncomfortable and the harbour trail unpleasant. The city's indoor culture is steps away — use it.",
      insight: "Charlottetown's restaurant row on Victoria Row is sheltered by awnings for its entire length. Rain in the city is rarely a reason to go inside — just move one street back from the waterfront.",
    },
  ],
};

// ─── BASIN HEAD ───────────────────────────────────────────────────────────────

const basinHead: ResponseTemplates = {
  excellent_none_calm: [
    {
      headline: "Singing Sands are yours today.",
      summary: "Calm, clear, and quiet on the east end of the island. Basin Head is at its absolute best right now — the sand squeaks, the lagoon is warm, and the gulf side is flat. Go.",
      insight: "The squeaking sand only works when it's dry. Wet sand is silent. Today's calm, dry conditions mean you'll get the full experience — drag your feet and listen.",
    },
    {
      headline: "Best beach day on the east shore.",
      summary: "Excellent conditions at Basin Head. The lagoon side is calm and warm, the gulf side has gentle surf, and the whole beach is at its best. This is what people make the drive out here for.",
      insight: "The lagoon at Basin Head is almost always 2–3°C warmer than the open gulf side. On a calm day like today both are perfect — swim the lagoon, walk the gulf side.",
    },
    {
      headline: "East PEI is calling. Go.",
      summary: "Calm air, warm water, squeaky sand. Basin Head in ideal conditions is one of the best beaches in Atlantic Canada. Pack a lunch and make the drive — you won't regret it.",
      insight: "The sunrise at Basin Head is one of the best on the island — it's one of the easternmost points in PEI and catches the first light. Worth an early alarm if you're staying nearby.",
    },
    {
      headline: "Singing Sands are in perfect condition.",
      summary: "No wind, no rain, and dry sand that will sing under your feet. Basin Head is fully on today. The lagoon is calm, the gulf is flat, and the beach is quiet enough to actually hear the sand.",
      insight: "The squeaking phenomenon is caused by the round quartz grains rubbing together — the sound is most pronounced in the dry upper beach above the tide line. Walk on the dry sand above the wet stripe.",
    },
    {
      headline: "Quiet, beautiful, worth the drive.",
      summary: "Basin Head is far enough east that it's never crowded, and today's excellent conditions make it even better. Calm, warm, and beautiful. The full beach experience without the Cavendish crowds.",
      insight: "Basin Head sits near the eastern tip of PEI — 90 minutes from Charlottetown but in a different world. The drive through Kings County is beautiful enough to make the distance feel worthwhile.",
    },
  ],
  good_none_breezy: [
    {
      headline: "Breezy on the gulf — lagoon is calm.",
      summary: "East winds are up at 30–35 km/h, which roughs up the gulf side directly. The lagoon is your friend today — sheltered, warm, and comfortable. Skip the open beach and use the tidal pool instead.",
      insight: "At Basin Head, east winds hit the gulf side hard but barely affect the lagoon, which is tucked behind the dune ridge. Locals always use the lagoon side when east wind comes in.",
    },
    {
      headline: "Lagoon side only — gulf is rough.",
      summary: "Wind is from the east, which hits Basin Head directly. The gulf side is choppy. The lagoon side is sheltered and comfortable — swim there today. Still a good beach trip, just use the right half.",
      insight: "The tidal inlet at Basin Head creates a gentle current through the lagoon on an incoming tide. Locals float the current from the sand bar to the beach — 10 minutes of the easiest swimming on the island.",
    },
    {
      headline: "Breezy but the lagoon saves the day.",
      summary: "East wind is pushing the gulf side around but the lagoon remains sheltered. Go to Basin Head — just stay behind the dune line. The swimming is actually good in these conditions on the protected side.",
      insight: "The sand on the gulf side gets carried by east winds and drifts over the dune crest — you can watch it move on days like today. The dune changes shape slightly every time this happens.",
    },
    {
      headline: "Wind is up — lagoon is the play.",
      summary: "Breezy east wind makes the open beach challenging. The lagoon at Basin Head is protected and comfortable. A great visit — just not the gulf side today.",
      insight: "When east winds blow, the Singing Sands on the gulf side can actually be at their best — the dry upper sand shifts and exposes fresh layers. The squeaking is especially loud when the sand is wind-dried.",
    },
    {
      headline: "East wind — lagoon over gulf today.",
      summary: "Wind from the east is roughing up Basin Head's gulf side. Pivot to the lagoon — sheltered, warm, and perfectly swimmable. A good trip either way.",
      insight: "The natural dune ridge at Basin Head that separates the lagoon from the gulf is one of the most intact coastal barriers on the island. On windy days, standing on the crest feels like two different worlds.",
    },
  ],
  good_incoming_120min: [
    {
      headline: "Two hours at the Singing Sands.",
      summary: "Basin Head conditions are excellent right now with rain arriving in about two hours. That's enough for the full experience — lagoon swim, gulf walk, and the squeaky sand. Go now.",
      insight: "Basin Head is a 90-minute drive from Charlottetown, which makes timing the window critical. Leave now, spend an hour and a half at the beach, and head back before the front hits.",
    },
    {
      headline: "Good window — make the drive.",
      summary: "Conditions at Basin Head are excellent and you have two hours before rain. If you're already on the east end of the island, go immediately. If you're in Charlottetown — the math is tight but doable.",
      insight: "The drive from Charlottetown to Basin Head through the village of Souris is one of the best coastal drives on the island. Even on a tight timeline it's worth taking Route 2 through the Kings County shoreline.",
    },
    {
      headline: "Go now, rain two hours out.",
      summary: "Right now Basin Head is in excellent shape. A two-hour window is enough for a proper visit. Head out immediately and you'll be back on the road before the weather changes.",
      insight: "There's a small interpretive centre at the Basin Head parking area about the lobster fishery — worth 15 minutes even on a tight schedule.",
    },
    {
      headline: "Two solid hours at Basin Head.",
      summary: "Clean conditions on the east shore with rain arriving in two hours. The lagoon is calm, the gulf is flat, and the sand is dry enough to squeak. Go.",
      insight: "The fisheries museum at Basin Head is one of the best small museums in PEI — if the rain catches you early, it's an excellent 45-minute dry backup.",
    },
    {
      headline: "Clean window before the front hits.",
      summary: "Excellent conditions at Basin Head right now. Rain is two hours away. Enough time for the full experience — swim, walk, squeak. Leave when you arrive back at the car.",
      insight: "Basin Head's small parking lot fills fast on good days — arriving early not only beats the crowds but gives you more of your two-hour window actually on the beach.",
    },
  ],
  fair_raining_now_gusty: [
    {
      headline: "Basin Head is rough today.",
      summary: "Rain and gusty east wind have made the beach unpleasant. The gulf side is unsettled and the lagoon isn't much better in these conditions. Save Basin Head for a better day.",
      insight: "After a northeast blow, Basin Head beach often looks dramatically rearranged — the sand moves significantly in heavy east wind events. The day after a storm is always interesting.",
    },
    {
      headline: "East wind and rain — skip it today.",
      summary: "Gusty east wind and active rain have made the Singing Sands a poor choice. The drive from Charlottetown in these conditions isn't worth it. Check back tomorrow.",
      insight: "Souris, 10 minutes from Basin Head, has good seafood and a covered waterfront. If you're already out east when the weather turns, it's the best place to pivot.",
    },
    {
      headline: "Not a Basin Head day. Wind and rain.",
      summary: "Both sides of the beach are uncomfortable right now — east wind hits the gulf side directly and the lagoon loses its shelter when gusts come from that direction. Come back tomorrow.",
      insight: "The Kings County scenery through this part of the island is worth experiencing even in rain from inside a car — the pastoral east PEI countryside looks beautiful in grey light.",
    },
    {
      headline: "Rain and gusts — come back tomorrow.",
      summary: "Active precipitation and strong east wind have Basin Head locked down. The beach is unpleasant in every direction. Head to Souris for food or back toward Charlottetown.",
      insight: "Post-storm Basin Head the morning after a northeast blow often has the cleanest, flattest sand on the island — the wave action scours the beach and leaves it like a blank canvas.",
    },
    {
      headline: "East wind and rain shut it down.",
      summary: "Not a good day at the Singing Sands. Gusts and rain from the east are the worst combination for this particular beach — it takes the full force. Come back when the wind shifts west.",
      insight: "The quietest, most beautiful version of Basin Head is the morning after a northeast storm — calm, clean, and completely empty. Worth planning for if you can stay overnight.",
    },
  ],
};

// ─── NORTH CAPE ───────────────────────────────────────────────────────────────

const northCape: ResponseTemplates = {
  excellent_none_calm: [
    {
      headline: "North Cape is crystal clear today.",
      summary: "Rare calm at the island's tip — perfect for the reef walk, whale watching, and photography. After a frontal passage, North Cape gets the longest views of anywhere on PEI. Walk the reef at low tide.",
      insight: "North Cape often has the clearest air on the island after a cold front — the northwest wind scrubs haze out completely. Today's visibility is probably the best you'll find anywhere in Atlantic Canada right now.",
    },
    {
      headline: "Best conditions at the island's tip.",
      summary: "Calm, clear, and exceptional. The reef walk is fully accessible, whale sightings are possible from the lookout, and the wind turbines above are barely moving. A rare gentle day at North Cape.",
      insight: "The reef at North Cape is the longest natural rock reef in North America. The best walk is at low tide — check the tide card on this page before you go and time your visit to arrive 1–2 hours before low.",
    },
    {
      headline: "Calm at North Cape — go explore.",
      summary: "You don't often get a calm day at the island's most exposed point. Today is one of those days. The reef walk, the interpretive centre, and the lookout over the Gulf and Strait are all excellent right now.",
      insight: "The wind here is usually 10–15 km/h stronger than anywhere else on the island. On a calm day like today, standing at the reef feels genuinely serene — most visitors only ever see it windblown.",
    },
    {
      headline: "Perfect day at the reef.",
      summary: "Clear skies, calm wind, and excellent visibility across the water. The interpretive centre is worth visiting, the reef walk is at its best, and whale spotting from the lookout is realistic in these conditions.",
      insight: "North Cape sits where the Gulf of St. Lawrence meets Northumberland Strait — you can see the colour difference in the water on calm clear days. The Gulf side is deeper blue, the Strait side is greener.",
    },
    {
      headline: "North Cape on a rare calm day.",
      summary: "The island's most exposed point in perfect conditions — this doesn't happen often. Walk the reef, watch the water, take your time. Everything is excellent right now.",
      insight: "Late July to August from the North Cape lookout is prime whale season — minke, finback, and occasionally humpback move through the strait. Binoculars are worth bringing.",
    },
  ],
  good_none_breezy: [
    {
      headline: "Windy at the cape — worth it anyway.",
      summary: "North Cape is doing what it does best — wind in your face and massive views. The breeze is 30–40 km/h but that's practically calm for this location. The reef is accessible. Bring a layer.",
      insight: "North Cape is almost never truly calm. Locals consider 30 km/h 'not bad.' When the app shows breezy here, experienced visitors know it's still a great visit — just dress for it.",
    },
    {
      headline: "Breezy cape day — fully worth the drive.",
      summary: "Wind is up but within normal North Cape parameters. The reef walk and lookout are accessible. The view from the turbine ridge in a good breeze is genuinely dramatic. Jacket on.",
      insight: "The wind turbines at North Cape operate down to very high wind speeds — they're still spinning in conditions that would send most people inside. Worth watching up close.",
    },
    {
      headline: "Classic North Cape — windy and wild.",
      summary: "Breezy at the tip, as expected. This is what North Cape feels like most of the time and why people come — raw Atlantic exposure. The reef walk is excellent, whale watching is possible, and the views are wide.",
      insight: "The lee side of the interpretive centre building blocks the wind entirely — locals stand there to scan for whales without getting blown around. The windward side is for the full experience.",
    },
    {
      headline: "Wind and views — North Cape delivers.",
      summary: "Breezy conditions at the island's tip but well within the range of a great visit. The reef, the turbines, and the dual-ocean views are all accessible. Layer up.",
      insight: "On a northwest breeze like today, the whale activity is typically on the Gulf side — scan the water to the west from the lookout. The Strait side is choppier and harder to spot in.",
    },
    {
      headline: "Cape conditions — bring a windbreaker.",
      summary: "Breezy at North Cape but nothing unusual for this location. Go expecting wind and you'll find the visit excellent. The reef and lookout are at their most dramatic in these conditions.",
      insight: "Photography at North Cape in a breeze produces the island's best dramatic coastal shots — waves on the reef, turbines turning, the strait stretching out. The 'perfect calm' version is actually less photogenic.",
    },
  ],
  good_none_gusty: [
    {
      headline: "Gusty cape — reef may be rough.",
      summary: "Wind is 40–60 km/h at North Cape. The reef walk is exposed and conditions on the rock are slippery when wind is this strong. The lookout and interpretive centre are worth it — reef walk at your own discretion.",
      insight: "The reef at North Cape becomes genuinely slippery when spray is up. Gusty days are not the time to walk to the outer reef points — stay on the upper rock and enjoy the drama from there.",
    },
    {
      headline: "Strong wind at the cape today.",
      summary: "Gusty at 40–60 km/h — typical North Cape intensity. The views are spectacular, the turbines are at full output, and the water is dramatic. The reef is accessible but exposed. Secure everything.",
      insight: "North Cape wind is consistent enough that the Wind Energy Institute here has been operating since 1998. When it's this gusty, you're watching the island's main electricity source at full production.",
    },
    {
      headline: "Big wind at North Cape — go see it.",
      summary: "Gusts at 40+ km/h make North Cape one of the most dramatic spots on the island right now. The reef is rougher than usual. Go for the lookout and the energy of the place — incredible in these conditions.",
      insight: "Gusty days push the best whale activity further out into the strait where the water is deep and rough. Binoculars are especially useful in high wind — scan the whitecap lines for dorsal fins.",
    },
    {
      headline: "Gusty and dramatic — worth seeing.",
      summary: "Strong wind at the cape today. This is North Cape at its most raw and impressive. The reef walk requires care in these conditions but the lookout is excellent. Bring a windbreaker and hold your hat.",
      insight: "The interpretive centre at North Cape is one of the best wind energy exhibits in the country — 45 minutes well spent, especially if the conditions outside are making extended reef time uncomfortable.",
    },
    {
      headline: "Wind is serious at the cape today.",
      summary: "Gusts at 40–60 km/h make North Cape dramatic and worth visiting — just respect the conditions on the reef. Stay back from the reef edges when it's this gusty. The views are exceptional.",
      insight: "The two-ocean junction at North Cape is most visible from altitude in wind conditions like these — the surface colour and chop patterns clearly show where Gulf meets Strait. Look for the line.",
    },
  ],
  fair_raining_now_gusty: [
    {
      headline: "North Cape is getting hammered.",
      summary: "Rain and gusts are hitting the island's most exposed point directly. The reef is dangerous in these conditions. The interpretive centre is open and worth visiting — everything outside can wait.",
      insight: "North Cape in a storm is actually spectacular from inside the interpretive centre's windows — floor to ceiling glass with a view straight into the weather event. Not a bad experience if you're already there.",
    },
    {
      headline: "Gusty and wet — stay inside the centre.",
      summary: "Rain and 40+ km/h wind make the reef and outdoor areas uncomfortable and potentially dangerous. The interpretive centre is a worthwhile destination in any weather — use it today.",
      insight: "The geology at North Cape is particularly interesting — the reef is made of ancient Carboniferous sedimentary rock, different from the red sandstone of most PEI shorelines. Better to read about it inside than get soaked learning it.",
    },
    {
      headline: "Storm at the cape — reef is off limits.",
      summary: "Active weather has made the North Cape reef walk dangerous. Gusts and rain are significant. Head to the interpretive centre or come back when conditions improve.",
      insight: "North Cape recovers fast after storms — the wind clears the air, the reef drains quickly, and the post-storm visibility from the lookout is often the best of the season. Come back tomorrow.",
    },
    {
      headline: "Save North Cape for a better day.",
      summary: "Gusty rain at the island's tip. The reef and coastal areas are rough and uncomfortable. The drive out here in this weather isn't worth it unless you're already on the west shore.",
      insight: "Tignish, 10 minutes south of North Cape, has a historic church and café that make a good covered alternative when the cape is shut down by weather.",
    },
    {
      headline: "Rain and gusts — not cape weather.",
      summary: "Active precipitation and strong gusts make North Cape inaccessible for reef walking and uncomfortable at the lookout. Come back on a clearer day — the payoff is worth the wait.",
      insight: "The morning after a big northwest blow at North Cape is one of the best times to visit — the air is crystal clear, the reef is newly scoured, and you'll often have it completely to yourself.",
    },
  ],
};

// ─── BRACKLEY BEACH ───────────────────────────────────────────────────────────

const brackleyBeach: ResponseTemplates = {
  excellent_none_calm: [
    {
      headline: "Brackley is pristine right now.",
      summary: "Calm, clear, and quiet — Brackley Beach at its best. The surf is flat, the sand is warm, and the dunes are beautiful. Quieter than Cavendish and just as good today. Go.",
      insight: "Brackley is the locals' Cavendish — same national park quality, same red sand, but half the crowds even on peak days. Weekday mornings here feel like a private beach.",
    },
    {
      headline: "Quieter than Cavendish, just as good.",
      summary: "Excellent conditions at Brackley. Calm air, warm gulf water, and a beach that doesn't require fighting for parking or space. This is the insider version of a PEI beach day.",
      insight: "The dune system at Brackley is actively managed by Parks Canada — the marram grass plantings along the boardwalk are critical to the whole beach surviving. Stay on the boardwalk and the dunes stay intact.",
    },
    {
      headline: "Calm beach day — go to Brackley.",
      summary: "Ideal conditions on the north shore at Brackley. Flat water, warm air, great visibility. Smaller crowd than Cavendish with the same quality. An easy decision.",
      insight: "The Brackley Beach café near the entrance is one of the better national park food operations in the country — worth a stop for a lobster roll before or after the beach.",
    },
    {
      headline: "Best calm beach option right now.",
      summary: "Excellent conditions at Brackley Beach. Calm, comfortable, and uncrowded. The Gulf water is warm and the dune boardwalk is in great shape. A perfect beach day.",
      insight: "Kayaking from Brackley Beach is excellent in calm conditions like today — the gulf is flat and the shoreline heading east toward Stanhope Bay is one of the best paddles on the north shore.",
    },
    {
      headline: "Brackley is as good as it gets.",
      summary: "Calm air, warm water, beautiful dunes. Brackley Beach is fully on today and the crowds won't be half what Cavendish sees. Go and take your time.",
      insight: "The water at Brackley tends to be slightly calmer than Cavendish because the shoreline orientation gives it a bit more protection from northwest swells. Good for families with small kids.",
    },
  ],
  good_none_breezy: [
    {
      headline: "Breezy but still a great beach day.",
      summary: "Wind is up at 30–35 km/h but the dune system at Brackley provides some shelter. Swimming is fine — just expect some chop. Skip the umbrella and enjoy the breeze.",
      insight: "Brackley's dune boardwalk is sheltered on the landward side — sitting against the dune face blocks most of the northwest wind. Locals use this trick whenever it's breezy.",
    },
    {
      headline: "Good beach day despite the wind.",
      summary: "Breezy conditions at Brackley but the beach is still excellent. The dunes provide more shelter than Cavendish's more open layout. Surf is up and swimming is good for stronger swimmers.",
      insight: "On breezy days, the Brackley Beach section east of the main boardwalk exit is naturally more sheltered — the dune angle blocks the prevailing northwest wind better there.",
    },
    {
      headline: "Worth it — wind is manageable.",
      summary: "30+ km/h northwest wind makes it breezy but not brutal. The dune line at Brackley breaks most of it. Good beach day with a bit of energy in the air.",
      insight: "Kayaking in these conditions is best done behind the dune headland to the east — the open gulf is choppy but the sheltered bay section is calm enough for experienced paddlers.",
    },
    {
      headline: "Breezy and alive — Brackley is good.",
      summary: "Wind is noticeable but the beach is excellent. Better shelter than Cavendish, similar quality. Bring a layer and enjoy the livelier conditions.",
      insight: "The surf at Brackley in a northwest breeze creates small but genuine rideable waves — stand-up paddleboarders from the Charlottetown area come out specifically for these conditions.",
    },
    {
      headline: "Wind up but beach is solid.",
      summary: "Breezy at Brackley — conditions are good not perfect. The dunes shelter the main beach area well. Swimming is fine, walking is brisk. A real Atlantic beach day.",
      insight: "Birdwatching along the Brackley dune trail is excellent when it's breezy — the wind concentrates migrating raptors on the coastal ridge in late August and September.",
    },
  ],
  good_incoming_120min: [
    {
      headline: "Two-hour beach window at Brackley.",
      summary: "Excellent conditions now with rain arriving in two hours. Go immediately — swim, walk the dunes, enjoy the National Park beach without the Cavendish crowds. Be back at the car in two hours.",
      insight: "The Parks Canada gate at Brackley is often staffed — having your day pass ready speeds up entry when you're on a tight weather window.",
    },
    {
      headline: "Go to Brackley now — rain two hours out.",
      summary: "Right now Brackley is in excellent shape. A two-hour beach window is perfect for this location — closer to Charlottetown than most people think. Get moving.",
      insight: "Brackley is 20 minutes from Charlottetown — the closest national park beach to the city. On a two-hour window, the drive-to-beach ratio is excellent.",
    },
    {
      headline: "Solid window — Brackley over Cavendish.",
      summary: "Two hours of good conditions ahead. On a time-limited day, Brackley is the smarter call than Cavendish — less parking stress and faster access from Charlottetown. Go now.",
      insight: "The covered beach pavilion at Brackley makes a good rain shelter if you stretch your window slightly. It overlooks the dunes and is genuinely pleasant even in light rain.",
    },
    {
      headline: "Clean conditions — two hours to use them.",
      summary: "Brackley is excellent right now. Rain arrives in two hours. That's a full proper beach visit — swim, dune walk, and a quiet moment. Leave when you planned to.",
      insight: "The east end of Brackley beach near the Stanhope boundary is the least visited stretch on the whole north shore national park — on a time-limited day it's worth heading that direction.",
    },
    {
      headline: "Two hours at the best quiet beach.",
      summary: "Good window at Brackley before rain arrives. Everything is perfect right now — the crowds will come, the weather will go. Get there ahead of both.",
      insight: "Lifeguards at Brackley are on duty from late June to Labour Day, 10am to 6pm. If you arrive early in your window, you'll catch them before the beach fills.",
    },
  ],
  fair_raining_now_gusty: [
    {
      headline: "Brackley is washed out today.",
      summary: "Rain and gusts have made the national park beach unpleasant. Not worth the park pass today. Come back tomorrow — north shore beaches recover beautifully after frontal rain.",
      insight: "The day after a rain event at Brackley is often the most beautiful — the sand is fresh, the air is clean, and the beach is noticeably less crowded. A great reason to plan an extra night.",
    },
    {
      headline: "Rain and wind — skip the beach.",
      summary: "Gusty and wet at Brackley. The dune boardwalk is slippery and the beach is uncomfortable. Save your park pass for a better day.",
      insight: "Shaw's Hotel, right near the Brackley beach access, is one of the oldest operating hotels in Canada. Their dining room is a genuine rain backup and something most visitors to the beach never discover.",
    },
    {
      headline: "National park is not beach weather today.",
      summary: "Active rain and gusts at Brackley. Not a beach day. The south shore or Charlottetown are both drier options right now.",
      insight: "After a northwest rain event, north shore water clarity at Brackley is often dramatically better the next morning — the fresh water runoff from the red soil fields changes the colour of the gulf temporarily.",
    },
    {
      headline: "Rain and gusts shut Brackley down.",
      summary: "Wet and windy across the north shore. Brackley is the kind of beach that shines on nice days and gives nothing in poor conditions. Come back when the front moves through.",
      insight: "The Brackley Beach area has some of the best storm-chasing photography opportunities on PEI — the national park dunes and the wild Gulf make dramatic images. Worth it if you have weather-sealed gear.",
    },
    {
      headline: "North shore is rough today.",
      summary: "Gusts and rain have made Brackley uncomfortable. Skip it. The Charlottetown waterfront and downtown are drier and more interesting in these conditions.",
      insight: "The Stanhope golf course adjacent to the national park is one of the best post-rain courses on the island — the layout along the dune edge plays differently after a wet front and the fairways drain well.",
    },
  ],
};

// ─── GOLF (FOX MEADOW + BELVEDERE) ───────────────────────────────────────────

const foxMeadowGolf: ResponseTemplates = {
  excellent_none_calm: [
    {
      headline: "Fox Meadow is in perfect condition.",
      summary: "Calm air, ideal temperature, and dry fairways. A round at Fox Meadow today will be as good as PEI golf gets. Ball flight is true, greens are fast, and there's nothing working against you.",
      insight: "Fox Meadow's tree-lined fairways make it one of the most wind-sheltered courses on the island. Even when the coast is breezy, the interior holes here barely move.",
    },
    {
      headline: "Best golf conditions of the season.",
      summary: "No wind, comfortable temperature, and dry conditions throughout. Fox Meadow is fully on today — predictable ball flight, good roll on the greens, and a beautiful round ahead.",
      insight: "Morning tee times at Fox Meadow before 9am offer the calmest air and cooler temperatures of the day. The dew on the greens is heavier in the morning but the course is quieter and the light is better.",
    },
    {
      headline: "Go book a tee time — it's excellent.",
      summary: "Ideal golf conditions today. Calm, dry, and comfortable from the first tee to the 18th green. Fox Meadow's layout rewards clean contact and today you'll get it.",
      insight: "Holes 7, 12, and 16 at Fox Meadow are the most exposed to any wind that does show up. On a calm day like today they're the most beautiful holes on the course — take your time.",
    },
    {
      headline: "Perfect round weather at Fox Meadow.",
      summary: "Calm, warm, and dry. The fairways are in excellent shape, the greens are true, and the air is still. Go play.",
      insight: "The par-3 over the pond at Fox Meadow is one of the most photographed holes in PEI golf. In calm conditions like today the reflection is perfect — stop and take the shot.",
    },
    {
      headline: "Fox Meadow is fully open and ready.",
      summary: "Great conditions in every direction. No wind to fight, no rain to dodge, and a course in ideal shape. A round today will feel effortless.",
      insight: "The practice range at Fox Meadow faces west — warming up in the morning you'll have the sun at your back, which is rare for a range and makes for perfect warm-up visibility.",
    },
  ],
  good_none_light: [
    {
      headline: "Light breeze — great golf conditions.",
      summary: "A 10–15 km/h breeze adds a small challenge without making the course frustrating. Club up by half a club on approach shots. Conditions are excellent overall and the round will be enjoyable.",
      insight: "Light wind at Fox Meadow typically comes from the southwest and tends to be a crosswind on the north-south holes. It's the most honest wind for testing your ball-striking.",
    },
    {
      headline: "Good round ahead — light wind.",
      summary: "Light breeze keeps things interesting without being punishing. The course is in great shape and conditions are comfortable. Go play and enjoy it.",
      insight: "The tree lines at Fox Meadow create wind corridors on some holes — the ball flight on the open holes will feel the breeze more than the sheltered ones. Factor in the transitions.",
    },
    {
      headline: "Fox Meadow is playing well today.",
      summary: "Light wind and comfortable temperature make for a genuine enjoyable round. Nothing tricky about the conditions — just good golf weather.",
      insight: "Fox Meadow's greens tend to be slightly firmer in the morning and soften by afternoon. If you're playing in this window, expect a bit more run than usual on approach shots.",
    },
    {
      headline: "Great conditions at Fox Meadow.",
      summary: "Light breeze, dry fairways, and comfortable air. The course is playing well and conditions are in your favour. Book a tee time if you haven't.",
      insight: "The closing three holes at Fox Meadow trend northeast — a light southwest breeze will be a slight tailwind on 16, 17, and 18. Good to know when you're making club decisions coming in.",
    },
    {
      headline: "Good golf day — light wind helps.",
      summary: "Comfortable temperature with a light breeze that keeps things cool without complicating shot selection significantly. Fox Meadow is in good shape today.",
      insight: "PEI's light southwest afternoon breeze is the most consistent meteorological feature on the island. Fox Meadow's layout was designed with it in mind — go with it, not against it.",
    },
  ],
  good_none_breezy: [
    {
      headline: "Breezy round ahead — manageable.",
      summary: "Wind at 25–35 km/h will be a factor at Fox Meadow today, especially on the open holes. Club selection becomes critical. The sheltered tree sections play normally — the exposed holes will test you.",
      insight: "Holes 7, 12, and 16 at Fox Meadow are the course's most exposed. In a breezy round, play conservatively on those three and make your birdies on the sheltered holes.",
    },
    {
      headline: "Wind is up — good challenge today.",
      summary: "30 km/h wind makes Fox Meadow a different test than calm days. True ball flight and course management matter more when it's breezy. A great round for experienced players.",
      insight: "Fox Meadow's tree lines provide genuine wind protection on about 60% of the holes. The breezy holes cluster on the back nine — if you can get to the turn in good shape, you know what's coming.",
    },
    {
      headline: "Breezy at Fox Meadow — still excellent.",
      summary: "Wind is the only challenge today and it's a manageable one. The course is in great shape, conditions are dry, and a breezy round at a good course is better than a calm round at a bad one.",
      insight: "PEI golf in a breeze is the authentic island golf experience — locals play in these conditions regularly and the scores reflect the wind. Don't be hard on yourself for a number that's higher than usual.",
    },
    {
      headline: "Wind adds challenge — go play anyway.",
      summary: "Breezy but good. 25–35 km/h wind across the open sections. Adjust your club selection, respect the exposed holes, and enjoy a real test of your game.",
      insight: "When the wind is from the southwest at Fox Meadow, the back nine plays into it for most of the outward holes. Saving your best driving for the homeward holes — where the wind helps — is good strategy.",
    },
    {
      headline: "Fox Meadow is open and breezy.",
      summary: "A 30 km/h breeze is today's main variable. The tree-lined holes play normally; the open holes require extra club. A challenging and rewarding round if you're up for it.",
      insight: "The Fox Meadow clubhouse patio is one of the best spots to watch a breezy PEI evening — the light through the tree canopy after a round is worth staying for.",
    },
  ],
  fair_raining_now_breezy: [
    {
      headline: "Wet and breezy — difficult round today.",
      summary: "Rain and wind have made Fox Meadow challenging. Wet fairways, soft greens, and crosswind on the open holes. Playable if you're committed, unpleasant if you were hoping for nice conditions.",
      insight: "Fox Meadow drains well after rain — fairways recover faster than most PEI courses because the soil composition under the turf is sandy. A morning rain often clears by tee time.",
    },
    {
      headline: "Rain and wind make today tough.",
      summary: "Active rain and 25+ km/h wind are making Fox Meadow a wet challenge. The course is open but conditions aren't what you'd want for a serious round. Your call.",
      insight: "The Fox Meadow clubhouse is genuinely comfortable for waiting out a front — good food, dry seats, and windows that look out over the course. Not a bad way to spend 90 minutes.",
    },
    {
      headline: "Wet conditions at Fox Meadow.",
      summary: "Rain has arrived and wind is up. The course is playable but not enjoyable in these conditions. If your tee time is still 2+ hours away, conditions may improve.",
      insight: "Soft greens after rain at Fox Meadow hold approach shots better than firm conditions — if you do play, fire at flags you'd normally lay up to. The wet conditions create scoring opportunities.",
    },
    {
      headline: "Not ideal — rain and wind today.",
      summary: "Wet and breezy at Fox Meadow right now. If you're already dressed and committed, go — the course is open. If you're deciding, today is a reschedule call.",
      insight: "Any PEI round in the rain is redeemed by the post-round clubhouse experience. Fox Meadow's patio and kitchen are worth staying for even if the round was a washout.",
    },
    {
      headline: "Rain on the course — tough conditions.",
      summary: "Rain and wind have combined to make Fox Meadow difficult today. The course is open but conditions are challenging. Think about whether you want to spend 4 hours in this.",
      insight: "Wet rounds at Fox Meadow in the morning often clear into beautiful afternoons. Check the rain window — if the front passes by noon, afternoon tee times will be excellent.",
    },
  ],
};

const belvedereGolf: ResponseTemplates = {
  excellent_none_calm: [
    {
      headline: "Belvedere is perfect today.",
      summary: "Calm, dry, and beautiful on the West River. A round at Belvedere in these conditions is one of PEI's better outdoor experiences — the riverfront holes are stunning and the greens are true.",
      insight: "Belvedere's riverfront holes create natural wind corridors when it's breezy, but on calm days like today they're the most scenic holes in Charlottetown. Take your time on holes 4 and 8.",
    },
    {
      headline: "Historic course in ideal conditions.",
      summary: "Perfect golf weather at one of Atlantic Canada's oldest clubs. Calm air, dry fairways, and a course in excellent shape. A morning or afternoon round here today is genuinely special.",
      insight: "Belvedere was established in 1906 — the mature trees that line the fairways were planted over a century ago. On a calm day, the canopy makes certain holes feel like a completely enclosed natural space.",
    },
    {
      headline: "Go play Belvedere today.",
      summary: "Excellent conditions at the West River course. Calm, comfortable, and perfectly suited for a proper round. The greens are in good shape and the ball flight will be clean.",
      insight: "The riverside holes at Belvedere flood occasionally in early spring but drain well through summer. By July the course is at its firmest and fastest — conditions right now are peak season.",
    },
    {
      headline: "Belvedere is in great shape.",
      summary: "Calm air and dry conditions make this one of the better rounds of the season at Belvedere. Minutes from downtown, with a course that plays longer than it looks.",
      insight: "Walking Belvedere is one of the best morning exercise options in Charlottetown — the West River views, the mature hardwood canopy, and the flat grade make it genuinely pleasant even if the golf isn't serious.",
    },
    {
      headline: "Perfect round at a classic club.",
      summary: "Excellent conditions throughout. Calm wind, comfortable temperature, and a historic course in ideal shape. Belvedere is one of those places that earns its reputation on days exactly like this.",
      insight: "The Belvedere clubhouse patio overlooks the 18th green and the West River — the best post-round seat in Charlottetown. Worth staying for a drink even if you're not a member.",
    },
  ],
  good_none_breezy: [
    {
      headline: "Breezy round at Belvedere — still good.",
      summary: "Wind at 25–35 km/h is the main variable today. The river corridor holes will feel more exposed than the inland sections. Adjust your club selection and you'll have a good round.",
      insight: "The Southwest wind at Belvedere creates consistent crosswinds on holes 4, 8, and 14 along the river. Experienced Belvedere players always compensate with an extra club and a draw.",
    },
    {
      headline: "Wind is up — Belvedere handles it well.",
      summary: "Breezy conditions at the West River. The inland holes play fairly normally; the riverside holes require more thought. A good test of course management.",
      insight: "Belvedere's river holes are actually more forgiving into a southwest wind — the river bank acts as a natural backstop on approach shots that come up a bit short. Play for the right side of the green.",
    },
    {
      headline: "Breezy but absolutely worth playing.",
      summary: "30 km/h wind adds challenge at Belvedere today. The riverside corridor amplifies it on a few holes. Otherwise the course is in excellent shape and conditions are good.",
      insight: "The mature trees at Belvedere provide real wind protection on the interior holes — the course is probably 30% calmer than the open coast right now. A breezy day here is a good day elsewhere.",
    },
    {
      headline: "Good conditions with a wind challenge.",
      summary: "Breezy at Belvedere — manageable but present. Club up on river holes, play normal on the sheltered sections. A rewarding round for anyone who manages the wind well.",
      insight: "The par-5 along the river at Belvedere plays completely differently into a southwest wind — what's normally a reachable hole becomes a three-shot hole in 30+ km/h. Adjust your strategy, not your tempo.",
    },
    {
      headline: "Belvedere in a proper PEI breeze.",
      summary: "Wind is the factor today at the West River course. 25–35 km/h makes the riverside holes a genuine test. The sheltered back nine plays more normally. A good competitive round.",
      insight: "The closest parking lot to Belvedere is the West Royalty community centre — free overflow parking when the clubhouse lot fills on busy days. Worth knowing on a popular day like this.",
    },
  ],
};

// ─── CAMPGROUNDS ──────────────────────────────────────────────────────────────

const cavendishCampground: ResponseTemplates = {
  excellent_none_calm: [
    {
      headline: "Perfect campground weather tonight.",
      summary: "Calm, warm, and dry — ideal camping conditions at Cavendish. No rain in the forecast, comfortable overnight temperature, and the beach is steps away. A great night on the island.",
      insight: "Cavendish Campground at dusk in summer is one of the most social places on PEI — fire bans aside, the camp atmosphere is genuinely warm. Neighbours at the campground are almost always good company.",
    },
    {
      headline: "Cavendish camping is on tonight.",
      summary: "Excellent conditions for camp setup and a beach evening. Calm air, warm temperature, and clear skies. The walk to the beach after dinner is one of PEI's best free activities.",
      insight: "The campground loop closest to the beach fills first — if you want the beach walk at sunset, arriving early to check in and get a beach-side site is worth prioritising.",
    },
    {
      headline: "Great night to be in the tent.",
      summary: "Calm and comfortable all evening at Cavendish. Good overnight temperature, no incoming weather, and morning beach conditions will be just as good. Go to sleep happy.",
      insight: "September camping at Cavendish is when locals prefer it — post-Labour Day the crowds disappear but the weather is still warm and the water is at its seasonal warmest.",
    },
    {
      headline: "Ideal conditions — set up and enjoy.",
      summary: "Perfect camping weather at Cavendish tonight. Warm, calm, and dry. The beach is at its best in the evening light. A great night to be outdoors on PEI.",
      insight: "The Parks Canada interpretive programs at Cavendish Campground run through the summer — check the bulletin board at the entrance for evening programming. Worth attending even for non-campers.",
    },
    {
      headline: "Calm night ahead at the national park.",
      summary: "Excellent conditions for camping tonight. No wind, comfortable temperature, and clear conditions through to morning. Wake up to good beach conditions too.",
      insight: "Morning fog is common at Cavendish in June and early July — if you wake to fog, it usually burns off by 10am and the beach that follows is often the most beautiful of the day.",
    },
  ],
  good_incoming_120min: [
    {
      headline: "Get set up — rain in two hours.",
      summary: "Good conditions now but rain arrives in about two hours. Get the tent pitched and rain fly secured before the front hits. Once you're set, a rain night at a national park campground is actually peaceful.",
      insight: "A properly guyed rain fly makes camping in light rain genuinely comfortable — the sound of rain on nylon is one of the better camping sounds. Get it right in the next two hours.",
    },
    {
      headline: "Set up fast — rain is two hours out.",
      summary: "Good conditions for camp setup right now. Rain is tracked to arrive in two hours. Get the tent, the rain fly, and your gear sorted before the front. Then relax — it'll pass by morning.",
      insight: "The fire pits at Cavendish Campground are covered by the overhanging trees on many sites — a campfire in light rain is often still possible if you set up under the right canopy.",
    },
    {
      headline: "Good window to get settled in.",
      summary: "Two hours of good conditions ahead before rain moves through. Use the time well — set up your site properly and you'll be comfortable through the wet period.",
      insight: "Cavendish Campground's washroom buildings are a 2-minute walk from most sites — knowing where they are before it rains in the dark is worth a quick reconnaissance this evening.",
    },
    {
      headline: "Camp is good now — rain comes later.",
      summary: "Right now conditions at Cavendish are fine for setup and a beach walk. Rain arrives in two hours. Get the tent up and the site sorted before then.",
      insight: "A well-set-up campsite in light rain is one of the most comfortable places to be. The rain that arrives tonight will likely clear by morning, leaving a beautiful post-rain beach day.",
    },
    {
      headline: "Two good hours — set up and beach walk.",
      summary: "Good conditions right now with a weather window of two hours. Set up camp first, then head to the beach while you have the window. You'll be sorted before the rain hits.",
      insight: "The beach at Cavendish in the last hour before rain often has beautiful light — overcast but not dark, and usually less crowded than a sunny afternoon. Worth the timing.",
    },
  ],
  fair_raining_now_gusty: [
    {
      headline: "Rough night at the campground.",
      summary: "Rain and gusts are making Cavendish uncomfortable right now. If you're already in the tent, hunker down — it will pass. If you're arriving tonight, the washroom buildings are your best shelter.",
      insight: "The Cavendish Campground shower buildings stay warm through rain events and are open until 11pm. A hot shower in the middle of a wet camping night is underrated.",
    },
    {
      headline: "Gusty and wet — tough camping conditions.",
      summary: "Active rain and gusts at the campground. Not a pleasant outdoor night. Your tent and rain fly are your world right now — make sure they're properly secured.",
      insight: "The biggest camping mistake in wind and rain is a loose rain fly. If yours is flapping, it will wake you and potentially fail by morning. Fix it now while you can still see.",
    },
    {
      headline: "Rain and wind — stay inside tonight.",
      summary: "Gusts and rain make outdoor camp activities uncomfortable. Stay in the tent, read, and let the front pass. Tomorrow morning is likely to be significantly better.",
      insight: "Frontal rain systems over PEI typically move through in 4–8 hours. If this arrived in the evening, morning conditions will probably be excellent — keep that in mind as you wait it out.",
    },
    {
      headline: "Sit this one out in the tent.",
      summary: "Active weather at Cavendish tonight. Gusts and rain make the campground wet and unpleasant. Tomorrow will be better. Stay sheltered and rest.",
      insight: "A wet camping night at a national park campground is worth it for the post-storm morning that follows. Cavendish after a front passes is clean, quiet, and extraordinary.",
    },
    {
      headline: "Rough conditions — rain and gusts.",
      summary: "Wind and rain have settled in over the campground. Not a comfortable outdoor evening. Make sure your site is properly secured and wait it out.",
      insight: "The storm moving through now is part of what makes PEI's weather interesting — the Atlantic patterns are real and raw and you're in the middle of one. Morning will flip it.",
    },
  ],
};

const stanhopeCampground: ResponseTemplates = {
  excellent_none_calm: [
    {
      headline: "Stanhope is a perfect quiet camp night.",
      summary: "Calm, comfortable, and wooded — Stanhope Campground at its best. The tree canopy makes it feel private and sheltered. A genuinely peaceful night in the national park.",
      insight: "Stanhope's wooded sites feel more private than Cavendish's open layout — on a calm night with the canopy above you, it's one of the quietest campgrounds in Atlantic Canada.",
    },
    {
      headline: "Ideal conditions at a hidden gem.",
      summary: "Excellent camping weather at Stanhope. Quieter and more sheltered than Cavendish, same national park quality. A great night to be in the trees near the north shore.",
      insight: "The Stanhope area sits near Covehead Bay, which is exceptional for shorebird watching in late summer. Early morning bird activity from the campground is genuinely impressive.",
    },
    {
      headline: "Stanhope is fully on tonight.",
      summary: "Calm, warm, and wooded. Stanhope Campground is at its best in these conditions — the tree cover is at peak fullness and the temperature is comfortable through the night.",
      insight: "The forest understory at Stanhope is home to fireflies in late June and July — one of the best natural evening shows on PEI and completely invisible from the open campgrounds.",
    },
    {
      headline: "Quiet national park camping tonight.",
      summary: "Excellent conditions at Stanhope. Less commercial than Cavendish, more sheltered, and just as beautiful. A proper camping night in the Atlantic Canada tradition.",
      insight: "Brackley Beach is 10 minutes from Stanhope by car and far less crowded than Cavendish — the combination of a Stanhope campsite and a Brackley beach day is the island insider move.",
    },
    {
      headline: "Great night to be at Stanhope.",
      summary: "Calm and comfortable all evening. The wooded campground is at its best right now — cool under the trees, warm enough to sit outside, and no wind to speak of.",
      insight: "The best fog photography on the north shore comes from the Covehead Bay area near Stanhope — morning fog rolling over the estuary before 8am is one of PEI's most beautiful natural moments.",
    },
  ],
  good_incoming_120min: [
    {
      headline: "Good setup window — rain two hours out.",
      summary: "Good conditions for camp setup right now at Stanhope. Rain arrives in two hours. The tree canopy at Stanhope provides more natural rain shelter than most campgrounds — get set up and you'll be comfortable.",
      insight: "Stanhope's tree cover means rain sounds incredible from inside the tent — the canopy absorbs the first heavy drops and creates a layered sound that's one of camping's best moments.",
    },
    {
      headline: "Set up while conditions are good.",
      summary: "Two-hour window before rain at Stanhope. Get the tent pitched under the tree canopy — the natural overhead cover at Stanhope makes rainy nights significantly more comfortable than open campgrounds.",
      insight: "Choosing a site under a mature hardwood at Stanhope rather than a clearing is the most important decision for a rainy night. The canopy intercepts a surprising amount of rain.",
    },
    {
      headline: "Good conditions now — rain comes later.",
      summary: "Set up camp in the next two hours and you'll be ahead of the front. Stanhope's wooded layout is one of the best campgrounds to weather a rain event — the trees do a lot of the work.",
      insight: "Rain at Stanhope Campground in summer usually means a still, warm, foggy morning after — one of the most atmospheric camping mornings on the island.",
    },
    {
      headline: "Two hours to get settled at Stanhope.",
      summary: "Good right now with rain approaching. Use the window to set up properly — rain fly tight, gear off the ground. Then enjoy the natural shelter the trees provide through the night.",
      insight: "The Stanhope washroom building is central to the campground and well-lit — knowing the route there before it rains is basic prep for a comfortable wet night.",
    },
    {
      headline: "Get set up — rain arrives soon.",
      summary: "Conditions are fine for now at Stanhope. Rain is two hours out. The tree canopy makes this a better rain campground than most — get everything sorted while it's dry.",
      insight: "Morning after a rain event at Stanhope, the forest is incredibly fragrant — the cedar and spruce canopy after Atlantic rain is one of the best natural smells on the east coast.",
    },
  ],
};

// ─── SUMMERSIDE ───────────────────────────────────────────────────────────────

const summerside: ResponseTemplates = {
  excellent_none_calm: [
    {
      headline: "Summerside waterfront is perfect.",
      summary: "Calm, warm, and beautiful at the Rotary Boardwalk. The best sunsets in PEI happen from Summerside's west-facing waterfront and tonight's conditions are ideal. Walk the boardwalk.",
      insight: "Summerside faces due west across Bedeque Bay — the sunset from Spinnakers Landing is consistently the best on the island. Arrive at least 20 minutes before sunset for the full experience.",
    },
    {
      headline: "Best waterfront conditions today.",
      summary: "Excellent weather across the Summerside waterfront. Comfortable temperature, calm air, and the full boardwalk loop is accessible. The city feels relaxed and open right now.",
      insight: "The Confederation Trail connects directly from Summerside's waterfront, heading east through the island interior. A flat evening ride along the trail after a waterfront walk is one of the island's best combinations.",
    },
    {
      headline: "Summerside is showing its best side.",
      summary: "Calm and clear at PEI's second city. The waterfront boardwalk is excellent, the dining on the water is comfortable, and the evening light is going to be exceptional.",
      insight: "The College of Piping's Highland Storm performance runs Tuesday and Thursday evenings in summer — worth combining with a Summerside waterfront dinner if you're here on those nights.",
    },
    {
      headline: "Go enjoy Summerside today.",
      summary: "Ideal conditions on the Summerside waterfront. Walk the Rotary Boardwalk, stop at Spinnakers Landing, or just sit and watch the bay. Clean air, calm water, beautiful light.",
      insight: "Summerside's waterfront is significantly less crowded than Charlottetown's even in peak season — the same Maritime harbour atmosphere with a fraction of the tourist traffic.",
    },
    {
      headline: "Calm and beautiful at Spinnakers.",
      summary: "Excellent conditions across the Summerside waterfront. The boardwalk loop is perfect, the harbour is flat, and the evening ahead will be as good as PEI gets from the water.",
      insight: "The Silver Fox Curling Club in Summerside is one of the oldest in Canada — on a good day the building's heritage exterior along the main street is worth the short walk from the waterfront.",
    },
  ],
  excellent_none_light: [
    {
      headline: "Light breeze, great Summerside evening.",
      summary: "A light breeze off Bedeque Bay keeps the waterfront comfortable and alive. Perfect for the boardwalk, dining outside, or watching the boats. Summerside is at its best right now.",
      insight: "The west-facing waterfront in Summerside catches the afternoon sea breeze perfectly — it builds from around 2pm and is at its most comfortable from 4–7pm.",
    },
    {
      headline: "Summerside waterfront is fully on.",
      summary: "Light wind and excellent conditions along the boardwalk. The harbour is moving gently, the restaurants are open for patio service, and the light through the evening will be exceptional.",
      insight: "The Harbour Authority of Summerside boardwalk extension connects to the MacNaught History Centre — a good culture stop before or after the waterfront walk.",
    },
    {
      headline: "Perfect conditions at PEI's second city.",
      summary: "Light breeze, warm air, and a beautiful harbour. Summerside's waterfront is understated and excellent right now. Walk or cycle the full boardwalk — it's worth it.",
      insight: "The Dockyard Market near Spinnakers Landing runs Saturday mornings in summer — good local produce, lobster, and crafts. A great reason to time a Summerside visit.",
    },
    {
      headline: "Great evening ahead at Summerside.",
      summary: "Light wind and comfortable temperature make the Summerside waterfront excellent right now. Everything from the Rotary Boardwalk to Spinnakers Landing is open and inviting.",
      insight: "The harbour seal colony that occasionally appears near the Summerside breakwater is most visible on calm evenings like this — scan the water near the outer breakwater rocks.",
    },
    {
      headline: "Light wind and open water.",
      summary: "Excellent conditions at Summerside. The boardwalk is perfect, the harbour is calm, and the evening light is going to be extraordinary from this west-facing waterfront.",
      insight: "Summerside sits far enough west on the island that it consistently gets an extra 15–20 minutes of evening light compared to Charlottetown. The best sunsets on PEI are from here.",
    },
  ],
  good_incoming_120min: [
    {
      headline: "Boardwalk before the rain — go now.",
      summary: "Excellent Summerside conditions right now with rain tracking in within two hours. Walk the boardwalk, grab a bite on the water, and watch the front come in from the west. Then head inside.",
      insight: "Watching a weather front approach from Summerside's west-facing waterfront is one of the better natural shows on the island — the sky over Bedeque Bay gives you 30 minutes of warning.",
    },
    {
      headline: "Two hours on the Summerside waterfront.",
      summary: "Good conditions right now but rain is two hours out. A boardwalk walk and a waterfront dinner fits perfectly in this window. Go immediately.",
      insight: "The Summerside waterfront restaurants have covered patio sections that make a good rain transition — you can stay outside through light rain and watch the front arrive across the bay.",
    },
    {
      headline: "Waterfront now — rain follows.",
      summary: "Right now Summerside's waterfront is excellent. Rain arrives in two hours. The sunset will be ahead of the rain tonight — a good combination if you time it right.",
      insight: "An approaching front often produces the most dramatic sunset colours. If rain is 90–120 minutes away and the sky is still clear, tonight's Summerside sunset could be exceptional.",
    },
    {
      headline: "Good window for a Summerside evening.",
      summary: "Two hours of clean conditions ahead. The boardwalk, the harbour, and a waterfront meal fit comfortably in this window. Head out now.",
      insight: "The Spinnakers Landing complex has good indoor space that acts as a natural shelter if the front arrives slightly earlier than expected. Worth knowing the layout before you go.",
    },
    {
      headline: "Go before the rain hits Summerside.",
      summary: "Conditions are good now but a front is closing in. A quick waterfront visit or early dinner on the water is completely doable before it arrives.",
      insight: "The Summerside waterfront has enough covered boardwalk and restaurant awning space that light rain doesn't necessarily end the visit — it just moves it slightly.",
    },
  ],
  fair_raining_now_breezy: [
    {
      headline: "Wet and breezy on the Summerside waterfront.",
      summary: "Rain and a harbour breeze have made the outdoor boardwalk uncomfortable. The covered sections of Spinnakers Landing and the restaurants are still good options — this isn't a stay-inside city.",
      insight: "Summerside's indoor culture scene — the Harbourfront Theatre, the MacNaught History Centre — is particularly good for a rainy evening. The theatre has a year-round program worth checking.",
    },
    {
      headline: "Rain on the bay — move inside.",
      summary: "Active rain and wind off Bedeque Bay have made the waterfront uncomfortable. Good covered options are steps away — Summerside handles a wet evening well.",
      insight: "The Harbourfront Theatre in Summerside is one of the best performing arts venues in Atlantic Canada for its size. A rainy evening here is better than a dry evening at most other island options.",
    },
    {
      headline: "Waterfront is wet — city has cover.",
      summary: "Rain and a harbour breeze make outdoor walking unpleasant. Summerside's covered options — restaurants, the theatre, Spinnakers' indoor sections — are all accessible and good.",
      insight: "The Summerside waterfront area near Holman's Ice Cream was once PEI's most productive shipbuilding district — the heritage interpretation panels along the boardwalk tell the story, worth reading even in the rain.",
    },
    {
      headline: "Rain and wind — head inside.",
      summary: "Breezy rain on the Summerside waterfront makes outdoor lingering uncomfortable. Good indoor options are within a 5-minute walk.",
      insight: "Rain in Summerside typically follows patterns from Bedeque Bay — fronts track from the west and move through fairly quickly. Check back in 2 hours, the evening often clears.",
    },
    {
      headline: "Wet boardwalk — covered options are close.",
      summary: "Rain and harbour wind have taken over the Summerside waterfront. Not outdoor weather right now. The covered parts of the city are a very short walk.",
      insight: "Summerside's Main Street, just back from the waterfront, is one of the better preserved heritage commercial strips in PEI — worth exploring on a rainy waterfront evening.",
    },
  ],
};

// ─── STRATFORD ────────────────────────────────────────────────────────────────

const stratford: ResponseTemplates = {
  excellent_none_calm: [
    {
      headline: "Stratford trails are perfect right now.",
      summary: "Calm, warm, and clear across the Stratford waterfront and trail system. Tea Hill Park is beautiful, the harbour trail is open, and the views across to Charlottetown are exceptional.",
      insight: "The Stratford Town Trail running south from Robert Cotton Park to Tea Hill is one of the best flat walking and cycling paths in the Charlottetown area — almost no one from outside Stratford knows it exists.",
    },
    {
      headline: "Best harbour views from the east shore.",
      summary: "Excellent conditions in Stratford today. The waterfront trail and Tea Hill Park are both in great shape. Charlottetown across the harbour looks particularly clear right now.",
      insight: "Tea Hill Park at the south end of Stratford has the best view of Charlottetown Harbour of any accessible public land in the region — the whole city skyline and the harbour spread out from the hillside.",
    },
    {
      headline: "Go explore Stratford's waterfront.",
      summary: "Calm and beautiful on the east shore of Charlottetown Harbour. The Stratford trail system is flat, accessible, and completely uncrowded. A genuinely excellent spot that most visitors never find.",
      insight: "The Hillsborough Bridge cycle path between Charlottetown and Stratford is one of the only car-free harbour crossings in Atlantic Canada. Excellent on a calm day like today.",
    },
    {
      headline: "Stratford is calm and open today.",
      summary: "Excellent conditions throughout the community. Trail running or cycling along the harbour edge is ideal right now. Quiet, well-maintained, and free.",
      insight: "Robert Cotton Park in Stratford has a boat launch and dock that serves as an excellent kayak put-in — the paddle across to Charlottetown Harbour is calm and beautiful in these conditions.",
    },
    {
      headline: "Calm trail conditions in Stratford.",
      summary: "Perfect walking and cycling conditions along the Stratford waterfront. Flat, maintained, and quiet. A great alternative to the busier Charlottetown waterfront right now.",
      insight: "The tidal flats near the Stratford causeway are excellent for sandpipers and herons at low tide — one of the better casual birdwatching spots within 10 minutes of Charlottetown.",
    },
  ],
  good_incoming_120min: [
    {
      headline: "Two good hours on the trail.",
      summary: "Good conditions in Stratford right now with rain arriving in about two hours. A trail run or harbour walk fits perfectly in this window. Head out from Robert Cotton Park immediately.",
      insight: "Stratford is 10 minutes from Charlottetown — if rain cuts the visit short, you're back in the city quickly. The tight window works well here.",
    },
    {
      headline: "Stratford trail window — go now.",
      summary: "Excellent trail and waterfront conditions right now. Rain is two hours out. A proper walk or run along the harbour is completely doable before the front arrives.",
      insight: "The loop from Robert Cotton Park south to Tea Hill and back is just under 6 km — a clean 45-minute run or 90-minute walk. Perfect for a two-hour weather window.",
    },
    {
      headline: "Good conditions — two hours on the east shore.",
      summary: "Right now the Stratford waterfront and trail are in excellent shape. Rain arrives in two hours. Get out and use the window.",
      insight: "Tea Hill Park at the far south end of the Stratford trail loop has a covered picnic shelter with the best harbour view in the region — good to know if the front arrives while you're there.",
    },
    {
      headline: "Rain two hours out — get on the trail.",
      summary: "Good window in Stratford now. The waterfront trail is clear and the conditions are comfortable. Head out immediately and pace yourself to the two-hour mark.",
      insight: "The trail in Stratford follows old railway grade for part of its length — completely flat and fast. Easy to cover distance quickly and stay within your weather window.",
    },
    {
      headline: "Two solid hours on the Stratford trail.",
      summary: "Conditions are good right now. Rain arrives in about two hours. The trail is flat, well-marked, and exactly the right distance for the window you have.",
      insight: "The Stratford harbour front at dawn is one of the least photographed beautiful scenes in PEI — the harbour is still, Charlottetown glows across the water, and there's almost no one around.",
    },
  ],
  fair_raining_now_breezy: [
    {
      headline: "Wet trail — head to Charlottetown instead.",
      summary: "Rain and a harbour breeze have made the Stratford waterfront trail uncomfortable. The trail drains quickly but right now isn't the time. Charlottetown is 10 minutes away.",
      insight: "The Stratford Town Trail is well-drained and recovers fast after rain. A morning wet followed by afternoon clearing often leaves it in perfect condition for an evening run.",
    },
    {
      headline: "Rain on the east shore — postpone.",
      summary: "Active rain and wind in Stratford. The outdoor trail network is wet and breezy. Come back when it clears — the trail is excellent when dry.",
      insight: "Stratford's community centre on Bunbury Road has an indoor track that's open to the public during wet conditions — a good fallback for regular runners.",
    },
    {
      headline: "Wet and breezy — skip the trail.",
      summary: "Rain and harbour wind make the Stratford waterfront uncomfortable right now. Indoor options in Charlottetown are a 10-minute drive.",
      insight: "Post-rain Stratford is particularly photogenic — the red soil paths against wet green grass and the harbour in the background. Worth a quick visit once conditions clear.",
    },
    {
      headline: "Trail is wet and breezy — come back later.",
      summary: "Not a good Stratford trail day. Rain and wind from the harbour are making outdoor activity unpleasant. Give it a couple of hours and the conditions usually flip.",
      insight: "The Stratford library is one of the better community spaces in the region — a 5-minute drive from the trail and a good quiet option when the weather shuts down outdoor plans.",
    },
    {
      headline: "Rain and wind — not trail weather.",
      summary: "Active precipitation and gusts make the Stratford waterfront uncomfortable. Charlottetown has better covered options for a rainy afternoon.",
      insight: "The Hillsborough Bridge bike path is fully exposed when it's breezy and wet — not worth attempting in these conditions. Wait for the front to clear.",
    },
  ],
};

// ─── CORNWALL ─────────────────────────────────────────────────────────────────

const cornwall: ResponseTemplates = {
  excellent_none_calm: [
    {
      headline: "Cornwall boardwalk is perfect today.",
      summary: "Calm, warm, and clear along the West River. The Cornwall boardwalk and trail network are at their best right now. An underused gem that most tourists completely miss.",
      insight: "The West River boardwalk in Cornwall offers the best freshwater paddling access near Charlottetown — calm river conditions today make it ideal for a kayak launch from the boardwalk put-in.",
    },
    {
      headline: "West River trail is fully on.",
      summary: "Excellent conditions throughout Cornwall today. The boardwalk is clear, the river is calm, and the trail through to the APM Centre is quiet and well-maintained. Go.",
      insight: "The Cornwall boardwalk section along the West River estuary has excellent shorebird activity at low tide — herons, egrets, and sandpipers work the shallows within metres of the path.",
    },
    {
      headline: "Go explore Cornwall's waterfront.",
      summary: "Calm air and clear conditions make the Cornwall trail system ideal today. The West River is at its flattest and the boardwalk is in perfect shape.",
      insight: "The Cornwall Farmers Market runs Saturday mornings at the Terry Fox Sports Complex — close to the trailhead and worth combining with a boardwalk walk.",
    },
    {
      headline: "Perfect conditions along the West River.",
      summary: "Excellent weather throughout Cornwall's outdoor network. Flat, calm, and beautiful along the riverfront. A great alternative to the Charlottetown waterfront when you want something quieter.",
      insight: "The tidal portion of the West River near Cornwall changes dramatically between high and low tide — the estuary can look like a different place within six hours. Both versions are beautiful.",
    },
    {
      headline: "Calm and beautiful at Cornwall.",
      summary: "Ideal conditions along the West River trail and boardwalk. Comfortable temperature, no wind, great visibility. Cornwall's trail system is at its best on a day like this.",
      insight: "The sunset from the Cornwall boardwalk facing west over the estuary is one of the more beautiful in the greater Charlottetown area — easy to miss if you never come to the west shore.",
    },
  ],
  good_incoming_120min: [
    {
      headline: "Two good hours along the West River.",
      summary: "Good conditions in Cornwall with rain arriving in about two hours. The boardwalk loop is just right for the window you have. Go from the Terry Fox lot and head south.",
      insight: "The Cornwall boardwalk is mostly sheltered by the riverbank and light tree cover — you can often extend a walk slightly beyond a weather window without getting too wet.",
    },
    {
      headline: "Go now — rain two hours out.",
      summary: "West River trail conditions are good right now. Rain is tracked to arrive in two hours. A proper boardwalk walk or run is completely doable before the front.",
      insight: "The Cornwall boardwalk loop including the estuary section is about 4 km — a comfortable 45-minute walk or 25-minute run. Good for a two-hour weather window.",
    },
    {
      headline: "Good trail window in Cornwall.",
      summary: "Right now Cornwall conditions are excellent. Rain arrives in two hours. Head out along the West River trail and be back at the car before the front hits.",
      insight: "The covered seating at the APM Centre near the Cornwall trail provides a dry backup option if the front arrives slightly earlier than expected.",
    },
    {
      headline: "Two hours on the West River trail.",
      summary: "Good conditions throughout Cornwall's trail network right now. Rain is coming but you have time for a proper walk or run. Go immediately.",
      insight: "The West River at Cornwall is tidal — if you're going to walk to the estuary section, check the tide. Low tide exposes the best mudflat wildlife. High tide makes the river look like a lake.",
    },
    {
      headline: "Cornwall trail — good window right now.",
      summary: "Conditions are good along the West River. Rain arrives in two hours. A comfortable trail walk or run fits perfectly. Head to the Terry Fox trailhead and go.",
      insight: "Cornwall is 15 minutes from Charlottetown — one of the closest fresh trail options to the city and consistently less crowded than anything on the waterfront.",
    },
  ],
};

// ─── CHARLOTTETOWN AIRPORT ────────────────────────────────────────────────────

const charlottetownAirport: ResponseTemplates = {
  excellent_none_calm: [
    {
      headline: "Clear conditions for departures today.",
      summary: "Calm wind, excellent visibility, and no weather events on approach. Standard operating conditions at Charlottetown Airport. Expect normal operations throughout the day.",
      insight: "The airport sits in a natural wind shadow — readings here are typically 10–15 km/h lighter than the Charlottetown waterfront just 5 km south. A calm airport day is almost always a calm city day too.",
    },
    {
      headline: "Good flying conditions today.",
      summary: "Visibility is excellent, wind is calm, and no significant weather is approaching. Normal operations expected. A standard travel day.",
      insight: "Charlottetown Airport's single runway (03-21) runs northeast-southwest — calm wind conditions mean all aircraft use the preferred runway without crosswind adjustments.",
    },
    {
      headline: "Ideal conditions at YYG today.",
      summary: "Clear skies, calm wind, and excellent visibility throughout the day. No weather concerns for arrivals or departures. A straightforward travel day in both directions.",
      insight: "The best PEI views from a landing aircraft come from the north approach on Runway 03 — the descent over the farmland and the red shoreline is one of the more beautiful approaches in Canada.",
    },
    {
      headline: "Smooth travel conditions today.",
      summary: "No weather concerns at Charlottetown Airport today. Calm wind, clear air, and standard conditions throughout. Arrivals and departures are on normal schedule.",
      insight: "On calm clear days, landing at Charlottetown offers one of the clearest views of the island's geography — the red soil, the north shore, and the Confederation Bridge all visible on approach.",
    },
    {
      headline: "Clear and calm — standard operations.",
      summary: "Weather is ideal for all airport operations today. Excellent visibility, calm wind, no precipitation. A clean travel day at YYG.",
      insight: "Charlottetown Airport's departure lounge is small but the pre-security café makes a good meeting point — it's accessible without a boarding pass and overlooks the tarmac.",
    },
  ],
  good_none_breezy: [
    {
      headline: "Breezy but normal operations expected.",
      summary: "Wind is 25–35 km/h — within normal operating limits for Charlottetown Airport. Some turbulence on approach and departure is possible but no restrictions are in effect. Travel normally.",
      insight: "Turboprop aircraft on the Charlottetown–Halifax and Charlottetown–Ottawa routes handle 30 km/h wind without difficulty. Passenger comfort may be slightly reduced on approach but operations are normal.",
    },
    {
      headline: "Wind is up — travel normally.",
      summary: "Breezy conditions at the airport today but below any restriction thresholds. Crosswind may affect smaller aircraft comfort on approach. No delays expected.",
      insight: "Wind at the airport typically eases by evening on breezy days — if you're concerned about a late afternoon flight, it's likely to be calmer than the current reading suggests.",
    },
    {
      headline: "Some wind — normal airport operations.",
      summary: "25–35 km/h wind is present but within normal limits. Expect a slightly bumpy approach and departure. Operations are running normally.",
      insight: "The airport wind readings are from the weather station on the apron — they reflect actual operational conditions more accurately than the nearest town weather station.",
    },
    {
      headline: "Breezy day — no impact on flights.",
      summary: "Wind is noticeable but all operations are normal at YYG today. Crosswind component is within limits for all regular aircraft types. Travel as planned.",
      insight: "The de Havilland Dash-8 turboprops that dominate YYG routes are certified for significantly higher wind speeds than today's readings. Comfort varies — operations don't.",
    },
    {
      headline: "Wind up — expect normal service.",
      summary: "A breezy day at Charlottetown Airport but no restrictions or delays expected. Normal travel conditions — just a bit of movement on approach.",
      insight: "Runway 03-21 is slightly longer than most regional airport runways in Atlantic Canada — it handles larger jets comfortably and the crosswind performance is good in today's conditions.",
    },
  ],
  fair_raining_now_gusty: [
    {
      headline: "Gusty and wet — check your flight.",
      summary: "Rain and gusts at the airport today. Operations may be affected — check with your airline before heading to the terminal. IFR conditions are possible and some delays are realistic.",
      insight: "Charlottetown Airport's IFR approach capabilities allow operations in low visibility and moderate wind. Most commercial flights still operate in these conditions — check with your airline rather than assuming.",
    },
    {
      headline: "Significant weather — verify your flight.",
      summary: "Active rain and gusty wind at YYG. Contact your airline directly to confirm operations. Weather conditions are within the range where delays can occur.",
      insight: "Air Canada and Porter flights out of Charlottetown have relatively short turnaround connections — a delayed inbound aircraft from Halifax or Ottawa in weather like this can create cascading delays. Check the app.",
    },
    {
      headline: "Rain and gusts at the airport today.",
      summary: "Weather conditions are challenging at YYG right now. Flights may be delayed or require instrument approaches. Confirm your flight status before leaving for the airport.",
      insight: "The Charlottetown Airport terminal is comfortable for a weather wait — small but well-maintained, with seating near the windows overlooking the runway. Not a bad place to track your inbound aircraft.",
    },
    {
      headline: "Check your flight — weather is active.",
      summary: "Rain and gusts are making conditions at Charlottetown Airport significant today. Operations are likely continuing but delays are possible. Verify before heading to the terminal.",
      insight: "The airport parking lot is a short walk from the terminal in any weather — the covered canopy walk handles rain. Weather at pickup is rarely a problem even on active days.",
    },
    {
      headline: "Weather event — confirm operations.",
      summary: "Active rain and gusty wind at YYG. Check your airline's app or website for current flight status. Conditions are within the range where operational impacts are possible.",
      insight: "The Charlottetown control tower handles IFR traffic in these conditions routinely — this isn't exceptional weather for the facility, just challenging. Most commercial flights will operate.",
    },
  ],
  stay_inside_raining_now_dangerous: [
    {
      headline: "Severe weather — expect delays.",
      summary: "Dangerous wind and heavy rain have created significant conditions at YYG. Contact your airline immediately. Delays and diversions are possible in these conditions.",
      insight: "Aircraft diverting from Charlottetown in severe weather typically go to Halifax or Moncton. Your airline's app will show rebooking options. Calling ahead is better than waiting at the airport.",
    },
    {
      headline: "Severe conditions at the airport.",
      summary: "Severe weather is affecting Charlottetown Airport. Do not assume your flight is operating. Check with your airline directly and consider arriving later if conditions are forecast to improve.",
      insight: "Severe weather events at Charlottetown typically clear within 4–8 hours. A flight delayed for weather in the morning often operates normally by afternoon. Check the forecast window on this page.",
    },
  ],
};

// ─── ALL TEMPLATES ────────────────────────────────────────────────────────────

export const RESPONSE_TEMPLATES: Record<string, ResponseTemplates> = {
  cavendish,
  charlottetown,
  greenwich,
  "confederation-trail": confederationTrail,
  "confederation-bridge": confederationBridge,
  "victoria-park": victoriapark,
  "basin-head": basinHead,
  "north-cape": northCape,
  "brackley-beach": brackleyBeach,
  "fox-meadow-golf": foxMeadowGolf,
  "belvedere-golf": belvedereGolf,
  "cavendish-campground": cavendishCampground,
  "stanhope-campground": stanhopeCampground,
  summerside,
  stratford,
  cornwall,
  "charlottetown-airport": charlottetownAirport,
};
