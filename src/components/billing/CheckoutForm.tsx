import { useState } from 'react'
import {
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { CreditCard, Shield, CheckCircle, Loader2 } from 'lucide-react'
import { startSubscription } from '../../lib/stripe-helpers'
import { PLAN } from '../../lib/stripe'
import { cn } from '../../lib/cn'

interface CheckoutFormProps {
  onComplete?: () => void
  onError?: (message: string) => void
  trialDays?: number
}

export function CheckoutForm({ onComplete, onError, trialDays = 14 }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()

  const [processing, setProcessing] = useState(false)
  const [succeeded, setSucceeded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements) return

    setProcessing(true)
    setError(null)

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setError("Card element not found. Please refresh and try again.")
      setProcessing(false)
      return
    }

    // Turn the card into a PaymentMethod
    const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
    })

    if (stripeError) {
      setError(stripeError.message ?? 'Something went wrong with your card. Please try again.')
      setProcessing(false)
      onError?.(stripeError.message ?? 'Card error')
      return
    }

    // Tell our server to create the customer + trial subscription with this payment method
    const result = await startSubscription({ paymentMethodId: paymentMethod.id, trialDays })
    if (result) {
      setSucceeded(true)
      onComplete?.()
    } else {
      setError("Card saved, but we couldn't start your subscription. Please contact support.")
      setProcessing(false)
    }
  }

  if (succeeded) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">You're all set!</h3>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          Your {trialDays}-day free trial has started. You won't be charged until{' '}
          <strong>{getTrialEndDate(trialDays)}</strong>. Enjoy the course!
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Trial messaging */}
      <div className="bg-emerald-50 border-2 border-emerald-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-emerald-800">
              {trialDays}-Day Free Trial — No charge today
            </p>
            <p className="text-xs text-emerald-600 mt-1">
              We collect your card to start the trial. You can cancel anytime before{' '}
              <strong>{getTrialEndDate(trialDays)}</strong> and pay nothing.
              After the trial, it's ${PLAN.price}/month.
            </p>
          </div>
        </div>
      </div>

      {/* Card element */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <CreditCard className="w-4 h-4 inline mr-1.5 -mt-0.5" />
          Card Details
        </label>
        <div className="border-2 border-gray-200 rounded-xl p-4 bg-white focus-within:border-fresh-blue focus-within:ring-2 focus-within:ring-blue-100 transition-all">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#1f2937',
                  fontFamily: 'Inter, system-ui, sans-serif',
                  '::placeholder': { color: '#9ca3af' },
                },
                invalid: { color: '#dc2626' },
              },
              hidePostalCode: false,
            }}
            onChange={e => {
              setCardComplete(e.complete)
              if (e.error) setError(e.error.message)
              else setError(null)
            }}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={!stripe || !cardComplete || processing}
        className={cn(
          'w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2',
          cardComplete && !processing
            ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed',
        )}
      >
        {processing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            Start {trialDays}-Day Free Trial
          </>
        )}
      </button>

      {/* Security note */}
      <p className="text-center text-xs text-gray-400 flex items-center justify-center gap-1">
        <Shield className="w-3 h-3" />
        Secured by Stripe. We never see your card number.
      </p>
    </form>
  )
}

function getTrialEndDate(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}
