import { NextResponse } from 'next/server'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

let _supabase: SupabaseClient | null = null
function getSupabase(): SupabaseClient {
  if (!_supabase) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      throw new Error('Missing Supabase env vars')
    }
    _supabase = createClient(url, key)
  }
  return _supabase
}

function round1(n: number): number {
  return Math.round(n * 10) / 10
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get('date')
    if (!dateParam || !/^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
      return NextResponse.json({ error: 'date query param required as YYYY-MM-DD' }, { status: 400 })
    }
    const [yearStr, monthStr, dayStr] = dateParam.split('-')
    const month = Number(monthStr)
    const day = Number(dayStr)
    const queryYear = Number(yearStr)

    const { data: records, error } = await getSupabase()
      .from('pei_weather_history')
      .select('year, max_temp, min_temp, mean_temp, total_precip')
      .eq('month', month)
      .eq('day', day)
      .order('year', { ascending: true })

    if (error) throw new Error(error.message)
    if (!records || records.length === 0) {
      return NextResponse.json({ error: 'No records for that month/day' }, { status: 404 })
    }

    type Row = { year: number; max_temp: number | null; min_temp: number | null; mean_temp: number | null; total_precip: number | null }
    const rows = records as Row[]
    const exactYear = rows.find(r => r.year === queryYear) ?? null

    const withMax = rows.filter(r => r.max_temp !== null) as Array<Row & { max_temp: number }>
    const withMin = rows.filter(r => r.min_temp !== null) as Array<Row & { min_temp: number }>
    const withPrecip = rows.filter(r => r.total_precip !== null) as Array<Row & { total_precip: number }>

    const avgHigh = withMax.length ? round1(withMax.reduce((s, r) => s + r.max_temp, 0) / withMax.length) : null
    const avgLow = withMin.length ? round1(withMin.reduce((s, r) => s + r.min_temp, 0) / withMin.length) : null
    const hottest = withMax.reduce<Row & { max_temp: number } | null>(
      (best, r) => (best === null || r.max_temp > best.max_temp ? r : best), null
    )
    const coldest = withMin.reduce<Row & { min_temp: number } | null>(
      (best, r) => (best === null || r.min_temp < best.min_temp ? r : best), null
    )
    const wettest = withPrecip.reduce<Row & { total_precip: number } | null>(
      (best, r) => (best === null || r.total_precip > best.total_precip ? r : best), null
    )

    return NextResponse.json({
      date: dateParam,
      exact_year_observation: exactYear, // may be null if year < 1872 or > latest
      avg_high: avgHigh,
      avg_low: avgLow,
      record_high: hottest?.max_temp ?? null,
      record_high_year: hottest?.year ?? null,
      record_low: coldest?.min_temp ?? null,
      record_low_year: coldest?.year ?? null,
      record_precip: wettest?.total_precip ?? null,
      record_precip_year: wettest?.year ?? null,
      years_on_record: rows.length,
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[/api/history/by-date] error:', msg)
    return NextResponse.json({ error: 'Failed to look up historical date' }, { status: 500 })
  }
}
