'use client'

import { FAQSection } from './FAQSection'
import { getFAQs } from '@/lib/faqs'

interface FAQClientProps {
  category?: string
  title?: string
  description?: string
}

export function FAQClient({ category, title = 'Frequently asked questions', description = 'Find answers to common questions' }: FAQClientProps) {
  const faqs = getFAQs(category)

  return <FAQSection items={faqs} title={title} description={description} />
}
