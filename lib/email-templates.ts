interface EmailTemplate {
  subject: string
  html: string
}

interface BookingConfirmationParams {
  clientName: string
  clientEmail: string
  serviceType: string
  date: Date
  timeSlot: string
  notes?: string
}

interface ContactFormParams {
  name: string
  email: string
  subject?: string
  message: string
}

export const emailTemplates = {
  /**
   * Email sent to client when they submit a booking request
   */
  bookingRequestReceived: (params: BookingConfirmationParams): EmailTemplate => ({
    subject: 'Booking Request Received - Dr Denise Hill | Psych-Skills',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #047857 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-box { background: white; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0; border-radius: 4px; }
            .info-box h3 { margin-top: 0; color: #047857; }
            .info-box ul { list-style: none; padding: 0; }
            .info-box li { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
            .info-box li:last-child { border-bottom: none; }
            .info-box strong { color: #047857; }
            .next-steps { background: #ecfdf5; padding: 20px; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 14px; }
            .signature { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Thank You for Your Booking Request</h1>
            </div>
            <div class="content">
              <p>Dear ${params.clientName},</p>
              
              <p>Thank you for choosing Psych-Skills for your sports psychology needs. I have received your session booking request and will review it shortly.</p>
              
              <div class="info-box">
                <h3>Your Booking Details</h3>
                <ul>
                  <li><strong>Service:</strong> ${params.serviceType.replace(/_/g, ' ')}</li>
                  <li><strong>Requested Date:</strong> ${params.date.toLocaleDateString('en-GB', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</li>
                  <li><strong>Requested Time:</strong> ${params.timeSlot}</li>
                  ${params.notes ? `<li><strong>Your Notes:</strong> ${params.notes}</li>` : ''}
                </ul>
              </div>
              
              <div class="next-steps">
                <h3 style="color: #047857; margin-top: 0;">What Happens Next?</h3>
                <ol>
                  <li><strong>Review:</strong> I will review your booking request and check my availability</li>
                  <li><strong>Confirmation:</strong> You will receive a confirmation email within 24-48 hours</li>
                  <li><strong>Alternative Times:</strong> If the requested time is unavailable, I will propose alternative options</li>
                  <li><strong>Payment:</strong> Payment details and session preparation information will be provided once your booking is confirmed</li>
                </ol>
              </div>
              
              <p>If you have any urgent questions or need to make changes to your request, please don't hesitate to contact me directly.</p>
              
              <div class="signature">
                <p><strong>Best regards,</strong></p>
                <p><strong>Dr. Denise Hill</strong><br/>
                Elite Sports Psychologist<br/>
                CASES-SEPAR Accredited<br/>
                Psych-Skills</p>
                <p style="color: #6b7280; font-size: 14px;">
                  📧 info@psych-skills.co.uk<br/>
                  🌐 www.psych-skills.com
                </p>
              </div>
            </div>
            <div class="footer">
              <p>This is an automated confirmation. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  /**
   * Email sent to admin when a new booking is requested
   */
  bookingRequestNotification: (params: BookingConfirmationParams): EmailTemplate => ({
    subject: `🔔 New Booking Request: ${params.clientName} - ${params.date.toLocaleDateString('en-GB')}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .alert-box { background: #fef2f2; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .info-box h3 { margin-top: 0; color: #047857; border-bottom: 2px solid #10b981; padding-bottom: 10px; }
            .info-box ul { list-style: none; padding: 0; }
            .info-box li { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .info-box li:last-child { border-bottom: none; }
            .info-box strong { color: #047857; display: inline-block; min-width: 120px; }
            .button { background: #10b981; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; font-weight: bold; }
            .button:hover { background: #059669; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">🔔 New Booking Request</h1>
            </div>
            <div class="content">
              <div class="alert-box">
                <strong>⚡ Action Required:</strong> Please review and respond to this booking request within 24-48 hours.
              </div>
              
              <div class="info-box">
                <h3>Client Information</h3>
                <ul>
                  <li><strong>Name:</strong> ${params.clientName}</li>
                  <li><strong>Email:</strong> <a href="mailto:${params.clientEmail}">${params.clientEmail}</a></li>
                </ul>
              </div>
              
              <div class="info-box">
                <h3>Session Details</h3>
                <ul>
                  <li><strong>Service Type:</strong> ${params.serviceType.replace(/_/g, ' ')}</li>
                  <li><strong>Requested Date:</strong> ${params.date.toLocaleDateString('en-GB', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</li>
                  <li><strong>Requested Time:</strong> ${params.timeSlot}</li>
                  <li><strong>Status:</strong> <span style="background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold;">PENDING</span></li>
                </ul>
              </div>
              
              ${params.notes ? `
                <div class="info-box">
                  <h3>Client Notes</h3>
                  <p style="background: #f3f4f6; padding: 15px; border-radius: 4px; font-style: italic;">${params.notes}</p>
                </div>
              ` : ''}
              
              <div style="text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/admin/bookings" class="button">
                  View in Admin Dashboard →
                </a>
              </div>
              
              <p style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 14px;">
                <strong>Next Steps:</strong><br/>
                1. Log into the admin dashboard<br/>
                2. Review the booking details<br/>
                3. Confirm, decline, or propose an alternative time<br/>
                4. The client will be automatically notified of your decision
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  /**
   * Email sent to client when booking is confirmed
   */
  bookingConfirmed: (params: BookingConfirmationParams & { calendarLink?: string }): EmailTemplate => ({
    subject: '✅ Booking Confirmed - Dr Denise Hill | Psych-Skills',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #047857 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .success-badge { background: #d1fae5; color: #065f46; padding: 10px 20px; border-radius: 20px; display: inline-block; font-weight: bold; margin: 10px 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-box { background: white; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0; border-radius: 4px; }
            .info-box ul { list-style: none; padding: 0; }
            .info-box li { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .info-box li:last-child { border-bottom: none; }
            .info-box strong { color: #047857; }
            .preparation { background: #ecfdf5; padding: 20px; border-radius: 4px; margin: 20px 0; }
            .button { background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 10px 5px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">✅ Your Session is Confirmed!</h1>
              <div class="success-badge">BOOKING CONFIRMED</div>
            </div>
            <div class="content">
              <p>Dear ${params.clientName},</p>
              
              <p>Great news! Your session has been confirmed. I'm looking forward to working with you.</p>
              
              <div class="info-box">
                <h3 style="color: #047857; margin-top: 0;">Confirmed Session Details</h3>
                <ul>
                  <li><strong>Service:</strong> ${params.serviceType.replace(/_/g, ' ')}</li>
                  <li><strong>Date:</strong> ${params.date.toLocaleDateString('en-GB', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</li>
                  <li><strong>Time:</strong> ${params.timeSlot}</li>
                </ul>
              </div>
              
              ${params.calendarLink ? `
                <div style="text-align: center; margin: 20px 0;">
                  <a href="${params.calendarLink}" class="button">Add to Google Calendar</a>
                </div>
              ` : ''}
              
              <div class="preparation">
                <h3 style="color: #047857; margin-top: 0;">Preparing for Your Session</h3>
                <ul>
                  <li>Please arrive 5 minutes early if attending in person</li>
                  <li>For online sessions, you'll receive a video call link 24 hours before</li>
                  <li>Think about specific goals or challenges you'd like to address</li>
                  <li>Bring any relevant performance data or notes if applicable</li>
                </ul>
              </div>
              
              <div class="info-box">
                <h3 style="color: #047857; margin-top: 0;">Payment Information</h3>
                <p>Payment details will be provided separately. Payment is required 24 hours before the session.</p>
              </div>
              
              <p><strong>Need to reschedule?</strong> Please provide at least 48 hours notice to avoid cancellation fees.</p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
                <p><strong>Best regards,</strong></p>
                <p><strong>Dr. Denise Hill</strong><br/>
                Elite Sports Psychologist<br/>
                CASES-SEPAR Accredited<br/>
                Psych-Skills</p>
                <p style="color: #6b7280; font-size: 14px;">
                  📧 info@psych-skills.co.uk<br/>
                  🌐 www.psych-skills.com
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  /**
   * Email sent to client when contact form is submitted
   */
  contactFormReceived: (params: ContactFormParams): EmailTemplate => ({
    subject: 'Thank You for Contacting Psych-Skills - Dr Denise Hill',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #047857 0%, #10b981 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-box { background: white; padding: 20px; border-left: 4px solid #10b981; margin: 20px 0; border-radius: 4px; }
            .timeline { background: #ecfdf5; padding: 20px; border-radius: 4px; margin: 20px 0; }
            .signature { margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">Thank You for Getting in Touch</h1>
            </div>
            <div class="content">
              <p>Dear ${params.name},</p>
              
              <p>Thank you for contacting Psych-Skills. I have received your message and will review it carefully.</p>
              
              <div class="info-box">
                <h3 style="color: #047857; margin-top: 0;">Your Message</h3>
                ${params.subject ? `<p><strong>Subject:</strong> ${params.subject}</p>` : ''}
                <p style="background: #f3f4f6; padding: 15px; border-radius: 4px; font-style: italic;">${params.message.replace(/\n/g, '<br>')}</p>
              </div>
              
              <div class="timeline">
                <h3 style="color: #047857; margin-top: 0;">What to Expect</h3>
                <p><strong>Response Time:</strong> I will get back to you within 24-48 hours during business days.</p>
                <p>If your enquiry is urgent, please feel free to call or book a session directly through the website.</p>
              </div>
              
              <p>In the meantime, you're welcome to:</p>
              <ul>
                <li>Explore our <a href="${process.env.NEXT_PUBLIC_SITE_URL}/services" style="color: #10b981;">range of services</a></li>
                <li>Read <a href="${process.env.NEXT_PUBLIC_SITE_URL}/testimonials" style="color: #10b981;">client testimonials</a></li>
                <li><a href="${process.env.NEXT_PUBLIC_SITE_URL}/bookings" style="color: #10b981;">Book a consultation</a> directly</li>
              </ul>
              
              <div class="signature">
                <p><strong>Best regards,</strong></p>
                <p><strong>Dr. Denise Hill</strong><br/>
                Elite Sports Psychologist<br/>
                CASES-SEPAR Accredited<br/>
                Psych-Skills</p>
                <p style="color: #6b7280; font-size: 14px;">
                  📧 info@psych-skills.co.uk<br/>
                  🌐 www.psych-skills.com
                </p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  /**
   * Email sent to admin when contact form is submitted
   */
  contactFormNotification: (params: ContactFormParams): EmailTemplate => ({
    subject: `📨 New Contact Form: ${params.subject || 'No Subject'} - ${params.name}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0891b2 0%, #06b6d4 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-box { background: white; padding: 20px; margin: 20px 0; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
            .info-box h3 { margin-top: 0; color: #047857; border-bottom: 2px solid #10b981; padding-bottom: 10px; }
            .info-box ul { list-style: none; padding: 0; }
            .info-box li { padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
            .info-box li:last-child { border-bottom: none; }
            .message-box { background: #f0f9ff; padding: 20px; border-left: 4px solid #0891b2; border-radius: 4px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">📨 New Contact Form Submission</h1>
            </div>
            <div class="content">
              <div class="info-box">
                <h3>Contact Information</h3>
                <ul>
                  <li><strong>Name:</strong> ${params.name}</li>
                  <li><strong>Email:</strong> <a href="mailto:${params.email}">${params.email}</a></li>
                  ${params.subject ? `<li><strong>Subject:</strong> ${params.subject}</li>` : ''}
                </ul>
              </div>
              
              <div class="message-box">
                <h3 style="color: #0891b2; margin-top: 0;">Message</h3>
                <p>${params.message.replace(/\n/g, '<br>')}</p>
              </div>
              
              <p style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; color: #6b7280; font-size: 14px;">
                <strong>⏰ Response Time:</strong> Please respond within 24-48 hours.<br/>
                The client has received an automated acknowledgment email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
}
