# Psych-Skills Website

A modern, SEO-optimized website for Psych-Skills sports psychology services, built with Next.js 14, TypeScript, Tailwind CSS, and PostgreSQL.

## 🌟 Features

- **Modern, Responsive Design**: Mobile-first approach with cutting-edge UI/UX
- **SEO Optimized**: Built with best practices for search engine visibility
- **Booking System**: Interactive calendar for session booking with "reserve now, pay later"
- **Content Management**: User-friendly admin interface for managing blog posts, testimonials, and services
- **Authentication**: Secure NextAuth.js authentication for admin and owner roles
- **Email Notifications**: Automated booking confirmations and admin notifications
- **Performance Optimized**: Fast loading times, optimized images, and Core Web Vitals compliance

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Environment Setup](#environment-setup)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Owner Guide](#owner-guide)
- [Admin Guide](#admin-guide)
- [Deployment](#deployment)
- [Project Structure](#project-structure)

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

```powershell
npm i -g vercel
```

2. **Login to Vercel:**

```powershell
vercel login
```

3. **Deploy:**

```powershell
vercel
```

4. **Set Environment Variables:**
   - Go to your Vercel dashboard
   - Navigate to your project > Settings > Environment Variables
   - Add all variables from your `.env` file

5. **Set up Vercel Postgres:**
   - In Vercel dashboard, go to Storage
   - Create a new Postgres database
   - Copy the connection string to `DATABASE_URL`

6. **Deploy to Production:**

```powershell
vercel --prod
```

### Post-Deployment Steps

1. Run database migrations:
   - Vercel will automatically run `prisma generate` during build
   - You may need to run `prisma db push` manually for first deployment

2. Configure Custom Domain:
   - In Vercel dashboard, add `psych-skills.com`
   - Update `NEXT_PUBLIC_SITE_URL` environment variable

3. Set up Email:
   - Ensure EMAIL_* environment variables are set
   - Test booking confirmation emails

4. SEO:
   - Submit sitemap to Google Search Console: `https://psych-skills.com/sitemap.xml`
   - Verify site ownership
   - Submit to Bing Webmaster Tools

## 📁 Project Structure

```
psych-skills/
├── app/                      # Next.js 14 App Router
│   ├── (admin)/             # Admin routes
│   │   ├── admin/
│   │   │   ├── bookings/    # Booking management
│   │   │   ├── blog/        # Blog post management
│   │   │   └── dashboard/   # Admin dashboard
│   ├── about/               # About page
│   ├── services/            # Services page
│   ├── testimonials/        # Testimonials page
│   ├── blog/                # Blog listing & posts
│   ├── bookings/            # Public booking page
│   ├── contact/             # Contact page
│   ├── api/                 # API routes
│   │   ├── auth/            # NextAuth endpoints
│   │   ├── bookings/        # Booking API
│   │   └── contact/         # Contact form API
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   └── globals.css          # Global styles
├── components/              # Reusable components
│   ├── ui/                  # UI components (shadcn/ui)
│   ├── layout/              # Header, Footer
│   ├── booking/             # Booking-specific components
│   └── admin/               # Admin components
├── lib/                     # Utility functions
│   ├── prisma.ts            # Prisma client
│   ├── utils.ts             # Helper functions
│   └── email.ts             # Email utilities
├── prisma/                  # Database
│   └── schema.prisma        # Database schema
├── public/                  # Static assets
│   └── images/              # Images
├── .env                     # Environment variables (not in git)
├── .env.example             # Environment template
├── next.config.js           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS config
├── tsconfig.json            # TypeScript config
└── package.json             # Dependencies
```

## 🔑 Key Technologies

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **UI Components**: Radix UI (shadcn/ui)
- **Email**: Nodemailer
- **Forms**: React Hook Form + Zod validation
- **Icons**: Lucide React

## 🎨 Customization

### Colors

Edit `tailwind.config.ts` to change the color scheme:

```typescript
colors: {
  primary: {
    DEFAULT: 'hsl(142 76% 36%)', // Main green color
    ...
  }
}
```

### Content

Most content can be edited through the admin interface. For hardcoded content (e.g., homepage hero text), edit the respective page files in the `app/` directory.

### Logo

Replace the text logo in `components/layout/header.tsx` with an image:

```tsx
<Image src="/logo.png" alt="Psych-Skills" width={200} height={50} />
```

## 📧 Email Configuration

### Gmail Setup

1. Enable 2-factor authentication on your Google account
2. Generate an App Password:
   - Go to Google Account > Security > 2-Step Verification > App passwords
   - Select "Mail" and your device
   - Copy the generated password

3. Use in `.env`:
```env
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
```

### Other Email Providers

For SendGrid, Mailgun, or other providers, adjust the SMTP settings accordingly.

## 🐛 Troubleshooting

**Database connection issues:**
- Verify your DATABASE_URL is correct
- Ensure your database is accessible (check firewall rules)
- Run `npx prisma db push` to sync schema

**Build errors:**
- Clear `.next` folder: `Remove-Item -Recurse -Force .next`
- Delete `node_modules` and reinstall: `Remove-Item -Recurse -Force node_modules; npm install`
- Clear Prisma client: `npx prisma generate`

**Authentication not working:**
- Verify NEXTAUTH_SECRET is set and is a strong random string
- Check NEXTAUTH_URL matches your deployment URL
- Clear cookies and try again

## 📄 License

© 2025 Psych-Skills. All rights reserved.

## 🤝 Support

For technical support or questions:
- Master Admin: [Your contact details]
- Documentation: See this README
- Issues: Check the troubleshooting section above

---

**Last Updated**: January 2025
**Version**: 1.0.0
Denise Website- Next.js
