'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Calendar, Clock, User, Mail, Phone, ArrowLeft, Send, MessageSquare } from 'lucide-react'
import { BookingActions } from '@/components/admin/booking-actions'

type BookingStatus = 'PENDING' | 'CONFIRMED' | 'DECLINED' | 'CANCELLED' | 'COMPLETED'

interface BookingReply {
  id: string
  message: string
  sentBy: string
  senderEmail: string
  senderName: string | null
  createdAt: string
}

interface Booking {
  id: string
  clientName: string
  clientEmail: string
  clientPhone: string | null
  serviceType: string
  date: string
  timeSlot: string
  notes: string | null
  message: string | null
  status: BookingStatus
  paymentStatus: string
  adminNotes: string | null
  createdAt: string
  replies: BookingReply[]
}

export default function BookingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchBooking()
  }, [params.id])

  const fetchBooking = async () => {
    try {
      const res = await fetch(`/api/admin/bookings/${params.id}`)
      if (res.ok) {
        const data = await res.json()
        setBooking(data)
      }
    } catch (error) {
      console.error('Failed to fetch booking:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendReply = async () => {
    if (!replyMessage.trim() || isSending) return

    setIsSending(true)
    try {
      const res = await fetch(`/api/admin/bookings/${params.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyMessage }),
      })

      if (res.ok) {
        setReplyMessage('')
        fetchBooking()
      } else {
        alert('Failed to send reply')
      }
    } catch (error) {
      console.error('Failed to send reply:', error)
      alert('Failed to send reply')
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading booking...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Booking not found</p>
            <Button onClick={() => router.push('/admin/bookings')} className="mt-4">
              Back to Bookings
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isPastDate = new Date(booking.date) < new Date()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/admin/bookings')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Bookings
        </Button>
      </div>

      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
          Booking Details
        </h1>
        <p className="text-muted-foreground mt-2">
          View booking information and communicate with client
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Booking Info Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Booking Information</CardTitle>
                <Badge variant={
                  booking.status === 'CONFIRMED' ? 'default' :
                  booking.status === 'PENDING' ? 'secondary' :
                  'destructive'
                }>
                  {booking.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Client Name</p>
                    <p className="font-medium">{booking.clientName}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{booking.clientEmail}</p>
                  </div>
                </div>

                {booking.clientPhone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{booking.clientPhone}</p>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground">Service Type</p>
                  <p className="font-medium">{booking.serviceType.replace(/_/g, ' ')}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {new Date(booking.date).toLocaleDateString('en-GB', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">{booking.timeSlot}</p>
                  </div>
                </div>
              </div>

              {(booking.notes || booking.message) && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Client Notes:</p>
                  <div className="bg-muted/50 p-3 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{booking.notes || booking.message}</p>
                  </div>
                </div>
              )}

              {booking.adminNotes && (
                <div className="pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Admin Notes:</p>
                  <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded-md">
                    <p className="text-sm whitespace-pre-wrap">{booking.adminNotes}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Conversation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Conversation ({booking.replies?.length || 0})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Replies */}
              {booking.replies && booking.replies.length > 0 ? (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {booking.replies.map((reply, index) => {
                    const isAdmin = reply.sentBy === 'admin'
                    return (
                      <div
                        key={reply.id}
                        className={`p-4 rounded-lg ${
                          isAdmin
                            ? 'bg-blue-100 text-gray-900 ml-8'
                            : 'bg-green-100 text-gray-900 mr-8'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-sm">
                              {isAdmin ? 'Dr Denise Hill' : booking.clientName}
                            </p>
                            <p className="text-xs text-gray-600">
                              {new Date(reply.createdAt).toLocaleString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm whitespace-pre-wrap">{reply.message}</p>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No messages yet. Start a conversation with the client.</p>
                </div>
              )}

              {/* Reply Form */}
              <div className="pt-4 border-t">
                <Textarea
                  placeholder="Type your message to the client..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="min-h-[100px] mb-3"
                />
                <Button
                  onClick={handleSendReply}
                  disabled={!replyMessage.trim() || isSending}
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSending ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions Card */}
          {booking.status === 'PENDING' && (
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <BookingActions 
                  bookingId={booking.id} 
                  onUpdate={() => {
                    fetchBooking()
                  }} 
                />
              </CardContent>
            </Card>
          )}

          {/* Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Additional Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-muted-foreground">Payment Status</p>
                <Badge variant="outline" className="mt-1">
                  {booking.paymentStatus}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Submitted</p>
                <p className="font-medium">
                  {new Date(booking.createdAt).toLocaleString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              {isPastDate && (
                <div>
                  <Badge variant="outline" className="text-amber-600 border-amber-600">
                    Past Date
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
