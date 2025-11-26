# Microsoft 365 Email Setup Guide

**Date:** November 25, 2025  
**Admin Account:** Denise.Hill@PsychSkills.onmicrosoft.com  
**Client-Facing Email:** info@psych-skills.co.uk  
**Service:** Microsoft 365 Business Basic

---

## ✅ What's Been Updated

### 1. Environment Variables Changed
- **Old:** Gmail SMTP (`smtp.gmail.com`)
- **New:** Microsoft 365 SMTP (`smtp.office365.com`)
- **Auth Account:** `Denise.Hill@PsychSkills.onmicrosoft.com` (for sending)
- **Email From:** `Dr Denise Hill - Psych-Skills <info@psych-skills.co.uk>` (what clients see)
- **Reply To:** `info@psych-skills.co.uk` (where replies go)

### 2. Email Functionality Enhanced
- ✅ All client emails are BCC'd to `Denise.Hill@PsychSkills.onmicrosoft.com` for Outlook audit trail
- ✅ Custom messages from dashboard go in emails
- ✅ Accept/Decline/Propose Alternative workflow
- ✅ Emails persist in Outlook even if deleted from dashboard

### 3. New Workflow
**Booking Requests:**
1. Client submits booking → Auto-reply sent: "Request received, Dr Hill will respond within 2 days"
2. Dr Hill reviews in dashboard
3. Dr Hill can:
   - **Accept** → Write custom welcome message → Client receives confirmation
   - **Decline** → Write reason + propose alternative time → Client receives update
   - **Propose Alternative** → Suggest different time → Client receives proposal
4. All emails copied to info@psych-skills.co.uk inbox (BCC)

**Contact Forms:**
1. Client submits form → Auto-reply: "We received your message"
2. Admin email sent to info@psych-skills.co.uk
3. All emails copied to Outlook inbox

---

## 🔧 Setup Steps for Vercel Production

### Step 1: Get Your Microsoft 365 SMTP Password

You have **two options**:

#### Option A: Use App Password (Recommended ⭐)

