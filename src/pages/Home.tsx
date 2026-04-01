import { Link } from 'react-router-dom';
import Quiz from '../components/Quiz';
import { Shield, FastForward } from 'lucide-react';

export default function Home() {
  return (
    <div className="home-page animate-fade-in">

      {/* Hero Section */}
      <section className="hero-split">
        <div className="hero-side hero-sheldon theme-turtle">
          <div className="hero-content">
            <div className="hero-image-container">
              <img src="/firm/sheldon_tortoise_adorable_worker_1772080468357.png" alt="Sheldon the Tortoise Mascot" className="hero-mascot-img" />
            </div>
            <h1>Sheldon's Path</h1>
            <p className="hero-subline">The Steady Path • Chapter 13</p>
            <p className="hero-desc">Five years goes by faster than you think when you're fully protected. Keep your home, keep your car, and catch up at your own pace.</p>
            <Link to="/sheldon" className="btn btn-turtle">Explore the Steady Path</Link>
          </div>
        </div>

        <div className="hero-side hero-hariette theme-hare">
          <div className="hero-content">
            <div className="hero-image-container">
              <img src="/firm/hariette_hare_final.png" alt="Hariette the Hare Mascot" className="hero-mascot-img" />
            </div>
            <h1>Hariette's Path</h1>
            <p className="hero-subline">The Quick Sprint • Chapter 7</p>
            <p className="hero-desc">Ready for a complete clean slate? Most debts eliminated in just 90-120 days. No strings, no payment plans. Just freedom. Fast.</p>
            <Link to="/hariette" className="btn btn-hare">Explore the Quick Sprint</Link>
          </div>
        </div>

        <div className="hero-center-badge shadow-soft">
          Both lead to freedom.
        </div>
      </section>

      {/* Intro Section */}
      <section className="section bg-white text-center">
        <div className="container" style={{ maxWidth: '800px' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Are you a Sheldon or a Hariette?</h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', marginBottom: '3rem' }}>
            We're rewriting the classic fable. In bankruptcy, both the tortoise and the hare win.
            There's no failure, no shame—just a choice of how fast you want to cross the finish line based on your unique situation. Let's find out which path fits you best.
          </p>
        </div>

        <div className="container">
          <Quiz />
        </div>
      </section>

      {/* Financial Education Course CTA */}
      <section className="section bg-white text-center">
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 style={{ marginBottom: '1rem' }}>Fresh Start Academy</h2>
          <p style={{ fontSize: '1.125rem', color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
            Our free financial recovery course for clients post-discharge. 40 hours of guided lessons,
            interactive games, and practical tools to help you rebuild your financial life with confidence.
          </p>
          <a
            href="/academy"
            className="btn btn-turtle"
            style={{ display: 'inline-block', fontSize: '1.125rem', padding: '1rem 2.5rem' }}
          >
            Launch Financial Education Course
          </a>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: '1rem' }}>
            14-day free trial included for all clients
          </p>
        </div>
      </section>

      {/* Why Us / Philosophy Section */}
      <section className="section bg-light" style={{ backgroundColor: 'var(--color-background)' }}>
        <div className="container">
          <div className="philosophy-grid">
            <div className="philosophy-text">
              <h2 style={{ marginBottom: '1.5rem' }}>We believe debt shouldn't dictate your future.</h2>
              <p>
                At Diment & Associates, we don't just file cases—we guide people on a journey to freedom.
                Whether you need the protective armor of a structured plan to save a home you love, or the
                rapid acceleration of a fresh start, our Louisiana team is ready.
              </p>
              <ul className="philosophy-list">
                <li><Shield size={20} className="list-icon" /> Judgment-free environment</li>
                <li><FastForward size={20} className="list-icon" /> Clear, empathetic guidance</li>
                <li><img src="/firm/art turtle.png" alt="Tortoise" style={{ width: '24px', height: '24px', display: 'inline-block', verticalAlign: 'middle', marginRight: '8px' }} /> We celebrate your finish line!</li>
              </ul>
              <div style={{ marginTop: '2rem' }}>
                <p><strong>Join 1200+ Sheldons and Hariettes we've guided.</strong></p>
              </div>
            </div>
            <div className="philosophy-image shadow-soft">
              {/* Using a placeholder or the provided image if available */}
              <img src="/firm/watermarked-10bc01e4-3ff5-4e21-8099-ae406a35f2d9.jpg" alt="Diment Attorneys" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>

      <style>{`
        /* Hero Split */
        .hero-split {
          display: flex;
          min-height: 80vh;
          position: relative;
        }
        .hero-side {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          padding: 4rem 2rem;
          transition: all 0.5s ease;
          position: relative;
        }
        .hero-side:hover {
          flex: 1.1;
        }
        .hero-center-badge {
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
        .hero-content {
          max-width: 480px;
          text-align: center;
        }
        .hero-emoji {
          font-size: 5rem;
          display: block;
          margin-bottom: 1.5rem;
          filter: drop-shadow(0 10px 10px rgba(0,0,0,0.1));
        }
        .hero-subline {
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 1.125rem;
          margin-top: 0.5rem;
          margin-bottom: 1.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          opacity: 0.8;
        }
        .hero-desc {
          font-size: 1.125rem;
          margin-bottom: 2.5rem;
          opacity: 0.9;
        }
        .hero-image-container {
          width: 200px;
          height: 200px;
          margin: 0 auto 1.5rem;
          border-radius: 50%;
          overflow: hidden;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
          background-color: white;
          border: 4px solid rgba(255,255,255,0.5);
        }
        .hero-mascot-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .hero-hariette .hero-image-container {
          background-color: transparent;
          border-color: transparent;
          box-shadow: none;
        }
        
        /* Philosophy Section */
        .philosophy-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }
        .philosophy-text p {
          font-size: 1.125rem;
          color: var(--color-text-muted);
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
          font-size: 1.125rem;
        }
        .list-icon {
          color: var(--color-text-main);
        }
        .philosophy-image {
          border-radius: var(--border-radius-lg);
          overflow: hidden;
          height: 500px;
        }

        @media (max-width: 992px) {
          .hero-split {
            flex-direction: column;
          }
          .hero-side {
            min-height: 50vh;
          }
          .philosophy-grid {
            grid-template-columns: 1fr;
          }
          .philosophy-image {
            height: 400px;
            order: -1;
          }
        }
      `}</style>
    </div>
  );
}
