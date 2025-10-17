'use client';

export default function CookiesPage() {
  const cookieTypes = [
    {
      title: 'Essential Cookies',
      description: 'These cookies are necessary for the website to function and cannot be switched off in our systems.',
      purpose: 'Enable core functionality like security, network management, and accessibility',
      duration: 'Session or persistent (varies)',
      required: true
    },
    {
      title: 'Analytics Cookies',
      description: 'These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.',
      purpose: 'Help us understand how visitors interact with our website',
      duration: '2 years',
      required: false
    },
    {
      title: 'Functional Cookies',
      description: 'These cookies enable the website to provide enhanced functionality and personalization.',
      purpose: 'Remember choices you make and provide enhanced features',
      duration: '1 year',
      required: false
    },
    {
      title: 'Marketing Cookies',
      description: 'These cookies may be set through our site by our advertising partners to build a profile of your interests.',
      purpose: 'Deliver advertisements relevant to your interests',
      duration: '90 days',
      required: false
    }
  ];

  const specificCookies = [
    { name: 'session_id', purpose: 'Maintains user session', type: 'Essential', duration: 'Session' },
    { name: '_ga', purpose: 'Google Analytics tracking', type: 'Analytics', duration: '2 years' },
    { name: 'theme_preference', purpose: 'Remembers theme choice', type: 'Functional', duration: '1 year' },
    { name: 'cart_contents', purpose: 'Stores shopping cart items', type: 'Functional', duration: '30 days' },
    { name: 'marketing_consent', purpose: 'Tracks marketing preferences', type: 'Marketing', duration: '1 year' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Cookie Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              This cookie policy explains how PhotoHub uses cookies and similar technologies to improve your experience.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: October 16, 2025
            </p>
          </div>
        </div>
      </div>

      {/* Cookie Policy Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            What Are Cookies?
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Cookies are small text files that are placed on your computer or mobile device when you visit our website.
            They allow us to remember your preferences, analyze site traffic, and personalize your experience.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Cookies help us provide you with a better browsing experience and allow certain features of our website to work properly.
            We use both our own cookies and third-party cookies from trusted partners.
          </p>
        </div>

        {/* Cookie Types */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Types of Cookies We Use
          </h2>
          <div className="space-y-6">
            {cookieTypes.map((cookieType) => (
              <div key={cookieType.title} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {cookieType.title}
                  </h3>
                  {cookieType.required && (
                    <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
                      Required
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-3">
                  {cookieType.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong className="text-gray-900">Purpose:</strong>
                    <div className="text-gray-600 mt-1">{cookieType.purpose}</div>
                  </div>
                  <div>
                    <strong className="text-gray-900">Duration:</strong>
                    <div className="text-gray-600 mt-1">{cookieType.duration}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Specific Cookies */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Specific Cookies We Use
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Cookie Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Purpose</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Type</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-900">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {specificCookies.map((cookie) => (
                  <tr key={cookie.name}>
                    <td className="px-4 py-3 font-mono text-sm text-gray-900">
                      {cookie.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {cookie.purpose}
                    </td>
                    <td className="px-4 py-3">
                      <span className="bg-purple-100 text-purple-800 text-sm px-2 py-1 rounded">
                        {cookie.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {cookie.duration}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Managing Cookies */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Managing Your Cookie Preferences
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Browser Settings
              </h3>
              <p className="text-gray-600">
                You can control and delete cookies through your browser settings. Most browsers allow you to refuse cookies
                or alert you when cookies are being sent. However, disabling essential cookies may affect website functionality.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Cookie Consent Banner
              </h3>
              <p className="text-gray-600">
                When you first visit our website, you&apos;ll see a cookie consent banner where you can choose which types of
                cookies to accept. You can change these preferences at any time by clicking the cookie settings link in our footer.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Opting Out
              </h3>
              <p className="text-gray-600">
                For analytics and marketing cookies, you can opt out by adjusting your preferences in our cookie settings
                or by visiting the privacy settings of third-party services like Google Analytics.
              </p>
            </div>
          </div>
        </div>

        {/* Third-Party Cookies */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Third-Party Cookies
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We use third-party services that may set their own cookies. These include:
          </p>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <div className="text-purple-600 mr-3 mt-1">•</div>
              <div><strong>Google Analytics:</strong> For website analytics and performance monitoring</div>
            </li>
            <li className="flex items-start">
              <div className="text-purple-600 mr-3 mt-1">•</div>
              <div><strong>Stripe:</strong> For secure payment processing</div>
            </li>
            <li className="flex items-start">
              <div className="text-purple-600 mr-3 mt-1">•</div>
              <div><strong>Cloudinary:</strong> For image upload and processing</div>
            </li>
          </ul>
          <p className="text-gray-600 leading-relaxed mt-4">
            These third parties have their own privacy policies and cookie practices. We encourage you to review their policies.
          </p>
        </div>

        {/* Updates */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Updates to This Policy
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational,
            legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on this page
            and updating the &quot;Last updated&quot; date.
          </p>
        </div>

        {/* Contact */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white text-center">
          <div className="text-6xl mb-4">🍪</div>
          <h2 className="text-3xl font-bold mb-4">
            Questions About Cookies?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            If you have any questions about our use of cookies or &quot;this policy&quot;, please contact us:
          </p>
          <div className="space-y-2">
            <div className="font-medium">Email: privacy@photohub.com</div>
            <div className="font-medium">Phone: 1-800-COOKIE-HELP</div>
          </div>
        </div>
      </div>
    </div>
  );
}
