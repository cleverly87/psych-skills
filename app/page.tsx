import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Users, Trophy, GraduationCap, ArrowRight, Star } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0">
          <Image 
            src="/images/landscape scene.jpg" 
            alt="Golf course landscape"
            fill
            className="object-cover opacity-80"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-background"></div>
        </div>
        <div className="relative container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-6xl font-montserrat animate-fade-in">
              Elite Sports Psychology{' '}
              <span className="bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 bg-clip-text text-transparent">Proven in Golf</span>,{' '}
              <span className="text-primary">Applied Across All Sports</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300 animate-fade-in">
              Expert sports psychology services by Dr. Denise Hill. Drawing on 25+ years of elite golf experience, 
              providing proven mental performance strategies for athletes across all sporting disciplines.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6 animate-fade-in">
              <Button asChild size="xl" className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500">
                <Link href="/bookings">Book a Session</Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10">
                <Link href="/about">
                  Discover More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 sm:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-montserrat">
              <span className="bg-gradient-to-r from-emerald-400 to-teal-500 bg-clip-text text-transparent">Performance Psychology Services</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Tailored mental coaching programs designed to maximize athletic performance across all sports. 
              Elite golf-proven strategies adapted for your discipline.
            </p>
          </div>
          
          <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-lg hover:-translate-y-2 hover:border-primary transition-all duration-300">
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-2" />
                <CardTitle>1-2-1 Consultancy</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Personalized one-on-one sessions with bespoke mental coaching programs tailored to your individual needs.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg hover:-translate-y-2 hover:border-primary transition-all duration-300">
              <CardHeader>
                <BookOpen className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Group Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Team workshops and group bookings focusing on mindset training for athletes and teams.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg hover:-translate-y-2 hover:border-primary transition-all duration-300">
              <CardHeader>
                <Trophy className="h-10 w-10 text-primary mb-2" />
                <CardTitle>High Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Consulting for coaches and organizations to cultivate high-performance environments.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg hover:-translate-y-2 hover:border-primary transition-all duration-300">
              <CardHeader>
                <GraduationCap className="h-10 w-10 text-primary mb-2" />
                <CardTitle>Supervision</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Mentoring for trainee sport psychologists via BASES accreditation supervision.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg" variant="outline" className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10">
              <Link href="/services">
                View All Services <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Teaser */}
      <section className="bg-muted/30 py-20 sm:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-montserrat">
                Meet Dr. Denise Hill
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                HCPC Registered Practitioner Psychologist, former elite golfer, and Associate Professor 
                with over 25 years of experience in high-performance sports psychology.
              </p>
              <p className="mt-4 text-muted-foreground">
                Dr. Hill combines academic excellence with elite athletic experience. Her PhD research on 
                performance under pressure in golf has shaped mental strategies now successfully applied across 
                multiple sporting disciplines. From professional athletes to emerging talent, her golf-proven 
                methodologies translate to any high-performance environment.
              </p>
              <div className="mt-8">
                <Button asChild>
                  <Link href="/about">Learn More About Dr. Hill</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-96 lg:h-full min-h-[400px] rounded-lg overflow-hidden bg-muted">
              <Image 
                src="/images/Denise.jpg" 
                alt="Dr. Denise Hill"
                fill
                className="object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Teaser */}
      <section className="py-20 sm:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-montserrat">
                What Clients Say
              </h2>
            </div>
            
            <Card className="border-2">
              <CardContent className="pt-6">
                <div className="flex items-start gap-6">
                  <div className="relative h-20 w-20 rounded-full overflow-hidden flex-shrink-0">
                    <Image 
                      src="/images/Lydia Hall.png" 
                      alt="Lydia Hall"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                      ))}
                    </div>
                    <blockquote className="text-lg italic text-muted-foreground">
                      "Denise reignited my love of golf and helped me work towards being myself. 
                      She has made such a huge impact in so many areas of my game, it's just not 
                      the performance, it's the enjoyment I get. Coaching with her allowed me to 
                      be my authentic self and play the game in a way that I never believed possible."
                    </blockquote>
                    <div className="mt-6">
                      <p className="font-semibold text-foreground">Lydia Hall</p>
                      <p className="text-sm text-muted-foreground">European Tour Winner, Ladies European Tour Professional</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="mt-12 text-center">
              <Button asChild variant="outline" size="lg" className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10">
                <Link href="/testimonials">
                  Read More Testimonials <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* TEDx Talk Section */}
      <section className="py-20 sm:py-24 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-montserrat mb-4">
                <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                  Featured TEDx Talk
                </span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Watch Dr. Hill explore the psychology of performance under pressure
              </p>
            </div>
            
            <Card className="border-2 border-primary/20 overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-video w-full">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/Xm5eSPLsGzE" 
                    title="Dr. Denise Hill TEDx Talk"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                    className="w-full h-full"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-16 sm:py-20">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/20 to-transparent"></div>
        <div className="relative container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-montserrat">
              <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">Ready to Transform Your Mental Game?</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Book your first session today and start your journey to peak performance.
            </p>
            <div className="mt-8 flex items-center justify-center gap-x-6">
              <Button asChild size="xl" className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500">
                <Link href="/bookings">Book a Session</Link>
              </Button>
              <Button asChild size="xl" variant="outline" className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10">
                <Link href="/contact">Get in Touch</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
