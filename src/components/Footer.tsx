import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer section">
      <div className="container footer-container">
        <div className="footer-col">
          <h3 className="footer-logo">Diment & Associates</h3>
          <p className="footer-desc">
            Full-service legal guidance for individuals, families, and small businesses across Baton Rouge and Louisiana.
          </p>
          <p className="footer-contact">
            <strong>Phone:</strong> 225-612-0765<br />
            <strong>Office:</strong> Baton Rouge
          </p>
        </div>

        <div className="footer-col">
          <h4>Practice Areas</h4>
          <ul>
            <li><Link to="/bankruptcy">Bankruptcy</Link></li>
            <li><Link to="/family-law">Family Law</Link></li>
            <li><Link to="/small-business">Small Business</Link></li>
            <li><Link to="/taxes">Taxes & Accounting</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Resources</h4>
          <ul>
            <li><Link to="/sheldon">Sheldon's Path (Chapter 13)</Link></li>
            <li><Link to="/hariette">Hariette's Path (Chapter 7)</Link></li>
            <li><Link to="/academy">Fresh Start Academy</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Join the Community</h4>
          <p style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>
            We've guided over 1200 clients. Get your free desk pet and start your journey!
          </p>
          <button
            onClick={() => {
              window.dispatchEvent(new Event('open-desk-pet'));
            }}
            className="btn btn-outline"
            style={{ fontSize: '0.9rem', width: '100%' }}
          >
            Request Desk Pet
          </button>
        </div>
      </div>

      <div className="container" style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)', textAlign: 'center', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
        <p>&copy; {new Date().getFullYear()} Diment & Associates. All rights reserved.</p>
      </div>

      <style>{`
        .footer {
          background-color: var(--color-background);
          border-top: 1px solid var(--color-border);
          margin-top: auto;
          color: var(--color-text-main);
        }
        .footer-container {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 3rem;
        }
        .footer-col h4 {
          margin-bottom: 1.5rem;
          font-size: 1.25rem;
        }
        .footer-logo {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }
        .footer-desc {
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
          color: var(--color-text-muted);
        }
        .footer-contact {
          font-size: 0.95rem;
        }
        .footer-col ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .footer-col ul a {
          color: var(--color-text-muted);
        }
        .footer-col ul a:hover {
          color: var(--color-text-main);
        }
        @media (max-width: 992px) {
          .footer-container {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 576px) {
          .footer-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </footer>
  );
}
