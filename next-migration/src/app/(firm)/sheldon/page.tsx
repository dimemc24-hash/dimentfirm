import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chapter 13 Bankruptcy Baton Rouge | Keep Your Home & Car',
  description:
    'Chapter 13 bankruptcy in Louisiana lets you keep your home, stop foreclosure, and catch up on missed payments in one affordable plan. Baton Rouge attorneys since 2017. Free evaluation.',
  alternates: { canonical: 'https://dimentfirm.com/sheldon' },
  openGraph: { url: 'https://dimentfirm.com/sheldon' },
};

// TODO: Port SheldonPath.tsx from the Vite SPA here.
export default function SheldonPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] text-center p-8">
      <div>
        <span className="text-7xl block mb-4">🐢</span>
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          Sheldon's Steady Path
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Migration placeholder — port from <code>src/pages/SheldonPath.tsx</code>.
        </p>
      </div>
    </div>
  );
}
