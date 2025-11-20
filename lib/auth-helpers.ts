import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { NextResponse } from 'next/server'

/**
 * Verify the user is authenticated and has admin role
 * Returns session if valid, or NextResponse with 401 error
 */
export async function requireAuth() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return { 
      error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) 
    }
  }

  // Check if user has admin role
  if (session.user?.role !== 'ADMIN' && session.user?.role !== 'OWNER') {
    return { 
      error: NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 }) 
    }
  }

  return { session }
}
