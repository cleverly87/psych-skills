import { NextRequest, NextResponse } from 'next/server'
import { monitorInboxForReplies } from '@/lib/email-monitor'

/**
 * Cron job endpoint to monitor inbox for client email replies
 * 
 * Set up a cron job to call this endpoint every 5 minutes:
 * - Vercel Cron: Add to vercel.json
 * - Manual: Use a service like cron-job.org to ping this URL
 * 
 * URL: https://www.psych-skills.co.uk/api/cron/monitor-emails
 */
export async function GET(req: NextRequest) {
  try {
    // Verify the request is from a cron service (optional security)
    const authHeader = req.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔄 Starting email monitoring cron job...')
    
    const result = await monitorInboxForReplies()
    
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      ...result
    })
  } catch (error) {
    console.error('Cron job error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    )
  }
}

// Allow GET requests without authentication for development
export const dynamic = 'force-dynamic'
