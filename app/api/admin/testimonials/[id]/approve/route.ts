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
    const { isApproved } = body

    const testimonial = await prisma.testimonial.update({
      where: { id: params.id },
      data: { isApproved },
    })

    return NextResponse.json(testimonial)
  } catch (error) {
    console.error('Error toggling approval:', error)
    return NextResponse.json(
      { error: 'Failed to toggle approval' },
      { status: 500 }
    )
  }
}
