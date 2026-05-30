import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  // NextAuth v5 uses AUTH_SECRET; fall back to NEXTAUTH_SECRET for compatibility
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET

  const token = await getToken({ req, secret })

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
