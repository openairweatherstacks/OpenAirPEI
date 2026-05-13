# This Day in PEI Weather History
## Build Instructions for OpenAir Atlantic

---

## Overview

Add a "This Day in PEI Weather History" feature that pulls 150+ years of daily weather records from Environment Canada for Charlottetown Airport (Station ID: 6526), stores them in Supabase, and surfaces historical context across three locations in the app:

1. **Homepage widget** — compact daily card
2. **Location pages** — contextual historical sentence below conditions score
3. **/history page** — full dedicated page with charts, records, and date browser

Stack: Next.js 15 (App Router), TypeScript, Supabase, Claude API, Recharts, Tailwind CSS

---

## Step 1 — Supabase Schema

Create two tables in Supabase.

### Table: `pei_weather_history`

Stores one row per day of historical observed data.

```sql
create table pei_weather_history (
  id            bigserial primary key,
  date          date not null unique,
  month         smallint not null,
  day           smallint not null,
  year          smallint not null,
  max_temp      numeric(5,1),
  min_temp      numeric(5,1),
  mean_temp     numeric(5,1),
  total_precip  numeric(6,1),
  total_rain    numeric(6,1),
  total_snow    numeric(6,1),
  snow_on_ground smallint,
  wind_speed    numeric(5,1),
  station_id    text default '6526',
  created_at    timestamptz default now()
);

create index on pei_weather_history (month, day);
create index on pei_weather_history (date);
```

### Table: `pei_history_daily_cache`

Stores the AI-generated narrative and computed stats for today. Refreshed once per day via cron.

```sql
create table pei_history_daily_cache (
  id              bigserial primary key,
  cache_date      date not null unique,
  avg_high        numeric(5,1),
  avg_low         numeric(5,1),
  record_high     numeric(5,1),
  record_high_year smallint,
  record_low      numeric(5,1),
  record_low_year smallint,
  record_precip   numeric(6,1),
  record_precip_year smallint,
  precip_frequency numeric(5,2),
  years_on_record  smallint,
  ai_narrative    text,
  created_at      timestamptz default now()
);
```

---

## Step 2 — Bulk Data Download Script

Create this as a one-time script at `scripts/download-historical-weather.ts`. Run it once to seed the database.

```typescript
// scripts/download-historical-weather.ts
// Run with: npx tsx scripts/download-historical-weather.ts

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const STATION_ID = '6526'
const START_YEAR = 1900  // reliable daily data starts here
const END_YEAR = new Date().getFullYear()

interface ECCCRow {
  'Date/Time': string
  'Max Temp (°C)': string
  'Min Temp (°C)': string
  'Mean Temp (°C)': string
  'Total Precip (mm)': string
  'Total Rain (mm)': string
  'Total Snow (cm)': string
  'Snow on Grnd (cm)': string
  'Spd of Max Gust (km/h)': string
}

async function downloadYear(year: number) {
  const url = new URL('https://climate.weather.gc.ca/climate_data/bulk_data_e.html')
  url.searchParams.set('format', 'csv')
  url.searchParams.set('stationID', STATION_ID)
  url.searchParams.set('Year', String(year))
  url.searchParams.set('Month', '1')
  url.searchParams.set('Day', '1')
  url.searchParams.set('timeframe', '2') // daily
  url.searchParams.set('submit', 'Download')

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`Failed to fetch ${year}: ${res.status}`)
  return res.text()
}

function parseCSV(csv: string): ECCCRow[] {
  const lines = csv.split('\n')
  // ECCC CSV has metadata rows at top — find the header row
  const headerIndex = lines.findIndex(l => l.includes('Date/Time'))
  if (headerIndex === -1) return []
  const headers = lines[headerIndex].split(',').map(h => h.replace(/"/g, '').trim())
  return lines.slice(headerIndex + 1)
    .filter(l => l.trim())
    .map(line => {
      const values = line.split(',').map(v => v.replace(/"/g, '').trim())
      return Object.fromEntries(headers.map((h, i) => [h, values[i]])) as ECCCRow
    })
}

function parseNum(val: string): number | null {
  const n = parseFloat(val)
  return isNaN(n) ? null : n
}

async function processYear(year: number) {
  console.log(`Downloading ${year}...`)
  try {
    const csv = await downloadYear(year)
    const rows = parseCSV(csv)

    const records = rows
      .filter(r => r['Date/Time'] && r['Date/Time'].match(/^\d{4}-\d{2}-\d{2}$/))
      .map(r => {
        const [y, m, d] = r['Date/Time'].split('-').map(Number)
        return {
          date: r['Date/Time'],
          month: m,
          day: d,
          year: y,
          max_temp: parseNum(r['Max Temp (°C)']),
          min_temp: parseNum(r['Min Temp (°C)']),
          mean_temp: parseNum(r['Mean Temp (°C)']),
          total_precip: parseNum(r['Total Precip (mm)']),
          total_rain: parseNum(r['Total Rain (mm)']),
          total_snow: parseNum(r['Total Snow (cm)']),
          snow_on_ground: parseNum(r['Snow on Grnd (cm)']),
          wind_speed: parseNum(r['Spd of Max Gust (km/h)']),
          station_id: STATION_ID,
        }
      })

    if (records.length === 0) return

    const { error } = await supabase
      .from('pei_weather_history')
      .upsert(records, { onConflict: 'date' })

    if (error) throw error
    console.log(`  ✓ ${records.length} days inserted for ${year}`)
  } catch (err) {
    console.error(`  ✗ Error for ${year}:`, err)
  }

  // Polite delay to avoid hammering ECCC
  await new Promise(r => setTimeout(r, 500))
}

async function main() {
  console.log(`Downloading PEI historical weather data ${START_YEAR}–${END_YEAR}`)
  for (let year = START_YEAR; year <= END_YEAR; year++) {
    await processYear(year)
  }
  console.log('Done.')
}

main()
```

