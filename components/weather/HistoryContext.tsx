'use client'

import { useEffect, useState } from 'react'
import { CalendarDays } from 'lucide-react'

interface Props {
  locationName: string
  forecastHigh?: number
}

interface HistoryData {
  avg_high: number
  avg_low: number
  record_high: number
  record_high_year: number
  record_low: number
  record_low_year: number
  years_on_record: number
  ai_narrative: string
}

export default function HistoryContext({ forecastHigh }: Props) {
  const [data, setData] = useState<HistoryData | null>(null)

  useEffect(() => {
    fetch('/api/history/today')
      .then(r => { if (!r.ok) throw new Error(r.statusText); return r.json() })
      .then(setData)
      .catch(() => setData(null))
  }, [])

  if (!data) return null

  let comparisonNote = ''
  if (forecastHigh !== undefined) {
    const diff = forecastHigh - data.avg_high
    if (diff > 5) comparisonNote = `Today is running ${Math.round(diff)}°C above the historical average for this date.`
    else if (diff > 2) comparisonNote = `Today is a couple degrees warmer than average for this date.`
    else if (diff < -5) comparisonNote = `Today is running ${Math.round(Math.abs(diff))}°C below the historical average for this date.`
    else if (diff < -2) comparisonNote = `Today is a couple degrees cooler than average for this date.`
    else comparisonNote = `Today is right on the historical average for this date.`
  }

  const today = new Date().toLocaleDateString('en-CA', { month: 'long', day: 'numeric' })

  return (
    <div className="rounded-[1.9rem] border border-[#d4e8cc] bg-gradient-to-br from-[#f0f8ec] to-[#f7fbf4] p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-forest">
        <CalendarDays className="h-4 w-4" />
        <p className="text-xs font-semibold uppercase tracking-[0.2em]">This day in PEI history</p>
      </div>

      <p className="font-serif text-lg leading-snug text-text-primary break-words">
        {data.ai_narrative}
      </p>

      {comparisonNote && (
        <p className="mt-2 text-sm leading-6 text-text-secondary">{comparisonNote}</p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-white/70 px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">Avg high today</p>
          <p className="mt-0.5 font-serif text-xl text-forest">{data.avg_high}°C</p>
        </div>
        <div className="rounded-2xl bg-white/70 px-3 py-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-muted">Record high</p>
          <p className="mt-0.5 font-serif text-xl text-sun-text">{data.record_high}°C <span className="text-xs font-sans font-normal text-text-muted">({data.record_high_year})</span></p>
        </div>
      </div>

      <p className="mt-3 text-[11px] text-text-muted">
        {data.years_on_record} years of records · Charlottetown Airport · {today}
      </p>
    </div>
  )
}
