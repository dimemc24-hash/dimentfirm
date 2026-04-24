import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShieldCheck, Clock, Home } from 'lucide-react';

export default function SheldonPath() {
    return (
        <>
        <Helmet>
          <title>Chapter 13 Bankruptcy Baton Rouge | Keep Your Home & Car | Diment & Associates</title>
          <meta name="description" content="Chapter 13 bankruptcy in Louisiana lets you keep your home, stop foreclosure, and catch up on missed payments in one affordable plan. Baton Rouge attorneys since 2017. Free evaluation." />
          <link rel="canonical" href="https://dimentfirm.com/sheldon" />
          <meta property="og:title" content="Chapter 13 Bankruptcy Baton Rouge | Keep Your Home & Car | Diment & Associates" />
          <meta property="og:description" content="Stop foreclosure and keep your home with Chapter 13 bankruptcy. Louisiana attorneys since 2017. Free evaluation." />
          <meta property="og:url" content="https://dimentfirm.com/sheldon" />
        </Helmet>
        <div className="path-page animate-fade-in">

            {/* Hero */}
            <section className="path-hero theme-turtle">
                <div className="container text-center">
                    <span className="path-emoji">🐢</span>
                    <h1>Sheldon's Steady Path to Freedom</h1>
                    <p className="path-lead">Five years goes by faster than you think.</p>
                </div>
            </section>

            {/* Intro and Basics */}
            <section className="section bg-white">
                <div className="container" style={{ maxWidth: '900px' }}>
                    <div className="text-center" style={{ marginBottom: '4rem' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>What Sheldons Know</h2>
                        <p className="lead-text">
                            Tortoises know that good things take time. Your five-year plan might feel long right now,
                            but it goes by faster than you think—and you keep everything that matters along the way.
                        </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card shadow-hover">
                            <div className="feature-icon theme-turtle"><ShieldCheck size={32} /></div>
                            <h3>Sheldon's Shield</h3>
                            <p>The moment you start your journey, a legal shield (the "automatic stay") protects you from creditors, foreclosures, and repossessions. The storm stops immediately.</p>
                        </div>

                        <div className="feature-card shadow-hover">
                            <div className="feature-icon theme-turtle"><Clock size={32} /></div>
                            <h3>The Tortoise Timeline</h3>
                            <p>You'll make one manageable monthly payment for 3 to 5 years. It's steady, predictable, and we handle the complexity so you can just live your life.</p>
                        </div>

                        <div className="feature-card shadow-hover">
                            <div className="feature-icon theme-turtle"><Home size={32} /></div>
                            <h3>What Sheldons Keep</h3>
                            <p>Your home, your car, your assets. We reorganize your debt so you can catch up on missed payments without losing the things you've worked so hard for.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Timeline Journey */}
            <section className="section" style={{ backgroundColor: 'var(--color-background)' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h2 className="text-center" style={{ marginBottom: '3rem' }}>Sheldon's Journey</h2>

                    <div className="journey-timeline">
                        <div className="journey-step">
                            <div className="step-marker">1</div>
                            <div className="step-content">
                                <h4>Starting Your Path</h4>
                                <p>We build your protective shield. Creditor calls stop. You breathe again.</p>
                            </div>
                        </div>
                        <div className="journey-step">
                            <div className="step-marker">2</div>
                            <div className="step-content">
                                <h4>Meeting the Trustee</h4>
                                <p>A simple meeting to confirm your steady plan. We'll be right beside you.</p>
                            </div>
                        </div>
                        <div className="journey-step">
                            <div className="step-marker">3</div>
                            <div className="step-content">
                                <h4>The Middle Miles</h4>
                                <p>You make your single monthly payment. If life bumps happen, the tortoise adapts—we can adjust your plan if your income changes.</p>
                            </div>
                        </div>
                        <div className="journey-step">
                            <div className="step-marker">4</div>
                            <div className="step-content">
                                <h4>The Finish Line</h4>
                                <p>Months 36 to 60 wrap up. You've protected your assets and you cross the finish line debt-free!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonial */}
            <section className="section theme-turtle text-center">
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h2 style={{ marginBottom: '2rem' }}>Sheldon Success Stories</h2>
                    <blockquote style={{ fontSize: '1.25rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                        "Five years ago, we were drowning and terrified of losing our house. Today, our plan is complete, we're debt-free, and we're still in our home. The tortoise really does win."
                    </blockquote>
                    <p style={{ fontWeight: '600' }}>— Sarah and Mark, Baton Rouge (Sheldons since 2021)</p>

                    <div style={{ marginTop: '3rem' }}>
                        <Link to="/quiz" className="btn btn-outline" style={{ background: 'white', color: 'var(--color-turtle-shell)', borderColor: 'white' }}>
                            Not sure? Take the Path Quiz
                        </Link>
                    </div>
                </div>
            </section>

            <style>{`
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
        .journey-timeline::before {
          content: '';
          position: absolute;
          left: 31px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--color-turtle-green-light);
        }
        .journey-step {
          display: flex;
          gap: 2rem;
          margin-bottom: 2.5rem;
          position: relative;
        }
        .step-marker {
          width: 24px;
          height: 24px;
          background: var(--color-turtle-green);
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
