import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Updating testimonial display order...')

  // Set Lydia Hall to order 1
  await prisma.testimonial.updateMany({
    where: { clientName: 'Lydia Hall' },
    data: { displayOrder: 1 }
  })
  console.log('Set Lydia Hall to order 1')

  // Set Amy Walsh to order 2
  await prisma.testimonial.updateMany({
    where: { clientName: 'Amy Walsh' },
    data: { displayOrder: 2 }
  })
  console.log('Set Amy Walsh to order 2')

  // Set Julian Kelly to order 3
  await prisma.testimonial.updateMany({
    where: { clientName: 'Julian Kelly' },
    data: { displayOrder: 3 }
  })
  console.log('Set Julian Kelly to order 3')

  // Set Cardiff Golf Club to order 4
  await prisma.testimonial.updateMany({
    where: { clientName: 'Cardiff Golf Club' },
    data: { displayOrder: 4 }
  })
  console.log('Set Cardiff Golf Club to order 4')

  console.log('Display order updated successfully!')
}

main()
  .catch((e) => {
    console.error('Error updating display order:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
