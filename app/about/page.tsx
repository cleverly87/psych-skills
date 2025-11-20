import { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import Image from 'next/image'
import { Award, BookOpen, Users, Target, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Dr. Denise Hill',
  description: 'Learn about Dr. Denise Hill, HCPC Registered Practitioner Psychologist and golf sports psychology expert with over 25 years of experience.',
}

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Hero with Image */}
      <section className="relative py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-background"></div>
        <div className="relative container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-montserrat mb-6">
                  <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                    Dr. Denise Hill
                  </span>
                </h1>
                <div className="space-y-3 text-lg mb-8">
                  <div className="flex items-center gap-3 text-gray-300 dark:text-gray-300 light:text-gray-700">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>HCPC Registered Practitioner Psychologist</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300 dark:text-gray-300 light:text-gray-700">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>Associate Professor</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300 dark:text-gray-300 light:text-gray-700">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>25+ Years Elite Sports Experience</span>
                  </div>
                </div>
                <p className="text-xl text-gray-300 dark:text-gray-300 light:text-gray-700 leading-relaxed">
                  As a HCPC registered Practitioner Psychologist - I have built a global reputation for providing expert consultancy services to aspiring, elite, and professional golfers. Your success and well-being are my utmost priority, and I am committed to helping you achieve your full potential.
                </p>
                <p className="text-lg text-gray-300 dark:text-gray-300 light:text-gray-700 leading-relaxed mt-4">
                  Whether you are looking to enhance your performance, overcome mental barriers, or simply seek guidance on your golfing journey - I am here to support you every step of the way.
                </p>
                <div className="mt-8">
                  <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                    <Link href="/contact">Get in touch today</Link>
                  </Button>
                </div>
              </div>
              <div className="relative h-[500px] rounded-lg overflow-hidden">
                <Image 
                  src="/images/Denise.jpg" 
                  alt="Dr. Denise Hill"
                  fill
                  className="object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Credentials - Icon Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12 font-montserrat">
              <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                Credentials & Expertise
              </span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
                <CardContent className="pt-8 pb-6">
                  <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold text-xl mb-3">Elite Golfer</h3>
                  <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">
                    As an international golfer, I experienced the detrimental impact of pressure. This drove me to gain a comprehensive understanding of how players can develop a mindset that leads to an enjoyable and successful golfing journey.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
                <CardContent className="pt-8 pb-6">
                  <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold text-xl mb-3">Associate Professor</h3>
                  <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">
                    After gaining a degree (Loughborough University) and MSc. (Exeter University), I completed a PhD exploring choking under pressure among professional golfers. I am now an Associate Professor of Applied Sport Psychology.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center hover:shadow-lg hover:-translate-y-2 transition-all duration-300">
                <CardContent className="pt-8 pb-6">
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-bold text-xl mb-3">Golf Psychology Consultant</h3>
                  <p className="text-gray-400 dark:text-gray-400 light:text-gray-600">
                    After becoming a HCPC registered Practitioner Psychologist, I have applied my knowledge and expertise within the field for over 25 years, working across multiple sports with a focus on supporting aspiring, elite, and professional golfers.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Highlights */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6 font-montserrat">
                Elite-Level Experience
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Dr. Hill&apos;s extensive career spans over 25 years of working at the highest levels of sport, 
                providing psychological support and mental performance coaching to:
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <Target className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Professional Golfers</h3>
                  <p className="text-gray-400 light:text-gray-600">
                    European Tour and LPGA professionals competing at the highest international levels
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Target className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Professional Sports Teams</h3>
                  <p className="text-gray-400 light:text-gray-600">
                    Elite teams across multiple sporting disciplines seeking performance excellence
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Target className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Elite Amateur Athletes</h3>
                  <p className="text-gray-400 light:text-gray-600">
                    National and international competitors striving for professional breakthrough
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <Target className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg mb-2">Coaches & Support Staff</h3>
                  <p className="text-gray-400 light:text-gray-600">
                    High-performance coaches developing world-class training environments
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Published Author */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold mb-12 text-center font-montserrat">
              <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                Published Author
              </span>
            </h2>
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-8">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="order-2 md:order-1">
                    <h3 className="text-2xl font-bold mb-4">The Psychology of Golf Performance under Pressure</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Dr. Hill&apos;s groundbreaking book explores the psychological mechanisms behind performance 
                      under pressure in golf. Drawing on extensive research and practical experience, this 
                      comprehensive guide offers evidence-based strategies for golfers, coaches, and sport 
                      psychologists.
                    </p>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      Published by Routledge, this authoritative text combines academic rigor with practical 
                      application, making it an essential resource for anyone serious about understanding and 
                      improving mental performance in golf.
                    </p>
                    <Button asChild size="lg" className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500">
                      <a href="https://www.routledge.com/The-Psychology-of-Golf-Performance-under-Pressure/Hill-Barker-Steptoe/p/book/9781032289014" target="_blank" rel="noopener noreferrer">
                        Purchase Book
                      </a>
                    </Button>
                  </div>
                  <div className="order-1 md:order-2">
                    <div className="relative h-[400px] rounded-lg overflow-hidden shadow-2xl">
                      <Image 
                        src="/images/book.jpg" 
                        alt="The Psychology of Golf Performance under Pressure book cover"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* TEDx Talk */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold mb-8 text-center font-montserrat">
              <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                Featured TEDx Talk
              </span>
            </h2>
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-8">
                <div className="aspect-video w-full rounded-lg overflow-hidden mb-6">
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
                <p className="text-center text-muted-foreground">
                  Watch Dr. Hill&apos;s TEDx talk exploring the psychology of performance under pressure and 
                  how to develop mental resilience in high-stakes situations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold mb-8 text-center font-montserrat">
              Coaching Philosophy
            </h2>
            <Card className="border-2 border-primary/20">
              <CardContent className="pt-8 pb-8">
                <p className="text-xl text-gray-300 dark:text-gray-300 light:text-gray-700 leading-relaxed mb-6">
                  Dr. Hill's approach centers on helping athletes discover and develop their authentic 
                  performance style. Rather than imposing a one-size-fits-all method, she works collaboratively 
                  to understand each client's unique psychological profile, goals, and challenges.
                </p>
                <p className="text-xl text-gray-300 leading-relaxed mb-8">
                  Her work focuses on building sustainable mental skills that enhance both performance and 
                  enjoyment. By combining evidence-based psychological techniques with practical sport-specific 
                  strategies, she helps clients develop the mental resilience and confidence needed to thrive 
                  under pressure.
                </p>
                <blockquote className="border-l-4 border-primary pl-6 italic text-2xl text-gray-200 dark:text-gray-200 light:text-gray-800">
                  "My goal is to help athletes not just perform better, but to develop authentic confidence 
                  and mental resilience. When you're truly yourself in competition, that's when the magic happens."
                </blockquote>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="text-3xl font-bold mb-4 font-montserrat">
              <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                Ready to Discover Your Potential?
              </span>
            </h3>
            <p className="text-xl text-gray-300 dark:text-gray-300 light:text-gray-700 mb-8">
              Contact Dr. Hill to discuss how she can help you achieve your performance goals.
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
