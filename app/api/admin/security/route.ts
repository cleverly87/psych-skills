import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  getBlockedIPs,
  getRateLimitStats,
  unblockIP,
  blockIP,
  clearAllRateLimits,
  addToWhitelist,
  removeFromWhitelist,
  getWhitelist,
} from '@/lib/rate-limit'
import { getRecentLoginAttempts, getLoginStats } from '@/lib/login-activity'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'OWNER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const blockedIPs = getBlockedIPs()
    const allStats = getRateLimitStats()
    const whitelist = getWhitelist()
    const loginActivity = getRecentLoginAttempts(50)
    const loginStats = getLoginStats()

    return NextResponse.json({
      blockedIPs,
      stats: allStats,
      whitelist,
      loginActivity,
      loginStats,
    })
  } catch (error) {
    console.error('Failed to get security stats:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || (session.user?.role !== 'ADMIN' && session.user?.role !== 'OWNER')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, ip, duration } = await request.json()

    if (action === 'unblock' && ip) {
      const success = unblockIP(ip)
      if (success) {
        return NextResponse.json({ message: 'IP unblocked successfully' })
      }
      return NextResponse.json({ error: 'IP not found or not blocked' }, { status: 404 })
    }

    if (action === 'block' && ip) {
      const durationMs = duration ? parseInt(duration) * 60 * 60 * 1000 : 60 * 60 * 1000 // hours to ms
      blockIP(ip, durationMs)
      return NextResponse.json({ message: 'IP blocked successfully' })
    }

    if (action === 'clear-all') {
      const count = clearAllRateLimits()
      return NextResponse.json({ message: `Cleared ${count} rate limit entries` })
    }

    if (action === 'whitelist-add' && ip) {
      addToWhitelist(ip)
      return NextResponse.json({ message: 'IP added to whitelist' })
    }

    if (action === 'whitelist-remove' && ip) {
      const success = removeFromWhitelist(ip)
      if (success) {
        return NextResponse.json({ message: 'IP removed from whitelist' })
      }
      return NextResponse.json({ error: 'IP not found in whitelist' }, { status: 404 })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Failed to process security action:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}
