import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'

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

    // Send confirmation email to client
    await sendEmail({
      to: email,
      subject: 'Booking Confirmation - Psych-Skills',
      html: `
        <h2>Thank you for booking with Psych-Skills!</h2>
        <p>Dear ${name},</p>
        <p>Your session has been successfully booked. Here are the details:</p>
        <ul>
          <li><strong>Service:</strong> ${serviceType.replace('_', ' ')}</li>
          <li><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-GB', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</li>
          <li><strong>Time:</strong> ${timeSlot}</li>
        </ul>
        <p><strong>Important:</strong> No payment is required at this time. Payment details will be provided separately before your session.</p>
        <p>Dr. Denise Hill will confirm your booking shortly and may reach out if she has any questions.</p>
        <p>We look forward to working with you!</p>
        <p>Best regards,<br/>The Psych-Skills Team</p>
      `,
    })

    // Send notification email to admin
    await sendEmail({
      to: process.env.ADMIN_EMAIL || 'admin@psych-skills.com',
      subject: `New Booking: ${name} - ${new Date(date).toLocaleDateString()}`,
      html: `
        <h2>New Booking Received</h2>
        <ul>
          <li><strong>Client:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone || 'Not provided'}</li>
          <li><strong>Service:</strong> ${serviceType.replace('_', ' ')}</li>
          <li><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-GB', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</li>
          <li><strong>Time:</strong> ${timeSlot}</li>
          <li><strong>Notes:</strong> ${notes || 'None'}</li>
        </ul>
        <p>Log in to the admin dashboard to confirm or manage this booking.</p>
      `,
    })

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
