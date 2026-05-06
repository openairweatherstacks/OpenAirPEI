import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getAllLocationConditions } from '@/lib/environment'

const anthropic = new Anthropic()

export const revalidate = 600

export async function GET() {
  try {
    const allLocations = await getAllLocationConditions()

    // Pick Charlottetown and Cavendish as context for the FAQs
    const ctown = allLocations.find(e => e.location.id === 'charlottetown')
    const cavendish = allLocations.find(e => e.location.id === 'cavendish')
    const best = [...allLocations].sort((a, b) => {
      const rank = (s: string) => s === 'Excellent' ? 4 : s === 'Good' ? 3 : s === 'Fair' ? 2 : 1
      return rank(b.conditions.score) - rank(a.conditions.score)
    })[0]

    const ctownTemp = ctown?.weather.temperature ?? null
    const ctownWind = ctown?.weather.windSpeed ?? null
    const ctownScore = ctown?.conditions.score ?? null
    const cavendishScore = cavendish?.conditions.score ?? null
    const cavendishWater = cavendish?.waterTemp ?? null
    const bestName = best?.location.name ?? null
    const bestScore = best?.conditions.score ?? null

    const prompt = `You are OpenAir PEI, a real-time outdoor conditions app for Prince Edward Island, Canada.
Generate exactly 6 FAQ answers using the LIVE conditions data below. Each answer must include specific current numbers.

Live data right now:
- Charlottetown temperature: ${ctownTemp !== null ? `${ctownTemp}°C` : 'unavailable'}
- Charlottetown wind: ${ctownWind !== null ? `${ctownWind} km/h` : 'unavailable'}
- Charlottetown conditions score: ${ctownScore ?? 'unavailable'}
- Cavendish Beach conditions: ${cavendishScore ?? 'unavailable'}
- Cavendish water temperature: ${cavendishWater !== null ? `${cavendishWater}°C` : 'unavailable'}
- Best location right now: ${bestName ?? 'unavailable'} (${bestScore ?? 'unavailable'})

Return ONLY a JSON array of exactly 6 objects, no other text:
[
  {
    "question": "What is the temperature in Charlottetown right now?",
    "answer": "Right now in Charlottetown it is [use the live temp]°C...",
    "location": "Charlottetown",
    "score": "[use Charlottetown score]"
  },
  ...
]

The 6 questions must be:
1. What is the temperature in Charlottetown right now?
2. Is Cavendish Beach good for swimming today?
3. What is the water temperature at Cavendish?
4. What is the best location on PEI right now?
5. How windy is it in Charlottetown today?
6. Is it a good day to go outside on PEI?

Rules:
- Always use the exact live numbers in the answers
- Answers should be 2-3 sentences, friendly and specific
- score field must be one of: Excellent, Good, Fair, Stay Inside`

    const message = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL ?? 'claude-sonnet-4-6',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0]?.type === 'text' ? message.content[0].text.trim() : null
    if (!text) return NextResponse.json([], { status: 200 })

    const cleaned = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '')
    const faqs = JSON.parse(cleaned)

    return NextResponse.json(Array.isArray(faqs) ? faqs : [])
  } catch (err) {
    console.error('Dynamic FAQ error:', err)
    return NextResponse.json([], { status: 200 })
  }
}
