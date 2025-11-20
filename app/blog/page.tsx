import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import Image from 'next/image'

export const metadata = {
  title: 'Blog | Psych-Skills',
  description: 'Expert insights on sports psychology, mental performance, and achieving peak performance under pressure',
}

async function getBlogPosts() {
  const posts = await prisma.blogPost.findMany({
    where: {
      isPublished: true
    },
    orderBy: {
      publishedAt: 'desc'
    }
  })
  return posts
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-background"></div>
        <div className="relative container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-montserrat mb-6">
              <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                Blog & Insights
              </span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Expert guidance on sports psychology, mental performance techniques, and strategies 
              to excel under pressure from Dr. Denise Hill
            </p>
          </div>
        </div>
      </section>

      {/* Blog Posts */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-6xl">
            {posts.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">
                    No blog posts published yet. Check back soon!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post: any) => (
                  <Link key={post.id} href={`/blog/${post.slug}`}>
                    <Card className="h-full hover:border-primary/50 transition-all duration-300 cursor-pointer group">
                      {post.featuredImage && (
                        <div className="relative h-48 w-full overflow-hidden">
                          <Image
                            src={post.featuredImage}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <CardHeader>
                        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 text-xs">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {Math.ceil(post.content.split(' ').length / 200)} min read
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground line-clamp-3 mb-4">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all">
                          Read more
                          <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold mb-4 font-montserrat">
              <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                Ready to Take Your Performance to the Next Level?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Book a session and start your journey to mental mastery in sport.
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
