import { google } from 'googleapis'

interface CalendarEventParams {
  summary: string
  description: string
  startDateTime: Date
  endDateTime: Date
  attendeeEmail: string
  attendeeName: string
  location?: string
}

/**
 * Creates a Google Calendar event
 * Requires GOOGLE_CALENDAR_CLIENT_EMAIL, GOOGLE_CALENDAR_PRIVATE_KEY, and GOOGLE_CALENDAR_ID in environment variables
 */
export async function createCalendarEvent(params: CalendarEventParams) {
  try {
    // Check if credentials are configured
    if (!process.env.GOOGLE_CALENDAR_CLIENT_EMAIL || !process.env.GOOGLE_CALENDAR_PRIVATE_KEY) {
      console.warn('Google Calendar credentials not configured. Skipping calendar event creation.')
      return { success: false, error: 'Calendar not configured' }
    }

    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CALENDAR_CLIENT_EMAIL,
      key: process.env.GOOGLE_CALENDAR_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/calendar'],
    })

    const calendar = google.calendar({ version: 'v3', auth })

    const event = {
      summary: params.summary,
      description: params.description,
      location: params.location || 'Online',
      start: {
        dateTime: params.startDateTime.toISOString(),
        timeZone: 'Europe/London',
      },
      end: {
        dateTime: params.endDateTime.toISOString(),
        timeZone: 'Europe/London',
      },
      attendees: [
        {
          email: params.attendeeEmail,
          displayName: params.attendeeName,
        },
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 }, // 1 day before
          { method: 'popup', minutes: 60 }, // 1 hour before
        ],
      },
    }

    const response = await calendar.events.insert({
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
      requestBody: event,
      sendUpdates: 'all', // Send email notifications to attendees
    })

    console.log('✅ Calendar event created:', response.data.htmlLink)

    return {
      success: true,
      eventId: response.data.id,
      eventLink: response.data.htmlLink,
    }
  } catch (error) {
    console.error('❌ Calendar event creation failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Updates an existing calendar event
 */
export async function updateCalendarEvent(eventId: string, params: Partial<CalendarEventParams>) {
  try {
    if (!process.env.GOOGLE_CALENDAR_CLIENT_EMAIL || !process.env.GOOGLE_CALENDAR_PRIVATE_KEY) {
      console.warn('Google Calendar credentials not configured.')
      return { success: false, error: 'Calendar not configured' }
    }

    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CALENDAR_CLIENT_EMAIL,
      key: process.env.GOOGLE_CALENDAR_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/calendar'],
    })

    const calendar = google.calendar({ version: 'v3', auth })

    const updateData: any = {}

    if (params.summary) updateData.summary = params.summary
    if (params.description) updateData.description = params.description
    if (params.location) updateData.location = params.location
    if (params.startDateTime && params.endDateTime) {
      updateData.start = {
        dateTime: params.startDateTime.toISOString(),
        timeZone: 'Europe/London',
      }
      updateData.end = {
        dateTime: params.endDateTime.toISOString(),
        timeZone: 'Europe/London',
      }
    }

    const response = await calendar.events.patch({
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
      eventId,
      requestBody: updateData,
      sendUpdates: 'all',
    })

    console.log('✅ Calendar event updated:', response.data.htmlLink)

    return {
      success: true,
      eventId: response.data.id,
      eventLink: response.data.htmlLink,
    }
  } catch (error) {
    console.error('❌ Calendar event update failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Deletes a calendar event
 */
export async function deleteCalendarEvent(eventId: string) {
  try {
    if (!process.env.GOOGLE_CALENDAR_CLIENT_EMAIL || !process.env.GOOGLE_CALENDAR_PRIVATE_KEY) {
      console.warn('Google Calendar credentials not configured.')
      return { success: false, error: 'Calendar not configured' }
    }

    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CALENDAR_CLIENT_EMAIL,
      key: process.env.GOOGLE_CALENDAR_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/calendar'],
    })

    const calendar = google.calendar({ version: 'v3', auth })

    await calendar.events.delete({
      calendarId: process.env.GOOGLE_CALENDAR_ID || 'primary',
      eventId,
      sendUpdates: 'all',
    })

    console.log('✅ Calendar event deleted:', eventId)

    return { success: true }
  } catch (error) {
    console.error('❌ Calendar event deletion failed:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
