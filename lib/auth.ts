import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { loginRateLimiter } from '@/lib/rate-limit'
import { verifyCaptcha } from '@/lib/captcha'
import { logLoginAttempt } from '@/lib/login-activity'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        captchaToken: { label: 'CAPTCHA Token', type: 'text' },
        captchaAnswer: { label: 'CAPTCHA Answer', type: 'text' },
      },
      async authorize(credentials, req) {
        console.log('🔐 Login attempt:', { email: credentials?.email })
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Missing email or password')
          return null
        }

        // Verify CAPTCHA (temporarily disabled for testing)
        // TODO: Re-enable CAPTCHA after testing
        /*
        if (!credentials.captchaToken || !credentials.captchaAnswer) {
          throw new Error('Please complete the security verification.')
        }

        console.log('CAPTCHA Verification:', {
          token: credentials.captchaToken,
          userAnswer: credentials.captchaAnswer
        })

        const captchaValid = verifyCaptcha(
          credentials.captchaToken,
          credentials.captchaAnswer
        )

        console.log('CAPTCHA Valid:', captchaValid)

        if (!captchaValid) {
          throw new Error('Incorrect security answer. Please try again.')
        }
        */

        // Rate limiting by IP
        const forwarded = req.headers?.['x-forwarded-for']
        const ip = typeof forwarded === 'string' ? forwarded.split(',')[0] : 'unknown'
        
        console.log('🌐 IP:', ip)
        
        const rateLimitResult = loginRateLimiter.check(ip)
        console.log('⏱️ Rate limit result:', rateLimitResult)
        
        if (!rateLimitResult.success) {
          if (rateLimitResult.blocked) {
            throw new Error('Your IP has been temporarily blocked due to too many failed login attempts. Please try again later.')
          }
          throw new Error('Too many login attempts. Please try again in 15 minutes.')
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        console.log('👤 User found:', user ? 'Yes' : 'No')

        if (!user) {
          console.log('❌ User not found')
          logLoginAttempt(ip, credentials.email, false, req.headers?.['user-agent'])
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        console.log('🔑 Password valid:', isPasswordValid)

        if (!isPasswordValid) {
          console.log('❌ Invalid password')
          logLoginAttempt(ip, credentials.email, false, req.headers?.['user-agent'])
          return null
        }

        // Successful login - reset rate limit for this IP
        loginRateLimiter.reset(ip)
        logLoginAttempt(ip, credentials.email, true, req.headers?.['user-agent'])
        
        console.log('✅ Login successful')

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }: any) {
      if (session?.user) {
        session.user.role = token.role
        session.user.id = token.id
      }
      return session
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
}

