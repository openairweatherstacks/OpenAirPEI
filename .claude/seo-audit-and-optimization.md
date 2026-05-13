# SEO Audit & Optimization
## Build Instructions for OpenAir Atlantic

---

## Overview

Audit and standardize all SEO signals across the OpenAir Atlantic site — title tags, meta descriptions, Open Graph tags, structured data (JSON-LD), sitemap, and robots.txt. Google is already indexing the site and pulling live conditions into snippets. This instruction set locks in that behaviour and expands it across every page.

Stack: Next.js 15 App Router, TypeScript, Tailwind CSS
Domain: openairatlantic.com
Brand name to standardize on: **OpenAir Atlantic** (not "OpenAir PEI")

---

## Step 1 — Audit Existing Title Tags and Meta Descriptions

Before changing anything, run a full audit. Create this script at `scripts/seo-audit.ts` and run it:

```typescript
// scripts/seo-audit.ts
// Run with: npx tsx scripts/seo-audit.ts

import fs from 'fs'
import path from 'path'

// Recursively find all page.tsx files in the app directory
function findPages(dir: string, pages: string[] = []): string[] {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) findPages(fullPath, pages)
    if (entry.isFile() && entry.name === 'page.tsx') pages.push(fullPath)
  }
  return pages
}

const pages = findPages('./app')

console.log(`\nFound ${pages.length} pages:\n`)

for (const page of pages) {
  const content = fs.readFileSync(page, 'utf-8')
  const hasMetadata = content.includes('export const metadata') || content.includes('export async function generateMetadata')
  const hasTitle = content.includes('title:')
  const hasDescription = content.includes('description:')
  const hasOpenGraph = content.includes('openGraph')
  const hasJsonLd = content.includes('application/ld+json') || content.includes('JsonLd') || content.includes('json_ld')
  const hasBrandName = content.includes('OpenAir Atlantic')
  const hasOldBrandName = content.includes('OpenAir PEI')

  const route = page.replace('./app', '').replace('/page.tsx', '') || '/'

  console.log(`${route}`)
  console.log(`  metadata export: ${hasMetadata ? '✓' : '✗ MISSING'}`)
  console.log(`  title: ${hasTitle ? '✓' : '✗ MISSING'}`)
  console.log(`  description: ${hasDescription ? '✓' : '✗ MISSING'}`)
  console.log(`  openGraph: ${hasOpenGraph ? '✓' : '✗ MISSING'}`)
  console.log(`  JSON-LD: ${hasJsonLd ? '✓' : '✗ MISSING'}`)
  if (hasOldBrandName) console.log(`  ⚠️  BRAND NAME: contains "OpenAir PEI" — update to "OpenAir Atlantic"`)
  console.log()
}
```

Review the output. Fix every ✗ MISSING and every brand name warning using the patterns below.

---

## Step 2 — Global Metadata Defaults

In `app/layout.tsx`, set the global metadata baseline. Every page inherits these and can override.

```typescript
// app/layout.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://openairatlantic.com'),
  title: {
    default: 'OpenAir Atlantic — Smart Weather for the Outdoors',
    template: '%s | OpenAir Atlantic',
  },
  description: 'Real-time outdoor conditions for Prince Edward Island. Live weather, air quality, tides, and UV — translated into plain-English verdicts for 16 PEI locations.',
  keywords: [
    'PEI weather',
    'Prince Edward Island weather',
    'Cavendish beach conditions',
    'PEI outdoor conditions',
    'should I go outside PEI',
    'PEI tide times',
    'Confederation Bridge wind',
    'PEI air quality',
    'openairatlantic',
  ],
  authors: [{ name: 'OpenAir Atlantic', url: 'https://openairatlantic.com' }],
  creator: 'OpenAir Atlantic',
  publisher: 'OpenAir Atlantic',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: 'https://openairatlantic.com',
    siteName: 'OpenAir Atlantic',
    title: 'OpenAir Atlantic — Smart Weather for the Outdoors',
    description: 'Real-time outdoor conditions for Prince Edward Island. Should you go outside right now? We tell you.',
    images: [
      {
        url: '/og-default.png',
        width: 1200,
        height: 630,
        alt: 'OpenAir Atlantic — Smart Weather for PEI',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OpenAir Atlantic — Smart Weather for the Outdoors',
    description: 'Real-time outdoor conditions for Prince Edward Island.',
    images: ['/og-default.png'],
  },
  alternates: {
    canonical: 'https://openairatlantic.com',
  },
}
```

