// scripts/seed-faq.ts
// Run with: npx tsx scripts/seed-faq.ts

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const initialFAQs = [
  {
    question: 'What is OpenAir Atlantic?',
    answer: 'OpenAir Atlantic is a mobile-first environmental intelligence app for Prince Edward Island that tells you exactly when to go outside and what to do. Rather than just showing weather numbers, we interpret real-time environmental data through an AI meteorologist who speaks to you in plain English.',
    category: 'general',
    order_index: 1,
  },
  {
    question: 'How does the conditions score work?',
    answer: 'Our AI meteorologist analyzes temperature, wind, precipitation, air quality, UV index, and visibility to give each location a score: Excellent (great conditions), Good (acceptable), Fair (manageable), or Stay Inside (not recommended). The score is based on what actually matters for outdoor activities.',
    category: 'general',
    order_index: 2,
  },
  {
    question: 'Is the weather data real-time?',
    answer: 'Yes. We pull live weather data from Environment Canada (no ads, no paywalls) and update conditions every 10 minutes. Air quality comes from Environment and Climate Change Canada, and bridge wind data is live from the Borden weather station.',
    category: 'weather',
    order_index: 1,
  },
  {
    question: 'Where does the data come from?',
    answer: 'All our data comes from official Canadian government sources: Environment Canada for weather, ECCC for air quality, and Fisheries and Oceans Canada for tides. We do not use commercial weather APIs — all data is open and free under the Statistics Canada Open Licence.',
    category: 'weather',
    order_index: 2,
  },
  {
    question: 'What is the "3-Hour Window"?',
    answer: 'The 3-Hour Window tells you how many minutes of good conditions you have before the weather changes. For example, "You have 1 hour 40 minutes before rain arrives at 2:30pm." This helps you decide if now is a good time to go out or if you should wait.',
    category: 'weather',
    order_index: 3,
  },
  {
    question: 'Why do I see different conditions at different PEI locations?',
    answer: 'Prince Edward Island's weather varies dramatically by location. Charlottetown, Cavendish, and the north shore each have their own micro-climate. We show live conditions for 8+ key locations so you can find the best spot right now, not just a generic "PEI forecast."',
    category: 'weather',
    order_index: 4,
  },
  {
    question: 'Is there an offline mode?',
    answer: 'Yes. OpenAir is built as a Progressive Web App (PWA) and caches the last known conditions so you can see data even without an internet connection. The timestamp shows you how fresh the data is.',
    category: 'technical',
    order_index: 1,
  },
  {
    question: 'Can I install OpenAir on my home screen?',
    answer: 'Yes. On iOS, tap Share → Add to Home Screen. On Android, tap the menu → Install App. You can then open OpenAir like a native app without visiting the browser.',
    category: 'technical',
    order_index: 2,
  },
  {
    question: 'What is the Confederation Bridge wind alert?',
    answer: 'The bridge is closed to high-sided vehicles when winds exceed 70 km/h, and to motorcycles at 60 km/h. We pull live wind data from the Borden station and alert you before you drive.',
    category: 'general',
    order_index: 3,
  },
  {
    question: 'What is the Paw Index?',
    answer: 'The Paw Index tells you if conditions are safe for your dog. It considers air temperature (paw pad burns and overheating), pavement temperature from UV index, and air quality (respiratory irritation). Use it before taking your dog outside.',
    category: 'general',
    order_index: 4,
  },
]

async function main() {
  console.log('Seeding FAQ...')

  try {
    // Check if FAQs already exist
    const { data: existing } = await supabase
      .from('faq')
      .select('id')
      .limit(1)

    if (existing && existing.length > 0) {
      console.log('FAQs already exist. Skipping seed.')
      return
    }

    // Insert initial FAQs
    const { data, error } = await supabase
      .from('faq')
      .insert(initialFAQs)
      .select()

    if (error) throw error

    console.log(`✓ Seeded ${data?.length || 0} FAQs`)
  } catch (err) {
    console.error('Error seeding FAQs:', err)
  }
}

main()
