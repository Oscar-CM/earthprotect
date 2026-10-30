import { ImageResponse } from 'next/og'
import { getPublicCareers } from '@/lib/careers-data'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SIZE = { width: 1200, height: 630 }

/** Social preview card for a shared opening: /api/og/career?job=<id>. */
export async function GET(req: Request) {
  const job = new URL(req.url).searchParams.get('job')

  let title = 'Careers at Earth Protect'
  let place = 'Across Africa'
  let meta = 'Join us in protecting African wildlife'
  try {
    const countries = await getPublicCareers()
    for (const c of countries) {
      const o = c.openings.find((x) => x.id === job)
      if (o) {
        title = o.title
        place = c.name
        meta = [o.employmentType, o.location, o.availability === 'closed' ? 'Closed' : 'Apply now']
          .filter(Boolean)
          .join('  ·  ')
        break
      }
    }
  } catch (err) {
    console.error('[OG] Failed to load opening:', err)
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'linear-gradient(135deg, #0f3d26 0%, #1a5c3a 100%)',
          color: '#ffffff',
        }}
      >
        <div style={{ display: 'flex', fontSize: 34, fontWeight: 700, letterSpacing: 1 }}>
          EARTH PROTECT IS HIRING
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', fontSize: 76, fontWeight: 800, lineHeight: 1.1 }}>{title}</div>
          <div style={{ display: 'flex', fontSize: 52, marginTop: 20, color: '#a7e3c1' }}>{place}</div>
        </div>
        <div style={{ display: 'flex', fontSize: 34, color: '#d7f2e2' }}>{meta}</div>
      </div>
    ),
    SIZE,
  )
}
