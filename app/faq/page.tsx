import { Suspense } from 'react'
import { FAQClient } from '@/components/faq/FAQClient'

export const metadata = {
  title: 'FAQ | OpenAir Atlantic',
  description: 'Frequently asked questions about OpenAir Atlantic weather intelligence for Prince Edward Island.',
}

export default function FAQPage() {
  return (
    <div className="page-shell mt-8 space-y-12">
      <section className="panel p-6 sm:p-8">
        <p className="eyebrow mb-3">Help & Support</p>
        <h1 className="section-title text-3xl sm:text-4xl">Frequently asked questions</h1>
        <p className="section-copy mt-3">
          Find answers to common questions about OpenAir Atlantic, how it works, and how to get the most out of the app.
        </p>
      </section>

      <Suspense fallback={<div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="rounded-[1.75rem] border border-border bg-white h-16 animate-pulse" />)}</div>}>
        <FAQClient />
      </Suspense>

      {/* Divider */}
      <div className="border-t border-border" />

      {/* General Questions */}
      <Suspense fallback={<div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="rounded-[1.75rem] border border-border bg-white h-16 animate-pulse" />)}</div>}>
        <FAQClient
          category="general"
          title="General"
          description="General questions about OpenAir Atlantic"
        />
      </Suspense>

      {/* Weather Data Questions */}
      <Suspense fallback={<div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="rounded-[1.75rem] border border-border bg-white h-16 animate-pulse" />)}</div>}>
        <FAQClient
          category="weather"
          title="Weather Data"
          description="Questions about weather data and how we gather it"
        />
      </Suspense>

      {/* Technical Questions */}
      <Suspense fallback={<div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="rounded-[1.75rem] border border-border bg-white h-16 animate-pulse" />)}</div>}>
        <FAQClient
          category="technical"
          title="Technical"
          description="Technical questions about the app and features"
        />
      </Suspense>
    </div>
  )
}
