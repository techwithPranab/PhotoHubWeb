'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import StripeProvider from '@/components/StripeProvider';
import PaymentForm from '@/components/PaymentForm';

interface Album {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  pageCount: number;
}

interface ShippingInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const getPagePrice = (pageCount: number): number => {
  if (pageCount <= 20) return 0;
  if (pageCount <= 40) return 15;
  if (pageCount <= 60) return 25;
  if (pageCount <= 80) return 35;
  return 50;
};

function OrderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const albumId = searchParams.get('albumId');

  const [album, setAlbum] = useState<Album | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paymentIntentClientSecret, setPaymentIntentClientSecret] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState<'details' | 'payment'>('details');
  const [orderId, setOrderId] = useState<string | null>(null);

  // Order specifications
  const [printSize, setPrintSize] = useState('8x10');
  const [paperType, setPaperType] = useState('standard');
  const [coverType, setCoverType] = useState('softcover');
  const [quantity, setQuantity] = useState(1);

  // Shipping information
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US'
  });

  const [specialInstructions, setSpecialInstructions] = useState('');

  // Pricing calculation
  const [pricing, setPricing] = useState({
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0
  });

  useEffect(() => {
    if (albumId) {
      fetchAlbum();
    }
  }, [albumId]);

  useEffect(() => {
    calculatePricing();
  }, [printSize, paperType, coverType, quantity, album]);

  const fetchAlbum = async () => {
    try {
      const response = await fetch(`/api/albums/${albumId}`);
      if (response.ok) {
        const data = await response.json();
        setAlbum(data.album);
      } else {
        alert('Album not found');
        router.push('/albums');
      }
    } catch (error) {
      console.error('Error fetching album:', error);
      alert('Error loading album');
    } finally {
      setLoading(false);
    }
  };

  const calculatePricing = () => {
    if (!album) return;

    const basePrice = getBasePrice(printSize);
    const paperPrice = getPaperPrice(paperType);
    const coverPrice = getCoverPrice(coverType);
    const pagePrice = getPagePrice(album.pageCount);

    const unitPrice = basePrice + paperPrice + coverPrice + pagePrice;
    const subtotal = unitPrice * quantity;
    const tax = subtotal * 0.08; // 8% tax
    const shipping = shippingInfo.country === 'US' ? 9.99 : 24.99;
    const total = subtotal + tax + shipping;

    setPricing({ subtotal, tax, shipping, total });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!album) return;

    setSubmitting(true);

    try {
      // First create the order (which will also create a payment intent)
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          albumId: album._id,
          printSize,
          paperType,
          coverType,
          quantity,
          shippingInfo,
          specialInstructions
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setOrderId(data.order.id);
        setPaymentIntentClientSecret(data.clientSecret);
        setCurrentStep('payment');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error creating order');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = (paymentIntentId: string) => {
    router.push(`/order/success?orderId=${orderId}&paymentIntentId=${paymentIntentId}`);
  };

  const handlePaymentError = (error: string) => {
    alert(error);
    // Could add more sophisticated error handling here
  };

  const handleShippingChange = (field: keyof ShippingInfo, value: string) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Album not found</h1>
          <Link href="/albums" className="text-blue-600 hover:text-blue-800">
            Browse Albums
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Place Your Order</h1>
          <p className="text-gray-600 mt-2">Customize and order your photo album</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Album Preview */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-8">
              <h2 className="text-xl font-semibold mb-4">Album Preview</h2>
              <div className="aspect-square bg-gray-200 rounded-lg mb-4 overflow-hidden">
                {album.coverImage && (
                  <img
                    src={album.coverImage}
                    alt={album.title}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <h3 className="font-semibold text-lg mb-2">{album.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{album.description}</p>
              <div className="text-sm text-gray-500">
                {album.pageCount} pages
              </div>
            </div>
          </div>

          {/* Order Form */}
          <div className="lg:col-span-2">
            {currentStep === 'details' ? (
              <form onSubmit={handleSubmit} className="space-y-8">
              {/* Print Specifications */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-6">Print Specifications</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="printSize" className="block text-sm font-medium text-gray-700 mb-2">
                      Print Size
                    </label>
                    <select
                      id="printSize"
                      value={printSize}
                      onChange={(e) => setPrintSize(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="8x10">8x10 inches - $12.99</option>
                      <option value="11x14">11x14 inches - $18.99</option>
                      <option value="16x20">16x20 inches - $29.99</option>
                      <option value="24x30">24x30 inches - $49.99</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="paperType" className="block text-sm font-medium text-gray-700 mb-2">
                      Paper Type
                    </label>
                    <select
                      id="paperType"
                      value={paperType}
                      onChange={(e) => setPaperType(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="standard">Standard Matte - Included</option>
                      <option value="premium">Premium Glossy - +$3</option>
                      <option value="museum">Museum Quality - +$8</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="coverType" className="block text-sm font-medium text-gray-700 mb-2">
                      Cover Type
                    </label>
                    <select
                      id="coverType"
                      value={coverType}
                      onChange={(e) => setCoverType(e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="softcover">Softcover - Included</option>
                      <option value="hardcover">Hardcover - +$12</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <select
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={1}>1 copy</option>
                      <option value={2}>2 copies</option>
                      <option value={3}>3 copies</option>
                      <option value={5}>5 copies</option>
                      <option value={10}>10 copies</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Shipping Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      required
                      value={shippingInfo.name}
                      onChange={(e) => handleShippingChange('name', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={shippingInfo.email}
                      onChange={(e) => handleShippingChange('email', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={shippingInfo.phone}
                      onChange={(e) => handleShippingChange('phone', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                      Country *
                    </label>
                    <select
                      id="country"
                      required
                      value={shippingInfo.country}
                      onChange={(e) => handleShippingChange('country', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                      <option value="DE">Germany</option>
                      <option value="FR">France</option>
                      <option value="JP">Japan</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                      Street Address *
                    </label>
                    <input
                      id="address"
                      type="text"
                      required
                      value={shippingInfo.address}
                      onChange={(e) => handleShippingChange('address', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <input
                      id="city"
                      type="text"
                      required
                      value={shippingInfo.city}
                      onChange={(e) => handleShippingChange('city', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                      State/Province *
                    </label>
                    <input
                      id="state"
                      type="text"
                      required
                      value={shippingInfo.state}
                      onChange={(e) => handleShippingChange('state', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-2">
                      ZIP/Postal Code *
                    </label>
                    <input
                      id="zipCode"
                      type="text"
                      required
                      value={shippingInfo.zipCode}
                      onChange={(e) => handleShippingChange('zipCode', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Special Instructions</h2>
                <textarea
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="Any special requests or notes for your order..."
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Album: {album.title}</span>
                    <span>${pricing.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Print Size: {printSize}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Paper: {paperType}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Cover: {coverType}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Quantity: {quantity}</span>
                  </div>

                  <hr className="my-4" />

                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${pricing.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${pricing.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>${pricing.shipping.toFixed(2)}</span>
                  </div>

                  <hr className="my-4" />

                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span>${pricing.total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Creating Order...' : `Continue to Payment - $${pricing.total.toFixed(2)}`}
                </button>
              </div>
            </form>
            ) : (
              <div className="space-y-6">
                {/* Order Review */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h2 className="text-xl font-semibold mb-6">Order Review</h2>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Album: {album.title}</span>
                      <span>${pricing.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Print Size: {printSize}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Paper: {paperType}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Cover: {coverType}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>Quantity: {quantity}</span>
                    </div>
                    <hr className="my-4" />
                    <div className="flex justify-between text-xl font-bold">
                      <span>Total:</span>
                      <span>${pricing.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Form */}
                <div className="bg-white rounded-lg shadow p-6">
                  <StripeProvider clientSecret={paymentIntentClientSecret || undefined}>
                    <PaymentForm
                      total={pricing.total}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </StripeProvider>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentStep('details')}
                  className="w-full mt-4 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-semibold hover:bg-gray-400"
                >
                  Back to Order Details
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      <OrderContent />
    </Suspense>
  );
}

// Helper functions for pricing calculations (same as in API)
function getBasePrice(printSize: string): number {
  const prices: { [key: string]: number } = {
    '8x10': 12.99,
    '11x14': 18.99,
    '16x20': 29.99,
    '24x30': 49.99
  };
  return prices[printSize] || 12.99;
}

function getPaperPrice(paperType: string): number {
  const prices: { [key: string]: number } = {
    'standard': 0,
    'premium': 3,
    'museum': 8
  };
  return prices[paperType] || 0;
}

function getCoverPrice(coverType: string): number {
  const prices: { [key: string]: number } = {
    'softcover': 0,
    'hardcover': 12
  };
  return prices[coverType] || 0;
}
