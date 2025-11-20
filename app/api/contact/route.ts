import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const subject = formData.get('subject') as string
    const message = formData.get('message') as string

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Save to database
    await prisma.contactSubmission.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
      },
    })

    // Send notification to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@psych-skills.com',
      subject: `New Contact Form Submission: ${subject || 'No Subject'}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone || 'Not provided'}</li>
          <li><strong>Subject:</strong> ${subject || 'N/A'}</li>
        </ul>
        <h3>Message:</h3>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    })

    // Send confirmation to sender
    await sendEmail({
      to: email,
      subject: 'Thank you for contacting Psych-Skills',
      html: `
        <h2>Thank you for your message!</h2>
        <p>Dear ${name},</p>
        <p>We've received your message and will get back to you as soon as possible, typically within 24-48 hours.</p>
        <p>In the meantime, feel free to explore our services or book a session directly.</p>
        <p>Best regards,<br/>The Psych-Skills Team</p>
      `,
    })

    // Redirect to success page or back to contact with success message
    return NextResponse.redirect(new URL('/contact?success=true', req.url))
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.redirect(new URL('/contact?error=true', req.url))
  }
}
