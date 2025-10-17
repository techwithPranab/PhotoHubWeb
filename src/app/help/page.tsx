'use client';

import Link from 'next/link';

export default function HelpPage() {
  const helpCategories = [
    {
      title: 'Getting Started',
      description: 'Learn the basics of creating your first photo album',
      icon: '🚀',
      articles: [
        'How to upload photos',
        'Choosing the right template',
        'Customizing your album design',
        'Placing your first order'
      ]
    },
    {
      title: 'Design & Editing',
      description: 'Tips and tricks for designing beautiful albums',
      icon: '🎨',
      articles: [
        'Photo layout options',
        'Adding text and captions',
        'Color correction tools',
        'Background customization'
      ]
    },
    {
      title: 'Orders & Shipping',
      description: 'Everything about ordering and delivery',
      icon: '📦',
      articles: [
        'Order status tracking',
        'Shipping options',
        'Return policy',
        'Payment methods'
      ]
    },
    {
      title: 'Account & Billing',
      description: 'Manage your account and billing information',
      icon: '👤',
      articles: [
        'Account settings',
        'Billing history',
        'Subscription management',
        'Password reset'
      ]
    }
  ];

  const popularArticles = [
    {
      title: 'How to create a wedding album',
      views: '2.3k views',
      category: 'Tutorials'
    },
    {
      title: 'Photo resolution requirements',
      views: '1.8k views',
      category: 'Technical'
    },
    {
      title: 'Bulk order discounts',
      views: '1.5k views',
      category: 'Pricing'
    },
    {
      title: 'Troubleshooting upload issues',
      views: '1.2k views',
      category: 'Support'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Help Center
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to your questions and get the help you need to create amazing photo albums.
              Browse our comprehensive guides or contact our support team.
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Search Our Knowledge Base
            </h2>
            <div className="max-w-md mx-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="What can we help you with?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button className="absolute right-2 top-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-2 rounded-lg hover:from-purple-700 hover:to-blue-700">
                  🔍
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Browse by Category
          </h2>
          <p className="text-xl text-gray-600">
            Find help articles organized by topic
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {helpCategories.map((category) => (
            <div key={category.title} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-4">{category.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {category.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {category.description}
              </p>
              <ul className="space-y-2 mb-4">
                {category.articles.slice(0, 3).map((article) => (
                  <li key={article} className="text-sm text-purple-600 hover:text-purple-800 cursor-pointer">
                    • {article}
                  </li>
                ))}
              </ul>
              <button className="text-purple-600 hover:text-purple-800 font-medium">
                View all articles →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Articles */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Articles
            </h2>
            <p className="text-xl text-gray-600">
              Most viewed help articles this month
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularArticles.map((article, index) => (
              <div key={article.title} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {article.title}
                </h3>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>{article.category}</span>
                  <span>{article.views}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Support */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white text-center">
          <div className="text-6xl mb-4">💬</div>
          <h2 className="text-3xl font-bold mb-4">
            Still Need Help?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Our support team is here to help. Get in touch with us and we&apos;ll respond within 24 hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/faq"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-purple-600 transition-colors"
            >
              View FAQ
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Quick Links
            </h2>
            <p className="text-xl text-gray-600">
              Frequently accessed resources
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-2">📋</div>
              <h3 className="font-semibold text-gray-900 mb-1">Order Status</h3>
              <p className="text-sm text-gray-600">Track your orders</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">💳</div>
              <h3 className="font-semibold text-gray-900 mb-1">Billing</h3>
              <p className="text-sm text-gray-600">Payment & invoices</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🔄</div>
              <h3 className="font-semibold text-gray-900 mb-1">Returns</h3>
              <p className="text-sm text-gray-600">Return policy</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-2">🛡️</div>
              <h3 className="font-semibold text-gray-900 mb-1">Security</h3>
              <p className="text-sm text-gray-600">Data protection</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
