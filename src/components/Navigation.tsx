import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { trackConsultationClick } from '../lib/track';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`nav-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          <img src="/logo.png" alt="Diment & Associates Logo" className="logo-img" style={{ height: '36px', width: 'auto' }} />
          <span className="logo-text">Diment & Associates</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="nav-links desktop-only">
          <Link to="/bankruptcy" className="nav-link">Bankruptcy</Link>
          <Link to="/family-law" className="nav-link">Family Law</Link>
          <Link to="/small-business" className="nav-link">Small Business</Link>
          <Link to="/taxes" className="nav-link">Taxes</Link>
          <Link to="/blog" className="nav-link">Resources</Link>
          <Link to="/academy" className="nav-link">Academy</Link>
          <a
            href="https://newchapter-production.up.railway.app/"
            className="btn btn-nav-login"
          >
            Login
          </a>
          <a
            href="https://outlook.office.com/book/DimentAssociatesAppointmentsPublicCopy@dimentfirm.com/?ismsaljsauthenabled"
            className="btn btn-nav-action"
            onClick={() => trackConsultationClick(location.pathname)}
          >
            Free Consultation
          </a>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="mobile-toggle mobile-only"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* UPDATE Bar */}
      <div className="update-bar">
        <strong>UPDATE:</strong> Due to rising costs, our team works from home on Wednesdays &amp; Fridays — the office is available <strong>by appointment only</strong> those days. Walk-ins are welcome <strong>Monday, Tuesday &amp; Thursday</strong>.
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="mobile-nav animate-fade-in mobile-only">
          <Link to="/bankruptcy" onClick={() => setIsOpen(false)}>Bankruptcy</Link>
          <Link to="/family-law" onClick={() => setIsOpen(false)}>Family Law</Link>
          <Link to="/small-business" onClick={() => setIsOpen(false)}>Small Business</Link>
          <Link to="/taxes" onClick={() => setIsOpen(false)}>Taxes & Accounting</Link>
          <Link to="/blog" onClick={() => setIsOpen(false)}>Resources &amp; Guides</Link>
          <Link to="/academy" onClick={() => setIsOpen(false)}>Fresh Start Academy</Link>
          <a
            href="https://newchapter-production.up.railway.app/"
            style={{ fontWeight: 600 }}
            onClick={() => setIsOpen(false)}
          >
            Login
          </a>
        </div>
      )}

      <style>{`
        .nav-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: linear-gradient(135deg, var(--color-turtle-green) 0%, #2d6a4f 60%, hsl(210, 25%, 30%) 100%);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid transparent;
          transition: all 0.3s ease;
          padding: 1rem 0;
        }
        .nav-header.scrolled {
          padding: 0.5rem 0;
          border-bottom: 1px solid var(--color-border);
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1.5rem;
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .nav-logo {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.5rem;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          text-decoration: none;
          flex-shrink: 0;
          margin-right: auto;
        }
        .logo-img {
          height: 36px !important;
          width: auto !important;
          object-fit: contain;
        }
        .logo-text {
          white-space: nowrap;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          font-size: 0.9rem;
          flex-shrink: 0;
        }
        .nav-header .nav-link {
          font-weight: 500;
          color: #fff;
          position: relative;
          text-align: center;
          line-height: 1.3;
        }
        .nav-header .nav-link:hover {
          color: rgba(255, 255, 255, 0.8);
        }
        .nav-header .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: #fff;
          transition: width 0.3s ease;
        }
        .nav-header .nav-link:hover::after {
          width: 100%;
        }
        .update-bar {
          background: rgba(0, 0, 0, 0.25);
          color: rgba(255, 255, 255, 0.92);
          font-size: 0.78rem;
          text-align: center;
          padding: 0.4rem 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.15);
        }
        .update-bar strong {
          color: #fff;
        }
        .mobile-only {
          display: none;
        }
        @media (max-width: 1024px) {
          .desktop-only { display: none; }
          .mobile-only { display: block; }
          .nav-header {
            padding: 0.5rem 0;
          }
          .nav-container {
            padding: 0 1rem;
          }
          .nav-logo {
            font-size: 1.1rem;
            gap: 0.5rem;
          }
          .logo-img {
            height: 28px !important;
          }
          .mobile-toggle {
            background: none;
            border: none;
            cursor: pointer;
            color: #fff;
            padding: 0.5rem;
          }
          .mobile-nav {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: white;
            padding: 1rem;
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            border-bottom: 1px solid var(--color-border);
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          }
          .mobile-nav a {
            padding: 0.75rem 1rem;
            font-weight: 500;
            border-radius: 8px;
          }
          .mobile-nav a:active {
            background: var(--color-turtle-green-light);
          }
        }
        
        .btn-nav-login {
          background-color: transparent;
          color: rgba(255, 255, 255, 0.9);
          border: 2px solid rgba(255, 255, 255, 0.6);
          padding: 0.5rem 1.1rem;
          border-radius: 9999px;
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.85rem;
          white-space: nowrap;
          transition: all 0.2s ease;
        }
        .btn-nav-login:hover {
          background-color: rgba(255, 255, 255, 0.15);
          border-color: white;
          color: white;
        }
        .btn-nav-action {
          background-color: white;
          color: var(--color-text-main);
          border: 2px solid white;
          padding: 0.5rem 1.25rem;
          border-radius: 9999px;
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: 0.85rem;
          white-space: nowrap;
          margin-left: 0.5rem;
          transition: all 0.2s ease;
        }
        .btn-nav-action:hover {
          background-color: transparent;
          color: white;
        }
      `}</style>
    </header>
  );
}
