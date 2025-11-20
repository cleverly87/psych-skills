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

    const body = await request.json()
    const { message } = body

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: 'DECLINED',
        adminNotes: message || 'Booking declined by admin',
      },
    })

    // TODO: Send decline email to client
    // await sendEmail({
    //   to: booking.clientEmail,
    //   subject: 'Booking Update - Psych-Skills',
    //   text: `Unfortunately, we cannot accommodate your booking request for ${booking.serviceType} on ${new Date(booking.date).toLocaleDateString()}. ${message || ''}`
    // })

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error declining booking:', error)
    return NextResponse.json(
      { error: 'Failed to decline booking' },
      { status: 500 }
    )
  }
}
