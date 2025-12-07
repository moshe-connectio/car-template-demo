/**
 * Stripe Provider Component
 * Wraps the payment form with Stripe Elements context
 */

'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import { ReactNode } from 'react';

// Load Stripe with publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
);

interface StripeProviderProps {
  children: ReactNode;
  amount?: number;
  currency?: string;
}

export function StripeProvider({
  children,
  amount,
  currency = 'ils',
}: StripeProviderProps) {
  const options: StripeElementsOptions = {
    mode: 'payment',
    ...(amount && { amount: Math.round(amount * 100) }),
    currency: currency.toLowerCase(),
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#2563eb',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#ef4444',
        fontFamily: 'Assistant, -apple-system, sans-serif',
        borderRadius: '8px',
      },
    },
    locale: 'he',
  } as StripeElementsOptions;

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
}
