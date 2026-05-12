import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
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

          return { id: admin.id, email: admin.email, name: admin.name }
        } catch {
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: '/admin/login',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    session({ session, token }) {
      if (token && session.user) session.user.id = token.id as string
      return session
    },
  },
})
