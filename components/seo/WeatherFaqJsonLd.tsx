interface FaqItem {
  question: string
  answer: string
}

interface Props {
  faqs: FaqItem[]
}

export function WeatherFaqJsonLd({ faqs }: Props) {
  if (!faqs.length) return null

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
