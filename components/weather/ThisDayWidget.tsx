'use client'

import { useEffect, useState } from 'react'

interface HistoryData {
  avg_high: number
  avg_low: number
  record_high: number
  record_high_year: number
  record_low: number
  record_low_year: number
  precip_frequency: number
  years_on_record: number
  ai_narrative: string
}

export default function ThisDayWidget() {
  const [data, setData] = useState<HistoryData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/history/today')
      .then(r => r.json())
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [])

  const today = new Date().toLocaleDateString('en-CA', { month: 'long', day: 'numeric' })

  if (loading) return (
    <div className="rounded-[1.75rem] border border-border bg-white p-5 animate-pulse h-48" />
  )

  if (!data) return null

  return (
    <div className="rounded-[1.75rem] border border-border bg-white p-5 space-y-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">🗓️</span>
        <h3 className="font-semibold text-sm text-text-primary">
          This Day in PEI Weather History — {today}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="bg-forest-light rounded-lg p-3">
          <p className="text-text-secondary">Avg High</p>
          <p className="font-semibold text-text-primary mt-0.5">{data.avg_high}°C</p>
        </div>
        <div className="bg-leaf-light rounded-lg p-3">
          <p className="text-text-secondary">Avg Low</p>
          <p className="font-semibold text-text-primary mt-0.5">{data.avg_low}°C</p>
        </div>
        <div className="bg-sun-light rounded-lg p-3">
          <p className="text-text-secondary">Record High</p>
          <p className="font-semibold text-text-primary mt-0.5">{data.record_high}°C ({data.record_high_year})</p>
        </div>
        <div className="bg-sun-light rounded-lg p-3">
          <p className="text-text-secondary">Record Low</p>
          <p className="font-semibold text-text-primary mt-0.5">{data.record_low}°C ({data.record_low_year})</p>
        </div>
      </div>

      <p className="text-sm text-text-secondary leading-relaxed italic">
        {data.ai_narrative}
      </p>

      <p className="text-xs text-text-muted">
        Based on {data.years_on_record} years of Charlottetown records
      </p>
    </div>
  )
}
