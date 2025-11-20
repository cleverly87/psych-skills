import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function restore(backupFile?: string) {
  console.log('📥 Starting database restore...')

  try {
    // Find the most recent backup if no file specified
    let filePath: string

    if (backupFile) {
      filePath = backupFile
    } else {
      const backupDir = path.join(process.cwd(), 'backups')
      const files = fs.readdirSync(backupDir)
        .filter(f => f.startsWith('backup-') && f.endsWith('.json'))
        .sort()
        .reverse()

      if (files.length === 0) {
        throw new Error('No backup files found!')
      }

      filePath = path.join(backupDir, files[0])
      console.log(`📁 Using most recent backup: ${files[0]}`)
    }

    // Read backup file
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))

    console.log('\n🔄 Restoring data...')

    // Restore users (skip password hash updates, keep existing)
    for (const user of data.users) {
      await prisma.user.upsert({
        where: { id: user.id },
        update: {
          email: user.email,
          name: user.name,
          role: user.role,
          // Don't update password - keep the hashed one
        },
        create: {
          id: user.id,
          email: user.email,
          name: user.name,
          password: user.password, // Already hashed
          role: user.role,
          createdAt: new Date(user.createdAt),
          updatedAt: new Date(user.updatedAt),
        },
      })
    }
    console.log(`✓ Restored ${data.users.length} users`)

    // Restore services
    for (const service of data.services) {
      await prisma.service.upsert({
        where: { id: service.id },
        update: service,
        create: {
          ...service,
          createdAt: new Date(service.createdAt),
          updatedAt: new Date(service.updatedAt),
        },
      })
    }
    console.log(`✓ Restored ${data.services.length} services`)

    // Restore availability
    for (const avail of data.availability) {
      await prisma.availability.upsert({
        where: { id: avail.id },
        update: avail,
        create: {
          ...avail,
          createdAt: new Date(avail.createdAt),
          updatedAt: new Date(avail.updatedAt),
        },
      })
    }
    console.log(`✓ Restored ${data.availability.length} availability records`)

    // Restore blocked dates
    for (const blocked of data.blockedDates) {
      await prisma.blockedDate.upsert({
        where: { id: blocked.id },
        update: blocked,
        create: {
          ...blocked,
          date: new Date(blocked.date),
          createdAt: new Date(blocked.createdAt),
        },
      })
    }
    console.log(`✓ Restored ${data.blockedDates.length} blocked dates`)

    // Restore tags
    for (const tag of data.tags) {
      await prisma.tag.upsert({
        where: { id: tag.id },
        update: tag,
        create: tag,
      })
    }
    console.log(`✓ Restored ${data.tags.length} tags`)

    // Restore blog posts
    for (const post of data.blogPosts) {
      await prisma.blogPost.upsert({
        where: { id: post.id },
        update: post,
        create: {
          ...post,
          publishedAt: post.publishedAt ? new Date(post.publishedAt) : null,
          createdAt: new Date(post.createdAt),
          updatedAt: new Date(post.updatedAt),
        },
      })
    }
    console.log(`✓ Restored ${data.blogPosts.length} blog posts`)

    // Restore testimonials
    for (const testimonial of data.testimonials) {
      await prisma.testimonial.upsert({
        where: { id: testimonial.id },
        update: testimonial,
        create: {
          ...testimonial,
          createdAt: new Date(testimonial.createdAt),
          updatedAt: new Date(testimonial.updatedAt),
        },
      })
    }
    console.log(`✓ Restored ${data.testimonials.length} testimonials`)

    // Restore bookings
    for (const booking of data.bookings) {
      await prisma.booking.upsert({
        where: { id: booking.id },
        update: booking,
        create: {
          ...booking,
          date: new Date(booking.date),
          createdAt: new Date(booking.createdAt),
          updatedAt: new Date(booking.updatedAt),
        },
      })
    }
    console.log(`✓ Restored ${data.bookings.length} bookings`)

    // Restore contact submissions
    for (const submission of data.contactSubmissions) {
      await prisma.contactSubmission.upsert({
        where: { id: submission.id },
        update: submission,
        create: {
          ...submission,
          createdAt: new Date(submission.createdAt),
        },
      })
    }
    console.log(`✓ Restored ${data.contactSubmissions.length} contact submissions`)

    console.log('\n✅ Restore completed successfully!')
  } catch (error) {
    console.error('❌ Restore failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Get backup file from command line argument
const backupFile = process.argv[2]

restore(backupFile)
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
