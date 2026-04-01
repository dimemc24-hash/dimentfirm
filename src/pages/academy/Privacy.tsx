import { Link } from 'react-router-dom'
import { ArrowLeft, Shield } from 'lucide-react'

export default function Privacy() {
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
            <Shield className="w-5 h-5 text-fresh-blue" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Privacy Policy</h1>
            <p className="text-sm text-gray-400 mt-0.5">Last updated: February 2026</p>
          </div>
        </div>

        <div className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-a:text-fresh-blue">
          <h2>1. Introduction</h2>
          <p>
            Fresh Start Academy (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) is
            committed to protecting your privacy. This Privacy Policy explains how we collect,
            use, disclose, and safeguard your information when you use our post-bankruptcy
            financial education platform.
          </p>
          <p>
            We understand that our users have been through bankruptcy proceedings and treat
            all data with the highest level of sensitivity. <strong>The mere existence of an
            account on our platform could imply bankruptcy history</strong>, and we handle
            this accordingly.
          </p>

          <h2>2. Information We Collect</h2>
          <h3>2.1 Information You Provide</h3>
          <ul>
            <li><strong>Account information:</strong> Email address, display name (your choice), and password</li>
            <li><strong>Course selections:</strong> Your chosen bankruptcy chapter path (Chapter 7 or Chapter 13)</li>
            <li><strong>Course activity:</strong> Lesson progress, quiz scores, game scores, and reflection responses</li>
            <li><strong>Payment information:</strong> Processed entirely by Stripe — we never see or store your card number</li>
          </ul>

          <h3>2.2 Information Collected Automatically</h3>
          <ul>
            <li><strong>Device information:</strong> Browser type, device type, and a hashed device identifier (for concurrent session limits)</li>
            <li><strong>Usage data:</strong> Pages visited, features used, and time spent (aggregated, not individually tracked)</li>
            <li><strong>IP address:</strong> Used only for session management; not stored long-term</li>
          </ul>

          <h3>2.3 Information We Do NOT Collect</h3>
          <ul>
            <li>Bankruptcy case numbers or filing details</li>
            <li>Debt amounts, creditor names, or financial account numbers</li>
            <li>Social Security numbers or government IDs</li>
            <li>Health information</li>
            <li>Location data beyond IP-based country</li>
          </ul>

          <h2>3. How We Use Your Information</h2>
          <ul>
            <li>Deliver and personalize course content for your bankruptcy chapter path</li>
            <li>Track your progress, streaks, badges, and XP</li>
            <li>Process payments and manage your subscription</li>
            <li>Enforce concurrent session limits (maximum 2 devices)</li>
            <li>Send transactional emails (welcome, password reset, subscription changes)</li>
            <li>Generate aggregated, anonymized analytics to improve the course</li>
          </ul>

          <h2>4. Information Sharing</h2>
          <p>
            <strong>We do not sell, rent, or share your personal information with third
            parties for marketing purposes. Ever.</strong>
          </p>
          <p>We share information only with:</p>
          <ul>
            <li>
              <strong>Supabase</strong> (database and authentication provider) — processes data
              per their{' '}
              <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">
                privacy policy
              </a>
            </li>
            <li>
              <strong>Stripe</strong> (payment processor) — processes payment data per their{' '}
              <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer">
                privacy policy
              </a>
            </li>
            <li>
              <strong>Vercel</strong> (hosting provider) — serves the application per their{' '}
              <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">
                privacy policy
              </a>
            </li>
            <li>
              <strong>Your referring attorney</strong> (if you signed up via an invite link) —
              they can see your course progress but not your quiz answers or reflection responses
            </li>
          </ul>

          <h2>5. Data Security</h2>
          <ul>
            <li>All data transmitted via HTTPS/TLS encryption</li>
            <li>Passwords hashed with bcrypt (via Supabase Auth)</li>
            <li>Row-Level Security (RLS) on all database tables — users can only access their own data</li>
            <li>No sensitive data in frontend code or browser storage</li>
            <li>Regular security review of infrastructure and dependencies</li>
          </ul>

          <h2>6. Data Retention</h2>
          <ul>
            <li><strong>Active accounts:</strong> Data retained as long as your account is active</li>
            <li><strong>Canceled subscriptions:</strong> Account and progress data retained for 12 months, then deleted unless you request earlier deletion</li>
            <li><strong>Session data:</strong> Active session records deleted after 30 minutes of inactivity</li>
            <li><strong>Payment records:</strong> Retained by Stripe per their policies; we keep only subscription status</li>
          </ul>

          <h2>7. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li><strong>Access</strong> your personal data — view your profile, progress, and settings at any time</li>
            <li><strong>Correct</strong> your data — update your display name and email in Settings</li>
            <li><strong>Delete</strong> your account — contact us and we will permanently delete all your data (cascade delete across all tables)</li>
            <li><strong>Export</strong> your data — request a copy of your course progress and account data</li>
            <li><strong>Opt out</strong> of non-essential communications</li>
          </ul>

          <h2>8. Cookies &amp; Local Storage</h2>
          <p>
            We use <strong>essential cookies only</strong> for authentication (Supabase session tokens).
            We also use browser localStorage to persist your app settings (dark mode, sound preferences).
            We do not use advertising cookies, tracking pixels, or third-party analytics.
          </p>

          <h2>9. Children&rsquo;s Privacy</h2>
          <p>
            Fresh Start Academy is designed for adults who have been through bankruptcy proceedings.
            We do not knowingly collect information from anyone under the age of 18. If we learn
            that we have collected personal information from a minor, we will delete it promptly.
          </p>

          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. We will notify you of material
            changes by posting the new policy on this page and updating the &ldquo;Last
            updated&rdquo; date. Continued use of the platform after changes constitutes
            acceptance of the updated policy.
          </p>

          <h2>11. Contact</h2>
          <p>
            For privacy-related questions or requests, contact us at:{' '}
            <a href="mailto:privacy@freshstartacademy.com">privacy@freshstartacademy.com</a>
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
