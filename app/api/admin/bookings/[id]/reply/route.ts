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

    // Get the booking
    const booking = await prisma.booking.findUnique({
      where: { id: params.id },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Create reply record
    const reply = await prisma.bookingReply.create({
      data: {
        bookingId: params.id,
        message: message.trim(),
        sentBy: 'admin',
        senderEmail: process.env.EMAIL_FROM || 'info@psych-skills.co.uk',
        senderName: 'Dr Denise Hill',
      },
    })

    // Update booking updatedAt timestamp
    await prisma.booking.update({
      where: { id: params.id },
      data: { updatedAt: new Date() },
    })

    // Send email to client
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #047857 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .message-box { background: white; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 4px; }
            .info-box { background: #ecfdf5; padding: 15px; margin: 20px 0; border-radius: 4px; font-size: 14px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Message About Your Booking</h1>
            </div>
            <div class="content">
              <p>Dear ${booking.clientName},</p>
              
              <p>I have sent you a message regarding your booking:</p>
              
              <div class="info-box">
                <strong>Booking Details:</strong><br>
                Service: ${booking.serviceType.replace(/_/g, ' ')}<br>
                Date: ${new Date(booking.date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}<br>
                Time: ${booking.timeSlot}
              </div>
              
              <div class="message-box">
                <p style="margin: 0; font-weight: 600; color: #047857;">Message from Dr Denise Hill:</p>
                <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${message}</p>
              </div>
              
              <p><strong>To reply to this message:</strong> Simply reply to this email and I will receive your response.</p>
              
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
      subject: `Message About Your Booking [BK:${booking.id}] - ${new Date(booking.date).toLocaleDateString('en-GB')}`,
      html: emailHtml,
    })

    // Return updated booking with all replies
    const updatedBooking = await prisma.booking.findUnique({
      where: { id: params.id },
      include: {
        replies: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error('Error sending booking reply:', error)
    return NextResponse.json(
      { error: 'Failed to send reply' },
      { status: 500 }
    )
  }
}
