# Email & Calendar Automation Flows

This document shows exactly what happens when clients interact with your website.

---

## 📨 Flow 1: Client Books a Session

### Step 1: Client Fills Out Booking Form
**What they enter:**
- Name: "John Smith"
- Email: "john@example.com"
- Phone: "07123 456789"
- Service: "One-to-One Session"
- Date: "December 15, 2025"
- Time: "2:00 PM - 3:00 PM"
- Notes: "Would like to work on pre-tournament anxiety"

### Step 2: Instant Automated Response to Client
**Email Subject:** "Booking Request Received - Dr Denise Hill | Psych-Skills"

**Email Content:**
```
Thank You for Your Booking Request

Dear John Smith,

Thank you for choosing Psych-Skills for your sports psychology needs. I have received 
your session booking request and will review it shortly.

┌─────────────────────────────────────────────┐
│ Your Booking Details                        │
├─────────────────────────────────────────────┤
│ Service: One-to-One Session                 │
│ Requested Date: Monday, December 15, 2025   │
│ Requested Time: 2:00 PM - 3:00 PM          │
│ Your Notes: Would like to work on pre-     │
│ tournament anxiety                          │
└─────────────────────────────────────────────┘

What Happens Next?

1. Review: I will review your booking request and check my availability
2. Confirmation: You will receive a confirmation email within 24-48 hours
3. Alternative Times: If the requested time is unavailable, I will propose 
   alternative options
4. Payment: Payment details and session preparation information will be 
   provided once your booking is confirmed

If you have any urgent questions or need to make changes to your request, 
please don't hesitate to contact me directly.

Best regards,
Dr. Denise Hill
Elite Sports Psychologist
CASES-SEPAR Accredited
Psych-Skills

📧 info@psych-skills.co.uk
🌐 www.psych-skills.com
```

### Step 3: Instant Notification to You (Admin)
**Email Subject:** "🔔 New Booking Request: John Smith - 15 December 2025"

**Email Content:**
```
🔔 New Booking Request

⚡ Action Required: Please review and respond to this booking request 
within 24-48 hours.

┌─────────────────────────────────────────────┐
│ Client Information                          │
├─────────────────────────────────────────────┤
│ Name: John Smith                            │
│ Email: john@example.com                     │
│ Phone: 07123 456789                         │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Session Details                             │
├─────────────────────────────────────────────┤
│ Service Type: One-to-One Session            │
│ Requested Date: Monday, December 15, 2025   │
│ Requested Time: 2:00 PM - 3:00 PM          │
│ Status: PENDING ⏳                          │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Client Notes                                │
├─────────────────────────────────────────────┤
│ "Would like to work on pre-tournament       │
│ anxiety"                                    │
└─────────────────────────────────────────────┘

                [View in Admin Dashboard →]

Next Steps:
1. Log into the admin dashboard
2. Review the booking details
3. Confirm, decline, or propose an alternative time
4. The client will be automatically notified of your decision
```

### Step 4: You Confirm the Booking (Admin Dashboard)
**What you do:**
- Log into `/admin/bookings`
- Click on John Smith's booking
- Click "Confirm Booking" button

### Step 5: Automated Actions After Confirmation

**5a. Google Calendar Event Created:**
```
Title: One-to-One Session - John Smith
Date: December 15, 2025
Time: 2:00 PM - 3:00 PM (GMT)
Location: Online

Description:
Session with John Smith
Email: john@example.com
Phone: 07123 456789
Service: One-to-One Session

Notes: Would like to work on pre-tournament anxiety

Attendees:
- john@example.com (John Smith)
- info@psych-skills.co.uk (You)

Reminders:
- Email reminder 24 hours before
- Popup reminder 1 hour before
```

**5b. Confirmation Email Sent to Client:**
**Email Subject:** "✅ Booking Confirmed - Dr Denise Hill | Psych-Skills"

**Email Content:**
```
✅ Your Session is Confirmed!

┌──────────────────────────┐
│   BOOKING CONFIRMED ✓    │
└──────────────────────────┘

Dear John Smith,

Great news! Your session has been confirmed. I'm looking forward to 
working with you.

┌─────────────────────────────────────────────┐
│ Confirmed Session Details                   │
├─────────────────────────────────────────────┤
│ Service: One-to-One Session                 │
│ Date: Monday, December 15, 2025             │
│ Time: 2:00 PM - 3:00 PM                    │
└─────────────────────────────────────────────┘

            [Add to Google Calendar →]

Preparing for Your Session

• Please arrive 5 minutes early if attending in person
• For online sessions, you'll receive a video call link 24 hours before
• Think about specific goals or challenges you'd like to address
• Bring any relevant performance data or notes if applicable

Payment Information

Payment details will be provided separately. Payment is required 24 
hours before the session.

Need to reschedule? Please provide at least 48 hours notice to avoid 
cancellation fees.

Best regards,
Dr. Denise Hill
Elite Sports Psychologist
CASES-SEPAR Accredited
Psych-Skills

📧 info@psych-skills.co.uk
🌐 www.psych-skills.com
```

---

## 📬 Flow 2: Client Contacts You

### Step 1: Client Fills Out Contact Form
**What they enter:**
- Name: "Sarah Jones"
- Email: "sarah@example.com"
- Subject: "Question about group sessions"
- Message: "Hi, I'm interested in group psychology sessions for our junior golf team. We have 8 players aged 14-16. Can you provide information about availability and pricing?"

### Step 2: Instant Notification to You (Admin)
**Email Subject:** "📨 New Contact Form: Question about group sessions - Sarah Jones"

