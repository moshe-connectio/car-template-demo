/**
 * Multi-Payment Form Component
 * Supports multiple payment methods: Card, PayPal, Apple Pay, Google Pay, Bit
 */

'use client';

import { useState, FormEvent } from 'react';
import {
  useStripe,
  useElements,
  CardElement,
  PaymentElement,
} from '@stripe/react-stripe-js';
import { FaLock, FaCheckCircle } from 'react-icons/fa';
import { PaymentMethodSelector, PaymentMethod } from './PaymentMethodSelector';

interface MultiPaymentFormProps {
  amount: number;
  currency?: string;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  availableMethods?: PaymentMethod[];
}

// Custom styling for Stripe Card Element
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#1f2937',
      fontFamily: 'Assistant, -apple-system, BlinkMacSystemFont, sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      '::placeholder': {
        color: '#9ca3af',
      },
      iconColor: '#6b7280',
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
  hidePostalCode: true,
};

export function MultiPaymentForm({
  amount,
  currency = 'ILS',
  onSuccess,
  onError,
  customerInfo,
  availableMethods = ['card', 'paypal', 'apple_pay', 'google_pay'],
}: MultiPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (selectedMethod === 'card' && !cardComplete) {
      setError('אנא מלא את פרטי הכרטיס');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create Payment Intent with specific payment method
      const response = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          currency: currency.toLowerCase(),
          paymentMethod: selectedMethod,
          metadata: {
            customer_name: customerInfo?.name,
            customer_email: customerInfo?.email,
            customer_phone: customerInfo?.phone,
            payment_method: selectedMethod,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // Handle different payment methods
      let result;

      switch (selectedMethod) {
        case 'card':
          const cardElement = elements.getElement(CardElement);
          if (!cardElement) throw new Error('Card element not found');

          result = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: customerInfo?.name,
                email: customerInfo?.email,
                phone: customerInfo?.phone,
              },
            },
          });
          break;

        case 'paypal':
          // PayPal through Stripe
          result = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
              return_url: `${window.location.origin}/checkout/success`,
              payment_method_data: {
                billing_details: {
                  name: customerInfo?.name,
                  email: customerInfo?.email,
                },
              },
            },
          });
          break;

        case 'apple_pay':
        case 'google_pay':
          // These are handled automatically by Stripe Payment Element
          const paymentElement = elements.getElement('payment');
          if (!paymentElement) {
            throw new Error('Payment element not found');
          }

          result = await stripe.confirmPayment({
            elements,
            clientSecret,
            confirmParams: {
              return_url: `${window.location.origin}/checkout/success`,
            },
          });
          break;

        case 'bit':
          // Bit payment - redirect to Bit app/website
          alert('תשלום דרך Bit יפתח בהמשך - כרגע בפיתוח');
          setLoading(false);
          return;

        default:
          throw new Error('Unsupported payment method');
      }

      if (result.error) {
        throw new Error(result.error.message || 'תשלום נכשל');
      }

      // Success!
      setSucceeded(true);
      onSuccess?.(result.paymentIntent?.id || '');
    } catch (err: any) {
      const errorMessage = err.message || 'אירעה שגיאה בעיבוד התשלום';
      setError(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (succeeded) {
    return (
      <div className="text-center py-8">
        <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          התשלום בוצע בהצלחה!
        </h3>
        <p className="text-gray-600">תודה על הרכישה. תקבל אישור במייל בקרוב.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Amount Display */}
      <div className="bg-linear-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <span className="text-gray-700 font-medium">סכום לתשלום:</span>
          <span className="text-2xl font-bold text-blue-700">
            ₪{amount.toLocaleString('he-IL', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Payment Method Selector */}
      <PaymentMethodSelector
        selectedMethod={selectedMethod}
        onMethodChange={setSelectedMethod}
        availableMethods={availableMethods}
      />

      {/* Payment Method Specific Content */}
      {selectedMethod === 'card' && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">
            פרטי כרטיס אשראי
          </label>
          <div
            className={`p-4 border-2 rounded-lg transition-all ${
              error
                ? 'border-red-500 bg-red-50'
                : cardComplete
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 bg-white focus-within:border-blue-500 focus-within:bg-blue-50'
            }`}
          >
            <CardElement
              options={CARD_ELEMENT_OPTIONS}
              onChange={(e) => {
                setCardComplete(e.complete);
                if (e.error) {
                  setError(e.error.message);
                } else {
                  setError(null);
                }
              }}
            />
          </div>
        </div>
      )}

      {selectedMethod === 'paypal' && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-right">
          <p className="text-sm text-gray-700">
            לאחר לחיצה על "שלם", תועבר לדף PayPal להשלמת התשלום בצורה מאובטחת.
          </p>
        </div>
      )}

      {(selectedMethod === 'apple_pay' || selectedMethod === 'google_pay') && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-right">
          <p className="text-sm text-gray-700">
            תשלום מהיר ומאובטח דרך{' '}
            {selectedMethod === 'apple_pay' ? 'Apple Pay' : 'Google Pay'}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            * זמין רק במכשירים תומכים
          </p>
        </div>
      )}

      {selectedMethod === 'bit' && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-right">
          <p className="text-sm text-gray-700 mb-2">
            תועבר לאפליקציית Bit להשלמת התשלום
          </p>
          <p className="text-xs text-gray-500">
            * דורש התקנת אפליקציית Bit במכשיר
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm text-right">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || loading || (selectedMethod === 'card' && !cardComplete)}
        className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all shadow-lg ${
          !stripe || loading || (selectedMethod === 'card' && !cardComplete)
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-linear-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:shadow-xl active:scale-[0.98]'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⏳</span>
            מעבד תשלום...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <FaLock className="w-5 h-5" />
            שלם ₪{amount.toFixed(2)} בבטחה
          </span>
        )}
      </button>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <FaLock className="w-3 h-3" />
        <span>תשלום מאובטח</span>
        <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700 font-mono">
          SSL/TLS
        </span>
      </div>
    </form>
  );
}
