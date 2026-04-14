import { Users, Compass, Lightbulb, ArrowRight, Phone } from 'lucide-react';

const BOOKING_URL =
    'https://outlook.office.com/book/DimentAssociatesAppointmentsPublicCopy@dimentfirm.com/?ismsaljsauthenabled';

export default function FamilyLaw() {
    return (
        <div className="path-page animate-fade-in">

            {/* Hero */}
            <section className="fox-hero">
                <div className="container text-center">
                    <div className="fox-mascot-circle">
                        <img src="/firm/remy_fox_final.png" alt="Remy the Fox — Family Law" className="fox-mascot-img" />
                    </div>
                    <h1>Remy's Path Through Family Law</h1>
                    <p className="fox-lead">
                        Foxes adapt. When everything around them changes, they find the smart path through.
                        If your family is going through a transition, you're a Remy — and this is your story.
                    </p>
                </div>
            </section>

            {/* What Remys Know */}
            <section className="section bg-white">
                <div className="container" style={{ maxWidth: '900px' }}>
                    <div className="text-center" style={{ marginBottom: '4rem' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>What Remys Know</h2>
                        <p className="lead-text">
                            Foxes know that family transitions don't have to be wars. You can protect
                            your kids, protect yourself, and come out the other side with a plan that
                            actually works — if you're smart about how you move.
                        </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card shadow-hover">
                            <div className="feature-icon fox-icon"><Compass size={32} /></div>
                            <h3>Remy's Instinct</h3>
                            <p>
                                The fox doesn't charge in blind. From the first conversation, we map every
                                option — divorce, custody, support — so you see the full landscape before
                                making a single move.
                            </p>
                        </div>

                        <div className="feature-card shadow-hover">
                            <div className="feature-icon fox-icon"><Users size={32} /></div>
                            <h3>What Remys Protect</h3>
                            <p>
                                Your relationship with your kids. Your financial stability. Your sanity.
                                We build parenting plans and support arrangements around what actually
                                works for your life — not a template.
                            </p>
                        </div>

                        <div className="feature-card shadow-hover">
                            <div className="feature-icon fox-icon"><Lightbulb size={32} /></div>
                            <h3>The Fox Advantage</h3>
                            <p>
                                Strategic, not aggressive. Scorched earth helps no one — especially not
                                your family. Remys find the smartest path forward, not the loudest.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Remy's Journey */}
            <section className="section" style={{ backgroundColor: 'var(--color-fox-light)' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h2 className="text-center" style={{ marginBottom: '3rem' }}>Remy's Journey</h2>

                    <div className="journey-timeline fox-timeline">
                        <div className="journey-step">
                            <div className="step-marker fox-marker">1</div>
                            <div className="step-content">
                                <h4>The Crossroads</h4>
                                <p>Something changed — and now you need to figure out what comes next. You come in, we listen, and we give you honest answers. No judgment, no pressure.</p>
                            </div>
                        </div>
                        <div className="journey-step">
                            <div className="step-marker fox-marker">2</div>
                            <div className="step-content">
                                <h4>Mapping the Terrain</h4>
                                <p>We lay out every path available — the risks, the rewards, the timelines. You pick the direction. We navigate.</p>
                            </div>
                        </div>
                        <div className="journey-step">
                            <div className="step-marker fox-marker">3</div>
                            <div className="step-content">
                                <h4>Moving Through It</h4>
                                <p>Negotiation, mediation, or the courtroom — whatever it takes. Foxes adapt. If the situation shifts, the strategy shifts with it.</p>
                            </div>
                        </div>
                        <div className="journey-step">
                            <div className="step-marker fox-marker">4</div>
                            <div className="step-content">
                                <h4>Clear Ground</h4>
                                <p>The paperwork is done. The plan is in place. You walk out with your kids, your stability, and your life pointed forward.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Remy Success Stories */}
            <section className="section fox-testimonial-section text-center">
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h2 style={{ marginBottom: '2rem' }}>Remy Success Stories</h2>
                    <blockquote className="fox-testimonial">
                        <p>
                            "I was terrified going into my custody case. The team at Diment &amp; Associates
                            didn't just fight for me — they helped me think clearly about what was best for
                            my kids. I walked out with a plan I actually believe in."
                        </p>
                        <cite>— Baton Rouge client (Remy since 2024)</cite>
                    </blockquote>

                    <div style={{ marginTop: '3rem' }}>
                        <a href={BOOKING_URL} className="btn fox-btn-primary" target="_blank" rel="noopener noreferrer">
                            Are You a Remy? Let's Talk <ArrowRight size={18} />
                        </a>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="fox-cta-section text-center">
                <div className="container" style={{ maxWidth: '700px' }}>
                    <div className="fox-cta-mascot">
                        <img src="/firm/remy_fox_final.png" alt="Remy the Fox" className="fox-cta-mascot-img" />
                    </div>
                    <h2>Every Remy Starts Here</h2>
                    <p style={{ fontSize: '1.15rem', marginBottom: '2rem', opacity: 0.9 }}>
                        A free consultation — no pressure, no obligation.
                        Just a conversation about where you are and where you want to be.
                    </p>
                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a href={BOOKING_URL} className="btn btn-primary fox-btn-cta" target="_blank" rel="noopener noreferrer">
                            Book Your Free Consultation <ArrowRight size={18} />
                        </a>
                        <a href="tel:2256120765" className="btn btn-outline fox-btn-cta-outline">
                            <Phone size={18} /> Call 225-612-0765
                        </a>
                    </div>
                </div>
            </section>

            <style>{`
        /* Fox color theme */
        .path-page {
          --color-fox-primary: hsl(25, 70%, 45%);
          --color-fox-light: hsl(25, 60%, 93%);
          --color-fox-dark: hsl(25, 65%, 28%);
          --color-fox-accent: hsl(30, 75%, 55%);
          --color-fox-warm: hsl(20, 50%, 97%);
        }

        /* Hero */
        .fox-hero {
          padding: 6rem 2rem;
          margin-bottom: 2rem;
          background: linear-gradient(135deg, var(--color-fox-light) 0%, var(--color-fox-warm) 100%);
          color: var(--color-fox-dark);
        }
        .fox-mascot-circle {
          width: 160px;
          height: 160px;
          border-radius: 50%;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
          overflow: hidden;
          box-shadow: 0 8px 32px hsla(25, 70%, 45%, 0.15);
          border: 3px solid var(--color-fox-primary);
        }
        .fox-mascot-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .fox-hero h1 {
          font-family: var(--font-heading);
          font-size: 3rem;
          margin-bottom: 1rem;
          color: var(--color-fox-dark);
        }
        .fox-lead {
          font-size: 1.3rem;
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
          opacity: 0.85;
        }

        /* Fox buttons */
        .fox-btn-primary {
          background-color: var(--color-fox-primary) !important;
          border-color: var(--color-fox-primary) !important;
          color: white !important;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .fox-btn-primary:hover {
          background-color: var(--color-fox-dark) !important;
          border-color: var(--color-fox-dark) !important;
        }
        .fox-btn-outline {
          background: white !important;
          color: var(--color-fox-primary) !important;
          border-color: var(--color-fox-primary) !important;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .fox-btn-outline:hover {
          background-color: var(--color-fox-light) !important;
        }

        /* Feature icons in fox theme */
        .fox-icon {
          background-color: var(--color-fox-light);
          color: var(--color-fox-primary);
        }

        /* Why Remy values */
        .fox-values-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        .fox-value-card {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
          background: white;
          padding: 2rem;
          border-radius: var(--border-radius-lg);
          border-left: 4px solid var(--color-fox-primary);
          box-shadow: 0 2px 12px hsla(25, 70%, 45%, 0.08);
        }
        .fox-value-icon {
          width: 56px;
          height: 56px;
          min-width: 56px;
          border-radius: 50%;
          background: var(--color-fox-light);
          color: var(--color-fox-primary);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .fox-value-card h4 {
          margin-bottom: 0.5rem;
          font-size: 1.15rem;
          color: var(--color-fox-dark);
        }
        .fox-value-card p {
          color: var(--color-text-muted);
          margin-bottom: 0;
          line-height: 1.6;
        }

        /* Testimonial */
        .fox-testimonial {
          background: white;
          padding: 2.5rem;
          border-radius: var(--border-radius-lg);
          text-align: center;
          box-shadow: 0 2px 12px hsla(25, 70%, 45%, 0.08);
          border: none;
          margin: 0;
        }
        .fox-testimonial p {
          font-size: 1.2rem;
          font-style: italic;
          line-height: 1.7;
          color: var(--color-fox-dark);
          margin-bottom: 1rem;
        }
        .fox-testimonial cite {
          font-style: normal;
          font-weight: 600;
          color: var(--color-fox-primary);
          font-size: 0.95rem;
        }

        /* Fox timeline */
        .fox-timeline::before {
          content: '';
          position: absolute;
          left: 31px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--color-fox-light);
        }
        .fox-marker {
          width: 24px;
          height: 24px;
          background: var(--color-fox-primary) !important;
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

        /* Testimonial section */
        .fox-testimonial-section {
          background: linear-gradient(135deg, var(--color-fox-light) 0%, var(--color-fox-warm) 100%);
          color: var(--color-fox-dark);
        }

        /* CTA */
        .fox-cta-section {
          padding: 5rem 2rem;
          background: linear-gradient(135deg, var(--color-fox-dark) 0%, var(--color-fox-primary) 100%);
          color: white;
        }
        .fox-cta-mascot {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          overflow: hidden;
          margin: 0 auto 1.5rem;
          background: rgba(255,255,255,0.15);
          border: 2px solid rgba(255,255,255,0.3);
        }
        .fox-cta-mascot-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .fox-cta-section h2 {
          color: white;
          margin-bottom: 1rem;
        }
        .fox-btn-cta {
          background: white !important;
          color: var(--color-fox-dark) !important;
          border-color: white !important;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .fox-btn-cta:hover {
          background: var(--color-fox-light) !important;
        }
        .fox-btn-cta-outline {
          background: transparent !important;
          color: white !important;
          border-color: white !important;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }
        .fox-btn-cta-outline:hover {
          background: hsla(0, 0%, 100%, 0.15) !important;
        }

        /* Shared styles (also in other path pages) */
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
        .journey-step {
          display: flex;
          gap: 2rem;
          margin-bottom: 2.5rem;
          position: relative;
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
          .fox-hero h1 { font-size: 2rem; }
          .fox-hero { padding: 4rem 1.5rem; }
          .fox-value-card { flex-direction: column; gap: 1rem; }
          .fox-cta-section { padding: 3.5rem 1.5rem; }
        }
      `}</style>
        </div>
    );
}
