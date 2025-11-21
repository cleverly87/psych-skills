import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary font-montserrat">Psych-Skills</h3>
            <p className="text-sm text-muted-foreground">
              Expert sports psychology services for golfers, helping you achieve peak performance and reach your full potential.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About Dr. Denise Hill
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/testimonials" className="text-muted-foreground hover:text-primary transition-colors">
                  Testimonials
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="font-semibold">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services#one-to-one" className="text-muted-foreground hover:text-primary transition-colors">
                  1-2-1 Consultancy
                </Link>
              </li>
              <li>
                <Link href="/services#group" className="text-muted-foreground hover:text-primary transition-colors">
                  Group Sessions
                </Link>
              </li>
              <li>
                <Link href="/services#performance" className="text-muted-foreground hover:text-primary transition-colors">
                  High Performance Support
                </Link>
              </li>
              <li>
                <Link href="/services#supervision" className="text-muted-foreground hover:text-primary transition-colors">
                  Supervision & Mentoring
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <span className="text-muted-foreground">
                  Swansea, United Kingdom
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <a 
                  href="mailto:info@psych-skills.com" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  info@psych-skills.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Psych-Skills. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="/admin/login" className="text-muted-foreground hover:text-primary transition-colors">
                Login
              </Link>
            </div>
          </div>
          <div className="mt-4 flex flex-col items-center gap-2">
            <p className="text-center text-xs text-muted-foreground">
              Dr. Denise Hill - HCPC Registered Practitioner Psychologist
            </p>
            <p className="text-center text-xs text-muted-foreground/60">
              System built by{' '}
              <a 
                href="https://clever-technical-writing.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary/80 hover:text-primary transition-colors font-medium"
              >
                CTW
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