---

## Step 3 — Location Page Metadata (Dynamic)

Each location page should export `generateMetadata` that uses the live conditions and location data. Apply this pattern to every location page at `app/location/[slug]/page.tsx`:

```typescript
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

// Location data map — add every location
const locationMeta: Record<string, {
  name: string
  description: string
  keywords: string[]
  lat: number
  lng: number
  type: 'beach' | 'trail' | 'park' | 'urban' | 'bridge' | 'golf' | 'airport'
}> = {
  'cavendish': {
    name: 'Cavendish Beach',
    description: 'Live beach conditions at Cavendish, PEI. Water temperature, wave height, UV index, and a plain-English verdict — is it worth the drive today?',
    keywords: ['Cavendish beach conditions', 'Cavendish weather today', 'PEI beach conditions', 'Cavendish water temperature'],
    lat: 46.4907,
    lng: -63.3987,
    type: 'beach',
  },
  'brackley-beach': {
    name: 'Brackley Beach',
    description: 'Real-time conditions at Brackley Beach, PEI National Park. Live weather, UV, tide times, and water temperature.',
    keywords: ['Brackley Beach conditions', 'Brackley Beach weather', 'PEI National Park beach'],
    lat: 46.4433,
    lng: -63.1876,
    type: 'beach',
  },
  'basin-head': {
    name: 'Basin Head — Singing Sands',
    description: 'Live conditions at Basin Head Provincial Park, home of PEI\'s famous singing sands. Water temperature, tide times, and beach verdict.',
    keywords: ['Basin Head beach', 'Singing Sands PEI', 'Basin Head conditions', 'PEI singing sand beach'],
    lat: 46.3897,
    lng: -62.0367,
    type: 'beach',
  },
  'greenwich-dunes': {
    name: 'Greenwich Dunes',
    description: 'Real-time trail and beach conditions at Greenwich Dunes, PEI National Park. Wind, UV, and hiking verdict.',
    keywords: ['Greenwich Dunes conditions', 'Greenwich PEI weather', 'PEI dunes hiking'],
    lat: 46.4467,
    lng: -62.7033,
    type: 'park',
  },
  'confederation-trail': {
    name: 'Confederation Trail',
    description: 'Live cycling and hiking conditions on PEI\'s Confederation Trail. Wind speed, temperature, and trail verdict for today.',
    keywords: ['Confederation Trail conditions', 'PEI cycling weather', 'Confederation Trail weather today'],
    lat: 46.2382,
    lng: -63.1311,
    type: 'trail',
  },
  'victoria-park': {
    name: 'Victoria Park',
    description: 'Live conditions at Victoria Park, Charlottetown. Walking paths, beach access, and picnic conditions — updated in real time.',
    keywords: ['Victoria Park Charlottetown conditions', 'Victoria Park weather', 'Charlottetown park conditions'],
    lat: 46.2289,
    lng: -63.1467,
    type: 'park',
  },
  'charlottetown-waterfront': {
    name: 'Charlottetown Waterfront',
    description: 'Live waterfront conditions in Charlottetown, PEI. Wind, temperature, and outdoor dining verdict.',
    keywords: ['Charlottetown waterfront weather', 'Charlottetown conditions today', 'PEI waterfront'],
    lat: 46.2335,
    lng: -63.1264,
    type: 'urban',
  },
  'confederation-bridge': {
    name: 'Confederation Bridge',
    description: 'Live wind conditions and crossing status for Confederation Bridge, PEI. Wind speed alerts, vehicle restrictions, and current crossing verdict.',
    keywords: ['Confederation Bridge wind', 'Confederation Bridge conditions', 'is Confederation Bridge open', 'PEI bridge crossing'],
    lat: 46.1500,
    lng: -63.7833,
    type: 'bridge',
  },
  'north-cape': {
    name: 'North Cape',
    description: 'Live weather conditions at North Cape, PEI\'s northwestern tip. Wind energy site with dramatic coastal conditions.',
    keywords: ['North Cape PEI weather', 'North Cape conditions', 'PEI north cape wind'],
    lat: 47.0583,
    lng: -63.9967,
    type: 'park',
  },
  'charlottetown-airport': {
    name: 'Charlottetown Airport',
    description: 'Live weather at Charlottetown Airport (YYG). Current conditions, wind, visibility, and air quality for arrivals and departures.',
    keywords: ['Charlottetown Airport weather', 'YYG weather', 'Charlottetown Airport conditions today'],
    lat: 46.2900,
    lng: -63.1211,
    type: 'airport',
  },
  // Add remaining locations: summerside, fox-meadow, belvedere,
  // cavendish-campground, stanhope-campground
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const location = locationMeta[params.slug]

  if (!location) {
    return { title: 'Location Not Found | OpenAir Atlantic' }
  }

  const title = `${location.name} | OpenAir Atlantic`
  const ogImageUrl = `/api/og?location=${params.slug}` // dynamic OG image (Step 5)

  return {
    title,
    description: location.description,
    keywords: location.keywords,
    alternates: {
      canonical: `https://openairatlantic.com/location/${params.slug}`,
    },
    openGraph: {
      title,
      description: location.description,
      url: `https://openairatlantic.com/location/${params.slug}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Live conditions at ${location.name} — OpenAir Atlantic`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: location.description,
      images: [ogImageUrl],
    },
  }
}
```

---

## Step 4 — JSON-LD Structured Data

Add structured data to every location page. This is what makes Google show rich snippets with conditions data. Create a reusable component at `components/seo/LocationJsonLd.tsx`:

```typescript
interface Props {
  name: string
  description: string
  slug: string
  lat: number
  lng: number
  currentConditions?: {
    temperature?: number
    windSpeed?: number
    condition?: string
    updatedAt?: string
  }
}