---

## Step 3 — API Route: `/api/history/today`

Create at `app/api/history/today/route.ts`

```typescript
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const anthropic = new Anthropic()

export async function GET() {
  const today = new Date()
  const month = today.getMonth() + 1
  const day = today.getDate()
  const cacheDate = today.toISOString().split('T')[0]

  // Return cached version if it exists for today
  const { data: cached } = await supabase
    .from('pei_history_daily_cache')
    .select('*')
    .eq('cache_date', cacheDate)
    .single()

  if (cached) return NextResponse.json(cached)

  // Query all historical records for this month/day
  const { data: records, error } = await supabase
    .from('pei_weather_history')
    .select('year, max_temp, min_temp, mean_temp, total_precip')
    .eq('month', month)
    .eq('day', day)
    .not('max_temp', 'is', null)
    .order('year', { ascending: true })

  if (error || !records?.length) {
    return NextResponse.json({ error: 'No historical data' }, { status: 404 })
  }

  // Compute stats
  const maxTemps = records.map(r => r.max_temp).filter(Boolean) as number[]
  const minTemps = records.map(r => r.min_temp).filter(Boolean) as number[]
  const precips = records.map(r => r.total_precip).filter(v => v !== null) as number[]

  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length
  const avgHigh = Math.round(avg(maxTemps) * 10) / 10
  const avgLow = Math.round(avg(minTemps) * 10) / 10

  const recordHighIdx = maxTemps.indexOf(Math.max(...maxTemps))
  const recordLowIdx = minTemps.indexOf(Math.min(...minTemps))
  const recordPrecipIdx = precips.indexOf(Math.max(...precips))

  const recordHigh = maxTemps[recordHighIdx]
  const recordHighYear = records.filter(r => r.max_temp !== null)[recordHighIdx]?.year
  const recordLow = minTemps[recordLowIdx]
  const recordLowYear = records.filter(r => r.min_temp !== null)[recordLowIdx]?.year
  const recordPrecip = precips[recordPrecipIdx]
  const recordPrecipYear = records.filter(r => r.total_precip !== null)[recordPrecipIdx]?.year
  const precipFrequency = Math.round((precips.filter(p => p > 0).length / precips.length) * 100)
  const yearsOnRecord = records.length

  // Generate AI narrative
  const dateStr = today.toLocaleDateString('en-CA', { month: 'long', day: 'numeric' })
  const prompt = `You are the voice of OpenAir Atlantic, a PEI outdoor conditions app. Write exactly 2 sentences in plain, friendly English summarizing what today's date means in PEI weather history. Use these stats for ${dateStr}:
- Historical average high: ${avgHigh}°C
- Historical average low: ${avgLow}°C  
- Record high: ${recordHigh}°C in ${recordHighYear}
- Record low: ${recordLow}°C in ${recordLowYear}
- Precipitation falls on this date ${precipFrequency}% of years historically
- Data covers ${yearsOnRecord} years of records

