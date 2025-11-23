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
    const { status } = body

    // Get the booking
    const booking = await prisma.booking.findUnique({
      where: { id },
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    // Update booking status
    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
    })

    // If booking is confirmed, send confirmation email and create calendar event
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

      // Send confirmation email to client
      const clientEmailTemplate = emailTemplates.bookingConfirmed({
        clientName: booking.clientName,
        clientEmail: booking.clientEmail,
        serviceType: booking.serviceType,
        date: booking.date,
        timeSlot: booking.timeSlot,
        notes: booking.notes || undefined,
        calendarLink: calendarResult.eventLink,
      })

      sendEmail({
        to: booking.clientEmail,
        subject: clientEmailTemplate.subject,
        html: clientEmailTemplate.html,
      }).catch(err => console.error('Confirmation email failed:', err))
    }

    return NextResponse.json({ success: true, booking: updatedBooking })
  } catch (error) {
    console.error('Booking confirmation error:', error)
    return NextResponse.json(
      { error: 'Failed to confirm booking' },
      { status: 500 }
    )
  }
}