1. Go to https://account.microsoft.com/security
2. Sign in with `Denise.Hill@PsychSkills.onmicrosoft.com` (your admin account)
3. Click **Advanced security options**
4. Under **App passwords**, click **Create a new app password**
5. Name it: "Psych-Skills Website"
6. **Copy the password** (you'll only see it once!)
7. Save it somewhere safe (use this in Step 2)

#### Option B: Use Account Password (Simpler but less secure)

- Just use the regular password for `Denise.Hill@PsychSkills.onmicrosoft.com`
- **Note:** Won't work if MFA (multi-factor authentication) is enabled
- Not recommended for security reasons

---

### Step 2: Add Environment Variables to Vercel

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Click on your `psych-skills` project

2. **Navigate to Settings:**
   - Click **Settings** tab
   - Click **Environment Variables** in left sidebar

3. **Add/Update These Variables:**

   Click **Add New** or **Edit** for each:

   | Variable Name | Value | Environments |
   |--------------|-------|--------------|
   | `EMAIL_SERVER_HOST` | `smtp.office365.com` | ✅ Production, Preview, Development |
   | `EMAIL_SERVER_PORT` | `587` | ✅ Production, Preview, Development |
   | `EMAIL_SERVER_USER` | `Denise.Hill@PsychSkills.onmicrosoft.com` | ✅ Production, Preview, Development |
   | `EMAIL_SERVER_PASSWORD` | `[YOUR APP PASSWORD FROM STEP 1]` | ✅ Production, Preview, Development |
   | `EMAIL_FROM` | `Dr Denise Hill - Psych-Skills <info@psych-skills.co.uk>` | ✅ Production, Preview, Development |
   | `EMAIL_REPLY_TO` | `info@psych-skills.co.uk` | ✅ Production, Preview, Development |
   | `ADMIN_EMAIL` | `Denise.Hill@PsychSkills.onmicrosoft.com` | ✅ Production, Preview, Development |

4. **Remove Old Google Variables (if they exist):**
   - Delete: `GOOGLE_CALENDAR_CLIENT_EMAIL`
   - Delete: `GOOGLE_CALENDAR_PRIVATE_KEY`
   - Delete: `GOOGLE_CALENDAR_ID`
   - (These were for Google Calendar - no longer needed)

5. **Save and Redeploy:**
   - After adding all variables, go to **Deployments** tab
   - Click the three dots (...) on latest deployment
   - Click **Redeploy**
   - Wait 2-3 minutes for deployment

---

### Step 3: Test Email Functionality

1. **Test Booking Submission:**
   - Go to: https://www.psych-skills.co.uk/bookings
   - Submit a test booking
   - Check:
     - ✅ Auto-reply received to your test email
     - ✅ Notification received at info@psych-skills.co.uk
     - ✅ Both emails appear in Outlook inbox

2. **Test Booking Response from Dashboard:**
   - Log in to admin dashboard
   - Go to Bookings section
   - Click on test booking
   - Write custom message in notes
   - Click "Confirm Booking"
   - Check:
     - ✅ Client receives confirmation with your custom message
     - ✅ Copy appears in info@psych-skills.co.uk Outlook inbox

3. **Test Contact Form:**
   - Go to: https://www.psych-skills.co.uk/contact
   - Submit test message
   - Check:
     - ✅ Auto-reply received
     - ✅ Notification at Denise.Hill@PsychSkills.onmicrosoft.com
     - ✅ Both in Outlook inbox

---

## 📋 Local Development Setup (Optional)

If you want to test emails locally:

1. **Create `.env.local` file** (in project root):
   ```env
   EMAIL_SERVER_HOST="smtp.office365.com"
   EMAIL_SERVER_PORT="587"
   EMAIL_SERVER_USER="Denise.Hill@PsychSkills.onmicrosoft.com"
   EMAIL_SERVER_PASSWORD="your-app-password-here"
   EMAIL_FROM="Dr Denise Hill - Psych-Skills <info@psych-skills.co.uk>"
   EMAIL_REPLY_TO="info@psych-skills.co.uk"
   ADMIN_EMAIL="Denise.Hill@PsychSkills.onmicrosoft.com"
   NEXT_PUBLIC_SITE_URL="http://localhost:3000"
   ```

2. **Never commit `.env.local` to git** (already in .gitignore)

3. **Restart dev server:**
   ```powershell
   npm run dev
   ```

---

## 📧 How Emails Work Now

### Booking Workflow

**1. Client Submits Booking:**
- **To Client:** "Thank you for your booking request..."
- **To Admin (info@):** "New booking request from [Client Name]..."
- **BCC:** Copy of client email to info@ (appears in Outlook)

**2. Dr Hill Accepts Booking:**
- Dashboard → Select booking → Write custom message → Click "Confirm"
- **To Client:** "Your booking is confirmed! [Custom message from Dr Hill]"
- **BCC:** Copy to info@ (appears in Outlook)
- **Calendar:** Event created (if Google Calendar configured)

**3. Dr Hill Declines/Proposes Alternative:**
- Dashboard → Select booking → Write reason + propose new time → Change status to "Declined"
- **To Client:** "Booking update: [Custom message] Alternative time: [Proposed time]"
- **BCC:** Copy to info@ (appears in Outlook)

### Contact Form Workflow

**1. Client Submits Contact Form:**
- **To Client:** "Thank you for contacting us..."
- **To Admin (info@):** "New contact form submission from [Name]"
- **BCC:** Copy of client email to info@

**2. Dr Hill Responds:**
- Check info@psych-skills.co.uk inbox in Outlook
- Reply directly from Outlook
- Full conversation thread preserved

---

## 🔍 Troubleshooting

### "Authentication Failed" Error

**Problem:** Email sends fail with authentication error

**Solutions:**
1. **Check password:** Make sure you used the App Password (not account password)
2. **Re-generate App Password:**
   - Delete old one at https://account.microsoft.com/security
   - Create new one
   - Update Vercel environment variable
   - Redeploy

3. **Check MFA:** If MFA is enabled, you MUST use App Password (Option A above)

### Emails Not Appearing in Outlook

**Problem:** Emails sent but not in info@ inbox

**Check:**
1. **Spam folder:** Check Junk Email in Outlook
2. **Sent Items:** BCC emails won't appear in Sent Items (normal behavior)
3. **Wait:** Can take 1-2 minutes for emails to arrive

**Solution:**
- Create Outlook rule: Move emails with subject containing "Psych-Skills" to specific folder

### Emails Not Sending at All

**Problem:** No emails received anywhere

**Check:**
1. **Vercel logs:**
   - Go to Vercel Dashboard → Your Project → Deployments
   - Click on latest deployment
   - Click "View Function Logs"
   - Look for "Email sent" or "Email error" messages

2. **Environment variables:**
   - Verify all 6 variables are set correctly
   - Check for typos in email address
   - Verify password is correct

3. **Microsoft 365 status:**
   - Check: https://status.office365.com
   - Verify service is operational

### Test Email Not Working

**Problem:** Test emails fail during development

**Check:**
1. **`.env.local` exists** in project root
2. **Password is correct** in `.env.local`
3. **Restart dev server** after creating `.env.local`
4. **Check console logs** for error messages

---

## ✨ New Dashboard Features

### Booking Management

**Accept Booking:**
1. Go to Admin Dashboard → Bookings
2. Click on pending booking
3. Write custom welcome message in notes field (optional):
   ```
   Looking forward to working with you! Please prepare a list of your current goals for our first session.
   ```
4. Click "Confirm Booking"
5. Client receives confirmation email with your message

**Decline Booking:**
1. Click on booking
2. Write reason in notes:
   ```
   Unfortunately, I'm fully booked on this date. I can offer:
   - Tuesday 3pm
   - Wednesday 2pm
   - Friday 11am
   
   Please let me know which works best for you.
   ```
3. Enter proposed date and time fields (if offering alternative)
4. Change status to "Declined"
5. Click Save
6. Client receives update email with your message

**Email Audit Trail:**
- Every email sent appears in Denise.Hill@PsychSkills.onmicrosoft.com Outlook inbox
- Even if you delete booking from dashboard, email stays in Outlook
- Full conversation history preserved

---

## 🚀 Deployment Checklist

Before going live with emails:

- [ ] Microsoft 365 subscription active
- [ ] Denise.Hill@PsychSkills.onmicrosoft.com mailbox accessible
- [ ] App Password generated (or account password ready)
- [ ] All 6 environment variables added to Vercel
- [ ] Old Google variables removed (if any)
- [ ] Vercel redeployed after adding variables
- [ ] Test booking submitted and emails received
- [ ] Test contact form submitted and emails received
- [ ] Dashboard booking confirmation tested
- [ ] Outlook inbox checked for BCC copies
- [ ] Spam folder checked (shouldn't be there, but verify)

---

## 📞 Support

**If emails still don't work after following this guide:**

1. **Check Vercel logs** for error messages
2. **Verify Microsoft 365** account is active
3. **Test SMTP credentials** using online SMTP tester
4. **Contact support** with error logs

**Common Error Messages:**

- `Authentication failed` → Wrong password
- `Connection timeout` → Firewall blocking port 587
- `Recipient address rejected` → Typo in email address
- `Quota exceeded` → Microsoft 365 daily send limit reached (10,000/day)

---

## 🎯 Summary

**What You Need:**
1. App Password from Microsoft 365
2. Add 6 environment variables to Vercel
3. Redeploy

**What You Get:**
- ✅ Auto-reply emails on booking/contact submissions
- ✅ Custom messages from dashboard in emails
- ✅ Accept/Decline/Propose Alternative workflow
- ✅ Full audit trail in Outlook inbox
- ✅ Professional branded emails from info@psych-skills.co.uk

**Time Required:**
- Setup: 10-15 minutes
- Testing: 5-10 minutes
- **Total: 20-25 minutes**

---

Good luck! 🚀
