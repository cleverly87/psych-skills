import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

// POST - Send reply to client
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message } = await req.json()

    if (!message || message.trim() === '') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Get the contact submission
    const submission = await prisma.contactSubmission.findUnique({
      where: { id: params.id },
    })

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    // Create reply record
    const reply = await prisma.contactReply.create({
      data: {
        contactSubmissionId: params.id,
        message: message.trim(),
        sentBy: 'admin',
        senderEmail: process.env.EMAIL_FROM || 'info@psych-skills.co.uk',
        senderName: 'Dr Denise Hill',
      },
    })

    // Send email to client
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">Response from Dr Denise Hill - Psych-Skills</h2>
            
            <p>Dear ${submission.name},</p>
            
            <p>Thank you for your message${submission.subject ? ` regarding "${submission.subject}"` : ''}. Here is Dr Denise Hill's response:</p>
            
            <div style="background-color: #f3f4f6; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
            
            <p>If you have any follow-up questions, please reply to this email.</p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0;"><strong>Dr Denise Hill</strong></p>
              <p style="margin: 5px 0;">Sport & Exercise Psychologist</p>
              <p style="margin: 5px 0;">
                <a href="mailto:info@psych-skills.co.uk" style="color: #2563eb;">info@psych-skills.co.uk</a>
              </p>
              <p style="margin: 5px 0;">
                <a href="https://www.psych-skills.co.uk" style="color: #2563eb;">www.psych-skills.co.uk</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    // Send email (will appear in Outlook Sent Items)
    await sendEmail({
      to: submission.email,
      subject: `Re: ${submission.subject || 'Your Contact Form Message'} [CS:${submission.id}] - Dr Denise Hill`,
      html: emailHtml,
    })

    // Update submission updatedAt timestamp
    await prisma.contactSubmission.update({
      where: { id: params.id },
      data: { updatedAt: new Date() },
    })

    return NextResponse.json(reply)
  } catch (error) {
    console.error('Error sending reply:', error)
    return NextResponse.json(
      { error: 'Failed to send reply' },
      { status: 500 }
    )
  }
}
