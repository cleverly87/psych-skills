import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { emailTemplates } from '@/lib/email-templates'

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
    const adminEmailTemplate = emailTemplates.contactFormNotification({
      name,
      email,
      subject,
      message,
    })
    
    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'info@psych-skills.co.uk',
      subject: adminEmailTemplate.subject,
      html: adminEmailTemplate.html,
    })

    // Send confirmation to sender
    const clientEmailTemplate = emailTemplates.contactFormReceived({
      name,
      email,
      subject,
      message,
    })
    
    await sendEmail({
      to: email,
      subject: clientEmailTemplate.subject,
      html: clientEmailTemplate.html,
    })

    // Redirect to success page or back to contact with success message
    return NextResponse.redirect(new URL('/contact?success=true', req.url))
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.redirect(new URL('/contact?error=true', req.url))
  }
}
