import { Metadata } from 'next'
import BookingForm from '@/components/booking/booking-form'

export const metadata: Metadata = {
  title: 'Book a Session',
  description: 'Reserve your golf psychology session with Dr. Denise Hill. Choose your preferred date and time - no payment required at booking.',
}

export default function BookingsPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16 sm:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-montserrat">
              Book Your Session
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Reserve your golf psychology session with Dr. Denise Hill. Select your preferred 
              date and time below. No payment is required at booking - payment will be arranged separately.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <BookingForm />
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              What Happens Next?
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2">Submit Your Request</h3>
                <p className="text-sm text-muted-foreground">
                  Complete the booking form with your preferred date and time.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
                <h3 className="font-semibold mb-2">Dr. Hill Reviews</h3>
                <p className="text-sm text-muted-foreground">
                  Dr. Hill will review your request and contact you within 24-48 hours to confirm.
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
                <h3 className="font-semibold mb-2">Attend Your Session</h3>
                <p className="text-sm text-muted-foreground">
                  Join your session at the scheduled time. Payment details will be provided separately.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
