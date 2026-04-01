import { useState, useCallback } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import {
  CreditCard, Calendar, Clock, Shield, ExternalLink,
  CheckCircle, AlertCircle, Loader2,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useSubscription } from '../../hooks/useSubscription'
import { CheckoutForm } from '../../components/billing/CheckoutForm'
import { getCustomerPortalUrl } from '../../lib/stripe-helpers'
import { getStripe, PLAN } from '../../lib/stripe'
import { cn } from '../../lib/cn'
import { useEffect } from 'react'
import type { Stripe } from '@stripe/stripe-js'

export default function Billing() {
  const { user } = useAuth()
  const {
    subscription,
    loading,
    isTrialing,
    isActive,
    isPastDue,
    isCanceled,
    trialDaysLeft,
  } = useSubscription(user?.id)

  const [portalLoading, setPortalLoading] = useState(false)
  const [showAddCard, setShowAddCard] = useState(false)
  const [stripeInstance, setStripeInstance] = useState<Stripe | null>(null)

  useEffect(() => {
    getStripe().then(s => setStripeInstance(s))
  }, [])

  const openCustomerPortal = useCallback(async () => {
    setPortalLoading(true)
    try {
      const url = await getCustomerPortalUrl()
      if (url) {
        window.location.href = url
      }
    } catch {
      // Portal not available
    } finally {
      setPortalLoading(false)
    }
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 text-fresh-blue animate-spin mb-3" />
        <p className="text-gray-500 text-sm">Loading billing info...</p>
      </div>
    )
  }

  // No subscription found — show setup flow
  if (!subscription) {
    return (
      <div className="max-w-lg mx-auto space-y-6 pb-16">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
          <p className="text-gray-500 mt-1">Start your subscription to access the full course.</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <PlanCard />

          <div className="mt-6">
            {stripeInstance ? (
              <Elements stripe={stripeInstance}>
                <CheckoutForm trialDays={PLAN.trialDays} />
              </Elements>
            ) : (
              <p className="text-center text-gray-400 text-sm py-8">Loading payment form...</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing & Subscription</h1>
        <p className="text-gray-500 mt-1">Manage your Fresh Start Academy subscription.</p>
      </div>

      {/* Subscription status card */}
      <div className={cn(
        'rounded-2xl border-2 p-6',
        isActive
          ? 'bg-emerald-50 border-emerald-200'
          : isPastDue
            ? 'bg-amber-50 border-amber-200'
            : 'bg-gray-50 border-gray-200',
      )}>
        <div className="flex items-start gap-3">
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
            isActive
              ? 'bg-emerald-100'
              : isPastDue
                ? 'bg-amber-100'
                : 'bg-gray-200',
          )}>
            {isActive ? (
              <CheckCircle className={cn('w-5 h-5', isTrialing ? 'text-blue-600' : 'text-emerald-600')} />
            ) : isPastDue ? (
              <AlertCircle className="w-5 h-5 text-amber-600" />
            ) : (
              <CreditCard className="w-5 h-5 text-gray-500" />
            )}
          </div>

          <div className="flex-1">
            <h2 className={cn(
              'font-bold',
              isActive ? 'text-emerald-800' : isPastDue ? 'text-amber-800' : 'text-gray-700',
            )}>
              {isTrialing
                ? 'Free Trial Active'
                : isActive
                  ? 'Subscription Active'
                  : isPastDue
                    ? 'Payment Past Due'
                    : isCanceled
                      ? 'Subscription Canceled'
                      : subscription.status}
            </h2>
            <p className={cn(
              'text-sm mt-0.5',
              isActive ? 'text-emerald-600' : isPastDue ? 'text-amber-600' : 'text-gray-500',
            )}>
              {isTrialing
                ? `${trialDaysLeft} day${trialDaysLeft !== 1 ? 's' : ''} remaining in your free trial`
                : isActive
                  ? 'Full access to all course content'
                  : isPastDue
                    ? 'Please update your payment method to continue'
                    : 'Your subscription has been canceled'}
            </p>
          </div>
        </div>
      </div>

      {/* Plan details */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-4">
        <h3 className="font-bold text-gray-900">Plan Details</h3>

        <PlanCard />

        {/* Billing dates */}
        <div className="space-y-3 pt-3 border-t border-gray-100">
          {isTrialing && subscription.trial_ends_at && (
            <DetailRow
              icon={<Clock className="w-4 h-4 text-blue-500" />}
              label="Trial ends"
              value={formatDate(subscription.trial_ends_at)}
            />
          )}

          {subscription.current_period_end && (
            <DetailRow
              icon={<Calendar className="w-4 h-4 text-gray-400" />}
              label="Next billing date"
              value={formatDate(subscription.current_period_end)}
            />
          )}

          {subscription.cancel_at && (
            <DetailRow
              icon={<AlertCircle className="w-4 h-4 text-amber-500" />}
              label="Cancels on"
              value={formatDate(subscription.cancel_at)}
            />
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-3">
        <h3 className="font-bold text-gray-900">Manage Subscription</h3>

        {/* Update card */}
        <button
          onClick={() => setShowAddCard(!showAddCard)}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-fresh-blue hover:bg-blue-50/50 transition-all text-left"
        >
          <CreditCard className="w-5 h-5 text-gray-400" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">Update Payment Method</p>
            <p className="text-xs text-gray-400">Change or update your card on file</p>
          </div>
        </button>

        {showAddCard && stripeInstance && (
          <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
            <Elements stripe={stripeInstance}>
              <CheckoutForm
                onComplete={() => setShowAddCard(false)}
                trialDays={0}
              />
            </Elements>
          </div>
        )}

        {/* Customer portal */}
        <button
          onClick={openCustomerPortal}
          disabled={portalLoading}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-fresh-blue hover:bg-blue-50/50 transition-all text-left"
        >
          <ExternalLink className="w-5 h-5 text-gray-400" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">
              {portalLoading ? 'Opening portal...' : 'Stripe Customer Portal'}
            </p>
            <p className="text-xs text-gray-400">Invoices, receipts, cancel subscription</p>
          </div>
          {portalLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
        </button>
      </div>

      {/* FAQ */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="font-bold text-gray-900 mb-4">Frequently Asked Questions</h3>

        <div className="space-y-4">
          <FaqItem
            q="What happens when my trial ends?"
            a={`Your card will be charged $${PLAN.price}/month automatically. You'll receive an email reminder before the first charge.`}
          />
          <FaqItem
            q="Can I cancel anytime?"
            a="Absolutely. Cancel anytime through the Stripe Customer Portal. You'll keep access through the end of your billing period."
          />
          <FaqItem
            q="Is my payment information secure?"
            a="Yes. All payments are processed through Stripe, a PCI Level 1 certified payment processor. We never see or store your card number."
          />
          <FaqItem
            q="What if I need a refund?"
            a="Contact our support team within 30 days of any charge for a full refund. No questions asked."
          />
        </div>
      </div>

      {/* Security footer */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
        <Shield className="w-3.5 h-3.5" />
        <span>Payments secured by Stripe</span>
      </div>
    </div>
  )
}

// ── Sub-components ───────────────────────────────────────────────────

function PlanCard() {
  return (
    <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
      <div>
        <p className="font-bold text-gray-900">{PLAN.name}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          Full access · 10 modules · 7 games · 38 badges
        </p>
      </div>
      <div className="text-right">
        <p className="text-2xl font-bold text-gray-900">
          ${PLAN.price}
          <span className="text-sm font-normal text-gray-400">/mo</span>
        </p>
        <p className="text-xs text-emerald-600 font-semibold">{PLAN.trialDays}-day free trial</p>
      </div>
    </div>
  )
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm text-gray-500">{label}</span>
      </div>
      <span className="text-sm font-semibold text-gray-700">{value}</span>
    </div>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div>
      <p className="text-sm font-semibold text-gray-700">{q}</p>
      <p className="text-sm text-gray-500 mt-0.5">{a}</p>
    </div>
  )
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}
