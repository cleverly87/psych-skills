import ical from 'ical-generator';

interface BookingData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  serviceType: string;
  date: Date;
  timeSlot: string;
  message?: string;
}

export function generateCalendarInvite(booking: BookingData): Buffer {
  const calendar = ical({ name: 'Psych Skills Session' });

  // Parse time slot to get start time (format: "HH:MM - HH:MM")
  const [startTime] = booking.timeSlot.split(' - ');
  const [hours, minutes] = startTime.split(':').map(Number);

  // Set start date/time
  const startDate = new Date(booking.date);
  startDate.setHours(hours, minutes, 0, 0);

  // Set end time (1 hour session by default)
  const endDate = new Date(startDate);
  endDate.setHours(startDate.getHours() + 1);

  // Build description with client details
  const description = `
Psychology Session

Client Details:
• Name: ${booking.clientName}
• Email: ${booking.clientEmail}
• Phone: ${booking.clientPhone}
• Service: ${booking.serviceType}

${booking.message ? `Client Notes:\n${booking.message}\n\n` : ''}
Location and payment details will be discussed in follow-up communication.
`.trim();

  calendar.createEvent({
    start: startDate,
    end: endDate,
    summary: `Session: ${booking.clientName} - ${booking.serviceType}`,
    description: description,
    location: 'To be confirmed',
    organizer: {
      name: 'Dr Denise Hill',
      email: 'info@psych-skills.co.uk'
    },
    attendees: [
      {
        name: 'Dr Denise Hill',
        email: 'info@psych-skills.co.uk',
        rsvp: true,
        role: 'REQ-PARTICIPANT' as any
      },
      {
        name: booking.clientName,
        email: booking.clientEmail,
        rsvp: true,
        role: 'REQ-PARTICIPANT' as any
      }
    ]
  });

  return Buffer.from(calendar.toString());
}
