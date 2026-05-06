import { client } from '@/sanity/lib/client'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  try {
    let query = '*[_type == "faq" && active == true]'

    if (category) {
      query += `[category == "${category}"]`
    }

    query += ' | order(order asc) { _id, question, answer, category, order, active, publishedAt }'

    const faqs = await client.fetch(query)

    return NextResponse.json(faqs)
  } catch (error) {
    console.error('Error fetching FAQs from Sanity:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch FAQs' },
      { status: 500 }
    )
  }
}
