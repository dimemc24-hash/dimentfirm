import { Link } from 'react-router-dom';
import { Hammer } from 'lucide-react';

export default function UnderConstruction({ title }) {
    return (
        <div className="section animate-fade-in" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="container text-center">
                <div style={{ fontSize: '4rem', color: 'var(--color-text-muted)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                    <Hammer size={64} />
                </div>
                <h1 style={{ marginBottom: '1rem' }}>{title}</h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--color-text-muted)', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                    We're currently updating our {title} experience to serve you better.
                    Please check back soon, or contact our office for immediate assistance.
                </p>
                <Link to="/" className="btn btn-primary">Return to Homepage</Link>
            </div>
        </div>
    );
}
