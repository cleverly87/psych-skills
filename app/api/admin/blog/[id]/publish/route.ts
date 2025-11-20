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
    const { isPublished } = body

    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        isPublished,
        publishedAt: isPublished ? new Date() : null,
      },
    })

    return NextResponse.json(post)
  } catch (error) {
    console.error('Error toggling publish status:', error)
    return NextResponse.json(
      { error: 'Failed to toggle publish status' },
      { status: 500 }
    )
  }
}
