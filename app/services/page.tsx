import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, BookOpen, Trophy, GraduationCap, Check } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Golf Psychology Services',
  description: 'Expert golf sports psychology services including 1-2-1 consultancy, group sessions, high performance support, and supervision for CASES-SEPAR accreditation.',
}

export default function ServicesPage() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16 sm:py-24">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl font-montserrat">
              Golf Performance Psychology Services
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Tailored mental coaching programs designed to maximize your golfing development 
              and help you achieve your full potential.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-20">
            {/* 1-2-1 Consultancy */}
            <div id="one-to-one" className="scroll-mt-20">
              <Card className="overflow-hidden">
                <div className="grid lg:grid-cols-3 gap-8 p-8">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Users className="h-8 w-8 text-primary" />
                      </div>
                      <h2 className="text-3xl font-bold text-foreground font-montserrat">
                        1-2-1 Consultancy
                      </h2>
                    </div>
                    <p className="text-lg text-muted-foreground">
                      Personalized one-on-one sessions with bespoke mental coaching programs 
                      tailored to your individual needs and goals.
                    </p>
                    <div className="space-y-3 pt-4">
                      <h3 className="font-semibold text-foreground">What's Included:</h3>
                      <ul className="space-y-2">
                        {[
                          'Comprehensive psychological assessment',
                          'Personalized mental skills training program',
                          'Performance anxiety and pressure management',
                          'Confidence building and self-belief development',
                          'Focus and concentration techniques',
                          'Pre-round and on-course mental strategies',
                          'Goal setting and performance tracking',
                          'Ongoing support and follow-up sessions'
                        ].map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between bg-muted/30 p-6 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Who is this for?</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Professional golfers, elite amateurs, and dedicated club golfers 
                        seeking to maximize their potential through personalized mental coaching.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <Button asChild className="w-full" size="lg">
                        <Link href="/bookings">Book a Session</Link>
                      </Button>
                      <Button asChild className="w-full" variant="outline">
                        <Link href="/contact">Enquire Now</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Group Sessions */}
            <div id="group" className="scroll-mt-20">
              <Card className="overflow-hidden">
                <div className="grid lg:grid-cols-3 gap-8 p-8">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <BookOpen className="h-8 w-8 text-primary" />
                      </div>
                      <h2 className="text-3xl font-bold text-foreground font-montserrat">
                        Group Sessions & Workshops
                      </h2>
                    </div>
                    <p className="text-lg text-muted-foreground">
                      Team workshops and group bookings focusing on mindset training for 
                      groups of athletes and teams.
                    </p>
                    <div className="space-y-3 pt-4">
                      <h3 className="font-semibold text-foreground">Workshop Topics Include:</h3>
                      <ul className="space-y-2">
                        {[
                          'Team cohesion and communication',
                          'Collective mental resilience',
                          'Pre-competition preparation strategies',
                          'Dealing with pressure in competitions',
                          'Building a winning mindset',
                          'Managing setbacks and bouncing back',
                          'Performance routines and rituals',
                          'Mental skills for consistent performance'
                        ].map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between bg-muted/30 p-6 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Who is this for?</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Golf teams, club groups, junior development squads, and organizations 
                        looking to develop collective mental skills and team performance.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <Button asChild className="w-full" size="lg">
                        <Link href="/bookings">Book a Workshop</Link>
                      </Button>
                      <Button asChild className="w-full" variant="outline">
                        <Link href="/contact">Enquire Now</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* High Performance Support */}
            <div id="performance" className="scroll-mt-20">
              <Card className="overflow-hidden">
                <div className="grid lg:grid-cols-3 gap-8 p-8">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Trophy className="h-8 w-8 text-primary" />
                      </div>
                      <h2 className="text-3xl font-bold text-foreground font-montserrat">
                        High Performance Support
                      </h2>
                    </div>
                    <p className="text-lg text-muted-foreground">
                      Consulting for coaches, organizations, and support staff to cultivate 
                      high-performance environments for players.
                    </p>
                    <div className="space-y-3 pt-4">
                      <h3 className="font-semibold text-foreground">Support Services:</h3>
                      <ul className="space-y-2">
                        {[
                          'Coach education and development',
                          'Performance environment audits',
                          'Organizational culture development',
                          'Player support systems design',
                          'Performance profiling and monitoring',
                          'Stress management for support staff',
                          'Communication and feedback strategies',
                          'Long-term athlete development planning'
                        ].map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between bg-muted/30 p-6 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Who is this for?</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Coaches, golf organizations, performance directors, and support staff 
                        committed to creating optimal high-performance environments.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <Button asChild className="w-full" size="lg">
                        <Link href="/contact">Discuss Your Needs</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Supervision & Mentoring */}
            <div id="supervision" className="scroll-mt-20">
              <Card className="overflow-hidden">
                <div className="grid lg:grid-cols-3 gap-8 p-8">
                  <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <GraduationCap className="h-8 w-8 text-primary" />
                      </div>
                      <h2 className="text-3xl font-bold text-foreground font-montserrat">
                        Supervision & Mentoring
                      </h2>
                    </div>
                    <p className="text-lg text-muted-foreground">
                      Supervision for CASES-SEPAR accreditation, mentoring to newly qualified and mid-career practitioners and supervisors, 
                      and professional development.
                    </p>
                    <div className="space-y-3 pt-4">
                      <h3 className="font-semibold text-foreground">Supervision Includes:</h3>
                      <ul className="space-y-2">
                        {[
                          'Supervision for CASES-SEPAR accreditation',
                          'Mentoring to newly qualified and mid-career practitioners',
                          'Case discussion and consultation',
                          'Professional development guidance',
                          'Ethical practice and professionalism',
                          'Applied sport psychology skills development',
                          'Research and evidence-based practice',
                          'Self-reflection and practitioner development',
                          'Portfolio and documentation support'
                        ].map((item) => (
                          <li key={item} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                            <span className="text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between bg-muted/30 p-6 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Who is this for?</h3>
                      <p className="text-sm text-muted-foreground mb-6">
                        Trainee sport and exercise psychologists seeking CASES-SEPAR accreditation supervision, 
                        as well as newly qualified and mid-career practitioners and supervisors.
                      </p>
                    </div>
                    <div className="space-y-3">
                      <Button asChild className="w-full" size="lg">
                        <Link href="/contact">Apply for Supervision</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary/5 py-16 sm:py-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl font-montserrat mb-4">
              Not Sure Which Service is Right for You?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Contact Dr. Hill for a free initial consultation to discuss your needs and goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/contact">Get in Touch</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/bookings">Book a Session</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
