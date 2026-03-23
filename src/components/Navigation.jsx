import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
          <img src="/logo.png" alt="Diment & Associates Logo" className="logo-img" />
          <span className="logo-text">Diment & Associates</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="nav-links desktop-only">
          <Link to="/sheldon" className="nav-link">Sheldon's Path (Chapter 13)</Link>
          <Link to="/hariette" className="nav-link">Hariette's Path (Chapter 7)</Link>
          <Link to="/family-law" className="nav-link">Family Law</Link>
          <Link to="/small-business" className="nav-link">Small Business</Link>
          <a
            href="https://outlook.office.com/book/DimentAssociatesAppointmentsPublicCopy@dimentfirm.com/?ismsaljsauthenabled"
            className="btn btn-nav-action"
            style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
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

      {/* Mobile Nav */}
      {isOpen && (
        <div className="mobile-nav animate-fade-in mobile-only">
          <Link to="/sheldon" onClick={() => setIsOpen(false)}>Sheldon's Path</Link>
          <Link to="/hariette" onClick={() => setIsOpen(false)}>Hariette's Path</Link>
          <Link to="/family-law" onClick={() => setIsOpen(false)}>Family Law</Link>
          <Link to="/small-business" onClick={() => setIsOpen(false)}>Small Business</Link>
        </div>
      )}

      <style>{`
        .nav-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: linear-gradient(to right, var(--color-turtle-green) 0%, var(--color-turtle-green) 48%, var(--color-hare-orange) 52%, var(--color-hare-orange) 100%);
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
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .nav-logo {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: 1.5rem;
          color: var(--color-text-main);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .logo-img {
          height: 36px;
          width: auto;
          object-fit: contain;
        }
        .nav-links {
          display: flex;
          align-items: center;
          gap: 2rem;
        }
        .nav-link {
          font-weight: 500;
          color: var(--color-text-main);
          position: relative;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--color-text-main);
          transition: width 0.3s ease;
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .mobile-only {
          display: none;
        }
        @media (max-width: 768px) {
          .desktop-only { display: none; }
          .mobile-only { display: block; }
          .mobile-toggle {
            background: none;
            border: none;
            cursor: pointer;
            color: var(--color-text-main);
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
            gap: 1rem;
            border-bottom: 1px solid var(--color-border);
            box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          }
          .mobile-nav a {
            padding: 0.5rem;
            font-weight: 500;
          }
        }
        
        .btn-nav-action {
          background-color: white;
          color: var(--color-text-main);
          border: 2px solid white;
        }
        .btn-nav-action:hover {
          background-color: transparent;
          color: white;
        }
      `}</style>
    </header>
  );
}
