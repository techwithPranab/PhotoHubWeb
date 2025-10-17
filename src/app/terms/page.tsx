'use client';

export default function TermsPage() {
  const sections = [
    {
      title: 'Acceptance of Terms',
      content: 'By accessing and using PhotoHub, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.'
    },
    {
      title: 'Use License',
      content: 'Permission is granted to temporarily access the materials (information or software) on PhotoHub\'s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not: modify or copy the materials; use the materials for any commercial purpose or for any public display; attempt to decompile or reverse engineer any software contained on PhotoHub\'s website; remove any copyright or other proprietary notations from the materials.'
    },
    {
      title: 'User Account',
      content: 'When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account. You agree not to disclose your password to any third party.'
    },
    {
      title: 'Content Ownership',
      content: 'You retain ownership of the photos and content you upload to our platform. By uploading content, you grant PhotoHub a license to use, reproduce, and display your content solely for the purpose of providing our services and creating your photo albums.'
    },
    {
      title: 'Prohibited Uses',
      content: 'You may not use our services: for any unlawful purpose or to solicit others to perform unlawful acts; to violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances; to infringe upon or violate our intellectual property rights or the intellectual property rights of others; to harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate; to submit false or misleading information.'
    },
    {
      title: 'Service Availability',
      content: 'We reserve the right to withdraw or amend our service, and any service or material we provide on the website, in our sole discretion without notice. We will not be liable if for any reason all or any part of the website is unavailable at any time or for any period.'
    },
    {
      title: 'Pricing and Payment',
      content: 'All prices are subject to change without notice. We reserve the right to correct pricing errors. Payment is due at the time of order. We accept major credit cards and PayPal. All payments are processed securely.'
    },
    {
      title: 'Returns and Refunds',
      content: 'We offer a 30-day satisfaction guarantee. If you are not completely satisfied with your photo album, we will provide a full refund or reprint at no additional cost. Custom orders may have different return policies.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Please read these terms of service carefully before using our photo album creation services.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: October 16, 2025
            </p>
          </div>
        </div>
      </div>

      {/* Terms Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Agreement Overview
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            These Terms of Service (&quot;Terms&quot;) govern your use of PhotoHub&apos;s website and services. By using our platform,
            you agree to these Terms. If you disagree with any part of these terms, please do not use our services.
          </p>
          <p className="text-gray-600 leading-relaxed">
            PhotoHub provides online tools for creating custom photo albums. Our services include photo upload,
            album design tools, and professional printing services.
          </p>
        </div>

        {/* Terms Sections */}
        {sections.map((section, index) => (
          <div key={section.title} className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {index + 1}. {section.title}
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {section.content}
            </p>
          </div>
        ))}

        {/* Intellectual Property */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            9. Intellectual Property Rights
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            The website and its original content, features, and functionality are and will remain the exclusive property of PhotoHub and its licensors.
            The website is protected by copyright, trademark, and other laws.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
          </p>
        </div>

        {/* Limitation of Liability */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            10. Limitation of Liability
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            In no event shall PhotoHub, nor its directors, employees, partners, agents, suppliers, or affiliates,
            be liable for any indirect, incidental, special, consequential, or punitive damages, including without
            limitation, loss of profits, data, use, goodwill, or other intangible losses.
          </p>
          <p className="text-gray-600 leading-relaxed">
            The limitations and prohibitions of liability set in this Section and elsewhere in this agreement
            are subject to the preceding paragraph and shall apply to the fullest extent permitted by law.
          </p>
        </div>

        {/* Termination */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            11. Termination
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            We may terminate or suspend your account immediately, without prior notice or liability,
            for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Upon termination, your right to use the service will cease immediately. If you wish to terminate
            your account, you may simply discontinue using the service.
          </p>
        </div>

        {/* Governing Law */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            12. Governing Law
          </h2>
          <p className="text-gray-600 leading-relaxed">
            These Terms shall be interpreted and governed by the laws of the jurisdiction in which PhotoHub operates,
            without regard to its conflict of law provisions. Our failure to enforce any right or provision of these
            Terms will not be considered a waiver of those rights.
          </p>
        </div>

        {/* Changes to Terms */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            13. Changes to Terms
          </h2>
          <p className="text-gray-600 leading-relaxed">
            We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
            If a revision is material, we will try to provide at least 30 days notice prior to any new terms taking effect.
            What constitutes a material change will be determined at our sole discretion.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white text-center">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-3xl font-bold mb-4">
            Questions About Terms?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            If you have any questions about these Terms of Service, please contact us:
          </p>
          <div className="space-y-2">
            <div className="font-medium">Email: legal@photohub.com</div>
            <div className="font-medium">Phone: 1-800-LEGAL-HELP</div>
            <div className="font-medium">Address: 123 Legal Avenue, Compliance City, CC 12345</div>
          </div>
        </div>
      </div>
    </div>
  );
}
