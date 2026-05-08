import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

export const runtime = 'edge'

const SCORE_COLORS: Record<string, string> = {
  Excellent: '#3A8C2F',
  Good: '#7DC832',
  Fair: '#F5A623',
  'Stay Inside': '#C0392B',
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const location = searchParams.get('location') ?? 'Prince Edward Island'
  const score = searchParams.get('score') ?? 'Good'
  const color = SCORE_COLORS[score] ?? '#7DC832'

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          background: 'linear-gradient(135deg, #f0f8ec 0%, #fafdf7 50%, #fdf8f0 100%)',
          padding: '60px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Score badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              backgroundColor: color,
              color: 'white',
              padding: '8px 20px',
              borderRadius: '100px',
              fontSize: '22px',
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}
          >
            {score.toUpperCase()}
          </div>
        </div>

        {/* Location name */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 800,
            color: '#2A2A2A',
            lineHeight: 1.1,
            marginBottom: '20px',
            maxWidth: '900px',
          }}
        >
          {location}
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: '28px',
            color: '#6B7366',
            marginBottom: '48px',
          }}
        >
          Live outdoor conditions · Prince Edward Island
        </div>

        {/* Branding row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              color: 'white',
              fontWeight: 800,
            }}
          >
            O
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#4A4A4A' }}>
            OpenAir Atlantic
          </div>
        </div>

        {/* Decorative circle */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            backgroundColor: color,
            opacity: 0.06,
          }}
        />
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
