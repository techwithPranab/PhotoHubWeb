import Link from 'next/link';

const printOptions = [
  {
    size: 'Small (8x10)',
    dimensions: '8" x 10"',
    basePrice: 1080,
    premiumPrice: 1320,
    description: 'Perfect for individual photos or small displays'
  },
  {
    size: 'Medium (11x14)',
    dimensions: '11" x 14"',
    basePrice: 1580,
    premiumPrice: 1910,
    description: 'Great for wall art and larger displays'
  },
  {
    size: 'Large (16x20)',
    dimensions: '16" x 20"',
    basePrice: 2490,
    premiumPrice: 2990,
    description: 'Stunning wall art for your home or office'
  },
  {
    size: 'XL (24x30)',
    dimensions: '24" x 30"',
    basePrice: 4150,
    premiumPrice: 4980,
    description: 'Large format prints for professional displays'
  }
];

const paperTypes = [
  {
    name: 'Standard Matte',
    description: 'Classic matte finish, excellent color reproduction',
    price: 0,
    features: ['Vibrant colors', 'No glare', 'Budget-friendly']
  },
  {
    name: 'Premium Glossy',
    description: 'High-shine finish with enhanced color depth',
    price: 250,
    features: ['Rich colors', 'Glossy finish', 'Water-resistant']
  },
  {
    name: 'Museum Quality',
    description: 'Archival quality paper with ultra-fine detail',
    price: 665,
    features: ['Archival quality', 'Fine art paper', 'Fade-resistant', 'Museum-grade']
  }
];

const albumSizes = [
  {
    pages: '20 Pages',
    price: 0,
    description: 'Perfect for small collections'
  },
  {
    pages: '40 Pages',
    price: 1245,
    description: 'Great for family albums'
  },
  {
    pages: '60 Pages',
    price: 2075,
    description: 'Comprehensive photo collections'
  },
  {
    pages: '80 Pages',
    price: 2905,
    description: 'Large family or event albums'
  },
  {
    pages: '100+ Pages',
    price: 4150,
    description: 'Extensive photo documentation'
  }
];

const coverTypes = [
  {
    name: 'Softcover',
    price: 0,
    description: 'Flexible, lightweight cover',
    features: ['Flexible binding', 'Lightweight', 'Cost-effective']
  },
  {
    name: 'Hardcover',
    price: 995,
    description: 'Rigid, premium hardcover with dust jacket',
    features: ['Premium look', 'Durable construction', 'Dust jacket included']
  }
];

