import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { generateCalendarInvite } from '@/lib/calendar'
import { bookingConfirmedEmail } from '@/lib/email-templates'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: 'CONFIRMED',
      },
    })

    // Generate calendar invite
    const calendarInvite = generateCalendarInvite({
      clientName: booking.clientName,
      clientEmail: booking.clientEmail,
      clientPhone: booking.clientPhone || 'Not provided',
      serviceType: booking.serviceType,
      date: booking.date,
      timeSlot: booking.timeSlot,
      message: booking.message || undefined
    })

    // Send confirmation email with calendar invite to client
    await sendEmail({
      to: booking.clientEmail,
      subject: 'Session Confirmed - Psych Skills',
      html: bookingConfirmedEmail({
        clientName: booking.clientName,
        serviceType: booking.serviceType,
        date: new Date(booking.date).toLocaleDateString('en-GB', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        timeSlot: booking.timeSlot
      }),
      attachments: [
        {
          filename: 'session-appointment.ics',
          content: calendarInvite,
          contentType: 'text/calendar'
        }
      ]
    })

    // Send calendar invite to Dr. Hill's calendar
    await sendEmail({
      to: 'info@psych-skills.co.uk',
      subject: `New Session Booked: ${booking.clientName} - ${new Date(booking.date).toLocaleDateString('en-GB')}`,
      html: `
        <p>A new session has been confirmed:</p>
        <ul>
          <li><strong>Client:</strong> ${booking.clientName}</li>
          <li><strong>Email:</strong> ${booking.clientEmail}</li>
          <li><strong>Phone:</strong> ${booking.clientPhone}</li>
          <li><strong>Service:</strong> ${booking.serviceType}</li>
          <li><strong>Date:</strong> ${new Date(booking.date).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</li>
          <li><strong>Time:</strong> ${booking.timeSlot}</li>
        </ul>
        <p>The calendar invite is attached. Click it to add to your calendar.</p>
      `,
      attachments: [
        {
          filename: 'session-appointment.ics',
          content: calendarInvite,
          contentType: 'text/calendar'
        }
      ]
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error confirming booking:', error)
    return NextResponse.json(
      { error: 'Failed to confirm booking' },
      { status: 500 }
    )
  }
}
