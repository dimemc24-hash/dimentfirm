import { Helmet } from 'react-helmet-async';
import { Phone, ShieldCheck, Zap, Home, Car, CheckCircle, XCircle, CalendarDays } from 'lucide-react';

const BOOKING_URL = 'https://outlook.office.com/book/DimentAssociatesAppointmentsPublicCopy@dimentfirm.com/?ismsaljsauthenabled';
const PHONE = '225-612-4848';

const myths = [
  {
    myth: 'Filing bankruptcy means you failed.',
    fact: 'Bankruptcy is a legal tool — the same one hospitals, airlines, and Fortune 500 companies use. Using the law isn\'t failure. It\'s smart.',
  },
  {
    myth: 'You\'ll lose everything you own.',
    fact: 'Louisiana exemptions protect your home equity, car, retirement accounts, and household goods. Most clients keep everything they care about.',
  },
  {
    myth: 'Your credit is ruined forever.',
    fact: 'Most clients see credit score improvement within 12–18 months of discharge. The fresh start lets you rebuild on solid ground.',
  },
  {
    myth: 'Creditors can still call after you file.',
    fact: 'The moment you file, a federal "automatic stay" stops every call, letter, garnishment, and foreclosure. Instantly. By law.',
  },
];

export default function MallLanding() {
  return (
    <>
    <Helmet>
      <title>Debt Relief Baton Rouge | Stop Foreclosure, Repossession & Garnishment | Diment & Associates</title>
      <meta name="description" content="Overwhelmed by debt? Diment & Associates stops foreclosure, vehicle repossession, and wage garnishment through bankruptcy. Chapter 7 or Chapter 13 — free evaluation. Baton Rouge, LA." />
      <link rel="canonical" href="https://dimentfirm.com/mall" />
      <meta name="robots" content="noindex, follow" />
    </Helmet>
    <div className="ml2-page">

      {/* ── HERO ──────────────────────────────────────────────── */}
      <section className="ml2-hero">
        <div className="ml2-container ml2-hero-inner">
          <div className="ml2-mascots-row">
            <div className="ml2-mascot-wrap ml2-mascot-sheldon">
              <img
                src="/firm/sheldon_tortoise_adorable_worker_1772080468357.png"
                alt="Sheldon the Tortoise — Chapter 13 steady path"
                className="ml2-mascot-img"
              />
              <span className="ml2-mascot-label ml2-label-sheldon">Sheldon</span>
            </div>
            <div className="ml2-vs-badge">VS</div>
            <div className="ml2-mascot-wrap ml2-mascot-hariette">
              <img
                src="/firm/hariette_hare_final.png"
                alt="Hariette the Hare — Chapter 7 fresh start"
                className="ml2-mascot-img ml2-mascot-img-hare"
              />
              <span className="ml2-mascot-label ml2-label-hariette">Hariette</span>
            </div>
          </div>

          <h1 className="ml2-hero-headline">
            You Know the Story.<br />
            <span className="ml2-hero-accent">In Bankruptcy, Both Win.</span>
          </h1>
          <p className="ml2-hero-sub">
            Two paths out of debt. One free evaluation to find out which fits you.
          </p>

          <div className="ml2-cta-row">
            <a href={BOOKING_URL} className="ml2-btn ml2-btn-primary" target="_blank" rel="noopener noreferrer">
              <CalendarDays size={20} />
              Get My Free Evaluation
            </a>
            <a href={`tel:${PHONE.replace(/-/g, '')}`} className="ml2-btn ml2-btn-phone">
              <Phone size={20} /> {PHONE}
            </a>
          </div>
        </div>
      </section>

      {/* ── WHAT BANKRUPTCY ACTUALLY DOES ─────────────────────── */}
      <section className="ml2-section ml2-bg-white">
        <div className="ml2-container">
          <p className="ml2-eyebrow">The truth about bankruptcy</p>
          <h2 className="ml2-section-title">What Happens the Moment You File</h2>
          <p className="ml2-section-sub">
            Regardless of which path you take, federal law gives you powerful protections the instant your case is filed.
          </p>

          <div className="ml2-benefits-grid ml2-benefits-grid-4">
            <div className="ml2-benefit-card">
              <div className="ml2-benefit-icon">
                <ShieldCheck size={28} />
              </div>
              <h3>Creditor Calls Stop</h3>
              <p>Every phone call, threatening letter, and collection lawsuit must halt — by federal law — the moment we file. No exceptions.</p>
            </div>
            <div className="ml2-benefit-card">
              <div className="ml2-benefit-icon">
                <Home size={28} />
              </div>
              <h3>Foreclosures Pause</h3>
              <p>Even if your home is days from auction, an automatic stay freezes the process so you can breathe and make a real plan.</p>
            </div>
            <div className="ml2-benefit-card">
              <div className="ml2-benefit-icon">
                <Car size={28} />
              </div>
              <h3>Repossession Stops</h3>
              <p>Filing bankruptcy halts vehicle repossession immediately. Chapter 13 can even let you catch up on missed payments and keep the car.</p>
            </div>
            <div className="ml2-benefit-card">
              <div className="ml2-benefit-icon">
                <Zap size={28} />
              </div>
              <h3>Garnishments End</h3>
              <p>If a creditor is already taking money from your paycheck, the automatic stay stops that deduction from your very next pay period.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── THE TWO PATHS ─────────────────────────────────────── */}
      <section className="ml2-section ml2-bg-light">
        <div className="ml2-container">
          <p className="ml2-eyebrow">Choose your path</p>
          <h2 className="ml2-section-title">Sheldon or Hariette?</h2>
          <p className="ml2-section-sub">
            The tortoise and the hare each found their own road to freedom. Both crossed the finish line.
          </p>

          <div className="ml2-paths-grid">
            {/* Sheldon */}
            <div className="ml2-path-card ml2-path-sheldon">
              <div className="ml2-path-header ml2-path-header-sheldon">
                <img
                  src="/firm/sheldon_tortoise_adorable_worker_1772080468357.png"
                  alt="Sheldon"
                  className="ml2-path-mascot"
                />
                <div>
                  <h3>Sheldon's Steady Path</h3>
                  <span className="ml2-chapter-badge ml2-badge-13">Chapter 13</span>
                </div>
              </div>
              <p className="ml2-path-tagline">
                "Slow and steady — and I get to keep my home."
              </p>
              <ul className="ml2-path-list">
                <li><CheckCircle size={18} className="ml2-check-green" /> Keep your home and catch up on missed payments</li>
                <li><CheckCircle size={18} className="ml2-check-green" /> Keep your car — no repossession risk</li>
                <li><CheckCircle size={18} className="ml2-check-green" /> One affordable monthly payment (3–5 years)</li>
                <li><CheckCircle size={18} className="ml2-check-green" /> Creditor harassment stops immediately on filing</li>
                <li><CheckCircle size={18} className="ml2-check-green" /> Protect assets you'd lose in Chapter 7</li>
              </ul>
              <p className="ml2-path-ideal">
                <strong>Best for:</strong> Homeowners behind on mortgage, people with regular income who need structure, those with assets worth protecting.
              </p>
            </div>

            {/* Hariette */}
            <div className="ml2-path-card ml2-path-hariette">
              <div className="ml2-path-header ml2-path-header-hariette">
                <img
                  src="/firm/hariette_hare_final.png"
                  alt="Hariette"
                  className="ml2-path-mascot ml2-path-mascot-hare"
                />
                <div>
                  <h3>Hariette's Quick Sprint</h3>
                  <span className="ml2-chapter-badge ml2-badge-7">Chapter 7</span>
                </div>
              </div>
              <p className="ml2-path-tagline">
                "Debt gone. Fresh start. Under 4 months."
              </p>
              <ul className="ml2-path-list">
                <li><CheckCircle size={18} className="ml2-check-orange" /> Wipe out credit cards, medical bills, personal loans</li>
                <li><CheckCircle size={18} className="ml2-check-orange" /> Discharge in just 90–120 days</li>
                <li><CheckCircle size={18} className="ml2-check-orange" /> No multi-year repayment plan</li>
                <li><CheckCircle size={18} className="ml2-check-orange" /> Louisiana exemptions protect your home equity &amp; car</li>
                <li><CheckCircle size={18} className="ml2-check-orange" /> Creditor harassment stops the day you file</li>
              </ul>
              <p className="ml2-path-ideal">
                <strong>Best for:</strong> People overwhelmed by unsecured debt, those who pass the means test, anyone ready for a complete clean slate — fast.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── MYTH BUSTERS ──────────────────────────────────────── */}
      <section className="ml2-section ml2-bg-white">
        <div className="ml2-container">
          <p className="ml2-eyebrow">Clearing the air</p>
          <h2 className="ml2-section-title">Bankruptcy Myths — Busted</h2>
          <p className="ml2-section-sub">
            The stigma around bankruptcy is loud. The facts are quieter. Here's the truth.
          </p>

          <div className="ml2-myths-grid">
            {myths.map(({ myth, fact }) => (
              <div key={myth} className="ml2-myth-card">
                <div className="ml2-myth-row">
                  <XCircle size={20} className="ml2-x-icon" />
                  <p className="ml2-myth-text">{myth}</p>
                </div>
                <div className="ml2-fact-row">
                  <CheckCircle size={20} className="ml2-check-green" />
                  <p className="ml2-fact-text">{fact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST ─────────────────────────────────────────────── */}
      <section className="ml2-section ml2-bg-green">
        <div className="ml2-container ml2-trust-inner">
          <div className="ml2-trust-stat">
            <span className="ml2-trust-number">1,200+</span>
            <span className="ml2-trust-label">Louisiana families helped</span>
          </div>

          <blockquote className="ml2-testimonial">
            <p>"We were terrified of losing our house. One call to Diment &amp; Associates and everything changed.
            They explained Sheldon's path — Chapter 13 — and we've been in our home ever since."</p>
            <footer>— The Robinsons, Baton Rouge (Sheldons since 2022)</footer>
          </blockquote>

          <blockquote className="ml2-testimonial">
            <p>"I had $60,000 in credit card debt and medical bills I could never repay.
            Hariette's path wiped it out in under 4 months. I finally sleep at night."</p>
            <footer>— David, Livingston Parish (Hariette since 2023)</footer>
          </blockquote>
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section className="ml2-section ml2-final-cta">
        <div className="ml2-container ml2-final-inner">
          <h2 className="ml2-final-headline">
            Your Free Evaluation Takes 15 Minutes.<br />
            Your Debt Problem Doesn't Have To Last 15 Years.
          </h2>
          <p className="ml2-final-sub">
            No commitment. No judgment. Just a real conversation with a Louisiana bankruptcy attorney
            who will tell you exactly what your options are.
          </p>
          <div className="ml2-cta-row">
            <a href={BOOKING_URL} className="ml2-btn ml2-btn-white" target="_blank" rel="noopener noreferrer">
              <CalendarDays size={20} />
              Book Free Evaluation Online
            </a>
            <a href={`tel:${PHONE.replace(/-/g, '')}`} className="ml2-btn ml2-btn-phone-dark">
              <Phone size={20} /> {PHONE}
            </a>
          </div>
          <p className="ml2-final-firm">
            <strong>Diment &amp; Associates</strong> &mdash; Baton Rouge, Louisiana
          </p>
          <p className="ml2-disclaimer">
            This page is for general informational purposes. Nothing here constitutes legal advice.
            Results vary by individual circumstances.
          </p>
        </div>
      </section>

      <style>{`
        /* ══════════════════════════════════════════════
           Mall Landing v2 — Scoped Styles
           ══════════════════════════════════════════════ */

        .ml2-page {
          font-family: var(--font-body, 'Inter', sans-serif);
          color: #1a1a1a;
          overflow-x: hidden;
          -webkit-font-smoothing: antialiased;
        }

        .ml2-container {
          max-width: 1020px;
          margin: 0 auto;
          padding: 0 1.5rem;
        }

        .ml2-section {
          padding: 5rem 1.5rem;
        }

        .ml2-bg-white { background: #fff; }
        .ml2-bg-light { background: hsl(152, 50%, 96%); }
        .ml2-bg-green {
          background: linear-gradient(135deg, hsl(152, 60%, 32%) 0%, hsl(152, 55%, 25%) 100%);
          color: white;
        }

        /* ── Eyebrow + Titles ── */
        .ml2-eyebrow {
          text-align: center;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--color-turtle-green, hsl(152, 60%, 35%));
          margin-bottom: 0.5rem;
        }
        .ml2-section-title {
          font-family: var(--font-heading, 'Outfit', sans-serif);
          font-size: clamp(1.75rem, 4vw, 2.5rem);
          font-weight: 800;
          text-align: center;
          color: #1a1a1a;
          margin-bottom: 0.75rem;
          line-height: 1.2;
        }
        .ml2-section-sub {
          text-align: center;
          font-size: clamp(1rem, 2vw, 1.15rem);
          color: #555;
          max-width: 640px;
          margin: 0 auto 3rem;
          line-height: 1.6;
        }

        /* ── Hero ── */
        .ml2-hero {
          background: linear-gradient(160deg, #1a2e1f 0%, hsl(152, 60%, 28%) 50%, hsl(25, 85%, 35%) 100%);
          color: white;
          padding: 4rem 1.5rem 3.5rem;
          text-align: center;
        }
        .ml2-hero-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .ml2-mascots-row {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        .ml2-mascot-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.6rem;
        }
        .ml2-mascot-img {
          width: 130px;
          height: 130px;
          border-radius: 50%;
          object-fit: cover;
          border: 4px solid rgba(255,255,255,0.35);
          background: rgba(255,255,255,0.12);
        }
        .ml2-mascot-img-hare {
          background: transparent;
          border-color: rgba(255,255,255,0.25);
        }
        .ml2-mascot-label {
          font-family: var(--font-heading, 'Outfit', sans-serif);
          font-weight: 800;
          font-size: 1.1rem;
          letter-spacing: 0.04em;
        }
        .ml2-label-sheldon { color: hsl(152, 80%, 75%); }
        .ml2-label-hariette { color: hsl(35, 100%, 75%); }

        .ml2-vs-badge {
          font-family: var(--font-heading, 'Outfit', sans-serif);
          font-weight: 800;
          font-size: 1.75rem;
          color: rgba(255,255,255,0.5);
          letter-spacing: 0.1em;
        }

        .ml2-hero-headline {
          font-family: var(--font-heading, 'Outfit', sans-serif);
          font-size: clamp(1.9rem, 5vw, 3.25rem);
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 1rem;
        }
        .ml2-hero-accent {
          color: hsl(48, 90%, 68%);
          display: block;
        }
        .ml2-hero-sub {
          font-size: clamp(1rem, 2.5vw, 1.2rem);
          opacity: 0.88;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        /* ── Buttons ── */
        .ml2-cta-row {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          justify-content: center;
        }
        .ml2-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          font-family: var(--font-heading, 'Outfit', sans-serif);
          font-weight: 700;
          font-size: 1.05rem;
          padding: 0.95rem 2rem;
          border-radius: 60px;
          text-decoration: none;
          transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
          cursor: pointer;
          border: none;
        }
        .ml2-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }
        .ml2-btn-primary {
          background: hsl(48, 90%, 55%);
          color: #1a1a1a;
        }
        .ml2-btn-phone {
          background: rgba(255,255,255,0.15);
          color: white;
          border: 2px solid rgba(255,255,255,0.45);
        }
        .ml2-btn-phone:hover { background: rgba(255,255,255,0.25); color: white; }
        .ml2-btn-white {
          background: #fff;
          color: hsl(152, 60%, 28%);
        }
        .ml2-btn-white:hover { background: hsl(152, 50%, 96%); color: hsl(152, 60%, 28%); }
        .ml2-btn-phone-dark {
          background: transparent;
          color: white;
          border: 2px solid rgba(255,255,255,0.5);
        }
        .ml2-btn-phone-dark:hover { background: rgba(255,255,255,0.1); color: white; }

        /* ── Benefits ── */
        .ml2-benefits-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }
        .ml2-benefits-grid-4 {
          grid-template-columns: repeat(4, 1fr);
        }
        .ml2-benefit-card {
          background: hsl(152, 50%, 97%);
          border: 1px solid hsl(152, 40%, 88%);
          border-radius: 20px;
          padding: 2rem 1.5rem;
          text-align: center;
        }
        .ml2-benefit-icon {
          width: 64px;
          height: 64px;
          border-radius: 50%;
          background: var(--color-turtle-green, hsl(152, 60%, 35%));
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }
        .ml2-benefit-card h3 {
          font-family: var(--font-heading, 'Outfit', sans-serif);
          font-size: 1.15rem;
          margin-bottom: 0.5rem;
          color: hsl(152, 55%, 25%);
        }
        .ml2-benefit-card p { color: #555; font-size: 0.95rem; line-height: 1.55; margin: 0; }

        /* ── The Two Paths ── */
        .ml2-paths-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        .ml2-path-card {
          background: white;
          border-radius: 24px;
          padding: 2rem;
          border: 2px solid transparent;
          box-shadow: 0 4px 16px rgba(0,0,0,0.07);
        }
        .ml2-path-sheldon { border-color: hsl(152, 50%, 80%); }
        .ml2-path-hariette { border-color: hsl(25, 80%, 82%); }

        .ml2-path-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        .ml2-path-mascot {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
          border: 3px solid rgba(0,0,0,0.08);
        }
        .ml2-path-mascot-hare {
          background: transparent;
          border-color: hsl(25, 70%, 88%);
        }
        .ml2-path-card h3 {
          font-family: var(--font-heading, 'Outfit', sans-serif);
          font-size: 1.2rem;
          font-weight: 800;
          margin-bottom: 0.4rem;
          line-height: 1.2;
        }
        .ml2-path-header-sheldon h3 { color: hsl(152, 55%, 25%); }
        .ml2-path-header-hariette h3 { color: hsl(20, 65%, 30%); }

        .ml2-chapter-badge {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.2rem 0.7rem;
          border-radius: 9999px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .ml2-badge-13 { background: hsl(152, 50%, 88%); color: hsl(152, 55%, 25%); }
        .ml2-badge-7  { background: hsl(30, 80%, 90%); color: hsl(20, 65%, 30%); }

        .ml2-path-tagline {
          font-style: italic;
          color: #666;
          font-size: 0.95rem;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #f0f0f0;
        }
        .ml2-path-list {
          list-style: none;
          padding: 0;
          margin: 0 0 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
        }
        .ml2-path-list li {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.92rem;
          color: #333;
          line-height: 1.4;
        }
        .ml2-path-list li svg { flex-shrink: 0; margin-top: 2px; }
        .ml2-check-green { color: hsl(152, 60%, 38%); }
        .ml2-check-orange { color: hsl(25, 85%, 50%); }

        .ml2-path-ideal {
          background: #f9f9f9;
          border-radius: 12px;
          padding: 0.75rem 1rem;
          font-size: 0.88rem;
          color: #555;
          line-height: 1.5;
          margin: 0;
        }
        .ml2-path-ideal strong { color: #333; }

        /* ── Myths ── */
        .ml2-myths-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
        .ml2-myth-card {
          background: #fafafa;
          border: 1px solid #ececec;
          border-radius: 16px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .ml2-myth-row, .ml2-fact-row {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        .ml2-myth-row svg { flex-shrink: 0; margin-top: 2px; }
        .ml2-fact-row svg { flex-shrink: 0; margin-top: 2px; }
        .ml2-x-icon { color: #cc3333; }
        .ml2-myth-text {
          font-size: 0.92rem;
          font-weight: 600;
          color: #888;
          text-decoration: line-through;
          margin: 0;
          line-height: 1.4;
        }
        .ml2-fact-text {
          font-size: 0.92rem;
          color: #333;
          margin: 0;
          line-height: 1.5;
        }

        /* ── Trust ── */
        .ml2-trust-inner {
          display: grid;
          grid-template-columns: auto 1fr 1fr;
          gap: 3rem;
          align-items: start;
        }
        .ml2-trust-stat {
          text-align: center;
          padding: 1.5rem;
          background: rgba(255,255,255,0.1);
          border-radius: 20px;
          min-width: 160px;
        }
        .ml2-trust-number {
          display: block;
          font-family: var(--font-heading, 'Outfit', sans-serif);
          font-size: 3rem;
          font-weight: 800;
          color: hsl(48, 90%, 75%);
          line-height: 1;
        }
        .ml2-trust-label {
          display: block;
          font-size: 0.9rem;
          opacity: 0.85;
          margin-top: 0.4rem;
        }
        .ml2-testimonial {
          border: none;
          margin: 0;
          padding: 1.5rem;
          background: rgba(255,255,255,0.1);
          border-radius: 20px;
        }
        .ml2-testimonial p {
          font-size: 0.97rem;
          font-style: italic;
          opacity: 0.92;
          line-height: 1.65;
          margin-bottom: 0.75rem;
        }
        .ml2-testimonial footer {
          font-size: 0.85rem;
          font-weight: 600;
          opacity: 0.75;
        }

        /* ── Final CTA ── */
        .ml2-final-cta {
          background: linear-gradient(135deg, hsl(152, 60%, 28%) 0%, hsl(152, 55%, 22%) 100%);
          color: white;
          text-align: center;
        }
        .ml2-final-inner {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .ml2-final-headline {
          font-family: var(--font-heading, 'Outfit', sans-serif);
          font-size: clamp(1.5rem, 3.5vw, 2.25rem);
          font-weight: 800;
          line-height: 1.25;
          margin-bottom: 1rem;
          max-width: 760px;
        }
        .ml2-final-sub {
          font-size: clamp(0.95rem, 2vw, 1.1rem);
          opacity: 0.88;
          max-width: 600px;
          line-height: 1.65;
          margin-bottom: 2.5rem;
        }
        .ml2-final-firm {
          margin-top: 2rem;
          opacity: 0.65;
          font-size: 0.9rem;
        }
        .ml2-disclaimer {
          margin-top: 1rem;
          opacity: 0.45;
          font-size: 0.75rem;
          max-width: 520px;
          line-height: 1.5;
        }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .ml2-mascot-img { width: 100px; height: 100px; }
          .ml2-vs-badge { font-size: 1.25rem; }
          .ml2-benefits-grid,
          .ml2-benefits-grid-4 { grid-template-columns: 1fr 1fr; }
          .ml2-paths-grid { grid-template-columns: 1fr; }
          .ml2-myths-grid { grid-template-columns: 1fr; }
          .ml2-trust-inner {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .ml2-trust-stat { min-width: unset; }
          .ml2-btn {
            width: 100%;
            justify-content: center;
            font-size: 1rem;
            padding: 0.9rem 1.5rem;
          }
          .ml2-section { padding: 3.5rem 1rem; }
        }

        @media (max-width: 480px) {
          .ml2-mascots-row { gap: 1rem; }
          .ml2-mascot-img { width: 80px; height: 80px; }
        }
      `}</style>
    </div>
    </>
  );
}
