'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  items: Array<{
    albumTitle: string;
    quantity: number;
    printSize: string;
  }>;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'shipped':
      return 'bg-purple-100 text-purple-800';
    case 'delivered':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case 'paid':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPaymentStatusText = (status: string) => {
  switch (status) {
    case 'paid':
      return 'Payment has been processed successfully';
    case 'pending':
      return 'Payment is being processed';
    default:
      return 'Payment status unknown';
  }
};

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) {
      router.push('/albums');
      return;
    }
    fetchOrderDetails();
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      } else {
        alert('Order not found');
        router.push('/albums');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      alert('Error loading order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Order not found</h1>
          <Link href="/albums" className="text-blue-600 hover:text-blue-800">
            Browse Albums
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Order Placed Successfully!
          </h1>
          <p className="text-xl text-gray-600">
            Thank you for your order. We&apos;ve received your album order and will start processing it shortly.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Order #{order.orderNumber}
                </h2>
                <p className="text-gray-600">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  ${order.total.toFixed(2)}
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={`${item.albumTitle}-${item.printSize}`} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-b-0">
                  <div>
                    <h4 className="font-medium text-gray-900">{item.albumTitle}</h4>
                    <p className="text-sm text-gray-600">
                      Print Size: {item.printSize} • Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">
                      ${(order.total / order.items.reduce((sum, i) => sum + i.quantity, 0) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Status Timeline */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Status</h3>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-4 ${
                  ['pending', 'processing', 'shipped', 'delivered'].includes(order.status)
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}></div>
                <div>
                  <div className="font-medium text-gray-900">Order Placed</div>
                  <div className="text-sm text-gray-600">Your order has been received</div>
                </div>
              </div>

              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-4 ${
                  ['processing', 'shipped', 'delivered'].includes(order.status)
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}></div>
                <div>
                  <div className="font-medium text-gray-900">Processing</div>
                  <div className="text-sm text-gray-600">We&apos;re preparing your album for printing</div>
                </div>
              </div>

              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-4 ${
                  ['shipped', 'delivered'].includes(order.status)
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}></div>
                <div>
                  <div className="font-medium text-gray-900">Shipped</div>
                  <div className="text-sm text-gray-600">Your album is on its way</div>
                </div>
              </div>

              <div className="flex items-center">
                <div className={`w-4 h-4 rounded-full mr-4 ${
                  order.status === 'delivered'
                    ? 'bg-green-500'
                    : 'bg-gray-300'
                }`}></div>
                <div>
                  <div className="font-medium text-gray-900">Delivered</div>
                  <div className="text-sm text-gray-600">Your album has been delivered</div>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-medium text-gray-900">Payment Status</h4>
                <p className="text-sm text-gray-600">
                  {getPaymentStatusText(order.paymentStatus)}
                </p>
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/orders/${order.id}`}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Track Order
          </Link>
          <Link
            href="/albums"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Order Another Album
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            Contact Support
          </Link>
        </div>

        {/* What's Next */}
        <div className="mt-12 bg-blue-50 rounded-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">What&apos;s Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Order Confirmation</h4>
              <p className="text-sm text-gray-600">You&apos;ll receive an email confirmation with your order details</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Production</h4>
              <p className="text-sm text-gray-600">We&apos;ll start printing your album within 1-2 business days</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V7M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">Shipping</h4>
              <p className="text-sm text-gray-600">Your album will be shipped within 7-10 business days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      <OrderSuccessContent />
    </Suspense>
  );
}
