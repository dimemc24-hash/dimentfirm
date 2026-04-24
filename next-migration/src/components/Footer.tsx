import Link from 'next/link';

const PHONE = '225-612-0765';

export default function Footer() {
  return (
    <footer className="border-t py-12 mt-auto" style={{ background: 'var(--color-background)', borderColor: 'var(--color-border)' }}>
      <div className="container grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            Diment &amp; Associates
          </h3>
          <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--color-text-muted)' }}>
            Full-service legal guidance for individuals, families, and small businesses across Baton Rouge and Louisiana. Serving clients since 2017.
          </p>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            <strong className="text-gray-800">Phone:</strong> {PHONE}<br />
            <strong className="text-gray-800">Office:</strong> Baton Rouge, LA
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Practice Areas</h4>
          <ul className="flex flex-col gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            <li><Link href="/bankruptcy" className="hover:text-gray-900 transition-colors">Bankruptcy</Link></li>
            <li><Link href="/family-law" className="hover:text-gray-900 transition-colors">Family Law</Link></li>
            <li><Link href="/small-business" className="hover:text-gray-900 transition-colors">Small Business</Link></li>
            <li><Link href="/taxes" className="hover:text-gray-900 transition-colors">Taxes &amp; Accounting</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Resources</h4>
          <ul className="flex flex-col gap-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            <li><Link href="/blog" className="hover:text-gray-900 transition-colors">All Guides &amp; Articles</Link></li>
            <li><Link href="/blog/chapter-7-vs-chapter-13" className="hover:text-gray-900 transition-colors">Chapter 7 vs. Chapter 13</Link></li>
            <li><Link href="/blog/how-chapter-7-works-louisiana" className="hover:text-gray-900 transition-colors">How Chapter 7 Works</Link></li>
            <li><Link href="/blog/louisiana-bankruptcy-exemptions" className="hover:text-gray-900 transition-colors">Louisiana Exemptions</Link></li>
            <li><Link href="/blog/keep-car-bankruptcy-louisiana" className="hover:text-gray-900 transition-colors">Keeping Your Car</Link></li>
            <li><Link href="/blog/bankruptcy-means-test" className="hover:text-gray-900 transition-colors">The Means Test</Link></li>
            <li><Link href="/sheldon" className="hover:text-gray-900 transition-colors">Sheldon's Path (Ch. 13)</Link></li>
            <li><Link href="/hariette" className="hover:text-gray-900 transition-colors">Hariette's Path (Ch. 7)</Link></li>
            <li><Link href="/academy" className="hover:text-gray-900 transition-colors">Fresh Start Academy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Get Help Now</h4>
          <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
            Free evaluation with a Louisiana bankruptcy attorney. No obligation, no judgment.
          </p>
          <a
            href="https://outlook.office.com/book/DimentAssociatesAppointmentsPublicCopy@dimentfirm.com/?ismsaljsauthenabled"
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center px-4 py-2.5 rounded-full text-sm font-bold text-white transition-opacity hover:opacity-90"
            style={{ fontFamily: 'var(--font-heading)', background: 'var(--color-turtle-green)' }}
          >
            Book Free Evaluation
          </a>
        </div>
      </div>

      <div className="container mt-8 pt-6 text-center text-sm border-t" style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}>
        &copy; {new Date().getFullYear()} Diment &amp; Associates. All rights reserved.
      </div>
    </footer>
  );
}
