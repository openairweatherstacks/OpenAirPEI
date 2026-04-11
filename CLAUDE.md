# OpenAir PEI — Project Intelligence File
> Read this file at the start of every Claude Code session before writing any code.

---

## What This App Is

**OpenAir PEI** is a mobile-first environmental intelligence web app for Prince Edward Island, Canada. It is not a weather app. It is an AI-powered meteorologist — a living, thinking system that interprets real-time environmental data and tells people exactly what to do, when to go, and how long they have.

The core question this app answers is not "what is the weather?" It answers:
- **"Should I go outside right now?"**
- **"What's the best thing to do on PEI today?"**
- **"How long do I have before conditions change?"**
- **"Is the air safe for my child with asthma?"**
- **"Will the bridge be open when I'm leaving?"**

The AI brain (Anthropic Claude API) powers the interpretation layer — it reads raw environmental data and speaks to users in plain, intelligent, human language. Every data point gets translated into a decision, not a number.

---

## Vision & Tone

**Tagline:** *Real-time nature insights for a safer, smarter Atlantic Canada*

**Brand name:** OpenAir Atlantic — built to scale across all 4 Atlantic provinces from day one. PEI is the launch province. Same codebase, province-specific data layers. This makes the ACOA grant case dramatically stronger than a single-province product.

**Logo colours:** The brand palette is extracted directly from the OpenAir Atlantic logo:
- Gold sun — energy, warmth, optimism — primary CTA colour
- Forest green — nature, health, the OPEN lettermark — success/excellent colour
- Lime green — the leaves, growth, freshness — good conditions colour
- Charcoal — the ATLANTIC wordmark — grounded, professional text
- Black arrow — direction, forward momentum — recurring UI motif

**Design direction:** Sun-forward organic-modern. Warm gold and green on clean white. Not a tech app. Not a tourism brochure. A trusted outdoor intelligence tool that feels like it belongs on the island. The arrow from the logo appears throughout the UI: in the 3-Hour Window countdown, navigation transitions, and "conditions improving" states.

**Voice:** Calm, confident, specific. Like a knowledgeable friend who lives on the island and checks the weather obsessively. Never robotic. Never vague. Always actionable.

**Typography:** DM Serif Display (headlines, AI insights) + DM Sans (data, UI labels). Never Inter, Roboto, or Arial.

**Colour palette — from the OpenAir Atlantic logo:**
```css
/* Brand primaries — extracted from logo */
--color-sun: #F5A623;           /* Gold sun — primary CTA, highlights */
--color-sun-deep: #E8960F;      /* Deeper gold — hover states */
--color-sun-light: #FDF0D5;     /* Light gold tint — card backgrounds */
--color-forest: #3A8C2F;        /* Forest green — Excellent score, OPEN lettermark */
--color-forest-deep: #2D6E24;   /* Deeper green — hover */
--color-forest-light: #E8F5E4;  /* Light green tint — section backgrounds */
--color-leaf: #7DC832;          /* Lime green — Good score, growth indicators */
--color-leaf-light: #F2F8EE;    /* Light lime — subtle backgrounds */
--color-charcoal: #4A4A4A;      /* ATLANTIC wordmark — body text */
--color-arrow: #1A1A1A;         /* Logo arrow — icons, directional elements */

/* Conditions scoring */
--color-excellent: #3A8C2F;     /* Forest green */
--color-good: #7DC832;          /* Leaf lime */
--color-fair: #F5A623;          /* Sun gold */
--color-danger: #C0392B;        /* Universal red — Stay Inside */

/* UI surfaces */
--color-bg: #FAFAF7;            /* Warm off-white */
--color-bg-card: #FFFFFF;       /* Pure white cards */
--color-border: #E8EDE4;        /* Soft green-grey borders */
--color-text-primary: #2A2A2A;  /* Near-black */
--color-text-secondary: #6B7366; /* Muted green-grey */
--color-text-muted: #9BA696;    /* Raw data values, timestamps */
```

**Tailwind config — add to tailwind.config.ts:**
```typescript
colors: {
  sun: { DEFAULT: '#F5A623', deep: '#E8960F', light: '#FDF0D5' },
  forest: { DEFAULT: '#3A8C2F', deep: '#2D6E24', light: '#E8F5E4' },
  leaf: { DEFAULT: '#7DC832', light: '#F2F8EE' },
  charcoal: { DEFAULT: '#4A4A4A', muted: '#9BA696' },
  excellent: '#3A8C2F',
  good: '#7DC832',
  fair: '#F5A623',
  danger: '#C0392B',
}
```

