import { Link } from 'react-router-dom'
import { ArrowLeft, FileText } from 'lucide-react'

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      {/* ─── Top bar ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link
            to="/academy"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <span className="text-sm font-bold text-fresh-blue">Fresh Start Academy</span>
        </div>
      </header>

      {/* ─── Content ────────────────────────────────────────────── */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-fresh-blue" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Terms of Service</h1>
            <p className="text-sm text-gray-400 mt-0.5">Last updated: February 2026</p>
          </div>
        </div>

        <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-a:text-fresh-blue">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using Fresh Start Academy (&ldquo;the Service&rdquo;), you agree
            to be bound by these Terms of Service. If you do not agree to these terms, please
            do not use the Service.
          </p>

          <h2>2. Description of Service</h2>
          <p>
            Fresh Start Academy is a subscription-based online financial education course
            designed for individuals who have completed bankruptcy proceedings. The Service
            includes educational modules, interactive games, progress tracking, and
            personalized content paths for Chapter 7 and Chapter 13 bankruptcy graduates.
          </p>
          <p>
            <strong>The Service provides general financial education only.</strong> It does not
            constitute financial, legal, or tax advice. Always consult with qualified
            professionals for advice specific to your situation.
          </p>

          <h2>3. Account Registration</h2>
          <ul>
            <li>You must be at least 18 years of age to create an account</li>
            <li>You must provide a valid email address and create a secure password</li>
            <li>You are responsible for maintaining the confidentiality of your account credentials</li>
            <li>You agree to notify us immediately of any unauthorized use of your account</li>
            <li>One account per person; shared accounts are not permitted</li>
          </ul>

          <h2>4. Subscription &amp; Billing</h2>
          <h3>4.1 Free Trial</h3>
          <p>
            New users receive a 14-day free trial (or longer if using an invite link with
            extended trial). No credit card is required to begin. You will not be charged
            until you actively subscribe after your trial ends.
          </p>

          <h3>4.2 Subscription Plans</h3>
          <ul>
            <li>The Service is offered as a monthly subscription at the price displayed at signup</li>
            <li>Subscriptions renew automatically each billing period unless canceled</li>
            <li>Prices may change with 30 days&rsquo; notice; existing subscribers retain their rate until their next renewal after the notice period</li>
          </ul>

          <h3>4.3 Payment</h3>
          <ul>
            <li>Payments are processed securely by Stripe</li>
            <li>We do not store your credit card information</li>
            <li>Failed payments trigger a 7-day grace period before access is restricted</li>
          </ul>

          <h3>4.4 Cancellation</h3>
          <ul>
            <li>You may cancel your subscription at any time through the Billing page or Stripe Customer Portal</li>
            <li>Upon cancellation, you retain access until the end of your current billing period</li>
            <li>Your progress data is retained for 12 months after cancellation</li>
            <li>No partial refunds for unused portions of a billing period</li>
          </ul>

          <h2>5. Concurrent Session Limits</h2>
          <p>
            To maintain platform security and fair usage, accounts are limited to 2 concurrent
            active sessions (devices). If you sign in on a third device, the oldest session
            will be automatically signed out. This limit ensures the security of your account
            and is not adjustable.
          </p>

          <h2>6. Invite Links</h2>
          <p>
            If you received access through an invite link from your attorney or legal
            professional:
          </p>
          <ul>
            <li>Your referring professional may have visibility into your course progress (modules completed, completion percentage)</li>
            <li>They will <strong>not</strong> have access to your quiz answers, reflection journal entries, or game details</li>
            <li>Extended trial periods granted via invite links are at the discretion of the referring professional</li>
          </ul>

          <h2>7. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul>
            <li>Share your account credentials with others</li>
            <li>Attempt to access other users&rsquo; data or accounts</li>
            <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
            <li>Copy, reproduce, or redistribute course content without permission</li>
            <li>Use automated tools (bots, scrapers) to access the Service</li>
            <li>Interfere with the Service&rsquo;s security features or infrastructure</li>
            <li>Use the Service for any unlawful purpose</li>
          </ul>

          <h2>8. Intellectual Property</h2>
          <p>
            All course content, including text, images, games, mascot characters (Hariette
            and Sheldon), quizzes, and interactive elements, is the intellectual property of
            Fresh Start Academy and the Diment Law Firm. You are granted a limited,
            non-exclusive, non-transferable license to access the content for personal
            educational use during your active subscription.
          </p>

          <h2>9. Disclaimer of Warranties</h2>
          <p>
            The Service is provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; We
            make no warranties, express or implied, regarding:
          </p>
          <ul>
            <li>The accuracy or completeness of course content</li>
            <li>Uninterrupted or error-free operation of the Service</li>
            <li>Results or outcomes from following the course material</li>
            <li>Fitness for any particular financial purpose</li>
          </ul>
          <p>
            <strong>This course is educational in nature and is not a substitute for
            professional financial, legal, or tax advice.</strong>
          </p>

          <h2>10. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Fresh Start Academy, the Diment Law Firm,
            and their officers, directors, employees, and agents shall not be liable for any
            indirect, incidental, special, consequential, or punitive damages arising from
            your use of or inability to use the Service, including but not limited to financial
            losses resulting from decisions made based on course content.
          </p>

          <h2>11. Account Termination</h2>
          <p>We reserve the right to suspend or terminate your account if you:</p>
          <ul>
            <li>Violate these Terms of Service</li>
            <li>Engage in fraudulent activity</li>
            <li>Share or redistribute course content</li>
            <li>Abuse the platform in a way that negatively affects other users</li>
          </ul>
          <p>
            In the case of termination for cause, any remaining subscription period is
            forfeited. Your data will be deleted according to our Privacy Policy.
          </p>

          <h2>12. Changes to Terms</h2>
          <p>
            We may modify these Terms of Service at any time. Material changes will be
            communicated via email or in-app notification at least 14 days before they take
            effect. Continued use of the Service after changes take effect constitutes
            acceptance of the new terms.
          </p>

          <h2>13. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the
            State of Texas, without regard to its conflict of law provisions. Any disputes
            shall be resolved in the state or federal courts located in Texas.
          </p>

          <h2>14. Contact</h2>
          <p>
            For questions about these Terms, contact us at:{' '}
            <a href="mailto:support@freshstartacademy.com">support@freshstartacademy.com</a>
          </p>
          <p>
            Fresh Start Academy is an initiative of the Diment Law Firm.
          </p>
        </div>
      </main>

      {/* ─── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 py-6 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Fresh Start Academy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
