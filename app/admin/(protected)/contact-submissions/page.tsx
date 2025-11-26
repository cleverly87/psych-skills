'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, 
  Archive, 
  ArchiveRestore, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar,
  Send,
  MessageCircle
} from 'lucide-react'

interface ContactReply {
  id: string
  message: string
  sentBy: string
  senderEmail: string
  senderName: string | null
  createdAt: string
}

interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  status: string
  isArchived: boolean
  createdAt: string
  updatedAt: string
  replies: ContactReply[]
}

export default function ContactSubmissionsPage() {
  const [activeSubmissions, setActiveSubmissions] = useState<ContactSubmission[]>([])
  const [archivedSubmissions, setArchivedSubmissions] = useState<ContactSubmission[]>([])
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [activeTab, setActiveTab] = useState('active')

  const fetchSubmissions = async () => {
    try {
      const [activeRes, archivedRes] = await Promise.all([
        fetch('/api/admin/contact-submissions?archived=false'),
        fetch('/api/admin/contact-submissions?archived=true'),
      ])

      if (activeRes.ok) {
        const data = await activeRes.json()
        setActiveSubmissions(data)
      }

      if (archivedRes.ok) {
        const data = await archivedRes.json()
        setArchivedSubmissions(data)
      }
    } catch (error) {
      console.error('Failed to fetch contact submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const handleSelectSubmission = async (submission: ContactSubmission) => {
    try {
      const res = await fetch(`/api/admin/contact-submissions/${submission.id}`)
      if (res.ok) {
        const fullSubmission = await res.json()
        setSelectedSubmission(fullSubmission)
      }
    } catch (error) {
      console.error('Failed to fetch submission details:', error)
    }
  }

  const handleSendReply = async () => {
    if (!selectedSubmission || !replyMessage.trim()) return

    setSending(true)
    try {
      const res = await fetch(`/api/admin/contact-submissions/${selectedSubmission.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: replyMessage }),
      })

      if (res.ok) {
        setReplyMessage('')
        // Refresh the submission to show new reply
        await handleSelectSubmission(selectedSubmission)
        await fetchSubmissions()
      }
    } catch (error) {
      console.error('Failed to send reply:', error)
    } finally {
      setSending(false)
    }
  }

  const handleArchive = async (id: string, archive: boolean) => {
    try {
      const res = await fetch(`/api/admin/contact-submissions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isArchived: archive }),
      })

      if (res.ok) {
        await fetchSubmissions()
        if (selectedSubmission?.id === id) {
          setSelectedSubmission(null)
        }
      }
    } catch (error) {
      console.error('Failed to archive submission:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this submission? This cannot be undone.')) {
      return
    }

    try {
      const res = await fetch(`/api/admin/contact-submissions/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        await fetchSubmissions()
        if (selectedSubmission?.id === id) {
          setSelectedSubmission(null)
        }
      } else {
        const data = await res.json()
        alert(data.error || 'Failed to delete submission')
      }
    } catch (error) {
      console.error('Failed to delete submission:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Loading submissions...</p>
      </div>
    )
  }

  // Conversation View
  if (selectedSubmission) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedSubmission(null)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to List
          </Button>
          {selectedSubmission.isArchived ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleArchive(selectedSubmission.id, false)}
              >
                <ArchiveRestore className="h-4 w-4 mr-2" />
                Unarchive
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(selectedSubmission.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleArchive(selectedSubmission.id, true)}
            >
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">
              {selectedSubmission.subject || 'No Subject'}
            </CardTitle>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mt-2">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4" />
                <a href={`mailto:${selectedSubmission.email}`} className="hover:text-primary">
                  {selectedSubmission.email}
                </a>
              </div>
              {selectedSubmission.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  <a href={`tel:${selectedSubmission.phone}`} className="hover:text-primary">
                    {selectedSubmission.phone}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {new Date(selectedSubmission.createdAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Original Message */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{selectedSubmission.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(selectedSubmission.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
              <div className="ml-10 bg-blue-100 border-l-4 border-blue-500 rounded-lg p-4">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">{selectedSubmission.message}</p>
              </div>
            </div>

            {/* Replies */}
            {selectedSubmission.replies.map((reply) => (
              <div key={reply.id}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <Mail className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">
                      {reply.sentBy === 'admin' ? (reply.senderName || 'Dr Denise Hill') : reply.senderName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(reply.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
                <div className="ml-10 bg-green-100 border-l-4 border-green-500 rounded-lg p-4">
                  <p className="text-sm text-gray-900 whitespace-pre-wrap">{reply.message}</p>
                </div>
              </div>
            ))}

            {/* Reply Form */}
            {!selectedSubmission.isArchived && (
              <div className="border-t pt-6">
                <h3 className="font-semibold mb-3">Send Reply</h3>
                <Textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply here..."
                  rows={5}
                  className="mb-3"
                />
                <Button
                  onClick={handleSendReply}
                  disabled={sending || !replyMessage.trim()}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {sending ? 'Sending...' : 'Send Email Reply'}
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  This will send an email to {selectedSubmission.email} and appear in your Outlook Sent Items.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // List View
  const renderSubmissionCard = (submission: ContactSubmission) => {
    const hasReplies = submission.replies && submission.replies.length > 0
    const lastUpdate = hasReplies 
      ? new Date(submission.replies[0].createdAt)
      : new Date(submission.createdAt)

    return (
      <Card
        key={submission.id}
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => handleSelectSubmission(submission)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-lg">
                  {submission.subject || 'No Subject'}
                </CardTitle>
                {hasReplies && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                    {submission.replies.length} {submission.replies.length === 1 ? 'reply' : 'replies'}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="font-medium">{submission.name}</span>
                <span>•</span>
                <a
                  href={`mailto:${submission.email}`}
                  className="hover:text-primary"
                  onClick={(e) => e.stopPropagation()}
                >
                  {submission.email}
                </a>
                <span>•</span>
                <span>
                  {lastUpdate.toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-foreground line-clamp-2">
            {submission.message}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Contact Submissions</h1>
        <p className="text-muted-foreground mt-1">
          View messages, reply, and manage conversations
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="active">
            Active ({activeSubmissions.length})
          </TabsTrigger>
          <TabsTrigger value="archived">
            Archived ({archivedSubmissions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4 mt-6">
          {activeSubmissions.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No active contact submissions.</p>
              </CardContent>
            </Card>
          ) : (
            activeSubmissions.map(renderSubmissionCard)
          )}
        </TabsContent>

        <TabsContent value="archived" className="space-y-4 mt-6">
          {archivedSubmissions.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">No archived contact submissions.</p>
              </CardContent>
            </Card>
          ) : (
            archivedSubmissions.map(renderSubmissionCard)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
