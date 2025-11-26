import 'isomorphic-fetch'
import { Client } from '@microsoft/microsoft-graph-client'
import { ClientSecretCredential } from '@azure/identity'
import { prisma } from './prisma'

let graphClient: Client | null = null

function getGraphClient(): Client {
  if (graphClient) return graphClient

  if (!process.env.AZURE_TENANT_ID || !process.env.AZURE_CLIENT_ID || !process.env.AZURE_CLIENT_SECRET) {
    throw new Error('Azure credentials not configured in .env')
  }

  const credential = new ClientSecretCredential(
    process.env.AZURE_TENANT_ID,
    process.env.AZURE_CLIENT_ID,
    process.env.AZURE_CLIENT_SECRET
  )

  graphClient = Client.initWithMiddleware({
    authProvider: {
      getAccessToken: async () => {
        const token = await credential.getToken('https://graph.microsoft.com/.default')
        return token?.token || ''
      }
    }
  })

  return graphClient
}

interface IncomingEmail {
  id: string
  subject: string
  from: {
    emailAddress: {
      address: string
      name: string
    }
  }
  body: {
    content: string
    contentType: string
  }
  bodyPreview: string
  receivedDateTime: string
  conversationId: string
  isRead: boolean
  internetMessageHeaders?: Array<{
    name: string
    value: string
  }>
}

/**
 * Check if email is a notification/system email (not a client reply)
 */
function isNotificationEmail(email: IncomingEmail): boolean {
  const subject = email.subject?.toLowerCase() || ''
  const fromEmail = email.from.emailAddress.address.toLowerCase()
  
  // Filter out notification emails
  if (
    subject.includes('booking confirmed') ||
    subject.includes('booking update') ||
    subject.includes('new session booked') ||
    subject.includes('booking declined') ||
    subject.includes('booking cancelled') ||
    fromEmail.includes('no-reply') ||
    fromEmail.includes('noreply') ||
    fromEmail === 'info@psych-skills.co.uk' // Emails from ourselves
  ) {
    return true
  }
  
  return false
}

/**
 * Extract conversation ID from email subject
 * Format: [CS:id] for contact submissions, [BK:id] for bookings
 */
function extractConversationId(subject: string): { type: 'contact' | 'booking' | null, id: string | null } {
  // Look for [CS:xxxxx] or [BK:xxxxx] in subject
  const contactMatch = subject.match(/\[CS:([a-zA-Z0-9]+)\]/)
  const bookingMatch = subject.match(/\[BK:([a-zA-Z0-9]+)\]/)
  
  if (contactMatch) {
    return { type: 'contact', id: contactMatch[1] }
  }
  if (bookingMatch) {
    return { type: 'booking', id: bookingMatch[1] }
  }
  
  return { type: null, id: null }
}

/**
 * Check if email is an auto-reply/out-of-office message
 */
function isAutoReply(email: IncomingEmail): boolean {
  const subject = email.subject?.toLowerCase() || ''
  const body = email.body?.content?.toLowerCase() || ''
  
  // Check for auto-reply indicators in subject
  if (
    subject.includes('automatic reply') ||
    subject.includes('auto-reply') ||
    subject.includes('out of office') ||
    subject.includes('out-of-office') ||
    subject.includes('ooo:') ||
    subject.includes('away from') ||
    subject.includes('vacation')
  ) {
    return true
  }
  
  // Check headers for auto-reply indicators
  if (email.internetMessageHeaders) {
    const autoReplyHeaders = email.internetMessageHeaders.filter(h => 
      h.name.toLowerCase() === 'x-auto-response-suppress' ||
      h.name.toLowerCase() === 'auto-submitted' ||
      h.name.toLowerCase() === 'x-autorespond'
    )
    if (autoReplyHeaders.length > 0) {
      return true
    }
  }
  
  // Check body for common auto-reply phrases
  if (
    body.includes('this is an automatic') ||
    body.includes('automatic reply') ||
    body.includes('i am currently out of') ||
    body.includes('i will be out of the office') ||
    body.includes('i am away from')
  ) {
    return true
  }
  
  return false
}

/**
 * Extract clean message text from email body, removing headers and quoted text
 */
