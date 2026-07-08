import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Family Law Attorney Baton Rouge | Divorce & Custody',
  description:
    'Baton Rouge family law attorneys since 2017. Divorce, child custody, child support, and spousal support. Compassionate, judgment-free guidance. Free consultation — 225-612-4404.',
  alternates: { canonical: 'https://dimentfirm.com/family-law' },
  openGraph: { url: 'https://dimentfirm.com/family-law' },
};

export default function FamilyLawPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] text-center p-8">
      <div>
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Family Law</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Migration placeholder — port from <code>src/pages/FamilyLaw.tsx</code>.</p>
      </div>
    </div>
  );
}
