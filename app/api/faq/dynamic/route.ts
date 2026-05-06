import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getAllLocationConditions } from '@/lib/environment'

const anthropic = new Anthropic()

interface DynamicFAQ {
  question: string
  answer: string
  location: string
  score: string
}

export async function GET() {
  try {
    const locations = await getAllLocationConditions()

    // Select diverse locations for FAQ generation
    const selectedLocations = locations.filter(
      (entry) => ['charlottetown', 'cavendish', 'victoria-park', 'north-cape', 'confederation-bridge'].includes(entry.location.id)
    )

    const faqs: DynamicFAQ[] = []

    for (const entry of selectedLocations) {
      const locationName = entry.location.name
      const score = entry.conditions.score
      const headline = entry.conditions.headline
      const summary = entry.conditions.summary
      const weather = entry.weather
      const activities = entry.conditions.activities

      const prompt = `You are OpenAir Atlantic's meteorologist. Generate 2 FAQs about current conditions at ${locationName}.

Current conditions:
- Conditions score: ${score}
- Headline: ${headline}
- Summary: ${summary}
- Temperature: ${weather.temperature}°C (feels like ${weather.feelsLike}°C)
- Wind: ${weather.windSpeed} km/h from ${weather.windDirection}
- Humidity: ${weather.humidity}%
- UV Index: ${weather.uvIndex}
- Air quality (AQHI): ${weather.aqhi}
- Activity status: ${activities.map((a) => \`\${a.name}: \${a.status} (\${a.reason})\`).join(', ')}

Generate exactly 2 FAQs in this JSON format:
[
  {
    "question": "What's happening at [Location] right now?",
    "answer": "A 2-3 sentence explanation of current conditions and what visitors should know"
  },
  {
    "question": "Should I go to [Location] today for [activity]?",
    "answer": "A 2-3 sentence recommendation based on current score and activities"
  }
]

Be specific, reference actual numbers from the conditions above, and make it actionable. Do NOT include markdown or any text outside the JSON array.`

      const message = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [{ role: 'user', content: prompt }],
      })

      const content = message.content[0].type === 'text' ? message.content[0].text : ''

      try {
        const parsed = JSON.parse(content)
        if (Array.isArray(parsed)) {
          faqs.push(
            ...parsed.map((faq: any) => ({
              question: faq.question,
              answer: faq.answer,
              location: locationName,
              score,
            }))
          )
        }
      } catch (e) {
        console.error(`Failed to parse FAQ for ${locationName}:`, e)
      }
    }

    return NextResponse.json(faqs)
  } catch (error) {
    console.error('Error generating dynamic FAQs:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate FAQs' },
      { status: 500 }
    )
  }
}
