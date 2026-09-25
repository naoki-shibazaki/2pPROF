import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import PostgresAdapter from '@auth/pg-adapter'
import { pool, sql } from '@/lib/db'
import bcrypt from 'bcryptjs'

export const { handlers, signIn, signOut, auth } = NextAuth({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapter: PostgresAdapter(pool as any),
  session: { strategy: 'database' },
  pages: {
    signIn: '/login',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
    // LINE OAuth
    {
      id: 'line',
      name: 'LINE',
      type: 'oauth',
      authorization: {
        url: 'https://access.line.me/oauth2/v2.1/authorize',
        params: { scope: 'profile openid email' },
      },
      token: 'https://api.line.me/oauth2/v2.1/token',
      userinfo: 'https://api.line.me/v2/profile',
      clientId: process.env.LINE_CLIENT_ID!,
      clientSecret: process.env.LINE_CLIENT_SECRET!,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      profile(profile: any) {
        return {
          id: profile.userId,
          name: profile.displayName,
          email: profile.email ?? null,
          image: profile.pictureUrl ?? null,
        }
      },
      allowDangerousEmailAccountLinking: true,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    // Email + Password
    Credentials({
      id: 'email-password',
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const rows = await sql`
          SELECT u.id, u.name, u.email, u.image, a.hashed_password
          FROM users u
          JOIN accounts a ON a."userId" = u.id AND a.provider = 'email-password'
          WHERE u.email = ${credentials.email as string}
        `
        const user = rows[0]
        if (!user || !user.hashed_password) return null

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.hashed_password as string,
        )
        if (!valid) return null

        return { id: user.id, name: user.name, email: user.email, image: user.image }
      },
    }),
    // Phone OTP token (issued after Twilio verify)
    Credentials({
      id: 'phone-token',
      name: 'Phone Token',
      credentials: {
        phone_token: { label: 'Phone Token', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.phone_token) return null

        const rows = await sql`
          SELECT u.id, u.name, u.email, u.image
          FROM phone_otps po
          JOIN users u ON u.phone = po.phone
          WHERE po.phone_token = ${credentials.phone_token as string}
            AND po.expires_at > NOW()
            AND po.used = FALSE
        `
        const row = rows[0]
        if (!row) return null

        await sql`
          UPDATE phone_otps SET used = TRUE
          WHERE phone_token = ${credentials.phone_token as string}
        `

        return { id: row.id, name: row.name, email: row.email, image: row.image }
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user && user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(session.user as any).id = user.id
      }
      return session
    },
  },
})