**Conditions colour system — logo-aligned:**
- Excellent -> --color-forest #3A8C2F (forest green from OPEN)
- Good -> --color-leaf #7DC832 (lime green from the leaves)
- Fair -> --color-sun #F5A623 (gold from the sun)
- Stay Inside -> --color-danger #C0392B (universal red)

**The arrow motif:** The horizontal arrow from the logo is a design element throughout the UI — window countdown arrows, navigation transitions, "conditions improving ->" indicators. It is part of the brand DNA.

---

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Framework | **Next.js 15** (App Router) | PWA-ready, server components for API calls, Vercel deploy |
| Language | **TypeScript** | Type safety for API responses |
| Styling | **Tailwind CSS** | Rapid mobile-first styling |
| Map | **Leaflet.js** + **React-Leaflet** | Free, no API key, OpenStreetMap tiles |
| AI Brain | **Anthropic Claude API** (claude-sonnet-4-6) | Meteorologist interpretation layer |
| Data APIs | **MSC GeoMet** (Environment Canada) | Free, no key, real-time weather |
| Air Quality | **ECCC AQHI API** | Free, real-time air quality health index |
| Tides | **Fisheries & Oceans Canada API** | Free, PEI tide data |
| Animations | **Framer Motion** | Smooth mobile-feel transitions |
| Icons | **Lucide React** | Clean, consistent icon set |
| Fonts | Google Fonts (DM Serif Display + DM Sans) | Via next/font |
| Deployment | **Vercel** (free tier) | Zero config, instant deploys |
| PWA | **next-pwa** | Install to home screen, offline support |

---

## Environment Variables

Create `.env.local` with:
```
ANTHROPIC_API_KEY=your_key_here
NEXT_PUBLIC_APP_NAME=OpenAir PEI
NEXT_PUBLIC_APP_URL=https://openairpei.ca
```

Never expose `ANTHROPIC_API_KEY` to the client. All Claude API calls must go through `/app/api/` server routes.

---

## Core Data Sources

### 1. Environment Canada — MSC GeoMet OGC API
**Base URL:** `https://api.weather.gc.ca/`
**No API key required. Free. Real-time.**

Key endpoints to use:
```
# Current conditions for a station
GET https://api.weather.gc.ca/collections/climate-hourly/items?station_number={id}&datetime={date}

# Weather observations (nearest station)
GET https://api.weather.gc.ca/collections/swob-realtime/items?station_number={id}

# AQHI real-time
GET https://api.weather.gc.ca/collections/aqhi-observations-realtime/items?location_id={id}

# Severe weather alerts
GET https://api.weather.gc.ca/collections/ahccd-annual/items

# Hourly forecast
GET https://api.weather.gc.ca/collections/forecast-polygons/items
```

**PEI Weather Station IDs (MSC):**
```typescript
const PEI_STATIONS = {
  charlottetown: '8300300',
  summerside: '8300200', 
  northRustico: '8301100',
  eastPoint: '8300500',
  borden: '8300100',
}
```

**PEI AQHI Location IDs:**
```typescript
const PEI_AQHI = {
  charlottetown: 'PEI-001',
  summerside: 'PEI-002',
  wellington: 'PEI-003',
}
```

### 2. Fisheries & Oceans Canada — Tides API
**Base URL:** `https://api.iwls-sine.azure.cloud-nuage.canada.ca/api/v1/`
**No API key required. Free.**
```
GET /stations                          # List all tide stations
GET /stations/{id}/data?time-series-code=wlp-hilo  # High/low tides
```

**PEI Tide Stations:**
```typescript
const PEI_TIDE_STATIONS = {
  charlottetown: '5cebf1e23d0f4a073c4bbffa',
  summerside: '5cebf1de3d0f4a073c4bba15',
  georgetownHarbour: '5cebf1e43d0f4a073c4bc05c',
}
```

### 3. Confederation Bridge Wind Data
The bridge closes to high-sided vehicles at sustained winds >70km/h and motorcycles at >60km/h. Pull wind data from Borden weather station and apply these thresholds programmatically.

---

## PEI Key Locations

These are the 8 locations shown on the map and in location cards:

