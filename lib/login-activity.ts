/**
 * Login Activity Tracker
 * Tracks successful and failed login attempts for security audit
 */

interface LoginAttempt {
  ip: string
  email: string
  success: boolean
  timestamp: Date
  userAgent?: string
}

// In-memory store (last 100 login attempts)
// For production, store in database
const loginHistory: LoginAttempt[] = []
const MAX_HISTORY = 100

/**
 * Log a login attempt (success or failure)
 */
export function logLoginAttempt(
  ip: string,
  email: string,
  success: boolean,
  userAgent?: string
): void {
  const attempt: LoginAttempt = {
    ip,
    email,
    success,
    timestamp: new Date(),
    userAgent,
  }

  loginHistory.unshift(attempt) // Add to beginning

  // Keep only last 100 entries
  if (loginHistory.length > MAX_HISTORY) {
    loginHistory.pop()
  }

  const emoji = success ? '✅' : '❌'
  console.log(`${emoji} LOGIN ${success ? 'SUCCESS' : 'FAILED'}: ${email} from ${ip}`)
}

/**
 * Get recent login attempts (for admin dashboard)
 */
export function getRecentLoginAttempts(limit: number = 50): LoginAttempt[] {
  return loginHistory.slice(0, limit)
}

/**
 * Get login attempts by IP
 */
export function getLoginAttemptsByIP(ip: string): LoginAttempt[] {
  return loginHistory.filter(attempt => attempt.ip === ip)
}

/**
 * Get login attempts by email
 */
export function getLoginAttemptsByEmail(email: string): LoginAttempt[] {
  return loginHistory.filter(attempt => attempt.email === email)
}

/**
 * Get failed login attempts in the last N minutes
 */
export function getRecentFailedAttempts(minutesAgo: number = 15): LoginAttempt[] {
  const cutoff = new Date(Date.now() - minutesAgo * 60 * 1000)
  return loginHistory.filter(
    attempt => !attempt.success && attempt.timestamp >= cutoff
  )
}

/**
 * Get successful logins in the last N minutes
 */
export function getRecentSuccessfulLogins(minutesAgo: number = 60): LoginAttempt[] {
  const cutoff = new Date(Date.now() - minutesAgo * 60 * 1000)
  return loginHistory.filter(
    attempt => attempt.success && attempt.timestamp >= cutoff
  )
}

/**
 * Get login statistics
 */
export function getLoginStats(): {
  totalAttempts: number
  successfulLogins: number
  failedAttempts: number
  uniqueIPs: number
  lastSuccessfulLogin?: Date
  lastFailedAttempt?: Date
} {
  const successful = loginHistory.filter(a => a.success)
  const failed = loginHistory.filter(a => !a.success)
  const uniqueIPs = new Set(loginHistory.map(a => a.ip))

  return {
    totalAttempts: loginHistory.length,
    successfulLogins: successful.length,
    failedAttempts: failed.length,
    uniqueIPs: uniqueIPs.size,
    lastSuccessfulLogin: successful[0]?.timestamp,
    lastFailedAttempt: failed[0]?.timestamp,
  }
}
