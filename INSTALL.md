# Installation Instructions

## Quick Install (3 Steps)

### 1. Install Dependencies

```powershell
npm install
```

**What this does**: Downloads and installs all required packages (React, Next.js, Tailwind, Prisma, etc.)

**Time**: 2-3 minutes

**You'll see**: A progress bar and list of packages being installed

---

### 2. Set Up Environment

```powershell
Copy-Item .env.example .env
```

**Then edit `.env` file** and add:

**Minimum Required Settings:**

```env
DATABASE_URL="your-postgres-connection-string"
NEXTAUTH_SECRET="run-this-command-to-generate-below"
```

**Generate NEXTAUTH_SECRET:**

```powershell
# Run this command and copy the output to .env
$secret = -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
Write-Output "NEXTAUTH_SECRET=$secret"
```

---

### 3. Set Up Database

```powershell
# Generate Prisma Client
npx prisma generate

# Create database tables
npx prisma db push
```

**You'll see**: "Your database is now in sync with your schema."

---

## Start the App

```powershell
npm run dev
```

**Open**: http://localhost:3000

---

## Getting a Database (Choose One)

### Option A: Vercel Postgres (Easiest)

1. Go to https://vercel.com/signup
2. Create new project
3. Go to Storage → Create Database → Postgres
4. Copy connection string to `.env`

**Free tier**: 60 hours compute/month

### Option B: Supabase (Generous Free Tier)

1. Go to https://supabase.com/
2. Create new project
3. Go to Settings → Database
4. Copy connection string (use "Connection pooling" string)
5. Paste into `.env` as `DATABASE_URL`

**Free tier**: Unlimited

### Option C: Neon (Serverless Postgres)

1. Go to https://neon.tech/
2. Create new project
3. Copy connection string
4. Paste into `.env`

**Free tier**: 0.5GB storage

---

## Complete .env Template

Here's everything you can configure (only DATABASE_URL and NEXTAUTH_SECRET are required initially):

```env
# Required
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"

# Optional - Admin Login (default shown)
ADMIN_EMAIL="admin@psych-skills.com"
ADMIN_PASSWORD="ChangeThisPassword123!"

# Optional - Email (skip for testing)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="Psych-Skills <noreply@psych-skills.com>"

# Optional - Site Config
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="Psych-Skills"
```

---

## Troubleshooting

### "Module not found" errors

```powershell
npm install
```

### Database connection failed

- Check your `DATABASE_URL` is correct
- Verify database is accessible
- Try the connection string in Prisma Studio: `npx prisma studio`

### Port 3000 already in use

```powershell
# Use a different port
npm run dev -- -p 3001
```

Then visit http://localhost:3001

### Clear everything and start fresh

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .next
npm install
npx prisma generate
npm run dev
```

---

## What to Do After Install

1. **Test the Site**: Visit http://localhost:3000
2. **Try Booking**: Go to /bookings and make a test booking
3. **View Database**: Run `npx prisma studio` to see your data
4. **Access Admin**: Go to /admin/login (use credentials from .env)

---

## Need Help?

- Check `SETUP.md` for detailed setup guide
- Check `README.md` for full documentation
- Check `PROJECT.md` for project overview

---

**Estimated Total Time**: 10-15 minutes (including database setup)
