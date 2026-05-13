import { NextResponse } from 'next/server'
import { getLocationConditions, getAllLocationConditions } from '@/lib/environment'

export const dynamic = 'force-dynamic'
export const revalidate = 600

function scoreLabel(score: string) {
  if (score === 'Excellent') return 'excellent — ideal conditions'
  if (score === 'Good') return 'good — a solid choice today'
  if (score === 'Fair') return 'fair — manageable with the right gear'
  return 'tough today — consider waiting'
}

function windRead(wind: number, dir: string | null) {
  const d = dir ? ` from the ${dir}` : ''
  if (wind >= 60) return `strong at ${wind} km/h${d} — expect disruption outdoors`
  if (wind >= 40) return `gusty at ${wind} km/h${d} — noticeable on exposed ground`
  if (wind >= 25) return `a moderate breeze at ${wind} km/h${d}`
  return `light at ${wind} km/h${d} — barely noticeable`
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const locationId = searchParams.get('locationId')

    // If a specific location, generate tailored FAQs for it
    if (locationId) {
      const entry = await getLocationConditions(locationId)
      if (!entry) return NextResponse.json([], { status: 200 })

      const { location, weather, conditions, waterTemp } = entry
      const name = location.name
      const score = conditions.score
      const temp = weather.temperature
      const feelsLike = weather.feelsLike
      const wind = weather.windSpeed
      const windDir = weather.windDirection
      const aqhi = weather.aqhi
      const uvIndex = weather.uvIndex
      const type = location.type
      const activities = location.activities

      const faqs = buildLocationFAQs({
        name, score, temp, feelsLike, wind, windDir,
        aqhi, uvIndex, type, activities, waterTemp,
      })

      return NextResponse.json(faqs)
    }

    // Fallback: island-wide summary
    const allLocations = await getAllLocationConditions()
    const best = [...allLocations].sort((a, b) => b.rawScore - a.rawScore)[0]
    const ctown = allLocations.find(e => e.location.id === 'charlottetown')

    const faqs = [
      {
        question: 'What is the best location on PEI right now?',
        answer: best
          ? `${best.location.name} is currently the top-rated spot on the island at ${best.conditions.score}. ${best.conditions.headline} Use the Explore page to compare all locations.`
          : 'Check the Explore page for a full breakdown of all locations across PEI.',
        location: best?.location.name ?? 'PEI',
        score: best?.conditions.score ?? 'Good',
      },
      {
        question: 'What is the weather like in Charlottetown right now?',
        answer: ctown
          ? `Charlottetown is currently ${ctown.weather.temperature}°C, feeling like ${ctown.weather.feelsLike}°C. Wind is ${windRead(ctown.weather.windSpeed, ctown.weather.windDirection)}. Overall conditions are ${scoreLabel(ctown.conditions.score)}.`
          : 'Live Charlottetown data is loading — check back shortly.',
        location: 'Charlottetown',
        score: ctown?.conditions.score ?? 'Good',
      },
    ]

    return NextResponse.json(faqs)
  } catch (err) {
    console.error('Dynamic FAQ error:', err)
    return NextResponse.json([], { status: 200 })
  }
}

interface FAQInput {
  name: string
  score: string
  temp: number
  feelsLike: number
  wind: number
  windDir: string | null
  aqhi: number
  uvIndex: number
  type: string
  activities: string[]
  waterTemp: number | null
}

