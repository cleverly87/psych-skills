'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Shield, Unlock, AlertTriangle, Activity, Ban, Trash2, Plus, X } from 'lucide-react'

interface BlockedIP {
  ip: string
  blockedUntil: string
  attempts: number
}

interface RateLimitStat {
  ip: string
  attempts: number
  resetAt: string
  blocked: boolean
}

export default function SecurityPage() {
  const [blockedIPs, setBlockedIPs] = useState<BlockedIP[]>([])
  const [stats, setStats] = useState<RateLimitStat[]>([])
  const [whitelist, setWhitelist] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  const [newBlockIP, setNewBlockIP] = useState('')
  const [blockDuration, setBlockDuration] = useState('1')
  const [newWhitelistIP, setNewWhitelistIP] = useState('')

  const fetchData = async () => {
    try {
      const response = await fetch('/api/admin/security')
      if (response.ok) {
        const data = await response.json()
        setBlockedIPs(data.blockedIPs)
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch security data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleUnblock = async (ip: string) => {
    try {
      const response = await fetch('/api/admin/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unblock', ip }),
      })

      if (response.ok) {
        setMessage({ text: `IP ${ip} has been unblocked`, type: 'success' })
        fetchData()
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ text: 'Failed to unblock IP', type: 'error' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ text: 'Failed to unblock IP', type: 'error' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleBlockIP = async () => {
    if (!newBlockIP) return
    
    try {
      const response = await fetch('/api/admin/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'block', ip: newBlockIP, duration: blockDuration }),
      })

      if (response.ok) {
        setMessage({ text: `IP ${newBlockIP} has been blocked for ${blockDuration} hour(s)`, type: 'success' })
        setNewBlockIP('')
        fetchData()
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ text: 'Failed to block IP', type: 'error' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ text: 'Failed to block IP', type: 'error' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear all rate limits? This will reset all login attempt counters.')) {
      return
    }

    try {
      const response = await fetch('/api/admin/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'clear-all' }),
      })

      if (response.ok) {
        const data = await response.json()
        setMessage({ text: data.message, type: 'success' })
        fetchData()
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ text: 'Failed to clear rate limits', type: 'error' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ text: 'Failed to clear rate limits', type: 'error' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleAddToWhitelist = async () => {
    if (!newWhitelistIP) return

    try {
      const response = await fetch('/api/admin/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'whitelist-add', ip: newWhitelistIP }),
      })

      if (response.ok) {
        setMessage({ text: `IP ${newWhitelistIP} added to whitelist`, type: 'success' })
        setNewWhitelistIP('')
        fetchData()
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ text: 'Failed to add IP to whitelist', type: 'error' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ text: 'Failed to add IP to whitelist', type: 'error' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  const handleRemoveFromWhitelist = async (ip: string) => {
    try {
      const response = await fetch('/api/admin/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'whitelist-remove', ip }),
      })

      if (response.ok) {
        setMessage({ text: `IP ${ip} removed from whitelist`, type: 'success' })
        fetchData()
        setTimeout(() => setMessage(null), 3000)
      } else {
        setMessage({ text: 'Failed to remove IP from whitelist', type: 'error' })
        setTimeout(() => setMessage(null), 3000)
      }
    } catch (error) {
      setMessage({ text: 'Failed to remove IP from whitelist', type: 'error' })
      setTimeout(() => setMessage(null), 3000)
    }
  }

  if (loading) {
    return <div className="p-8">Loading security data...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Security Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Monitor login attempts and manage blocked IP addresses
        </p>
      </div>

      {/* Message Display */}
      {message && (
        <div
          className={`p-4 rounded-md ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Blocked IPs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Blocked IP Addresses
              </CardTitle>
              <CardDescription>
                IPs automatically blocked after 10 failed login attempts (1 hour ban)
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Clear All Limits
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Manual Block Section */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Ban className="h-4 w-4" />
              Manually Block an IP
            </h4>
            <div className="flex gap-2">
              <Input
                placeholder="Enter IP address (e.g., 192.168.1.1)"
                value={newBlockIP}
                onChange={(e) => setNewBlockIP(e.target.value)}
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="Hours"
                value={blockDuration}
                onChange={(e) => setBlockDuration(e.target.value)}
                className="w-24"
                min="1"
                max="168"
              />
              <Button onClick={handleBlockIP} className="flex items-center gap-2">
                <Ban className="h-4 w-4" />
                Block
              </Button>
            </div>
          </div>

          {/* Blocked IPs List */}
          {blockedIPs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No IPs currently blocked</p>
          ) : (
            <div className="space-y-3">
              {blockedIPs.map((item) => (
                <div
                  key={item.ip}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-mono font-semibold">{item.ip}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.attempts} failed attempts • Blocked until{' '}
                      {new Date(item.blockedUntil).toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnblock(item.ip)}
                    className="flex items-center gap-2"
                  >
                    <Unlock className="h-4 w-4" />
                    Unblock
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* IP Whitelist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-600" />
            IP Whitelist
          </CardTitle>
          <CardDescription>
            Whitelisted IPs will never be rate limited or blocked
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add to Whitelist */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add IP to Whitelist
            </h4>
            <div className="flex gap-2">
              <Input
                placeholder="Enter IP address (e.g., 192.168.1.1)"
                value={newWhitelistIP}
                onChange={(e) => setNewWhitelistIP(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleAddToWhitelist} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>
          </div>

          {/* Whitelist */}
          {whitelist.length === 0 ? (
            <p className="text-sm text-muted-foreground">No IPs whitelisted</p>
          ) : (
            <div className="space-y-3">
              {whitelist.map((ip) => (
                <div
                  key={ip}
                  className="flex items-center justify-between p-4 border rounded-lg border-green-200 bg-green-50/50"
                >
                  <p className="font-mono font-semibold text-green-900">{ip}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveFromWhitelist(ip)}
                    className="flex items-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rate Limit Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Login Activity
          </CardTitle>
          <CardDescription>
            All IPs with login attempts in the last 15 minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {stats.map((item) => (
                <div
                  key={item.ip}
                  className={`flex items-center justify-between p-3 border rounded-lg ${
                    item.blocked ? 'border-destructive bg-destructive/5' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.blocked && <AlertTriangle className="h-4 w-4 text-destructive" />}
                    <div>
                      <p className="font-mono text-sm font-medium">{item.ip}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.attempts} attempts • Resets at {new Date(item.resetAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-xs font-medium ${
                        item.blocked
                          ? 'text-destructive'
                          : item.attempts >= 3
                          ? 'text-orange-500'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {item.blocked ? 'BLOCKED' : `${5 - item.attempts} attempts left`}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
