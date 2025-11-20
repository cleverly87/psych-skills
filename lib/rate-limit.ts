/**
 * Simple in-memory rate limiter
 * For production, consider Redis-based solution
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

export interface RateLimitConfig {
  interval: number // Time window in milliseconds
  uniqueTokenPerInterval: number // Max requests per interval
}

export function rateLimit(config: RateLimitConfig) {
  return {
    check: (identifier: string): { success: boolean; limit: number; remaining: number; reset: number } => {
      const now = Date.now()
      const key = identifier
      const entry = rateLimitStore.get(key)

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

// Login rate limiter: 5 attempts per 15 minutes per IP
export const loginRateLimiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 5,
})

// Password reset: 3 attempts per hour per IP
export const passwordResetRateLimiter = rateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 3,
})
