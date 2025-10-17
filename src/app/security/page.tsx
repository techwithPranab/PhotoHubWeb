'use client';

export default function SecurityPage() {
  const securityMeasures = [
    {
      title: 'SSL/TLS Encryption',
      description: 'All data transmission is encrypted using industry-standard SSL/TLS protocols.',
      icon: '🔒'
    },
    {
      title: 'Data Encryption at Rest',
      description: 'Your photos and personal information are encrypted when stored on our servers.',
      icon: '💾'
    },
    {
      title: 'Secure Payment Processing',
      description: 'Payments are processed through PCI DSS compliant gateways with tokenization.',
      icon: '💳'
    },
    {
      title: 'Multi-Factor Authentication',
      description: 'Optional two-factor authentication for enhanced account security.',
      icon: '🔐'
    },
    {
      title: 'Regular Security Audits',
      description: 'Independent security audits and penetration testing conducted regularly.',
      icon: '🔍'
    },
    {
      title: 'Access Controls',
      description: 'Role-based access controls ensure only authorized personnel can access data.',
      icon: '🚪'
    }
  ];

  const certifications = [
    'SOC 2 Type II compliant',
    'ISO 27001 certified',
    'PCI DSS Level 1 compliant',
    'GDPR compliant'
  ];

  const securityTips = [
    {
      title: 'Use Strong Passwords',
      tips: [
        'Use at least 12 characters',
        'Combine uppercase, lowercase, numbers, and symbols',
        'Avoid using personal information',
        'Use a unique password for each account'
      ]
    },
    {
      title: 'Enable Two-Factor Authentication',
      tips: [
        'Add an extra layer of security to your account',
        'Use authenticator apps like Google Authenticator',
        'Avoid SMS-based 2FA when possible',
        'Keep backup codes in a safe place'
      ]
    },
    {
      title: 'Be Vigilant Online',
      tips: [
        'Never share your password with anyone',
        'Log out when using public computers',
        'Be cautious of phishing emails',
        'Keep your devices and software updated'
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
              Security & Privacy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Your security is our top priority. Learn about the measures we take to protect your data and photos.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: October 16, 2025
            </p>
          </div>
        </div>
      </div>

      {/* Security Commitment */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🛡️</div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Security Commitment
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed max-w-4xl mx-auto">
              At PhotoHub, we employ industry-leading security practices to protect your personal information,
              photos, and payment data. We are committed to maintaining the highest standards of data security
              and privacy protection.
            </p>
          </div>
        </div>

        {/* Security Measures */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Security Measures We Implement
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {securityMeasures.map((measure) => (
              <div key={measure.title} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="text-4xl mb-4">{measure.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {measure.title}
                </h3>
                <p className="text-gray-600">
                  {measure.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Security Certifications & Compliance
          </h2>
          <p className="text-xl text-gray-600 text-center mb-8">
            We maintain the highest industry standards for security and compliance:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert) => (
              <div key={cert} className="text-center">
                <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-4">
                  <div className="text-2xl mb-2">✅</div>
                  <div className="font-semibold text-gray-900">{cert}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Best Practices */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Security Best Practices for Users
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {securityTips.map((section) => (
              <div key={section.title} className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.tips.map((tip) => (
                    <li key={tip} className="flex items-start">
                      <div className="text-purple-600 mr-3 mt-1">•</div>
                      <div className="text-gray-600 text-sm">
                        {tip}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Incident Response */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Incident Response & Breach Notification
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            In the unlikely event of a security incident, we have established procedures to:
          </p>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start">
              <div className="text-purple-600 mr-3 mt-1">•</div>
              <div>Respond quickly to contain and mitigate any security breaches</div>
            </li>
            <li className="flex items-start">
              <div className="text-purple-600 mr-3 mt-1">•</div>
              <div>Notify affected users within 72 hours of discovery</div>
            </li>
            <li className="flex items-start">
              <div className="text-purple-600 mr-3 mt-1">•</div>
              <div>Provide clear information about what happened and what we&apos;re doing</div>
            </li>
            <li className="flex items-start">
              <div className="text-purple-600 mr-3 mt-1">•</div>
              <div>Offer support and guidance to affected users</div>
            </li>
          </ul>
        </div>

        {/* Data Retention */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Data Retention & Deletion
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We retain your data only as long as necessary for the purposes outlined in our Privacy Policy:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Active Accounts</h3>
              <p className="text-gray-600 text-sm">
                Personal data is retained while your account is active and for 3 years after account closure for legal and tax purposes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Photo Data</h3>
              <p className="text-gray-600 text-sm">
                Photos are retained until you delete them or close your account. Backup copies may be retained for up to 30 days.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Security Team */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-3xl font-bold mb-4">
            Report Security Concerns
          </h2>
          <p className="text-xl mb-6 opacity-90">
            If you discover a security vulnerability or have concerns about your account security,
            please contact our security team immediately.
          </p>
          <div className="space-y-4">
            <div>
              <strong className="text-lg">Security Team Email:</strong>
              <div className="text-purple-200">security@photohub.com</div>
            </div>
            <div>
              <strong className="text-lg">Emergency Contact:</strong>
              <div className="text-purple-200">1-800-SECURITY (for urgent security issues)</div>
            </div>
            <div>
              <strong className="text-lg">PGP Key:</strong>
              <div className="text-purple-200 text-sm">Available for encrypted communications</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
