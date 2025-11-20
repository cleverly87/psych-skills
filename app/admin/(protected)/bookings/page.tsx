import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar, Clock, User, Mail, Phone, CheckCircle, XCircle, Clock3 } from 'lucide-react'
import { BookingActions } from '@/components/admin/booking-actions'

export default async function BookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: {
      date: 'desc',
    },
  })

  const pendingBookings = bookings.filter(b => b.status === 'PENDING')
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED')

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
        <Button variant="ghost" className="border-b-2 border-primary">
          All Bookings
        </Button>
        <Button variant="ghost">
          Pending ({pendingBookings.length})
        </Button>
        <Button variant="ghost">
          Confirmed ({confirmedBookings.length})
        </Button>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {bookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No bookings yet</p>
            </CardContent>
          </Card>
        ) : (
          bookings.map((booking) => (
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
                        {booking.serviceType}
                      </span>
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
                          <strong>Notes:</strong> {booking.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {booking.status === 'PENDING' && (
                    <div className="flex flex-col gap-2 lg:min-w-[200px]">
                      <BookingActions bookingId={booking.id} />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
