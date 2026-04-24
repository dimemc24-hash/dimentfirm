import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Quiz from '../components/Quiz';
import { Shield, FastForward } from 'lucide-react';

export default function Bankruptcy() {
  return (
    <>
    <Helmet>
      <title>Bankruptcy Attorney Baton Rouge | Chapter 7 & 13 | Diment & Associates</title>
      <meta name="description" content="Louisiana bankruptcy attorneys helping families since 2017. Stop foreclosure, repossession & wage garnishment. Chapter 7 fresh start or Chapter 13 structured plan. Free evaluation — 225-612-4848." />
      <link rel="canonical" href="https://dimentfirm.com/bankruptcy" />
      <meta property="og:title" content="Bankruptcy Attorney Baton Rouge | Chapter 7 & 13 | Diment & Associates" />
      <meta property="og:description" content="Stop creditor harassment, foreclosure, repossession, and garnishment. Louisiana bankruptcy attorneys since 2017. Free evaluation." />
      <meta property="og:url" content="https://dimentfirm.com/bankruptcy" />
    </Helmet>
    <div className="bankruptcy-page animate-fade-in">

      {/* Split Hero Section */}
      <section className="bk-hero-split">
        <div className="bk-hero-side bk-hero-sheldon">
          <div className="bk-hero-content">
            <div className="bk-hero-image-container bk-hero-image-sheldon">
              <img
                src="/firm/sheldon_tortoise_adorable_worker_1772080468357.png"
                alt="Sheldon the Tortoise — Chapter 13 Mascot"
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
                src="/firm/hariette_hare_final.png"
                alt="Hariette the Hare — Chapter 7 Mascot"
                className="bk-hero-mascot-img"
              />
            </div>
            <h1>Hariette's Path</h1>
            <p className="bk-hero-subline">The Quick Sprint &bull; Chapter 7</p>
            <p className="bk-hero-desc">
              Ready for a complete clean slate? Most debts eliminated in just 90-120 days.
              No strings, no payment plans. Just freedom. Fast.
            </p>
            <Link to="/hariette" className="btn btn-hare">Explore the Quick Sprint</Link>
          </div>
        </div>

        <div className="bk-hero-center-badge shadow-soft">
          Both lead to freedom.
        </div>
      </section>

      {/* Intro + Quiz Section */}
      <section className="section bg-white text-center">
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

      {/* Philosophy Section */}
      <section className="section bg-light" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="container">
          <div className="bk-philosophy-grid">
            <div className="bk-philosophy-text">
              <h2 style={{ marginBottom: '1.5rem' }}>We believe debt shouldn't dictate your future.</h2>
              <p>
                At Diment & Associates, we don't just file cases — we guide people on a journey to freedom.
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
        /* ===== Split Hero ===== */
        .bk-hero-split {
          display: flex;
          min-height: 80vh;
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
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          color: var(--color-text-main);
          padding: 1rem 2rem;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.25rem;
          border-radius: var(--border-radius-full);
          z-index: 10;
          white-space: nowrap;
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

        .bk-hero-image-hariette {
          background-color: transparent;
          border-color: transparent;
          box-shadow: none;
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
        }
      `}</style>
    </div>
    </>
  );
}
