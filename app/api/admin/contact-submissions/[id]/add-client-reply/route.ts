import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// POST - Add client reply manually (from email they sent)
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message } = await req.json()

    if (!message || message.trim() === '') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Get the contact submission
    const submission = await prisma.contactSubmission.findUnique({
      where: { id: params.id },
    })

    if (!submission) {
      return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
    }

    // Create reply record as client reply
    const reply = await prisma.contactReply.create({
      data: {
        contactSubmissionId: params.id,
        message: message.trim(),
        sentBy: 'client',
        senderEmail: submission.email,
        senderName: submission.name,
      },
    })

    // Update submission timestamp
    await prisma.contactSubmission.update({
      where: { id: params.id },
      data: { updatedAt: new Date() },
    })

    // Return updated submission with all replies
    const updatedSubmission = await prisma.contactSubmission.findUnique({
      where: { id: params.id },
      include: {
        replies: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    return NextResponse.json(updatedSubmission)
  } catch (error) {
    console.error('Error adding client reply:', error)
    return NextResponse.json(
      { error: 'Failed to add client reply' },
      { status: 500 }
    )
  }
}
