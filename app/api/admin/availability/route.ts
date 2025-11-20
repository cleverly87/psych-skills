import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [blockedDates, workingHours] = await Promise.all([
      prisma.blockedDate.findMany({
        orderBy: { date: 'asc' },
      }),
      prisma.availability.findMany({
        orderBy: { dayOfWeek: 'asc' },
      }),
    ])

    return NextResponse.json({ blockedDates, workingHours })
  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    )
  }
}
