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
    const { alternativeDate, alternativeTime, message } = body

    if (!alternativeDate || !alternativeTime) {
      return NextResponse.json(
        { error: 'Alternative date and time are required' },
        { status: 400 }
      )
    }

    const booking = await prisma.booking.update({
      where: { id: params.id },
      data: {
        adminNotes: `Alternative proposed: ${alternativeDate} at ${alternativeTime}. ${message || ''}`,
      },
    })

    // TODO: Send alternative proposal email to client
    // await sendEmail({
    //   to: booking.clientEmail,
    //   subject: 'Alternative Time Proposed - Psych-Skills',
    //   text: `Regarding your booking for ${booking.serviceType}, we'd like to propose an alternative time: ${alternativeDate} at ${alternativeTime}. ${message || ''} Please reply to confirm if this works for you.`
    // })

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error proposing alternative:', error)
    return NextResponse.json(
      { error: 'Failed to propose alternative' },
      { status: 500 }
    )
  }
}
