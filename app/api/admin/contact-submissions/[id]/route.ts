import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET single contact submission with replies
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const submission = await prisma.contactSubmission.findUnique({
      where: { id: params.id },
      include: {
        replies: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    })

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    return NextResponse.json(submission)
  } catch (error) {
    console.error('Error fetching contact submission:', error)
    return NextResponse.json(
      { error: 'Failed to fetch contact submission' },
      { status: 500 }
    )
  }
}

// DELETE contact submission (only if archived)
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if archived before deleting
    const submission = await prisma.contactSubmission.findUnique({
      where: { id: params.id },
    })

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    if (!submission.isArchived) {
      return NextResponse.json(
        { error: 'Can only delete archived submissions. Please archive first.' },
        { status: 400 }
      )
    }

    // Delete submission (cascades to replies)
    await prisma.contactSubmission.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting contact submission:', error)
    return NextResponse.json(
      { error: 'Failed to delete contact submission' },
      { status: 500 }
    )
  }
}

// PATCH - Archive/Unarchive contact submission
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { isArchived } = await req.json()

    const submission = await prisma.contactSubmission.update({
      where: { id: params.id },
      data: {
        isArchived,
        status: isArchived ? 'ARCHIVED' : 'ACTIVE',
      },
    })

    return NextResponse.json(submission)
  } catch (error) {
    console.error('Error updating contact submission:', error)
    return NextResponse.json(
      { error: 'Failed to update contact submission' },
      { status: 500 }
    )
  }
}
