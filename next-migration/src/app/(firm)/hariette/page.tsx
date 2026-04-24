import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Chapter 7 Bankruptcy Louisiana | Fresh Start in 90 Days',
  description:
    'Eliminate credit card debt, medical bills, and personal loans with Chapter 7 bankruptcy in Louisiana. Discharge in 90–120 days. Stop wage garnishment and creditor harassment. Free evaluation.',
  alternates: { canonical: 'https://dimentfirm.com/hariette' },
  openGraph: { url: 'https://dimentfirm.com/hariette' },
};

// TODO: Port HariettePath.tsx from the Vite SPA here.
export default function HariettePage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] text-center p-8">
      <div>
        <span className="text-7xl block mb-4">🐰</span>
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          Hariette's Quick Sprint
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>
          Migration placeholder — port from <code>src/pages/HariettePath.tsx</code>.
        </p>
      </div>
    </div>
  );
}
