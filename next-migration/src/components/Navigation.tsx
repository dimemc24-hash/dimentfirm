'use client';

import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const BOOKING_URL =
  'https://outlook.office.com/book/DimentAssociatesAppointmentsPublicCopy@dimentfirm.com/?ismsaljsauthenabled';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={[
        'sticky top-0 z-50 transition-all duration-300',
        scrolled ? 'py-2 shadow-sm' : 'py-4',
      ].join(' ')}
      style={{
        background: 'linear-gradient(135deg, var(--color-turtle-green) 0%, #2d6a4f 60%, hsl(210,25%,30%) 100%)',
      }}
    >
      <div className="container flex items-center gap-8">
        <Link href="/" className="flex items-center gap-3 text-white font-bold text-xl shrink-0 mr-auto" style={{ fontFamily: 'var(--font-heading)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Diment & Associates" height={36} className="h-9 w-auto object-contain" />
          <span className="hidden sm:inline">Diment &amp; Associates</span>
        </Link>

        {/* Desktop */}
        <nav className="hidden lg:flex items-center gap-6 text-sm">
          {[
            ['/bankruptcy', 'Bankruptcy'],
            ['/family-law', 'Family Law'],
            ['/small-business', 'Small Business'],
            ['/taxes', 'Taxes'],
            ['/blog', 'Resources'],
            ['/academy', 'Academy'],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="text-white/90 hover:text-white font-medium transition-colors relative group"
            >
              {label}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-white transition-all group-hover:w-full" />
            </Link>
          ))}
          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 px-5 py-2 rounded-full bg-white text-sm font-bold transition-colors hover:bg-white/90"
            style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-text-main)' }}
          >
            Free Consultation
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-md border-b border-gray-100 flex flex-col p-4 gap-1">
          {[
            ['/bankruptcy', 'Bankruptcy'],
            ['/family-law', 'Family Law'],
            ['/small-business', 'Small Business'],
            ['/taxes', 'Taxes & Accounting'],
            ['/blog', 'Resources & Guides'],
            ['/academy', 'Fresh Start Academy'],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className="px-4 py-3 rounded-lg font-medium text-gray-800 hover:bg-green-50 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
