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

    // Try to send confirmation email to client (non-blocking)
    sendEmail({
      to: email,
      subject: 'Booking Request Received - Psych-Skills',
      html: `
        <h2>Thank you for your booking request!</h2>
        <p>Dear ${name},</p>
        <p>We have received your session booking request. Here are the details:</p>
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
        <p><strong>Next Steps:</strong></p>
        <p>Dr. Denise Hill will review your request and confirm your booking within 24-48 hours. You will receive a confirmation email once your session is approved.</p>
        <p><strong>Note:</strong> No payment is required at this time. Payment details will be provided after your booking is confirmed.</p>
        <p>If you have any questions, please don't hesitate to reach out.</p>
        <p>Best regards,<br/>Dr. Denise Hill<br/>Psych-Skills</p>
      `,
    }).catch(err => console.error('Client email failed:', err))

    // Try to send notification email to admin (non-blocking)
    sendEmail({
      to: process.env.ADMIN_EMAIL || 'info@psych-skills.com',
      subject: `🔔 New Booking Request: ${name} - ${new Date(date).toLocaleDateString('en-GB')}`,
      html: `
        <h2>New Booking Request Received</h2>
        <p><strong>Action Required:</strong> Please review and confirm this booking in the admin dashboard.</p>
        <hr/>
        <h3>Client Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone || 'Not provided'}</li>
        </ul>
        <h3>Session Details:</h3>
        <ul>
          <li><strong>Service:</strong> ${serviceType.replace('_', ' ')}</li>
          <li><strong>Date:</strong> ${new Date(date).toLocaleDateString('en-GB', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</li>
          <li><strong>Time:</strong> ${timeSlot}</li>
          <li><strong>Status:</strong> PENDING</li>
        </ul>
        ${notes ? `<h3>Client Notes:</h3><p>${notes}</p>` : ''}
        <hr/>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/bookings" style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View in Admin Dashboard</a></p>
      `,
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
