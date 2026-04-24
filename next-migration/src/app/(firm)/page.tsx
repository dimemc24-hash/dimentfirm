import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Baton Rouge Law Firm | Bankruptcy, Family Law & Tax',
  description:
    'Full-service law firm in Baton Rouge, LA since 2017. Chapter 7 & 13 bankruptcy, stop foreclosure, repossession & garnishment, family law, small business, and tax. Free consultations.',
  alternates: { canonical: 'https://dimentfirm.com/' },
  openGraph: { url: 'https://dimentfirm.com/' },
};

// TODO: Port Home.tsx from the Vite SPA here.
// The component logic and styles are in ../../../src/pages/Home.tsx (Vite app).
// Replace the inline <style> blocks with Tailwind classes or CSS Modules.
export default function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] text-center p-8">
      <div>
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          Home Page
        </h1>
        <p className="text-lg" style={{ color: 'var(--color-text-muted)' }}>
          Migration placeholder — port from <code>src/pages/Home.tsx</code> in the Vite app.
        </p>
      </div>
    </div>
  );
}
