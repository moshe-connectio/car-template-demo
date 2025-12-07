/**
 * Payment Form Component with Stripe Elements
 * Fully customizable payment form with Hebrew support
 */

'use client';

import { useState, FormEvent } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { FaCreditCard, FaLock, FaCheckCircle } from 'react-icons/fa';

interface PaymentFormProps {
  amount: number;
  currency?: string;
  onSuccess?: (paymentIntentId: string) => void;
  onError?: (error: string) => void;
  customerInfo?: {
    name?: string;
    email?: string;
    phone?: string;
  };
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
  hidePostalCode: true, // Postal code not relevant in Israel
};

export function PaymentForm({
  amount,
  currency = 'ILS',
  onSuccess,
  onError,
  customerInfo,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!cardComplete) {
      setError('אנא מלא את פרטי הכרטיס');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Create Payment Intent
      const response = await fetch('/api/payment/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(amount * 100), // Convert to agorot
          currency: currency.toLowerCase(),
          metadata: {
            customer_name: customerInfo?.name,
            customer_email: customerInfo?.email,
            customer_phone: customerInfo?.phone,
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // 2. Confirm Card Payment
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: customerInfo?.name,
            email: customerInfo?.email,
            phone: customerInfo?.phone,
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message || 'תשלום נכשל');
      }

      // Success!
      setSucceeded(true);
      onSuccess?.(result.paymentIntent.id);
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
        <p className="text-gray-600">
          תודה על הרכישה. תקבל אישור במייל בקרוב.
        </p>
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

      {/* Card Element */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2 text-right">
          <FaCreditCard className="inline ml-2" />
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
        <p className="text-xs text-gray-500 mt-2 text-right">
          מקובלים כל כרטיסי האשראי הישראליים והבינלאומיים
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm text-right">{error}</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || loading || !cardComplete}
        className={`w-full py-4 px-6 rounded-lg font-bold text-lg transition-all shadow-lg ${
          !stripe || loading || !cardComplete
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
        <span>תשלום מאובטח באמצעות Stripe</span>
        <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700 font-mono">
          PCI DSS
        </span>
      </div>
    </form>
  );
}
