import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { emailTemplates } from '@/lib/email-templates'
import { createCalendarEvent } from '@/lib/google-calendar'

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await req.json()
    const { status, customMessage, proposedDate, proposedTime } = body

    // Get the booking
    const booking = await prisma.booking.findUnique({
      where: { id },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Update booking status and admin notes if provided
    const updateData: any = { status }
    if (customMessage) {
      updateData.notes = booking.notes 
        ? `${booking.notes}\n\n[Dr. Hill's Response]: ${customMessage}`
        : `[Dr. Hill's Response]: ${customMessage}`
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: updateData,
    })

    // Handle different status updates
    if (status === 'CONFIRMED') {
      // Parse time slot to get start and end times
      const [startTime] = booking.timeSlot.split('-')
      const [hours, minutes] = startTime.split(':').map(Number)
      
      const startDateTime = new Date(booking.date)
      startDateTime.setHours(hours, minutes || 0, 0, 0)
      
      // Assume 1-hour sessions
      const endDateTime = new Date(startDateTime)
      endDateTime.setHours(endDateTime.getHours() + 1)

      // Create Google Calendar event
      const calendarResult = await createCalendarEvent({
        summary: `${booking.serviceType.replace(/_/g, ' ')} - ${booking.clientName}`,
        description: `
Session with ${booking.clientName}
Email: ${booking.clientEmail}
Phone: ${booking.clientPhone || 'Not provided'}
Service: ${booking.serviceType.replace(/_/g, ' ')}

${booking.notes ? `Notes: ${booking.notes}` : ''}
        `.trim(),
        startDateTime,
        endDateTime,
        attendeeEmail: booking.clientEmail,
        attendeeName: booking.clientName,
        location: 'Online', // Update as needed
      })

      // Save calendar event ID to booking
      if (calendarResult.success && calendarResult.eventId) {
        await prisma.booking.update({
          where: { id },
          data: { calendarEventId: calendarResult.eventId },
        })
      }

      // Send confirmation email to client with custom message
      const emailHtml = generateBookingConfirmationEmail({
        clientName: booking.clientName,
        serviceType: booking.serviceType,
        date: booking.date,
        timeSlot: booking.timeSlot,
        customMessage,
        calendarLink: calendarResult.eventLink || undefined,
      })

      sendEmail({
        to: booking.clientEmail,
        subject: 'Booking Confirmed - Dr Denise Hill | Psych-Skills',
        html: emailHtml,
      }).catch(err => console.error('Confirmation email failed:', err))
    }

    if (status === 'DECLINED') {
      // Send decline email with custom message
      const emailHtml = generateBookingDeclinedEmail({
        clientName: booking.clientName,
        serviceType: booking.serviceType,
        date: booking.date,
        timeSlot: booking.timeSlot,
        customMessage: customMessage || 'Unfortunately, I am unable to accommodate your requested time slot.',
        proposedDate,
        proposedTime,
      })

      sendEmail({
        to: booking.clientEmail,
        subject: 'Booking Update - Dr Denise Hill | Psych-Skills',
        html: emailHtml,
      }).catch(err => console.error('Decline email failed:', err))
    }

    return NextResponse.json({ success: true, booking: updatedBooking })
  } catch (error) {
    console.error('Booking confirmation error:', error)
    return NextResponse.json(
      { error: 'Failed to update booking' },
      { status: 500 }
    )
  }
}

