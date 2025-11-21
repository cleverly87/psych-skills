/**
 * Simple in-memory rate limiter
 * For production, consider Redis-based solution
 */

interface RateLimitEntry {
  count: number
  resetAt: number
  blocked?: boolean
  blockUntil?: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now && (!entry.blockUntil || entry.blockUntil < now)) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

export interface RateLimitConfig {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval: number // Max requests per interval
  blockAfterAttempts?: number // Block after X failed attempts
  blockDuration?: number // How long to block (ms)
}

// IP Whitelist - IPs that should never be blocked
const whitelist = new Set<string>()

export function rateLimit(config: RateLimitConfig) {
  return {
    check: (identifier: string): { success: boolean; limit: number; remaining: number; reset: number; blocked?: boolean } => {
      // Check whitelist first
      if (whitelist.has(identifier)) {
        return {
          success: true,
          limit: config.uniqueTokenPerInterval,
          remaining: config.uniqueTokenPerInterval,
          reset: Date.now() + config.interval,
        }
      }

      const now = Date.now()
      const key = identifier
      const entry = rateLimitStore.get(key)

      // Check if IP is blocked
      if (entry?.blocked && entry.blockUntil && entry.blockUntil > now) {
        console.log(`🚫 BLOCKED IP ATTEMPT: ${identifier} - Blocked until ${new Date(entry.blockUntil).toISOString()}`)
        return {
          success: false,
          limit: config.uniqueTokenPerInterval,
          remaining: 0,
          reset: entry.blockUntil,
          blocked: true,
        }
      }

      if (!entry || entry.resetAt < now) {
        // Create new entry
        const resetAt = now + config.interval
        rateLimitStore.set(key, { count: 1, resetAt })
        
        return {
          success: true,
          limit: config.uniqueTokenPerInterval,
          remaining: config.uniqueTokenPerInterval - 1,
          reset: resetAt,
        }
      }

      // Check if limit exceeded
      if (entry.count >= config.uniqueTokenPerInterval) {
        // Block IP after too many attempts
        if (config.blockAfterAttempts && entry.count >= config.blockAfterAttempts) {
          const blockUntil = now + (config.blockDuration || 60 * 60 * 1000) // Default 1 hour
          entry.blocked = true
          entry.blockUntil = blockUntil
          rateLimitStore.set(key, entry)
          
          console.log(`🚨 IP BLOCKED: ${identifier} - Too many failed attempts (${entry.count}). Blocked until ${new Date(blockUntil).toISOString()}`)
          
          return {
            success: false,
            limit: config.uniqueTokenPerInterval,
            remaining: 0,
            reset: blockUntil,
            blocked: true,
          }
        }

        return {
          success: false,
          limit: config.uniqueTokenPerInterval,
          remaining: 0,
          reset: entry.resetAt,
        }
      }

      // Increment count
      entry.count++
      rateLimitStore.set(key, entry)

      return {
        success: true,
        limit: config.uniqueTokenPerInterval,
        remaining: config.uniqueTokenPerInterval - entry.count,
        reset: entry.resetAt,
      }
    },
  }
}

// Login rate limiter: 5 attempts per 15 minutes, block for 1 hour after 10 attempts
export const loginRateLimiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 5,
  blockAfterAttempts: 10, // Block after 10 failed attempts total
  blockDuration: 60 * 60 * 1000, // Block for 1 hour
})

// Password reset: 3 attempts per hour per IP
export const passwordResetRateLimiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 3,
})

/**
 * Get all blocked IPs (for admin dashboard)
 */
export function getBlockedIPs(): Array<{ ip: string; blockedUntil: Date; attempts: number }> {
  const now = Date.now()
  const blocked: Array<{ ip: string; blockedUntil: Date; attempts: number }> = []
  
  for (const [ip, entry] of rateLimitStore.entries()) {
    if (entry.blocked && entry.blockUntil && entry.blockUntil > now) {
      blocked.push({
        ip,
        blockedUntil: new Date(entry.blockUntil),
        attempts: entry.count,
      })
    }
  }
  
  return blocked.sort((a, b) => b.blockedUntil.getTime() - a.blockedUntil.getTime())
}

/**
 * Manually unblock an IP (for admin use)
 */
export function unblockIP(ip: string): boolean {
  const entry = rateLimitStore.get(ip)
  if (entry?.blocked) {
    rateLimitStore.delete(ip)
    console.log(`✅ IP UNBLOCKED by admin: ${ip}`)
    return true
  }
  return false
}

/**
 * Get rate limit stats for all IPs
 */
export function getRateLimitStats(): Array<{ ip: string; attempts: number; resetAt: Date; blocked: boolean }> {
  const stats: Array<{ ip: string; attempts: number; resetAt: Date; blocked: boolean }> = []
  
  for (const [ip, entry] of rateLimitStore.entries()) {
    stats.push({
      ip,
      attempts: entry.count,
      resetAt: new Date(entry.resetAt),
      blocked: entry.blocked || false,
    })
  }
  
  return stats.sort((a, b) => b.attempts - a.attempts)
}

/**
 * Manually block an IP (for admin pre-emptive blocking)
 */
export function blockIP(ip: string, durationMs: number = 60 * 60 * 1000): void {
  const blockUntil = Date.now() + durationMs
  rateLimitStore.set(ip, {
    count: 10,
    resetAt: blockUntil,
    blocked: true,
    blockUntil,
  })
  console.log(`🚨 IP MANUALLY BLOCKED by admin: ${ip} - Blocked until ${new Date(blockUntil).toISOString()}`)
}

/**
 * Clear all rate limit data (reset all counters)
 */
export function clearAllRateLimits(): number {
  const count = rateLimitStore.size
  rateLimitStore.clear()
  console.log(`🧹 RATE LIMITS CLEARED by admin - ${count} entries removed`)
  return count
}

/**
 * Add IP to whitelist (will never be rate limited or blocked)
 */
export function addToWhitelist(ip: string): void {
  whitelist.add(ip)
  // Remove any existing blocks/limits
  rateLimitStore.delete(ip)
  console.log(`✅ IP WHITELISTED: ${ip}`)
}

/**
 * Remove IP from whitelist
 */
export function removeFromWhitelist(ip: string): boolean {
  const existed = whitelist.delete(ip)
  if (existed) {
    console.log(`❌ IP REMOVED FROM WHITELIST: ${ip}`)
  }
  return existed
}

/**
 * Check if IP is whitelisted
 */
export function isWhitelisted(ip: string): boolean {
  return whitelist.has(ip)
}

/**
 * Get all whitelisted IPs
 */
export function getWhitelist(): string[] {
  return Array.from(whitelist)
}
