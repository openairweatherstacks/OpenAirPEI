'use client'

import { useEffect, useState } from 'react'
import { FAQSection } from './FAQSection'

interface FAQItem {
  id: number
  question: string
  answer: string
  category?: string
}

interface FAQClientProps {
  category?: string
  title?: string
  description?: string
}

export function FAQClient({ category, title = 'Frequently asked questions', description = 'Find answers to common questions' }: FAQClientProps) {
  const [faqs, setFaqs] = useState<FAQItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const url = category ? `/api/faq?category=${encodeURIComponent(category)}` : '/api/faq'
        const response = await fetch(url)
        const data = await response.json()
        setFaqs(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to fetch FAQs:', error)
        setFaqs([])
      } finally {
        setLoading(false)
      }
    }

    fetchFAQs()
  }, [category])

  if (loading) {
    return (
      <section className="space-y-4">
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="rounded-[1.75rem] border border-border bg-white h-16 animate-pulse" />
          ))}
        </div>
      </section>
    )
  }

  return <FAQSection items={faqs} title={title} description={description} />
}
