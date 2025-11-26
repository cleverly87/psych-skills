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
    const { message } = body

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: 'DECLINED',
        adminNotes: message,
      },
    })

    // Send decline email to client
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .message-box { background: #fee2e2; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0; border-radius: 4px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Booking Update</h1>
            </div>
            <div class="content">
              <p>Dear ${booking.clientName},</p>
              
              <p>Thank you for your interest in booking a session with Dr Denise Hill.</p>
              
              <p>Unfortunately, we are unable to accommodate your booking request for:</p>
              
              <ul>
                <li><strong>Service:</strong> ${booking.serviceType.replace(/_/g, ' ')}</li>
                <li><strong>Requested Date:</strong> ${new Date(booking.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
                <li><strong>Requested Time:</strong> ${booking.timeSlot}</li>
              </ul>
              
              <div class="message-box">
                <p style="margin: 0; font-weight: 600;">Message from Dr Denise Hill:</p>
                <p style="margin: 10px 0 0 0;">${message}</p>
              </div>
              
              <p>If you would like to explore alternative times or dates, please feel free to submit a new booking request or contact us directly.</p>
              
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
      subject: 'Booking Update - Dr Denise Hill | Psych-Skills',
      html: emailHtml,
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error declining booking:', error)
    return NextResponse.json(
      { error: 'Failed to decline booking' },
      { status: 500 }
    )
  }
}
