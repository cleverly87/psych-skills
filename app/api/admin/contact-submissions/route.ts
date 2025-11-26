import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const archived = searchParams.get('archived') === 'true'

    const submissions = await prisma.contactSubmission.findMany({
      where: {
        isArchived: archived,
      },
      include: {
        replies: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1, // Just get the latest reply for preview
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return NextResponse.json(submissions)
  } catch (error) {
    console.error('Error fetching contact submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact submissions' },
      { status: 500 }
    )
  }
}
