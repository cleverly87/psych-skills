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
    const { reason } = body

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: 'CANCELLED',
        adminNotes: reason || 'Cancelled by admin',
      },
    })

    // Send cancellation email to client
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-box { background: white; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0; border-radius: 4px; }
            .message-box { background: #fee2e2; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Booking Cancelled</h1>
            </div>
            <div class="content">
              <p>Dear ${booking.clientName},</p>
              
              <p>I regret to inform you that your session has been cancelled.</p>
              
              <div class="info-box">
                <h3 style="margin-top: 0; color: #dc2626;">Cancelled Session Details</h3>
                <ul style="list-style: none; padding: 0;">
                  <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Service:</strong> ${booking.serviceType.replace(/_/g, ' ')}</li>
                  <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
                  <li style="padding: 8px 0;"><strong>Time:</strong> ${booking.timeSlot}</li>
                </ul>
              </div>
              
              ${reason ? `
                <div class="message-box">
                  <p style="margin: 0; font-weight: 600;">Reason:</p>
                  <p style="margin: 10px 0 0 0;">${reason}</p>
                </div>
              ` : ''}
              
              <p>If you would like to reschedule or discuss alternative options, please don't hesitate to contact me.</p>
              
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
      subject: 'Session Cancelled - Dr Denise Hill | Psych Skills',
      html: emailHtml,
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error cancelling booking:', error)
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    )
  }
}
