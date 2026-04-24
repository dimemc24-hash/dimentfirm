import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, BookOpen } from 'lucide-react';

const articles = [
  {
    to: '/blog/how-chapter-7-works-louisiana',
    title: 'How Chapter 7 Bankruptcy Works in Louisiana',
    description: 'A step-by-step guide to the Chapter 7 process — who qualifies, what gets discharged, Louisiana exemptions, and the full 90–120 day timeline.',
    badge: 'Chapter 7',
    badgeColor: 'hare',
    readTime: '8 min read',
  },
  {
    to: '/blog/louisiana-bankruptcy-exemptions',
    title: 'Louisiana Bankruptcy Exemptions: What You Can Keep',
    description: 'Home equity, your vehicle, retirement accounts, personal property — a complete breakdown of what Louisiana law protects when you file bankruptcy.',
    badge: 'Exemptions',
    badgeColor: 'neutral',
    readTime: '7 min read',
  },
  {
    to: '/blog/chapter-7-vs-chapter-13',
    title: 'Chapter 7 vs. Chapter 13: Which Is Right for You?',
    description: 'A side-by-side comparison of both bankruptcy chapters — timelines, repayment plans, property protection, and how to decide between Sheldon and Hariette\'s path.',
    badge: 'Comparison',
    badgeColor: 'both',
    readTime: '9 min read',
  },
  {
    to: '/blog/bankruptcy-credit-report',
    title: 'How Long Does Bankruptcy Stay on My Credit Report?',
    description: 'Chapter 7 reports for 10 years, Chapter 13 for 7. But the real story is more encouraging — here\'s what bankruptcy actually does to your credit and how fast you can rebuild.',
    badge: 'Credit',
    badgeColor: 'neutral',
    readTime: '7 min read',
  },
  {
    to: '/blog/keep-car-bankruptcy-louisiana',
    title: 'Can I Keep My Car in Bankruptcy in Louisiana?',
    description: 'Most Louisiana filers keep their vehicles. Learn the $7,500 vehicle exemption, reaffirmation agreements, how to stop repossession, and Chapter 13\'s cramdown option.',
    badge: 'Vehicle',
    badgeColor: 'hare',
    readTime: '8 min read',
  },
  {
    to: '/blog/bankruptcy-means-test',
    title: 'The Bankruptcy Means Test in Louisiana Explained',
    description: 'The means test determines whether you qualify for Chapter 7. Learn the Louisiana median income thresholds, how allowed expenses work, and what happens if you don\'t pass.',
    badge: 'Means Test',
    badgeColor: 'turtle',
    readTime: '8 min read',
  },
  {
    to: '/blog/stop-foreclosure-louisiana',
    title: 'How to Stop Foreclosure in Louisiana with Bankruptcy',
    description: 'Chapter 13 stops foreclosure the moment you file and gives you 3–5 years to cure arrears. Learn how the automatic stay works, lien stripping, and what Chapter 7 can and can\'t do.',
    badge: 'Foreclosure',
    badgeColor: 'turtle',
    readTime: '7 min read',
  },
  {
    to: '/blog/stop-repossession-louisiana',
    title: 'Can Bankruptcy Stop a Vehicle Repossession in Louisiana?',
    description: 'Louisiana is a self-help repo state — a lender can take your car without notice. Bankruptcy stops it immediately. Learn about the automatic stay, cramdown, and recovering a recently repossessed vehicle.',
    badge: 'Repossession',
    badgeColor: 'hare',
    readTime: '6 min read',
  },
  {
    to: '/blog/stop-wage-garnishment-louisiana',
    title: 'How Bankruptcy Stops Wage Garnishment in Louisiana',
    description: 'A creditor is taking 25% of your paycheck. Bankruptcy stops that immediately — your very next paycheck is full. Learn how the automatic stay works and whether Chapter 7 or 13 is the right move.',
    badge: 'Garnishment',
    badgeColor: 'hare',
    readTime: '6 min read',
  },
  {
    to: '/blog/debt-settlement-vs-bankruptcy',
    title: 'Debt Settlement vs. Bankruptcy: What Settlement Companies Won\'t Tell You',
    description: 'The ads make debt settlement sound better than bankruptcy — but years of credit damage, 15–25% fees, lawsuit exposure, and 1099-C tax bills tell a different story. An honest comparison.',
    badge: 'Debt Settlement',
    badgeColor: 'neutral',
    readTime: '9 min read',
  },
];

