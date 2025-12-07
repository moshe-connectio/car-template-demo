/**
 * Stripe Payment API Route
 * Creates a payment intent for processing payments
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Force dynamic rendering for this route - don't prerender
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-11-17.clover',
});

export async function POST(req: NextRequest) {
  try {
    const { 
      amount, 
      currency = 'ils', 
      paymentMethod = 'card',
      metadata = {} 
    } = await req.json();

    // Validate amount
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    // Configure payment methods based on selection
    const paymentMethodTypes: string[] = [];
    
    switch (paymentMethod) {
      case 'card':
        paymentMethodTypes.push('card');
        break;
      case 'paypal':
        paymentMethodTypes.push('paypal');
        break;
      case 'apple_pay':
      case 'google_pay':
        // These are handled by automatic_payment_methods
        break;
      default:
        paymentMethodTypes.push('card');
    }

    // Create Payment Intent
    const paymentIntentConfig: any = {
      amount: Math.round(amount), // Amount in agorot (cents)
      currency: currency.toLowerCase(),
      metadata: {
        ...metadata,
        payment_method: paymentMethod,
        timestamp: new Date().toISOString(),
      },
    };

    // Add payment method configuration
    if (paymentMethodTypes.length > 0) {
      paymentIntentConfig.payment_method_types = paymentMethodTypes;
    } else {
      paymentIntentConfig.automatic_payment_methods = {
        enabled: true,
      };
    }

    const paymentIntent = await stripe.paymentIntents.create(paymentIntentConfig);

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error: any) {
    console.error('Payment Intent Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create payment intent' },
      { status: 500 }
    );
  }
}
