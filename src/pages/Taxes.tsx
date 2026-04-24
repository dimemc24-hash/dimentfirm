import { Helmet } from 'react-helmet-async';
import {
  FileSpreadsheet,
  BookOpen,
  ShieldAlert,
  TrendingUp,
  Scale,
  Building2,
  CalendarCheck,
  Phone,
  ArrowRight,
} from 'lucide-react';

export default function Taxes() {
  const bookingUrl =
    'https://outlook.office.com/book/DimentAssociatesAppointmentsPublicCopy@dimentfirm.com/?ismsaljsauthenabled';

  return (
    <>
    <Helmet>
      <title>Tax & Accounting Services Baton Rouge | IRS Resolution | Diment & Associates</title>
      <meta name="description" content="Baton Rouge tax preparation, bookkeeping, IRS resolution, and business tax planning since 2017. No detail too small, no deduction left behind. Free consultation — 225-612-4848." />
      <link rel="canonical" href="https://dimentfirm.com/taxes" />
      <meta property="og:title" content="Tax & Accounting Services Baton Rouge | Diment & Associates" />
      <meta property="og:description" content="Tax prep, bookkeeping, and IRS resolution in Baton Rouge. Serving clients since 2017. Free consultation." />
      <meta property="og:url" content="https://dimentfirm.com/taxes" />
    </Helmet>
    <div className="taxes-page animate-fade-in">

      {/* Hero Section */}
      <section className="jasper-hero">
        <div className="container text-center">
          <div className="jasper-mascot-circle">
            <img src="/firm/jasper_bookworm_final.png" alt="Jasper the Bookworm — Taxes & Accounting Mascot" className="jasper-mascot-img" />
          </div>
          <h1>Tax &amp; Accounting Services</h1>
          <p className="jasper-hero-lead">
            Every number tells a story. Our team crunches them all with the kind of meticulous,
            detail-hungry attention we named Jasper after.
          </p>
          <p className="jasper-tagline">No detail too small. No deduction left behind.</p>
          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="btn jasper-btn-primary">
              Schedule a Consultation
            </a>
            <a href="tel:2256120765" className="btn jasper-btn-outline">
              <Phone size={18} /> 225-612-0765
            </a>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section bg-white">
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div className="text-center" style={{ marginBottom: '4rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>What We Crunch</h2>
            <p className="lead-text">
              From individual returns to full-service business accounting, we chew through
              every detail so nothing gets missed and every dollar is accounted for.
            </p>
          </div>

          <div className="jasper-services-grid">
            <div className="feature-card shadow-hover">
              <div className="feature-icon jasper-icon"><FileSpreadsheet size={32} /></div>
              <h3>Tax Preparation</h3>
              <p>Individual and business returns filed accurately and on time. We devour the fine print, maximize your deductions, and e-file for faster refunds.</p>
            </div>

            <div className="feature-card shadow-hover">
              <div className="feature-icon jasper-icon"><BookOpen size={32} /></div>
              <h3>Bookkeeping</h3>
              <p>Monthly bookkeeping, financial statements, and record-keeping so your books stay clean and audit-ready all year long. This is our natural habitat.</p>
            </div>

            <div className="feature-card shadow-hover">
              <div className="feature-icon jasper-icon"><ShieldAlert size={32} /></div>
              <h3>IRS Resolution</h3>
              <p>Back taxes, audit representation, installment agreements, and offers in compromise. The IRS brings a big appetite — ours is bigger.</p>
            </div>

            <div className="feature-card shadow-hover">
              <div className="feature-icon jasper-icon"><TrendingUp size={32} /></div>
              <h3>Business Tax Planning</h3>
              <p>Quarterly estimates, entity selection for tax efficiency, and year-end planning strategies that keep more money in your business.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Jasper? */}
      <section className="section" style={{ backgroundColor: 'var(--jasper-bg-light)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="text-center" style={{ marginBottom: '3rem' }}>Why a Bookworm?</h2>

          <div className="jasper-why-grid">
            <div className="jasper-why-card">
              <div className="jasper-why-icon"><Scale size={28} /></div>
              <div>
                <h4>Legal + Financial Expertise</h4>
                <p>Because we also handle bankruptcy, we understand both the legal and financial sides of complex situations. That dual perspective means smarter tax strategy — we digest the whole picture, not just the numbers.</p>
              </div>
            </div>

            <div className="jasper-why-card">
              <div className="jasper-why-icon"><Building2 size={28} /></div>
              <div>
                <h4>Small Business Focus</h4>
                <p>We work with Louisiana small businesses every day. We know the local landscape, state-specific requirements, and the real challenges owners face.</p>
              </div>
            </div>

            <div className="jasper-why-card">
              <div className="jasper-why-icon"><CalendarCheck size={28} /></div>
              <div>
                <h4>Year-Round Support</h4>
                <p>We don't disappear after April 15th. Tax questions come up all year, and we're here whenever you need us — hungry for the work, not just at filing time.</p>
              </div>
            </div>
          </div>

          <blockquote className="jasper-wisdom-quote">
            "A good bookworm doesn't just crunch the numbers — he chews between the lines. That's where the savings hide."
          </blockquote>
        </div>
      </section>

      {/* Process */}
      <section className="section bg-white">
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 className="text-center" style={{ marginBottom: '3rem' }}>How We Work</h2>

          <div className="journey-timeline jasper-timeline">
            <div className="journey-step">
              <div className="step-marker jasper-step-marker">1</div>
              <div className="step-content">
                <h4>Gather Your Documents</h4>
                <p>Bring us what you have — W-2s, 1099s, receipts, or a shoebox of papers. We've seen it all and judge none of it.</p>
              </div>
            </div>
            <div className="journey-step">
              <div className="step-marker jasper-step-marker">2</div>
              <div className="step-content">
                <h4>We Chew Through It</h4>
                <p>Every deduction found, every credit applied, every number digested. Thorough is an understatement.</p>
              </div>
            </div>
            <div className="journey-step">
              <div className="step-marker jasper-step-marker">3</div>
              <div className="step-content">
                <h4>Review Together</h4>
                <p>We walk you through everything in plain English. No jargon, no surprises — just clarity on your numbers.</p>
              </div>
            </div>
            <div className="journey-step">
              <div className="step-marker jasper-step-marker">4</div>
              <div className="step-content">
                <h4>File & Plan Ahead</h4>
                <p>Returns filed, records organized, and a plan for next year so you're always ahead — not catching up.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="jasper-cta-section text-center">
        <div className="container" style={{ maxWidth: '700px' }}>
          <div className="jasper-cta-mascot">
            <img src="/firm/jasper_bookworm_final.png" alt="Jasper the Bookworm" className="jasper-cta-mascot-img" />
          </div>
          <h2>Ready to Get Your Numbers Crunched?</h2>
          <p style={{ fontSize: '1.15rem', marginBottom: '2rem', opacity: 0.9 }}>
            Whether you need help with a single return or full-service accounting,
            we're hungry for the work.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="btn jasper-btn-cta">
              Book a Consultation <ArrowRight size={18} />
            </a>
            <a href="tel:2256120765" className="btn jasper-btn-cta-outline">
              <Phone size={18} /> Call 225-612-0765
            </a>
          </div>
        </div>
      </section>

      <style>{`
        /* Jasper Color Theme */
        .taxes-page {
          --jasper-green: hsl(150, 40%, 32%);
          --jasper-green-dark: hsl(150, 45%, 22%);
          --jasper-green-light: hsl(150, 30%, 42%);
          --jasper-bg-light: hsl(45, 30%, 95%);
          --jasper-cream: hsl(45, 40%, 92%);
          --jasper-visor: hsl(150, 50%, 38%);
          --jasper-gold: hsl(42, 70%, 50%);
        }

        /* Hero */
        .jasper-hero {
          background: linear-gradient(135deg, var(--jasper-green-dark) 0%, var(--jasper-green) 60%, var(--jasper-green-light) 100%);
          color: white;
          padding: 6rem 2rem 5rem;
        }
        .jasper-mascot-circle {
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          border: 3px solid var(--jasper-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          overflow: hidden;
        }
        .jasper-mascot-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .jasper-hero h1 {
          font-size: 2.75rem;
          margin-bottom: 1.25rem;
          letter-spacing: -0.5px;
        }
        .jasper-hero-lead {
          font-size: 1.25rem;
          line-height: 1.6;
          opacity: 0.9;
          max-width: 620px;
          margin: 0 auto;
        }
        .jasper-tagline {
          font-family: var(--font-heading);
          font-size: 1.05rem;
          font-style: italic;
          opacity: 0.7;
          margin-top: 1.25rem;
          letter-spacing: 0.3px;
        }

        /* Jasper Buttons */
        .jasper-btn-primary {
          background: #fff !important;
          color: var(--jasper-green-dark) !important;
          border: 2px solid #fff !important;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 2rem;
          border-radius: var(--border-radius-full);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .jasper-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }
        .jasper-btn-outline {
          background: transparent !important;
          color: #fff !important;
          border: 2px solid rgba(255,255,255,0.5) !important;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 2rem;
          border-radius: var(--border-radius-full);
          transition: background 0.2s, border-color 0.2s;
        }
        .jasper-btn-outline:hover {
          background: rgba(255,255,255,0.1) !important;
          border-color: #fff !important;
        }

        /* Services Grid */
        .jasper-services-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 2rem;
        }
        .feature-card {
          background: white;
          padding: 2.5rem 2rem;
          border-radius: var(--border-radius-lg);
          border: 1px solid var(--color-border);
          text-align: center;
        }
        .feature-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }
        .jasper-icon {
          background: var(--jasper-bg-light);
          color: var(--jasper-green);
        }
        .lead-text {
          font-size: 1.25rem;
          color: var(--color-text-muted);
          line-height: 1.6;
        }

        /* Why Jasper */
        .jasper-why-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        .jasper-why-card {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
          background: white;
          padding: 2rem;
          border-radius: var(--border-radius-lg);
          border-left: 4px solid var(--jasper-green);
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
        }
        .jasper-why-icon {
          width: 56px;
          height: 56px;
          min-width: 56px;
          border-radius: 50%;
          background: var(--jasper-bg-light);
          color: var(--jasper-green);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .jasper-why-card h4 {
          margin-bottom: 0.5rem;
          font-size: 1.15rem;
          color: var(--jasper-green-dark);
        }
        .jasper-why-card p {
          color: var(--color-text-muted);
          margin-bottom: 0;
          line-height: 1.6;
        }

        /* Wisdom Quote */
        .jasper-wisdom-quote {
          font-size: 1.2rem;
          font-style: italic;
          color: var(--jasper-green-dark);
          text-align: center;
          border: none;
          padding: 2.5rem;
          background: white;
          border-radius: var(--border-radius-lg);
          box-shadow: 0 2px 12px rgba(0,0,0,0.05);
          line-height: 1.7;
          margin: 0;
        }

        /* Process Timeline */
        .jasper-timeline {
          position: relative;
          padding-left: 2rem;
        }
        .jasper-timeline::before {
          content: '';
          position: absolute;
          left: 31px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--jasper-cream);
        }
        .journey-step {
          display: flex;
          gap: 2rem;
          margin-bottom: 2.5rem;
          position: relative;
        }
        .jasper-step-marker {
          width: 24px;
          height: 24px;
          background: var(--jasper-green);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.8rem;
          z-index: 2;
          flex-shrink: 0;
          margin-top: 4px;
        }
        .step-content h4 {
          margin-bottom: 0.5rem;
          font-size: 1.25rem;
        }
        .step-content p {
          color: var(--color-text-muted);
          margin-bottom: 0;
        }

        /* CTA */
        .jasper-cta-section {
          padding: 5rem 2rem;
          background: linear-gradient(135deg, var(--jasper-green) 0%, var(--jasper-green-dark) 100%);
          color: white;
        }
        .jasper-cta-mascot {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;
          margin: 0 auto 1.5rem;
          background: rgba(255,255,255,0.15);
          border: 2px solid rgba(255,255,255,0.3);
        }
        .jasper-cta-mascot-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .jasper-cta-section h2 {
          color: white;
          margin-bottom: 1rem;
        }
        .jasper-btn-cta {
          background: #fff !important;
          color: var(--jasper-green-dark) !important;
          border: 2px solid #fff !important;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 2rem;
          border-radius: var(--border-radius-full);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .jasper-btn-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        }
        .jasper-btn-cta-outline {
          background: transparent !important;
          color: #fff !important;
          border: 2px solid rgba(255,255,255,0.5) !important;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.85rem 2rem;
          border-radius: var(--border-radius-full);
          transition: background 0.2s, border-color 0.2s;
        }
        .jasper-btn-cta-outline:hover {
          background: rgba(255,255,255,0.1) !important;
          border-color: #fff !important;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .jasper-hero h1 { font-size: 2rem; }
          .jasper-hero { padding: 4rem 1.5rem; }
          .jasper-services-grid { grid-template-columns: 1fr; }
          .jasper-why-card { flex-direction: column; gap: 1rem; }
          .jasper-mascot-circle { width: 100px; height: 100px; }
          .jasper-mascot-emoji { font-size: 3.5rem; }
          .jasper-cta-section { padding: 3.5rem 1.5rem; }
        }
      `}</style>
    </div>
    </>
  );
}
