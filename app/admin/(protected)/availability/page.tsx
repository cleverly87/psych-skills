'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Calendar as CalendarIcon, Clock, Plus, X, Save } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface BlockedDate {
  id: string
  date: string
  reason?: string
}

interface TimeSlot {
  hour: number
  label: string
  available: boolean
}

interface DayAvailability {
  dayOfWeek: number
  timeSlots: TimeSlot[]
  isActive: boolean
}

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

// Generate time slots from 08:00 to 20:00
const generateTimeSlots = (availableHours: number[] = []): TimeSlot[] => {
  const slots: TimeSlot[] = []
  for (let hour = 8; hour <= 20; hour++) {
    slots.push({
      hour,
      label: `${hour.toString().padStart(2, '0')}:00`,
      available: availableHours.includes(hour),
    })
  }
  return slots
}

export default function AvailabilityPage() {
  const router = useRouter()
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [weeklyAvailability, setWeeklyAvailability] = useState<DayAvailability[]>([
    { dayOfWeek: 0, timeSlots: generateTimeSlots([9, 10, 11, 12, 13, 14, 15, 16, 17]), isActive: true },
    { dayOfWeek: 1, timeSlots: generateTimeSlots([9, 10, 11, 12, 13, 14, 15, 16, 17]), isActive: true },
    { dayOfWeek: 2, timeSlots: generateTimeSlots([9, 10, 11, 12, 13, 14, 15, 16, 17]), isActive: true },
    { dayOfWeek: 3, timeSlots: generateTimeSlots([9, 10, 11, 12, 13, 14, 15, 16, 17]), isActive: true },
    { dayOfWeek: 4, timeSlots: generateTimeSlots([9, 10, 11, 12, 13, 14, 15, 16, 17]), isActive: true },
    { dayOfWeek: 5, timeSlots: generateTimeSlots(), isActive: false },
    { dayOfWeek: 6, timeSlots: generateTimeSlots(), isActive: false },
  ])
  const [newBlockedDate, setNewBlockedDate] = useState('')
  const [newBlockedReason, setNewBlockedReason] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchAvailability()
  }, [])

  const fetchAvailability = async () => {
    try {
      const res = await fetch('/api/admin/availability')
      if (res.ok) {
        const data = await res.json()
        if (data.blockedDates) setBlockedDates(data.blockedDates)
        if (data.workingHours && data.workingHours.length > 0) {
          // Convert API data to time slot format
          const availabilityByDay: { [key: number]: number[] } = {}
          data.workingHours.forEach((wh: any) => {
            if (!availabilityByDay[wh.dayOfWeek]) {
              availabilityByDay[wh.dayOfWeek] = []
            }
            // Store the hour from availableHours JSON field
            if (wh.availableHours) {
              availabilityByDay[wh.dayOfWeek] = wh.availableHours
            }
          })
          
          const newAvailability = weeklyAvailability.map((day) => ({
            ...day,
            timeSlots: generateTimeSlots(availabilityByDay[day.dayOfWeek] || []),
            isActive: (availabilityByDay[day.dayOfWeek]?.length || 0) > 0,
          }))
          setWeeklyAvailability(newAvailability)
        }
      }
    } catch (error) {
      console.error('Failed to fetch availability:', error)
    }
  }

  const addBlockedDate = async () => {
    if (!newBlockedDate) return

    try {
      const res = await fetch('/api/admin/availability/block-date', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: newBlockedDate,
          reason: newBlockedReason || undefined,
        }),
      })

      if (res.ok) {
        const blocked = await res.json()
        setBlockedDates([...blockedDates, blocked])
        setNewBlockedDate('')
        setNewBlockedReason('')
      }
    } catch (error) {
      console.error('Failed to block date:', error)
    }
  }

  const removeBlockedDate = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/availability/block-date/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setBlockedDates(blockedDates.filter(d => d.id !== id))
      }
    } catch (error) {
      console.error('Failed to remove blocked date:', error)
    }
  }

  const toggleDayActive = (dayIndex: number) => {
    setWeeklyAvailability(weeklyAvailability.map((day, idx) =>
      idx === dayIndex ? { ...day, isActive: !day.isActive } : day
    ))
  }

  const toggleTimeSlot = (dayIndex: number, hour: number) => {
    setWeeklyAvailability(weeklyAvailability.map((day, idx) => {
      if (idx === dayIndex) {
        return {
          ...day,
          timeSlots: day.timeSlots.map(slot =>
            slot.hour === hour ? { ...slot, available: !slot.available } : slot
          ),
        }
      }
      return day
    }))
  }

  const saveWorkingHours = async () => {
    setIsSaving(true)
    try {
      // Convert time slots to API format
      const availability = weeklyAvailability
        .filter(day => day.isActive)
        .map(day => ({
          dayOfWeek: day.dayOfWeek,
          availableHours: day.timeSlots
            .filter(slot => slot.available)
            .map(slot => slot.hour),
        }))

      const res = await fetch('/api/admin/availability/working-hours', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ availability }),
      })

      if (res.ok) {
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to save working hours:', error)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
          Availability Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Control when clients can book sessions with you
        </p>
      </div>

      {/* Working Hours */}
      <Card>
        <CardHeader>
          <CardTitle>Working Hours</CardTitle>
          <CardDescription>
            Select available hour blocks for each day. Clients will only see highlighted time slots when booking.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {weeklyAvailability.map((day, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={day.isActive}
                  onChange={() => toggleDayActive(index)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <span className={`font-medium min-w-[100px] ${!day.isActive && 'text-muted-foreground'}`}>
                  {DAYS_OF_WEEK[index]}
                </span>
                {!day.isActive && (
                  <span className="text-sm text-muted-foreground">Unavailable</span>
                )}
              </div>
              
              {day.isActive && (
                <div className="ml-7 grid grid-cols-7 sm:grid-cols-9 md:grid-cols-13 gap-2">
                  {day.timeSlots.map((slot) => (
                    <button
                      key={slot.hour}
                      type="button"
                      onClick={() => toggleTimeSlot(index, slot.hour)}
                      className={`
                        px-2 py-2 text-xs font-medium rounded-md transition-all border-2
                        ${slot.available
                          ? 'bg-primary text-primary-foreground border-primary hover:bg-primary/90'
                          : 'bg-muted text-muted-foreground border-muted hover:border-primary/50'
                        }
                      `}
                    >
                      {slot.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          <Button 
            onClick={saveWorkingHours} 
            disabled={isSaving}
            className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Working Hours'}
          </Button>
        </CardContent>
      </Card>

      {/* Blocked Dates */}
      <Card>
        <CardHeader>
          <CardTitle>Blocked Dates</CardTitle>
          <CardDescription>
            Block specific dates when you're unavailable (holidays, personal days, etc.)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                type="date"
                value={newBlockedDate}
                onChange={(e) => setNewBlockedDate(e.target.value)}
                placeholder="Select date"
              />
            </div>
            <div className="flex-1">
              <Input
                type="text"
                value={newBlockedReason}
                onChange={(e) => setNewBlockedReason(e.target.value)}
                placeholder="Reason (optional)"
              />
            </div>
            <Button onClick={addBlockedDate} disabled={!newBlockedDate}>
              <Plus className="h-4 w-4 mr-2" />
              Block Date
            </Button>
          </div>

          <div className="space-y-2">
            {blockedDates.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No blocked dates yet
              </p>
            ) : (
              blockedDates.map((blocked) => (
                <div
                  key={blocked.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {new Date(blocked.date).toLocaleDateString('en-GB', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    {blocked.reason && (
                      <p className="text-sm text-muted-foreground">{blocked.reason}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBlockedDate(blocked.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
