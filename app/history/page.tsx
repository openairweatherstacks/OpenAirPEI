import { Suspense } from 'react'
import HistoryPageClient from './HistoryPageClient'

export const metadata = {
  title: 'PEI Weather History | OpenAir Atlantic',
  description: 'Explore 150 years of Prince Edward Island weather records. Daily records, climate trends, and historical data for Charlottetown.',
}

export default function HistoryPage() {
  return (
    <div className="page-shell mt-8 space-y-8">
      <section className="panel p-6 sm:p-8">
        <p className="eyebrow mb-3">Weather History</p>
        <h1 className="section-title text-3xl sm:text-4xl">
          PEI Weather History
        </h1>
        <p className="section-copy mt-3">
          150+ years of daily weather records from Charlottetown — the longest climate record on Prince Edward Island.
        </p>
      </section>

      <Suspense fallback={<div className="animate-pulse h-64 bg-white rounded-[2rem] border border-border" />}>
        <HistoryPageClient />
      </Suspense>
    </div>
  )
}
