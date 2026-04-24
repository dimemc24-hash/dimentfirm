import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { CalendarDays, Phone, ChevronRight } from 'lucide-react';

const BOOKING_URL = 'https://outlook.office.com/book/DimentAssociatesAppointmentsPublicCopy@dimentfirm.com/?ismsaljsauthenabled';
const PHONE = '225-612-4848';

interface BlogPostProps {
  title: string;
  metaDescription: string;
  canonicalPath: string;
  headline: string;
  intro: string;
  children: React.ReactNode;
}

export default function BlogPost({ title, metaDescription, canonicalPath, headline, intro, children }: BlogPostProps) {
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={metaDescription} />
        <link rel="canonical" href={`https://dimentfirm.com${canonicalPath}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDescription} />
        <meta property="og:url" content={`https://dimentfirm.com${canonicalPath}`} />
        <meta property="og:type" content="article" />
      </Helmet>

      <div className="bp-page animate-fade-in">

        {/* Breadcrumb */}
        <div className="bp-breadcrumb">
          <div className="bp-container">
            <Link to="/">Home</Link>
            <ChevronRight size={14} />
            <Link to="/bankruptcy">Bankruptcy</Link>
            <ChevronRight size={14} />
            <span>{headline}</span>
          </div>
        </div>

        {/* Article Header */}
        <header className="bp-header">
          <div className="bp-container bp-header-inner">
            <h1 className="bp-headline">{headline}</h1>
            <p className="bp-intro">{intro}</p>
            <div className="bp-header-ctas">
              <a href={BOOKING_URL} className="bp-btn bp-btn-primary" target="_blank" rel="noopener noreferrer">
                <CalendarDays size={18} /> Free Evaluation
              </a>
              <a href={`tel:${PHONE.replace(/-/g, '')}`} className="bp-btn bp-btn-phone">
                <Phone size={18} /> {PHONE}
              </a>
            </div>
          </div>
        </header>

        {/* Article Body */}
        <div className="bp-body">
          <div className="bp-container bp-layout">
            <article className="bp-article">
              {children}
            </article>

            {/* Sticky Sidebar CTA */}
            <aside className="bp-sidebar">
              <div className="bp-sidebar-card">
                <div className="bp-sidebar-mascots">
                  <img src="/firm/sheldon_tortoise_adorable_worker_1772080468357.png" alt="Sheldon" className="bp-sidebar-mascot" />
                  <img src="/firm/hariette_hare_final.png" alt="Hariette" className="bp-sidebar-mascot bp-mascot-hare" />
                </div>
                <h3>Free Evaluation</h3>
                <p>Talk to a Louisiana bankruptcy attorney. No cost, no commitment, no judgment.</p>
                <a href={BOOKING_URL} className="bp-sidebar-btn" target="_blank" rel="noopener noreferrer">
                  Book Online
                </a>
                <a href={`tel:${PHONE.replace(/-/g, '')}`} className="bp-sidebar-phone">
                  <Phone size={16} /> {PHONE}
                </a>
                <p className="bp-sidebar-firm">Diment &amp; Associates<br /><span>Baton Rouge, Louisiana</span></p>
              </div>

              <div className="bp-sidebar-links">
                <h4>Learn More</h4>
                <Link to="/bankruptcy">Overview: Ch. 7 &amp; Ch. 13</Link>
                <Link to="/sheldon">Sheldon's Path — Chapter 13</Link>
                <Link to="/hariette">Hariette's Path — Chapter 7</Link>
                <Link to="/blog/chapter-7-vs-chapter-13">Ch. 7 vs Ch. 13 Comparison</Link>
                <Link to="/blog/louisiana-bankruptcy-exemptions">Louisiana Exemptions</Link>
                <Link to="/blog/bankruptcy-means-test">The Means Test Explained</Link>
              </div>
            </aside>
          </div>
        </div>

        {/* Bottom CTA */}
        <section className="bp-bottom-cta">
          <div className="bp-container">
            <h2>Ready to Talk to an Attorney?</h2>
            <p>Your free evaluation costs nothing and could change everything. Serving Louisiana since 2017.</p>
            <div className="bp-cta-row">
              <a href={BOOKING_URL} className="bp-btn bp-btn-white" target="_blank" rel="noopener noreferrer">
                <CalendarDays size={18} /> Book Free Evaluation
              </a>
              <a href={`tel:${PHONE.replace(/-/g, '')}`} className="bp-btn bp-btn-phone-dark">
                <Phone size={18} /> {PHONE}
              </a>
            </div>
          </div>
        </section>

        <style>{`
          /* ══════════════════════════════════════════
             Blog Post Layout — Scoped Styles
             ══════════════════════════════════════════ */

          .bp-page {
            font-family: var(--font-body, 'Inter', sans-serif);
            color: #1a1a1a;
            -webkit-font-smoothing: antialiased;
          }

          .bp-container {
            max-width: 1080px;
            margin: 0 auto;
            padding: 0 1.5rem;
          }

          /* ── Breadcrumb ── */
          .bp-breadcrumb {
            background: hsl(152, 50%, 96%);
            border-bottom: 1px solid hsl(152, 40%, 88%);
            padding: 0.75rem 0;
            font-size: 0.82rem;
            color: #666;
          }
          .bp-breadcrumb .bp-container {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            flex-wrap: wrap;
          }
          .bp-breadcrumb a { color: hsl(152, 55%, 32%); text-decoration: none; font-weight: 500; }
          .bp-breadcrumb a:hover { text-decoration: underline; }
          .bp-breadcrumb span { color: #888; }

          /* ── Header ── */
          .bp-header {
            background: linear-gradient(135deg, hsl(152, 60%, 30%) 0%, hsl(152, 55%, 22%) 100%);
            color: white;
            padding: 3.5rem 1.5rem;
          }
          .bp-header-inner {
            max-width: 760px;
          }
          .bp-headline {
            font-family: var(--font-heading, 'Outfit', sans-serif);
            font-size: clamp(1.75rem, 4vw, 2.75rem);
            font-weight: 800;
            line-height: 1.2;
            margin-bottom: 1rem;
            color: white;
          }
          .bp-intro {
            font-size: clamp(1rem, 2vw, 1.15rem);
            opacity: 0.88;
            line-height: 1.65;
            margin-bottom: 2rem;
          }
          .bp-header-ctas {
            display: flex;
            gap: 1rem;
            flex-wrap: wrap;
          }

          /* ── Buttons ── */
          .bp-btn {
            display: inline-flex;
            align-items: center;
            gap: 0.45rem;
            font-family: var(--font-heading, 'Outfit', sans-serif);
            font-weight: 700;
            font-size: 0.95rem;
            padding: 0.75rem 1.5rem;
            border-radius: 60px;
            text-decoration: none;
            transition: transform 0.15s, box-shadow 0.15s;
            cursor: pointer;
          }
          .bp-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 18px rgba(0,0,0,0.18); }
          .bp-btn-primary { background: hsl(48, 90%, 55%); color: #1a1a1a; }
          .bp-btn-phone { background: rgba(255,255,255,0.15); color: white; border: 2px solid rgba(255,255,255,0.4); }
          .bp-btn-phone:hover { background: rgba(255,255,255,0.25); color: white; }
          .bp-btn-white { background: white; color: hsl(152, 55%, 28%); }
          .bp-btn-white:hover { background: hsl(152, 50%, 95%); color: hsl(152, 55%, 28%); }
          .bp-btn-phone-dark { background: transparent; color: white; border: 2px solid rgba(255,255,255,0.45); }
          .bp-btn-phone-dark:hover { background: rgba(255,255,255,0.1); color: white; }

          /* ── Body Layout ── */
          .bp-body { padding: 3rem 1.5rem 5rem; background: white; }
          .bp-layout {
            display: grid;
            grid-template-columns: 1fr 300px;
            gap: 3rem;
            align-items: start;
          }

          /* ── Article Typography ── */
          .bp-article h2 {
            font-family: var(--font-heading, 'Outfit', sans-serif);
            font-size: clamp(1.35rem, 3vw, 1.75rem);
            font-weight: 800;
            color: hsl(152, 55%, 22%);
            margin: 2.5rem 0 1rem;
            padding-top: 0.5rem;
            border-top: 3px solid hsl(152, 50%, 90%);
          }
          .bp-article h2:first-child { margin-top: 0; border-top: none; }
          .bp-article h3 {
            font-family: var(--font-heading, 'Outfit', sans-serif);
            font-size: 1.15rem;
            font-weight: 700;
            color: #222;
            margin: 1.75rem 0 0.6rem;
          }
          .bp-article p {
            font-size: 1.02rem;
            line-height: 1.75;
            color: #333;
            margin-bottom: 1.1rem;
          }
          .bp-article ul, .bp-article ol {
            padding-left: 1.5rem;
            margin-bottom: 1.25rem;
          }
          .bp-article li {
            font-size: 1rem;
            line-height: 1.7;
            color: #333;
            margin-bottom: 0.4rem;
          }
          .bp-article strong { color: #1a1a1a; }
          .bp-article a { color: hsl(152, 55%, 32%); text-decoration: underline; }

          /* Callout box */
          .bp-callout {
            background: hsl(152, 50%, 95%);
            border-left: 4px solid hsl(152, 60%, 38%);
            border-radius: 0 12px 12px 0;
            padding: 1.25rem 1.5rem;
            margin: 1.75rem 0;
          }
          .bp-callout p { margin: 0; color: hsl(152, 55%, 20%); font-weight: 500; }

          /* Warning callout */
          .bp-warning {
            background: hsl(35, 90%, 96%);
            border-left: 4px solid hsl(35, 85%, 55%);
            border-radius: 0 12px 12px 0;
            padding: 1.25rem 1.5rem;
            margin: 1.75rem 0;
          }
          .bp-warning p { margin: 0; color: hsl(20, 60%, 25%); }

          /* Comparison table */
          .bp-table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.95rem; }
          .bp-table th { background: hsl(152, 60%, 32%); color: white; padding: 0.75rem 1rem; text-align: left; font-family: var(--font-heading, 'Outfit', sans-serif); }
          .bp-table td { padding: 0.7rem 1rem; border-bottom: 1px solid #eee; vertical-align: top; }
          .bp-table tr:nth-child(even) td { background: #fafafa; }

          /* FAQ section */
          .bp-faq { margin-top: 2rem; }
          .bp-faq-item { border-bottom: 1px solid #eee; padding: 1.25rem 0; }
          .bp-faq-q { font-family: var(--font-heading, 'Outfit', sans-serif); font-weight: 700; color: #1a1a1a; margin-bottom: 0.6rem; font-size: 1.05rem; }
          .bp-faq-a { color: #444; font-size: 0.97rem; line-height: 1.65; margin: 0; }

          /* Disclaimer */
          .bp-disclaimer {
            margin-top: 3rem;
            padding: 1rem 1.25rem;
            background: #f5f5f5;
            border-radius: 10px;
            font-size: 0.8rem;
            color: #888;
            line-height: 1.55;
          }

          /* ── Sidebar ── */
          .bp-sidebar { position: sticky; top: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
          .bp-sidebar-card {
            background: hsl(152, 50%, 96%);
            border: 1px solid hsl(152, 40%, 85%);
            border-radius: 20px;
            padding: 1.75rem 1.5rem;
            text-align: center;
          }
          .bp-sidebar-mascots { display: flex; justify-content: center; gap: 0.5rem; margin-bottom: 1rem; }
          .bp-sidebar-mascot { width: 56px; height: 56px; border-radius: 50%; object-fit: cover; border: 2px solid white; }
          .bp-mascot-hare { background: transparent; }
          .bp-sidebar-card h3 {
            font-family: var(--font-heading, 'Outfit', sans-serif);
            font-size: 1.15rem;
            margin-bottom: 0.5rem;
            color: hsl(152, 55%, 22%);
          }
          .bp-sidebar-card p { font-size: 0.88rem; color: #555; line-height: 1.5; margin-bottom: 1rem; }
          .bp-sidebar-btn {
            display: block;
            background: hsl(152, 60%, 35%);
            color: white;
            text-align: center;
            padding: 0.7rem 1rem;
            border-radius: 60px;
            font-family: var(--font-heading, 'Outfit', sans-serif);
            font-weight: 700;
            font-size: 0.9rem;
            text-decoration: none;
            transition: background 0.15s;
            margin-bottom: 0.75rem;
          }
          .bp-sidebar-btn:hover { background: hsl(152, 60%, 28%); }
          .bp-sidebar-phone {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.4rem;
            font-size: 0.9rem;
            font-weight: 600;
            color: hsl(152, 55%, 28%);
            text-decoration: none;
            margin-bottom: 1rem;
          }
          .bp-sidebar-firm { font-size: 0.78rem; color: #888; line-height: 1.4; margin: 0; }
          .bp-sidebar-firm span { font-size: 0.72rem; }

          .bp-sidebar-links {
            background: white;
            border: 1px solid #eee;
            border-radius: 16px;
            padding: 1.25rem;
          }
          .bp-sidebar-links h4 {
            font-family: var(--font-heading, 'Outfit', sans-serif);
            font-size: 0.9rem;
            font-weight: 700;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 0.06em;
            margin-bottom: 0.75rem;
          }
          .bp-sidebar-links a {
            display: block;
            font-size: 0.88rem;
            color: hsl(152, 55%, 32%);
            text-decoration: none;
            padding: 0.4rem 0;
            border-bottom: 1px solid #f0f0f0;
            transition: color 0.15s;
          }
          .bp-sidebar-links a:last-child { border-bottom: none; }
          .bp-sidebar-links a:hover { color: hsl(152, 60%, 22%); }

          /* ── Bottom CTA ── */
          .bp-bottom-cta {
            background: linear-gradient(135deg, hsl(152, 60%, 28%) 0%, hsl(152, 55%, 22%) 100%);
            color: white;
            padding: 4rem 1.5rem;
            text-align: center;
          }
          .bp-bottom-cta h2 {
            font-family: var(--font-heading, 'Outfit', sans-serif);
            font-size: clamp(1.5rem, 3.5vw, 2.25rem);
            font-weight: 800;
            margin-bottom: 0.75rem;
            color: white;
          }
          .bp-bottom-cta p { opacity: 0.88; font-size: 1.05rem; margin-bottom: 2rem; }
          .bp-cta-row { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }

          /* ── Responsive ── */
          @media (max-width: 860px) {
            .bp-layout { grid-template-columns: 1fr; }
            .bp-sidebar { position: static; }
          }
          @media (max-width: 560px) {
            .bp-header { padding: 2.5rem 1rem; }
            .bp-body { padding: 2rem 0.75rem 3.5rem; }
            .bp-btn { width: 100%; justify-content: center; }
          }
        `}</style>
      </div>
    </>
  );
}
