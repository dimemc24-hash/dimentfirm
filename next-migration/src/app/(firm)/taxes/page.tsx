import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tax & Accounting Services Baton Rouge | IRS Resolution',
  description:
    'Baton Rouge tax preparation, bookkeeping, IRS resolution, and business tax planning since 2017. No detail too small, no deduction left behind. Free consultation — 225-612-4848.',
  alternates: { canonical: 'https://dimentfirm.com/taxes' },
  openGraph: { url: 'https://dimentfirm.com/taxes' },
};

export default function TaxesPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] text-center p-8">
      <div>
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Taxes &amp; Accounting</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Migration placeholder — port from <code>src/pages/Taxes.tsx</code>.</p>
      </div>
    </div>
  );
}
