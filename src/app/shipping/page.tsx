'use client';

export default function ShippingPage() {
  const shippingOptions = [
    {
      name: 'Standard Shipping',
      time: '5-7 business days',
      cost: 'Free on orders over $50',
      description: 'Reliable delivery for most orders',
      icon: '📦'
    },
    {
      name: 'Express Shipping',
      time: '2-3 business days',
      cost: '$15.99',
      description: 'Faster delivery for urgent orders',
      icon: '🚚'
    },
    {
      name: 'Overnight Shipping',
      time: '1 business day',
      cost: '$29.99',
      description: 'Next business day delivery',
      icon: '✈️'
    },
    {
      name: 'White Glove Service',
      time: '3-5 business days',
      cost: '$49.99',
      description: 'Personal delivery and setup included',
      icon: '🤝'
    }
  ];

  const shippingRegions = [
    {
      region: 'United States',
      standard: '5-7 days',
      express: '2-3 days',
      overnight: '1 day'
    },
    {
      region: 'Canada',
      standard: '7-10 days',
      express: '3-5 days',
      overnight: '2 days'
    },
    {
      region: 'Europe',
      standard: '10-14 days',
      express: '5-7 days',
      overnight: '3-4 days'
    },
    {
      region: 'Asia Pacific',
      standard: '14-21 days',
      express: '7-10 days',
      overnight: '5-7 days'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Shipping & Delivery
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Fast, reliable shipping options to get your beautiful photo albums delivered safely.
              We partner with trusted carriers to ensure your precious memories arrive in perfect condition.
            </p>
          </div>
        </div>
      </div>

      {/* Shipping Options */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Shipping Options
          </h2>
          <p className="text-xl text-gray-600">
            Choose the delivery method that works best for you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {shippingOptions.map((option) => (
            <div key={option.name} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="text-4xl mb-4">{option.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {option.name}
              </h3>
              <div className="text-purple-600 font-medium mb-2">
                {option.time}
              </div>
              <div className="text-gray-900 font-semibold mb-3">
                {option.cost}
              </div>
              <p className="text-gray-600 text-sm">
                {option.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Times by Region */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Delivery Times by Region
            </h2>
            <p className="text-xl text-gray-600">
              Estimated delivery times for different shipping methods
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-xl shadow-lg">
              <thead className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Region</th>
                  <th className="px-6 py-4 text-left font-semibold">Standard</th>
                  <th className="px-6 py-4 text-left font-semibold">Express</th>
                  <th className="px-6 py-4 text-left font-semibold">Overnight</th>
                </tr>
              </thead>
              <tbody>
                {shippingRegions.map((region) => (
                  <tr key={region.region} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {region.region}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {region.standard}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {region.express}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {region.overnight}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Packaging & Protection */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Premium Packaging & Protection
          </h2>
          <p className="text-xl text-gray-600">
            Your photo albums are protected with professional packaging
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Secure Packaging
            </h3>
            <p className="text-gray-600">
              Each album is individually wrapped and placed in a reinforced cardboard box.
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">🛡️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Damage Protection
            </h3>
            <p className="text-gray-600">
              Bubble wrap and foam padding protect against bumps and drops during transit.
            </p>
          </div>
          <div className="text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Tracking & Insurance
            </h3>
            <p className="text-gray-600">
              Full tracking information and insurance coverage for peace of mind.
            </p>
          </div>
        </div>
      </div>

      {/* Shipping Policy */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Shipping Policy
            </h2>
            <p className="text-xl text-gray-600">
              Important information about our shipping practices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Processing Time
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Orders are processed within 1-2 business days</li>
                <li>• Custom albums may take 2-3 business days</li>
                <li>• Rush orders available for additional fee</li>
                <li>• Processing begins after payment confirmation</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Important Notes
              </h3>
              <ul className="space-y-2 text-gray-600">
                <li>• Delivery times exclude weekends and holidays</li>
                <li>• Remote areas may have extended delivery times</li>
                <li>• Signature may be required for high-value orders</li>
                <li>• We ship Monday through Friday only</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
