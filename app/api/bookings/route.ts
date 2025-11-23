import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { emailTemplates } from '@/lib/email-templates'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, phone, serviceType, date, timeSlot, notes } = body

    // Validate required fields
    if (!name || !email || !serviceType || !date || !timeSlot) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create the booking
    const booking = await prisma.booking.create({
      data: {
        clientName: name,
        clientEmail: email,
        clientPhone: phone || null,
        serviceType,
        date: new Date(date),
        timeSlot,
        notes: notes || null,
        status: 'PENDING',
        paymentStatus: 'UNPAID',
      },
    })

    // Try to send confirmation email to client (non-blocking)
    const clientEmailTemplate = emailTemplates.bookingRequestReceived({
      clientName: name,
      clientEmail: email,
      serviceType,
      date: new Date(date),
      timeSlot,
      notes,
    })
    
    sendEmail({
      to: email,
      subject: clientEmailTemplate.subject,
      html: clientEmailTemplate.html,
    }).catch(err => console.error('Client email failed:', err))

    // Try to send notification email to admin (non-blocking)
    const adminEmailTemplate = emailTemplates.bookingRequestNotification({
      clientName: name,
      clientEmail: email,
      serviceType,
      date: new Date(date),
      timeSlot,
      notes,
    })
    
    sendEmail({
      to: process.env.ADMIN_EMAIL || 'info@psych-skills.co.uk',
      subject: adminEmailTemplate.subject,
      html: adminEmailTemplate.html,
    }).catch(err => console.error('Admin email failed:', err))

    return NextResponse.json({ success: true, booking }, { status: 201 })
  } catch (error) {
    console.error('Booking error:', error)
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const date = searchParams.get('date')

    if (date) {
      // Get bookings for a specific date
      const bookings = await prisma.booking.findMany({
        where: {
          date: new Date(date),
          status: {
            not: 'CANCELLED',
          },
        },
        select: {
          timeSlot: true,
        },
      })

      return NextResponse.json({ bookings })
    }

    // Get all upcoming bookings (for admin)
    const bookings = await prisma.booking.findMany({
      where: {
        date: {
          gte: new Date(),
        },
      },
      orderBy: {
        date: 'asc',
      },
    })

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Fetch bookings error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}
