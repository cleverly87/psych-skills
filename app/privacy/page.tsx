import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Psych-Skills',
}

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 lg:px-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 font-montserrat">
        <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
          Privacy Policy
        </span>
      </h1>
      
      <div className="prose prose-invert max-w-none space-y-6">
        <p className="text-lg text-muted-foreground">
          Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">1. Introduction</h2>
          <p className="text-muted-foreground">
            Psych-Skills ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">2. Information We Collect</h2>
          <h3 className="text-xl font-semibold text-foreground">Personal Information</h3>
          <p className="text-muted-foreground">
            We may collect personal information that you voluntarily provide to us when you:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>Book a session or consultation</li>
            <li>Contact us via our contact form</li>
            <li>Subscribe to our newsletter or blog updates</li>
            <li>Register for an account on our website</li>
          </ul>
          <p className="text-muted-foreground">
            This information may include: name, email address, phone number, and any other information you choose to provide.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">3. How We Use Your Information</h2>
          <p className="text-muted-foreground">
            We use the information we collect to:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>Process and manage your bookings and appointments</li>
            <li>Communicate with you about our services</li>
            <li>Respond to your inquiries and provide customer support</li>
            <li>Send you updates, newsletters, and marketing communications (with your consent)</li>
            <li>Improve our website and services</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">4. Data Storage and Security</h2>
          <p className="text-muted-foreground">
            We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your data is stored securely using industry-standard encryption and security protocols.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">5. Professional Confidentiality</h2>
          <p className="text-muted-foreground">
            As a HCPC registered Practitioner Psychologist, Dr. Denise Hill adheres to strict professional confidentiality standards. Any information shared during consultations or sessions is treated with the utmost confidentiality in accordance with professional ethical guidelines and legal requirements.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">6. Disclosure of Your Information</h2>
          <p className="text-muted-foreground">
            We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>With your explicit consent</li>
            <li>To comply with legal obligations or court orders</li>
            <li>To protect our rights, privacy, safety, or property</li>
            <li>With service providers who assist us in operating our website (under strict confidentiality agreements)</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">7. Your Rights</h2>
          <p className="text-muted-foreground">
            Under UK GDPR, you have the following rights:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>The right to access your personal data</li>
            <li>The right to rectification of inaccurate data</li>
            <li>The right to erasure ("right to be forgotten")</li>
            <li>The right to restrict processing</li>
            <li>The right to data portability</li>
            <li>The right to object to processing</li>
            <li>Rights related to automated decision-making</li>
          </ul>
          <p className="text-muted-foreground">
            To exercise any of these rights, please contact us at info@psych-skills.com
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">8. Cookies</h2>
          <p className="text-muted-foreground">
            Our website may use cookies to enhance your browsing experience. Cookies are small files stored on your device that help us understand how you use our site. You can control cookie settings through your browser preferences.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">9. Data Retention</h2>
          <p className="text-muted-foreground">
            We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law or professional standards.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">10. Changes to This Privacy Policy</h2>
          <p className="text-muted-foreground">
            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date. We encourage you to review this Privacy Policy periodically.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">11. Contact Information</h2>
          <p className="text-muted-foreground">
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="text-muted-foreground">
            <p>Email: info@psych-skills.com</p>
            <p>Address: Swansea, United Kingdom</p>
          </div>
        </section>

        <section className="space-y-4 mt-8 p-6 bg-muted/30 rounded-lg">
          <h2 className="text-2xl font-semibold text-foreground">HCPC Registration</h2>
          <p className="text-muted-foreground">
            Dr. Denise Hill is a registered Practitioner Psychologist with the Health and Care Professions Council (HCPC). All services are provided in accordance with HCPC Standards of Conduct, Performance and Ethics.
          </p>
        </section>
      </div>
    </div>
  )
}