Be specific, reference the actual numbers, and make it interesting for an Islander. Do not start with "Today".`

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 150,
    messages: [{ role: 'user', content: prompt }],
  })

  const aiNarrative = message.content[0].type === 'text' ? message.content[0].text : ''

  const result = {
    cache_date: cacheDate,
    avg_high: avgHigh,
    avg_low: avgLow,
    record_high: recordHigh,
    record_high_year: recordHighYear,
    record_low: recordLow,
    record_low_year: recordLowYear,
    record_precip: recordPrecip,
    record_precip_year: recordPrecipYear,
    precip_frequency: precipFrequency,
    years_on_record: yearsOnRecord,
    ai_narrative: aiNarrative,
  }

  // Cache it for the day
  await supabase.from('pei_history_daily_cache').upsert(result, { onConflict: 'cache_date' })

  return NextResponse.json(result)
}
```

---

## Step 4 — Homepage Widget Component

Create at `components/weather/ThisDayWidget.tsx`

```typescript
'use client'

import { useEffect, useState } from 'react'

interface HistoryData {
  avg_high: number
  avg_low: number
  record_high: number
  record_high_year: number
  record_low: number
  record_low_year: number
  precip_frequency: number
  years_on_record: number
  ai_narrative: string
}

export default function ThisDayWidget() {
  const [data, setData] = useState<HistoryData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/history/today')
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  const today = new Date().toLocaleDateString('en-CA', { month: 'long', day: 'numeric' })

  if (loading) return (
    <div className="rounded-2xl border border-border p-4 animate-pulse bg-muted h-32" />
  )

  if (!data) return null

  return (
    <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-lg">🗓️</span>
        <h3 className="font-semibold text-sm text-foreground">
          This Day in PEI Weather History — {today}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-muted rounded-lg p-2">
          <p className="text-muted-foreground">Avg High</p>
          <p className="font-semibold text-foreground">{data.avg_high}°C</p>
        </div>
        <div className="bg-muted rounded-lg p-2">
          <p className="text-muted-foreground">Avg Low</p>
          <p className="font-semibold text-foreground">{data.avg_low}°C</p>
        </div>
        <div className="bg-muted rounded-lg p-2">
          <p className="text-muted-foreground">Record High</p>
          <p className="font-semibold text-foreground">{data.record_high}°C ({data.record_high_year})</p>
        </div>
        <div className="bg-muted rounded-lg p-2">
          <p className="text-muted-foreground">Record Low</p>
          <p className="font-semibold text-foreground">{data.record_low}°C ({data.record_low_year})</p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground italic leading-relaxed">
        {data.ai_narrative}
      </p>

      <p className="text-xs text-muted-foreground">
        Based on {data.years_on_record} years of Charlottetown records
      </p>
    </div>
  )
}
```

---

## Step 5 — Location Page Insert

Add this below the conditions score on each location page. Pass in the current forecast temp to calculate percentile rank.

```typescript
// components/weather/HistoryContext.tsx
'use client'

import { useEffect, useState } from 'react'

interface Props {
  locationName: string
  forecastHigh?: number
}

interface HistoryData {
  avg_high: number
  record_high: number
  record_high_year: number
  years_on_record: number
  ai_narrative: string
}

export default function HistoryContext({ locationName, forecastHigh }: Props) {
  const [data, setData] = useState<HistoryData | null>(null)

  useEffect(() => {
    fetch('/api/history/today').then(r => r.json()).then(setData)
  }, [])

  if (!data) return null

  // Calculate rough percentile if forecast temp provided
  let percentileNote = ''
  if (forecastHigh !== undefined) {
    const diff = forecastHigh - data.avg_high
    if (diff > 5) percentileNote = `Today is running significantly warmer than the historical average for this date.`
    else if (diff > 2) percentileNote = `Today is warmer than average for this date in PEI.`
    else if (diff < -5) percentileNote = `Today is running significantly cooler than the historical average for this date.`
    else if (diff < -2) percentileNote = `Today is cooler than average for this date in PEI.`
    else percentileNote = `Today is right in line with the historical average for this date.`
  }

  return (
    <div className="mt-4 rounded-xl bg-muted/50 border border-border p-3 space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
        🗓️ Historical Context
      </p>
      <p className="text-sm text-foreground">
        {percentileNote || data.ai_narrative}
      </p>
      <p className="text-xs text-muted-foreground">
        Record high for today: {data.record_high}°C ({data.record_high_year}) · 
        Average high: {data.avg_high}°C · {data.years_on_record} years of records
      </p>
    </div>
  )
}
```

