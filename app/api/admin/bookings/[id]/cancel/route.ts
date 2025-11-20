import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
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
    const { reason } = body

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        status: 'CANCELLED',
        adminNotes: reason || 'Cancelled by admin',
      },
    })

    // TODO: Send cancellation email to client
    // await sendEmail({
    //   to: booking.clientEmail,
    //   subject: 'Booking Cancelled',
    //   text: `Your booking for ${booking.date} has been cancelled. ${reason ? `Reason: ${reason}` : ''}`,
    // })

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error cancelling booking:', error)
    return NextResponse.json(
      { error: 'Failed to cancel booking' },
      { status: 500 }
    )
  }
}