```typescript
export const PEI_LOCATIONS = [
  {
    id: 'cavendish',
    name: 'Cavendish Beach',
    nameFr: 'Plage de Cavendish',
    lat: 46.4943,
    lng: -63.3971,
    type: 'beach',
    nearestStation: '8301100', // North Rustico
    activities: ['swimming', 'cycling', 'hiking'],
    icon: '🏖️',
  },
  {
    id: 'charlottetown',
    name: 'Charlottetown Waterfront',
    nameFr: 'Front de mer de Charlottetown',
    lat: 46.2382,
    lng: -63.1311,
    type: 'city',
    nearestStation: '8300300',
    activities: ['walking', 'cycling', 'dining'],
    icon: '🏙️',
  },
  {
    id: 'greenwich',
    name: 'Greenwich Dunes',
    nameFr: 'Dunes de Greenwich',
    lat: 46.4467,
    lng: -62.6889,
    type: 'park',
    nearestStation: '8300500',
    activities: ['hiking', 'birdwatching', 'photography'],
    icon: '🌿',
  },
  {
    id: 'confederation-trail',
    name: 'Confederation Trail — Kensington',
    nameFr: 'Sentier de la Confédération — Kensington',
    lat: 46.4547,
    lng: -63.6343,
    type: 'trail',
    nearestStation: '8300200',
    activities: ['cycling', 'walking', 'running'],
    icon: '🚴',
  },
  {
    id: 'confederation-bridge',
    name: 'Confederation Bridge',
    nameFr: 'Pont de la Confédération',
    lat: 46.1500,
    lng: -63.7833,
    type: 'bridge',
    nearestStation: '8300100',
    activities: ['driving', 'motorcycling'],
    icon: '🌉',
  },
  {
    id: 'victoria-park',
    name: 'Victoria Park',
    nameFr: 'Parc Victoria',
    lat: 46.2310,
    lng: -63.1200,
    type: 'park',
    nearestStation: '8300300',
    activities: ['walking', 'picnic', 'cycling'],
    icon: '🌳',
  },
  {
    id: 'basin-head',
    name: 'Basin Head (Singing Sands)',
    nameFr: 'Basin Head (Sables chantants)',
    lat: 46.3589,
    lng: -62.0661,
    type: 'beach',
    nearestStation: '8300500',
    activities: ['swimming', 'walking', 'photography'],
    icon: '🎵',
  },
  {
    id: 'north-cape',
    name: 'North Cape',
    nameFr: 'Cap-Nord',
    lat: 47.0583,
    lng: -63.9989,
    type: 'landmark',
    nearestStation: '8300200',
    activities: ['hiking', 'whale-watching', 'photography'],
    icon: '🐋',
  },
]
```

---

## The AI Brain — How Claude Thinks

Every location gets its conditions assessed by Claude API. The server route processes raw data and asks Claude to respond as a meteorologist.

### Server Route: `/app/api/conditions/route.ts`

```typescript
// System prompt — sets the AI meteorologist persona
const SYSTEM_PROMPT = `You are OpenAir PEI's AI meteorologist — a calm, knowledgeable local expert 
who has lived on Prince Edward Island for 30 years. You speak plainly and specifically. 
You never say "it appears" or "it seems." You give direct, actionable verdicts.

You receive raw environmental data for a PEI location and return a structured JSON response.
Your language should feel like a trusted friend who checks the weather obsessively — 
specific, warm, never robotic.

Always respond in valid JSON matching the ConditionsResponse type exactly.`

// User prompt template
const buildPrompt = (location: Location, data: WeatherData) => `
Assess current outdoor conditions for ${location.name}, Prince Edward Island.

Raw data:
- Temperature: ${data.temperature}°C (feels like ${data.feelsLike}°C)
- Wind: ${data.windSpeed}km/h from the ${data.windDirection}
- Humidity: ${data.humidity}%
- UV Index: ${data.uvIndex}
- Precipitation probability (next 3hrs): ${data.precipProbability}%
- Precipitation arriving in: ${data.precipMinutes} minutes (null if none forecast)
- Air Quality Health Index: ${data.aqhi} (scale 1-10, 1=best)
- Visibility: ${data.visibility}km
- Location type: ${location.type}
- Typical activities here: ${location.activities.join(', ')}
- Current time: ${new Date().toLocaleTimeString('en-CA', {timeZone: 'America/Halifax'})}