export default function LocationJsonLd({
  name, description, slug, lat, lng, currentConditions
}: Props) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name,
    description,
    url: `https://openairatlantic.com/location/${slug}`,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: lat,
      longitude: lng,
    },
    touristType: ['Outdoor Recreation', 'Nature'],
    isAccessibleForFree: true,
    ...(currentConditions && {
      amenityFeature: [
        {
          '@type': 'LocationFeatureSpecification',
          name: 'Live Weather Conditions',
          value: currentConditions.condition ?? 'Available',
        },
      ],
    }),
  }

  // Also add WebSite schema on homepage only
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'OpenAir Atlantic',
    url: 'https://openairatlantic.com',
    description: 'Real-time outdoor conditions for Prince Edward Island',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://openairatlantic.com/location/{search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  )
}
```

Add `<LocationJsonLd />` inside every location page component, passing the live conditions data you already fetch.

For the **homepage**, add a separate `WebSite` + `Organization` JSON-LD block:

```typescript
// In app/page.tsx — add inside the JSX
const homepageJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://openairatlantic.com/#website',
      name: 'OpenAir Atlantic',
      url: 'https://openairatlantic.com',
      description: 'Real-time outdoor conditions for Prince Edward Island',
      inLanguage: 'en-CA',
    },
    {
      '@type': 'Organization',
      '@id': 'https://openairatlantic.com/#organization',
      name: 'OpenAir Atlantic',
      url: 'https://openairatlantic.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://openairatlantic.com/logo.png',
        width: 512,
        height: 512,
      },
      sameAs: [
        'https://www.facebook.com/openairatlantic',
        'https://www.instagram.com/openairatlantic',
      ],
    },
  ],
}
```

For the **Confederation Bridge page**, use `CivicStructure` schema:

```typescript
const bridgeJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CivicStructure',
  name: 'Confederation Bridge',
  description: 'Live wind conditions and crossing status for Confederation Bridge, PEI',
  url: 'https://openairatlantic.com/location/confederation-bridge',
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 46.1500,
    longitude: -63.7833,
  },
}
```

---

## Step 5 — Dynamic OG Image API Route

Google and social platforms pull the OG image when your pages are shared. Make it dynamic so it shows the current conditions. Create `app/api/og/route.tsx`:

```typescript
import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get('location') || 'pei'
  const condition = searchParams.get('condition') || 'Excellent'
  const temp = searchParams.get('temp') || '--'
  const locationName = searchParams.get('name') || 'Prince Edward Island'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
          background: 'linear-gradient(135deg, #1a3d1a 0%, #2d6a2f 50%, #4a9e4c 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ fontSize: '28px', color: '#d4e8b0', fontWeight: 300, letterSpacing: '0.1em' }}>
            OPENAIR ATLANTIC
          </span>
        </div>

        <div>
          <div style={{ fontSize: '72px', fontWeight: 700, color: 'white', lineHeight: 1.1, marginBottom: '16px' }}>
            {locationName}
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
          }}>
            <span style={{
              fontSize: '32px',
              fontWeight: 600,
              padding: '8px 24px',
              borderRadius: '40px',
              background: condition === 'Excellent' ? '#d4e8b0' :
                          condition === 'Good' ? '#b8d4a0' :
                          condition === 'Fair' ? '#f5d87a' : '#f5a07a',
              color: '#1a3d1a',
            }}>
              {condition}
            </span>
            {temp !== '--' && (
              <span style={{ fontSize: '40px', color: 'white', fontWeight: 300 }}>
                {temp}°C
              </span>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <span style={{ fontSize: '22px', color: '#b8d4a0' }}>
            Smart weather for the outdoors
          </span>
          <span style={{ fontSize: '20px', color: '#d4e8b0' }}>
            openairatlantic.com
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
```

Update the location page OG image URL to pass live data:

```typescript
// In generateMetadata, after fetching conditions:
const ogImageUrl = `/api/og?location=${params.slug}&name=${encodeURIComponent(location.name)}&condition=${encodeURIComponent(verdict)}&temp=${currentTemp}`
```

---

## Step 6 — Sitemap

Create `app/sitemap.ts` for automatic sitemap generation:

```typescript
import { MetadataRoute } from 'next'

const locations = [
  'cavendish',
  'brackley-beach',
  'basin-head',
  'greenwich-dunes',
  'confederation-trail',
  'victoria-park',
  'charlottetown-waterfront',
  'summerside',
  'confederation-bridge',
  'charlottetown-airport',
  'north-cape',
  'fox-meadow',
  'belvedere',
  'cavendish-campground',
  'stanhope-campground',
  'victoria-by-the-sea',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://openairatlantic.com'
  const now = new Date()

  const locationPages = locations.map(slug => ({
    url: `${baseUrl}/location/${slug}`,
    lastModified: now, // live data — always fresh
    changeFrequency: 'hourly' as const,
    priority: 0.9,
  }))

  return [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/history`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/bridge`,
      lastModified: now,
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    ...locationPages,
  ]
}
```

---

## Step 7 — Robots.txt

Create `app/robots.ts`:

```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/admin/'],
      },
    ],
    sitemap: 'https://openairatlantic.com/sitemap.xml',
    host: 'https://openairatlantic.com',
  }
}
```

---

## Step 8 — Brand Name Standardization

Run this find-and-replace across the entire codebase. Every instance of "OpenAir PEI" becomes "OpenAir Atlantic":

```bash
# Find all instances
grep -r "OpenAir PEI" --include="*.tsx" --include="*.ts" --include="*.mdx" -l

