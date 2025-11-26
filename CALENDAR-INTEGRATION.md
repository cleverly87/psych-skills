# Calendar Integration Documentation

## Overview
When Dr. Hill confirms a booking in the admin dashboard, the system now automatically:
1. Generates a calendar invite (.ics file)
2. Attaches it to the confirmation email sent to the client
3. Client can click the attachment to add the session to their Outlook/Google Calendar

## Technical Implementation

### 1. Calendar Generation (`lib/calendar.ts`)
Uses the `ical-generator` package to create standard .ics calendar files.

**Features included in the calendar event:**
- **Summary/Title**: "Session: [Client Name] - [Service Type]"
- **Start Date/Time**: Parsed from booking date and time slot
- **Duration**: 1 hour (default)
- **Location**: "To be confirmed"
- **Description**: Includes:
  - Client name, email, phone
  - Service type
  - Client notes (if provided)
  - Note about location/payment follow-up
- **Organizer**: Psych Skills (info@psych-skills.co.uk)
- **Attendee**: Client (with RSVP enabled)

### 2. Email Attachment Support (`lib/email.ts`)
Extended the email system to support attachments:
- Added `EmailAttachment` interface for typed attachments
- Updated `sendEmail()` function to accept optional attachments array
- Attachments passed to nodemailer with proper MIME types

### 3. Confirmation Endpoint (`app/api/admin/bookings/[id]/confirm/route.ts`)
When Dr. Hill confirms a booking:
1. Updates booking status to `CONFIRMED`
2. Generates calendar invite using `generateCalendarInvite()`
3. Sends confirmation email with:
   - Professional HTML template
   - Calendar invite attached as `session-appointment.ics`
   - Instructions about what happens next

### 4. Email Template (`lib/email-templates.ts`)
New `bookingConfirmedEmail()` function creates a styled email with:
- ✅ Confirmation badge
- Session details (service, date, time, location TBD)
- Note about attached calendar invite
- Information about follow-up for location/payment
- Professional signature with contact details

## User Experience

### For Clients:
1. Submit booking request through website
2. Receive initial acknowledgment email
3. When Dr. Hill confirms:
   - Receive confirmation email
   - Email has .ics calendar file attachment
   - Click attachment to add to calendar (works with Outlook, Google Calendar, Apple Calendar, etc.)
   - Session appears in their calendar with all details
4. Receive follow-up communication about location and payment

### For Dr. Hill:
1. Login to admin dashboard
2. View pending bookings
3. Click "Confirm" button
4. System automatically:
   - Marks booking as confirmed
   - Sends professional confirmation email
   - Attaches calendar invite
   - Client gets calendar event without any manual work

## Calendar Event Details
The calendar event shows:
```
SUMMARY: Session: John Smith - Sports Psychology Session
LOCATION: To be confirmed
DTSTART: [Booking Date/Time]
DTEND: [+1 hour]
DESCRIPTION:
  Psychology Session
  
  Client Details:
  • Name: John Smith
  • Email: john@example.com
  • Phone: 07XXX XXXXXX
  • Service: Sports Psychology Session
  
  Client Notes: [Any notes provided]
  
  Location and payment details will be discussed in follow-up communication.
```

## Testing

### Manual Test:
1. Submit a test booking through the website
2. Login to admin dashboard
3. Navigate to bookings
4. Click "Confirm" on the test booking
5. Check the email inbox for confirmation email
6. Verify .ics file is attached
7. Open .ics file
8. Confirm event appears in calendar with correct details

### What to Verify:
- [ ] Email arrives with subject "Session Confirmed - Psych Skills"
- [ ] Email has professional styling
- [ ] .ics file attached (named `session-appointment.ics`)
- [ ] Calendar event shows correct date/time
- [ ] Location shows "To be confirmed"
- [ ] Description includes all client details
- [ ] Event syncs to Outlook calendar

## Benefits

1. **Professional Experience**: Clients receive instant calendar invites, just like corporate booking systems
2. **Reduced No-Shows**: Calendar reminders help clients remember appointments
3. **Saves Time**: No manual calendar event creation needed
4. **Cross-Platform**: Works with all major calendar applications
5. **Automatic**: Happens automatically when booking is confirmed
6. **Complete Information**: All session and client details in one place

## Future Enhancements

Potential improvements:
- Add calendar events for proposed alternative times (when client confirms)
- Send calendar cancellation (.ics with CANCEL method) when booking is cancelled
- Add location details automatically once session type has default location
- Include payment link in calendar event description
- Set reminder time (e.g., 24 hours before session)

## Dependencies

- `ical-generator`: ^7.2.0 - Generates standard .ics calendar files
- `nodemailer`: Existing email package, now supports attachments

## Configuration

No additional configuration needed beyond existing email setup:
- Uses same SMTP settings (Microsoft 365)
- Uses same sender email (info@psych-skills.co.uk)
- Calendar invite organization shows as "Psych Skills"

## Troubleshooting

**Calendar invite not appearing in email:**
- Check terminal logs for email sending errors
- Verify email templates are being used correctly
- Check spam/junk folder

**Calendar event not importing:**
- Verify .ics file is attached (check email source)
- Try saving .ics file and opening directly
- Check calendar app supports .ics format

**Wrong date/time in calendar:**
- Verify booking date is stored correctly in database
- Check time slot format matches expected "HH:MM - HH:MM"
- Confirm timezone settings

**Missing client details:**
- Verify all fields are captured in booking form
- Check database has complete booking record
- Review calendar generation logic in `lib/calendar.ts`
