import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import type { NextAuthConfig, Session } from 'next-auth'

const config: NextAuthConfig = {
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null
        try {
          const { prisma } = await import('@/lib/prisma')
          const admin = await prisma.adminUser.findUnique({
            where: { email: credentials.email as string },
          })
          if (!admin) return null
          const valid = await bcrypt.compare(credentials.password as string, admin.password)
          if (!valid) return null
          return { id: admin.id, email: admin.email, name: admin.name, role: admin.role }
        } catch {
          return null
        }
      },
    }),
  ],
  pages: { signIn: '/login' },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role ?? 'admin'
      }
      return token
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        ;(session.user as { role?: string }).role = token.role as string
      }
      return session
    },
  },
}

// Lazy singleton to avoid calling NextAuth() at module load time in build workers
let _instance: ReturnType<typeof NextAuth> | undefined

function getInstance() {
  if (!_instance) _instance = NextAuth(config)
  return _instance
}

export const handlers = new Proxy({} as ReturnType<typeof NextAuth>['handlers'], {
  get(_t, p: string) { return (getInstance().handlers as Record<string, unknown>)[p] },
})

// auth() with no args returns the session (server component usage)
export async function auth(): Promise<Session | null>
// auth(handler) wraps as middleware (not used here but keeps compat)
export async function auth(...args: unknown[]): Promise<unknown> {
  const a = getInstance().auth as (...a: unknown[]) => Promise<unknown>
  return args.length === 0 ? a() : a(...args)
}

export async function signIn(...args: unknown[]) {
  const fn = getInstance().signIn as (...a: unknown[]) => Promise<unknown>
  return fn(...args)
}

export async function signOut(...args: unknown[]) {
  const fn = getInstance().signOut as (...a: unknown[]) => Promise<unknown>
  return fn(...args)
}