// Helper function to generate confirmation email with custom message
function generateBookingConfirmationEmail(params: {
  clientName: string
  serviceType: string
  date: Date
  timeSlot: string
  customMessage?: string
  calendarLink?: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #047857 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .info-box { background: white; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0; border-radius: 4px; }
          .message-box { background: #ecfdf5; padding: 20px; border-radius: 4px; margin: 20px 0; border: 1px solid #10b981; }
          .button { display: inline-block; padding: 12px 30px; background: #10b981; color: white; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          .signature { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">✅ Your Booking is Confirmed!</h1>
          </div>
          <div class="content">
            <p>Dear ${params.clientName},</p>
            
            <p>I'm pleased to confirm your booking with Psych-Skills.</p>
            
            <div class="info-box">
              <h3 style="color: #047857; margin-top: 0;">Confirmed Session Details</h3>
              <ul style="list-style: none; padding: 0;">
                <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #047857;">Service:</strong> ${params.serviceType.replace(/_/g, ' ')}</li>
                <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #047857;">Date:</strong> ${params.date.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
                <li style="padding: 8px 0;"><strong style="color: #047857;">Time:</strong> ${params.timeSlot}</li>
              </ul>
            </div>
            
            ${params.customMessage ? `
              <div class="message-box">
                <h3 style="color: #047857; margin-top: 0;">Message from Dr. Denise Hill:</h3>
                <p style="margin: 0; white-space: pre-wrap;">${params.customMessage}</p>
              </div>
            ` : ''}
            
            ${params.calendarLink ? `
              <div style="text-align: center; margin: 30px 0;">
                <a href="${params.calendarLink}" class="button">Add to Your Calendar</a>
              </div>
            ` : ''}
            
            <div class="signature">
              <p><strong>Looking forward to working with you,</strong></p>
              <p><strong>Dr. Denise Hill</strong><br/>
              Elite Sports Psychologist<br/>
              CASES-SEPAR Accredited<br/>
              Psych-Skills</p>
              <p style="color: #6b7280; font-size: 14px;">
                📧 info@psych-skills.co.uk<br/>
                🌐 www.psych-skills.co.uk
              </p>
            </div>
          </div>
          <div class="footer">
            <p>If you need to make any changes, please reply to this email.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

// Helper function to generate declined/alternative email
function generateBookingDeclinedEmail(params: {
  clientName: string
  serviceType: string
  date: Date
  timeSlot: string
  customMessage: string
  proposedDate?: string
  proposedTime?: string
}): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #047857 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .info-box { background: white; padding: 20px; border-left: 4px solid #f59e0b; margin: 20px 0; border-radius: 4px; }
          .message-box { background: #ecfdf5; padding: 20px; border-radius: 4px; margin: 20px 0; border: 1px solid #10b981; }
          .proposed-box { background: #fef3c7; padding: 20px; border-radius: 4px; margin: 20px 0; border: 1px solid #f59e0b; }
          .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
          .signature { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin: 0;">Booking Update</h1>
          </div>
          <div class="content">
            <p>Dear ${params.clientName},</p>
            
            <p>Thank you for your interest in booking a session with Psych-Skills.</p>
            
            <div class="info-box">
              <h3 style="color: #f59e0b; margin-top: 0;">Your Original Request</h3>
              <ul style="list-style: none; padding: 0;">
                <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #f59e0b;">Service:</strong> ${params.serviceType.replace(/_/g, ' ')}</li>
                <li style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong style="color: #f59e0b;">Requested Date:</strong> ${params.date.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
                <li style="padding: 8px 0;"><strong style="color: #f59e0b;">Requested Time:</strong> ${params.timeSlot}</li>
              </ul>
            </div>
            
            <div class="message-box">
              <h3 style="color: #047857; margin-top: 0;">Message from Dr. Denise Hill:</h3>
              <p style="margin: 0; white-space: pre-wrap;">${params.customMessage}</p>
            </div>
            
            ${params.proposedDate && params.proposedTime ? `
              <div class="proposed-box">
                <h3 style="color: #f59e0b; margin-top: 0;">Proposed Alternative Time</h3>
                <ul style="list-style: none; padding: 0;">
                  <li style="padding: 8px 0; border-bottom: 1px solid #fde68a;"><strong style="color: #f59e0b;">Date:</strong> ${new Date(params.proposedDate).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</li>
                  <li style="padding: 8px 0;"><strong style="color: #f59e0b;">Time:</strong> ${params.proposedTime}</li>
                </ul>
                <p style="margin: 10px 0 0 0;"><em>Please reply to this email if this alternative time works for you.</em></p>
              </div>
            ` : ''}
            
            <p>Please feel free to reply to this email to discuss alternative times that may work better, or to ask any questions you may have.</p>
            
            <div class="signature">
              <p><strong>Best regards,</strong></p>
              <p><strong>Dr. Denise Hill</strong><br/>
              Elite Sports Psychologist<br/>
              CASES-SEPAR Accredited<br/>
              Psych-Skills</p>
              <p style="color: #6b7280; font-size: 14px;">
                📧 info@psych-skills.co.uk<br/>
                🌐 www.psych-skills.co.uk
              </p>
            </div>
          </div>
          <div class="footer">
            <p>Reply to this email to continue the conversation.</p>
          </div>
        </div>
      </body>
    </html>
  `
}
