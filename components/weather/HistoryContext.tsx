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

export default function HistoryContext({ forecastHigh }: Props) {
  const [data, setData] = useState<HistoryData | null>(null)

  useEffect(() => {
    fetch('/api/history/today')
      .then(r => r.json())
      .then(setData)
      .catch(() => setData(null))
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
    <div className="mt-4 rounded-[1.75rem] bg-forest-light/40 border border-forest-light p-4 space-y-2">
      <p className="text-xs font-semibold text-forest uppercase tracking-wide">
        🗓️ Historical Context
      </p>
      <p className="text-sm text-text-primary leading-relaxed">
        {percentileNote || data.ai_narrative}
      </p>
      <p className="text-xs text-text-secondary">
        Record high for today: {data.record_high}°C ({data.record_high_year}) ·
        Average high: {data.avg_high}°C · {data.years_on_record} years of records
      </p>
    </div>
  )
}
