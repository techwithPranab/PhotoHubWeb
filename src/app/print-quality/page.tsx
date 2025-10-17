'use client';

export default function PrintQualityPage() {
  const qualityFeatures = [
    {
      title: 'Premium Photo Paper',
      description: 'We use only the highest quality photo paper with archival properties that will last for generations.',
      icon: '📄'
    },
    {
      title: 'Professional Printing',
      description: 'State-of-the-art printing technology ensures vibrant colors and sharp details in every photo.',
      icon: '🖨️'
    },
    {
      title: 'Color Accuracy',
      description: 'Advanced color management systems guarantee that your printed photos match your digital images.',
      icon: '🎨'
    },
    {
      title: 'Archival Quality',
      description: 'Our materials are rated to last 100+ years when properly stored, preserving your memories forever.',
      icon: '⏳'
    },
    {
      title: 'UV Protection',
      description: 'Special coatings protect against fading from UV light exposure.',
      icon: '☀️'
    },
    {
      title: 'Water Resistant',
      description: 'Durable covers and pages resist spills and moisture damage.',
      icon: '💧'
    }
  ];

  const paperTypes = [
    {
      name: 'Glossy Photo Paper',
      description: 'Vibrant colors and sharp details, perfect for most photo albums',
      bestFor: 'General photography, weddings, events'
    },
    {
      name: 'Matte Photo Paper',
      description: 'Elegant finish with reduced glare, ideal for professional presentations',
      bestFor: 'Portraits, fine art, exhibitions'
    },
    {
      name: 'Luster Photo Paper',
      description: 'Balance between glossy and matte, with enhanced color depth',
      bestFor: 'Nature photography, landscapes'
    },
    {
      name: 'Premium Art Paper',
      description: 'Museum-quality paper with exceptional texture and color reproduction',
      bestFor: 'Fine art photography, limited editions'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Premium Print Quality
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the difference that professional-grade printing makes. Our commitment to quality
              ensures your photo albums are not just beautiful, but built to last.
            </p>
          </div>
        </div>
      </div>

      {/* Quality Features */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Our Print Quality Matters
          </h2>
          <p className="text-xl text-gray-600">
            Every detail matters when preserving your precious memories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {qualityFeatures.map((feature) => (
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

      {/* Paper Types */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Premium Paper Options
            </h2>
            <p className="text-xl text-gray-600">
              Choose the perfect paper type for your photo album
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {paperTypes.map((paper) => (
              <div key={paper.name} className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 border border-purple-100">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                  {paper.name}
                </h3>
                <p className="text-gray-700 mb-4">
                  {paper.description}
                </p>
                <div className="text-sm text-purple-600 font-medium">
                  Best for: {paper.bestFor}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quality Guarantee */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white text-center">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-3xl font-bold mb-4">
            100% Quality Guarantee
          </h2>
          <p className="text-xl mb-6 opacity-90">
            If you&apos;re not completely satisfied with the print quality of your photo album,
            we&apos;ll reprint it at no additional cost or provide a full refund.
          </p>
          <div className="text-lg">
            <strong>Free quality check</strong> included with every order
          </div>
        </div>
      </div>

      {/* Technical Specifications */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Technical Specifications
            </h2>
            <p className="text-xl text-gray-600">
              Industry-leading standards for professional photo printing
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">1200</div>
              <div className="text-gray-900 font-medium">DPI Resolution</div>
              <div className="text-gray-600 text-sm">Ultra-high resolution printing</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">16.7M</div>
              <div className="text-gray-900 font-medium">Colors</div>
              <div className="text-gray-600 text-sm">True color reproduction</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">100+</div>
              <div className="text-gray-900 font-medium">Years</div>
              <div className="text-gray-600 text-sm">Archival quality lifespan</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">ISO</div>
              <div className="text-gray-900 font-medium">Certified</div>
              <div className="text-gray-600 text-sm">Industry standards compliance</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
