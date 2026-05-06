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