Return ONLY this JSON, no other text:
{
  "score": "Excellent" | "Good" | "Fair" | "Stay Inside",
  "headline": "One punchy sentence (max 12 words) that captures the situation",
  "summary": "2-3 sentences. Specific, actionable, local. What should they know and do right now?",
  "windowMinutes": number | null,  // minutes of good conditions remaining, null if all-day good
  "windowStatement": "string | null",  // e.g. "You have 1h 40min before rain arrives at 2:30pm"
  "uvWarning": "string | null",  // e.g. "Fair skin burns in ~18 min at UV 7. Reapply SPF."
  "bridgeStatus": "Open" | "High-sided vehicle restriction" | "Closed" | null,  // only for bridge location
  "activities": [
    { "name": "swimming", "status": "great" | "ok" | "not recommended", "reason": "brief reason" }
  ],
  "airQualityStatement": "string",  // plain English AQHI interpretation
  "insightOfTheDay": "string"  // one interesting, specific local observation — a detail only a local would notice
}`
```

### Response Type
```typescript
interface ConditionsResponse {
  score: 'Excellent' | 'Good' | 'Fair' | 'Stay Inside'
  headline: string
  summary: string
  windowMinutes: number | null
  windowStatement: string | null
  uvWarning: string | null
  bridgeStatus: 'Open' | 'High-sided vehicle restriction' | 'Closed' | null
  activities: Array<{
    name: string
    status: 'great' | 'ok' | 'not recommended'
    reason: string
  }>
  airQualityStatement: string
  insightOfTheDay: string
}
```

---

## App Structure

### Pages (App Router)
```
app/
├── page.tsx                    # Home — map + location cards
├── location/[id]/page.tsx      # Full conditions page for a location
├── activity/page.tsx           # Activity matcher — "what should I do?"
├── bridge/page.tsx             # Confederation Bridge status
├── air/page.tsx                # Island-wide air quality
├── report/page.tsx             # Community reports submission
├── api/
│   ├── conditions/route.ts     # Fetches weather + runs Claude
│   ├── weather/route.ts        # Raw MSC GeoMet proxy
│   ├── tides/route.ts          # DFO tides proxy
│   └── alerts/route.ts        # EC severe weather alerts
└── layout.tsx                  # Root layout with nav + PWA meta
```

### Components
```
components/
├── map/
│   ├── PEIMap.tsx              # Leaflet map — home screen
│   ├── LocationMarker.tsx      # Coloured dot + popup
│   └── RadarOverlay.tsx        # EC WMS radar layer
├── conditions/
│   ├── ConditionsCard.tsx      # Score + headline card
│   ├── ScoreBadge.tsx          # Colour-coded score pill
│   ├── WindowAlert.tsx         # "X minutes remaining" countdown
│   └── ActivityGrid.tsx        # Activity status grid
├── ui/
│   ├── LocationGrid.tsx        # 8-location card grid (non-map view)
│   ├── AirQualityBar.tsx       # AQHI visual indicator
│   ├── UVTimer.tsx             # Burn time calculator
│   ├── TideCard.tsx            # Next high/low tide
│   └── BridgeStatus.tsx        # Bridge wind status
├── ai/
│   └── MeteorologistInsight.tsx # AI-generated insight display
└── layout/
    ├── BottomNav.tsx            # Mobile bottom navigation
    ├── Header.tsx               # App header
    └── LanguageToggle.tsx       # EN/FR toggle (bilingual)
```

---

## Features to Build (Priority Order)

### Phase 1 — Beta MVP (build first)
1. **PEI Map** — Leaflet, 8 coloured location markers, live conditions dots
2. **Conditions Score** — AI-assessed Excellent/Good/Fair/Stay Inside per location
3. **AI Meteorologist Summary** — Claude-generated plain English per location
4. **3-Hour Window** — "You have X minutes before rain arrives"
5. **Activity Matcher** — swimming/cycling/hiking green/amber/red status
6. **UV Sun Timer** — burn time calculator from UV index
7. **Air Quality** — AQHI plain English translation
8. **Bridge Status** — wind-based Confederation Bridge alert
9. **Live Radar Overlay** — EC WMS precipitation radar on map

### Phase 2 — Post-beta
10. **Tide Card** — DFO tide data, next high/low
11. **Storm Watch** — EC severe weather alerts, location-specific
12. **Community Reports** — user-submitted condition flags
13. **Lobster Season Calendar** — PEI seasonal context layer
14. **Agricultural Mode** — spray index, frost risk, growing degree days
15. **Smoke Event Tracker** — wildfire smoke forecasts
16. **Push Notifications** — storm warnings, UV alerts (PWA)
17. **Bilingual (FR)** — full French translation

---

## Map Configuration

