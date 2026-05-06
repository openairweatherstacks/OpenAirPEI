import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  // Verify it's a legitimate Vercel cron request
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Hit the today endpoint to regenerate and cache today's data
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://openairatlantic.com'

    const response = await fetch(`${baseUrl}/api/history/today`, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' }
    })

    if (!response.ok) {
      throw new Error(`Failed to refresh history: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      ok: true,
      refreshed: new Date().toISOString(),
      data
    })
  } catch (error) {
    console.error('Cron refresh error:', error)
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
