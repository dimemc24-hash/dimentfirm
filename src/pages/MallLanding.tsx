import { Phone, ShieldCheck, Home, CreditCard, ArrowRight, CheckCircle } from 'lucide-react';

const BOOKING_URL = 'https://outlook.office.com/book/DimentAssociatesAppointmentsPublicCopy@dimentfirm.com/?ismsaljsauthenabled';
const PHONE = '225-612-4848';

export default function MallLanding() {
    return (
        <div className="mall-landing animate-fade-in">

            {/* Hero Section */}
            <section className="mall-hero">
                <div className="mall-hero-inner">
                    <img
                        src="/firm/sheldon_tortoise_adorable_worker_1772080468357.png"
                        alt="Sheldon the Tortoise — your guide to a debt-free future"
                        className="mall-hero-mascot"
                    />
                    <h1 className="mall-hero-headline">
                        Stressed About Money?<br />
                        <span className="mall-hero-accent">Don't Hide In Your Shell!</span>
                    </h1>
                    <p className="mall-hero-sub">
                        Consolidated payments. Keep your house and car.<br />
                        One affordable monthly payment.
                    </p>
                    <div className="mall-hero-ctas">
                        <a href={BOOKING_URL} className="mall-btn mall-btn-primary" target="_blank" rel="noopener noreferrer">
                            Book Your FREE Consultation <ArrowRight size={20} />
                        </a>
                        <a href={`tel:${PHONE.replace(/-/g, '')}`} className="mall-btn mall-btn-phone">
                            <Phone size={20} /> {PHONE}
                        </a>
                    </div>
                </div>
            </section>

            {/* Benefits Strip */}
            <section className="mall-benefits">
                <div className="mall-container">
                    <div className="mall-benefits-grid">
                        <div className="mall-benefit">
                            <div className="mall-benefit-icon"><ShieldCheck size={32} /></div>
                            <h3>Stop Creditor Harassment</h3>
                            <p>Phone calls, letters, threats — they stop <strong>immediately</strong> once we file.</p>
                        </div>
                        <div className="mall-benefit">
                            <div className="mall-benefit-icon"><Home size={32} /></div>
                            <h3>Keep Your Home &amp; Car</h3>
                            <p>Protect the things that matter most to you and your family.</p>
                        </div>
                        <div className="mall-benefit">
                            <div className="mall-benefit-icon"><CreditCard size={32} /></div>
                            <h3>One Monthly Payment</h3>
                            <p>Replace juggling multiple bills with one manageable payment you can actually afford.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="mall-how">
                <div className="mall-container">
                    <h2 className="mall-section-title">How It Works</h2>
                    <div className="mall-steps">
                        <div className="mall-step">
                            <div className="mall-step-number">1</div>
                            <h3>Call or Book Online</h3>
                            <p>Free, no-judgment consultation. We listen to your situation and explain your options in plain English.</p>
                        </div>
                        <div className="mall-step-arrow"><ArrowRight size={24} /></div>
                        <div className="mall-step">
                            <div className="mall-step-number">2</div>
                            <h3>We Build Your Plan</h3>
                            <p>Sheldon's steady path to freedom — a personalized plan that protects your assets and fits your budget.</p>
                        </div>
                        <div className="mall-step-arrow"><ArrowRight size={24} /></div>
                        <div className="mall-step">
                            <div className="mall-step-number">3</div>
                            <h3>Debt Free</h3>
                            <p>Your fresh start begins. Creditors stop calling, your plan works for you, and freedom is on the horizon.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Section */}
            <section className="mall-trust">
                <div className="mall-container">
                    <div className="mall-trust-inner">
                        <div className="mall-trust-stat">
                            <span className="mall-trust-number">1,200+</span>
                            <span className="mall-trust-label">Families helped in Baton Rouge</span>
                        </div>
                        <blockquote className="mall-testimonial">
                            <p>"We were terrified of losing everything. Diment &amp; Associates helped us keep our home and our car. One phone call changed our lives."</p>
                            <footer>— The Robinsons, Baton Rouge</footer>
                        </blockquote>
                        <p className="mall-trust-message">
                            <CheckCircle size={20} /> Debt is a legal tool, not a moral failure.
                        </p>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="mall-final-cta">
                <div className="mall-container">
                    <h2>Your Debt-Free Future Starts With One Call</h2>
                    <p className="mall-final-sub">Free consultation. No obligation. No judgment.</p>
                    <div className="mall-hero-ctas">
                        <a href={BOOKING_URL} className="mall-btn mall-btn-primary" target="_blank" rel="noopener noreferrer">
                            Book Your FREE Consultation <ArrowRight size={20} />
                        </a>
                        <a href={`tel:${PHONE.replace(/-/g, '')}`} className="mall-btn mall-btn-phone-dark">
                            <Phone size={20} /> {PHONE}
                        </a>
                    </div>
                    <p className="mall-final-firm">
                        <strong>Diment &amp; Associates</strong> — Baton Rouge, Louisiana
                    </p>
                </div>
            </section>

            <style>{`
                /* ===== Mall Landing — Scoped Styles ===== */

                .mall-landing {
                    font-family: var(--font-body, 'Inter', sans-serif);
                    color: #1a1a1a;
                    overflow-x: hidden;
                }

                .mall-container {
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 0 1.5rem;
                }

                .mall-section-title {
                    font-family: var(--font-heading, 'Outfit', sans-serif);
                    text-align: center;
                    font-size: clamp(1.75rem, 4vw, 2.5rem);
                    margin-bottom: 3rem;
                    color: var(--color-turtle-shell, #5c4a1e);
                }

                /* ---------- Hero ---------- */
                .mall-hero {
                    background: linear-gradient(
                        135deg,
                        var(--color-turtle-green, hsl(152,60%,35%)) 0%,
                        hsl(152, 55%, 28%) 100%
                    );
                    color: white;
                    text-align: center;
                    padding: 4rem 1.5rem 3.5rem;
                }
                .mall-hero-inner {
                    max-width: 700px;
                    margin: 0 auto;
                }
                .mall-hero-mascot {
                    width: 160px;
                    height: auto;
                    margin-bottom: 1.5rem;
                    border-radius: 50%;
                    border: 4px solid rgba(255,255,255,0.3);
                    background: rgba(255,255,255,0.1);
                }
                .mall-hero-headline {
                    font-family: var(--font-heading, 'Outfit', sans-serif);
                    font-size: clamp(1.75rem, 5vw, 3rem);
                    line-height: 1.2;
                    margin-bottom: 1rem;
                    font-weight: 800;
                }
                .mall-hero-accent {
                    color: hsl(48, 90%, 70%);
                }
                .mall-hero-sub {
                    font-size: clamp(1rem, 2.5vw, 1.35rem);
                    opacity: 0.92;
                    line-height: 1.6;
                    margin-bottom: 2rem;
                }

                /* ---------- CTA Buttons ---------- */
                .mall-hero-ctas {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1rem;
                    justify-content: center;
                }
                .mall-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-family: var(--font-heading, 'Outfit', sans-serif);
                    font-weight: 700;
                    font-size: 1.1rem;
                    padding: 1rem 2rem;
                    border-radius: 60px;
                    text-decoration: none;
                    transition: transform 0.15s ease, box-shadow 0.15s ease;
                    cursor: pointer;
                    border: none;
                }
                .mall-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(0,0,0,0.2);
                }
                .mall-btn-primary {
                    background: hsl(48, 90%, 55%);
                    color: #1a1a1a;
                }
                .mall-btn-phone {
                    background: rgba(255,255,255,0.15);
                    color: white;
                    border: 2px solid rgba(255,255,255,0.5);
                }
                .mall-btn-phone:hover {
                    background: rgba(255,255,255,0.25);
                    color: white;
                }
                .mall-btn-phone-dark {
                    background: white;
                    color: var(--color-turtle-green, hsl(152,60%,35%));
                    border: 2px solid white;
                }
                .mall-btn-phone-dark:hover {
                    background: hsl(152, 50%, 95%);
                    color: var(--color-turtle-green, hsl(152,60%,35%));
                }

                /* ---------- Benefits Strip ---------- */
                .mall-benefits {
                    background: var(--color-turtle-green-light, hsl(152,50%,92%));
                    padding: 4rem 1.5rem;
                }
                .mall-benefits-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 2rem;
                    text-align: center;
                }
                .mall-benefit-icon {
                    width: 70px;
                    height: 70px;
                    border-radius: 50%;
                    background: var(--color-turtle-green, hsl(152,60%,35%));
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1rem;
                }
                .mall-benefit h3 {
                    font-family: var(--font-heading, 'Outfit', sans-serif);
                    font-size: 1.2rem;
                    margin-bottom: 0.5rem;
                    color: var(--color-turtle-shell, #5c4a1e);
                }
                .mall-benefit p {
                    color: #444;
                    font-size: 1rem;
                    line-height: 1.5;
                }

                /* ---------- How It Works ---------- */
                .mall-how {
                    background: white;
                    padding: 5rem 1.5rem;
                }
                .mall-steps {
                    display: flex;
                    align-items: flex-start;
                    justify-content: center;
                    gap: 1.5rem;
                }
                .mall-step {
                    flex: 1;
                    max-width: 280px;
                    text-align: center;
                }
                .mall-step-number {
                    width: 52px;
                    height: 52px;
                    border-radius: 50%;
                    background: var(--color-turtle-green, hsl(152,60%,35%));
                    color: white;
                    font-family: var(--font-heading, 'Outfit', sans-serif);
                    font-size: 1.5rem;
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1rem;
                }
                .mall-step h3 {
                    font-family: var(--font-heading, 'Outfit', sans-serif);
                    font-size: 1.15rem;
                    margin-bottom: 0.5rem;
                    color: var(--color-turtle-shell, #5c4a1e);
                }
                .mall-step p {
                    color: #555;
                    font-size: 0.95rem;
                    line-height: 1.5;
                }
                .mall-step-arrow {
                    color: var(--color-turtle-green, hsl(152,60%,35%));
                    padding-top: 0.8rem;
                    flex-shrink: 0;
                }

                /* ---------- Trust Section ---------- */
                .mall-trust {
                    background: var(--color-turtle-green-light, hsl(152,50%,92%));
                    padding: 5rem 1.5rem;
                }
                .mall-trust-inner {
                    text-align: center;
                    max-width: 700px;
                    margin: 0 auto;
                }
                .mall-trust-stat {
                    margin-bottom: 2.5rem;
                }
                .mall-trust-number {
                    display: block;
                    font-family: var(--font-heading, 'Outfit', sans-serif);
                    font-size: clamp(2.5rem, 6vw, 4rem);
                    font-weight: 800;
                    color: var(--color-turtle-green, hsl(152,60%,35%));
                    line-height: 1;
                }
                .mall-trust-label {
                    display: block;
                    font-size: 1.1rem;
                    color: #555;
                    margin-top: 0.5rem;
                }
                .mall-testimonial {
                    border: none;
                    margin: 0 0 2rem;
                    padding: 0;
                }
                .mall-testimonial p {
                    font-size: clamp(1.05rem, 2.5vw, 1.25rem);
                    font-style: italic;
                    color: #333;
                    line-height: 1.6;
                    margin-bottom: 0.75rem;
                }
                .mall-testimonial footer {
                    font-weight: 600;
                    color: var(--color-turtle-shell, #5c4a1e);
                    font-size: 1rem;
                }
                .mall-trust-message {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-size: 1.1rem;
                    font-weight: 600;
                    color: var(--color-turtle-green, hsl(152,60%,35%));
                    background: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 60px;
                }

                /* ---------- Final CTA ---------- */
                .mall-final-cta {
                    background: linear-gradient(
                        135deg,
                        var(--color-turtle-green, hsl(152,60%,35%)) 0%,
                        hsl(152, 55%, 28%) 100%
                    );
                    color: white;
                    text-align: center;
                    padding: 5rem 1.5rem;
                }
                .mall-final-cta h2 {
                    font-family: var(--font-heading, 'Outfit', sans-serif);
                    font-size: clamp(1.75rem, 4.5vw, 2.75rem);
                    font-weight: 800;
                    margin-bottom: 0.75rem;
                }
                .mall-final-sub {
                    font-size: 1.2rem;
                    opacity: 0.9;
                    margin-bottom: 2rem;
                }
                .mall-final-firm {
                    margin-top: 2rem;
                    opacity: 0.7;
                    font-size: 0.95rem;
                }

                /* ---------- Mobile Responsive ---------- */
                @media (max-width: 768px) {
                    .mall-benefits-grid {
                        grid-template-columns: 1fr;
                        gap: 2.5rem;
                    }
                    .mall-steps {
                        flex-direction: column;
                        align-items: center;
                    }
                    .mall-step {
                        max-width: 100%;
                    }
                    .mall-step-arrow {
                        transform: rotate(90deg);
                        padding: 0;
                    }
                    .mall-hero-mascot {
                        width: 120px;
                    }
                    .mall-btn {
                        width: 100%;
                        justify-content: center;
                        font-size: 1rem;
                        padding: 0.9rem 1.5rem;
                    }
                }
            `}</style>
        </div>
    );
}
