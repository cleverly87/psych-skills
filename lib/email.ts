import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  // Check if email is configured
  if (!process.env.EMAIL_SERVER_USER || process.env.EMAIL_SERVER_USER === 'your-email@gmail.com') {
    console.log('📧 Email not configured - would have sent:')
    console.log(`   To: ${to}`)
    console.log(`   Subject: ${subject}`)
    return { messageId: 'email-not-configured' }
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  })

  // Send email
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Psych-Skills" <noreply@psych-skills.com>',
      to,
      subject,
      html,
    })

    console.log('✅ Email sent:', info.messageId)
    return info
  } catch (error) {
    console.error('❌ Email error:', error)
    // Don't throw - just log the error so booking still works
    return { error: true, message: error instanceof Error ? error.message : 'Unknown error' }
  }
}
