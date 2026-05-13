interface FaqItem {
  question: string;
  answer: string;
}

interface Props {
  faqs: FaqItem[];
  /** Optional anchor id used as the FAQPage @id (page URL + this fragment) */
  anchorId?: string;
}

export function WeatherFaqJsonLd({ faqs, anchorId }: Props) {
  if (!faqs.length) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(anchorId ? { "@id": anchorId } : {}),
    inLanguage: "en-CA",
    dateModified: new Date().toISOString().split("T")[0],
    mainEntity: faqs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