# Replace in all files (macOS)
find . -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.mdx" \) \
  -not -path "*/node_modules/*" \
  -exec sed -i '' 's/OpenAir PEI/OpenAir Atlantic/g' {} +

# Replace in all files (Linux)
find . -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.mdx" \) \
  -not -path "*/node_modules/*" \
  -exec sed -i 's/OpenAir PEI/OpenAir Atlantic/g' {} +
```

After running, verify with:
```bash
grep -r "OpenAir PEI" --include="*.tsx" --include="*.ts" -l
# Should return no results
```

---

## Step 9 — Page-Level Title Tag Patterns

Use these exact title tag patterns consistently across every page type:

| Page type | Title pattern | Example |
|---|---|---|
| Homepage | `OpenAir Atlantic — Smart Weather for the Outdoors` | — |
| Location | `[Location Name] \| OpenAir Atlantic` | `Cavendish Beach \| OpenAir Atlantic` |
| Bridge | `Confederation Bridge Wind & Status \| OpenAir Atlantic` | — |
| Explore | `Explore PEI Outdoor Locations \| OpenAir Atlantic` | — |
| History | `PEI Weather History \| OpenAir Atlantic` | — |
| 404 | `Page Not Found \| OpenAir Atlantic` | — |

---

## Step 9b — Weather FAQ Structured Data (Rich Answer Snippets)

This is what makes Google show live weather answers directly in search results — "What is the current temperature in Charlottetown?" with the answer badge inline. Add this to every location page alongside the existing JSON-LD.

Create `components/seo/WeatherFaqJsonLd.tsx`:

```typescript
interface WeatherData {
  currentTemp: number
  feelsLike: number
  highTemp: number
  lowTemp: number
  precipProbability: number
  precipAmount: string
  windSpeed: number
  windDirection: string
  humidity: number
  hasAlerts: boolean
  uvIndex: string
  sunrise: string
  sunset: string
}

interface Props {
  locationName: string
  locationSlug: string
  weather: WeatherData
}

export default function WeatherFaqJsonLd({ locationName, locationSlug, weather }: Props) {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: `What is the current temperature in ${locationName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The current temperature in ${locationName} is ${weather.currentTemp}°C.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the "feels like" temperature in ${locationName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The feels like temperature in ${locationName} is currently ${weather.feelsLike}°C.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the high and low temperature today in ${locationName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Today's high in ${locationName} is ${weather.highTemp}°C and the low is ${weather.lowTemp}°C.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the probability of rain or snow today in ${locationName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `There is a ${weather.precipProbability}% probability of precipitation in ${locationName} today.`,
        },
      },
      {
        '@type': 'Question',
        name: `How much will it rain or snow today in ${locationName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Expected precipitation in ${locationName} today is ${weather.precipAmount}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the current wind speed and direction in ${locationName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Wind in ${locationName} is currently ${weather.windSpeed} km/h from the ${weather.windDirection}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the current humidity level in ${locationName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Current humidity in ${locationName} is ${weather.humidity}%.`,
        },
      },
      {
        '@type': 'Question',
        name: `Are there any active weather alerts in ${locationName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: weather.hasAlerts
            ? `Yes, there are active weather alerts for ${locationName}. Check openairatlantic.com for details.`
            : `No active weather alerts for ${locationName} at this time.`,
        },
      },
      {
        '@type': 'Question',
        name: `What is the UV index right now in ${locationName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `The current UV index in ${locationName} is ${weather.uvIndex}.`,
        },
      },
      {
        '@type': 'Question',
        name: `What time is sunrise and sunset today in ${locationName}?`,
        acceptedAnswer: {
          '@type': 'Answer',
          text: `Sunrise in ${locationName} today is at ${weather.sunrise} and sunset is at ${weather.sunset}.`,
        },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
    />
  )
}
```

### How to use it on location pages

In your location page component, after fetching live weather data, add the component:

```typescript
import WeatherFaqJsonLd from '@/components/seo/WeatherFaqJsonLd'
import LocationJsonLd from '@/components/seo/LocationJsonLd'

// Inside your location page JSX, alongside the existing LocationJsonLd:
<LocationJsonLd ... />
<WeatherFaqJsonLd
  locationName="Charlottetown Waterfront"
  locationSlug="charlottetown-waterfront"
  weather={{
    currentTemp: conditions.temperature,
    feelsLike: conditions.feelsLike,
    highTemp: forecast.high,
    lowTemp: forecast.low,
    precipProbability: forecast.precipProbability,
    precipAmount: forecast.precipAmount ?? '<1 mm rain',
    windSpeed: conditions.windSpeed,
    windDirection: conditions.windDirection,
    humidity: conditions.humidity,
    hasAlerts: conditions.alerts?.length > 0,
    uvIndex: conditions.uvIndex ?? 'Low',
    sunrise: conditions.sunrise,
    sunset: conditions.sunset,
  }}
/>
```

### Why this matters

Google scrapes the FAQ schema and displays the questions with live answer badges directly in search results — exactly what you see in the screenshot. Searches like "current temperature Charlottetown" or "wind speed Charlottetown today" will surface OpenAir Atlantic answers inline before any other result. This is one of the highest-value SEO features available for a weather app and almost no local PEI sites implement it.

### Priority pages to add this to first

Add `WeatherFaqJsonLd` to these pages first — highest search volume:

1. Charlottetown Waterfront — "Charlottetown weather" has the highest local search volume
2. Charlottetown Airport — travellers search current conditions before flights
3. Confederation Bridge — "Confederation Bridge wind" is a high-intent search
4. Cavendish Beach — peak tourist search volume in summer
5. All remaining location pages

---

## Step 10 — Verify in Google Search Console

After deploying all changes:

1. Log into Google Search Console at search.google.com/search-console
2. Go to **URL Inspection** and test these pages individually:
   - `openairatlantic.com`
   - `openairatlantic.com/location/cavendish`
   - `openairatlantic.com/location/confederation-bridge`
3. Click **Request Indexing** for each one
4. Go to **Sitemaps** → submit `https://openairatlantic.com/sitemap.xml`
5. Check **Rich Results** in the Enhancements section — your JSON-LD should appear within 1–2 weeks

---

## Execution Order for Claude Code

1. Run `scripts/seo-audit.ts` and review output
2. Update `app/layout.tsx` with global metadata (Step 2)
3. Run brand name find-and-replace (Step 8)
4. Add `generateMetadata` to every location page (Step 3)
5. Create and add `LocationJsonLd` component to every location page (Step 4)
6. Add homepage JSON-LD block (Step 4)
7. Build `/api/og` dynamic image route (Step 5)
8. Create `app/sitemap.ts` (Step 6)
9. Create `app/robots.ts` (Step 7)
10. Deploy to Vercel
11. Submit sitemap in Google Search Console (Step 10)

---

## Notes for Claude Code

- Do not change any existing routing or data fetching logic — this is metadata and schema only
- The `generateMetadata` function in Next.js 15 App Router replaces the old `Head` component — do not use `next/head`
- The OG image route uses `next/og` which is edge-compatible — no Node.js APIs inside it
- All JSON-LD must be valid against schema.org — test at validator.schema.org after deploying
- Google typically re-crawls within 24–72 hours after sitemap submission for active sites
- Your Google Analytics ID (G-DSQJZ4DR81) and GSC verification are already in place — no changes needed there
