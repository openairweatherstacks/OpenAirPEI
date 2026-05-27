// scripts/generate-sample-faqs.ts
// Run with: npx tsx scripts/generate-sample-faqs.ts
// This generates 6 sample dynamic FAQs based on mock conditions

import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic()

interface SampleConditions {
  location: string
  temperature: number
  feelsLike: number
  windSpeed: number
  windDirection: string
  humidity: number
  uvIndex: number
  aqhi: number
  visibility: number
  pressure: number
  score: string
  activities: { name: string; status: string; reason: string }[]
}

const sampleLocations: SampleConditions[] = [
  {
    location: 'City of Charlottetown',
    temperature: 18,
    feelsLike: 16,
    windSpeed: 28,
    windDirection: 'NW',
    humidity: 72,
    uvIndex: 4,
    aqhi: 3,
    visibility: 15,
    pressure: 1013,
    score: 'Good',
    activities: [
      { name: 'walking', status: 'great', reason: 'perfect weather' },
      { name: 'cycling', status: 'ok', reason: 'manageable wind' },
      { name: 'dining', status: 'great', reason: 'pleasant temperature' },
    ],
  },
  {
    location: 'Cavendish Beach',
    temperature: 16,
    feelsLike: 14,
    windSpeed: 32,
    windDirection: 'NE',
    humidity: 68,
    uvIndex: 5,
    aqhi: 2,
    visibility: 18,
    pressure: 1012,
    score: 'Fair',
    activities: [
      { name: 'swimming', status: 'not recommended', reason: 'cold water' },
      { name: 'walking', status: 'ok', reason: 'windy but scenic' },
      { name: 'photography', status: 'great', reason: 'dramatic light' },
    ],
  },
  {
    location: 'Victoria Park',
    temperature: 19,
    feelsLike: 17,
    windSpeed: 22,
    windDirection: 'W',
    humidity: 65,
    uvIndex: 6,
    aqhi: 4,
    visibility: 20,
    pressure: 1014,
    score: 'Excellent',
    activities: [
      { name: 'walking', status: 'great', reason: 'perfect conditions' },
      { name: 'picnic', status: 'great', reason: 'ideal temperature' },
      { name: 'cycling', status: 'great', reason: 'light breeze' },
    ],
  },
  {
    location: 'North Cape',
    temperature: 14,
    feelsLike: 11,
    windSpeed: 42,
    windDirection: 'E',
    humidity: 75,
    uvIndex: 3,
    aqhi: 5,
    visibility: 12,
    pressure: 1010,
    score: 'Fair',
    activities: [
      { name: 'hiking', status: 'ok', reason: 'strong wind exposure' },
      { name: 'whale-watching', status: 'great', reason: 'good visibility' },
      { name: 'photography', status: 'ok', reason: 'dramatic but gusty' },
    ],
  },
  {
    location: 'Confederation Bridge',
    temperature: 17,
    feelsLike: 14,
    windSpeed: 48,
    windDirection: 'NE',
    humidity: 70,
    uvIndex: 3,
    aqhi: 3,
    visibility: 16,
    pressure: 1011,
    score: 'Fair',
    activities: [
      { name: 'driving', status: 'ok', reason: 'strong wind' },
      { name: 'motorcycling', status: 'not recommended', reason: 'dangerous wind' },
    ],
  },
  {
    location: 'Greenwich Dunes',
    temperature: 15,
    feelsLike: 13,
    windSpeed: 26,
    windDirection: 'NW',
    humidity: 69,
    uvIndex: 4,
    aqhi: 2,
    visibility: 19,
    pressure: 1013,
    score: 'Good',
    activities: [
      { name: 'hiking', status: 'great', reason: 'good wind, clean air' },
      { name: 'birdwatching', status: 'great', reason: 'active birds' },
      { name: 'photography', status: 'great', reason: 'golden hour light' },
    ],
  },
]

async function generateFAQs() {
  console.log('Generating 6 sample dynamic FAQs...\n')

  const allFAQs = []

  for (const location of sampleLocations) {
    const activityStatus = location.activities.map((a) => `${a.name}: ${a.status}`).join(', ')
    const prompt = `You are OpenAir Atlantic's meteorologist. Generate 1 FAQ about current conditions at ${location.location}.

Current conditions:
- Conditions score: ${location.score}
- Temperature: ${location.temperature}°C (feels like ${location.feelsLike}°C)
- Wind: ${location.windSpeed} km/h from ${location.windDirection}
- Humidity: ${location.humidity}%
- UV Index: ${location.uvIndex}
- Visibility: ${location.visibility} km
- Air quality (AQHI): ${location.aqhi}
- Pressure: ${location.pressure} hPa
- Activity status: ${activityStatus}

Generate 1 FAQ in this JSON format:
{
  "question": "What's the current weather at ${location.location}?",
  "answer": "2-3 sentences. MUST include specific numbers (temperature, wind, humidity, AQHI, UV, visibility). Make it actionable and interesting for visitors."
}

Be specific, reference the actual numbers above, mention what activities are good/bad, and make it sound like a knowledgeable local. Do NOT include markdown or any text outside the JSON object.`

    try {
      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        messages: [{ role: 'user', content: prompt }],
      })

      const content = message.content[0].type === 'text' ? message.content[0].text : ''

      const faq = JSON.parse(content)
      allFAQs.push({
        location: location.location,
        score: location.score,
        ...faq,
      })

      console.log(`✓ ${location.location}`)
      console.log(`  Q: ${faq.question}`)
      console.log(`  A: ${faq.answer}\n`)
    } catch (error) {
      console.error(`✗ Failed to generate FAQ for ${location.location}:`, error)
    }
  }

  console.log('\n--- ALL 6 FAQs ---\n')
  allFAQs.forEach((faq, idx) => {
    console.log(`${idx + 1}. ${faq.question}`)
    console.log(`   Location: ${faq.location} [${faq.score}]`)
    console.log(`   Answer: ${faq.answer}\n`)
  })
}

generateFAQs()
