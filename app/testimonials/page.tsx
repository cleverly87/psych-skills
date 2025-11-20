import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, Quote } from 'lucide-react'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'

export const metadata = {
  title: 'Testimonials | Psych-Skills',
  description: 'Read what professional athletes and clients say about working with Denise Cleverly',
}

async function getTestimonials() {
  const testimonials = await prisma.testimonial.findMany({
    where: {
      isApproved: true
    },
    orderBy: {
      displayOrder: 'asc'
    }
  })
  return testimonials
}

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials()
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-background"></div>
        <div className="relative container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-montserrat mb-6">
              <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                Client Testimonials
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Hear from professional athletes and golfers who have experienced transformative results 
              through mental performance coaching with Dr. Denise Hill.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-8">
            {testimonials.map((testimonial: any) => (
              <Card key={testimonial.id} className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="pt-8">
                  <div className="flex flex-col md:flex-row gap-8">
                    {/* Image - only show if available */}
                    {testimonial.imageUrl && (
                      <div className="flex-shrink-0">
                        <div className="relative h-32 w-32 mx-auto md:mx-0 rounded-full overflow-hidden">
                          <Image 
                            src={testimonial.imageUrl} 
                            alt={testimonial.clientName}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1">
                      {/* Rating */}
                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                        ))}
                      </div>

                      {/* Quote */}
                      <div className="relative">
                        <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/20" />
                        <blockquote className="text-lg text-muted-foreground italic pl-6 mb-6">
                          "{testimonial.content}"
                        </blockquote>
                      </div>

                      {/* Author */}
                      <div className="border-t border-border pt-4">
                        <p className="font-semibold text-lg text-foreground">{testimonial.clientName}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.clientTitle}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold mb-4 font-montserrat">
              <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                Ready to Transform Your Performance?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join the professional athletes and golfers who have achieved breakthrough results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500">
                <Link href="/bookings">Book a Session</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10">
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
