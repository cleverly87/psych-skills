# Email Reply Automation Setup Guide

## Overview
This system automatically monitors the info@psych-skills.co.uk inbox and adds client email replies to dashboard conversations.

## How It Works
1. Client replies to an email from Dr. Hill
2. Email arrives in info@psych-skills.co.uk inbox
3. Cron job runs every 5 minutes
4. System reads unread emails via Microsoft Graph API
5. Matches email to contact submission or booking
6. Creates reply in database
7. Marks email as read
8. Reply appears in dashboard conversation

---

## Setup Steps

### Step 1: Create Azure App Registration (5 minutes)

1. **Go to Azure Portal:**
   - Visit https://portal.azure.com
   - Sign in with: `Denise.Hill@PsychSkills.onmicrosoft.com`

2. **Create App Registration:**
   - Search for "App registrations" in the top search bar
   - Click "New registration"
   - **Name:** `Psych-Skills Email Monitor`
   - **Supported account types:** "Accounts in this organizational directory only (PsychSkills only - Single tenant)"
   - **Redirect URI:** Leave blank
   - Click "Register"

3. **Copy Application Details:**
   - You'll see the app overview page
   - **Copy these values:**
     - `Application (client) ID` → This is your **AZURE_CLIENT_ID**
     - `Directory (tenant) ID` → This is your **AZURE_TENANT_ID**

