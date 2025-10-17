'use client';

import { useState } from 'react';

export default function FAQPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const faqCategories = [
    {
      title: 'Orders & Shipping',
      faqs: [
        {
          question: 'How long does it take to process my order?',
          answer: 'Orders are typically processed within 1-2 business days. Custom photo albums may take 2-3 business days for processing. You will receive an email confirmation with tracking information once your order ships.'
        },
        {
          question: 'What are your shipping options?',
          answer: 'We offer Standard (5-7 days, free over $50), Express (2-3 days, $15.99), Overnight (1 day, $29.99), and White Glove delivery (3-5 days with personal setup, $49.99). International shipping times vary by location.'
        },
        {
          question: 'Do you ship internationally?',
          answer: 'Yes, we ship to most countries worldwide. Shipping costs and delivery times vary by destination. Customs fees and import duties may apply and are the responsibility of the recipient.'
        },
        {
          question: 'Can I change or cancel my order?',
          answer: 'Orders can be modified or cancelled within 2 hours of placement. Once processing begins, we are unable to make changes. Please contact our support team immediately if you need to make changes.'
        }
      ]
    },
    {
      title: 'Photo Requirements',
      faqs: [
        {
          question: 'What photo resolution do you recommend?',
          answer: 'We recommend photos at least 300 DPI at the final print size. For best results, upload high-resolution images (at least 2000x1500 pixels for 8x10 prints). Higher resolution ensures sharper prints.'
        },
        {
          question: 'What file formats do you accept?',
          answer: 'We accept JPEG, PNG, TIFF, and PDF files. JPEG is recommended for most photos. Avoid heavily compressed images as they may appear pixelated when printed.'
        },
        {
          question: 'Can I upload RAW files?',
          answer: 'Currently, we only accept processed image files (JPEG, PNG, TIFF). Please convert your RAW files to one of these formats before uploading. We recommend processing them for optimal color and contrast.'
        },
        {
          question: 'Is there a limit to how many photos I can upload?',
          answer: 'There is no strict limit, but we recommend keeping albums to 50-100 photos for optimal loading and editing performance. For larger collections, consider creating multiple albums.'
        }
      ]
    },
    {
      title: 'Design & Customization',
      faqs: [
        {
          question: 'Can I customize the album layout?',
          answer: 'Absolutely! Our design tools allow you to customize layouts, add text, adjust colors, and rearrange photos. You can also choose from various templates or start with a blank design.'
        },
        {
          question: 'Do you offer custom templates?',
          answer: 'Yes, our design team can create custom templates for special occasions, branding, or unique themes. Contact our support team to discuss your custom template needs.'
        },
        {
          question: 'Can I add text and captions to my album?',
          answer: 'Yes, you can add text anywhere in your album. Choose from various fonts, sizes, and colors. You can add page titles, photo captions, dates, and personal messages.'
        },
        {
          question: 'What if I make a mistake in my design?',
          answer: 'You can edit your album at any time before placing the order. Our preview tools show exactly how your album will look when printed. You can also save multiple versions of your design.'
        }
      ]
    },
    {
      title: 'Payment & Pricing',
      faqs: [
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay. All payments are processed securely through encrypted connections.'
        },
        {
          question: 'Do you offer discounts for bulk orders?',
          answer: 'Yes, we offer volume discounts for orders of 10+ albums. Contact our sales team for custom pricing on large orders or corporate accounts.'
        },
        {
          question: 'Is there a setup fee?',
          answer: 'There are no setup fees for standard albums. Custom designs or special materials may incur additional charges, which will be clearly communicated before checkout.'
        },
        {
          question: 'Do you offer refunds?',
          answer: 'We offer a 30-day satisfaction guarantee. If you are not completely satisfied with your album, we will provide a full refund or reprint at no additional cost.'
        }
      ]
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find quick answers to common questions about our photo album services.
              Can&apos;t find what you&apos;re looking for? Contact our support team.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {faqCategories.map((category, categoryIndex) => (
          <div key={category.title} className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {category.title}
            </h2>

            <div className="space-y-4">
              {category.faqs.map((faq, faqIndex) => {
                const globalIndex = categoryIndex * 100 + faqIndex;
                const isOpen = openFAQ === globalIndex;

                return (
                  <div key={faq.question} className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <button
                      onClick={() => toggleFAQ(globalIndex)}
                      className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                    >
                      <h3 className="text-lg font-semibold text-gray-900 pr-4">
                        {faq.question}
                      </h3>
                      <div className={`transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                        ▼
                      </div>
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Still Need Help */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl mb-4">🤔</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Still Have Questions?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Can&apos;t find the answer you&apos;re looking for? Our support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            >
              Contact Support
            </a>
            <a
              href="/help"
              className="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-purple-600 hover:text-white transition-all duration-200"
            >
              Browse Help Center
            </a>
          </div>
        </div>
      </div>

      {/* Quick Contact Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Get in Touch
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl mb-2">📧</div>
                <div className="font-semibold">Email</div>
                <div className="text-purple-200">support@photohub.com</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">📞</div>
                <div className="font-semibold">Phone</div>
                <div className="text-purple-200">1-800-PHOTO-HUB</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">💬</div>
                <div className="font-semibold">Live Chat</div>
                <div className="text-purple-200">Available 9 AM - 6 PM EST</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