function buildLocationFAQs(d: FAQInput) {
  const { name, score, temp, feelsLike, wind, windDir, aqhi, uvIndex, type, activities, waterTemp } = d
  const faqs = []

  // Q1: Is it a good time to visit? (always shown)
  faqs.push({
    question: `Is it a good time to visit ${name}?`,
    answer: `Right now ${name} is rated ${score}. The temperature is ${temp}°C (feels like ${feelsLike}°C) with wind ${windRead(wind, windDir)}. ${score === 'Excellent' || score === 'Good' ? 'Conditions are favourable — a great time to head out.' : 'You can still visit, but check the specific conditions below before you go.'}`,
    location: name,
    score,
  })

  // Q2: Temperature / weather feel
  faqs.push({
    question: `What is the temperature at ${name} right now?`,
    answer: `The temperature at ${name} is currently ${temp}°C, feeling like ${feelsLike}°C. Wind is ${windRead(wind, windDir)}. ${temp >= 22 ? 'Warm and comfortable — light clothing is fine.' : temp >= 15 ? 'A light jacket is a good idea.' : temp >= 8 ? 'Dress in layers — it\'s cool out.' : 'Bundle up — cold conditions today.'}`,
    location: name,
    score,
  })

  // Q3: Activity-specific (swimming for beaches, cycling for trails, etc.)
  if (activities.includes('swimming') || type === 'beach') {
    faqs.push({
      question: `Is the water warm enough to swim at ${name}?`,
      answer: waterTemp !== null
        ? `The water temperature at ${name} is ${waterTemp}°C. ${waterTemp >= 20 ? 'That\'s warm by Atlantic Canada standards — ideal for swimming.' : waterTemp >= 17 ? 'Refreshing and comfortable for most swimmers.' : waterTemp >= 14 ? 'On the cooler side — quick dips are fine.' : 'Cold water today — most swimmers will find it uncomfortable.'} ${score === 'Excellent' || score === 'Good' ? 'Beach conditions are good overall.' : 'Check current wave and wind conditions before getting in.'}`
        : `Swimming conditions at ${name} are currently rated ${score}. Water temperature data isn't available right now, but PEI's Gulf water typically ranges from 14°C in early summer to 22°C in August.`,
      location: name,
      score,
    })
  } else if (activities.includes('cycling') || type === 'trail') {
    faqs.push({
      question: `Is it good for cycling at ${name} today?`,
      answer: `Cycling conditions at ${name} are currently rated ${score}. Wind is ${windRead(wind, windDir)}. ${wind >= 40 ? 'Strong headwinds will make sections challenging — plan your direction.' : wind >= 25 ? 'A noticeable crosswind — manageable for most riders.' : 'Wind is light enough that it won\'t slow you down.'} Temperature is ${temp}°C — ${temp >= 10 && temp <= 28 ? 'well within the comfortable cycling range.' : temp < 10 ? 'layer up before you clip in.' : 'stay hydrated in the heat.'}`,
      location: name,
      score,
    })
  } else if (activities.includes('golf') || type === 'golf') {
    faqs.push({
      question: `What are the golf conditions at ${name} today?`,
      answer: `Golf conditions at ${name} are currently rated ${score}. Temperature is ${temp}°C with wind ${windRead(wind, windDir)}. ${wind >= 40 ? 'Strong wind will affect shot shape significantly today — club up on every hole.' : wind >= 25 ? 'A crosswind to factor in, but playable.' : 'Wind is light — ideal for scoring well.'} UV index is ${uvIndex} — ${uvIndex >= 6 ? 'sunscreen is a must on the course today.' : 'UV is manageable but don\'t skip the SPF.'}`,
      location: name,
      score,
    })
  } else if (activities.includes('hiking') || type === 'park') {
    faqs.push({
      question: `Are the trails good at ${name} today?`,
      answer: `Trail conditions at ${name} are rated ${score} right now. Temperature is ${temp}°C with ${windRead(wind, windDir)}. ${aqhi <= 3 ? 'Air quality is excellent — perfect for a long hike.' : aqhi <= 6 ? 'Air quality is acceptable — enjoy the trails.' : 'Air quality is lower than ideal — shorter outings are wise today.'} ${score === 'Excellent' || score === 'Good' ? 'Great day to hit the trails.' : 'Check weather before heading deep into the park.'}`,
      location: name,
      score,
    })
  } else if (type === 'bridge') {
    faqs.push({
      question: 'Is the Confederation Bridge open right now?',
      answer: `Wind at the Confederation Bridge is currently ${wind} km/h. ${wind >= 70 ? 'High-sided vehicles and motorcycles face restrictions — all vehicles should drive with caution.' : wind >= 60 ? 'Motorcycles should check restrictions before crossing. Other vehicles are unaffected.' : 'The bridge is operating normally under current wind conditions.'} Always check the official bridge status before your crossing.`,
      location: name,
      score,
    })
  } else if (type === 'campground') {
    faqs.push({
      question: `Is it a good night to camp at ${name}?`,
      answer: `Camping conditions at ${name} are rated ${score} tonight. Temperature is ${temp}°C (feels like ${feelsLike}°C). Wind is ${windRead(wind, windDir)}. ${wind >= 40 ? 'Stake your tent well — it\'s gusty tonight.' : 'Wind is calm enough for comfortable camping.'} ${temp < 10 ? 'Bring a cold-weather sleeping bag — it\'ll be chilly.' : temp < 15 ? 'A warm sleeping bag is recommended.' : 'Comfortable sleeping temperatures tonight.'}`,
      location: name,
      score,
    })
  } else {
    faqs.push({
      question: `What is the air quality like at ${name}?`,
      answer: `Air quality at ${name} is currently AQHI ${aqhi} — ${aqhi <= 3 ? 'low risk. The air is clean and safe for everyone, including kids and people with asthma.' : aqhi <= 6 ? 'moderate risk. Sensitive groups should limit prolonged outdoor exertion.' : 'high risk. Everyone should reduce extended time outdoors today.'}`,
      location: name,
      score,
    })
  }

  // Q4: UV / sun safety (always shown)
  faqs.push({
    question: `How strong is the UV index at ${name} today?`,
    answer: `The UV index at ${name} is currently ${uvIndex}. ${uvIndex === 0 ? 'UV is negligible today — no sun protection needed.' : uvIndex <= 2 ? 'Low UV — minimal risk, but a habit of sunscreen is always good.' : uvIndex <= 5 ? 'Moderate UV — apply SPF 30+ if you\'re spending more than 30 minutes outside.' : uvIndex <= 7 ? 'High UV — fair skin can burn in about 20 minutes. Reapply sunscreen every 2 hours.' : uvIndex <= 10 ? 'Very high UV — limit sun exposure between 11am–3pm and keep reapplying SPF.' : 'Extreme UV — seek shade, cover up, and apply high-SPF sunscreen before going out.'}`,
    location: name,
    score,
  })

  // Q5: Wind (always shown)
  faqs.push({
    question: `How windy is it at ${name} right now?`,
    answer: `Wind at ${name} is currently ${wind} km/h${windDir ? ` from the ${windDir}` : ''}. ${wind >= 60 ? 'Very strong — outdoor activities will be significantly affected.' : wind >= 40 ? 'Gusty conditions. Umbrellas, kites, and light gear will struggle.' : wind >= 25 ? 'A solid breeze — you\'ll notice it but it\'s manageable.' : wind >= 10 ? 'Light breeze — pleasant and barely disruptive.' : 'Calm — still air today.'} Temperature feels like ${feelsLike}°C with wind chill factored in.`,
    location: name,
    score,
  })

  return faqs
}