```typescript
// Leaflet map settings
const MAP_CONFIG = {
  center: [46.5107, -63.4168] as [number, number], // PEI centre
  zoom: 9,
  minZoom: 8,
  maxZoom: 14,
  tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '© OpenStreetMap contributors',
}

// EC Radar WMS overlay (precipitation)
const RADAR_WMS = {
  url: 'https://geo.weather.gc.ca/geomet',
  layers: 'RADAR_RRAI_RATE', // Rain rate
  transparent: true,
  format: 'image/png',
  opacity: 0.6,
}

// Marker colours by conditions score
const MARKER_COLORS = {
  'Excellent': '#2D6A4F',
  'Good': '#52BE80',
  'Fair': '#D4A853',
  'Stay Inside': '#C0392B',
}
```

---

## Mobile-First UX Rules

These are non-negotiable for every component:

1. **Bottom navigation** — 5 tabs max, thumb-reachable. Home / Activity / Air / Bridge / Report
2. **Touch targets** — minimum 44×44px for all interactive elements
3. **Cards first** — information in swipeable cards, not tables or lists
4. **Score is always visible** — the colour-coded Conditions Score badge never gets buried
5. **Loading states** — skeleton screens, not spinners. Show the shape of content while loading
6. **Offline-first thinking** — cache last-known conditions, show timestamp of last update
7. **One thumb rule** — primary actions reachable with right thumb in bottom-right quadrant
8. **Map is zoomable** — pinch-to-zoom enabled, no fixed-position overlays that block the map

---

## AI Meteorologist Behaviour Guidelines

Tell Claude to follow these when writing the system prompt and testing outputs:

- **Always specific, never vague.** "Wind is 28km/h from the northwest" not "it's breezy"
- **Always local.** Reference the specific location, not generic PEI
- **Always actionable.** End every summary with what the user should do
- **Never hedge excessively.** One caveat maximum per response
- **Use time.** "By 3pm" or "for the next 2 hours" not "later today"
- **The Insight of the Day** should be genuinely surprising — a local detail, a natural phenomenon, something a visitor would not know
- **Bilingual-ready** — all AI outputs should eventually support FR responses (pass `lang` param)

---

## Caching Strategy

Weather data doesn't need to update every second. Cache aggressively:

```typescript
const CACHE_DURATIONS = {
  currentConditions: 10 * 60,    // 10 minutes (weather changes slowly)
  aiSummary: 15 * 60,            // 15 minutes (Claude calls are not free)
  tides: 60 * 60,                // 1 hour (tides are predictable)
  alerts: 5 * 60,                // 5 minutes (alerts need to be fresh)
  radar: 6 * 60,                 // 6 minutes (EC updates radar every 6 min)
  aqhi: 10 * 60,                 // 10 minutes
}
```

Use Next.js `fetch` cache with `revalidate` tags, not `useEffect` polling.

---

## Conditions Scoring Algorithm

Before calling Claude, pre-calculate a raw score to guide the AI:

```typescript
function calculateRawScore(data: WeatherData): number {
  let score = 100

  // Temperature comfort
  if (data.temperature < 5 || data.temperature > 35) score -= 30
  else if (data.temperature < 10 || data.temperature > 30) score -= 15

  // Wind
  if (data.windSpeed > 60) score -= 40
  else if (data.windSpeed > 40) score -= 20
  else if (data.windSpeed > 25) score -= 10

  // Precipitation
  score -= data.precipProbability * 0.4

  // UV (too high is bad too)
  if (data.uvIndex >= 8) score -= 15
  else if (data.uvIndex >= 6) score -= 5

  // Air quality
  if (data.aqhi >= 7) score -= 30
  else if (data.aqhi >= 4) score -= 15

  // Visibility
  if (data.visibility < 5) score -= 20

  return Math.max(0, Math.min(100, score))
}

function scoreToLabel(score: number): ConditionsScore {
  if (score >= 75) return 'Excellent'
  if (score >= 50) return 'Good'
  if (score >= 25) return 'Fair'
  return 'Stay Inside'
}
```

---

## Commands

```bash
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint check
npm run type-check   # TypeScript check
vercel --prod        # Deploy to production
```

---

## Build Conventions

- **Server components by default** — only add `'use client'` when you need interactivity
- **API routes for all external calls** — never call MSC GeoMet or Anthropic from the browser
- **TypeScript strict mode** — no `any` types
- **Mobile breakpoints first** — `sm:` and up, never `max-w` mobile overrides
- **Tailwind only** — no inline styles except for dynamic values (map colours, etc.)
- **Framer Motion for transitions** — page transitions, card reveals, score badge animations
- **Error boundaries** — every data-fetching component wrapped, show last cached data on error
- **Accessibility** — WCAG 2.1 AA minimum. ARIA labels on all icon buttons. Keyboard navigable.

