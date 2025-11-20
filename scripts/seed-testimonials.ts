import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const testimonials = [
  {
    clientName: 'Lydia Hall',
    clientTitle: 'Ladies European Tour Member and Winner',
    content: 'I have been working with Denise closely over the past two years and she has helped me to not only rediscover who I am as a professional golfer, but who I am as a person, and who I want to be. Her help and knowledge in applying psychology in sport has reignited my love of golf, and most importantly, has allowed me to be my authentic self.',
    rating: 5,
    imageUrl: '/images/Lydia Hall.png',
    isApproved: true,
  },
  {
    clientName: 'Amy Walsh',
    clientTitle: 'European Tour Member',
    content: 'I have been working with Denise for a little over a year and the progress I have made in that time has taken me from questioning my place in the world of professional golf, to excitedly looking forward to the season ahead. I was totally crippled by anxiety on the golf course. However thanks to Denise\'s extensive expertise, and her real world approach to implementing techniques, I\'m well on my way to reaching my goals. Thanks Denise for making me feel heard and understood, and for your no-nonsense way of continuing to help me find my best self!',
    rating: 5,
    imageUrl: '/images/Amy Walsh.png',
    isApproved: true,
  },
  {
    clientName: 'Julian Kelly',
    clientTitle: 'Captain Southerndown Golf Club 2023',
    content: 'During my year as Captain of Southerndown Golf Club, I tried to vary the programme of events to offer something of interest to all members. Denise\'s session was one of the best received, and by far the easiest to sell tickets for. Her insight into the balance of time working on physical, technical ability and psychology for your game, was intuitive and inspirational.',
    rating: 5,
    imageUrl: null,
    isApproved: true,
  },
  {
    clientName: 'Cardiff Golf Club',
    clientTitle: 'Group Workshop',
    content: 'Denise is fantastic & has a great energy. Denise\'s session was one of the best received, and by far the easiest to sell tickets for. Her insight into the balance of time working on physical, technical ability and psychology for your game, was intuitive and inspirational.',
    rating: 5,
    imageUrl: null,
    isApproved: true,
  },
]

async function main() {
  console.log('Starting testimonials seed...')

  // Delete existing testimonials (optional - comment out if you want to keep existing ones)
  await prisma.testimonial.deleteMany({})
  console.log('Cleared existing testimonials')

  // Create testimonials
  for (const testimonial of testimonials) {
    const created = await prisma.testimonial.create({
      data: testimonial,
    })
    console.log(`Created testimonial: ${created.clientName}`)
  }

  console.log('Testimonials seed completed!')
}

main()
  .catch((e) => {
    console.error('Error seeding testimonials:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
