import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET

  // NextAuth v5 uses 'authjs.session-token' (HTTP) or '__Secure-authjs.session-token' (HTTPS)
  const secure = req.nextUrl.protocol === 'https:'
  const cookieName = secure ? '__Secure-authjs.session-token' : 'authjs.session-token'

  const token = await getToken({ req, secret, cookieName })

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
