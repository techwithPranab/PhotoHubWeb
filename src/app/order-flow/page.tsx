'use client';

import Link from 'next/link';

const orderSteps = [
  {
    step: 1,
    title: 'Create Your Album',
    description: 'Start by creating a beautiful photo album with our easy-to-use tools.',
    details: [
      'Upload your favorite photos',
      'Choose from pre-designed templates',
      'Customize layouts and themes',
      'Add captions and special effects'
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    action: { text: 'Create Album', href: '/album/create' }
  },
  {
    step: 2,
    title: 'Design in Studio',
    description: 'Use our professional drag-and-drop editor to perfect your album design.',
    details: [
      'Drag and drop photos into layouts',
      'Apply filters and effects',
      'Add text and decorations',
      'Preview your album before ordering'
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    ),
    action: { text: 'Go to Studio', href: '/studio' }
  },
  {
    step: 3,
    title: 'Choose Print Options',
    description: 'Select the perfect specifications for your printed album.',
    details: [
      'Choose print size (8x10, 11x14, 16x20, 24x30)',
      'Select paper quality (Standard, Premium, Museum)',
      'Pick cover type (Softcover or Hardcover)',
      'Set quantity and special options'
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    action: { text: 'View Pricing', href: '/pricing' }
  },
  {
    step: 4,
    title: 'Add Shipping Info',
    description: 'Provide your shipping and contact information for delivery.',
    details: [
      'Enter shipping address and contact details',
      'Choose shipping speed (standard or express)',
      'Add special delivery instructions',
      'Review all information for accuracy'
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    action: null
  },
  {
    step: 5,
    title: 'Secure Payment',
    description: 'Complete your order with secure payment processing.',
    details: [
      'Review order summary and pricing',
      'Enter payment information securely',
      'Receive instant order confirmation',
      'Get email receipt and tracking info'
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    action: null
  },
  {
    step: 6,
    title: 'Track & Receive',
    description: 'Monitor your order progress and receive your beautiful album.',
    details: [
      'Track order status in real-time',
      'Receive email updates on progress',
      'Get shipping confirmation with tracking',
      'Enjoy your professionally printed album'
    ],
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    action: { text: 'View Orders', href: '/orders' }
  }
];

const pricingHighlights = [
  {
    title: 'Transparent Pricing',
    description: 'Pay only for what you need - no hidden fees or surprise charges.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    )
  },
  {
    title: 'Professional Quality',
    description: 'Museum-quality printing with archival materials that last generations.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    )
  },
  {
    title: 'Fast Turnaround',
    description: 'Standard orders ship within 7-10 days. Rush orders available.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  {
    title: 'Satisfaction Guarantee',
    description: 'Not happy with your album? We\'ll reprint it or provide a full refund.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
];

const faqs = [
  {
    question: 'How long does it take to receive my album?',
    answer: 'Standard orders take 7-10 business days for printing and shipping. Rush orders (3-5 day turnaround) are available for an additional fee. You\'ll receive email updates throughout the process.'
  },
  {
    question: 'Can I make changes after placing an order?',
    answer: 'You can request changes within 24 hours of placing your order. After that, your album goes into production. Contact our support team immediately if you need to make changes.'
  },
  {
    question: 'What if I\'m not satisfied with my album?',
    answer: 'We offer a 30-day satisfaction guarantee. If you\'re not completely happy with your album, we\'ll either reprint it at no cost or provide a full refund.'
  },
  {
    question: 'Do you offer international shipping?',
    answer: 'Yes, we ship worldwide. International shipping costs are calculated at checkout based on your location. Delivery times vary by destination.'
  },
  {
    question: 'Can I order multiple copies of the same album?',
    answer: 'Absolutely! You can order up to 10 copies of the same album design. Each copy is printed individually for the best quality.'
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and bank transfers. All payments are processed securely through our payment partners.'
  }
];

export default function OrderFlowPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800/20 to-blue-800/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              How to Order Your Album
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-purple-100 leading-relaxed">
              Follow our simple 6-step process to create and order beautiful, professional photo albums that will preserve your memories for generations.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/album/create"
                className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
              >
                Start Creating Now
              </Link>
              <Link
                href="/pricing"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
            6 Simple Steps to Your Perfect Album
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our streamlined process makes it easy to create and order professional photo albums
          </p>
        </div>

        <div className="space-y-12">
          {orderSteps.map((step, index) => (
            <div key={step.step} className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
              <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8">
                {/* Step Number & Icon */}
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-white font-bold text-xl mb-4 lg:mb-0">
                    {step.step}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="text-purple-600">
                          {step.icon}
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-lg mb-6">
                        {step.description}
                      </p>

                      {/* Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {step.details.map((detail) => (
                          <div key={detail} className="flex items-center text-gray-700">
                            <svg className="w-4 h-4 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    {step.action && (
                      <div className="lg:flex-shrink-0">
                        <Link
                          href={step.action.href}
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          {step.action.text}
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Highlights */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Album Service?
            </h2>
            <p className="text-xl text-gray-600">
              Professional quality with transparent pricing and exceptional service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {pricingHighlights.map((highlight) => (
              <div key={highlight.title} className="text-center p-6 rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-4 text-white">
                  {highlight.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {highlight.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about ordering your album
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.question} className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="font-semibold text-gray-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Create Your Album?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start your journey to preserving your precious memories in a beautiful, professional album.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/album/create"
              className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
            >
              Start Creating Now
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
