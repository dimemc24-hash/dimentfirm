import { HandCoins, FileText, Settings, Gavel, Phone, ArrowRight } from 'lucide-react';

export default function SmallBusiness() {
    const bookingUrl = 'https://outlook.office.com/book/DimentAssociatesAppointmentsPublicCopy@dimentfirm.com/?ismsaljsauthenabled';

    return (
        <div className="path-page animate-fade-in">

            {/* Hero */}
            <section className="owl-hero">
                <div className="container text-center">
                    <div className="owl-mascot-circle">
                        <img src="/firm/oakley_owl_final.png" alt="Oakley the Owl — Small Business Law" className="owl-mascot-img" />
                    </div>
                    <h1>Small Business Law</h1>
                    <p className="owl-hero-lead">
                        You built something real. Our team treats it that way — with the kind of
                        sharp-eyed, nothing-gets-missed attention we named Oakley after.
                    </p>
                    <p className="owl-tagline">The wise move is asking.</p>
                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="btn owl-btn-primary">
                            Free Consultation <ArrowRight size={18} />
                        </a>
                        <a href="tel:2256120765" className="btn owl-btn-outline">
                            <Phone size={18} /> 225-612-0765
                        </a>
                    </div>
                </div>
            </section>

            {/* Why an Owl? */}
            <section className="section bg-white">
                <div className="container" style={{ maxWidth: '800px' }}>
                    <div className="text-center" style={{ marginBottom: '3rem' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>Why an Owl?</h2>
                        <p className="lead-text">
                            Owls see what others can't. They're patient, precise, and they don't miss a thing —
                            even in the dark. That's how we approach your business: eyes wide open, always watching,
                            always three moves ahead.
                        </p>
                    </div>

                    <div className="owl-why-grid">
                        <div className="owl-why-card">
                            <h4>We See Problems Before They Land</h4>
                            <p>Most business legal issues are preventable. We build protections into your operations so you're not scrambling when something goes sideways at 2 AM.</p>
                        </div>
                        <div className="owl-why-card">
                            <h4>We Know This Territory</h4>
                            <p>Louisiana business law has its own quirks — parish-level rules, state-specific regulations, and a legal tradition unlike anywhere else. We practice here because we know here.</p>
                        </div>
                        <div className="owl-why-card">
                            <h4>We Don't Clock Out</h4>
                            <p>Owls are nocturnal for a reason. Your business doesn't stop generating legal questions at 5 PM, and our attention to your interests doesn't either.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="section" style={{ backgroundColor: 'var(--owl-bg-light)' }}>
                <div className="container" style={{ maxWidth: '1000px' }}>
                    <div className="text-center" style={{ marginBottom: '4rem' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>What We Cover</h2>
                        <p className="lead-text">
                            From handshake deals to courtroom disputes — the full wingspan of small business legal services.
                        </p>
                    </div>

                    <div className="owl-services-grid">
                        <div className="feature-card shadow-hover">
                            <div className="feature-icon owl-icon"><HandCoins size={32} /></div>
                            <h3>Sales &amp; Purchases</h3>
                            <p>Buying or selling a business, bringing on a partner, acquiring assets. We make sure you see the full picture — including what's hiding in the shadows — before you sign anything.</p>
                        </div>

                        <div className="feature-card shadow-hover">
                            <div className="feature-icon owl-icon"><FileText size={32} /></div>
                            <h3>Contracts &amp; Agreements</h3>
                            <p>Employment contracts, vendor agreements, partnership terms. Every handshake should have smart paperwork behind it. We draft agreements that actually protect you, not just fill a filing cabinet.</p>
                        </div>

                        <div className="feature-card shadow-hover">
                            <div className="feature-icon owl-icon"><Settings size={32} /></div>
                            <h3>Operations Advising</h3>
                            <p>The day-to-day legal questions you don't have time to think about while you're running the business. Regulatory compliance, HR situations, lease reviews — we keep watch so you can keep working.</p>
                        </div>

                        <div className="feature-card shadow-hover">
                            <div className="feature-icon owl-icon"><Gavel size={32} /></div>
                            <h3>Disputes &amp; Litigation</h3>
                            <p>Partner disagreements, vendor conflicts, breach of contract. When it comes to a fight, we see every angle. Negotiation when it's smart, courtroom when it's necessary.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Process */}
            <section className="section bg-white">
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h2 className="text-center" style={{ marginBottom: '3rem' }}>How We Work</h2>

                    <div className="journey-timeline owl-timeline">
                        <div className="journey-step">
                            <div className="step-marker owl-step-marker">1</div>
                            <div className="step-content">
                                <h4>You Talk, We Listen</h4>
                                <p>Tell us about your business — what you've built, where you're headed, and what keeps you up at night. Good counsel starts with understanding.</p>
                            </div>
                        </div>
                        <div className="journey-step">
                            <div className="step-marker owl-step-marker">2</div>
                            <div className="step-content">
                                <h4>We Sweep the Perimeter</h4>
                                <p>A full review of your legal exposure — contracts, operations, compliance, gaps. We find what's solid and what's vulnerable.</p>
                            </div>
                        </div>
                        <div className="journey-step">
                            <div className="step-marker owl-step-marker">3</div>
                            <div className="step-content">
                                <h4>Build the Framework</h4>
                                <p>Contracts drafted, operations tightened, protections locked in. Your business gets the structure it needs to grow without worrying about what's behind it.</p>
                            </div>
                        </div>
                        <div className="journey-step">
                            <div className="step-marker owl-step-marker">4</div>
                            <div className="step-content">
                                <h4>Stay on Watch</h4>
                                <p>Ongoing counsel when questions come up. New contract? New hire? New opportunity? We're a phone call away — and we already know your business.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Wisdom Quote + CTA */}
            <section className="owl-cta-section text-center">
                <div className="container" style={{ maxWidth: '800px' }}>
                    <blockquote className="owl-cta-quote">
                        "The wisest business owners aren't the ones who never face legal questions — they're the ones who ask before it's urgent."
                    </blockquote>
                    <h2 style={{ marginBottom: '1.5rem' }}>Let's Talk About Your Business</h2>
                    <p style={{ fontSize: '1.15rem', marginBottom: '2.5rem', opacity: 0.9 }}>
                        Free consultation. No obligation. Just a conversation about where you are and what you need.
                    </p>
                    <div className="owl-cta-buttons">
                        <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className="btn owl-btn-primary">
                            Schedule a Consultation <ArrowRight size={18} />
                        </a>
                        <a href="tel:2256120765" className="btn owl-btn-outline">
                            <Phone size={18} /> Call 225-612-0765
                        </a>
                    </div>
                </div>
            </section>

            <style>{`
        /* Owl Color Theme */
        :root {
          --owl-navy: hsl(230, 45%, 25%);
          --owl-indigo: hsl(230, 45%, 35%);
          --owl-indigo-mid: hsl(230, 40%, 50%);
          --owl-indigo-light: hsl(230, 40%, 70%);
          --owl-bg-light: hsl(230, 40%, 94%);
          --owl-gold: hsl(42, 78%, 55%);
          --owl-gold-light: hsl(42, 78%, 90%);
        }

        /* Hero */
        .owl-hero {
          background: linear-gradient(135deg, var(--owl-navy) 0%, var(--owl-indigo) 60%, var(--owl-indigo-mid) 100%);
          color: white;
          padding: 6rem 2rem 5rem;
          margin-bottom: 2rem;
        }
        .owl-mascot-circle {
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          border: 3px solid var(--owl-gold);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          overflow: hidden;
        }
        .owl-mascot-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .owl-hero h1 {
          font-size: 2.75rem;
          margin-bottom: 1.25rem;
          letter-spacing: -0.5px;
        }
        .owl-hero-lead {
          font-size: 1.25rem;
          line-height: 1.6;
          opacity: 0.9;
          max-width: 650px;
          margin: 0 auto;
        }
        .owl-tagline {
          font-family: var(--font-heading);
          font-size: 1.1rem;
          font-style: italic;
          opacity: 0.7;
          margin-top: 1.5rem;
          letter-spacing: 0.5px;
        }

        /* Services Grid */
        .owl-services-grid {
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
        .owl-icon {
          background: var(--owl-bg-light);
          color: var(--owl-indigo);
        }

        /* Why Oakley */
        .owl-why-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          margin-bottom: 3rem;
        }
        .owl-why-card {
          background: white;
          padding: 2rem 1.5rem;
          border-radius: var(--border-radius-lg);
          border-left: 4px solid var(--owl-indigo);
        }
        .owl-why-card h4 {
          color: var(--owl-indigo);
          margin-bottom: 0.75rem;
          font-size: 1.15rem;
        }
        .owl-why-card p {
          color: var(--color-text-muted);
          margin-bottom: 0;
          line-height: 1.6;
        }
        .owl-why-card h4 {
          color: var(--owl-indigo);
          margin-bottom: 0.75rem;
          font-size: 1.15rem;
        }
        .owl-why-card p {
          color: var(--color-text-muted);
          margin-bottom: 0;
          line-height: 1.7;
        }

        /* Process Timeline */
        .owl-timeline {
          position: relative;
          padding-left: 2rem;
        }
        .owl-timeline::before {
          content: '';
          position: absolute;
          left: 31px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--owl-indigo-light);
        }
        .journey-step {
          display: flex;
          gap: 2rem;
          margin-bottom: 2.5rem;
          position: relative;
        }
        .owl-step-marker {
          width: 24px;
          height: 24px;
          background: var(--owl-indigo);
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

        /* CTA Section */
        .owl-cta-section {
          background: linear-gradient(135deg, var(--owl-indigo) 0%, var(--owl-navy) 100%);
          color: white;
          padding: 5rem 2rem;
        }
        .owl-cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .owl-btn-primary {
          background: var(--owl-gold) !important;
          color: var(--owl-navy) !important;
          border: 2px solid var(--owl-gold) !important;
          font-weight: 600;
          padding: 0.85rem 2rem;
          border-radius: var(--border-radius-lg);
          text-decoration: none;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .owl-btn-primary:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
        }
        .owl-btn-outline {
          background: transparent !important;
          color: white !important;
          border: 2px solid rgba(255, 255, 255, 0.5) !important;
          font-weight: 600;
          padding: 0.85rem 2rem;
          border-radius: var(--border-radius-lg);
          text-decoration: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .owl-btn-outline:hover {
          border-color: white !important;
          background: rgba(255, 255, 255, 0.1) !important;
        }

        /* CTA quote */
        .owl-cta-quote {
          font-size: 1.3rem;
          font-style: italic;
          color: rgba(255,255,255,0.85);
          border: none;
          margin: 0 0 2.5rem;
          padding: 0;
          line-height: 1.7;
        }

        /* Lead text */
        .lead-text {
          font-size: 1.25rem;
          color: var(--color-text-muted);
          line-height: 1.6;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .owl-hero h1 {
            font-size: 2rem;
          }
          .owl-services-grid {
            grid-template-columns: 1fr;
          }
          .owl-why-grid {
            grid-template-columns: 1fr;
          }
          .owl-mascot-circle {
            width: 120px;
            height: 120px;
          }
          .owl-cta-buttons {
            flex-direction: column;
            align-items: center;
          }
        }
      `}</style>
        </div>
    );
}
