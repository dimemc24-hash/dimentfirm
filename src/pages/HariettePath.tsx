import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Zap, CalendarHeart, Trash2 } from 'lucide-react';

export default function HariettePath() {
    return (
        <>
        <Helmet>
          <title>Chapter 7 Bankruptcy Louisiana | Fresh Start in 90 Days | Diment & Associates</title>
          <meta name="description" content="Eliminate credit card debt, medical bills, and personal loans with Chapter 7 bankruptcy in Louisiana. Discharge in 90–120 days. Stop wage garnishment and creditor harassment. Free evaluation." />
          <link rel="canonical" href="https://dimentfirm.com/hariette" />
          <meta property="og:title" content="Chapter 7 Bankruptcy Louisiana | Fresh Start in 90 Days | Diment & Associates" />
          <meta property="og:description" content="Chapter 7 wipes unsecured debt in 90–120 days. Stop garnishment and creditor calls. Louisiana attorneys since 2017. Free evaluation." />
          <meta property="og:url" content="https://dimentfirm.com/hariette" />
        </Helmet>
        <div className="path-page animate-fade-in">

            {/* Hero */}
            <section className="path-hero theme-hare">
                <div className="container text-center">
                    <span className="path-emoji">🐰</span>
                    <h1>Hariette's Quick Jump to Freedom</h1>
                    <p className="path-lead">Debt free. Fast!</p>
                </div>
            </section>

            {/* Intro and Basics */}
            <section className="section bg-white">
                <div className="container" style={{ maxWidth: '900px' }}>
                    <div className="text-center" style={{ marginBottom: '4rem' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>What Hariettes Know</h2>
                        <p className="lead-text">
                            Hariettes move fast! If you're overwhelmed by unsecured debt and ready for a complete clean slate,
                            this path gets you back to your life and running toward your future in record time.
                        </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card shadow-hover">
                            <div className="feature-icon theme-hare"><Zap size={32} /></div>
                            <h3>The Fast Track</h3>
                            <p>No 5-year repayment plans here. Chapter 7 is a straight sprint. You file, you get your shield from creditor harassment, and you move forward instantly.</p>
                        </div>

                        <div className="feature-card shadow-hover">
                            <div className="feature-icon theme-hare"><CalendarHeart size={32} /></div>
                            <h3>Hariette's Timeline</h3>
                            <p>Just 90 to 120 days from filing to discharge. By next season, your financial stress could be completely behind you.</p>
                        </div>

                        <div className="feature-card shadow-hover">
                            <div className="feature-icon theme-hare"><Trash2 size={32} /></div>
                            <h3>What Hariettes Leave Behind</h3>
                            <p>Credit card balances, medical bills, personal loans. We wipe out your unsecured debt so you can start fresh immediately.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Timeline Journey */}
            <section className="section" style={{ backgroundColor: 'var(--color-background)' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h2 className="text-center" style={{ marginBottom: '3rem' }}>Hariette's Sprint</h2>

                    <div className="journey-timeline hare-timeline">
                        <div className="journey-step">
                            <div className="step-marker">1</div>
                            <div className="step-content">
                                <h4>On Your Mark</h4>
                                <p>We gather your documents, file your case, and instantly stop creditors in their tracks.</p>
                            </div>
                        </div>
                        <div className="journey-step">
                            <div className="step-marker">2</div>
                            <div className="step-content">
                                <h4>Meeting the Trustee</h4>
                                <p>A brief 341 meeting where we sit with you. It's usually quick, painless, and focused on facts.</p>
                            </div>
                        </div>
                        <div className="journey-step">
                            <div className="step-marker">3</div>
                            <div className="step-content">
                                <h4>The Finish Line!</h4>
                                <p>Around 90-120 days later, you receive your official discharge. Your unsecured debts are gone.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Guides */}
            <section className="section bg-white">
              <div className="container" style={{ maxWidth: '800px' }}>
                <h2 style={{ textAlign: 'center', marginBottom: '0.75rem' }}>Chapter 7 Resources</h2>
                <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '2.5rem', fontSize: '1rem' }}>
                  Everything you need to know about Hariette's path.
                </p>
                <div className="hp-guides-list">
                  <Link to="/blog/how-chapter-7-works-louisiana" className="hp-guide-card">
                    <span className="hp-guide-title">How Chapter 7 Bankruptcy Works in Louisiana</span>
                    <span className="hp-guide-arrow">→</span>
                  </Link>
                  <Link to="/blog/stop-wage-garnishment-louisiana" className="hp-guide-card">
                    <span className="hp-guide-title">How Bankruptcy Stops Wage Garnishment in Louisiana</span>
                    <span className="hp-guide-arrow">→</span>
                  </Link>
                  <Link to="/blog/bankruptcy-means-test" className="hp-guide-card">
                    <span className="hp-guide-title">The Bankruptcy Means Test in Louisiana Explained</span>
                    <span className="hp-guide-arrow">→</span>
                  </Link>
                  <Link to="/blog/bankruptcy-credit-report" className="hp-guide-card">
                    <span className="hp-guide-title">How Long Does Bankruptcy Stay on My Credit Report?</span>
                    <span className="hp-guide-arrow">→</span>
                  </Link>
                </div>
              </div>
            </section>

            {/* Testimonial */}
            <section className="section theme-hare text-center">
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h2 style={{ marginBottom: '2rem' }}>Hariette Success Stories</h2>
                    <blockquote style={{ fontSize: '1.25rem', fontStyle: 'italic', marginBottom: '1.5rem', color: 'var(--color-hare-brown)' }}>
                        "I couldn't sleep because of the medical bills and credit cards piling up. Diment & Associates helped me sprint through Chapter 7. Less than 4 months later, it was all gone. I finally have my life back."
                    </blockquote>
                    <p style={{ fontWeight: '600', color: 'var(--color-hare-brown)' }}>— David, Livingston Parish (Hariette since 2023)</p>

                    <div style={{ marginTop: '3rem' }}>
                        <Link to="/quiz" className="btn btn-outline" style={{ background: 'white', color: 'var(--color-hare-brown)', borderColor: 'white' }}>
                            Take the Quiz to Find Your Path
                        </Link>
                    </div>
                </div>
            </section>

            <style>{`
        .hp-guides-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .hp-guide-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-lg);
          background: var(--color-background);
          text-decoration: none;
          color: var(--color-text-main);
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .hp-guide-card:hover {
          border-color: var(--color-hare-orange);
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
          color: var(--color-text-main);
        }
        .hp-guide-title { font-size: 0.95rem; font-weight: 500; }
        .hp-guide-arrow { color: var(--color-hare-orange); font-weight: 700; flex-shrink: 0; margin-left: 1rem; }

        .path-hero {
          padding: 6rem 2rem;
          margin-bottom: 2rem;
        }
        .path-emoji {
          font-size: 5rem;
          display: block;
          margin-bottom: 1rem;
        }
        .path-lead {
          font-size: 1.5rem;
          font-family: var(--font-heading);
          opacity: 0.9;
          margin-top: 1rem;
        }
        .lead-text {
          font-size: 1.25rem;
          color: var(--color-text-muted);
          line-height: 1.6;
        }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
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
        
        .journey-timeline {
          position: relative;
          padding-left: 2rem;
        }
        .hare-timeline::before {
          content: '';
          position: absolute;
          left: 31px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--color-hare-orange-light);
        }
        .journey-step {
          display: flex;
          gap: 2rem;
          margin-bottom: 2.5rem;
          position: relative;
        }
        .hare-timeline .step-marker {
          width: 24px;
          height: 24px;
          background: var(--color-hare-orange);
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

        @media (max-width: 768px) {
          .features-grid { grid-template-columns: 1fr; }
        }
      `}</style>
        </div>
        </>
    );
}
