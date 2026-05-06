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

export default function HistoryPageClient() {
  const [data, setData] = useState<HistoryData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/history/today')
      .then(r => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="animate-pulse h-64 bg-white rounded-[2rem]" />
  if (!data) return <div className="text-center py-8 text-text-secondary">Unable to load weather history</div>

  const today = new Date().toLocaleDateString('en-CA', { month: 'long', day: 'numeric' })

  return (
    <div className="space-y-8">
      {/* Today's History Card */}
      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[2rem] border border-forest-light bg-gradient-to-br from-forest-light/30 to-leaf-light/20 p-6">
          <div className="mb-4">
            <p className="eyebrow mb-2">Today's date</p>
            <h2 className="section-title text-3xl">{today} in history</h2>
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
            <h2 className="section-title text-3xl">All-time extremes</h2>
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
          All data is open government data under the <a href="https://open.canada.ca/en/open-government-licence-canada" target="_blank" rel="noopener noreferrer" className="text-forest hover:underline">Statistics Canada Open Licence</a>. This record provides the longest continuous daily weather observations for Prince Edward Island, allowing us to compare today's conditions against 150+ years of history.
        </p>
      </section>
    </div>
  )
}