---

## The Hybrid Display Rule — Show Both, Lead with Intelligence

OpenAir PEI always shows **both** the raw data value and the AI interpretation together. The
interpretation leads. The number follows quietly beneath it. Neither exists without the other.

Think of it like a doctor's visit: they say "your blood pressure is slightly elevated, cut back
on salt" — but they still show you the 140/90 reading. The insight builds understanding. The
number builds trust. Together they are more credible than either alone.

### The Display Pattern (apply to every data metric)

```
[AI Interpretation — large, prominent, human]
[Raw number — small, muted, below]
```

**In code, every metric card looks like this:**
```tsx
<MetricCard>
  <AIInsight>Perfect cycling weather — light jacket optional</AIInsight>
  <RawValue>18°C · Feels like 16°C</RawValue>
</MetricCard>
```

### The Full Hybrid Display Table

| Metric | Raw Value (shown small, muted) | AI Interpretation (shown large, prominent) |
|---|---|---|
| Temperature | `18°C · Feels like 16°C` | "Perfect cycling weather — light jacket optional" |
| UV Index | `UV 7 · High` | "Fair skin burns in ~20 min. Reapply SPF before heading out." |
| Wind | `35km/h NW · Gusty` | "Beach umbrella will be a fight today. Stick to sheltered spots." |
| Air Quality | `AQHI 3 · Low Risk` | "Air is clean. Great day for kids and anyone with asthma." |
| Precipitation | `60% · Rain likely` | "Rain arrives around 2:30pm — you have 2 hours of good weather." |
| Visibility | `8km · Good` | "Clear enough to spot the red cliffs from the water today." |
| Humidity | `72% · Humid` | "Feels muggier than the temperature suggests. Stay hydrated on the trail." |
| Tide | `High tide 1.8m · 2:45pm` | "Good swimming window before high tide fills the sandbars." |
| Pressure | `1013 hPa · Falling` | "Pressure dropping — change is coming. Enjoy the morning." |
| Bridge Wind | `52km/h · Sustained` | "Motorcycles and high-sided vehicles: bridge restrictions in effect." |

### Typography hierarchy for hybrid display

```css
/* AI interpretation — the voice */
.ai-insight {
  font-family: var(--font-serif);   /* DM Serif Display */
  font-size: 1.1rem;
  font-weight: 400;
  color: var(--color-slate);
  line-height: 1.4;
}

/* Raw number — the evidence */
.raw-value {
  font-family: var(--font-sans);    /* DM Sans */
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-fog);          /* Muted — #7F8C8D */
  letter-spacing: 0.02em;
  margin-top: 4px;
}
```

### What this achieves

- **Skeptics** see the number and trust the app
- **Tourists** read the interpretation and know what to do
- **Locals** glance at the number and ignore the explanation they already know
- **Grant reviewers** see a data-driven tool, not a chatbot
- **Tourism PEI** sees an experience layer on top of verified government data

**The AI meteorologist is the product. The data is the proof.**

---

## Component: MetricCard

Build this reusable component and use it everywhere a data metric appears:

```tsx
// components/ui/MetricCard.tsx
interface MetricCardProps {
  insight: string           // AI-generated interpretation
  rawLabel: string          // e.g. "UV 7 · High"
  icon?: LucideIcon
  accentColor?: string      // matches conditions score colour
  className?: string
}

export function MetricCard({ insight, rawLabel, icon: Icon, accentColor, className }: MetricCardProps) {
  return (
    <div className={cn(
      "rounded-2xl bg-white border border-slate-100 p-4 space-y-1",
      className
    )}>
      {Icon && (
        <div className="flex items-center gap-2 mb-2">
          <Icon size={16} style={{ color: accentColor }} />
        </div>
      )}
      <p className="font-serif text-[1.05rem] leading-snug text-slate-800">
        {insight}
      </p>
      <p className="text-xs font-medium tracking-wide text-slate-400 uppercase">
        {rawLabel}
      </p>
    </div>
  )
}
```

Usage:
```tsx
<MetricCard
  insight="Fair skin burns in ~20 min. Reapply SPF before heading out."
  rawLabel="UV 7 · High"
  icon={Sun}
  accentColor="#D4A853"
/>
```

---

*Last updated: April 2026 | OpenAir PEI Beta v0.1*
