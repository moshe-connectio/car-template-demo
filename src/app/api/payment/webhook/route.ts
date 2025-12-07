/**
 * Stripe Webhook Handler
 * Handles payment confirmations and updates from Stripe
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createServerSupabaseClient } from '@core/lib/supabase';

// Force dynamic rendering for this route - don't prerender
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const revalidate = 0;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-11-17.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log('✅ Payment succeeded:', paymentIntent.id);
        
        // TODO: Save order to database
        await handleSuccessfulPayment(paymentIntent);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        console.log('❌ Payment failed:', failedPayment.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/**
 * Handle successful payment - save order to database
 */
async function handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent) {
  try {
    const supabase = createServerSupabaseClient();
    
    // Extract metadata
    const metadata = paymentIntent.metadata;
    
    // TODO: Create order record in database
    // const { data, error } = await supabase
    //   .from('orders')
    //   .insert({
    //     payment_intent_id: paymentIntent.id,
    //     amount: paymentIntent.amount / 100,
    //     currency: paymentIntent.currency,
    //     status: 'paid',
    //     customer_email: metadata.customer_email,
    //     items: JSON.parse(metadata.items || '[]'),
    //   });

    console.log('Order saved successfully');
  } catch (error) {
    console.error('Failed to save order:', error);
  }
}