function extractMessageText(email: IncomingEmail): string {
  let text = ''
  
  if (email.body.contentType === 'text') {
    text = email.body.content
  } else if (email.body.contentType === 'html') {
    // Convert HTML to plain text - preserve line breaks
    text = email.body.content
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove style tags
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove script tags
      .replace(/<br\s*\/?>/gi, '\n') // Convert <br> to newlines
      .replace(/<\/p>/gi, '\n') // Convert closing </p> to newlines
      .replace(/<\/div>/gi, '\n') // Convert closing </div> to newlines
      .replace(/<\/tr>/gi, '\n') // Convert closing </tr> to newlines
      .replace(/<[^>]*>/g, '') // Remove all remaining HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
  }
  
  // Split into lines and process
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  const cleanLines: string[] = []
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const lowerLine = line.toLowerCase()
    
    // Stop at the start of forwarded/quoted email sections
    // Look for "From: Name <email>" or "From: email" or "Sent:" patterns
    if (
      lowerLine.startsWith('from:') ||
      lowerLine.startsWith('sent:') ||
      lowerLine.startsWith('date:') ||
      lowerLine.match(/^on .* wrote:$/i)
    ) {
      // Stop here - this is the start of quoted content
      console.log(`🛑 Stopped extraction at forwarded email marker: "${line.substring(0, 50)}"`)
      break
    }
    
    // Skip other metadata lines if they appear standalone
    if (
      lowerLine.startsWith('to:') ||
      lowerLine.startsWith('cc:') ||
      lowerLine.startsWith('subject:')
    ) {
      continue
    }
    
    // Skip quoted text markers
    if (
      line.startsWith('>') ||
      lowerLine.includes('________________________________')
    ) {
      break
    }
    
    // Stop at signature patterns
    if (
      line === '--' ||
      lowerLine === 'regards' ||
      lowerLine === 'best regards' ||
      lowerLine === 'kind regards' ||
      lowerLine.startsWith('thanks,') ||
      lowerLine.startsWith('thank you,')
    ) {
      break
    }
    
    // Add the line - it's part of the actual message
    cleanLines.push(line)
  }
  
  const result = cleanLines.join('\n').trim()
  console.log(`📝 Extracted message text (${result.length} chars): "${result}"`)
  return result
}

/**
 * Monitor inbox for new email replies and add them to conversations
 */
