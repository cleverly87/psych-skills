import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { alternativeDate, alternativeTime, message } = body

    if (!alternativeDate || !alternativeTime) {
      return NextResponse.json(
        { error: 'Alternative date and time are required' },
        { status: 400 }
      )
    }

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Parse the alternative date and time to create a proper Date object
    const proposedDateTime = new Date(`${alternativeDate}T${alternativeTime}`)

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        date: proposedDateTime,
        timeSlot: alternativeTime,
        adminNotes: `Alternative proposed: ${alternativeDate} at ${alternativeTime}. ${message}`,
      },
    })

    // Send alternative proposal email to client
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .highlight-box { background: #e0f2fe; border-left: 4px solid #0891b2; padding: 20px; margin: 20px 0; border-radius: 4px; }
            .message-box { background: #f0f9ff; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Alternative Time Proposed</h1>
            </div>
            <div class="content">
              <p>Dear ${booking.clientName},</p>
              
              <p>Thank you for your booking request. I am unavailable at your originally requested time, but I would like to propose an alternative:</p>
              
              <div class="highlight-box">
                <p style="margin: 0 0 10px 0;"><strong>Proposed Alternative:</strong></p>
                <ul style="margin: 0;">
                  <li><strong>Service:</strong> ${booking.serviceType.replace(/_/g, ' ')}</li>
                  <li><strong>Date:</strong> ${new Date(alternativeDate).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
                  <li><strong>Time:</strong> ${alternativeTime}</li>
                </ul>
              </div>
              
              <div class="message-box">
                <p style="margin: 0; font-weight: 600;">Message from Dr Denise Hill:</p>
                <p style="margin: 10px 0 0 0;">${message}</p>
              </div>
              
              <p><strong>To Confirm This Alternative Time:</strong></p>
              <p style="background: #dcfce7; border: 2px solid #16a34a; padding: 15px; border-radius: 6px; text-align: center;">
                <strong>Reply to this email with "YES"</strong> to confirm this booking, or suggest an alternative time that works better for you.
              </p>
              
              <p style="font-size: 13px; color: #6b7280;">Once I receive your confirmation, I'll send you a final booking confirmation with all the details.</p>
              
              <div class="footer">
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
          </div>
        </body>
      </html>
    `

    await sendEmail({
      to: booking.clientEmail,
      subject: 'Alternative Time Proposed - Dr Denise Hill | Psych-Skills',
      html: emailHtml,
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error proposing alternative:', error)
    return NextResponse.json(
      { error: 'Failed to propose alternative' },
      { status: 500 }
    )
  }
}
