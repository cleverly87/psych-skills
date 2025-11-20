# Psych-Skills Website - Quick Start Guide

## 🚀 First Time Setup

This guide will help you get the Psych-Skills website up and running on your local machine.

### Step 1: Install Dependencies

Open PowerShell in the project directory and run:

```powershell
npm install
```

This will install all required packages (Next.js, React, Tailwind CSS, Prisma, etc.). It may take a few minutes.

### Step 2: Set Up Environment Variables

1. Copy the example environment file:

```powershell
Copy-Item .env.example .env
```

2. Open the `.env` file and configure it:

**Required Settings:**

```env
# Database Connection
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"

# NextAuth Secret (generate with: openssl rand -base64 32)
NEXTAUTH_SECRET="your-generated-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# Admin Login Credentials
ADMIN_EMAIL="admin@psych-skills.com"
ADMIN_PASSWORD="ChangeThisPassword123!"

# Email Settings (for booking notifications)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="Psych-Skills <noreply@psych-skills.com>"
```

### Step 3: Set Up the Database

#### Option A: Using Vercel Postgres (Recommended for deployment)

1. Go to [vercel.com](https://vercel.com) and create an account
2. Create a new project
3. Go to Storage tab → Create Database → Choose Postgres
4. Copy the connection string to your `.env` file as `DATABASE_URL`

#### Option B: Using Supabase (Free tier available)

1. Go to [supabase.com](https://supabase.com) and create an account
2. Create a new project
3. Go to Project Settings → Database
4. Copy the connection string and paste it into `.env` as `DATABASE_URL`

#### Option C: Local PostgreSQL

If you have PostgreSQL installed locally:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/psychskills"
```

### Step 4: Initialize the Database

Run these commands to set up your database schema:

```powershell
# Generate Prisma Client
npx prisma generate

# Create the database tables
npx prisma db push
```

You should see a success message indicating all tables were created.

### Step 5: Generate NextAuth Secret

Generate a secure secret for authentication:

```powershell
# On Windows PowerShell
$secret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
Write-Output "NEXTAUTH_SECRET=$secret"
```

Copy the output and paste it into your `.env` file.

### Step 6: Configure Email (Optional for development)

For testing, you can skip email configuration initially. The booking system will work, but you won't receive email notifications.

**To enable emails with Gmail:**

1. Enable 2-factor authentication on your Google account
2. Generate an App Password:
   - Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and generate
3. Use the generated password in `.env` as `EMAIL_SERVER_PASSWORD`

### Step 7: Start the Development Server

```powershell
npm run dev
```

The website will be available at: **http://localhost:3000**

You should see:
- ✅ Compiled successfully
- ✅ Ready on http://localhost:3000

## 🎯 What to Do Next

### Test the Website

1. **Homepage**: http://localhost:3000
   - Check the hero section, services overview, testimonials

2. **About Page**: http://localhost:3000/about
   - Review Dr. Hill's biography and credentials

3. **Services Page**: http://localhost:3000/services
   - View all service offerings

4. **Booking Page**: http://localhost:3000/bookings
   - Try making a test booking
   - Select a service, date, time, and fill in details

5. **Contact Page**: http://localhost:3000/contact
   - Test the contact form

### Access the Admin Area

1. Navigate to: http://localhost:3000/admin/login
2. Log in with the credentials from your `.env` file
3. Explore the admin dashboard:
   - View bookings
   - Manage content
   - Set availability

## 🛠️ Development Tools

### View the Database

Open Prisma Studio to view and edit database records:

```powershell
npx prisma studio
```

This opens a GUI at http://localhost:5555 where you can:
- View all bookings
- Add test testimonials
- Create blog posts
- Manage services

### Check for Errors

If you encounter any errors:

```powershell
# Clear the build cache
Remove-Item -Recurse -Force .next

# Reinstall dependencies
Remove-Item -Recurse -Force node_modules
npm install

# Regenerate Prisma Client
npx prisma generate
```

## 📝 Common Issues & Solutions

### "Cannot find module" errors

**Solution**: Run `npm install` to ensure all dependencies are installed.

### Database connection errors

**Solution**: 
- Verify your `DATABASE_URL` is correct
- Ensure your database is running
- Check firewall settings

### Authentication not working

**Solution**:
- Ensure `NEXTAUTH_SECRET` is set and is a random string
- Clear browser cookies
- Restart the development server

### Email not sending

**Solution**:
- Verify email credentials are correct
- Check if 2FA and App Password are set up (for Gmail)
- For development, emails are logged to console even if not sent

## 🎨 Customization

### Change Colors

Edit `tailwind.config.ts`:

```typescript
primary: {
  DEFAULT: 'hsl(142 76% 36%)', // Change this green color
}
```

### Update Content

- **Homepage**: Edit `app/page.tsx`
- **About Page**: Edit `app/about/page.tsx`
- **Services**: Edit `app/services/page.tsx`

### Add Your Logo

Replace the text logo in `components/layout/header.tsx`:

```tsx
<Image src="/logo.png" alt="Psych-Skills" width={200} height={50} />
```

Place your logo file in the `public/` folder.

## 📚 Next Steps

1. **Add Content**: Use Prisma Studio or the admin interface to add:
   - Testimonials
   - Blog posts
   - Service details

2. **Configure Availability**: Set your working hours in the admin dashboard

3. **Test Booking Flow**: Make a test booking and verify email notifications work

4. **Customize Design**: Adjust colors, fonts, and layout to match your brand

5. **Deploy**: When ready, deploy to Vercel (see main README for deployment guide)

## 🆘 Need Help?

- Check the main `README.md` for detailed documentation
- Review error messages in the terminal
- Check browser console for frontend errors
- Use Prisma Studio to inspect database state

## ✅ Checklist

Before considering setup complete:

- [ ] npm install completed successfully
- [ ] .env file configured with all required variables
- [ ] Database connected and schema created
- [ ] Development server running at http://localhost:3000
- [ ] Can access and navigate the website
- [ ] Can access admin area at /admin/login
- [ ] Test booking completes successfully
- [ ] Email notifications working (or configured for later)

---

**Congratulations!** Your Psych-Skills website is now running locally. 🎉
