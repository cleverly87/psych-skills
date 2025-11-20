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
        status: 'COMPLETED',
      },
    })

    return NextResponse.json(booking)
  } catch (error) {
    console.error('Error marking booking as complete:', error)
    return NextResponse.json(
      { error: 'Failed to mark booking as complete' },
      { status: 500 }
    )
  }
}
