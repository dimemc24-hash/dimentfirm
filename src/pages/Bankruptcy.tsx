import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Quiz from '../components/Quiz';
import TrajectoryComparator from '../components/TrajectoryComparator';
import { Shield, FastForward, CreditCard, Unlock, Car, Home as HomeIcon } from 'lucide-react';
import { useEffect } from 'react';
import { trackPageView } from '../lib/track';

export default function Bankruptcy() {
  useEffect(() => { trackPageView('bankruptcy', '/bankruptcy') }, [])
  return (
    <>
    <Helmet>
      <title>Bankruptcy Attorney Baton Rouge | Chapter 7 & 13 | Diment & Associates</title>
      <meta name="description" content="Louisiana bankruptcy attorneys helping families since 2017. Stop foreclosure, repossession & wage garnishment. Chapter 7 fresh start or Chapter 13 structured plan. Free evaluation — 225-612-4404." />
      <link rel="canonical" href="https://dimentfirm.com/bankruptcy" />
      <meta property="og:title" content="Bankruptcy Attorney Baton Rouge | Chapter 7 & 13 | Diment & Associates" />
      <meta property="og:description" content="Stop creditor harassment, foreclosure, repossession, and garnishment. Louisiana bankruptcy attorneys since 2017. Free evaluation." />
      <meta property="og:url" content="https://dimentfirm.com/bankruptcy" />
    </Helmet>
    <div className="bankruptcy-page animate-fade-in">

      {/* Freedom Hero */}
      <section className="bk-freedom-hero">
        <img
          src="/firm/discharged-from-debt-centerpiece.jpg"
          alt="A woman stands with arms outstretched on a mountaintop at sunrise, a locked bag of old paperwork left behind her"
          className="bk-freedom-hero__img"
        />
        <div className="bk-freedom-hero__scrim" />
        <div className="container bk-freedom-hero__content">
          <p className="bk-freedom-hero__eyebrow">There is a door out of this.</p>
          <h1 className="bk-freedom-hero__headline">
            The other side of debt is closer than you think.
          </h1>
          <p className="bk-freedom-hero__sub">
            Bankruptcy isn't the end of the road — it's usually the fastest one. What's chained to you now
            can be locked in a box behind you, while you walk into a future with nothing holding you back.
          </p>
          <div className="bk-freedom-hero__cta-row">
            <a href="#trajectory" className="btn btn-white-cta">See what your future can look like</a>
          </div>
        </div>
      </section>

      {/* Split Hero: choose your path */}
      <section className="bk-hero-split">
        <div className="bk-hero-side bk-hero-sheldon">
          <div className="bk-hero-content">
            <div className="bk-hero-image-container bk-hero-image-sheldon">
              <img
                src="/mascots/sheldon/sheldon-post.png"
                alt="Sheldon the Tortoise, calm and walking forward at a steady pace — Chapter 13 Mascot"
                className="bk-hero-mascot-img"
              />
            </div>
            <h1>Sheldon's Path</h1>
            <p className="bk-hero-subline">The Steady Path &bull; Chapter 13</p>
            <p className="bk-hero-desc">
              Five years goes by faster than you think when you're fully protected.
              Keep your home, keep your car, and catch up at your own pace.
            </p>
            <Link to="/sheldon" className="btn btn-turtle">Explore the Steady Path</Link>
          </div>
        </div>

        <div className="bk-hero-side bk-hero-hariette">
          <div className="bk-hero-content">
            <div className="bk-hero-image-container bk-hero-image-hariette">
              <img
                src="/mascots/hariette/hariette-post.png"
                alt="Hariette the Hare, striding forward with purpose and confidence — Chapter 7 Mascot"
                className="bk-hero-mascot-img"
              />
            </div>
            <h1>Hariette's Path</h1>
            <p className="bk-hero-subline">The Quick Sprint &bull; Chapter 7</p>
            <p className="bk-hero-desc">
              Ready for a complete clean slate? Most debts are eliminated in as little as 90-120 days.
              No strings, no payment plans. Just freedom. Fast.
            </p>
            <Link to="/hariette" className="btn btn-hare">Explore the Quick Sprint</Link>
          </div>
        </div>

        <div className="bk-hero-center-badge shadow-soft">
          Both lead to freedom.
        </div>
      </section>

      {/* Freedom Stats */}
      <section className="section bg-white">
        <div className="container" style={{ maxWidth: '1000px' }}>
          <h2 className="text-center" style={{ marginBottom: '0.75rem' }}>What's actually on the other side</h2>
          <p className="text-center" style={{ color: 'var(--color-text-muted)', fontSize: '1.125rem', marginBottom: '3rem', maxWidth: '700px', marginLeft: 'auto', marginRight: 'auto' }}>
            Not scare tactics — just the real math on where you are now, and how much sooner the other side
            can arrive than most people expect.
          </p>
          <div className="bk-stats-grid">
            <div className="bk-stat-card shadow-hover">
              <div className="bk-stat-icon"><CreditCard size={28} /></div>
              <h3>Years of minimum payments → a fixed finish line</h3>
              <p>
                The average carried credit card balance sits around $10,479 at today's average rate of roughly 22%.
                On minimum payments alone, that can take 15-20+ years to clear. A Chapter 13 plan resolves the same
                debt in 3-5 years — Chapter 7 can discharge it outright.
              </p>
            </div>
            <div className="bk-stat-card shadow-hover">
              <div className="bk-stat-icon"><Unlock size={28} /></div>
              <h3>Break the renewal cycle for good</h3>
              <p>
                Payday loans often carry APRs near 400%; title loans average around 300%. Bankruptcy stops the
                cycle of renewing these loans and discharges what's left — the money that used to go to fees
                becomes money that builds savings instead.
              </p>
            </div>
            <div className="bk-stat-card shadow-hover">
              <div className="bk-stat-icon"><Car size={28} /></div>
              <h3>Back in the driver's seat in months</h3>
              <p>
                Most clients are financeable for a car again within about 6 months of filing, with terms improving
                steadily from there as on-time payments rebuild credit.
              </p>
            </div>
            <div className="bk-stat-card shadow-hover">
              <div className="bk-stat-icon"><HomeIcon size={28} /></div>
              <h3>A mortgage sooner than you'd think</h3>
              <p>
                Chapter 13 filers can often qualify for an FHA mortgage after just 12 months of on-time plan
                payments — while still in the plan. Chapter 7 filers are typically eligible again in about 24
                months, sometimes sooner with documented circumstances.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trajectory Comparator */}
      <section id="trajectory" className="section text-center" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Your Current Path vs. Your Path After Bankruptcy</h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', marginBottom: '3rem' }}>
            Before Chapter 7 or Chapter 13 — an honest look at when you'd likely qualify for a car or a home,
            with or without filing. No pressure, no chapter recommendation here, just the comparison.
          </p>
        </div>
        <div className="container">
          <TrajectoryComparator />
        </div>
      </section>

      {/* Intro + Quiz Section */}
      <section id="chapter-quiz" className="section bg-white text-center">
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Are you a Sheldon or a Hariette?</h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', marginBottom: '3rem' }}>
            We're rewriting the classic fable. In bankruptcy, both the tortoise and the hare win.
            There's no failure, no shame — just a choice of how fast you want to cross the finish line
            based on your unique situation. Let's find out which path fits you best.
          </p>
        </div>

        <div className="container">
          <Quiz />
        </div>
      </section>

      {/* Fresh Start Academy CTA */}
      <section className="bk-academy-cta section text-center">
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 style={{ marginBottom: '1rem' }}>Fresh Start Academy</h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
            Our free financial recovery course for clients post-discharge. 40 hours of guided lessons,
            interactive games, and practical tools to help you rebuild your financial life with confidence.
          </p>
          <Link
            to="/academy"
            className="btn btn-turtle"
            style={{ display: 'inline-block', fontSize: '1.125rem', padding: '1rem 2.5rem' }}
          >
            Launch Financial Education Course
          </Link>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '1rem' }}>
            14-day free trial included for all clients
          </p>
        </div>
      </section>

      {/* Related Guides */}
      <section className="section bg-white">
        <div className="container" style={{ maxWidth: '860px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '0.75rem' }}>Related Guides</h2>
          <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginBottom: '2.5rem', fontSize: '1rem' }}>
            Learn more about how bankruptcy addresses your specific situation.
          </p>
          <div className="bk-guides-list">
            <Link to="/blog/chapter-7-vs-chapter-13" className="bk-guide-card">
              <span className="bk-guide-title">Chapter 7 vs. Chapter 13: Which Is Right for You?</span>
              <span className="bk-guide-arrow">→</span>
            </Link>
            <Link to="/blog/stop-foreclosure-louisiana" className="bk-guide-card">
              <span className="bk-guide-title">How to Stop Foreclosure in Louisiana with Bankruptcy</span>
              <span className="bk-guide-arrow">→</span>
            </Link>
            <Link to="/blog/stop-wage-garnishment-louisiana" className="bk-guide-card">
              <span className="bk-guide-title">How Bankruptcy Stops Wage Garnishment in Louisiana</span>
              <span className="bk-guide-arrow">→</span>
            </Link>
            <Link to="/blog/stop-repossession-louisiana" className="bk-guide-card">
              <span className="bk-guide-title">Can Bankruptcy Stop a Vehicle Repossession in Louisiana?</span>
              <span className="bk-guide-arrow">→</span>
            </Link>
            <Link to="/blog/debt-settlement-vs-bankruptcy" className="bk-guide-card">
              <span className="bk-guide-title">Debt Settlement vs. Bankruptcy: What Settlement Companies Won't Tell You</span>
              <span className="bk-guide-arrow">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="section bg-light" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="container">
          <div className="bk-philosophy-grid">
            <div className="bk-philosophy-text">
              <h2 style={{ marginBottom: '1.5rem' }}>We believe debt shouldn't dictate your future.</h2>
              <p>
                At Diment & Associates, we don't just file cases — we guide people through a door to freedom.
                Whether you need the protective armor of a structured plan to save a home you love, or the
                rapid acceleration of a fresh start, our Louisiana team is ready.
              </p>
              <ul className="bk-philosophy-list">
                <li>
                  <Shield size={20} className="bk-list-icon" />
                  Judgment-free environment
                </li>
                <li>
                  <FastForward size={20} className="bk-list-icon" />
                  Clear, empathetic guidance
                </li>
                <li>
                  <img
                    src="/firm/art turtle.png"
                    alt="Tortoise"
                    style={{ width: '24px', height: '24px', display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }}
                  />
                  We celebrate your finish line!
                </li>
              </ul>
              <div style={{ marginTop: '2rem' }}>
                <p><strong>Join 1200+ Sheldons and Hariettes we've guided.</strong></p>
              </div>
            </div>
            <div className="bk-philosophy-image shadow-soft">
              <img
                src="/firm/watermarked-10bc01e4-3ff5-4e21-8099-ae406a35f2d9.jpg"
                alt="Diment Attorneys"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      <style>{`
        /* ===== Freedom Hero ===== */
        .bk-freedom-hero {
          position: relative;
          min-height: 90vh;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .bk-freedom-hero__img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 30%;
        }
        .bk-freedom-hero__scrim {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(20,30,25,0.35) 0%, rgba(20,30,25,0.15) 40%, rgba(15,25,20,0.65) 100%);
        }
        .bk-freedom-hero__content {
          position: relative;
          z-index: 2;
          max-width: 700px;
          color: #fff;
        }
        .bk-freedom-hero__eyebrow {
          font-family: var(--font-heading);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-size: 0.9rem;
          opacity: 0.9;
          margin-bottom: 1rem;
        }
        .bk-freedom-hero__headline {
          font-size: 3rem;
          line-height: 1.15;
          margin-bottom: 1.5rem;
          color: #fff;
        }
        .bk-freedom-hero__sub {
          font-size: 1.25rem;
          line-height: 1.6;
          opacity: 0.95;
          margin-bottom: 2.5rem;
        }
        .bk-freedom-hero__cta-row {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        /* ===== Freedom Stats ===== */
        .bk-stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }
        .bk-stat-card {
          background: white;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius-lg);
          padding: 2rem;
        }
        .bk-stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: var(--color-turtle-green-light);
          color: var(--color-turtle-shell);
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1.25rem;
        }
        .bk-stat-card h3 {
          font-size: 1.15rem;
          margin-bottom: 0.75rem;
        }
        .bk-stat-card p {
          color: var(--color-text-muted);
          font-size: 0.95rem;
          line-height: 1.6;
          margin: 0;
        }

        /* ===== Related Guides ===== */
        .bk-guides-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .bk-guide-card {
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
        .bk-guide-card:hover {
          border-color: var(--color-turtle-green);
          box-shadow: 0 2px 12px rgba(0,0,0,0.07);
          color: var(--color-text-main);
        }
        .bk-guide-title {
          font-size: 0.95rem;
          font-weight: 500;
        }
        .bk-guide-arrow {
          color: var(--color-turtle-green);
          font-weight: 700;
          flex-shrink: 0;
          margin-left: 1rem;
        }

        /* ===== Split Hero ===== */
        .bk-hero-split {
          display: flex;
          min-height: 70vh;
          position: relative;
        }

        .bk-hero-side {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 4rem 2rem;
          transition: flex 0.5s ease;
          position: relative;
        }

        .bk-hero-side:hover {
          flex: 1.1;
        }

        .bk-hero-sheldon {
          background: linear-gradient(
            135deg,
            var(--color-turtle-green-light) 0%,
            var(--color-turtle-green) 100%
          );
          color: #fff;
        }

        .bk-hero-hariette {
          background: linear-gradient(
            135deg,
            var(--color-hare-orange-light) 0%,
            var(--color-hare-orange) 100%
          );
          color: #fff;
        }

        .bk-hero-center-badge {
          position: absolute;
          top: 1.5rem;
          left: 50%;
          transform: translateX(-50%);
          background: white;
          color: var(--color-text-main);
          padding: 1rem 2rem;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.25rem;
          border-radius: var(--border-radius-full);
          z-index: 10;
          white-space: nowrap;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
        }

        .bk-hero-content {
          max-width: 480px;
          text-align: center;
        }

        .bk-hero-image-container {
          width: 200px;
          height: 200px;
          margin: 0 auto 1.5rem;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
          background-color: white;
          border: 4px solid rgba(255, 255, 255, 0.5);
        }

        .bk-hero-mascot-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .bk-hero-subline {
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 1.125rem;
          margin-top: 0.5rem;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          opacity: 0.85;
        }

        .bk-hero-desc {
          font-size: 1.125rem;
          margin-bottom: 2.5rem;
          opacity: 0.9;
          line-height: 1.6;
        }

        /* ===== Academy CTA ===== */
        .bk-academy-cta {
          background: linear-gradient(
            180deg,
            #fff 0%,
            var(--color-turtle-green-light) 100%
          );
        }

        /* ===== Philosophy ===== */
        .bk-philosophy-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .bk-philosophy-text p {
          font-size: 1.125rem;
          color: var(--color-text-muted);
          line-height: 1.7;
        }

        .bk-philosophy-list {
          list-style: none;
          margin-top: 1.5rem;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .bk-philosophy-list li {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-weight: 500;
          font-size: 1.125rem;
        }

        .bk-list-icon {
          color: var(--color-text-main);
          flex-shrink: 0;
        }

        .bk-philosophy-image {
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          height: 500px;
        }

        /* ===== Responsive ===== */
        @media (max-width: 992px) {
          .bk-hero-split {
            flex-direction: column;
          }

          .bk-hero-side {
            min-height: 50vh;
          }

          .bk-hero-side:hover {
            flex: 1;
          }

          .bk-hero-center-badge {
            top: auto;
            bottom: calc(50% - 1.25rem);
            font-size: 1rem;
            padding: 0.75rem 1.5rem;
          }

          .bk-philosophy-grid {
            grid-template-columns: 1fr;
          }

          .bk-philosophy-image {
            height: 400px;
            order: -1;
          }

          .bk-stats-grid {
            grid-template-columns: 1fr;
          }

          .bk-freedom-hero__headline {
            font-size: 2.25rem;
          }
        }

        @media (max-width: 600px) {
          .bk-hero-side {
            padding: 3rem 1.25rem;
          }

          .bk-hero-image-container {
            width: 150px;
            height: 150px;
          }

          .bk-hero-content h1 {
            font-size: 1.5rem;
          }

          .bk-hero-desc {
            font-size: 1rem;
          }

          .bk-hero-center-badge {
            font-size: 0.875rem;
            padding: 0.625rem 1.25rem;
          }

          .bk-philosophy-image {
            height: 300px;
          }

          .bk-freedom-hero {
            min-height: 70vh;
          }

          .bk-freedom-hero__headline {
            font-size: 1.75rem;
          }

          .bk-freedom-hero__sub {
            font-size: 1.05rem;
          }
        }
      `}</style>
    </div>
    </>
  );
}
