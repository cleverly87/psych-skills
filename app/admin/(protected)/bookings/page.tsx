'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, Mail, Phone, Trash2 } from 'lucide-react'
import { BookingActions } from '@/components/admin/booking-actions'

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'DECLINED' | 'CANCELLED' | 'COMPLETED'

interface Booking {
  id: string
  clientName: string
  clientEmail: string
  clientPhone: string | null
  serviceType: string
  date: string
  timeSlot: string
  notes: string | null
  status: BookingStatus
  paymentStatus: string
  adminNotes: string | null
  createdAt: string
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed'>('all')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const res = await fetch('/api/admin/bookings')
      if (res.ok) {
        const data = await res.json()
        setBookings(data)
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      return
    }

    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchBookings()
      }
    } catch (error) {
      console.error('Failed to delete booking:', error)
    }
  }

  const handleMarkComplete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/bookings/${id}/complete`, {
        method: 'POST',
      })

      if (res.ok) {
        fetchBookings()
      }
    } catch (error) {
      console.error('Failed to mark booking as complete:', error)
    }
  }

  const handleCancelConfirmed = async (id: string) => {
    const reason = prompt('Enter cancellation reason (optional):')
    if (reason === null) return // User clicked cancel

    try {
      const res = await fetch(`/api/admin/bookings/${id}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })

      if (res.ok) {
        fetchBookings()
      }
    } catch (error) {
      console.error('Failed to cancel booking:', error)
    }
  }

  const pendingBookings = bookings.filter(b => b.status === 'PENDING')
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED')
  
  const filteredBookings = 
    activeTab === 'pending' ? pendingBookings :
    activeTab === 'confirmed' ? confirmedBookings :
    bookings

  const isPastDate = (dateString: string) => {
    return new Date(dateString) < new Date()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
          Bookings Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage client bookings, confirm sessions, or propose alternative times
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Pending Bookings</CardDescription>
            <CardTitle className="text-3xl text-amber-500">{pendingBookings.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Confirmed This Week</CardDescription>
            <CardTitle className="text-3xl text-emerald-500">{confirmedBookings.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total Bookings</CardDescription>
            <CardTitle className="text-3xl">{bookings.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-border pb-2">
        <Button 
          variant="ghost" 
          className={activeTab === 'all' ? 'border-b-2 border-primary' : ''}
          onClick={() => setActiveTab('all')}
        >
          All Bookings
        </Button>
        <Button 
          variant="ghost"
          className={activeTab === 'pending' ? 'border-b-2 border-primary' : ''}
          onClick={() => setActiveTab('pending')}
        >
          Pending ({pendingBookings.length})
        </Button>
        <Button 
          variant="ghost"
          className={activeTab === 'confirmed' ? 'border-b-2 border-primary' : ''}
          onClick={() => setActiveTab('confirmed')}
        >
          Confirmed ({confirmedBookings.length})
        </Button>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Loading bookings...</p>
            </CardContent>
          </Card>
        ) : filteredBookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {activeTab === 'pending' ? 'No pending bookings' :
                 activeTab === 'confirmed' ? 'No confirmed bookings' :
                 'No bookings yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredBookings.map((booking) => {
            const pastDate = isPastDate(booking.date)
            const showMarkComplete = booking.status === 'CONFIRMED' && pastDate
            const showCancel = booking.status === 'CONFIRMED' && !pastDate
            const showDelete = booking.status === 'DECLINED' || 
                               booking.status === 'CANCELLED' || 
                               booking.status === 'COMPLETED'
            
            return (
              <Card key={booking.id} className="hover:border-primary/50 transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Booking Info */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3 flex-wrap">
                        <Badge variant={
                          booking.status === 'CONFIRMED' ? 'default' :
                          booking.status === 'PENDING' ? 'secondary' :
                          'destructive'
                        }>
                          {booking.status}
                        </Badge>
                        <span className="text-sm font-medium text-foreground">
                          {booking.serviceType.replace(/_/g, ' ')}
                        </span>
                        {isPastDate(booking.date) && (
                          <Badge variant="outline" className="text-xs">
                            Past Date
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{booking.clientName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{booking.clientEmail}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">
                            {new Date(booking.date).toLocaleDateString('en-GB', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span className="text-foreground">{booking.timeSlot}</span>
                        </div>
                        {booking.clientPhone && (
                          <div className="flex items-center gap-2 text-sm">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">{booking.clientPhone}</span>
                          </div>
                        )}
                      </div>

                      {booking.notes && (
                        <div className="mt-3 p-3 bg-muted/50 rounded-md">
                          <p className="text-sm text-foreground">
                            <strong>Client Notes:</strong> {booking.notes}
                          </p>
                        </div>
                      )}

                      {booking.adminNotes && (
                        <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 rounded-md">
                          <p className="text-sm text-foreground">
                            <strong>Admin Notes:</strong> {booking.adminNotes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 lg:min-w-[200px]">
                      {booking.status === 'PENDING' && (
                        <BookingActions bookingId={booking.id} onUpdate={fetchBookings} />
                      )}
                      {showMarkComplete && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkComplete(booking.id)}
                          className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10"
                        >
                          Mark Complete
                        </Button>
                      )}
                      {showCancel && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelConfirmed(booking.id)}
                          className="border-amber-500 text-amber-400 hover:bg-amber-500/10"
                        >
                          Cancel Booking
                        </Button>
                      )}
                      {showDelete && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(booking.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
