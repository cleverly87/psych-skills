import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { passwordResetRateLimiter } from '@/lib/rate-limit'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

export async function POST(request: Request) {
  try {
    // Get client IP for rate limiting
    const forwarded = request.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
    
    // Check rate limit
    const rateLimitResult = passwordResetRateLimiter.check(ip)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many password reset requests. Please try again later.' },
        { status: 429 }
      )
    }

    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    })

    // Always return success to prevent email enumeration
    if (!user) {
      return NextResponse.json({ 
        message: 'If an account with that email exists, a password reset link has been sent.' 
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    // Save token to database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    })

    // Generate reset URL
    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/reset-password?token=${resetToken}`

    // Send email (with fallback to console)
    const emailConfig = {
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: process.env.EMAIL_SERVER_PORT === '465',
      auth: process.env.EMAIL_SERVER_USER && process.env.EMAIL_SERVER_PASSWORD ? {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      } : undefined,
    }

    if (emailConfig.host && emailConfig.auth) {
      // Email is configured - send actual email
      const transporter = nodemailer.createTransport(emailConfig)

      await transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@psych-skills.co.uk',
        to: email,
        subject: 'Password Reset Request - Psych-Skills Admin',
        html: `
          <h2>Password Reset Request</h2>
          <p>You requested to reset your password for Psych-Skills Admin.</p>
          <p>Click the link below to reset your password (valid for 1 hour):</p>
          <p><a href="${resetUrl}">${resetUrl}</a></p>
          <p>If you didn't request this, please ignore this email.</p>
        `,
      })

      console.log('✅ Password reset email sent to:', email)
    } else {
      // Email not configured - log to console
      console.log('🔐 PASSWORD RESET TOKEN (Email not configured):')
      console.log('   Email:', email)
      console.log('   Reset URL:', resetUrl)
      console.log('   Token expires in 1 hour')
    }

    return NextResponse.json({
      message: 'If an account with that email exists, a password reset link has been sent.',
    })
  } catch (error) {
    console.error('Password reset request error:', error)
    return NextResponse.json(
      { error: 'Failed to process password reset request' },
      { status: 500 }
    )
  }
}
