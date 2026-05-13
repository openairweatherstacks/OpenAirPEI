import { NextResponse } from 'next/server'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

let _supabase: SupabaseClient | null = null
function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) throw new Error('Missing Supabase env vars')
    _supabase = createClient(url, key)
  }
  return _supabase
}

interface MonthRow {
  month: number
  avg_high: number | null
  avg_low: number | null
  avg_precip_mm: number | null
  samples: number
}

let cache: { computedAt: number; data: MonthRow[] } | null = null
const CACHE_MS = 24 * 60 * 60 * 1000

export async function GET() {
  try {
    if (cache && Date.now() - cache.computedAt < CACHE_MS) {
      return NextResponse.json({ months: cache.data, cached: true })
    }
    const { data, error } = await getSupabase()
      .from('pei_weather_monthly_averages')
      .select('month, avg_high, avg_low, avg_precip_mm, samples')
      .order('month', { ascending: true })
    if (error) throw new Error(error.message)
    if (!data || data.length === 0) throw new Error('No monthly aggregates returned')

    const months = data as MonthRow[]
    cache = { computedAt: Date.now(), data: months }
    return NextResponse.json({ months, cached: false })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[/api/history/monthly-averages] error:', msg)
    return NextResponse.json({ error: 'Failed to compute monthly averages' }, { status: 500 })
  }
}
