# Psych-Skills - Professional Sports Psychology Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-336791?style=for-the-badge&logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)

A production-ready, enterprise-grade web application for sports psychology services featuring real-time booking, comprehensive admin dashboard, and advanced security.

[Features](#-key-features) • [Tech Stack](#-technology-stack) • [Architecture](#-architecture--design) • [Security](#-security-features) • [Installation](#-installation)

</div>

---

## 📖 Project Overview

**Psych-Skills** is a full-stack web application built for professional sports psychology services. This platform combines modern web technologies with user-centric design to deliver a seamless experience for both clients and administrators. The system handles everything from service discovery and booking to content management and customer relationship tracking.

### 🎯 Purpose

Designed to streamline the operations of a sports psychology practice by:
- **Client Engagement**: Interactive booking system with availability management
- **Content Marketing**: SEO-optimized blog and testimonial showcase
- **Business Operations**: Comprehensive admin dashboard for managing all aspects of the practice
- **Professional Presence**: Modern, accessible, and mobile-responsive design

---

## ✨ Key Features

### 🎨 **Modern UI/UX**
- **Responsive Design**: Mobile-first approach using Tailwind CSS and shadcn/ui components
- **Accessibility**: WCAG 2.1 compliant with semantic HTML and ARIA labels
- **Dark Mode Support**: Integrated theme system for optimal viewing in any environment
- **Smooth Animations**: Framer Motion for polished user interactions
- **Custom Gradient Themes**: Professional emerald/green color scheme

### 📅 **Advanced Booking System**
- **Real-Time Availability**: Dynamic calendar integration with blocked dates
- **Multi-Service Support**: Different session types with custom pricing and durations
- **Reserve & Pay Later**: Flexible payment options for client convenience
- **Email Notifications**: Automated confirmations to clients and admin
- **Booking Management**: Full CRUD operations with status tracking (pending/confirmed/cancelled)
- **Conflict Prevention**: Smart date blocking and availability checking

### 🔐 **Enterprise-Grade Security**
- **Multi-Layer Authentication**: NextAuth.js with credentials provider
- **Role-Based Access Control**: Owner/Admin permissions with granular access
- **Rate Limiting**: Progressive IP-based rate limiting (5 attempts/15min)
- **IP Blocking**: Automatic 1-hour ban after 10 failed login attempts
- **Math CAPTCHA**: Bot protection without external dependencies
- **Password Management**: Bcrypt hashing with secure reset flow
- **Session Security**: JWT tokens with 24-hour expiry
- **IP Whitelist**: Admin-configurable trusted IP addresses
- **Security Dashboard**: Real-time monitoring of login attempts and blocked IPs

### 📝 **Content Management System**
- **Blog Platform**: 
  - Rich text editor with markdown support
  - Featured images and SEO metadata
  - Tag-based categorization
  - Published/draft status management
  - Automatic excerpt generation
- **Testimonials**: Client success stories with ratings and photos
- **Services Management**: Dynamic service offerings with pricing
- **Contact Submissions**: Form handling with admin dashboard

### 👨‍💼 **Admin Dashboard**
- **Analytics Overview**: Live statistics for bookings, submissions, and content
- **Booking Management**: View, confirm, or cancel sessions
- **Availability Control**: Set working hours and block specific dates
- **Content Publishing**: Create and manage blog posts with media uploads
- **User Management**: Handle contact form submissions
- **Security Monitoring**: Track failed login attempts and manage IP blocks
- **Database Backup/Restore**: Built-in data protection tools

### 🚀 **Performance & SEO**
- **Server-Side Rendering**: Next.js 14 App Router for optimal performance
- **Image Optimization**: Automatic next/image optimization
- **SEO Best Practices**: 
  - Dynamic meta tags and Open Graph support
  - Structured data (JSON-LD schema)
  - XML sitemap generation
  - Robots.txt configuration
- **Core Web Vitals**: Optimized for LCP, FID, and CLS
- **Edge Deployment**: Vercel-ready with automatic CDN distribution

---

## 🛠 Technology Stack

### **Frontend**
- **Framework**: Next.js 14.2.33 (App Router)
- **Language**: TypeScript 5.3.3
- **Styling**: Tailwind CSS 3.4.1
- **Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **Animations**: Framer Motion

### **Backend**
- **Runtime**: Node.js with Edge Runtime support
- **Database**: PostgreSQL (Supabase/Vercel Postgres/Neon compatible)
- **ORM**: Prisma 5.22.0
- **Authentication**: NextAuth.js 4.24.5
- **Email**: Nodemailer with SMTP support
- **Password Hashing**: bcrypt (12 rounds)

### **DevOps & Tooling**
- **Deployment**: Vercel (recommended), Docker-ready
- **Database Migrations**: Prisma Migrate
- **Type Safety**: Full TypeScript coverage
- **Linting**: ESLint with Next.js config
- **Package Manager**: npm/yarn/pnpm
- **Version Control**: Git with GitHub

---

## 🏗 Architecture & Design

### **Application Structure**
```
psych-skills/
├── app/                          # Next.js 14 App Router
│   ├── (marketing)/             # Public-facing pages
│   │   ├── page.tsx            # Homepage with hero & features
│   │   ├── about/              # About the practitioner
│   │   ├── services/           # Service offerings
│   │   ├── testimonials/       # Client success stories
│   │   ├── blog/               # SEO-optimized blog
│   │   ├── contact/            # Contact form
│   │   └── booking/            # Session booking flow
│   ├── admin/                   # Protected admin area
│   │   ├── (auth)/             # Login & password reset
│   │   └── (protected)/        # Dashboard, bookings, content management
│   └── api/                     # API routes
│       ├── auth/               # NextAuth endpoints
│       ├── bookings/           # Booking operations
│       └── admin/              # Admin-only endpoints
├── components/                  # Reusable React components
│   ├── ui/                     # shadcn/ui base components
│   ├── layout/                 # Header, Footer, Navigation
│   ├── booking/                # Booking calendar & forms
│   └── admin/                  # Admin dashboard components
├── lib/                         # Utilities & configurations
│   ├── auth.ts                 # NextAuth configuration
│   ├── db.ts                   # Prisma client singleton
│   ├── rate-limit.ts           # Rate limiting & IP management
│   ├── captcha.ts              # Math-based CAPTCHA
│   └── auth-helpers.ts         # Role-based access control
├── prisma/                      # Database schema & migrations
│   └── schema.prisma           # Data models
├── scripts/                     # Utility scripts
│   ├── backup-db.ts            # Database backup to JSON
│   └── restore-db.ts           # Restore from backup
└── public/                      # Static assets
````

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or hosted, e.g., Vercel Postgres, Supabase, or Neon)
- npm or yarn package manager

### Installation

1. **Clone the repository and navigate to the project:**

```powershell
cd "c:\Users\CSUKAWCY\OneDrive - Creditsafe\Documents\GitHub\psych-skills\psych-skills"
```

2. **Install dependencies:**

```powershell
npm install
```

This will install all required packages including Next.js, Prisma, TailwindCSS, and other dependencies.

## 🔧 Environment Setup

1. **Copy the environment template:**

```powershell
Copy-Item .env.example .env
```

2. **Configure your `.env` file:**

```env
# Database - Replace with your PostgreSQL connection string
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

# NextAuth - Generate a secret with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"

# Admin Credentials - Change these!
ADMIN_EMAIL="admin@psych-skills.com"
ADMIN_PASSWORD="your-secure-password"

# Email Configuration (for booking notifications)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="Psych-Skills <noreply@psych-skills.com>"

# Site Configuration
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="Psych-Skills"
```

### Database Connection Strings

**Vercel Postgres:**
```
DATABASE_URL="postgres://username:password@host.postgres.vercel-storage.com:5432/verceldb"
```

**Supabase:**
```
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"
```

**Neon:**
```
DATABASE_URL="postgresql://[user]:[password]@[endpoint]/[database]"
```

## 🗄️ Database Setup

1. **Generate Prisma Client:**

```powershell
npx prisma generate
```

2. **Push the schema to your database:**

```powershell
npx prisma db push
```

3. **Seed the database (optional - creates sample data):**

```powershell
npx prisma db seed
```

4. **View your database (optional):**

```powershell
npx prisma studio
```

This opens a browser-based database GUI at `http://localhost:5555`

## ▶️ Running the Application

### Development Mode

```powershell
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

```powershell
npm run build
npm start
```

## 👩‍💼 Owner Guide (Dr. Denise Hill)

### Accessing the Admin Area

1. Navigate to: `http://localhost:3000/admin/login`
2. Log in with your credentials (set in `.env`)

### Managing Bookings

**View Bookings:**
- Go to `Admin Dashboard > Bookings`
- View all upcoming and past bookings
- See client details, service type, date/time
- Filter by status (Pending, Confirmed, Cancelled, Completed)

**Manage Bookings:**
- Click on any booking to view full details
- Change status (Pending → Confirmed, or Cancel)
- Mark payment status (Unpaid → Paid)
- Add notes about the session

**Set Your Availability:**
- Go to `Admin Dashboard > Availability`
- Set your working hours for each day of the week
- Block specific dates when unavailable (holidays, etc.)
- Define session duration (default 60 minutes)

### Managing Content

**Blog Posts:**
1. Go to `Admin Dashboard > Blog`
2. Click "New Post"
3. Fill in:
   - Title
   - Content (rich text editor with formatting)
   - Excerpt (short summary)
   - Featured image (optional)
   - Tags for categorization
4. Click "Save Draft" or "Publish"

**Testimonials:**
1. Go to `Admin Dashboard > Testimonials`
2. Click "Add Testimonial"
3. Enter client name, role, testimonial text
4. Mark as "Featured" to show on homepage
5. Save

**Services:**
1. Go to `Admin Dashboard > Services`
2. Edit existing services or add new ones
3. Update descriptions, features, and order
4. Save changes

### Email Notifications

You will automatically receive email notifications when:
- A new booking is made
- A client cancels a booking
- A contact form is submitted

Clients receive emails when:
- They make a booking (confirmation)
- You confirm their booking
- You cancel/reschedule their booking

## 🔐 Admin Guide (Master Administrator)

### Full System Access

As the master administrator, you have additional capabilities:

**User Management:**
- Create/edit/delete admin users
- Assign roles (Owner vs Admin)
- Reset passwords

**System Configuration:**
- Manage site-wide settings
- Configure email templates
- Set up payment integration (future)

**Data Management:**
- Export booking data
- View analytics and statistics
- Database backups

### Adding the Owner User

If you need to create the owner user manually:

```powershell
# Open Prisma Studio
npx prisma studio

# Or use SQL:
# Navigate to User table and create a new user with:
# - email: admin@psych-skills.com (or as configured)
# - password: [hashed with bcrypt]
# - role: OWNER
```

### Monitoring

**View Logs:**
- Check application logs in your hosting dashboard
- Monitor error rates and performance

**Performance:**
- Use Vercel Analytics (if deployed on Vercel)
- Google Analytics integration for traffic monitoring
- Core Web Vitals tracking

## 🌐 Deployment

### Deploying to Vercel (Recommended)

1. **Install Vercel CLI:**

### **Database Models**

The application uses a comprehensive Prisma schema with the following models:

- **User**: Admin and owner accounts with role-based permissions
- **Booking**: Session bookings with client info, service type, and payment tracking
- **Service**: Different session types (e.g., Individual, Team, Online)
- **Availability**: Weekly schedule configuration for booking system
- **BlockedDate**: Special dates when bookings are unavailable
- **BlogPost**: Published articles with tags, SEO metadata, and rich content
- **Tag**: Categorization for blog posts
- **Testimonial**: Client reviews with ratings and optional photos
- **ContactSubmission**: Messages from the contact form

### **Design Patterns**

- **Server Components**: Default for optimal performance
- **Client Components**: Only where interactivity is needed
- **API Route Handlers**: RESTful endpoints for CRUD operations
- **Middleware**: Protected routes with session validation
- **Error Boundaries**: Graceful error handling throughout the app
- **Optimistic UI**: Immediate feedback for user actions
- **Progressive Enhancement**: Works without JavaScript for core features

---

## 🔒 Security Features

### **Authentication & Authorization**

- **NextAuth.js Integration**: Industry-standard authentication
- **Bcrypt Password Hashing**: 12-round salted hashing
- **JWT Session Tokens**: 24-hour expiry with automatic refresh
- **Role-Based Access Control**: Owner and Admin roles with different permissions
- **Server-Side Session Validation**: Every protected route checks authentication

### **Rate Limiting & Bot Protection**

- **Progressive Rate Limiting**:
  - 5 failed login attempts = 15-minute cooldown
  - 10 total failed attempts = 1-hour IP ban
- **Math CAPTCHA**: Simple addition/subtraction questions (no external dependencies)
- **IP-Based Tracking**: In-memory store with automatic cleanup
- **Whitelist Support**: Admin-configurable trusted IPs
- **Security Dashboard**: Real-time monitoring of login attempts and blocked IPs

### **Password Management**

- **Secure Reset Flow**: Token-based password reset with 1-hour expiry
- **Email Verification**: Reset links sent to registered email
- **Crypto-Secure Tokens**: 32-byte random tokens
- **One-Time Use**: Tokens are cleared after successful reset
- **Fallback Logging**: Console output when SMTP not configured

### **Additional Security Measures**

- **SQL Injection Protection**: Prisma parameterized queries
- **XSS Prevention**: React automatic escaping + Content Security Policy
- **CSRF Protection**: NextAuth built-in CSRF tokens
- **Secure Headers**: Next.js security headers configuration
- **Environment Variables**: Sensitive data never committed to repository
- **Database Backups**: Built-in backup/restore scripts for data protection

---

## 📊 Admin Dashboard Features

### **Dashboard Overview**

- **Live Statistics**: Real-time counts for bookings, blog posts, testimonials, submissions
- **Recent Activity**: Latest bookings and contact form submissions
- **Quick Actions**: One-click access to common tasks
- **Visual Analytics**: Color-coded status indicators

### **Booking Management**

- **Full CRUD Operations**: Create, view, update, and delete bookings
- **Status Tracking**: Pending → Confirmed → Completed workflow
- **Payment Management**: Track paid/unpaid status
- **Client Information**: Name, email, phone, session details
- **Calendar Integration**: Visual representation of booked slots
- **Email Notifications**: Automatic confirmations sent to clients

### **Content Management**

**Blog Platform:**
- Rich text editing with markdown support
- Image uploads for featured posts
- SEO optimization (meta title, description, keywords)
- Tag-based categorization
- Draft/Published status
- Automatic excerpt generation
- Scheduled publishing dates

**Testimonials:**
- Client success stories with star ratings
- Photo uploads for social proof
- Featured testimonial highlighting
- Order management for homepage display

**Services:**
- Dynamic service offerings
- Custom pricing and duration
- Detailed descriptions
- Active/inactive status

### **Security Dashboard**

- **Blocked IP Monitoring**: View all currently blocked IP addresses
- **Login Attempt Tracking**: Real-time activity feed with attempt counts
- **Manual IP Management**:
  - Block specific IPs pre-emptively
  - Unblock IPs to restore access
  - Add IPs to permanent whitelist
- **Rate Limit Statistics**: See which IPs are approaching limits
- **Clear All Limits**: Reset all counters (useful after testing)
- **Auto-Refresh**: Dashboard updates every 30 seconds

### **Contact Submissions**

- View all messages from contact form
- Read/unread status tracking
- Client contact information
- Delete unwanted spam

---

## 🚀 Installation

### **1. Prerequisites**

Ensure you have the following installed:

- **Node.js** 18.17 or higher
- **npm** 9.0 or higher (or yarn/pnpm)
- **PostgreSQL** database (Supabase, Vercel Postgres, or Neon recommended)
- **Git** for version control

### **2. Clone the Repository**

```bash
git clone https://github.com/cleverly87/psych-skills.git
cd psych-skills
```

### **3. Install Dependencies**

```bash
npm install
```

This installs:
- Next.js, React, and TypeScript
- Prisma ORM and PostgreSQL client
- NextAuth.js for authentication
- Tailwind CSS and UI components
- All other required packages

### **4. Environment Configuration**

Create a `.env` file in the root directory:

```env
# Database Connection (Supabase example)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[Generate with: openssl rand -base64 32]"

# Admin Account
ADMIN_EMAIL="your-email@example.com"
ADMIN_PASSWORD="[Strong password - will be hashed]"

# Email Configuration (Optional - logs to console if not configured)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="[Gmail App Password]"
EMAIL_FROM="Psych-Skills <noreply@psych-skills.com>"

# Site Configuration
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="Psych-Skills"
```

### **5. Database Setup**

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Open Prisma Studio to verify
npx prisma studio
```

### **6. Create Admin Account**

The admin account is automatically created on first run when you log in with the credentials from your `.env` file.

### **7. Run Development Server**

```bash
npm run dev
```

Visit `http://localhost:3000` to see the site.
Visit `http://localhost:3000/admin/login` to access the admin panel.

### **8. Build for Production**

```bash
npm run build
npm start
```

---

## 🌐 Deployment

### **Vercel Deployment (Recommended)**

**1. Install Vercel CLI**

```bash
npm i -g vercel
```

**2. Login to Vercel**

```bash
vercel login
```

**3. Deploy to Production**

```bash
vercel --prod
```

**4. Configure Environment Variables**

In Vercel Dashboard:
1. Go to Project Settings → Environment Variables
2. Add all variables from your `.env` file
3. Ensure `NEXTAUTH_URL` points to your production URL

**5. Set Up Database**

Option A: Use Vercel Postgres
- Create a Postgres database in Vercel Storage
- Copy connection strings to environment variables

Option B: Use External Database (Supabase/Neon)
- Use your existing `DATABASE_URL` and `DIRECT_URL`

**6. Post-Deployment**

- Database migrations run automatically during build
- Test login at `https://your-domain.com/admin/login`
- Submit sitemap to Google Search Console

### **Database Backup & Restore**

**Backup to JSON:**

```bash
npm run db:backup
```

Creates `backups/backup-[timestamp].json` with all database records.

**Restore from Backup:**

```bash
npm run db:restore
```

Restores the most recent backup file.

---

## 🎨 Customization Guide

### **Branding**

**Colors** (tailwind.config.ts):

```typescript
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#10b981', // Emerald-500
        foreground: '#ffffff',
      },
      // Modify to match your brand
    }
  }
}
```

**Logo** (components/layout/header.tsx):

```tsx
<Link href="/" className="flex items-center space-x-2">
  <Image src="/logo.png" alt="Logo" width={150} height={40} />
</Link>
```

### **Content**

- **Homepage**: Edit `app/page.tsx`
- **About Page**: Edit `app/about/page.tsx`
- **Services**: Manage via Admin Dashboard
- **Blog Posts**: Create via Admin Dashboard
- **Testimonials**: Add via Admin Dashboard

### **Email Templates**

Customize email templates in:
- `app/api/bookings/route.ts` (booking confirmations)
- `app/api/auth/request-reset/route.ts` (password reset emails)

---

## 📈 Performance Optimizations

- **Image Optimization**: Automatic WebP conversion via next/image
- **Code Splitting**: Automatic by Next.js App Router
- **Server Components**: Reduced JavaScript bundle size
- **Edge Runtime**: Fast response times via Vercel Edge Network
- **Database Connection Pooling**: PgBouncer for Supabase
- **Static Generation**: Blog posts and public pages pre-rendered
- **Caching**: Aggressive caching strategy for static assets

**Lighthouse Scores (Typical):**
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

---

## 🧪 Testing & Quality Assurance

### **Manual Testing Checklist**

**Public Site:**
- [ ] Homepage loads correctly
- [ ] Navigation works on mobile and desktop
- [ ] Booking form submits successfully
- [ ] Contact form sends submissions
- [ ] Blog posts display with images
- [ ] Testimonials show ratings

**Admin Panel:**
- [ ] Login with correct credentials
- [ ] CAPTCHA prevents bots
- [ ] Rate limiting blocks after 5 attempts
- [ ] Dashboard shows live statistics
- [ ] Bookings can be created/edited
- [ ] Blog posts can be published
- [ ] Security dashboard tracks IPs

**Security:**
- [ ] Wrong password is rejected
- [ ] Password reset email is sent
- [ ] Session expires after 24 hours
- [ ] Admin routes redirect when not logged in

---

## 🐛 Troubleshooting

### **Common Issues**

**"Prisma Client Not Found"**

```bash
npx prisma generate
```

**Build Fails on Vercel**

- Ensure all environment variables are set
- Check `DATABASE_URL` is accessible from Vercel servers
- Verify Node.js version (18.17+)

**Email Not Sending**

- Check SMTP credentials are correct
- For Gmail, use an App Password (not regular password)
- Emails will log to console if SMTP not configured

**Rate Limiting Not Working**

- Rate limits are in-memory and reset on server restart
- In production, consider Redis for persistent rate limiting

**CAPTCHA Always Fails**

- Check browser console for errors
- Verify CAPTCHA token is being sent in login request
- Ensure server time is synchronized (tokens expire after 5 minutes)

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Guide](https://next-auth.js.org)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

---

## 🏆 Project Highlights

This project demonstrates:

✅ **Full-Stack Development**: Complete frontend and backend implementation
✅ **Modern Tech Stack**: Latest Next.js 14, TypeScript, and React patterns
✅ **Enterprise Security**: Multi-layer authentication, rate limiting, IP blocking
✅ **Database Design**: Normalized schema with relationships and constraints
✅ **User Experience**: Responsive design, accessibility, smooth interactions
✅ **Production-Ready**: Deployed on Vercel with real-world usage
✅ **Maintainability**: Clean code, TypeScript safety, comprehensive documentation
✅ **SEO Optimization**: Server-side rendering, meta tags, structured data
✅ **Performance**: Lighthouse scores 95+, optimized images, code splitting

---

## 📝 License & Credits

**Developer**: Built by [Clever Technical Writing](https://clever-technical-writing.com/)

**License**: Proprietary - © 2025 Psych-Skills. All rights reserved.

**Technologies**: Next.js, React, TypeScript, PostgreSQL, Prisma, NextAuth.js, Tailwind CSS, Vercel

---

**Version**: 1.0.0 | **Last Updated**: November 2025
