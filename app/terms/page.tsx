import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for Psych-Skills',
}

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 lg:px-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 font-montserrat">
        <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
          Terms of Service
        </span>
      </h1>
      
      <div className="prose prose-invert max-w-none space-y-6">
        <p className="text-lg text-muted-foreground">
          Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">1. Acceptance of Terms</h2>
          <p className="text-muted-foreground">
            By accessing and using the Psych-Skills website and services, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these Terms of Service, please do not use our services.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">2. Services Provided</h2>
          <p className="text-muted-foreground">
            Psych-Skills provides sports psychology consultancy services, including but not limited to:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>One-to-one consultancy sessions</li>
            <li>Group sessions and workshops</li>
            <li>High performance support programs</li>
            <li>Supervision and mentoring for practitioners</li>
            <li>Educational content through our blog and resources</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">3. Professional Relationship</h2>
          <p className="text-muted-foreground">
            The services provided by Dr. Denise Hill are professional sports psychology consultancy services. These services are not a substitute for medical or mental health treatment. If you require clinical psychological or psychiatric services, you should seek appropriate professional help.
          </p>
          <p className="text-muted-foreground">
            Dr. Denise Hill is a HCPC registered Practitioner Psychologist and adheres to the HCPC Standards of Conduct, Performance and Ethics.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">4. Booking and Cancellation Policy</h2>
          <h3 className="text-xl font-semibold text-foreground">Bookings</h3>
          <p className="text-muted-foreground">
            All bookings are subject to confirmation. Submitting a booking request does not guarantee a session until you receive confirmation from Psych-Skills.
          </p>
          
          <h3 className="text-xl font-semibold text-foreground">Cancellations</h3>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>Clients must provide at least 48 hours notice for cancellations or rescheduling</li>
            <li>Late cancellations (less than 48 hours notice) may be subject to a cancellation fee</li>
            <li>No-shows will be charged the full session fee</li>
            <li>Emergency situations will be considered on a case-by-case basis</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">5. Payment Terms</h2>
          <p className="text-muted-foreground">
            Payment terms will be discussed and agreed upon when booking your session. Payment is typically required before or immediately after the session unless alternative arrangements have been made.
          </p>
          <p className="text-muted-foreground">
            Failure to make payment may result in the suspension of future services until the outstanding balance is settled.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">6. Confidentiality</h2>
          <p className="text-muted-foreground">
            All information shared during consultations is treated as confidential in accordance with HCPC professional standards and UK data protection laws. Confidentiality will only be broken in the following circumstances:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>Where there is a serious risk of harm to yourself or others</li>
            <li>Where required by law or court order</li>
            <li>Where disclosure is necessary to protect the rights and safety of others</li>
            <li>With your explicit written consent</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">7. Client Responsibilities</h2>
          <p className="text-muted-foreground">
            As a client, you agree to:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>Provide accurate and complete information</li>
            <li>Attend sessions on time or provide appropriate notice of cancellation</li>
            <li>Engage honestly and openly in the consultancy process</li>
            <li>Inform Dr. Hill of any concerns or issues that arise</li>
            <li>Make payment in accordance with agreed terms</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">8. Intellectual Property</h2>
          <p className="text-muted-foreground">
            All content on this website, including text, graphics, logos, images, and software, is the property of Psych-Skills or Dr. Denise Hill and is protected by copyright and intellectual property laws.
          </p>
          <p className="text-muted-foreground">
            Materials provided during sessions (worksheets, exercises, etc.) are for your personal use only and may not be reproduced or distributed without permission.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">9. Limitation of Liability</h2>
          <p className="text-muted-foreground">
            While Dr. Denise Hill strives to provide the highest quality professional services, sports psychology consultancy outcomes cannot be guaranteed. Psych-Skills and Dr. Denise Hill shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services.
          </p>
          <p className="text-muted-foreground">
            Our maximum liability is limited to the amount paid for the specific service in question.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">10. Online Sessions</h2>
          <p className="text-muted-foreground">
            For sessions conducted online:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>You are responsible for ensuring a private, quiet space for the session</li>
            <li>You must have a stable internet connection and appropriate technology</li>
            <li>Technical difficulties that prevent the session may require rescheduling</li>
            <li>Sessions may be recorded only with explicit mutual consent</li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">11. Complaints Procedure</h2>
          <p className="text-muted-foreground">
            If you have any concerns or complaints about our services, please contact us at info@psych-skills.com. We aim to resolve all complaints promptly and fairly.
          </p>
          <p className="text-muted-foreground">
            As a HCPC registered practitioner, Dr. Denise Hill is subject to the HCPC complaints procedure. Information about making a complaint to the HCPC can be found at www.hcpc-uk.org
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">12. Modifications to Terms</h2>
          <p className="text-muted-foreground">
            Psych-Skills reserves the right to modify these Terms of Service at any time. Changes will be posted on this page with an updated revision date. Continued use of our services after changes constitutes acceptance of the modified terms.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">13. Governing Law</h2>
          <p className="text-muted-foreground">
            These Terms of Service are governed by and construed in accordance with the laws of England and Wales. Any disputes arising from these terms or our services shall be subject to the exclusive jurisdiction of the courts of England and Wales.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">14. Contact Information</h2>
          <p className="text-muted-foreground">
            If you have any questions about these Terms of Service, please contact:
          </p>
          <div className="text-muted-foreground">
            <p>Email: info@psych-skills.com</p>
            <p>Location: Swansea, United Kingdom</p>
          </div>
        </section>

        <section className="space-y-4 mt-8 p-6 bg-muted/30 rounded-lg">
          <h2 className="text-2xl font-semibold text-foreground">Professional Registration</h2>
          <p className="text-muted-foreground">
            Dr. Denise Hill is registered with the Health and Care Professions Council (HCPC) as a Practitioner Psychologist. HCPC registration number available upon request.
          </p>
          <p className="text-muted-foreground">
            All services are provided in accordance with:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>HCPC Standards of Conduct, Performance and Ethics</li>
            <li>HCPC Standards of Proficiency for Practitioner Psychologists</li>
            <li>UK Data Protection legislation (GDPR)</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
