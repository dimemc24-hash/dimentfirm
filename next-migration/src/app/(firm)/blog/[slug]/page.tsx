import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

// All blog article slugs and their metadata live here.
// When porting each article, add it to this map.
const articles: Record<string, { title: string; description: string; sourceFile: string }> = {
  'how-chapter-7-works-louisiana': {
    title: 'How Chapter 7 Bankruptcy Works in Louisiana',
    description:
      'A step-by-step guide to Chapter 7 bankruptcy in Louisiana — who qualifies, what gets discharged, Louisiana exemptions, and the full 90–120 day timeline.',
    sourceFile: 'src/pages/blog/HowChapter7Works.tsx',
  },
  'louisiana-bankruptcy-exemptions': {
    title: 'Louisiana Bankruptcy Exemptions: What You Can Keep',
    description:
      'A complete guide to Louisiana bankruptcy exemptions — home equity, vehicle, retirement accounts, and personal property.',
    sourceFile: 'src/pages/blog/LouisianaExemptions.tsx',
  },
  'chapter-7-vs-chapter-13': {
    title: 'Chapter 7 vs. Chapter 13: Which Is Right for You?',
    description:
      'A side-by-side comparison of Chapter 7 and Chapter 13 bankruptcy in Louisiana — timelines, repayment plans, property protection, and how to choose.',
    sourceFile: 'src/pages/blog/Chapter7vsChapter13.tsx',
  },
  'bankruptcy-credit-report': {
    title: 'How Long Does Bankruptcy Stay on My Credit Report?',
    description:
      'Chapter 7 stays on your credit report for 10 years; Chapter 13 for 7 years. Here\'s what that actually means and how fast you can rebuild.',
    sourceFile: 'src/pages/blog/BankruptcyCreditReport.tsx',
  },
  'keep-car-bankruptcy-louisiana': {
    title: 'Can I Keep My Car in Bankruptcy in Louisiana?',
    description:
      'Most Louisiana bankruptcy filers keep their vehicles. Learn how Chapter 7 and Chapter 13 handle car loans and the $7,500 exemption.',
    sourceFile: 'src/pages/blog/KeepCarBankruptcy.tsx',
  },
  'bankruptcy-means-test': {
    title: 'The Bankruptcy Means Test in Louisiana Explained',
    description:
      'The means test determines whether you qualify for Chapter 7 in Louisiana. Learn how it works, the income thresholds, and what happens if you don\'t pass.',
    sourceFile: 'src/pages/blog/BankruptcyMeansTest.tsx',
  },
  'stop-wage-garnishment-louisiana': {
    title: 'How Bankruptcy Stops Wage Garnishment in Louisiana',
    description:
      'Bankruptcy stops wage garnishment immediately through the automatic stay. Learn how filing halts it on your next paycheck, and whether Chapter 7 or 13 is the right move.',
    sourceFile: 'src/pages/blog/StopWageGarnishment.tsx',
  },
  'stop-repossession-louisiana': {
    title: 'Can Bankruptcy Stop a Vehicle Repossession in Louisiana?',
    description:
      'Bankruptcy stops vehicle repossession immediately through the automatic stay. Learn how filing halts a repo in progress, how Chapter 13 lets you keep your car, and what to do if your car was already taken.',
    sourceFile: 'src/pages/blog/StopRepossession.tsx',
  },
  'stop-foreclosure-louisiana': {
    title: 'How to Stop Foreclosure in Louisiana with Bankruptcy',
    description:
      'Bankruptcy stops foreclosure immediately through the automatic stay. Chapter 13 is the most powerful tool for Louisiana homeowners to halt foreclosure, cure mortgage arrears, and keep their home.',
    sourceFile: 'src/pages/blog/StopForeclosure.tsx',
  },
  'debt-settlement-vs-bankruptcy': {
    title: 'Debt Settlement vs. Bankruptcy: What Settlement Companies Won\'t Tell You',
    description:
      'Debt settlement companies promise to cut your debt — but the credit damage, fees, tax consequences, and failure rates tell a different story. An honest comparison for Louisiana residents.',
    sourceFile: 'src/pages/blog/DebtSettlementVsBankruptcy.tsx',
  },
};

// Static generation — tell Next.js all possible slugs at build time.
export function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) return {};
  return {
    title: article.title,
    description: article.description,
    alternates: { canonical: `https://dimentfirm.com/blog/${slug}` },
    openGraph: { url: `https://dimentfirm.com/blog/${slug}`, type: 'article' },
  };
}

// TODO: Replace placeholder body with ported article content.
// Each article's content lives in the Vite SPA at the sourceFile path listed above.
// Port the JSX content (the BlogPost children) into a Next.js Server Component here.
// The BlogPost wrapper itself should be rebuilt as a Next.js layout with no react-helmet.
export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articles[slug];
  if (!article) notFound();

  return (
    <div className="flex items-center justify-center min-h-[60vh] text-center p-8">
      <div>
        <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
          {article.title}
        </h1>
        <p className="mb-2" style={{ color: 'var(--color-text-muted)' }}>
          Migration placeholder — port article content from <code>{article.sourceFile}</code> in the Vite app.
        </p>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          In Next.js, this page is statically generated at build time (SSG) via <code>generateStaticParams</code>.
          Google receives fully-rendered HTML immediately — no JS execution required.
        </p>
      </div>
    </div>
  );
}
