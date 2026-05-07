import { ChevronDown } from 'lucide-react'
import type { FAQ } from '@/lib/faqs'

type FAQItem = FAQ

interface FAQSectionProps {
  items: FAQItem[]
  title?: string
  description?: string
}

export function FAQSection({ items, title, description }: FAQSectionProps) {
  if (!items || items.length === 0) return null

  return (
    <section className="space-y-4">
      {title && (
        <div>
          <p className="eyebrow mb-2">{title}</p>
          <h2 className="section-title text-xl sm:text-2xl lg:text-3xl">{description}</h2>
        </div>
      )}

      <div className="space-y-3">
        {items.map(({ id, question, answer }) => (
          <details
            key={id}
            className="group rounded-[1.75rem] border border-border bg-white"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 font-semibold text-text-primary hover:text-forest transition">
              {question}
              <ChevronDown className="h-4 w-4 shrink-0 text-text-muted transition-transform group-open:rotate-180" />
            </summary>
            <p className="px-5 pb-5 text-sm leading-7 text-text-secondary">{answer}</p>
          </details>
        ))}
      </div>
    </section>
  )
}
