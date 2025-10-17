import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import connectDB from '@/lib/mongodb';
import Order from '@/models/Order';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-09-30.clover',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    await connectDB();

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
      
      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderId = paymentIntent.metadata.orderId;
    
    if (!orderId) {
      console.error('No orderId found in payment intent metadata');
      return;
    }

    const order = await Order.findById(orderId);
    if (!order) {
      console.error(`Order not found: ${orderId}`);
      return;
    }

    // Update order with payment success
    order.paymentStatus = 'completed';
    order.stripePaymentIntentId = paymentIntent.id;
    order.orderStatus = 'processing'; // Move to processing after payment
    order.updatedAt = new Date();

    await order.save();

    console.log(`Payment successful for order: ${orderId}`);
    
  } catch (error) {
    console.error('Error handling payment success:', error);
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderId = paymentIntent.metadata.orderId;
    
    if (!orderId) {
      console.error('No orderId found in payment intent metadata');
      return;
    }

    const order = await Order.findById(orderId);
    if (!order) {
      console.error(`Order not found: ${orderId}`);
      return;
    }

    // Update order with payment failure
    order.paymentStatus = 'failed';
    order.stripePaymentIntentId = paymentIntent.id;
    order.updatedAt = new Date();

    await order.save();

    console.log(`Payment failed for order: ${orderId}`);
    
  } catch (error) {
    console.error('Error handling payment failure:', error);
  }
}

async function handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent) {
  try {
    const orderId = paymentIntent.metadata.orderId;
    
    if (!orderId) {
      console.error('No orderId found in payment intent metadata');
      return;
    }

    const order = await Order.findById(orderId);
    if (!order) {
      console.error(`Order not found: ${orderId}`);
      return;
    }

    // Update order with payment cancellation
    order.paymentStatus = 'failed';
    order.orderStatus = 'cancelled';
    order.stripePaymentIntentId = paymentIntent.id;
    order.updatedAt = new Date();

    await order.save();

    console.log(`Payment canceled for order: ${orderId}`);
    
  } catch (error) {
    console.error('Error handling payment cancellation:', error);
  }
}
