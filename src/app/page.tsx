import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Mixbook Style */}
      <div className="relative bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center min-h-[80vh] py-12">
            {/* Left Content */}
            <div className="lg:w-1/2 lg:pr-12">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center bg-white rounded-full px-4 py-2 text-sm font-medium text-gray-800 shadow-sm mb-6">
                  ⭐ Rated #1 in photo books
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  Your memories deserve the{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                    perfect story
                  </span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Create stunning photo books, albums, and prints that bring your moments to life. 
                  Easy tools, beautiful designs, premium quality.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link
                    href="/albums"
                    className="inline-flex items-center justify-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Create Your Book
                    <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                  <Link
                    href="/features"
                    className="inline-flex items-center justify-center border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-gray-400 hover:bg-gray-50 transition-all duration-200"
                  >
                    See How It Works
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Right Image */}
            <div className="lg:w-1/2 mt-12 lg:mt-0">
              <div className="relative">
                <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-300">
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-4 flex items-center justify-center">
                    <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4 transform -rotate-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Categories - Mixbook Style */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Pick the perfect way to tell your story
            </h2>
            <p className="text-xl text-gray-600">
              From photo books to home decor, we have everything you need
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { id: 'books', title: 'Photo Books', subtitle: 'Classic & premium', icon: '📖', color: 'from-pink-400 to-rose-400' },
              { id: 'decor', title: 'Home Decor', subtitle: 'Canvas & prints', icon: '🖼️', color: 'from-blue-400 to-indigo-400' },
              { id: 'cards', title: 'Cards', subtitle: 'Special occasions', icon: '💌', color: 'from-green-400 to-emerald-400' },
              { id: 'calendars', title: 'Calendars', subtitle: 'Year-round memories', icon: '📅', color: 'from-purple-400 to-violet-400' },
            ].map((category) => (
              <Link key={category.id} href="/albums" className="group">
                <div className="relative overflow-hidden rounded-2xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2">
                  <div className={`h-48 bg-gradient-to-br ${category.color} flex items-center justify-center text-6xl`}>
                    {category.icon}
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h3>
                    <p className="text-gray-600">{category.subtitle}</p>
                  </div>
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Creating is fun & easy with PhotoHub
            </h2>
            <p className="text-xl text-gray-600">
              Powered by intelligent design tools and premium quality
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {[
              {
                id: 'story',
                title: 'Tell your story, your way',
                description: 'Have fun creating with our easy-to-use design tools and beautiful templates.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                )
              },
              {
                id: 'designs',
                title: 'Unrivaled designs',
                description: 'Choose from hundreds of professionally designed themes and layouts.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                )
              },
              {
                id: 'quality',
                title: 'Remarkably crafted',
                description: 'Premium materials and printing technology for stunning results every time.',
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                )
              }
            ].map((feature) => (
              <div key={feature.id} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">1M+</div>
              <div className="text-gray-600">Happy customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">5M+</div>
              <div className="text-gray-600">Books created</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-gray-900 mb-2">4.9★</div>
              <div className="text-gray-600">Average rating</div>
            </div>
          </div>
          
          <blockquote className="text-2xl text-gray-600 italic mb-8">
            &ldquo;PhotoHub&apos;s online tool is unmatched in ease of use.&rdquo;
          </blockquote>
          
          <div className="flex justify-center space-x-1 mb-4">
            {Array.from({ length: 5 }, (_, i) => (
              <svg key={`star-${i + 1}`} className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-6">
            So easy to make, it&apos;s fun
          </h2>
          <p className="text-xl text-purple-100 mb-10">
            Join millions who trust PhotoHub with their most precious memories
          </p>
          <Link
            href="/register"
            className="inline-flex items-center justify-center bg-white text-purple-600 px-10 py-4 rounded-lg text-xl font-bold hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Create Your Photo Book
            <svg className="ml-3 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
