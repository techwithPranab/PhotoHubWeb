'use client';

export default function PrivacyPage() {
  const sections = [
    {
      title: 'Information We Collect',
      content: [
        'Personal information you provide (name, email, shipping address)',
        'Payment information processed securely through our payment partners',
        'Photos and design files you upload to create albums',
        'Usage data and analytics to improve our services',
        'Communication preferences and feedback'
      ]
    },
    {
      title: 'How We Use Your Information',
      content: [
        'Process and fulfill your orders',
        'Provide customer support and respond to inquiries',
        'Send order confirmations, shipping updates, and important service notifications',
        'Improve our website and services based on usage patterns',
        'Send marketing communications (with your consent)',
        'Ensure security and prevent fraud'
      ]
    },
    {
      title: 'Information Sharing',
      content: [
        'We do not sell, trade, or rent your personal information to third parties',
        'We may share information with trusted service providers who assist our operations',
        'Legal requirements: We may disclose information if required by law',
        'Business transfers: In case of merger, acquisition, or sale of assets',
        'With your explicit consent for specific purposes'
      ]
    },
    {
      title: 'Data Security',
      content: [
        'Industry-standard encryption for all data transmission',
        'Secure servers with regular security audits',
        'Limited access to personal information on a need-to-know basis',
        'Regular backups and disaster recovery procedures',
        'Employee training on data protection practices'
      ]
    },
    {
      title: 'Your Rights',
      content: [
        'Access: Request a copy of your personal information',
        'Correction: Update or correct inaccurate information',
        'Deletion: Request deletion of your personal data',
        'Portability: Receive your data in a structured format',
        'Opt-out: Unsubscribe from marketing communications',
        'Restriction: Limit how we process your information'
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
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: October 16, 2025
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Our Commitment to Privacy
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            PhotoHub is committed to protecting your privacy and ensuring the security of your personal information.
            This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services.
          </p>
          <p className="text-gray-600 leading-relaxed">
            By using our services, you agree to the collection and use of information in accordance with this policy.
            We will not use or share your information with anyone except as described in this Privacy Policy.
          </p>
        </div>

        {/* Policy Sections */}
        {sections.map((section, index) => (
          <div key={section.title} className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {index + 1}. {section.title}
            </h2>
            <ul className="space-y-3">
              {section.content.map((item) => (
                <li key={item} className="flex items-start">
                  <div className="text-purple-600 mr-3 mt-1">•</div>
                  <div className="text-gray-600 leading-relaxed">
                    {item}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Cookies */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            6. Cookies and Tracking Technologies
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We use cookies and similar technologies to enhance your experience on our website:
          </p>
          <ul className="space-y-3 mb-4">
            <li className="flex items-start">
              <div className="text-purple-600 mr-3 mt-1">•</div>
              <div className="text-gray-600 leading-relaxed">
                <strong>Essential cookies:</strong> Required for website functionality
              </div>
            </li>
            <li className="flex items-start">
              <div className="text-purple-600 mr-3 mt-1">•</div>
              <div className="text-gray-600 leading-relaxed">
                <strong>Analytics cookies:</strong> Help us understand how you use our site
              </div>
            </li>
            <li className="flex items-start">
              <div className="text-purple-600 mr-3 mt-1">•</div>
              <div className="text-gray-600 leading-relaxed">
                <strong>Marketing cookies:</strong> Used to show relevant advertisements
              </div>
            </li>
          </ul>
          <p className="text-gray-600 leading-relaxed">
            You can control cookie preferences through your browser settings. However, disabling certain cookies may affect website functionality.
          </p>
        </div>

        {/* Children's Privacy */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            7. Children&apos;s Privacy
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information promptly.
          </p>
        </div>

        {/* Changes to Policy */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            8. Changes to This Privacy Policy
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
            You are advised to review this Privacy Policy periodically for any changes.
          </p>
        </div>

        {/* Contact Us */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white text-center">
          <div className="text-6xl mb-4">📞</div>
          <h2 className="text-3xl font-bold mb-4">
            Questions About Privacy?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            If you have any questions about this Privacy Policy or our data practices, please contact us:
          </p>
          <div className="space-y-2">
            <div className="font-medium">Email: privacy@photohub.com</div>
            <div className="font-medium">Phone: 1-800-PRIVACY</div>
            <div className="font-medium">Address: 123 Privacy Street, Secure City, SC 12345</div>
          </div>
        </div>
      </div>
    </div>
  );
}
