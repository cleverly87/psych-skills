# Email & Google Calendar Setup Guide

This guide will help you configure automated emails and Google Calendar integration for Psych-Skills.

## 📧 Email Configuration (Gmail)

### Step 1: Create a Gmail App Password

1. **Go to your Google Account**: https://myaccount.google.com/
2. **Enable 2-Step Verification** (if not already enabled):
   - Click "Security" in the left sidebar
   - Under "Signing in to Google", click "2-Step Verification"
   - Follow the prompts to enable it

3. **Create an App Password**:
   - Return to Security settings
   - Under "Signing in to Google", click "App passwords"
   - Select "Mail" for the app and "Other" for the device
   - Name it "Psych-Skills Website"
   - Click "Generate"
   - **Copy the 16-character password** (you'll only see this once)

### Step 2: Add Email Credentials to Environment Variables

Add these to your `.env` file (local) and Vercel environment variables (production):

```bash
EMAIL_SERVER_USER=info@psych-skills.co.uk
EMAIL_SERVER_PASSWORD=your-16-character-app-password
EMAIL_FROM=info@psych-skills.co.uk
ADMIN_EMAIL=info@psych-skills.co.uk
```

### Step 3: Test Email Configuration

The email system is already integrated. Once you add the credentials:

1. **Booking Request**: Client submits a booking
   - ✅ Client receives: "Booking Request Received" email
   - ✅ You receive: "New Booking Request" notification

2. **Contact Form**: Someone contacts you
   - ✅ Sender receives: "Thank you for contacting" email
   - ✅ You receive: "New Contact Form" notification

3. **Booking Confirmed**: You confirm a booking in admin panel
   - ✅ Client receives: "Booking Confirmed" email with calendar link

---

## 📅 Google Calendar Integration

### Step 1: Create a Google Cloud Project

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project**:
   - Click "Select a project" dropdown
   - Click "New Project"
   - Name: "Psych-Skills Calendar"
   - Click "Create"

### Step 2: Enable Google Calendar API

1. **In your project**, go to "APIs & Services" > "Library"
2. **Search for "Google Calendar API"**
3. **Click on it** and then click "Enable"

### Step 3: Create a Service Account

1. **Go to** "APIs & Services" > "Credentials"
2. **Click** "Create Credentials" > "Service Account"
3. **Fill in details**:
   - Service account name: `psych-skills-calendar`
   - Service account ID: (auto-generated)
   - Click "Create and Continue"
4. **Grant this service account access** (optional, can skip)
5. **Click "Done"**

### Step 4: Create Service Account Key

1. **Click on the service account** you just created
2. **Go to the "Keys" tab**
3. **Click** "Add Key" > "Create new key"
4. **Choose JSON format**
5. **Click "Create"** - A JSON file will download
6. **IMPORTANT**: Keep this file secure! Don't commit it to Git

### Step 5: Share Your Google Calendar with the Service Account

1. **Open Google Calendar**: https://calendar.google.com/
2. **Find the calendar** you want to use (or create a new one called "Psych-Skills Bookings")
3. **Click the three dots** next to the calendar name
4. **Click "Settings and sharing"**
5. **Scroll to "Share with specific people"**
6. **Click "Add people"**
7. **Paste the service account email** from the JSON file (looks like: `psych-skills-calendar@project-id.iam.gserviceaccount.com`)
8. **Set permission to** "Make changes to events"
9. **Click "Send"**

### Step 6: Get Your Calendar ID

1. **In Calendar Settings**, scroll to "Integrate calendar"
2. **Copy the Calendar ID** (looks like: `your-email@gmail.com` or a long string ending in `@group.calendar.google.com`)

### Step 7: Add Calendar Credentials to Environment Variables

From the downloaded JSON file, extract these values and add to your `.env`:

```bash
GOOGLE_CALENDAR_CLIENT_EMAIL=psych-skills-calendar@project-id.iam.gserviceaccount.com
GOOGLE_CALENDAR_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_VERY_LONG_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_CALENDAR_ID=your-calendar-id@gmail.com
```

**IMPORTANT**: 
- The private key should include the `\\n` characters as shown
- Keep quotes around the private key
- Never commit these to Git

### For Production (Vercel):

1. **Go to Vercel Dashboard** > Your Project > Settings > Environment Variables
2. **Add each variable**:
   - `GOOGLE_CALENDAR_CLIENT_EMAIL`
   - `GOOGLE_CALENDAR_PRIVATE_KEY` (paste the entire key with newlines)
   - `GOOGLE_CALENDAR_ID`
3. **Make sure** to select the appropriate environments (Production, Preview, Development)
4. **Redeploy** your application

---

## 🧪 Testing

### Test Email System:

1. **Submit a booking** on your website
2. **Check your email** for the notification
3. **Check the test email address** for the confirmation

### Test Calendar Integration:

1. **Go to Admin Dashboard** > Bookings
2. **Confirm a pending booking**
3. **Check Google Calendar** for the new event
4. **Client should receive** confirmation email with "Add to Calendar" link

---

## ✅ What Happens Automatically

### When a Client Books a Session:

1. ✅ Booking saved to database with status "PENDING"
2. ✅ Client receives "Thank you for your booking request" email
3. ✅ You receive "New booking request" notification email

### When You Confirm a Booking:

1. ✅ Booking status updated to "CONFIRMED"
2. ✅ **Google Calendar event created automatically** with:
   - Client name and contact details
   - Session type and notes
   - Correct date and time
   - Email reminder 24 hours before
   - Popup reminder 1 hour before
3. ✅ Client receives "Booking Confirmed" email with:
   - Session details
   - Link to add to their calendar
   - Preparation information

### When a Client Contacts You:

1. ✅ Message saved to database
2. ✅ You receive notification email with their message
3. ✅ Client receives "Thank you for contacting us" auto-reply

---

## 🔧 Troubleshooting

### Emails Not Sending:

- Verify Gmail App Password is correct (16 characters, no spaces)
- Check that 2-Step Verification is enabled on Google account
- Check Vercel logs for email errors
- Ensure `EMAIL_SERVER_USER` matches the Gmail account

### Calendar Events Not Creating:

- Verify service account has been shared the calendar
- Check that Calendar API is enabled in Google Cloud
- Verify private key is formatted correctly (includes `\\n` characters)
- Check Vercel logs for calendar API errors
- Make sure the service account email is exact

### Testing Locally:

Both email and calendar will work in development if you add the credentials to your local `.env` file.

---

## 📊 SEO Enhancements Implemented

### JSON-LD Structured Data:
- ✅ Organization schema with Dr. Denise Hill details
- ✅ Person schema for Dr. Denise Hill
- ✅ Service schema for sports psychology offerings
- ✅ Local business markup with location and contact info

### Enhanced Metadata:
- ✅ Title optimized for "Dr Denise Hill" + "Golf Psychology" + "Sports Psychologist"
- ✅ 20 targeted keywords including variations
- ✅ OpenGraph and Twitter cards with images
- ✅ Author and publisher attribution

### Technical SEO:
- ✅ Sitemap.xml with all pages
- ✅ Robots.txt configured
- ✅ Canonical URLs
- ✅ Proper heading hierarchy
- ✅ Alt text on images
- ✅ Mobile responsive
- ✅ Fast load times

### Target Keywords Now Optimized:
- Dr Denise Hill
- Dr. Denise Hill sports psychologist
- Denise Hill golf psychology
- Sports psychologist UK
- Golf psychologist Wales
- Elite sports psychology
- Golf psychology expert
- CASES-SEPAR psychologist
- Mental performance coach
- Sports psychology Swansea

The site is now fully optimized to rank for Dr. Denise Hill and all related sports psychology terms!

---

## 🚀 Next Steps

1. ✅ Set up Gmail App Password
2. ✅ Add email credentials to Vercel
3. ✅ Create Google Cloud project
4. ✅ Enable Calendar API
5. ✅ Create service account
6. ✅ Share calendar with service account
7. ✅ Add calendar credentials to Vercel
8. ✅ Test booking flow
9. ✅ Submit site to Google Search Console
10. ✅ Build backlinks and content for SEO

**All the code is ready to go - you just need to add the credentials!**
