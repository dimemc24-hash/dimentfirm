import type { Metadata } from 'next';

// Mall landing is standalone — no firm nav/footer — so it lives outside (firm)
// and has its own minimal layout.
export const metadata: Metadata = {
  title: 'Debt Relief Baton Rouge | Stop Foreclosure, Repossession & Garnishment',
  description:
    'Overwhelmed by debt? Diment & Associates stops foreclosure, vehicle repossession, and wage garnishment through bankruptcy. Chapter 7 or Chapter 13 — free evaluation. Baton Rouge, LA.',
  alternates: { canonical: 'https://dimentfirm.com/mall' },
  robots: { index: false, follow: true },
};

// TODO: Port MallLanding.tsx from the Vite SPA here.
// This page intentionally has no shared firm nav/footer (focused conversion funnel).
export default function MallLandingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen text-center p-8">
      <div>
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          Mall Landing
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Migration placeholder — port from <code>src/pages/MallLanding.tsx</code> in the Vite app.
        </p>
      </div>
    </div>
  );
}
