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

    const { direction } = await request.json()
    const testimonialId = params.id

    if (!direction || (direction !== 'up' && direction !== 'down')) {
      return NextResponse.json(
        { error: 'Invalid direction. Must be "up" or "down"' },
        { status: 400 }
      )
    }

    // Get current testimonial
    const currentTestimonial = await prisma.testimonial.findUnique({
      where: { id: testimonialId }
    })

    if (!currentTestimonial) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      )
    }

    // Get all testimonials ordered by displayOrder
    const allTestimonials = await prisma.testimonial.findMany({
      orderBy: { displayOrder: 'asc' }
    })

    const currentIndex = allTestimonials.findIndex((t: any) => t.id === testimonialId)
    
    if (currentIndex === -1) {
      return NextResponse.json(
        { error: 'Testimonial not found in list' },
        { status: 404 }
      )
    }

    // Check if we can move in the requested direction
    if (direction === 'up' && currentIndex === 0) {
      return NextResponse.json(
        { error: 'Already at the top' },
        { status: 400 }
      )
    }

    if (direction === 'down' && currentIndex === allTestimonials.length - 1) {
      return NextResponse.json(
        { error: 'Already at the bottom' },
        { status: 400 }
      )
    }

    // Swap display orders
    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    const swapTestimonial = allTestimonials[swapIndex]

    const currentOrder = currentTestimonial.displayOrder
    const swapOrder = swapTestimonial.displayOrder

    // Update both testimonials
    await prisma.$transaction([
      prisma.testimonial.update({
        where: { id: testimonialId },
        data: { displayOrder: swapOrder }
      }),
      prisma.testimonial.update({
        where: { id: swapTestimonial.id },
        data: { displayOrder: currentOrder }
      })
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error reordering testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to reorder testimonial' },
      { status: 500 }
    )
  }
}
