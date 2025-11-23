'use client'

import { useState, useEffect } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDate, formatTime } from '@/lib/utils'
import { Clock, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react'

const SERVICE_TYPES = [
  { value: 'ONE_TO_ONE', label: '1-2-1 Consultancy' },
  { value: 'GROUP_SESSION', label: 'Group Session' },
  { value: 'WORKSHOP', label: 'Workshop' },
  { value: 'HIGH_PERFORMANCE', label: 'High Performance Support' },
  { value: 'SUPERVISION', label: 'Supervision & Mentoring' },
]

export default function BookingForm() {
  const [date, setDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>()
  const [serviceType, setServiceType] = useState<string>()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [blockedDates, setBlockedDates] = useState<Date[]>([])
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: '',
  })

  // Fetch blocked dates on mount
  useEffect(() => {
    const fetchBlockedDates = async () => {
      try {
        const res = await fetch('/api/availability/blocked-dates')
        if (res.ok) {
          const dates = await res.json()
          setBlockedDates(dates.map((d: { date: string }) => new Date(d.date)))
        }
      } catch (error) {
        console.error('Failed to fetch blocked dates:', error)
      }
    }
    fetchBlockedDates()
  }, [])

  // Fetch available time slots when date changes
  useEffect(() => {
    if (!date) {
      setAvailableTimeSlots([])
      return
    }

    const fetchAvailableSlots = async () => {
      setIsLoadingSlots(true)
      try {
        const dayOfWeek = (date.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0 format
        const res = await fetch(`/api/availability/time-slots?dayOfWeek=${dayOfWeek}&date=${date.toISOString()}`)
        if (res.ok) {
          const slots = await res.json()
          setAvailableTimeSlots(slots)
        }
      } catch (error) {
        console.error('Failed to fetch time slots:', error)
      } finally {
        setIsLoadingSlots(false)
      }
    }

    fetchAvailableSlots()
  }, [date])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date: date?.toISOString(),
          timeSlot: selectedTime,
          serviceType,
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
      } else {
        alert('Booking failed. Please try again.')
      }
    } catch (error) {
      alert('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6 text-center space-y-4">
          <CheckCircle2 className="h-16 w-16 text-primary mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Booking Request Submitted!</h2>
          <p className="text-muted-foreground">
            Thank you for your booking request. Dr. Denise Hill will review your request and be in touch within 24-48 hours to confirm your session.
          </p>
          <p className="text-sm text-muted-foreground">
            <strong>Important:</strong> No payment is required at this time. Payment will be arranged separately before your session.
          </p>
          <div className="pt-6">
            <Button asChild>
              <a href="/">Return to Homepage</a>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Step 1: Select Service */}
      <Card>
        <CardHeader>
          <CardTitle>1. Select Service Type</CardTitle>
          <CardDescription>Choose the type of session you'd like to book</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={serviceType} onValueChange={setServiceType}>
            <SelectTrigger>
              <SelectValue placeholder="Select a service..." />
            </SelectTrigger>
            <SelectContent>
              {SERVICE_TYPES.map((service) => (
                <SelectItem key={service.value} value={service.value}>
                  {service.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Step 2: Select Date & Time */}
      {serviceType && (
        <Card>
          <CardHeader>
            <CardTitle>2. Choose Date & Time</CardTitle>
            <CardDescription>Select your preferred date and time slot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="mb-2 block">Select Date</Label>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                disabled={(checkDate) => {
                  // Disable past dates
                  if (checkDate < new Date(new Date().setHours(0, 0, 0, 0))) return true
                  
                  // Disable blocked dates
                  if (blockedDates.some(blocked => 
                    blocked.toDateString() === checkDate.toDateString()
                  )) return true
                  
                  return false
                }}
                className="rounded-md border"
              />
            </div>

            {date && (
              <div>
                <Label className="mb-2 block">Select Time</Label>
                {isLoadingSlots ? (
                  <p className="text-sm text-muted-foreground">Loading available times...</p>
                ) : availableTimeSlots.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No available time slots for this date. Please select another date.</p>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {availableTimeSlots.map((time) => (
                      <Button
                        key={time}
                        type="button"
                        variant={selectedTime === time ? 'default' : 'outline'}
                        onClick={() => setSelectedTime(time)}
                        className="w-full"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        {time}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Your Details */}
      {selectedTime && (
        <Card>
          <CardHeader>
            <CardTitle>3. Your Details</CardTitle>
            <CardDescription>Please provide your contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes (optional)</Label>
              <Textarea
                id="notes"
                rows={4}
                placeholder="Let us know if you have any specific goals or topics you'd like to focus on..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary & Submit */}
      {selectedTime && formData.name && formData.email && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Booking Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Service:</span>
              <span className="font-semibold">
                {SERVICE_TYPES.find((s) => s.value === serviceType)?.label}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-semibold">{date && formatDate(date)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time:</span>
              <span className="font-semibold">{selectedTime && formatTime(selectedTime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="font-semibold">{formData.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-semibold">{formData.email}</span>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-4">
                <strong>Payment Information:</strong> No payment is required at this time. 
                Payment will be arranged separately before your session.
              </p>
              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </form>
  )
}
