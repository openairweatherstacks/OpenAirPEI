'use client'

import { useEffect, useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface DynamicFAQ {
  _id?: string
  question: string
  answer: string
  location: string
  score: string
}

export function DynamicFAQSection() {
  const [faqs, setFaqs] = useState<DynamicFAQ[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDynamicFAQs = async () => {
      try {
        const response = await fetch('/api/faq/dynamic')
        const data = await response.json()
        setFaqs(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch dynamic FAQs:', error)
        setFaqs([])
      } finally {
        setLoading(false)
      }
    }

    fetchDynamicFAQs()
  }, [])

  if (loading) {
    return (
      <section className="space-y-4">
        <div>
          <p className="eyebrow mb-2">Today&apos;s Questions</p>
          <h2 className="section-title text-xl sm:text-2xl lg:text-3xl">What people are asking right now</h2>
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-[1.75rem] border border-border bg-white h-20 animate-pulse"
            />
          ))}
        </div>
      </section>
    )
  }

  if (!faqs || faqs.length === 0) return null

  return (
    <section className="space-y-4">
      <div>
        <p className="eyebrow mb-2">Today&apos;s Questions</p>
        <h2 className="section-title text-xl sm:text-2xl lg:text-3xl">What people are asking right now</h2>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => (
          <details
            key={faq._id || idx}
            className="group rounded-[1.75rem] border border-border bg-white"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-text-primary hover:text-forest transition">
              <span className="flex-1 text-left">{faq.question}</span>
              <ChevronDown className="h-4 w-4 shrink-0 text-text-muted transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-5 pb-5 space-y-3">
              <p className="text-sm leading-7 text-text-secondary">{faq.answer}</p>
              <div className="flex items-center gap-3 pt-2 border-t border-border/50">
                <span className="text-xs font-semibold text-text-muted uppercase">
                  {faq.location}
                </span>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    faq.score === 'Excellent'
                      ? 'bg-forest-light text-forest'
                      : faq.score === 'Good'
                        ? 'bg-leaf-light text-leaf'
                        : faq.score === 'Fair'
                          ? 'bg-sun-light text-sun-text'
                          : 'bg-red-50 text-red-600'
                  }`}
                >
                  {faq.score}
                </span>
              </div>
            </div>
          </details>
        ))}
      </div>
    </section>
  )
}
