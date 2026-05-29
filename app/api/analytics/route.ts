import { NextRequest, NextResponse } from 'next/server'
import { createHash } from 'crypto'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const path = (body.path as string) ?? '/'
    const referrer = (body.referrer as string) || null

    // Skip internal/admin paths and bot-like user agents
    if (path.startsWith('/admin') || path.startsWith('/api') || path.startsWith('/_next')) {
      return NextResponse.json({ ok: true })
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? req.headers.get('x-real-ip')
      ?? 'unknown'
    const ua = req.headers.get('user-agent') ?? ''

    // Skip common bots
    if (/bot|crawl|spider|slurp|mediapartners/i.test(ua)) {
      return NextResponse.json({ ok: true })
    }

    // Hash IP + UA for privacy-respecting fingerprint (not reversible)
    const visitorHash = createHash('sha256')
      .update(`${ip}:${ua}:${new Date().toISOString().slice(0, 10)}`)
      .digest('hex')
      .slice(0, 16)

    const { prisma } = await import('@/lib/prisma')
    await prisma.pageVisit.create({
      data: {
        path,
        visitorHash,
        referrer: referrer ? referrer.slice(0, 500) : null,
        userAgent: ua.slice(0, 500),
      },
    })
  } catch { /* non-blocking — analytics should never break the app */ }

  return NextResponse.json({ ok: true })
}
