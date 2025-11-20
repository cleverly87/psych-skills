import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, FileText, MessageSquare, Mail } from 'lucide-react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function AdminDashboard() {
  // Fetch stats
  const [pendingBookings, upcomingBookings, blogPosts, testimonials, contactSubmissions] = await Promise.all([
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.booking.count({ 
      where: { 
        status: 'CONFIRMED',
        date: {
          gte: new Date(),
          lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Next 7 days
        }
      } 
    }),
    prisma.blogPost.count({ where: { isPublished: true } }),
    prisma.testimonial.count({ where: { isApproved: true } }),
    prisma.contactSubmission.count()
  ])
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Link href="/admin/bookings">
          <Card className="hover:border-primary transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingBookings}</div>
              <p className="text-xs text-muted-foreground">Awaiting confirmation</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/bookings">
          <Card className="hover:border-primary transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Week</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingBookings}</div>
              <p className="text-xs text-muted-foreground">Upcoming sessions</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/blog">
          <Card className="hover:border-primary transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blogPosts}</div>
              <p className="text-xs text-muted-foreground">Published articles</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/testimonials">
          <Card className="hover:border-primary transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Testimonials</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{testimonials}</div>
              <p className="text-xs text-muted-foreground">Client reviews</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/contact-submissions">
          <Card className="hover:border-primary transition-colors cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Contact Messages</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contactSubmissions}</div>
              <p className="text-xs text-muted-foreground">
                {contactSubmissions > 0 ? 'Needs attention' : 'No new messages'}
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/admin/bookings" className="block p-3 rounded-md hover:bg-accent transition-colors">
              → Review pending bookings
            </Link>
            <Link href="/admin/availability" className="block p-3 rounded-md hover:bg-accent transition-colors">
              → Manage availability & blocked dates
            </Link>
            <Link href="/admin/blog" className="block p-3 rounded-md hover:bg-accent transition-colors">
              → Create new blog post
            </Link>
            <Link href="/admin/contact-submissions" className="block p-3 rounded-md hover:bg-accent transition-colors">
              → View contact messages
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and changes</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
