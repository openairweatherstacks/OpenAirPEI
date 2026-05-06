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

  const maxVal = Math.max(...maxTemps)
  const minVal = Math.min(...minTemps)
  const maxPrecip = Math.max(...precips)

  const recordHigh = maxVal
  const recordHighYear = records.find(r => r.max_temp === maxVal)?.year
  const recordLow = minVal
  const recordLowYear = records.find(r => r.min_temp === minVal)?.year
  const recordPrecip = maxPrecip
  const recordPrecipYear = records.find(r => r.total_precip === maxPrecip)?.year
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
    model: process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6',
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
