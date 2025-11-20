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

export function BookingActions({ bookingId }: { bookingId: string }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [alternativeDate, setAlternativeDate] = useState('')
  const [alternativeTime, setAlternativeTime] = useState('')
  const [message, setMessage] = useState('')

  const handleConfirm = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/confirm`, {
        method: 'POST',
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

  const handleDecline = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`/api/admin/bookings/${bookingId}/decline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline Booking</DialogTitle>
            <DialogDescription>
              Optionally add a message to the client explaining why this booking cannot be accommodated.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="decline-message">Message (Optional)</Label>
              <Textarea
                id="decline-message"
                placeholder="Sorry, I'm unavailable at this time..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMessage('')}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDecline} disabled={isLoading}>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Propose Alternative Time</DialogTitle>
            <DialogDescription>
              Suggest an alternative date and time for this booking.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="alt-date">Alternative Date</Label>
                <Input
                  id="alt-date"
                  type="date"
                  value={alternativeDate}
                  onChange={(e) => setAlternativeDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="alt-time">Alternative Time</Label>
                <Input
                  id="alt-time"
                  type="time"
                  value={alternativeTime}
                  onChange={(e) => setAlternativeTime(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="alt-message">Message (Optional)</Label>
              <Textarea
                id="alt-message"
                placeholder="I'm unavailable at your requested time, but I have availability at..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setAlternativeDate('')
              setAlternativeTime('')
              setMessage('')
            }}>
              Cancel
            </Button>
            <Button onClick={handleProposeAlternative} disabled={isLoading || !alternativeDate || !alternativeTime}>
              Send Proposal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
