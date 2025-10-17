'use client';

import { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
} from '@stripe/react-stripe-js';

interface PaymentFormProps {
  total: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

export default function PaymentForm({ total, onSuccess, onError, disabled }: Readonly<PaymentFormProps>) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      onError('Stripe has not loaded yet. Please try again.');
      return;
    }

    setIsProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${globalThis.location.origin}/order/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        onError(error.message || 'Payment failed');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
      } else {
        onError('Payment was not completed. Please try again.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      onError('An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
        <PaymentElement 
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Billing Address</h3>
        <AddressElement 
          options={{
            mode: 'billing',
            allowedCountries: ['US', 'CA', 'GB', 'AU', 'DE', 'FR', 'JP'],
          }}
        />
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing || disabled}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isProcessing ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Payment...
          </>
        ) : (
          `Pay $${total.toFixed(2)}`
        )}
      </button>

      <div className="text-xs text-gray-500 text-center">
        Your payment information is secured by Stripe and encrypted with industry-standard SSL.
      </div>
    </form>
  );
}