const badgeStyles: Record<string, { bg: string; color: string }> = {
  hare:    { bg: 'hsl(30, 80%, 90%)',   color: 'hsl(20, 65%, 30%)' },
  turtle:  { bg: 'hsl(152, 50%, 88%)',  color: 'hsl(152, 55%, 25%)' },
  both:    { bg: 'hsl(210, 30%, 90%)',  color: 'hsl(210, 40%, 25%)' },
  neutral: { bg: 'hsl(0, 0%, 92%)',     color: 'hsl(0, 0%, 30%)' },
};

export default function BlogIndex() {
  return (
    <>
      <Helmet>
        <title>Bankruptcy Resources & Guides | Diment & Associates Baton Rouge</title>
        <meta name="description" content="Free bankruptcy guides from Diment & Associates in Baton Rouge, Louisiana. Learn how Chapter 7 and Chapter 13 work, Louisiana exemptions, the means test, credit rebuilding, and more." />
        <link rel="canonical" href="https://dimentfirm.com/blog" />
        <meta property="og:title" content="Bankruptcy Resources & Guides | Diment & Associates" />
        <meta property="og:description" content="Free bankruptcy guides for Louisiana residents. Chapter 7, Chapter 13, exemptions, means test, credit rebuilding, and more." />
        <meta property="og:url" content="https://dimentfirm.com/blog" />
      </Helmet>

      <div className="blog-index-page animate-fade-in">

        {/* Header */}
        <section className="bi-header">
          <div className="bi-container">
            <div className="bi-header-icon">
              <BookOpen size={36} />
            </div>
            <h1 className="bi-headline">Bankruptcy Resources</h1>
            <p className="bi-subline">
              Plain-English guides to help you understand your options — written by the Diment &amp; Associates team.
              No jargon, no judgment, just answers.
            </p>
            <p className="bi-serving">Serving Louisiana since 2017 &mdash; free evaluations available.</p>
          </div>
        </section>

        {/* Article Grid */}
        <section className="bi-articles-section">
          <div className="bi-container">

            <div className="bi-featured">
              {/* Featured: Chapter 7 vs 13 (most broadly useful) */}
              <Link to="/blog/chapter-7-vs-chapter-13" className="bi-card bi-card-featured">
                <div className="bi-card-top">
                  <div className="bi-mascots">
                    <img src="/firm/sheldon_tortoise_adorable_worker_1772080468357.png" alt="Sheldon" className="bi-mascot" />
                    <img src="/firm/hariette_hare_final.png" alt="Hariette" className="bi-mascot bi-mascot-hare" />
                  </div>
                  <span className="bi-featured-label">Most Popular</span>
                </div>
                <span className="bi-badge" style={{ background: badgeStyles.both.bg, color: badgeStyles.both.color }}>Comparison</span>
                <h2 className="bi-card-title">Chapter 7 vs. Chapter 13: Which Is Right for You?</h2>
                <p className="bi-card-desc">
                  A full side-by-side breakdown of both bankruptcy paths — timelines, repayment, property protection, and how to figure out if you're a Sheldon or a Hariette.
                </p>
                <span className="bi-read-more">
                  Read the guide <ChevronRight size={16} />
                </span>
              </Link>

              {/* Two-column secondary */}
              <div className="bi-secondary-pair">
                {articles.filter(a => a.to !== '/blog/chapter-7-vs-chapter-13').slice(0, 2).map(article => (
                  <Link key={article.to} to={article.to} className="bi-card">
                    <span className="bi-badge" style={{ background: badgeStyles[article.badgeColor].bg, color: badgeStyles[article.badgeColor].color }}>{article.badge}</span>
                    <h3 className="bi-card-title">{article.title}</h3>
                    <p className="bi-card-desc">{article.description}</p>
                    <span className="bi-read-more">
                      Read more <ChevronRight size={15} />
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Remaining articles */}
            <div className="bi-grid">
              {articles.filter(a => a.to !== '/blog/chapter-7-vs-chapter-13').slice(2).map(article => (
                <Link key={article.to} to={article.to} className="bi-card">
                  <span className="bi-badge" style={{ background: badgeStyles[article.badgeColor].bg, color: badgeStyles[article.badgeColor].color }}>{article.badge}</span>
                  <h3 className="bi-card-title">{article.title}</h3>
                  <p className="bi-card-desc">{article.description}</p>
                  <div className="bi-card-footer">
                    <span className="bi-read-time">{article.readTime}</span>
                    <span className="bi-read-more">
                      Read more <ChevronRight size={15} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bi-cta-section">
          <div className="bi-container bi-cta-inner">
            <div>
              <h2>Ready to talk to an attorney?</h2>
              <p>Reading is a great start. A free evaluation with a Louisiana bankruptcy attorney is the next step.</p>
            </div>
            <div className="bi-cta-buttons">
              <a
                href="https://outlook.office.com/book/DimentAssociatesAppointmentsPublicCopy@dimentfirm.com/?ismsaljsauthenabled"
                className="bi-btn-primary"
                target="_blank"
                rel="noopener noreferrer"
              >
                Book Free Evaluation
              </a>
              <a href="tel:2256124848" className="bi-btn-phone">225-612-4848</a>
            </div>
          </div>
        </section>

        <style>{`
          /* ══════════════════════════════
             Blog Index — Scoped Styles
             ══════════════════════════════ */
          .blog-index-page {
            font-family: var(--font-body, 'Inter', sans-serif);
            color: #1a1a1a;
            -webkit-font-smoothing: antialiased;
          }
          .bi-container {
            max-width: 1060px;
            margin: 0 auto;
            padding: 0 1.5rem;
          }

          /* Header */
          .bi-header {
            background: linear-gradient(135deg, hsl(152, 60%, 30%) 0%, hsl(152, 55%, 22%) 100%);
            color: white;
            padding: 4rem 1.5rem;
            text-align: center;
          }
          .bi-header-icon {
            width: 72px;
            height: 72px;
            background: rgba(255,255,255,0.15);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.25rem;
            color: hsl(48, 90%, 72%);
          }
          .bi-headline {
            font-family: var(--font-heading, 'Outfit', sans-serif);
            font-size: clamp(2rem, 5vw, 3rem);
            font-weight: 800;
            margin-bottom: 1rem;
            color: white;
          }
          .bi-subline {
            font-size: clamp(1rem, 2vw, 1.15rem);
            opacity: 0.88;
            max-width: 600px;
            margin: 0 auto 0.75rem;
            line-height: 1.65;
          }
          .bi-serving {
            font-size: 0.85rem;
            opacity: 0.6;
            margin: 0;
          }

          /* Articles */
          .bi-articles-section {
            padding: 4rem 1.5rem 5rem;
            background: hsl(152, 50%, 97%);
          }

          /* Featured layout */
          .bi-featured {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1.5rem;
            margin-bottom: 1.5rem;
          }
          .bi-secondary-pair {
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
          }

          /* Remaining grid */
          .bi-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 1.5rem;
          }

          /* Card */
          .bi-card {
            display: flex;
            flex-direction: column;
            background: white;
            border: 1px solid hsl(152, 30%, 88%);
            border-radius: 20px;
            padding: 1.75rem;
            text-decoration: none;
            color: inherit;
            transition: transform 0.2s, box-shadow 0.2s;
          }
          .bi-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 28px rgba(0,0,0,0.1);
          }
          .bi-card-featured {
            background: hsl(152, 55%, 26%);
            color: white;
            border-color: transparent;
          }
          .bi-card-featured:hover {
            box-shadow: 0 10px 32px rgba(0,0,0,0.2);
          }
          .bi-card-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
          }
          .bi-mascots {
            display: flex;
            gap: 0.4rem;
          }
          .bi-mascot {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid rgba(255,255,255,0.3);
            background: rgba(255,255,255,0.1);
          }
          .bi-mascot-hare { background: transparent; }
          .bi-featured-label {
            font-size: 0.72rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            background: hsl(48, 90%, 55%);
            color: #1a1a1a;
            padding: 0.2rem 0.65rem;
            border-radius: 60px;
          }

          .bi-badge {
            display: inline-block;
            font-size: 0.72rem;
            font-weight: 700;
            padding: 0.2rem 0.65rem;
            border-radius: 60px;
            letter-spacing: 0.04em;
            text-transform: uppercase;
            margin-bottom: 0.75rem;
            width: fit-content;
          }
          .bi-card-featured .bi-badge {
            background: rgba(255,255,255,0.2);
            color: white;
          }

          .bi-card-title {
            font-family: var(--font-heading, 'Outfit', sans-serif);
            font-size: 1.1rem;
            font-weight: 800;
            line-height: 1.3;
            margin-bottom: 0.65rem;
            color: inherit;
          }
          .bi-card-featured .bi-card-title {
            font-size: 1.35rem;
          }
          .bi-card-desc {
            font-size: 0.88rem;
            line-height: 1.6;
            color: #555;
            flex: 1;
            margin-bottom: 1rem;
          }
          .bi-card-featured .bi-card-desc {
            color: rgba(255,255,255,0.8);
          }
          .bi-card-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: auto;
          }
          .bi-read-time {
            font-size: 0.75rem;
            color: #aaa;
          }
          .bi-read-more {
            display: inline-flex;
            align-items: center;
            gap: 0.2rem;
            font-family: var(--font-heading, 'Outfit', sans-serif);
            font-weight: 700;
            font-size: 0.85rem;
            color: hsl(152, 55%, 32%);
            margin-top: auto;
          }
          .bi-card-featured .bi-read-more {
            color: hsl(48, 90%, 70%);
          }
          .bi-card:hover .bi-read-more { gap: 0.4rem; }

          /* CTA */
          .bi-cta-section {
            background: white;
            border-top: 1px solid hsl(152, 30%, 88%);
            padding: 3rem 1.5rem;
          }
          .bi-cta-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 2rem;
            flex-wrap: wrap;
          }
          .bi-cta-inner h2 {
            font-family: var(--font-heading, 'Outfit', sans-serif);
            font-size: 1.5rem;
            font-weight: 800;
            margin-bottom: 0.4rem;
          }
          .bi-cta-inner p { font-size: 0.95rem; color: #666; margin: 0; }
          .bi-cta-buttons {
            display: flex;
            gap: 0.75rem;
            flex-shrink: 0;
            flex-wrap: wrap;
          }
          .bi-btn-primary {
            background: hsl(152, 60%, 35%);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 60px;
            font-family: var(--font-heading, 'Outfit', sans-serif);
            font-weight: 700;
            font-size: 0.95rem;
            text-decoration: none;
            transition: background 0.15s;
          }
          .bi-btn-primary:hover { background: hsl(152, 60%, 28%); color: white; }
          .bi-btn-phone {
            border: 2px solid hsl(152, 40%, 70%);
            color: hsl(152, 55%, 28%);
            padding: 0.75rem 1.5rem;
            border-radius: 60px;
            font-family: var(--font-heading, 'Outfit', sans-serif);
            font-weight: 700;
            font-size: 0.95rem;
            text-decoration: none;
            transition: all 0.15s;
          }
          .bi-btn-phone:hover { background: hsl(152, 50%, 95%); }

          /* Responsive */
          @media (max-width: 860px) {
            .bi-featured { grid-template-columns: 1fr; }
            .bi-secondary-pair { flex-direction: row; }
            .bi-grid { grid-template-columns: 1fr 1fr; }
          }
          @media (max-width: 600px) {
            .bi-secondary-pair { flex-direction: column; }
            .bi-grid { grid-template-columns: 1fr; }
            .bi-cta-inner { flex-direction: column; align-items: flex-start; }
            .bi-cta-buttons { width: 100%; }
            .bi-btn-primary, .bi-btn-phone { width: 100%; text-align: center; justify-content: center; display: block; }
          }
        `}</style>
      </div>
    </>
  );
}
