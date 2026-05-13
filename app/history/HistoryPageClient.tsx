'use client'

import { useEffect, useState } from 'react'

interface HistoryData {
  cache_date: string
  avg_high: number
  avg_low: number
  record_high: number
  record_high_year: number
  record_low: number
  record_low_year: number
  record_precip: number
  record_precip_year: number
  precip_frequency: number
  years_on_record: number
  ai_narrative: string
}

interface ByDateData {
  date: string
  exact_year_observation: {
    year: number
    max_temp: number | null
    min_temp: number | null
    mean_temp: number | null
    total_precip: number | null
  } | null
  avg_high: number | null
  avg_low: number | null
  record_high: number | null
  record_high_year: number | null
  record_low: number | null
  record_low_year: number | null
  years_on_record: number
}

interface MonthlyData {
  months: Array<{
    month: number
    avg_high: number | null
    avg_low: number | null
    avg_precip_mm: number | null
    samples: number
  }>
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export default function HistoryPageClient() {
  const [data, setData] = useState<HistoryData | null>(null)
  const [loading, setLoading] = useState(true)
  const [pickedDate, setPickedDate] = useState<string>('')
  const [byDate, setByDate] = useState<ByDateData | null>(null)
  const [byDateLoading, setByDateLoading] = useState(false)
  const [byDateError, setByDateError] = useState<string | null>(null)
  const [monthly, setMonthly] = useState<MonthlyData | null>(null)

  useEffect(() => {
    fetch('/api/history/today')
      .then(r => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
    fetch('/api/history/monthly-averages')
      .then(r => r.json())
      .then(setMonthly)
      .catch(() => setMonthly(null))
  }, [])

  useEffect(() => {
    if (!pickedDate) {
      setByDate(null)
      setByDateError(null)
      return
    }
    setByDateLoading(true)
    setByDateError(null)
    fetch(`/api/history/by-date?date=${pickedDate}`)
      .then(async r => {
        const json = await r.json()
        if (!r.ok) throw new Error(json.error || 'lookup failed')
        return json
      })
      .then(setByDate)
      .catch((e: Error) => { setByDate(null); setByDateError(e.message) })
      .finally(() => setByDateLoading(false))
  }, [pickedDate])

  if (loading) return <div className="animate-pulse h-64 bg-white rounded-[2rem]" />
  if (!data) return <div className="text-center py-8 text-text-secondary">Unable to load weather history</div>

  const today = new Date().toLocaleDateString('en-CA', { month: 'long', day: 'numeric' })

  return (
    <div className="space-y-8">
      {/* Today's History Card */}
      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[2rem] border border-forest-light bg-gradient-to-br from-forest-light/30 to-leaf-light/20 p-6">
          <div className="mb-4">
            <p className="eyebrow mb-2">Today&apos;s date</p>
            <h2 className="section-title text-xl sm:text-2xl lg:text-3xl">{today} in history</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-white/60 backdrop-blur p-3">
                <p className="text-xs font-semibold text-text-secondary uppercase">Avg High</p>
                <p className="font-serif text-2xl text-forest mt-1">{data.avg_high}°C</p>
              </div>
              <div className="rounded-lg bg-white/60 backdrop-blur p-3">
                <p className="text-xs font-semibold text-text-secondary uppercase">Avg Low</p>
                <p className="font-serif text-2xl text-forest mt-1">{data.avg_low}°C</p>
              </div>
              <div className="rounded-lg bg-white/60 backdrop-blur p-3">
                <p className="text-xs font-semibold text-text-secondary uppercase">Record High</p>
                <p className="font-serif text-2xl text-sun-text mt-1">{data.record_high}°C</p>
                <p className="text-xs text-text-muted mt-0.5">{data.record_high_year}</p>
              </div>
              <div className="rounded-lg bg-white/60 backdrop-blur p-3">
                <p className="text-xs font-semibold text-text-secondary uppercase">Record Low</p>
                <p className="font-serif text-2xl text-blue-600 mt-1">{data.record_low}°C</p>
                <p className="text-xs text-text-muted mt-0.5">{data.record_low_year}</p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-text-secondary italic border-l-4 border-forest pl-4">
              {data.ai_narrative}
            </p>
          </div>
        </div>

        {/* Records Summary */}
        <div className="rounded-[2rem] border border-border bg-white p-6 space-y-4">
          <div>
            <p className="eyebrow mb-2">Historical Records</p>
            <h2 className="section-title text-xl sm:text-2xl lg:text-3xl">All-time extremes</h2>
          </div>

          <div className="space-y-3">
            <div className="rounded-lg bg-sun-light p-4 border border-sun/20">
              <p className="text-xs font-semibold text-sun-text uppercase">Hottest day on record</p>
              <p className="font-serif text-2xl text-sun-text mt-1">{data.record_high}°C</p>
              <p className="text-xs text-text-secondary mt-1">{data.record_high_year} · PEI historical record</p>
            </div>

            <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
              <p className="text-xs font-semibold text-blue-600 uppercase">Coldest day on record</p>
              <p className="font-serif text-2xl text-blue-600 mt-1">{data.record_low}°C</p>
              <p className="text-xs text-text-secondary mt-1">{data.record_low_year} · PEI historical record</p>
            </div>

            <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
              <p className="text-xs font-semibold text-blue-600 uppercase">Wettest day on record</p>
              <p className="font-serif text-2xl text-blue-600 mt-1">{data.record_precip} mm</p>
              <p className="text-xs text-text-secondary mt-1">{data.record_precip_year} · PEI historical record</p>
            </div>

            <div className="rounded-lg bg-leaf-light p-4 border border-leaf/20">
              <p className="text-xs font-semibold text-forest uppercase">Precipitation frequency</p>
              <p className="font-serif text-2xl text-forest mt-1">{data.precip_frequency}%</p>
              <p className="text-xs text-text-secondary mt-1">of years on this date historically</p>
            </div>
          </div>

          <p className="text-xs text-text-muted pt-4 border-t border-border">
            Based on {data.years_on_record} years of daily observations from Charlottetown Airport
          </p>
        </div>
      </section>

      {/* Date Lookup */}
      <section className="rounded-[2rem] border border-border bg-white p-6 space-y-4">
        <div>
          <p className="eyebrow mb-2">Look up any date</p>
          <h2 className="section-title text-xl sm:text-2xl lg:text-3xl">What was the weather on...</h2>
        </div>
        <input
          type="date"
          value={pickedDate}
          onChange={e => setPickedDate(e.target.value)}
          min="1872-04-01"
          max={new Date().toISOString().split('T')[0]}
          className="w-full sm:w-auto rounded-lg border border-border px-4 py-2 font-sans text-base focus:outline-none focus:ring-2 focus:ring-forest"
        />

        {byDateLoading && <p className="text-sm text-text-secondary">Looking up...</p>}
        {byDateError && <p className="text-sm text-danger">{byDateError}</p>}

        {byDate && (
          <div className="space-y-4 pt-2">
            {byDate.exact_year_observation && (
              <div className="rounded-lg bg-forest-light/40 border border-forest/20 p-4">
                <p className="text-xs font-semibold text-forest uppercase">
                  Observed on {byDate.date}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                  <div>
                    <p className="text-xs text-text-secondary">High</p>
                    <p className="font-serif text-xl text-text-primary">
                      {byDate.exact_year_observation.max_temp ?? '—'}°C
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">Low</p>
                    <p className="font-serif text-xl text-text-primary">
                      {byDate.exact_year_observation.min_temp ?? '—'}°C
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">Mean</p>
                    <p className="font-serif text-xl text-text-primary">
                      {byDate.exact_year_observation.mean_temp ?? '—'}°C
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-text-secondary">Precip</p>
                    <p className="font-serif text-xl text-text-primary">
                      {byDate.exact_year_observation.total_precip ?? '—'} mm
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="rounded-lg bg-white border border-border p-4">
              <p className="text-xs font-semibold text-text-secondary uppercase">
                Historical averages for this month/day ({byDate.years_on_record} years of records)
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                <div>
                  <p className="text-xs text-text-secondary">Avg High</p>
                  <p className="font-serif text-xl text-forest">{byDate.avg_high}°C</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Avg Low</p>
                  <p className="font-serif text-xl text-forest">{byDate.avg_low}°C</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Record High</p>
                  <p className="font-serif text-xl text-sun-text">
                    {byDate.record_high}°C
                  </p>
                  <p className="text-xs text-text-muted">{byDate.record_high_year}</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Record Low</p>
                  <p className="font-serif text-xl text-blue-600">
                    {byDate.record_low}°C
                  </p>
                  <p className="text-xs text-text-muted">{byDate.record_low_year}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Monthly Averages Chart */}
      {monthly && monthly.months.length > 0 && (
        <section className="rounded-[2rem] border border-border bg-white p-6 space-y-4">
          <div>
            <p className="eyebrow mb-2">Year-round climate</p>
            <h2 className="section-title text-xl sm:text-2xl lg:text-3xl">Average highs and lows by month</h2>
          </div>
          <MonthlyChart months={monthly.months} />
          <p className="text-xs text-text-muted">
            Averaged across all available years for each month. Charlottetown Airport · Environment Canada.
          </p>
        </section>
      )}

      {/* Data Coverage Info */}
      <section className="rounded-[2rem] border border-border bg-white/50 backdrop-blur p-6">
        <h2 className="section-title text-2xl mb-4">About this data</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase">Years of records</p>
            <p className="font-serif text-3xl text-text-primary mt-2">{data.years_on_record}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase">Station</p>
            <p className="font-serif text-lg text-text-primary mt-2">Charlottetown Airport</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase">Data source</p>
            <p className="font-serif text-lg text-text-primary mt-2">Environment Canada</p>
          </div>
        </div>
        <p className="text-sm text-text-secondary mt-6 leading-relaxed">
          All data is open government data under the <a href="https://open.canada.ca/en/open-government-licence-canada" target="_blank" rel="noopener noreferrer" className="text-forest hover:underline">Statistics Canada Open Licence</a>. This record provides the longest continuous daily weather observations for Prince Edward Island, allowing us to compare today&apos;s conditions against 150+ years of history.
        </p>
      </section>
    </div>
  )
}

function MonthlyChart({ months }: { months: MonthlyData['months'] }) {
  const highs = months.map(m => m.avg_high).filter((v): v is number => v !== null)
  const lows = months.map(m => m.avg_low).filter((v): v is number => v !== null)
  if (highs.length === 0) return null

  const max = Math.max(...highs)
  const min = Math.min(...lows)
  const range = max - min || 1
  const zeroY = ((max - 0) / range) * 100 // percentage from top where 0°C sits

  const yToPct = (v: number) => ((max - v) / range) * 100

  return (
    <div className="w-full">
      <div className="relative h-56 flex items-end gap-1 sm:gap-2 border-b border-border pl-8">
        {/* Zero line if 0 is within range */}
        {min < 0 && max > 0 && (
          <div
            className="absolute left-8 right-0 border-t border-dashed border-text-muted/40"
            style={{ top: `${zeroY}%` }}
          >
            <span className="absolute -left-7 -translate-y-1/2 text-xs text-text-muted">0°</span>
          </div>
        )}
        <span className="absolute left-0 top-0 text-xs text-text-muted">{Math.round(max)}°</span>
        <span className="absolute left-0 bottom-0 text-xs text-text-muted">{Math.round(min)}°</span>

        {months.map(m => {
          const hi = m.avg_high
          const lo = m.avg_low
          if (hi === null || lo === null) {
            return <div key={m.month} className="flex-1" />
          }
          const topPct = yToPct(hi)
          const botPct = yToPct(lo)
          const heightPct = botPct - topPct
          return (
            <div key={m.month} className="flex-1 h-full relative group">
              <div
                className="absolute inset-x-0 rounded-t-md rounded-b-md bg-gradient-to-b from-sun via-leaf to-forest"
                style={{ top: `${topPct}%`, height: `${heightPct}%` }}
                title={`${MONTH_LABELS[m.month - 1]}: ${lo}°C to ${hi}°C`}
              />
            </div>
          )
        })}
      </div>
      <div className="flex gap-1 sm:gap-2 pl-8 mt-2">
        {months.map(m => (
          <div key={m.month} className="flex-1 text-center text-xs text-text-secondary">
            {MONTH_LABELS[m.month - 1]}
          </div>
        ))}
      </div>
    </div>
  )
}
