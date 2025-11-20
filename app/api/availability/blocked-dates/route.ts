import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const blockedDates = await prisma.blockedDate.findMany({
      where: {
        date: {
          gte: new Date(), // Only future blocked dates
        },
      },
      select: {
        date: true,
      },
    })

    return NextResponse.json(blockedDates)
  } catch (error) {
    console.error('Error fetching blocked dates:', error)
    return NextResponse.json([], { status: 500 })
  }
}
