import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react'
import Image from 'next/image'
import { formatBlogContent } from '@/lib/format-blog-content'

interface PageProps {
  params: {
    slug: string
  }
}

async function getBlogPost(slug: string) {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      author: true
    }
  })

  if (!post || !post.isPublished) {
    return null
  }

  return post
}

export async function generateMetadata({ params }: PageProps) {
  const post = await getBlogPost(params.slug)
  
  if (!post) {
    return {
      title: 'Post Not Found | Psych-Skills'
    }
  }

  return {
    title: `${post.title} | Psych-Skills Blog`,
    description: post.excerpt,
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const post = await getBlogPost(params.slug)

  if (!post) {
    notFound()
  }

  const readingTime = Math.ceil(post.content.split(' ').length / 200)
  const formattedContent = formatBlogContent(post.content)

  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="relative py-12 border-b border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-montserrat mb-6">
              {post.title}
            </h1>

            <div className="flex items-center gap-6 text-muted-foreground">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {readingTime} min read
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {post.featuredImage && (
        <section className="py-8 bg-muted/30">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto max-w-4xl">
              <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
                <Image
                  src={post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content */}
      <article className="py-12">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-3xl">
            {/* Excerpt */}
            <div className="text-xl text-muted-foreground mb-8 pb-8 border-b border-border italic">
              {post.excerpt}
            </div>

            {/* Blog Content with formatting */}
            <div 
              className="prose prose-slate dark:prose-invert max-w-none
                prose-headings:font-montserrat prose-headings:font-bold
                prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-4
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-foreground prose-p:leading-relaxed prose-p:mb-6
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-foreground prose-strong:font-semibold
                prose-em:text-muted-foreground
                prose-blockquote:border-l-4 prose-blockquote:border-primary/30 
                prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-muted-foreground
                prose-ul:my-6 prose-li:my-2
                prose-img:rounded-lg"
              dangerouslySetInnerHTML={{ __html: formattedContent }}
            />

            {/* Author signature */}
            <div className="mt-12 pt-8 border-t border-border">
              <p className="text-muted-foreground italic">
                Dr Denise Hill (PsychSkills)
              </p>
            </div>
          </div>
        </div>
      </article>

      {/* CTA Section */}
      <section className="py-16 bg-muted/30 border-t border-border">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold mb-4 font-montserrat">
              <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                Interested in Working Together?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Take the first step towards achieving your performance goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500">
                <Link href="/bookings">Book a Session</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-emerald-500 text-emerald-400 hover:bg-emerald-500/10">
                <Link href="/blog">Read More Articles</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
