import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bankruptcy Attorney Baton Rouge | Chapter 7 & 13',
  description:
    'Louisiana bankruptcy attorneys helping families since 2017. Stop foreclosure, repossession & wage garnishment. Chapter 7 fresh start or Chapter 13 structured plan. Free evaluation — 225-612-4848.',
  alternates: { canonical: 'https://dimentfirm.com/bankruptcy' },
  openGraph: { url: 'https://dimentfirm.com/bankruptcy' },
};

// TODO: Port Bankruptcy.tsx from the Vite SPA here.
export default function BankruptcyPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] text-center p-8">
      <div>
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          Bankruptcy
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Migration placeholder — port from <code>src/pages/Bankruptcy.tsx</code>.
        </p>
      </div>
    </div>
  );
}
