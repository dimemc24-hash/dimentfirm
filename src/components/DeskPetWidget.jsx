import { useState, useEffect } from 'react';
import { Gift, X } from 'lucide-react';

export default function DeskPetWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setSubmitted(false);
    }, 4000);
  };

  useEffect(() => {
    const handleOpenModal = () => setIsOpen(true);
    window.addEventListener('open-desk-pet', handleOpenModal);
    return () => window.removeEventListener('open-desk-pet', handleOpenModal);
  }, []);

  return (
    <>
      {/* Floating Button */}
      <button
        className="floating-widget shadow-hover"
        onClick={() => setIsOpen(true)}
        aria-label="Request Free Desk Pet"
      >
        <div className="widget-icon">
          <Gift size={24} />
        </div>
        <span className="widget-text">Get a Free Desk Pet!</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="modal-overlay animate-fade-in">
          <div className="modal-content glass-card">
            <button className="modal-close" onClick={() => setIsOpen(false)}>
              <X size={24} />
            </button>

            {!submitted ? (
              <div className="modal-body">
                <h2>Free Fresh Start Desk Pet</h2>
                <p>We're sending free desk pets to Baton Rouge area residents!
                  Sign up to get a mystery box—you might get a Sheldon (Turtle), a Hariette (Hare), or another friend!</p>

                <div className="mascot-preview">
                  <div className="mascot-box">🐢</div>
                  <div className="mascot-box">?</div>
                  <div className="mascot-box">🐰</div>
                </div>

                <form onSubmit={handleSubmit} className="pet-form">
                  <div className="form-group">
                    <input type="text" placeholder="Your Name" required />
                  </div>
                  <div className="form-group">
                    <input type="email" placeholder="Email Address" required />
                  </div>
                  <div className="form-group">
                    <textarea placeholder="Mailing Address" rows="2" required></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    Request My Surprise Pet
                  </button>
                  <p className="form-note">By requesting a pet, you subscribe to our quarterly newsletter.</p>
                </form>
              </div>
            ) : (
              <div className="modal-body success-state">
                <div className="success-icon animate-bounce">🎁</div>
                <h2>Box is on the way!</h2>
                <p>Keep an eye on your mailbox for your mystery desk pet. Welcome to the journey!</p>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        .floating-widget {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          z-index: 50;
          background: var(--color-text-main);
          color: white;
          border: none;
          border-radius: var(--border-radius-full);
          padding: 0.5rem;
          padding-right: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          cursor: pointer;
          font-family: var(--font-heading);
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }
        .widget-icon {
          background: white;
          color: var(--color-text-main);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
          z-index: 200;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        .modal-content {
          background: white; /* Fallback */
          max-width: 500px;
          width: 100%;
          border-radius: var(--border-radius-lg);
          padding: 2.5rem;
          position: relative;
        }
        .modal-close {
          position: absolute;
          top: 1.5rem;
          right: 1.5rem;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-text-muted);
        }
        .modal-body h2 {
          margin-bottom: 1rem;
        }
        .modal-body p {
          color: var(--color-text-muted);
        }
        .mascot-preview {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin: 1.5rem 0;
        }
        .mascot-box {
          font-size: 2.5rem;
          width: 70px;
          height: 70px;
          background: var(--color-background);
          border: 2px dashed var(--color-border);
          border-radius: var(--border-radius);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pet-form .form-group {
          margin-bottom: 1rem;
        }
        .pet-form input, .pet-form textarea {
          width: 100%;
          padding: 0.875rem;
          border: 1px solid var(--color-border);
          border-radius: var(--border-radius);
          font-family: var(--font-body);
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s;
        }
        .pet-form input:focus, .pet-form textarea:focus {
          border-color: var(--color-text-main);
        }
        .form-note {
          font-size: 0.8rem;
          text-align: center;
          margin-top: 1rem;
          margin-bottom: 0;
        }
        .success-state {
          text-align: center;
          padding: 2rem 0;
        }
        .success-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-bounce {
          animation: bounce 2s infinite ease-in-out;
        }
        @media (max-width: 576px) {
          .floating-widget {
            bottom: 1rem;
            right: 1rem;
            padding: 0.5rem;
          }
          .widget-text {
            display: none;
          }
        }
      `}</style>
    </>
  );
}
