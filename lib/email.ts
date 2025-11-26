import nodemailer from 'nodemailer'

interface EmailAttachment {
  filename: string
  content: Buffer
  contentType: string
}

interface EmailOptions {
  to: string
  subject: string
  html: string
  attachments?: EmailAttachment[]
}

export async function sendEmail({ to, subject, html, attachments }: EmailOptions) {
  // Check if email is configured
  if (!process.env.EMAIL_SERVER_USER || process.env.EMAIL_SERVER_USER === 'your-email@gmail.com') {
    console.log('📧 Email not configured - would have sent:')
    console.log(`   To: ${to}`)
    console.log(`   Subject: ${subject}`)
    return { messageId: 'email-not-configured' }
  }

  // Create transporter for Microsoft 365 / Outlook
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
    secure: false, // Use STARTTLS (required for Office 365)
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
    tls: {
      ciphers: 'SSLv3', // Required for some Office 365 configurations
      rejectUnauthorized: false // For development - remove in production if needed
    }
  })

  // Send email
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Dr Denise Hill - Psych-Skills" <info@psych-skills.co.uk>',
      to,
      subject,
      html,
      attachments: attachments?.map(att => ({
        filename: att.filename,
        content: att.content,
        contentType: att.contentType
      }))
    })

    console.log('✅ Email sent:', info.messageId)
    console.log(`   From: ${process.env.EMAIL_FROM}`)
    console.log(`   To: ${to}`)
    return info
  } catch (error) {
    console.error('❌ Email error:', error)
    // Don't throw - just log the error so booking still works
    return { error: true, message: error instanceof Error ? error.message : 'Unknown error' }
  }
}
