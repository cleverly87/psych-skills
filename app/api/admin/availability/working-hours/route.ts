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
    const { availability } = body

    // Delete all existing working hours
    await prisma.availability.deleteMany({})

    // Create new working hours with available hour blocks
    const created = await Promise.all(
      availability.map((day: { dayOfWeek: number; availableHours: number[] }) =>
        prisma.availability.create({
          data: {
            dayOfWeek: day.dayOfWeek,
            availableHours: day.availableHours,
            isActive: day.availableHours.length > 0,
          },
        })
      )
    )

    return NextResponse.json(created)
  } catch (error) {
    console.error('Error saving working hours:', error)
    return NextResponse.json(
      { error: 'Failed to save working hours' },
      { status: 500 }
    )
  }
}
