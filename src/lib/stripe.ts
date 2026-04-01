import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null> | null = null;

export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
    if (!key) {
      console.warn('Stripe publishable key not set — running in test mode');
      stripePromise = Promise.resolve(null);
    } else {
      stripePromise = loadStripe(key);
    }
  }
  return stripePromise;
}

export const PLAN = {
  name: 'Fresh Start Academy',
  price: 29,
  currency: 'usd',
  interval: 'month' as const,
  trialDays: 14,
};