**Email Content:**
```
📨 New Contact Form Submission

┌─────────────────────────────────────────────┐
│ Contact Information                         │
├─────────────────────────────────────────────┤
│ Name: Sarah Jones                           │
│ Email: sarah@example.com                    │
│ Subject: Question about group sessions      │
└─────────────────────────────────────────────┘

┌─────────────────────────────────────────────┐
│ Message                                     │
├─────────────────────────────────────────────┤
│ Hi, I'm interested in group psychology      │
│ sessions for our junior golf team. We have  │
│ 8 players aged 14-16. Can you provide      │
│ information about availability and pricing? │
└─────────────────────────────────────────────┘

⏰ Response Time: Please respond within 24-48 hours.
The client has received an automated acknowledgment email.
```

### Step 3: Instant Auto-Reply to Client
**Email Subject:** "Thank You for Contacting Psych-Skills - Dr Denise Hill"

**Email Content:**
```
Thank You for Getting in Touch

Dear Sarah Jones,

Thank you for contacting Psych-Skills. I have received your message 
and will review it carefully.

Your Message
Subject: Question about group sessions

"Hi, I'm interested in group psychology sessions for our junior golf 
team. We have 8 players aged 14-16. Can you provide information about 
availability and pricing?"

What to Expect

Response Time: I will get back to you within 24-48 hours during 
business days.

If your enquiry is urgent, please feel free to call or book a session 
directly through the website.

In the meantime, you're welcome to:
• Explore our range of services
• Read client testimonials
• Book a consultation directly

Best regards,
Dr. Denise Hill
Elite Sports Psychologist
CASES-SEPAR Accredited
Psych-Skills

📧 info@psych-skills.co.uk
🌐 www.psych-skills.com
```

---

## 🔄 Flow 3: Booking Status Changes

### Scenario A: You Decline a Booking
**What happens:**
- Booking status changed to "DECLINED"
- Client receives email notification
- No calendar event created
- Option to suggest alternative times

### Scenario B: Client Cancels
**What happens:**
- Booking status changed to "CANCELLED"
- Google Calendar event automatically deleted
- Cancellation confirmation sent to client
- You receive notification

### Scenario C: Booking Completed
**What happens:**
- You mark booking as "COMPLETED" in admin
- Calendar event updated with completion status
- Follow-up email option (can be added)
- Request for testimonial (can be added)

---

## 📊 What You'll See in Your Calendar

When a booking is confirmed, your Google Calendar will show:

```
┌──────────────────────────────────────────────────────┐
│ Monday, December 15, 2025                            │
├──────────────────────────────────────────────────────┤
│                                                      │
│ 2:00 PM - 3:00 PM                                   │
│ 🏌️ One-to-One Session - John Smith                  │
│                                                      │
│ 📧 john@example.com                                 │
│ 📱 07123 456789                                     │
│                                                      │
│ 📝 Would like to work on pre-tournament anxiety     │
│                                                      │
│ 🔔 Reminders:                                       │
│    • Email: 24 hours before                         │
│    • Popup: 1 hour before                           │
│                                                      │
└──────────────────────────────────────────────────────┘
```

---

## ⚙️ Admin Dashboard Features

### Bookings Management Page (`/admin/bookings`)

**You can:**
✅ View all bookings (Pending, Confirmed, Completed)
✅ Filter by date, status, service type
✅ Search by client name or email
✅ Click "Confirm" to approve (triggers calendar + email)
✅ Click "Decline" to reject (sends notification)
✅ Click "Complete" to mark as finished
✅ Add admin notes to any booking
✅ Update payment status
✅ View full client details and notes

**When you confirm a booking:**
1. Status changes to "CONFIRMED" ✓
2. Google Calendar event created automatically 📅
3. Client gets confirmation email ✉️
4. Calendar link sent to client 🔗
5. Reminders set up automatically ⏰

---

## 🎨 Email Template Design

All emails include:
- ✅ Professional header with gradient branding
- ✅ Clear, structured information boxes
- ✅ Consistent typography and spacing
- ✅ Signature with contact details
- ✅ Mobile-responsive design
- ✅ Professional color scheme (emerald/green)
- ✅ Clear call-to-action buttons

---

## 📧 Email Addresses Used

**From Address (all emails):** `info@psych-skills.co.uk`
**Reply-To:** `info@psych-skills.co.uk`
**Admin Notifications Go To:** `info@psych-skills.co.uk` (or ADMIN_EMAIL in .env)

---

## 🔐 Privacy & Security

✅ Client emails stored securely in database
✅ Calendar events include only necessary information
✅ No sensitive data in email subjects
✅ HTTPS encryption for all communications
✅ GDPR compliant data handling
✅ Unsubscribe option (can add)

---

## 📱 Mobile Experience

All emails are fully responsive and look great on:
- ✅ iPhone/iPad
- ✅ Android phones/tablets
- ✅ Desktop email clients (Outlook, Gmail, Apple Mail)
- ✅ Web email (Gmail, Outlook.com, etc.)

---

## 🎯 Next Steps to Activate

1. **Get Gmail App Password** (5 minutes)
   - Follow guide in `SETUP-EMAIL-CALENDAR.md`
   - Add to Vercel environment variables

2. **Set Up Google Calendar** (15 minutes)
   - Create Google Cloud project
   - Enable Calendar API
   - Create service account
   - Share calendar with service account
   - Add credentials to Vercel

3. **Test the System** (10 minutes)
   - Submit a test booking
   - Check emails arrive
   - Confirm the booking in admin
   - Verify calendar event created
   - Check client receives confirmation

4. **Go Live!**
   - All automation runs automatically
   - You just need to check admin dashboard daily
   - Confirm/decline bookings as they come in
   - System handles the rest!

---

**Everything is ready to go - just add your credentials and it all works automatically! 🎉**
