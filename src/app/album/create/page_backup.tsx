'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CreateAlbumPage() {
  const { status } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    privacy: 'private' as 'public' | 'private' | 'password',
    password: '',
    layout: 'grid' as 'grid' | 'collage' | 'mixed',
    theme: {
      backgroundColor: '#ffffff',
      fontFamily: 'Inter',
      fontSize: 'medium'
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if not authenticated
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleThemeChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      theme: { ...prev.theme, [field]: value }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      setError('Album title is required');
      return;
    }

    if (formData.privacy === 'password' && !formData.password.trim()) {
      setError('Password is required for password-protected albums');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/albums', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create album');
      }

      const result = await response.json();
      router.push(`/album/${result.album.id}`);
    } catch (err) {
      console.error('Create album error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create album');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
              Create New Album
            </h1>
            <p className="text-gray-600">Design and organize your memories with style</p>
          </div>

          {error && (
            <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-6 flex items-center">
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Basic Information
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Album Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter a memorable title for your album"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Share the story behind your photos..."
                  />
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                Privacy Settings
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors cursor-pointer">
                  <input
                    id="privacy-private"
                    name="privacy"
                    type="radio"
                    value="private"
                    checked={formData.privacy === 'private'}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                  />
                  <label htmlFor="privacy-private" className="flex-1 cursor-pointer">
                    <span className="font-medium text-gray-900">Private</span>
                    <p className="text-sm text-gray-600 mt-1">Only you can view this album. Perfect for personal memories.</p>
                  </label>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors cursor-pointer">
                  <input
                    id="privacy-public"
                    name="privacy"
                    type="radio"
                    value="public"
                    checked={formData.privacy === 'public'}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                  />
                  <label htmlFor="privacy-public" className="flex-1 cursor-pointer">
                    <span className="font-medium text-gray-900">Public</span>
                    <p className="text-sm text-gray-600 mt-1">Anyone with the link can view. Great for sharing with friends and family.</p>
                  </label>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-purple-300 transition-colors cursor-pointer">
                  <input
                    id="privacy-password"
                    name="privacy"
                    type="radio"
                    value="password"
                    checked={formData.privacy === 'password'}
                    onChange={handleInputChange}
                    className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300"
                  />
                  <label htmlFor="privacy-password" className="flex-1 cursor-pointer">
                    <span className="font-medium text-gray-900">Password Protected</span>
                    <p className="text-sm text-gray-600 mt-1">Requires password to view. Extra security for sensitive content.</p>
                  </label>
                </div>

                {formData.privacy === 'password' && (
                  <div className="ml-7 mt-4">
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter a secure password"
                      className="block w-full max-w-sm px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Layout Options */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 border border-green-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                Layout Style
              </h3>
              
              <select
                name="layout"
                value={formData.layout}
                onChange={handleInputChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white"
              >
                <option value="grid">Grid Layout - Clean and organized</option>
                <option value="collage">Collage Layout - Creative and artistic</option>
                <option value="mixed">Mixed Layout - Best of both worlds</option>
              </select>
            </div>

            {/* Theme Customization */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                  </svg>
                </div>
                Theme Customization
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <div className="relative">
                    <input
                      type="color"
                      id="backgroundColor"
                      value={formData.theme.backgroundColor}
                      onChange={(e) => handleThemeChange('backgroundColor', e.target.value)}
                      className="block w-full h-12 border border-gray-300 rounded-xl cursor-pointer"
                    />
                    <div className="absolute inset-0 rounded-xl border-2 border-gray-300 pointer-events-none"></div>
                  </div>
                </div>

                <div>
                  <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700 mb-2">
                    Font Family
                  </label>
                  <select
                    id="fontFamily"
                    value={formData.theme.fontFamily}
                    onChange={(e) => handleThemeChange('fontFamily', e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white"
                  >
                    <option value="Inter">Inter - Modern</option>
                    <option value="Roboto">Roboto - Clean</option>
                    <option value="Open Sans">Open Sans - Friendly</option>
                    <option value="Playfair Display">Playfair Display - Elegant</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700 mb-2">
                    Font Size
                  </label>
                  <select
                    id="fontSize"
                    value={formData.theme.fontSize}
                    onChange={(e) => handleThemeChange('fontSize', e.target.value)}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200 bg-white"
                  >
                    <option value="small">Small - Compact</option>
                    <option value="medium">Medium - Balanced</option>
                    <option value="large">Large - Bold</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-4 pt-8">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-8 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Album...
                  </div>
                ) : (
                  'Create Album'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