---

## Step 6 — /history Page

Create at `app/history/page.tsx`

```typescript
import { Suspense } from 'react'
import HistoryPageClient from './HistoryPageClient'

export const metadata = {
  title: 'PEI Weather History | OpenAir Atlantic',
  description: 'Explore 150 years of Prince Edward Island weather records. Daily records, climate trends, and historical data for Charlottetown.',
}

export default function HistoryPage() {
  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          PEI Weather History
        </h1>
        <p className="text-muted-foreground">
          150+ years of daily weather records from Charlottetown — the longest climate record on Prince Edward Island.
        </p>
      </div>
      <Suspense fallback={<div className="animate-pulse h-64 bg-muted rounded-2xl" />}>
        <HistoryPageClient />
      </Suspense>
    </main>
  )
}
```

Create the client component at `app/history/HistoryPageClient.tsx` — this component should:

- Fetch today's historical data from `/api/history/today`
- Show the full stats card (all records, averages, AI narrative)
- Render a Recharts `BarChart` or `LineChart` showing average high temps by month using data from `/api/history/monthly-averages` (build this API route separately — queries Supabase grouped by month)
- Include a date picker (`<input type="date">`) that calls `/api/history/by-date?date=YYYY-MM-DD` to look up any specific date in history
- Show a "Records" section listing the all-time extremes (hottest, coldest, wettest, snowiest) pulled from Supabase

---

## Step 7 — Daily Cron Job

Add to `vercel.json` to refresh the cache each morning:

```json
{
  "crons": [
    {
      "path": "/api/cron/refresh-history",
      "schedule": "0 6 * * *"
    }
  ]
}
```

Create `app/api/cron/refresh-history/route.ts`:

```typescript
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Verify it's a legitimate Vercel cron request
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Hit the today endpoint to regenerate and cache today's data
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://openairatlantic.com'
  
  // Delete yesterday's cache entry to force refresh
  // Then call /api/history/today to regenerate
  await fetch(`${baseUrl}/api/history/today`, { cache: 'no-store' })

  // Also fetch today's actual observed data from ECCC and upsert into pei_weather_history
  // (yesterday's date — ECCC has a ~1 day lag on observed data)
  // Add ECCC fetch logic here matching the bulk download format

  return NextResponse.json({ ok: true, refreshed: new Date().toISOString() })
}
```

Add `CRON_SECRET` to your Vercel environment variables.

---

## Step 8 — Add to Homepage

In your homepage component, import and place `ThisDayWidget` below the hero section or conditions overview:

```typescript
import ThisDayWidget from '@/components/weather/ThisDayWidget'

// Inside your homepage JSX:
<section className="mt-8">
  <ThisDayWidget />
</section>
```

---

## Environment Variables Required

Add these to `.env.local` and Vercel dashboard if not already present:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # server-side only
ANTHROPIC_API_KEY=your_anthropic_key
CRON_SECRET=your_random_secret_string
NEXT_PUBLIC_APP_URL=https://openairatlantic.com
```

---

## Execution Order

1. Run Supabase migrations to create both tables
2. Run `npx tsx scripts/download-historical-weather.ts` — takes ~15 minutes to download all years
3. Verify data in Supabase — should have ~45,000 rows
4. Deploy API routes and test `/api/history/today` in browser
5. Add `ThisDayWidget` to homepage
6. Add `HistoryContext` to location pages
7. Build `/history` page with charts
8. Add cron job and deploy

---

## Notes for Claude Code

- The bulk download script hits ECCC once per year of data — add the 500ms delay to avoid rate limiting
- ECCC CSV column names vary slightly between older and newer records — add fallback parsing for alternate column names like `Max Temp (C)` vs `Max Temp (°C)`
- Supabase free tier handles 45,000 rows easily — no scaling concerns for this dataset
- The AI narrative is cached daily so Claude API costs are minimal — approximately 150 tokens per day = negligible cost
- All data is open government data under Statistics Canada Open Licence — free to use commercially
o