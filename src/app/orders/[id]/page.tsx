'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    albumId: string;
    albumTitle: string;
    printSize: string;
    paperType: string;
    coverType: string;
    quantity: number;
    pageCount: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  shippingInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  pricing: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  };
  specialInstructions: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
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
    case 'cancelled':
      return 'bg-red-100 text-red-800';
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
    case 'failed':
      return 'bg-red-100 text-red-800';
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

const getStatusStep = (status: string) => {
  switch (status) {
    case 'pending':
      return 1;
    case 'processing':
      return 2;
    case 'shipped':
      return 3;
    case 'delivered':
      return 4;
    default:
      return 1;
  }
};

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`);
      if (response.ok) {
        const data = await response.json();
        setOrder(data.order);
      } else {
        alert('Order not found');
        router.push('/orders');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      alert('Error loading order details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'cancel' }),
      });

      if (response.ok) {
        // Refresh order details
        fetchOrderDetails();
      } else {
        alert('Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Error cancelling order');
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
          <Link href="/orders" className="text-blue-600 hover:text-blue-800">
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  const currentStep = getStatusStep(order.status);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
              <p className="text-gray-600 mt-2">
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
              <div className="text-3xl font-bold text-gray-900">
                ${order.pricing.total.toFixed(2)}
              </div>
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </div>
            </div>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Progress</h2>

          <div className="relative">
            {/* Progress Line */}
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200">
              <div
                className="h-full bg-blue-600 transition-all duration-500"
                style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
              ></div>
            </div>

            {/* Steps */}
            <div className="relative flex justify-between">
              {[
                { step: 1, title: 'Order Placed', description: 'Your order has been received', date: order.createdAt },
                { step: 2, title: 'Processing', description: 'Preparing your album for printing', date: order.status === 'processing' || order.status === 'shipped' || order.status === 'delivered' ? order.updatedAt : null },
                { step: 3, title: 'Shipped', description: 'Your album is on its way', date: order.status === 'shipped' || order.status === 'delivered' ? order.updatedAt : null },
                { step: 4, title: 'Delivered', description: 'Your album has been delivered', date: order.status === 'delivered' ? order.updatedAt : null },
              ].map((step) => (
                <div key={step.step} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                    step.step <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.step}
                  </div>
                  <div className="mt-3 text-center max-w-24">
                    <div className={`text-sm font-medium ${
                      step.step <= currentStep ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                    <div className={`text-xs mt-1 ${
                      step.step <= currentStep ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {step.description}
                    </div>
                    {step.date && (
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(step.date).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Order Items */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Items</h2>

            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={`${item.albumId}-${item.printSize}`} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900">{item.albumTitle}</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Print Size: {item.printSize}</p>
                        <p>Paper: {item.paperType}</p>
                        <p>Cover: {item.coverType}</p>
                        <p>Pages: {item.pageCount}</p>
                        <p>Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">
                        ${item.totalPrice.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">
                        ${item.unitPrice.toFixed(2)} each
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${order.pricing.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>${order.pricing.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping:</span>
                  <span>${order.pricing.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2 border-t border-gray-200">
                  <span>Total:</span>
                  <span>${order.pricing.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping & Payment Info */}
          <div className="space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>

              <div className="space-y-3">
                <div>
                  <span className="font-medium text-gray-900">{order.shippingInfo.name}</span>
                </div>
                <div className="text-gray-600">
                  {order.shippingInfo.address}<br />
                  {order.shippingInfo.city}, {order.shippingInfo.state} {order.shippingInfo.zipCode}<br />
                  {order.shippingInfo.country}
                </div>
                <div className="text-gray-600">
                  {order.shippingInfo.email}<br />
                  {order.shippingInfo.phone}
                </div>
              </div>

              {/* Tracking Information */}
              {order.trackingNumber && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-2">Tracking Information</h3>
                  <div className="text-sm text-gray-600">
                    <p>Tracking Number: <span className="font-mono">{order.trackingNumber}</span></p>
                    {order.estimatedDelivery && (
                      <p>Estimated Delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Payment Status */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>

              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">Payment Status</div>
                  <div className="text-sm text-gray-600">
                    {getPaymentStatusText(order.paymentStatus)}
                  </div>
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                  {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            {order.specialInstructions && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Special Instructions</h2>
                <p className="text-gray-600">{order.specialInstructions}</p>
              </div>
            )}

            {/* Actions */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions</h2>

              <div className="space-y-3">
                <Link
                  href="/contact"
                  className="block w-full text-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Contact Support
                </Link>

                {order.status === 'pending' && (
                  <button
                    onClick={handleCancelOrder}
                    className="block w-full px-4 py-2 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50"
                  >
                    Cancel Order
                  </button>
                )}

                <Link
                  href="/albums"
                  className="block w-full text-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Order Another Album
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
