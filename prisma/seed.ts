import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const hashedPassword = await bcrypt.hash('AndrewCleverly1987!', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'info@psych-skills.co.uk' },
    update: {},
    create: {
      email: 'info@psych-skills.co.uk',
      name: 'Dr. Denise Hill',
      password: hashedPassword,
      role: 'OWNER',
    },
  })

  console.log('✅ Admin user created:', admin.email)

  // Create testimonials
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

  for (const testimonial of testimonials) {
    await prisma.testimonial.upsert({
      where: { id: `testimonial-${testimonial.clientName.toLowerCase().replace(/\s+/g, '-')}` },
      update: {},
      create: {
        id: `testimonial-${testimonial.clientName.toLowerCase().replace(/\s+/g, '-')}`,
        ...testimonial,
      },
    })
  }

  console.log('✅ Testimonials created:', testimonials.length)

  // Create sample blog post - matching production
  const blogPost = await prisma.blogPost.upsert({
    where: { slug: 'discover-a-new-relationship-with-your-performance-anxiety' },
    update: {},
    create: {
      title: 'Discover a New Relationship with Your Performance Anxiety',
      slug: 'discover-a-new-relationship-with-your-performance-anxiety',
      excerpt: 'Learn how to transform your relationship with performance anxiety and use it as a tool for growth.',
      content: `# Discover a New Relationship with Your Performance Anxiety

Performance anxiety is something every athlete experiences at some point. Rather than fighting it, what if we could transform our relationship with it?

## Understanding Performance Anxiety

Performance anxiety isn't the enemy. It's your body's natural response to situations that matter to you. The key is learning to work with it, not against it.

## Practical Strategies

1. **Reframe Your Thoughts**: Instead of "I'm nervous," try "I'm excited and ready"
2. **Breathing Techniques**: Simple breath work can calm your nervous system
3. **Mental Rehearsal**: Visualize success before competing
4. **Accept the Feeling**: Fighting anxiety often makes it worse

## The Path Forward

With the right mindset and tools, performance anxiety can become a source of energy and focus rather than a barrier.

*Dr. Denise Hill*`,
      featuredImage: '/images/Blog_1.png',
      isPublished: true,
      authorId: admin.id,
    },
  })

  console.log('✅ Sample blog post created:', blogPost.title)
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
