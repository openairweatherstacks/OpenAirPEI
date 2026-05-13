import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Computes real day-of-year weather stats for Charlottetown from the
// pei_weather_history table (1872-present, stitched from 3 ECCC stations).

export const dynamic = 'force-dynamic'

let _supabase: SupabaseClient | null = null
function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      throw new Error(
        `Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL=${url ? 'set' : 'MISSING'}, SUPABASE_SERVICE_ROLE_KEY=${key ? 'set' : 'MISSING'}`
      )
    }
    _supabase = createClient(url, key)
  }
  return _supabase
}

let _anthropic: Anthropic | null = null
function getAnthropic(): Anthropic {
  if (!_anthropic) _anthropic = new Anthropic()
  return _anthropic
}

interface DayRecord {
  year: number
  max_temp: number | null
  min_temp: number | null
  total_precip: number | null
}

interface CachedResult {
  cache_date: string
  avg_high: number | null
  avg_low: number | null
  record_high: number | null
  record_high_year: number | null
  record_low: number | null
  record_low_year: number | null
  record_precip: number | null
  record_precip_year: number | null
  precip_frequency: number | null
  years_on_record: number
  ai_narrative: string
}

let memoryCache: { date: string; data: CachedResult } | null = null

function round1(n: number): number {
  return Math.round(n * 10) / 10
}

export async function GET() {
  try {
    return await handle()
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[/api/history/today] error:', msg)
    return NextResponse.json(
      { error: 'Failed to load historical data' },
      { status: 500 }
    )
  }
}

async function handle() {
  const today = new Date()
  const month = today.getMonth() + 1
  const day = today.getDate()
  const cacheDate = today.toISOString().split('T')[0]

  if (memoryCache?.date === cacheDate) {
    return NextResponse.json(memoryCache.data)
  }

  // Try the persistent daily cache first
  const { data: persisted } = await getSupabase()
    .from('pei_history_daily_cache')
    .select('*')
    .eq('cache_date', cacheDate)
    .maybeSingle()

  if (persisted) {
    memoryCache = { date: cacheDate, data: persisted as CachedResult }
    return NextResponse.json(persisted)
  }

  const { data: records, error } = await getSupabase()
    .from('pei_weather_history')
    .select('year, max_temp, min_temp, total_precip')
    .eq('month', month)
    .eq('day', day)
    .order('year', { ascending: true })

  if (error || !records || records.length === 0) {
    return NextResponse.json({ error: 'No historical data for this date' }, { status: 404 })
  }

  const rows = records as DayRecord[]
  const withMax = rows.filter(r => r.max_temp !== null) as Array<DayRecord & { max_temp: number }>
  const withMin = rows.filter(r => r.min_temp !== null) as Array<DayRecord & { min_temp: number }>
  const withPrecip = rows.filter(r => r.total_precip !== null) as Array<DayRecord & { total_precip: number }>

  const avgHigh = withMax.length
    ? round1(withMax.reduce((s, r) => s + r.max_temp, 0) / withMax.length)
    : null
  const avgLow = withMin.length
    ? round1(withMin.reduce((s, r) => s + r.min_temp, 0) / withMin.length)
    : null

  const hottest = withMax.reduce<typeof withMax[number] | null>(
    (best, r) => (best === null || r.max_temp > best.max_temp ? r : best), null
  )
  const coldest = withMin.reduce<typeof withMin[number] | null>(
    (best, r) => (best === null || r.min_temp < best.min_temp ? r : best), null
  )
  const wettest = withPrecip.reduce<typeof withPrecip[number] | null>(
    (best, r) => (best === null || r.total_precip > best.total_precip ? r : best), null
  )

  const precipFrequency = withPrecip.length
    ? round1((withPrecip.filter(r => r.total_precip > 0).length / withPrecip.length) * 100)
    : null

  const yearsOnRecord = rows.length
  const dateStr = today.toLocaleDateString('en-CA', { month: 'long', day: 'numeric' })

  let aiNarrative = `On ${dateStr}, Charlottetown averages a high of ${avgHigh}°C and a low of ${avgLow}°C across ${yearsOnRecord} years of records. Precipitation falls on roughly ${precipFrequency}% of years on this date. The hottest ${dateStr} on record was ${hottest?.max_temp}°C in ${hottest?.year}; the coldest morning was ${coldest?.min_temp}°C in ${coldest?.year}.`

  try {
    const message = await getAnthropic().messages.create({
      model: process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6',
      max_tokens: 200,
      messages: [{
        role: 'user',
        content: `You are the voice of OpenAir Atlantic, a PEI outdoor conditions app. Write exactly 3 sentences in plain, friendly English summarizing what today's date means in Charlottetown weather history. Use these REAL stats for ${dateStr}:
- Historical average high: ${avgHigh}°C
- Historical average low: ${avgLow}°C
- Record high for this exact date: ${hottest?.max_temp}°C in ${hottest?.year}
- Record low for this exact date: ${coldest?.min_temp}°C in ${coldest?.year}
- Precipitation falls on this date about ${precipFrequency}% of years
- Data covers ${yearsOnRecord} years of Charlottetown records (1872-present)

Sentence 1: what the typical weather is like on this date. Sentence 2: something interesting about the record high/low or precipitation. Sentence 3: a short local flavour observation an Islander would appreciate. Use real numbers. Do not start with "Today".`,
      }],
    })
    if (message.content[0]?.type === 'text') {
      aiNarrative = message.content[0].text
    }
  } catch {
    // Fallback narrative already set above
  }

  const result: CachedResult = {
    cache_date: cacheDate,
    avg_high: avgHigh,
    avg_low: avgLow,
    record_high: hottest?.max_temp ?? null,
    record_high_year: hottest?.year ?? null,
    record_low: coldest?.min_temp ?? null,
    record_low_year: coldest?.year ?? null,
    record_precip: wettest?.total_precip ?? null,
    record_precip_year: wettest?.year ?? null,
    precip_frequency: precipFrequency,
    years_on_record: yearsOnRecord,
    ai_narrative: aiNarrative,
  }

  // Persist to daily cache (best-effort)
  await getSupabase()
    .from('pei_history_daily_cache')
    .upsert(result, { onConflict: 'cache_date' })

  memoryCache = { date: cacheDate, data: result }
  return NextResponse.json(result)
}
