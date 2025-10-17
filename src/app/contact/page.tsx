'use client';

import { useState } from 'react';
import Link from 'next/link';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  orderNumber?: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    orderNumber: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (field: keyof ContactForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          orderNumber: '',
          message: ''
        });
      } else {
        alert('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-8 text-center">
          <div className="mb-6">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Message Sent!</h2>
          <p className="text-gray-600 mb-6">
            Thank you for contacting us. We&apos;ll get back to you within 24 hours.
          </p>
          <div className="space-y-3">
            <Link
              href="/orders"
              className="block w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              View My Orders
            </Link>
            <button
              onClick={() => setIsSubmitted(false)}
              className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Send Another Message
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Contact Support</h1>
          <p className="text-gray-600 mt-2">
            Need help with your order or have a question? We&apos;re here to help!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Get in Touch</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <svg className="flex-shrink-0 h-6 w-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Email</h3>
                    <p className="text-sm text-gray-600">support@photohub.com</p>
                    <p className="text-xs text-gray-500 mt-1">We typically respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="flex-shrink-0 h-6 w-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Phone</h3>
                    <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                    <p className="text-xs text-gray-500 mt-1">Mon-Fri 9AM-6PM EST</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <svg className="flex-shrink-0 h-6 w-6 text-blue-600 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-gray-900">Response Time</h3>
                    <p className="text-sm text-gray-600">Within 24 hours</p>
                    <p className="text-xs text-gray-500 mt-1">Urgent orders: 2-4 hours</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-md">
                <h3 className="text-sm font-medium text-blue-900 mb-2">Quick Help</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Order status and tracking</li>
                  <li>• Print quality questions</li>
                  <li>• Album design assistance</li>
                  <li>• Shipping and delivery</li>
                  <li>• Payment and billing</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Send us a Message</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <select
                      id="subject"
                      required
                      value={formData.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a subject</option>
                      <option value="order-status">Order Status & Tracking</option>
                      <option value="print-quality">Print Quality Issue</option>
                      <option value="shipping">Shipping & Delivery</option>
                      <option value="payment">Payment & Billing</option>
                      <option value="album-design">Album Design Help</option>
                      <option value="technical">Technical Support</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Order Number{' '}
                      <span className="text-gray-500 text-xs ml-1">(if applicable)</span>
                    </label>
                    <input
                      id="orderNumber"
                      type="text"
                      value={formData.orderNumber}
                      onChange={(e) => handleChange('orderNumber', e.target.value)}
                      placeholder="e.g., ORD-2023-001"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={(e) => handleChange('message', e.target.value)}
                    placeholder="Please describe your question or issue in detail. If you're reporting a problem, include any relevant information such as order details, error messages, or steps to reproduce the issue."
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    * Required fields
                  </p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">How long does printing take?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Standard orders are processed within 3-5 business days. Rush orders (24-48 hours) are available for an additional fee.
              </p>

              <h3 className="font-semibold text-gray-900 mb-2">Can I modify my order after placing it?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Orders can be modified within 2 hours of placement if they haven&apos;t entered production. Contact us immediately for changes.
              </p>

              <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600 text-sm">
                We accept all major credit cards (Visa, MasterCard, American Express) and PayPal through our secure payment system.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do you ship internationally?</h3>
              <p className="text-gray-600 text-sm mb-4">
                Yes, we ship worldwide. International shipping times vary by destination (7-14 business days). Custom duties may apply.
              </p>

              <h3 className="font-semibold text-gray-900 mb-2">What if I&apos;m not satisfied with my order?</h3>
              <p className="text-gray-600 text-sm mb-4">
                We offer a 100% satisfaction guarantee. If you&apos;re not happy with your album, we&apos;ll reprint it or provide a full refund.
              </p>

              <h3 className="font-semibold text-gray-900 mb-2">How do I track my order?</h3>
              <p className="text-gray-600 text-sm">
                Once your order ships, you&apos;ll receive a tracking number via email. You can also track your order status in your account dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
