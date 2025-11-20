import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold">
            <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
              Psych-Skills Admin
            </span>
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{session.user?.email}</span>
            <form action="/api/auth/signout" method="POST">
              <button 
                type="submit"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar Navigation */}
          <nav className="col-span-12 md:col-span-3 lg:col-span-2">
            <div className="space-y-1">
              <a
                href="/admin/dashboard"
                className="block px-4 py-2 rounded-md hover:bg-accent transition-colors"
              >
                Dashboard
              </a>
              <a
                href="/admin/bookings"
                className="block px-4 py-2 rounded-md hover:bg-accent transition-colors font-semibold text-primary"
              >
                Bookings
              </a>
              <a
                href="/admin/availability"
                className="block px-4 py-2 rounded-md hover:bg-accent transition-colors"
              >
                Availability
              </a>
              <a
                href="/admin/blog"
                className="block px-4 py-2 rounded-md hover:bg-accent transition-colors"
              >
                Blog Posts
              </a>
              <a
                href="/admin/testimonials"
                className="block px-4 py-2 rounded-md hover:bg-accent transition-colors"
              >
                Testimonials
              </a>
              <a
                href="/admin/contact-submissions"
                className="block px-4 py-2 rounded-md hover:bg-accent transition-colors"
              >
                Contact Submissions
              </a>
            </div>
          </nav>

          {/* Main Content */}
          <main className="col-span-12 md:col-span-9 lg:col-span-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
