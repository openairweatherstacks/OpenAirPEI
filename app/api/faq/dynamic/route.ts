import { NextResponse } from 'next/server'
import { getAllLocationConditions } from '@/lib/environment'

export const revalidate = 600

export async function GET() {
  try {
    const allLocations = await getAllLocationConditions()

    const ctown = allLocations.find(e => e.location.id === 'charlottetown')
    const cavendish = allLocations.find(e => e.location.id === 'cavendish')
    const best = [...allLocations].sort((a, b) => {
      const rank = (s: string) => s === 'Excellent' ? 4 : s === 'Good' ? 3 : s === 'Fair' ? 2 : 1
      return rank(b.conditions.score) - rank(a.conditions.score)
    })[0]

    const ctownTemp = ctown?.weather.temperature ?? null
    const ctownFeels = ctown?.weather.feelsLike ?? null
    const ctownWind = ctown?.weather.windSpeed ?? null
    const ctownWindDir = ctown?.weather.windDirection ?? null
    const ctownScore = ctown?.conditions.score ?? 'Good'
    const cavendishScore = cavendish?.conditions.score ?? 'Good'
    const cavendishWater = cavendish?.waterTemp ?? null
    const bestName = best?.location.name ?? 'Charlottetown'
    const bestScore = best?.conditions.score ?? 'Good'

    const faqs = [
      {
        question: 'What is the temperature in Charlottetown right now?',
        answer: ctownTemp !== null
          ? `It is currently ${ctownTemp}°C in Charlottetown${ctownFeels !== null && ctownFeels !== ctownTemp ? `, feeling like ${ctownFeels}°C` : ''}. ${ctownScore === 'Excellent' ? 'Conditions are excellent for getting outside.' : ctownScore === 'Good' ? 'Conditions are good — a great time to head out.' : ctownScore === 'Fair' ? 'Conditions are fair — dress for the weather.' : 'Conditions are tough today — stay inside if you can.'}`
          : 'Live temperature data is currently unavailable for Charlottetown. Check back shortly.',
        location: 'Charlottetown',
        score: ctownScore,
      },
      {
        question: 'Is Cavendish Beach good for swimming today?',
        answer: cavendishWater !== null
          ? `Cavendish Beach is currently rated ${cavendishScore} for outdoor activity. The water temperature is ${cavendishWater}°C — ${cavendishWater >= 20 ? 'warm enough for a comfortable swim.' : cavendishWater >= 16 ? 'refreshing but manageable for most swimmers.' : 'on the cool side — a wetsuit would help.'} ${cavendishScore === 'Excellent' || cavendishScore === 'Good' ? 'Beach conditions look favourable today.' : 'Check current conditions before heading out.'}`
          : `Cavendish Beach is currently rated ${cavendishScore} for outdoor activity. Water temperature data is not available right now. Check current wind and precipitation before heading out.`,
        location: 'Cavendish',
        score: cavendishScore,
      },
      {
        question: 'What is the water temperature at Cavendish?',
        answer: cavendishWater !== null
          ? `The Gulf of St. Lawrence at Cavendish is currently ${cavendishWater}°C. ${cavendishWater >= 20 ? 'That\'s warm by Atlantic Canada standards — ideal for swimming.' : cavendishWater >= 17 ? 'Comfortable for most swimmers, especially on a warm day.' : cavendishWater >= 14 ? 'Refreshing but cool — short swims are best.' : 'Cold — most people will find it too chilly for swimming.'} PEI water temps typically peak in August.`
          : 'Water temperature data for Cavendish is not available right now. PEI\'s Gulf water typically ranges from 14°C in June to 22°C in August.',
        location: 'Cavendish',
        score: cavendishScore,
      },
      {
        question: 'What is the best location on PEI right now?',
        answer: `The best outdoor spot on PEI right now is ${bestName}, currently rated ${bestScore}. ${bestScore === 'Excellent' ? 'Conditions there are as good as it gets — ideal for any outdoor activity.' : bestScore === 'Good' ? 'Good conditions make it a solid choice today.' : 'Even the best spot on the island is facing some challenges today.'} Use the Explore page to compare all locations side by side.`,
        location: bestName,
        score: bestScore,
      },
      {
        question: 'How windy is it in Charlottetown today?',
        answer: ctownWind !== null
          ? `Wind in Charlottetown is currently ${ctownWind} km/h${ctownWindDir ? ` from the ${ctownWindDir}` : ''}. ${ctownWind >= 60 ? 'That\'s strong — outdoor plans may need to change.' : ctownWind >= 40 ? 'Noticeably gusty. Cyclists and beach-goers will feel it.' : ctownWind >= 25 ? 'A moderate breeze — pleasant but you\'ll notice it outdoors.' : 'Light wind — comfortable conditions for most activities.'}`
          : 'Live wind data for Charlottetown is not currently available. Check back shortly for updated conditions.',
        location: 'Charlottetown',
        score: ctownScore,
      },
      {
        question: 'Is it a good day to go outside on PEI?',
        answer: bestScore === 'Excellent'
          ? `Yes — today is an excellent day to be outside on PEI. ${bestName} is the standout spot right now. Multiple locations across the island are showing great conditions.`
          : bestScore === 'Good'
            ? `Generally yes — most of PEI is showing good conditions today. ${bestName} is your best bet right now. Check individual location pages for specifics before you head out.`
            : bestScore === 'Fair'
              ? `It\'s a fair-weather day on PEI. You can still get outside, but pick your spot carefully. ${bestName} is currently the best option the island has to offer.`
              : `Today is challenging across PEI — most locations are rated Stay Inside. If you must go out, ${bestName} is your best option, but plan accordingly.`,
        location: 'PEI',
        score: bestScore,
      },
    ]

    return NextResponse.json(faqs)
  } catch (err) {
    console.error('Dynamic FAQ error:', err)
    return NextResponse.json([], { status: 200 })
  }
}
