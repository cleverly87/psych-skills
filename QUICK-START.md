# 🚀 Quick Start Guide

## What's New

Your site now has three major enhancements:

### 1. ✅ SEO Optimized for Google #1 Rankings
- "Dr Denise Hill" + all variations optimized
- JSON-LD structured data for Google Knowledge Graph
- Meta tags, OpenGraph, Twitter cards all enhanced
- Sitemap and robots.txt configured

### 2. ✅ Professional Email Automation
- Client books → instant professional email
- You get notification with all details
- You confirm → client gets branded confirmation
- Contact form → both get auto-emails

### 3. ✅ Google Calendar Integration
- Confirm booking → calendar event auto-created
- Client details, notes, reminders all included
- Client gets calendar link in email
- No manual calendar management needed

---

## ⚡ Quick Setup (30 Minutes Total)

### Part 1: Email Setup (5 minutes)

1. **Get Gmail App Password:**
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification (if not enabled)
   - Click "App passwords"
   - Select "Mail" and "Other"
   - Name it "Psych-Skills"
   - Copy the 16-character password

2. **Add to Vercel:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add these:
     ```
     EMAIL_SERVER_USER = info@psych-skills.co.uk
     EMAIL_SERVER_PASSWORD = your-16-character-password
     EMAIL_FROM = info@psych-skills.co.uk
     ADMIN_EMAIL = info@psych-skills.co.uk
     ```
   - Redeploy

✅ **Done!** Emails now work automatically.

---

### Part 2: Google Calendar Setup (15 minutes)

1. **Create Google Cloud Project:**
   - Go to https://console.cloud.google.com/
   - Click "New Project"
   - Name: "Psych-Skills Calendar"
   - Click "Create"

2. **Enable Calendar API:**
   - Go to "APIs & Services" → "Library"
   - Search "Google Calendar API"
   - Click "Enable"

3. **Create Service Account:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "Service Account"
   - Name: `psych-skills-calendar`
   - Click "Create and Continue" → "Done"

4. **Get Service Account Key:**
   - Click on the service account you just created
   - Go to "Keys" tab
   - Click "Add Key" → "Create new key"
   - Choose "JSON"
   - Click "Create" (downloads JSON file)

5. **Share Your Calendar:**
   - Open Google Calendar (https://calendar.google.com/)
   - Find/create calendar for bookings
   - Click three dots → "Settings and sharing"
   - Scroll to "Share with specific people"
   - Click "Add people"
   - Paste service account email from JSON (looks like: `psych-skills-calendar@project-id.iam.gserviceaccount.com`)
   - Permission: "Make changes to events"
   - Click "Send"

6. **Get Calendar ID:**
   - Still in Calendar Settings
   - Scroll to "Integrate calendar"
   - Copy the Calendar ID

7. **Add to Vercel:**
   - From your JSON file, extract these values:
     ```
     GOOGLE_CALENDAR_CLIENT_EMAIL = [from JSON: client_email]
     GOOGLE_CALENDAR_PRIVATE_KEY = [from JSON: private_key]
     GOOGLE_CALENDAR_ID = [your calendar ID from step 6]
     ```
   - Add all three to Vercel environment variables
   - Redeploy

✅ **Done!** Calendar integration active.

---

### Part 3: SEO Activation (10 minutes)

1. **Google Search Console:**
   - Go to https://search.google.com/search-console/
   - Click "Add Property"
   - Enter your domain
   - Verify ownership (DNS or HTML file)
   - Submit sitemap: `https://your-domain.com/sitemap.xml`

2. **Google Business Profile:**
   - Go to https://business.google.com/
   - Create profile for "Psych-Skills"
   - Category: "Psychologist"
   - Location: Swansea, Wales
   - Add description with "Dr Denise Hill" and keywords
   - Add photos

3. **Google Analytics (Optional):**
   - Go to https://analytics.google.com/
   - Create new property
   - Add tracking code to site

✅ **Done!** SEO tracking active.

---

## 🧪 Test Everything

### Test Emails:

1. Go to your website
2. Submit a booking request
3. Check your email for notification
4. Check the test email for confirmation
5. ✅ Both should arrive within seconds

### Test Calendar:

1. Log into admin dashboard
2. Go to Bookings
3. Click "Confirm" on a pending booking
4. Check your Google Calendar
5. ✅ Event should appear immediately
6. Check client email for confirmation with calendar link

### Test SEO:

1. Search "site:your-domain.com" on Google
2. ✅ Should see all your pages
3. View page source
4. ✅ Look for `<script type="application/ld+json">` (structured data)
5. Check meta tags in `<head>`
6. ✅ Should see "Dr Denise Hill" in title

---

## 📊 What Happens Automatically

### When Client Books:
1. ⚡ Saved to database (status: PENDING)
2. 📧 Client gets "Thank you" email
3. 📧 You get "New booking" notification
4. ⏰ All within 1-2 seconds

### When You Confirm:
1. ✅ Status → CONFIRMED
2. 📅 Calendar event created
3. 📧 Client gets confirmation email
4. 🔗 Calendar link sent to client
5. ⏰ Reminders set (24hr + 1hr)

### When Client Contacts:
1. 💾 Saved to database
2. 📧 You get notification
3. 📧 Client gets auto-reply
4. ⏰ Instant

---

## 📁 Documentation Files

If you need detailed information:

- **`SETUP-EMAIL-CALENDAR.md`** - Full setup with screenshots
- **`SEO-STRATEGY.md`** - Complete SEO strategy
- **`EMAIL-CALENDAR-FLOWS.md`** - Email examples and workflows
- **`IMPLEMENTATION-SUMMARY.md`** - What was built

---

## 🎯 Priority Actions

### Today:
1. ✅ Set up Gmail App Password
2. ✅ Add email credentials to Vercel
3. ✅ Test booking flow

### This Week:
1. ✅ Set up Google Calendar
2. ✅ Submit to Google Search Console
3. ✅ Create Google Business Profile

### This Month:
1. ✅ Publish first blog post
2. ✅ Request client testimonials
3. ✅ Monitor analytics

---

## ❓ Troubleshooting

**Emails not sending?**
- Check Gmail App Password is correct
- Verify 2-Step Verification is enabled
- Check Vercel logs for errors

**Calendar not working?**
- Verify service account has calendar access
- Check private key format (includes `\n`)
- Check Vercel logs

**SEO not showing?**
- Give Google 24-48 hours to index
- Submit sitemap manually
- Check robots.txt isn't blocking

---

## 🎉 You're All Set!

Once you add the credentials:

✅ Professional email automation
✅ Automatic calendar management  
✅ SEO optimized for #1 rankings
✅ Zero manual admin work
✅ Professional brand image

**Just add credentials and everything works! 🚀**
