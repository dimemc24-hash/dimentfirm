import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bankruptcy Resources & Guides',
  description:
    'Free bankruptcy guides from Diment & Associates in Baton Rouge, Louisiana. Chapter 7, Chapter 13, exemptions, means test, credit rebuilding, and more.',
  alternates: { canonical: 'https://dimentfirm.com/blog' },
  openGraph: { url: 'https://dimentfirm.com/blog' },
};

// TODO: Port BlogIndex.tsx from the Vite SPA here.
// In Next.js this will be a Server Component — no react-helmet needed,
// metadata is exported above via generateMetadata or the static export.
export default function BlogIndexPage() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] text-center p-8">
      <div>
        <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>Resources &amp; Guides</h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Migration placeholder — port from <code>src/pages/blog/BlogIndex.tsx</code>.</p>
      </div>
    </div>
  );
}
