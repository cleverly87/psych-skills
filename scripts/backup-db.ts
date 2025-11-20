import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

async function backup() {
  console.log('📦 Starting database backup...')

  try {
    // Fetch all data
    const data = {
      users: await prisma.user.findMany(),
      bookings: await prisma.booking.findMany(),
      services: await prisma.service.findMany(),
      availability: await prisma.availability.findMany(),
      blockedDates: await prisma.blockedDate.findMany(),
      blogPosts: await prisma.blogPost.findMany(),
      tags: await prisma.tag.findMany(),
      testimonials: await prisma.testimonial.findMany(),
      contactSubmissions: await prisma.contactSubmission.findMany(),
    }

    // Create backups directory if it doesn't exist
    const backupDir = path.join(process.cwd(), 'backups')
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true })
    }

    // Create backup file with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const backupFile = path.join(backupDir, `backup-${timestamp}.json`)

    // Write backup
    fs.writeFileSync(backupFile, JSON.stringify(data, null, 2))

    console.log('✅ Backup completed successfully!')
    console.log(`📁 Backup saved to: ${backupFile}`)
    console.log('\nBackup summary:')
    console.log(`   Users: ${data.users.length}`)
    console.log(`   Bookings: ${data.bookings.length}`)
    console.log(`   Services: ${data.services.length}`)
    console.log(`   Availability: ${data.availability.length}`)
    console.log(`   Blocked Dates: ${data.blockedDates.length}`)
    console.log(`   Blog Posts: ${data.blogPosts.length}`)
    console.log(`   Tags: ${data.tags.length}`)
    console.log(`   Testimonials: ${data.testimonials.length}`)
    console.log(`   Contact Submissions: ${data.contactSubmissions.length}`)

    return backupFile
  } catch (error) {
    console.error('❌ Backup failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

backup()
  .then(() => {
    console.log('\n✨ You can now safely run: npx prisma migrate dev')
    process.exit(0)
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
