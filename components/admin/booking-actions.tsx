'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Clock3 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export function BookingActions({ bookingId, onUpdate }: { bookingId: string; onUpdate?: () => void }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [alternativeDate, setAlternativeDate] = useState('')
  const [alternativeTime, setAlternativeTime] = useState('')
  const [message, setMessage] = useState('')
  const [cancelReason, setCancelReason] = useState('')

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/confirm`, {
        method: 'POST',
      })
      if (res.ok) {
        if (onUpdate) {
          onUpdate()
        } else {
          router.refresh()
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDecline = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/decline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })
      if (res.ok) {
        if (onUpdate) {
          onUpdate()
        } else {
          router.refresh()
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: cancelReason }),
      })
      if (res.ok) {
        if (onUpdate) {
          onUpdate()
        } else {
          router.refresh()
        }
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleProposeAlternative = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/propose-alternative`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alternativeDate,
          alternativeTime,
          message,
        }),
      })
      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Button
        onClick={handleConfirm}
        disabled={isLoading}
        className="bg-emerald-600 hover:bg-emerald-500"
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Confirm
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" disabled={isLoading}>
            <XCircle className="h-4 w-4 mr-2" />
            Decline
          </Button>
        </DialogTrigger>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Decline Booking</DialogTitle>
            <DialogDescription>
              Please provide a reason for declining this booking. The client will receive an email with your message.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="decline-message">Message (Required)</Label>
              <Textarea
                id="decline-message"
                placeholder="I apologize, but I'm unavailable at this time..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogTrigger asChild>
              <Button variant="outline" type="button">
                Back
              </Button>
            </DialogTrigger>
            <Button 
              variant="destructive" 
              onClick={handleDecline} 
              disabled={isLoading || !message.trim()}
            >
              Decline Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="secondary" disabled={isLoading}>
            <Clock3 className="h-4 w-4 mr-2" />
            Propose Alternative
          </Button>
        </DialogTrigger>
        <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Propose Alternative Time</DialogTitle>
            <DialogDescription>
              Suggest an alternative date and time for this booking. The client will receive an email with your proposal.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="alt-date">Alternative Date (Required)</Label>
                <Input
                  id="alt-date"
                  type="date"
                  value={alternativeDate}
                  onChange={(e) => setAlternativeDate(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alt-time">Alternative Time (Required)</Label>
                <Input
                  id="alt-time"
                  type="time"
                  value={alternativeTime}
                  onChange={(e) => setAlternativeTime(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="alt-message">Message (Required)</Label>
              <Textarea
                id="alt-message"
                placeholder="I'm unavailable at your requested time, but I have availability at..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogTrigger asChild>
              <Button variant="outline" type="button">
                Back
              </Button>
            </DialogTrigger>
            <Button 
              onClick={handleProposeAlternative} 
              disabled={isLoading || !alternativeDate || !alternativeTime || !message.trim()}
            >
              Send Proposal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
