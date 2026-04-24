import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Small Business Attorney Baton Rouge | Contracts & Business Law',
  description:
    'Baton Rouge small business attorneys since 2017. Contracts, business formation, operations advising, and litigation. Sharp-eyed counsel for every stage of your business. Free consultation.',
  alternates: { canonical: 'https://dimentfirm.com/small-business' },
  openGraph: { url: 'https://dimentfirm.com/small-business' },
};

export default function SmallBusinessPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] text-center p-8">
      <div>
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Small Business</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Migration placeholder — port from <code>src/pages/SmallBusiness.tsx</code>.</p>
      </div>
    </div>
  );
}
