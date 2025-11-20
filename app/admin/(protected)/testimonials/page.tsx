'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Star, Upload, ArrowUp, ArrowDown } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import Image from 'next/image'

interface Testimonial {
  id: string
  clientName: string
  clientTitle?: string
  content: string
  rating: number
  imageUrl?: string
  isApproved: boolean
  createdAt: string
}

export default function TestimonialsManagementPage() {
  const router = useRouter()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [formData, setFormData] = useState({
    clientName: '',
    clientTitle: '',
    content: '',
    rating: 5,
    imageUrl: '',
    isApproved: true,
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const res = await fetch('/api/admin/testimonials')
      if (res.ok) {
        const data = await res.json()
        setTestimonials(data)
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const url = editingTestimonial
        ? `/api/admin/testimonials/${editingTestimonial.id}`
        : '/api/admin/testimonials'
      const method = editingTestimonial ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        fetchTestimonials()
        setIsDialogOpen(false)
        resetForm()
      }
    } catch (error) {
      console.error('Failed to save testimonial:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setFormData({
      clientName: testimonial.clientName,
      clientTitle: testimonial.clientTitle || '',
      content: testimonial.content,
      rating: testimonial.rating,
      imageUrl: testimonial.imageUrl || '',
      isApproved: testimonial.isApproved,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        fetchTestimonials()
      }
    } catch (error) {
      console.error('Failed to delete testimonial:', error)
    }
  }

  const toggleApproval = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isApproved: !currentStatus }),
      })

      if (res.ok) {
        fetchTestimonials()
      }
    } catch (error) {
      console.error('Failed to toggle approval:', error)
    }
  }

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    try {
      const res = await fetch(`/api/admin/testimonials/${id}/reorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ direction }),
      })

      if (res.ok) {
        fetchTestimonials()
      } else {
        const error = await res.json()
        console.log(error.error) // Already at top/bottom
      }
    } catch (error) {
      console.error('Failed to reorder testimonial:', error)
    }
  }

  const resetForm = () => {
    setEditingTestimonial(null)
    setFormData({
      clientName: '',
      clientTitle: '',
      content: '',
      rating: 5,
      imageUrl: '',
      isApproved: true,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
            Testimonials Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage client testimonials and reviews
          </p>
        </div>

        <Dialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open)
            if (!open) resetForm()
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500">
              <Plus className="h-4 w-4 mr-2" />
              Add Testimonial
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
              </DialogTitle>
              <DialogDescription>
                Add or update a client testimonial
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name *</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) =>
                      setFormData({ ...formData, clientName: e.target.value })
                    }
                    required
                    placeholder="e.g., Lydia Hall"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientTitle">Title/Subtitle (Optional)</Label>
                  <Input
                    id="clientTitle"
                    value={formData.clientTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, clientTitle: e.target.value })
                    }
                    placeholder="e.g., PGA Winner, Golf Captain"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Testimonial Content *</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  required
                  placeholder="Enter the testimonial text..."
                  rows={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl">Client Photo URL (Optional)</Label>
                <Input
                  id="imageUrl"
                  type="text"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="/images/client-name.jpg or full URL"
                />
                <p className="text-xs text-muted-foreground">
                  Upload images to /public/images/ folder first, then use path like: /images/client.jpg
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <select
                  id="rating"
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({ ...formData, rating: parseInt(e.target.value) })
                  }
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  {[1, 2, 3, 4, 5].map((num) => (
                    <option key={num} value={num}>
                      {num} Star{num > 1 && 's'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isApproved"
                  checked={formData.isApproved}
                  onChange={(e) =>
                    setFormData({ ...formData, isApproved: e.target.checked })
                  }
                  className="h-4 w-4 rounded"
                />
                <Label htmlFor="isApproved" className="cursor-pointer">
                  Approved and visible on website
                </Label>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving
                    ? 'Saving...'
                    : editingTestimonial
                    ? 'Update Testimonial'
                    : 'Add Testimonial'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Testimonials List */}
      <div className="grid gap-4">
        {testimonials.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No testimonials yet. Add your first testimonial!
              </p>
            </CardContent>
          </Card>
        ) : (
          testimonials.map((testimonial) => (
            <Card
              key={testimonial.id}
              className="hover:border-primary/50 transition-colors"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* Photo */}
                  {testimonial.imageUrl && (
                    <div className="flex-shrink-0">
                      <div className="relative h-16 w-16 rounded-full overflow-hidden bg-muted">
                        <Image
                          src={testimonial.imageUrl}
                          alt={testimonial.clientName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{testimonial.clientName}</h3>
                      {testimonial.clientTitle && (
                        <span className="text-sm text-muted-foreground">
                          - {testimonial.clientTitle}
                        </span>
                      )}
                      <Badge variant={testimonial.isApproved ? 'default' : 'secondary'}>
                        {testimonial.isApproved ? 'Approved' : 'Pending'}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-muted'
                          }`}
                        />
                      ))}
                    </div>

                    <p className="text-foreground text-sm mb-2 italic">
                      "{testimonial.content}"
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Added {new Date(testimonial.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReorder(testimonial.id, 'up')}
                        disabled={testimonials.indexOf(testimonial) === 0}
                        title="Move up"
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReorder(testimonial.id, 'down')}
                        disabled={testimonials.indexOf(testimonial) === testimonials.length - 1}
                        title="Move down"
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleApproval(testimonial.id, testimonial.isApproved)}
                      >
                        {testimonial.isApproved ? 'Unapprove' : 'Approve'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(testimonial)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(testimonial.id)}
                      className="self-start"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