export async function monitorInboxForReplies() {
  try {
    const client = getGraphClient()
    
    // Get unread emails from the last 24 hours
    const messages = await client
      .api('/users/info@psych-skills.co.uk/mailFolders/inbox/messages')
      .filter("isRead eq false and receivedDateTime ge " + new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .select('id,subject,from,body,bodyPreview,receivedDateTime,conversationId,isRead,internetMessageHeaders')
      .top(50)
      .get()

    if (!messages.value || messages.value.length === 0) {
      console.log('📬 No new emails to process')
      return { processed: 0, errors: 0 }
    }

    console.log(`📧 Found ${messages.value.length} unread emails`)
    
    let processed = 0
    let errors = 0

    for (const email of messages.value) {
      try {
        console.log(`\n📨 Processing email: "${email.subject}" from ${email.from?.emailAddress?.address}`)

        // Skip if email is from our own address (Dr. Denise replying from Outlook)
        if (email.from?.emailAddress?.address?.toLowerCase() === process.env.EMAIL_SERVER_USER?.toLowerCase()) {
          console.log(`⏭️  Skipping email from our own address: ${email.from.emailAddress.address}`)
          continue
        }

        // Skip notification emails
        if (
          email.subject?.includes('New Contact Submission') ||
          email.subject?.includes('Booking Confirmed') ||
          email.subject?.includes('Booking Update') ||
          email.subject?.includes('New Session Booked') ||
          email.subject?.includes('Booking Declined') ||
          email.subject?.includes('Booking Cancelled') ||
          email.from?.emailAddress?.address?.toLowerCase().includes('no-reply') ||
          email.from?.emailAddress?.address?.toLowerCase().includes('noreply') ||
          email.from?.emailAddress?.address?.toLowerCase() === 'info@psych-skills.co.uk' // Emails from ourselves
        ) {
          console.log(`⏭️  Skipping notification email: ${email.subject}`)
          continue
        }
        
        // Skip auto-reply/out-of-office emails
        if (isAutoReply(email)) {
          console.log(`⏭️  Skipping auto-reply: ${email.subject}`)
          // Mark as read so we don't see it again
          await client
            .api(`/users/info@psych-skills.co.uk/messages/${email.id}`)
            .patch({ isRead: true })
          continue
        }
        
        // Check if email is a reply (subject starts with Re:)
        if (!email.subject?.toLowerCase().startsWith('re:')) {
          console.log(`⏭️  Skipping non-reply email: ${email.subject}`)
          continue
        }

        const fromEmail = email.from.emailAddress.address.toLowerCase()
        const fromName = email.from.emailAddress.name
        
        // Extract conversation ID from subject line
        const conversation = extractConversationId(email.subject)
        console.log(`🔍 Conversation ID: type=${conversation.type}, id=${conversation.id}`)
        
        // Extract clean message text (without headers and quoted text)
        const messageText = extractMessageText(email)
        
        // Skip if message is empty after cleaning
        if (!messageText || messageText.length < 5) {
          console.log(`⏭️  Skipping email with no content from ${fromEmail} (length: ${messageText?.length || 0})`)
          continue
        }

        // Match by conversation ID if available (most accurate)
        if (conversation.type === 'contact' && conversation.id) {
          const submission = await prisma.contactSubmission.findUnique({
            where: { id: conversation.id }
          })
          
          if (submission && !submission.isArchived && submission.email.toLowerCase() === fromEmail) {
            await prisma.contactReply.create({
              data: {
                contactSubmissionId: submission.id,
                message: messageText,
                sentBy: 'client',
                senderEmail: fromEmail,
                senderName: fromName
              }
            })
            
            await prisma.contactSubmission.update({
              where: { id: submission.id },
              data: { updatedAt: new Date() }
            })
            
            console.log(`✅ Added client reply to contact submission ${submission.id} (matched by ID) from ${fromEmail}`)
            processed++
          } else {
            console.log(`⚠️  Could not find contact submission ${conversation.id} for ${fromEmail}`)
          }
        } else if (conversation.type === 'booking' && conversation.id) {
          const booking = await prisma.booking.findUnique({
            where: { id: conversation.id }
          })
          
          if (booking && booking.status !== 'COMPLETED' && booking.status !== 'CANCELLED' && booking.clientEmail.toLowerCase() === fromEmail) {
            await prisma.bookingReply.create({
              data: {
                bookingId: booking.id,
                message: messageText,
                sentBy: 'client',
                senderEmail: fromEmail,
                senderName: fromName || booking.clientName
              }
            })
            
            await prisma.booking.update({
              where: { id: booking.id },
              data: { updatedAt: new Date() }
            })
            
            console.log(`✅ Added client reply to booking ${booking.id} (matched by ID) from ${fromEmail}`)
            processed++
          } else {
            console.log(`⚠️  Could not find booking ${conversation.id} for ${fromEmail}`)
          }
        } else {
          // Fallback: match by email address (less accurate, only for most recent active conversation)
          console.log(`⚠️  No conversation ID found in subject, attempting fallback match for ${fromEmail}`)
          
          const contactSubmissions = await prisma.contactSubmission.findMany({
            where: {
              email: fromEmail,
              isArchived: false
            },
            orderBy: {
              updatedAt: 'desc'
            },
            take: 1
          })

          if (contactSubmissions.length > 0) {
            const submission = contactSubmissions[0]
            
            await prisma.contactReply.create({
              data: {
                contactSubmissionId: submission.id,
                message: messageText,
                sentBy: 'client',
                senderEmail: fromEmail,
                senderName: fromName
              }
            })

            await prisma.contactSubmission.update({
              where: { id: submission.id },
              data: { updatedAt: new Date() }
            })

            console.log(`✅ Added client reply to contact submission ${submission.id} (fallback match) from ${fromEmail}`)
            processed++
          } else {
            const bookings = await prisma.booking.findMany({
              where: {
                clientEmail: fromEmail,
                status: { in: ['PENDING', 'CONFIRMED'] }
              },
              orderBy: {
                updatedAt: 'desc'
              },
              take: 1
            })

            if (bookings.length > 0) {
              const booking = bookings[0]
              
              await prisma.bookingReply.create({
                data: {
                  bookingId: booking.id,
                  message: messageText,
                  sentBy: 'client',
                  senderEmail: fromEmail,
                  senderName: fromName || booking.clientName
                }
              })

              await prisma.booking.update({
                where: { id: booking.id },
                data: { updatedAt: new Date() }
              })

              console.log(`✅ Added client reply to booking ${booking.id} (fallback match) from ${fromEmail}`)
              processed++
            } else {
              console.log(`⚠️  No matching conversation found for ${fromEmail}`)
            }
          }
        }

        // Mark email as read so we don't process it again
        await client
          .api(`/users/info@psych-skills.co.uk/messages/${email.id}`)
          .patch({ isRead: true })

      } catch (error) {
        console.error('Error processing email:', error)
        errors++
      }
    }

    console.log(`📊 Email monitoring complete: ${processed} processed, ${errors} errors`)
    return { processed, errors }

  } catch (error) {
    console.error('❌ Email monitoring error:', error)
    throw error
  }
}
