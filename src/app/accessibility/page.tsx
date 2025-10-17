'use client';

export default function AccessibilityPage() {
  const accessibilityFeatures = [
    {
      title: 'Screen Reader Support',
      description: 'Our website is fully compatible with popular screen readers including JAWS, NVDA, and VoiceOver.',
      icon: '🔊'
    },
    {
      title: 'Keyboard Navigation',
      description: 'Navigate through all interactive elements using only the keyboard with proper focus indicators.',
      icon: '⌨️'
    },
    {
      title: 'High Contrast Mode',
      description: 'Support for high contrast themes and sufficient color contrast ratios throughout the site.',
      icon: '🎨'
    },
    {
      title: 'Alternative Text',
      description: 'All images include descriptive alt text to ensure screen reader users understand visual content.',
      icon: '📝'
    },
    {
      title: 'Semantic HTML',
      description: 'Proper use of HTML5 semantic elements for better screen reader navigation and understanding.',
      icon: '🏗️'
    },
    {
      title: 'Resizable Text',
      description: 'Text can be resized up to 200% without loss of functionality or content.',
      icon: '🔍'
    }
  ];

  const standards = [
    'WCAG 2.1 AA compliance',
    'Section 508 compliance',
    'ADA compliance',
    'EN 301 549 compliance'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Accessibility Statement
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              PhotoHub is committed to ensuring digital accessibility for people with disabilities.
              We are continually improving the user experience for everyone.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: October 16, 2025
            </p>
          </div>
        </div>
      </div>

      {/* Commitment Statement */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className="text-6xl mb-4">♿</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Accessibility Commitment
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
              At PhotoHub, we believe that creating beautiful photo albums should be accessible to everyone,
              regardless of ability. We are dedicated to providing an inclusive digital experience that meets
              or exceeds accessibility standards and guidelines.
            </p>
          </div>
        </div>

        {/* Accessibility Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Accessibility Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {accessibilityFeatures.map((feature) => (
              <div key={feature.title} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Standards Compliance */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Standards Compliance
          </h2>
          <p className="text-xl text-gray-600 text-center mb-8">
            We adhere to internationally recognized accessibility standards:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {standards.map((standard) => (
              <div key={standard} className="text-center">
                <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-4">
                  <div className="text-2xl mb-2">✅</div>
                  <div className="font-semibold text-gray-900">{standard}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to Use Accessibility Features */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            How to Use Our Accessibility Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Keyboard Shortcuts
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li><strong>Tab:</strong> Navigate through interactive elements</li>
                <li><strong>Enter/Space:</strong> Activate buttons and links</li>
                <li><strong>Escape:</strong> Close modals and menus</li>
                <li><strong>Arrow keys:</strong> Navigate within form controls</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Browser Settings
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li><strong>Zoom:</strong> Use Ctrl/Cmd + + to zoom in</li>
                <li><strong>High Contrast:</strong> Enable in browser settings</li>
                <li><strong>Screen Reader:</strong> Compatible with all major readers</li>
                <li><strong>Focus Indicators:</strong> Always visible for navigation</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Feedback and Support */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white">
          <div className="text-center">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-3xl font-bold mb-4">
              Accessibility Feedback
            </h2>
            <p className="text-xl mb-6 opacity-90">
              We continuously work to improve accessibility. If you encounter any barriers or have suggestions,
              please let us know. Your feedback helps us serve everyone better.
            </p>
            <div className="space-y-4">
              <div>
                <strong className="text-lg">Accessibility Support Email:</strong>
                <div className="text-purple-200">accessibility@photohub.com</div>
              </div>
              <div>
                <strong className="text-lg">Response Time:</strong>
                <div className="text-purple-200">We respond to accessibility concerns within 48 hours</div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="mt-8 bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Additional Resources
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🌐</div>
              <h3 className="font-semibold text-gray-900 mb-2">WCAG Guidelines</h3>
              <p className="text-gray-600 text-sm">
                Web Content Accessibility Guidelines
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">📚</div>
              <h3 className="font-semibold text-gray-900 mb-2">Accessibility Resources</h3>
              <p className="text-gray-600 text-sm">
                Tools and guides for web accessibility
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold text-gray-900 mb-2">Testing Tools</h3>
              <p className="text-gray-600 text-sm">
                Free tools to test website accessibility
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
