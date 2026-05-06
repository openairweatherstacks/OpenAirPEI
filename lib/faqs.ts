export interface FAQ {
  id: string
  question: string
  answer: string
  category: 'general' | 'weather' | 'technical' | 'activities' | 'features'
  order: number
}

export const FAQS: FAQ[] = [
  {
    id: 'faq-1',
    question: 'What is OpenAir Atlantic?',
    answer: 'OpenAir Atlantic is a mobile-first environmental intelligence app for Prince Edward Island that tells you exactly when to go outside and what to do. Rather than just showing weather numbers, we interpret real-time environmental data through an AI meteorologist who speaks to you in plain English. We pull live data from Environment Canada, ECCC, and Fisheries & Oceans Canada — all free government sources with no ads or paywalls.',
    category: 'general',
    order: 1,
  },
  {
    id: 'faq-2',
    question: 'How does the Conditions Score work?',
    answer: 'Our AI meteorologist analyzes temperature, wind, precipitation, air quality, UV index, and visibility to give each location a score: Excellent (great conditions), Good (acceptable), Fair (manageable), or Stay Inside (not recommended). The score is based on what actually matters for outdoor activities, not just comfort. A location might be "Fair" for swimming but "Excellent" for photography because of different factors.',
    category: 'general',
    order: 2,
  },
  {
    id: 'faq-3',
    question: 'Why do weather conditions differ so much across PEI?',
    answer: 'Prince Edward Island is only 280 km long, but microclimates vary dramatically. The north shore (Cavendish, Malpeque) faces open ocean and gets stronger winds. The west side (Summerside) is more sheltered. Charlottetown in the center sits in an estuary. We track 8+ key locations so you find the best conditions right now, not a generic "PEI forecast" that misses these crucial differences.',
    category: 'weather',
    order: 1,
  },
  {
    id: 'faq-4',
    question: 'What is the 3-Hour Window?',
    answer: 'The 3-Hour Window tells you how many minutes of good conditions you have before the weather changes. For example, "You have 1 hour 40 minutes before rain arrives at 2:30pm." This helps you decide if now is a good time to go out or if you should wait for conditions to improve. It\'s the difference between a weather forecast (what will happen) and an action forecast (when to go now).',
    category: 'weather',
    order: 2,
  },
  {
    id: 'faq-5',
    question: 'Is OpenAir available offline?',
    answer: 'Yes. OpenAir is built as a Progressive Web App (PWA) and caches the last known conditions so you can see data even without an internet connection. The timestamp shows you how fresh the data is. You can install it on your home screen (iOS: Share → Add to Home Screen; Android: Menu → Install App) and use it like a native app.',
    category: 'technical',
    order: 1,
  },
  {
    id: 'faq-6',
    question: 'What does the Paw Index mean for my dog?',
    answer: 'The Paw Index tells you if conditions are safe for your dog. It considers air temperature (paw pad burns from hot pavement and overheating), pavement temperature from UV index (hot pavement can burn paw pads in minutes), and air quality (respiratory irritation from pollution). Green means safe for extended walks, yellow means monitor your dog, red means keep walks very short or stay inside.',
    category: 'activities',
    order: 1,
  },
]

export function getFAQs(category?: string): FAQ[] {
  if (!category) return FAQS
  return FAQS.filter((faq) => faq.category === category).sort((a, b) => a.order - b.order)
}
