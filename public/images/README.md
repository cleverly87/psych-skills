# Images Directory

Place your images here for use throughout the website.

## Recommended Images

### Essential
- **dr-denise-hill.jpg** - Professional portrait for About section (recommended: 800x1000px)
- **logo.png** - Psych-Skills logo with transparent background
- **hero-bg.jpg** - Hero section background (recommended: 1920x1080px, subtle/blurred)

### Optional
- **testimonial-photos/** - Client testimonial headshots
- **blog-images/** - Featured images for blog posts
- **service-icons/** - Custom service icons if needed

## Usage in Code

```tsx
import Image from 'next/image'

<Image 
  src="/images/dr-denise-hill.jpg" 
  alt="Dr. Denise Hill"
  width={800}
  height={1000}
  className="rounded-lg"
/>
```

## Image Optimization Tips
- Use WebP or AVIF formats for better performance
- Compress images before uploading
- Next.js will automatically optimize images during build
