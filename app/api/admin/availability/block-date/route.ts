import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { date, reason } = body

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 })
    }

    const blocked = await prisma.blockedDate.create({
      data: {
        date: new Date(date),
        reason: reason || null,
      },
    })

    return NextResponse.json(blocked)
  } catch (error) {
    console.error('Error blocking date:', error)
    return NextResponse.json(
      { error: 'Failed to block date' },
      { status: 500 }
    )
  }
}