const faqs = [
  {
    question: 'How does the pricing work?',
    answer: 'You pay per album based on the number of pages, paper type, cover style, and print size. Each album is custom-priced according to your specifications.'
  },
  {
    question: 'What\'s included in the price?',
    answer: 'The price includes professional printing, high-quality materials, shipping, and a satisfaction guarantee. Design and photo editing are included at no extra cost.'
  },
  {
    question: 'How long does it take to receive my album?',
    answer: 'Standard orders take 7-10 business days for printing and shipping. Rush orders are available for an additional fee with 3-5 day turnaround.'
  },
  {
    question: 'Can I make changes after placing an order?',
    answer: 'You can make changes within 24 hours of placing your order. After that, the album goes into production. Contact our support team for assistance.'
  },
  {
    question: 'What if I\'m not satisfied with my album?',
    answer: 'We offer a 30-day satisfaction guarantee. If you\'re not completely happy with your album, we\'ll reprint it or provide a full refund.'
  },
  {
    question: 'Do you offer international shipping?',
    answer: 'Yes, we ship worldwide. International shipping costs are calculated at checkout based on your location and album specifications.'
  }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800/20 to-blue-800/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Custom Album Pricing
            </h1>
            <p className="text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-purple-100 leading-relaxed">
              Pay only for what you need. Create beautiful, professional photo albums with transparent pricing based on your specifications.
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 text-lg">
              <span className="flex items-center bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm">
                <svg className="w-6 h-6 mr-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Professional quality
              </span>
              <span className="flex items-center bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm">
                <svg className="w-6 h-6 mr-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Free design service
              </span>
              <span className="flex items-center bg-white/10 px-6 py-3 rounded-full backdrop-blur-sm">
                <svg className="w-6 h-6 mr-3 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                30-day guarantee
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Print Size Options */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
            Choose Your Print Size
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Select the perfect size for your photo album
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {printOptions.map((option, index) => {
            const gradientColors = [
              'bg-gradient-to-r from-purple-500 to-pink-500',
              'bg-gradient-to-r from-blue-500 to-purple-500',
              'bg-gradient-to-r from-green-500 to-blue-500',
              'bg-gradient-to-r from-pink-500 to-purple-500'
            ];
            const gradientClass = gradientColors[index % 4];
            
            return (
              <div key={option.size} className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100 hover:border-purple-300 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                <div className="text-center mb-6">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center ${gradientClass}`}>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {option.size}
                  </h3>
                  <p className="text-sm text-gray-600 mb-6">
                    {option.dimensions}
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                      <span className="text-sm font-medium text-gray-600">Standard:</span>
                      <span className="font-bold text-lg text-gray-900">₹{option.basePrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl">
                      <span className="text-sm font-medium text-gray-600">Premium:</span>
                      <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">₹{option.premiumPrice.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 text-center leading-relaxed">
                  {option.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Paper Types */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Paper Quality Options
            </h2>
            <p className="text-xl text-gray-600">
              Choose the perfect paper for your photos
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {paperTypes.map((paper) => (
              <div key={paper.name} className="border-2 border-gray-200 rounded-xl p-8 hover:border-blue-300 transition-colors">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {paper.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {paper.description}
                  </p>
                  <div className="text-3xl font-bold text-blue-600">
                    {paper.price === 0 ? 'Included' : `+₹${paper.price.toLocaleString()}`}
                  </div>
                </div>

                <ul className="space-y-3">
                  {paper.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Album Size Options */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Album Size Options
            </h2>
            <p className="text-xl text-gray-600">
              How many pages does your story need?
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {albumSizes.map((size) => (
              <div key={size.pages} className="bg-white rounded-lg shadow p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {size.pages}
                </h3>
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {size.price === 0 ? 'Base Price' : `+₹${size.price.toLocaleString()}`}
                </div>
                <p className="text-sm text-gray-600">
                  {size.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cover Types */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Cover Options
            </h2>
            <p className="text-xl text-gray-600">
              Choose the perfect cover for your album
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {coverTypes.map((cover) => (
              <div key={cover.name} className="border-2 border-gray-200 rounded-xl p-8 hover:border-blue-300 transition-colors">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {cover.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {cover.description}
                  </p>
                  <div className="text-3xl font-bold text-blue-600">
                    {cover.price === 0 ? 'Included' : `+₹${cover.price.toLocaleString()}`}
                  </div>
                </div>

                <ul className="space-y-3">
                  {cover.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Calculator */}
      <div className="bg-blue-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Calculate Your Album Price
            </h2>
            <p className="text-xl text-gray-600">
              Get an instant quote for your custom photo album
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                Starting from ₹2,737
              </div>
              <p className="text-gray-600">
                Base price for a 20-page album with standard options
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Sample Configurations:</h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm">20 pages, 8x10, Standard Matte, Softcover</span>
                    <span className="font-semibold">₹2,737</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm">40 pages, 11x14, Premium Glossy, Hardcover</span>
                    <span className="font-semibold">₹5,640</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="text-sm">60 pages, 16x20, Museum Quality, Hardcover</span>
                    <span className="font-semibold">₹9,370</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Additional Services:</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Rush Processing (3-5 days)</span>
                    <span className="font-semibold">+₹1,245</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">International Shipping</span>
                    <span className="font-semibold">+₹2,075</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Gift Wrapping</span>
                    <span className="font-semibold">+₹664</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Personalization</span>
                    <span className="font-semibold">+₹996</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Link
                href="/album/create"
                className="inline-block bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Start Creating Your Album
              </Link>
            </div>
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
              Everything you need to know about our album pricing
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
      <div className="bg-gray-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Create Your Album?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start designing your custom photo album today with our easy-to-use tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/album/create"
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Create Album Now
            </Link>
            <Link
              href="/contact"
              className="border border-gray-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Get Custom Quote
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