4. **Create Client Secret:**
   - In the left menu, click "Certificates & secrets"
   - Click "New client secret"
   - **Description:** `Email Monitor Secret`
   - **Expires:** 24 months (or never)
   - Click "Add"
   - **IMPORTANT:** Copy the **Value** immediately → This is your **AZURE_CLIENT_SECRET**
   - (You can't see it again after leaving this page!)

5. **Add API Permissions:**
   - In the left menu, click "API permissions"
   - Click "Add a permission"
   - Click "Microsoft Graph"
   - Click "Application permissions" (NOT Delegated)
   - Search and add these permissions:
     - `Mail.Read` ✓
     - `Mail.ReadWrite` ✓
   - Click "Add permissions"
   - **IMPORTANT:** Click "Grant admin consent for PsychSkills" button at the top
   - Click "Yes" to confirm

### Step 2: Update .env File

Add these three lines to your `.env` file:

```env
# Azure App Registration (for email monitoring)
AZURE_TENANT_ID="your-directory-tenant-id-here"
AZURE_CLIENT_ID="your-application-client-id-here"
AZURE_CLIENT_SECRET="your-client-secret-value-here"

# Optional: Secure the cron endpoint
CRON_SECRET="generate-a-random-string-here"
```

**Replace the placeholder values** with the actual values you copied from Azure Portal.

### Step 3: Test the Email Monitor

1. **Restart your development server:**
   ```powershell
   npm run dev
   ```

2. **Test the endpoint manually:**
   - Open browser: http://localhost:3000/api/cron/monitor-emails
   - You should see: `{"success":true,"timestamp":"...","processed":0,"errors":0}`

3. **Test with a real email:**
   - Send a test contact submission through the website
   - Reply from dashboard to the client
   - Have the client reply to that email
   - Wait for email to arrive in info@psych-skills.co.uk inbox
   - Visit: http://localhost:3000/api/cron/monitor-emails
   - Check dashboard - client reply should appear in conversation!

### Step 4: Set Up Automated Cron Job

You need to call the `/api/cron/monitor-emails` endpoint every 5 minutes.

#### Option A: Vercel Cron (Recommended when deployed)

1. Create `vercel.json` in your project root:
```json
{
  "crons": [
    {
      "path": "/api/cron/monitor-emails",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

2. Deploy to Vercel - cron will run automatically

#### Option B: External Cron Service (For development/testing)

Use a free service like cron-job.org:

1. Go to https://cron-job.org/en/
2. Create free account
3. Create new cron job:
   - **Title:** Psych Skills Email Monitor
   - **URL:** `https://www.psych-skills.co.uk/api/cron/monitor-emails`
   - **Schedule:** Every 5 minutes
   - If you set CRON_SECRET, add header: `Authorization: Bearer your-cron-secret`

#### Option C: Windows Task Scheduler (Local development)

1. Open Task Scheduler
2. Create Basic Task:
   - **Name:** Psych Skills Email Monitor
   - **Trigger:** Daily, repeat every 5 minutes
   - **Action:** Start a program
   - **Program:** `powershell.exe`
   - **Arguments:** `-Command "Invoke-RestMethod http://localhost:3000/api/cron/monitor-emails"`

---

## How to Use

**Once set up, it's completely automatic:**

1. ✅ You send message from dashboard → Client gets email
2. ✅ Client replies to email → Goes to info@psych-skills.co.uk inbox
3. ✅ Cron job runs (every 5 minutes) → Reads unread emails
4. ✅ Finds matching conversation → Creates reply in database
5. ✅ Reply appears in dashboard → Marks email as read
6. ✅ Email stays in Outlook for reference

**You don't do anything** - just check the dashboard and the client replies will be there!

---

## Verification

### Check if it's working:

1. **View logs in terminal:**
   - Look for: `📧 Found X unread emails`
   - Look for: `✅ Added client reply to contact submission...`

2. **Check dashboard:**
   - Open contact submission or booking
   - Client replies should appear with green background
   - Your replies have blue background

3. **Check Outlook:**
   - Client reply emails should be marked as read
   - They remain in inbox (not deleted)

### Troubleshooting:

**"Azure credentials not configured"**
- Make sure AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET are in .env
- Restart dev server after adding them

**"No new emails to process"**
- Normal - means no unread emails in inbox
- Send a test email reply to trigger it

**Client reply not appearing:**
- Check email is from the same address as the contact/booking
- Check email subject starts with "Re:"
- Check contact submission is not archived
- Check booking status is PENDING or CONFIRMED

**"Unauthorized" error:**
- Go back to Azure Portal → API permissions
- Click "Grant admin consent" button
- Make sure Mail.Read and Mail.ReadWrite show green checkmarks

---

## Security Notes

- ✅ Uses Application permissions (not user delegation)
- ✅ Only reads emails, doesn't send or delete
- ✅ Marks processed emails as read (prevents re-processing)
- ✅ Client secret is encrypted in .env (never commit to git)
- ✅ Optional CRON_SECRET protects endpoint from unauthorized access

## Costs

**Total cost: £0.00**

- Azure App Registration: Free
- Microsoft Graph API: Free (included with M365)
- API calls: Unlimited for typical use

---

## What Gets Processed

✅ **Will be added to dashboard:**
- Emails with subject starting with "Re:"
- From email address matching a contact submission or booking
- Contains conversation ID [CS:xxxxx] or [BK:xxxxx] in subject (preferred)
- Or fallback: matches most recently updated conversation for that email
- Contact submission must be active (not archived)
- Booking must be PENDING or CONFIRMED status

❌ **Will be ignored/skipped:**
- Auto-replies and out-of-office messages
- Notification emails (booking confirmations, updates, etc.)
- Emails from info@psych-skills.co.uk (system-sent)
- New emails (not replies - subject doesn't start with "Re:")
- Emails from unknown senders (no matching conversation)
- Archived contact submissions
- Completed/Cancelled bookings
- Emails with no content after cleaning

## How Conversations Are Matched

The system uses a **3-tier matching strategy** to prevent merging different conversations:

### 1. **Conversation ID Match** (Most Accurate - Primary Method)
- Every email you send includes a unique ID in the subject line
- Contact submissions: `[CS:abc123]`
- Bookings: `[BK:xyz789]`
- When client replies, the ID stays in the subject
- System extracts the ID and matches to exact conversation
- ✅ **100% accurate** - impossible to mix up conversations

### 2. **Email + Status Validation**
- Verifies the sender's email matches the conversation record
- Checks conversation is still active (not archived/cancelled)
- Prevents unauthorized replies being added

### 3. **Fallback: Email Address Match** (When ID Missing)
- If conversation ID not found in subject (e.g., client manually started new email)
- Matches to **most recently updated** conversation for that email address
- Only matches active conversations (not archived/completed)
- Logs warning so you know it used fallback method

### Examples:

**Scenario 1: Normal Reply (Best Case)**
- You send: "Re: Your question [CS:cm123xyz] - Dr Denise Hill"
- Client replies: "Re: Re: Your question [CS:cm123xyz] - Dr Denise Hill"
- ✅ System extracts `cm123xyz`, finds exact contact submission, adds reply

**Scenario 2: Multiple Active Conversations**
- Client has 2 contact submissions (general question + booking inquiry)
- You reply to booking inquiry: "Message About Your Booking [BK:bk456abc]"
- Client replies to that email
- ✅ System sees `[BK:bk456abc]`, adds to correct booking (not contact submission)

**Scenario 3: Client Manually Emails (No ID)**
- Client starts fresh email without replying
- Subject: "Quick question about my session"
- ⚠️ System logs: "No conversation ID found, attempting fallback match"
- ✅ Matches to most recent active conversation for their email
- Still works, but you'll see fallback warning in logs

**Scenario 4: Archived Conversation**
- Client replies to old archived contact submission with ID `[CS:old789]`
- ❌ System finds conversation but sees `isArchived: true`
- Logs: "Could not find contact submission old789 for client@email.com"
- Email stays unread in inbox for manual handling

## Security & Privacy

### What's Filtered Out:
1. **Auto-Replies:**
   - Out-of-office messages
   - Vacation responders  
   - Delivery receipts
   - "Automatic reply" messages

2. **Notification Emails:**
   - "Booking Confirmed" notifications
   - "Booking Update" system emails
   - "New Session Booked" admin notifications
   - Any email from `no-reply@` or `noreply@`

3. **System Emails:**
   - Emails sent from `info@psych-skills.co.uk`
   - Prevents infinite loops
   - Your sent messages won't create replies to yourself

### Content Cleaning:
- Removes email headers (From:, To:, Sent:, etc.)
- Strips quoted text (lines with ">")
- Removes HTML styling
- Filters out email signatures
- Only keeps actual message content

---

## Monitoring

The system logs everything:
- `📬 No new emails to process` - Inbox is empty
- `📧 Found X unread emails` - Processing started
- `✅ Added client reply to...` - Successfully added
- `📊 Email monitoring complete` - Summary

Check terminal/logs to see what's happening!
