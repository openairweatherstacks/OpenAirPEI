// scripts/download-historical-weather.ts
// Backfill Charlottetown daily weather records from Environment Canada into Supabase.
// Run with: npx tsx --env-file=.env.local scripts/download-historical-weather.ts
//
// Stitches three ECCC stations to cover 1872-present:
//   STN_ID 6525  CHARLOTTETOWN (downtown)         1872-04-01 to 1934-12-31
//   STN_ID 6526  CHARLOTTETOWN A (old airport)    1943-04-01 to 2012-09-12
//   STN_ID 50621 CHARLOTTETOWN A (NAV Canada)     2012-09-13 to present
//
// Stations are downloaded in order; upserts are keyed on date, so later (more
// recent / authoritative) stations overwrite earlier ones if there is overlap.

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface Station {
  stnId: string
  climateId: string
  name: string
  startYear: number
  endYear: number
}

const STATIONS: Station[] = [
  { stnId: '6525',  climateId: '8300298', name: 'CHARLOTTETOWN (downtown)', startYear: 1872, endYear: 1934 },
  { stnId: '6526',  climateId: '8300300', name: 'CHARLOTTETOWN A (old airport)', startYear: 1943, endYear: 2012 },
  { stnId: '50621', climateId: '8300301', name: 'CHARLOTTETOWN A (NAV Canada)', startYear: 2012, endYear: new Date().getFullYear() },
]

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

async function downloadYear(stnId: string, year: number): Promise<string> {
  const url = new URL('https://climate.weather.gc.ca/climate_data/bulk_data_e.html')
  url.searchParams.set('format', 'csv')
  url.searchParams.set('stationID', stnId)
  url.searchParams.set('Year', String(year))
  url.searchParams.set('Month', '1')
  url.searchParams.set('Day', '1')
  url.searchParams.set('timeframe', '2')
  url.searchParams.set('submit', 'Download')

  const res = await fetch(url.toString())
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.text()
}

function parseCSV(csv: string): ECCCRow[] {
  const lines = csv.split('\n')
  const headerIndex = lines.findIndex(l => l.includes('Date/Time'))
  if (headerIndex === -1) return []
  const headers = lines[headerIndex].split(',').map(h => h.replace(/"/g, '').trim())
  return lines.slice(headerIndex + 1)
    .filter(l => l.trim())
    .map(line => {
      const values = line.split(',').map(v => v.replace(/"/g, '').trim())
      return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ''])) as unknown as ECCCRow
    })
}

function parseNum(val: string | undefined): number | null {
  if (val === undefined || val === '' || val === 'M') return null
  const n = parseFloat(val)
  return isNaN(n) ? null : n
}

async function processStationYear(station: Station, year: number): Promise<number> {
  const csv = await downloadYear(station.stnId, year)
  const rows = parseCSV(csv)

  const records = rows
    .filter(r => r['Date/Time'] && /^\d{4}-\d{2}-\d{2}$/.test(r['Date/Time']))
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
        station_id: station.stnId,
      }
    })
    // Drop scaffold rows that have no measurements
    .filter(r => r.max_temp !== null || r.min_temp !== null || r.mean_temp !== null || r.total_precip !== null)

  if (records.length === 0) return 0

  const { error } = await supabase
    .from('pei_weather_history')
    .upsert(records, { onConflict: 'date' })
  if (error) throw new Error(`Supabase upsert: ${error.message}`)

  return records.length
}

async function main() {
  let grandTotal = 0
  for (const station of STATIONS) {
    console.log(`\n== ${station.name} (STN_ID ${station.stnId}, ${station.startYear}-${station.endYear}) ==`)
    for (let year = station.startYear; year <= station.endYear; year++) {
      try {
        const n = await processStationYear(station, year)
        if (n > 0) {
          grandTotal += n
          console.log(`  ${year}: ${n} days`)
        } else {
          console.log(`  ${year}: (no data)`)
        }
      } catch (err) {
        console.error(`  ${year}: ERROR`, err instanceof Error ? err.message : err)
      }
      await new Promise(r => setTimeout(r, 400))
    }
  }
  console.log(`\nDone. ${grandTotal} day-records upserted across ${STATIONS.length} stations.`)
}

main().catch(e => { console.error(e); process.exit(1) })
