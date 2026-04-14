import { Link } from 'react-router-dom';
import { Phone, Calendar, Shield, Heart, Smile, ChevronRight } from 'lucide-react';

const CONSULTATION_URL =
  'https://outlook.office.com/book/DimentAssociatesAppointmentsPublicCopy@dimentfirm.com/?ismsaljsauthenabled';
const PHONE = '225-612-0765';

export default function Home() {
  return (
    <div className="home-page animate-fade-in">

      {/* ── Hero Section ────────────────────────────────────── */}
      <section className="home-hero">
        <div className="container text-center">
          <h1 className="home-hero__headline">Law That Works For You</h1>
          <p className="home-hero__subline">
            Bankruptcy &middot; Family Law &middot; Small Business &middot; Tax&nbsp;&amp;&nbsp;Accounting
          </p>
          <p className="home-hero__tagline">
            Full-service legal guidance for individuals, families, and small businesses across Baton&nbsp;Rouge and&nbsp;Louisiana.
          </p>
          <div className="home-hero__cta-row">
            <a href={CONSULTATION_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary-cta">
              <Calendar size={18} />
              Free Consultation
            </a>
            <a href={`tel:${PHONE.replace(/-/g, '')}`} className="btn btn-outline-cta">
              <Phone size={18} />
              {PHONE}
            </a>
          </div>
        </div>
      </section>

      {/* ── Practice Areas ──────────────────────────────────── */}
      <section className="section bg-white">
        <div className="container">
          <h2 className="section-title text-center">How We Can Help</h2>
          <p className="section-subtitle text-center">Four practice areas, one&nbsp;team, one&nbsp;mission&mdash;your&nbsp;fresh&nbsp;start.</p>

          <div className="practice-grid">

            {/* Bankruptcy */}
            <Link to="/bankruptcy" className="practice-card practice-card--bankruptcy shadow-hover">
              <div className="practice-card__images">
                <img
                  src="/firm/sheldon_tortoise_adorable_worker_1772080468357.png"
                  alt="Sheldon the Tortoise"
                  className="practice-card__mascot"
                />
                <img
                  src="/firm/hariette_hare_final.png"
                  alt="Hariette the Hare"
                  className="practice-card__mascot"
                />
              </div>
              <h3>Bankruptcy</h3>
              <p className="practice-card__tagline">Sheldon &amp; Hariette guide the way.</p>
              <p className="practice-card__desc">
                Chapter&nbsp;7 for a quick fresh start or Chapter&nbsp;13 to reorganize and keep what matters. Both paths lead to freedom.
              </p>
              <span className="practice-card__link">
                Learn more <ChevronRight size={16} />
              </span>
            </Link>

            {/* Family Law */}
            <Link to="/family-law" className="practice-card practice-card--family shadow-hover">
              <div className="practice-card__mascot-solo">
                <img src="/firm/remy_fox_final.png" alt="Remy the Fox" className="practice-card__mascot-img" />
              </div>
              <h3>Family Law</h3>
              <p className="practice-card__tagline">Are you a Remy?</p>
              <p className="practice-card__desc">
                Divorce, custody, child support, and spousal support. Foxes adapt — and Remys find the smart path through family transitions.
              </p>
              <span className="practice-card__link">
                Learn more <ChevronRight size={16} />
              </span>
            </Link>

            {/* Small Business */}
            <Link to="/small-business" className="practice-card practice-card--business shadow-hover">
              <div className="practice-card__mascot-solo">
                <img src="/firm/oakley_owl_final.png" alt="Oakley the Owl" className="practice-card__mascot-img" />
              </div>
              <h3>Small Business</h3>
              <p className="practice-card__tagline">Nothing gets past us.</p>
              <p className="practice-card__desc">
                Contracts, operations advising, sales &amp; purchases, and litigation. Sharp-eyed counsel for every stage of your business.
              </p>
              <span className="practice-card__link">
                Learn more <ChevronRight size={16} />
              </span>
            </Link>

            {/* Taxes & Accounting */}
            <Link to="/taxes" className="practice-card practice-card--taxes shadow-hover">
              <div className="practice-card__mascot-solo">
                <img src="/firm/jasper_bookworm_final.png" alt="Jasper the Bookworm" className="practice-card__mascot-img" />
              </div>
              <h3>Taxes &amp; Accounting</h3>
              <p className="practice-card__tagline">Every number tells a story. We crunch them all.</p>
              <p className="practice-card__desc">
                Tax preparation, bookkeeping, IRS resolution, and business tax planning. No detail too small, no deduction left behind.
              </p>
              <span className="practice-card__link">
                Learn more <ChevronRight size={16} />
              </span>
            </Link>

          </div>
        </div>
      </section>

      {/* ── Why Diment & Associates ─────────────────────────── */}
      <section className="section" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="container">
          <div className="philosophy-grid">
            <div className="philosophy-text">
              <h2 style={{ marginBottom: '1.5rem' }}>
                We believe legal challenges shouldn't define your&nbsp;future.
              </h2>
              <p>
                At Diment &amp; Associates, we meet you where you are&mdash;without judgment, without jargon.
                Every practice area is guided by the same principle: empowering you with knowledge and a clear
                path forward so you can focus on what comes next.
              </p>
              <ul className="philosophy-list">
                <li>
                  <Shield size={20} className="list-icon" />
                  Judgment-free environment
                </li>
                <li>
                  <Heart size={20} className="list-icon" />
                  Clear, empathetic guidance
                </li>
                <li>
                  <Smile size={20} className="list-icon" />
                  Character-driven approach&mdash;our animal mascots make law approachable
                </li>
              </ul>
              <div style={{ marginTop: '2rem' }}>
                <p><strong>1,200+ clients guided and counting.</strong></p>
              </div>
            </div>
            <div className="philosophy-image shadow-soft">
              <img
                src="/firm/watermarked-10bc01e4-3ff5-4e21-8099-ae406a35f2d9.jpg"
                alt="Diment & Associates attorneys"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────── */}
      <section className="section home-final-cta text-center">
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 style={{ marginBottom: '1rem', color: '#fff' }}>Ready to take the next step?</h2>
          <p style={{ fontSize: '1.125rem', marginBottom: '2.5rem', color: 'rgba(255,255,255,0.85)' }}>
            Schedule a free consultation and find out how we can help&mdash;no obligation, no pressure, just answers.
          </p>
          <div className="home-hero__cta-row" style={{ justifyContent: 'center' }}>
            <a href={CONSULTATION_URL} target="_blank" rel="noopener noreferrer" className="btn btn-white-cta">
              <Calendar size={18} />
              Book Your Free Consultation
            </a>
            <a href={`tel:${PHONE.replace(/-/g, '')}`} className="btn btn-outline-white-cta">
              <Phone size={18} />
              {PHONE}
            </a>
          </div>
        </div>
      </section>

      {/* ── Styles ──────────────────────────────────────────── */}
      <style>{`
        /* ---------- Hero ---------- */
        .home-hero {
          background: linear-gradient(135deg, var(--color-turtle-green) 0%, #2d6a4f 50%, var(--color-hare-orange) 100%);
          color: #fff;
          padding: 6rem 2rem 5rem;
        }
        .home-hero__headline {
          font-family: var(--font-heading);
          font-size: 3.25rem;
          font-weight: 800;
          margin-bottom: 0.75rem;
          line-height: 1.15;
          color: #fff;
        }
        .home-hero__subline {
          font-family: var(--font-heading);
          font-size: 1.15rem;
          font-weight: 600;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          opacity: 0.85;
          margin-bottom: 1.5rem;
        }
        .home-hero__tagline {
          font-size: 1.2rem;
          max-width: 620px;
          margin: 0 auto 2.5rem;
          opacity: 0.92;
          line-height: 1.6;
        }
        .home-hero__cta-row {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          justify-content: center;
        }

        /* CTA buttons */
        .btn-primary-cta,
        .btn-outline-cta,
        .btn-white-cta,
        .btn-outline-white-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.05rem;
          padding: 0.9rem 2rem;
          border-radius: var(--border-radius-full);
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s, background 0.2s;
          cursor: pointer;
        }
        .btn-primary-cta {
          background: #fff;
          color: var(--color-turtle-green);
        }
        .btn-primary-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }
        .btn-outline-cta {
          background: transparent;
          color: #fff;
          border: 2px solid rgba(255,255,255,0.6);
        }
        .btn-outline-cta:hover {
          background: rgba(255,255,255,0.12);
          border-color: #fff;
        }
        .btn-white-cta {
          background: #fff;
          color: var(--color-text-main);
        }
        .btn-white-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        }
        .btn-outline-white-cta {
          background: transparent;
          color: #fff;
          border: 2px solid rgba(255,255,255,0.5);
        }
        .btn-outline-white-cta:hover {
          background: rgba(255,255,255,0.1);
          border-color: #fff;
        }

        /* ---------- Section helpers ---------- */
        .section-title {
          font-family: var(--font-heading);
          margin-bottom: 0.75rem;
        }
        .section-subtitle {
          font-size: 1.125rem;
          color: var(--color-text-muted);
          margin-bottom: 3rem;
        }

        /* ---------- Practice Area Cards ---------- */
        .practice-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }
        .practice-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 2.5rem 2rem 2rem;
          background: #fff;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-lg);
          text-decoration: none;
          color: var(--color-text-main);
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .practice-card:hover {
          transform: translateY(-4px);
        }
        .practice-card h3 {
          font-family: var(--font-heading);
          font-size: 1.35rem;
          margin-bottom: 0.25rem;
        }
        .practice-card__tagline {
          font-style: italic;
          color: var(--color-text-muted);
          font-size: 0.95rem;
          margin-bottom: 0.75rem;
        }
        .practice-card__desc {
          font-size: 0.95rem;
          color: var(--color-text-muted);
          line-height: 1.6;
          margin-bottom: 1.25rem;
          flex: 1;
        }
        .practice-card__link {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--color-turtle-green);
          transition: gap 0.2s;
        }
        .practice-card:hover .practice-card__link {
          gap: 0.5rem;
        }

        /* Mascot images row (Bankruptcy) */
        .practice-card__images {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.25rem;
          justify-content: center;
        }
        .practice-card__mascot {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          background: #fff;
          border: 3px solid var(--color-border);
        }

        /* Solo mascot image (Family Law, Small Business, Taxes) */
        .practice-card__mascot-solo {
          width: 90px;
          height: 90px;
          border-radius: 50%;
          overflow: hidden;
          margin-bottom: 1.25rem;
          background: #f8f8f8;
          border: 2px solid var(--color-border);
        }
        .practice-card__mascot-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* ---------- Philosophy / Why Us ---------- */
        .philosophy-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        .philosophy-text p {
          font-size: 1.125rem;
          color: var(--color-text-muted);
          line-height: 1.7;
        }
        .philosophy-list {
          list-style: none;
          margin-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .philosophy-list li {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-weight: 500;
          font-size: 1.05rem;
        }
        .list-icon {
          color: var(--color-turtle-green);
          flex-shrink: 0;
        }
        .philosophy-image {
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          height: 480px;
        }

        /* ---------- Final CTA ---------- */
        .home-final-cta {
          background: linear-gradient(135deg, var(--color-turtle-green), #2d6a4f);
          color: #fff;
        }

        /* ---------- Responsive ---------- */
        @media (max-width: 992px) {
          .home-hero__headline {
            font-size: 2.5rem;
          }
          .practice-grid {
            grid-template-columns: 1fr 1fr;
          }
          .philosophy-grid {
            grid-template-columns: 1fr;
          }
          .philosophy-image {
            height: 380px;
            order: -1;
          }
        }
        @media (max-width: 640px) {
          .home-hero {
            padding: 4rem 1.25rem 3.5rem;
          }
          .home-hero__headline {
            font-size: 2rem;
          }
          .home-hero__subline {
            font-size: 0.95rem;
          }
          .practice-grid {
            grid-template-columns: 1fr;
          }
          .home-hero__cta-row {
            flex-direction: column;
            align-items: center;
          }
          .btn-primary-cta,
          .btn-outline-cta,
          .btn-white-cta,
          .btn-outline-white-cta {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}
