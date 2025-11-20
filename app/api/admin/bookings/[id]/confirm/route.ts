import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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

    // TODO: Send confirmation email to client
    // await sendEmail({
    //   to: booking.clientEmail,
    //   subject: 'Booking Confirmed - Psych-Skills',
    //   text: `Your booking for ${booking.serviceType} on ${new Date(booking.date).toLocaleDateString()} at ${booking.timeSlot} has been confirmed.`
    // })

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error confirming booking:', error)
    return NextResponse.json(
      { error: 'Failed to confirm booking' },
      { status: 500 }
    )
  }
}
