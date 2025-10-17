'use client';

import Link from 'next/link';

export default function SitemapPage() {
  const sitemapSections = [
    {
      title: 'Main Pages',
      links: [
        { name: 'Home', url: '/' },
        { name: 'Features', url: '/features' },
        { name: 'Pricing', url: '/pricing' },
        { name: 'Contact', url: '/contact' }
      ]
    },
    {
      title: 'Products & Services',
      links: [
        { name: 'Templates', url: '/templates' },
        { name: 'Print Quality', url: '/print-quality' },
        { name: 'Shipping', url: '/shipping' },
        { name: 'Photo Albums', url: '/album' }
      ]
    },
    {
      title: 'Account & Orders',
      links: [
        { name: 'Dashboard', url: '/dashboard' },
        { name: 'Orders', url: '/orders' },
        { name: 'Login', url: '/auth/login' },
        { name: 'Register', url: '/auth/register' },
        { name: 'Forgot Password', url: '/auth/forgot-password' },
        { name: 'Reset Password', url: '/auth/reset-password' }
      ]
    },
    {
      title: 'Support & Legal',
      links: [
        { name: 'Help Center', url: '/help' },
        { name: 'FAQ', url: '/faq' },
        { name: 'Privacy Policy', url: '/privacy' },
        { name: 'Terms of Service', url: '/terms' },
        { name: 'Accessibility', url: '/accessibility' },
        { name: 'Cookie Policy', url: '/cookies' },
        { name: 'Security', url: '/security' }
      ]
    },
    {
      title: 'Admin',
      links: [
        { name: 'Admin Dashboard', url: '/admin' },
        { name: 'Order Management', url: '/admin/orders' }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Sitemap
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Navigate through all pages and sections of our website.
              Find exactly what you&apos;re looking for with our comprehensive site map.
            </p>
          </div>
        </div>
      </div>

      {/* Sitemap Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sitemapSections.map((section) => (
            <div key={section.title} className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-purple-200 pb-2">
                {section.title}
              </h2>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.url}>
                    <Link
                      href={link.url}
                      className="text-purple-600 hover:text-purple-800 hover:underline transition-colors duration-200 block py-1"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore PhotoHub
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Our website is designed to make creating beautiful photo albums as simple as possible.
              Whether you&apos;re a professional photographer or capturing family memories, we have everything you need.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl mb-2">📸</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Easy Upload
                </h3>
                <p className="text-gray-600">
                  Drag and drop your photos to get started
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🎨</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Professional Design
                </h3>
                <p className="text-gray-600">
                  Choose from templates or design your own
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">🚚</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Fast Shipping
                </h3>
                <p className="text-gray-600">
                  Premium printing with reliable delivery
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
              >
                Start Creating
              </Link>
              <Link
                href="/features"
                className="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-purple-600 hover:text-white transition-all duration-200"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>

        {/* XML Sitemap */}
        <div className="mt-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white text-center">
          <div className="text-4xl mb-4">📄</div>
          <h2 className="text-2xl font-bold mb-4">
            XML Sitemap
          </h2>
          <p className="mb-6 opacity-90">
            For search engines and developers, our XML sitemap is available at:
          </p>
          <div className="bg-white/10 rounded-lg p-4 font-mono text-sm">
            https://photohub.com/sitemap.xml
          </div>
        </div>
      </div>
    </div>
  );
}
