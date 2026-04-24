import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://dimentfirm.com'),
  title: {
    default: 'Diment & Associates | Baton Rouge Law Firm',
    template: '%s | Diment & Associates',
  },
  description:
    'Full-service law firm in Baton Rouge, LA serving clients since 2017. Bankruptcy (Ch. 7 & 13), stop foreclosure, repossession & garnishment, family law, small business, and tax. Free consultations.',
  openGraph: {
    siteName: 'Diment & Associates',
    locale: 'en_US',
    type: 'website',
    images: ['/firm/watermarked-10bc01e4-3ff5-4e21-8099-ae406a35f2d9.jpg'],
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  );
}
