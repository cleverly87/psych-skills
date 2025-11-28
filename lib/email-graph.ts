import 'isomorphic-fetch'
import { Client } from '@microsoft/microsoft-graph-client'
import { ClientSecretCredential } from '@azure/identity'

let graphClient: Client | null = null

function getGraphClient(): Client {
  if (graphClient) return graphClient

  if (!process.env.AZURE_TENANT_ID || !process.env.AZURE_CLIENT_ID || !process.env.AZURE_CLIENT_SECRET) {
    throw new Error('Azure credentials not configured for email sending')
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

interface SendEmailOptions {
  to: string
  subject: string
  html: string
  replyTo?: string
  attachments?: Array<{
    filename: string
    content: string
    contentType?: string
  }>
}

export async function sendEmailViaGraph(options: SendEmailOptions): Promise<boolean> {
  try {
    const client = getGraphClient()

    const message: any = {
      message: {
        subject: options.subject,
        body: {
          contentType: 'HTML',
          content: options.html
        },
        from: {
          emailAddress: {
            address: process.env.EMAIL_SERVER_USER
          }
    },
        toRecipients: [
          {
            emailAddress: {
              address: options.to
            }
          }
        ]
      },
      saveToSentItems: true
    }

    // Add reply-to if provided
    if (options.replyTo) {
      message.message.replyTo = [
        {
          emailAddress: {
            address: options.replyTo
          }
        }
      ]
    }

    // Add attachments if provided
    if (options.attachments && options.attachments.length > 0) {
      message.message.attachments = options.attachments.map(att => ({
        '@odata.type': '#microsoft.graph.fileAttachment',
        name: att.filename,
        contentType: att.contentType || 'application/octet-stream',
        contentBytes: Buffer.from(att.content).toString('base64')
      }))
    }

    await client
      .api(`/users/${process.env.EMAIL_SERVER_USER}/sendMail`)
      .post(message)

    console.log(`✅ Email sent via Microsoft Graph API`)
    console.log(`   From: ${process.env.EMAIL_SERVER_USER}`)
    console.log(`   To: ${options.to}`)
    return true

  } catch (error) {
    console.error('❌ Microsoft Graph API email error:', error)
    throw error
  }
}
