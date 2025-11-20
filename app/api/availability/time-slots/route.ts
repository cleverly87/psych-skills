import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dayOfWeek = parseInt(searchParams.get('dayOfWeek') || '0')
    const dateStr = searchParams.get('date')

    if (isNaN(dayOfWeek) || !dateStr) {
      return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
    }

    // Check if this date is blocked
    const selectedDate = new Date(dateStr)
    const isBlocked = await prisma.blockedDate.findFirst({
      where: {
        date: {
          gte: new Date(selectedDate.setHours(0, 0, 0, 0)),
          lt: new Date(selectedDate.setHours(23, 59, 59, 999)),
        },
      },
    })

    if (isBlocked) {
      return NextResponse.json([])
    }

    // Get availability for this day of week
    const availability = await prisma.availability.findFirst({
      where: {
        dayOfWeek,
        isActive: true,
      },
    })

    if (!availability || !availability.availableHours) {
      return NextResponse.json([])
    }

    // Convert available hours to time slots
    const availableHours = availability.availableHours as number[]
    const timeSlots = availableHours
      .sort((a, b) => a - b)
      .map(hour => `${hour.toString().padStart(2, '0')}:00`)

    return NextResponse.json(timeSlots)
  } catch (error) {
    console.error('Error fetching time slots:', error)
    return NextResponse.json({ error: 'Failed to fetch time slots' }, { status: 500 })
  }
}
