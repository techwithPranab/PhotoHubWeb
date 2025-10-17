'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { albumApi, handleApiError } from '@/lib/api';

type PrivacyType = 'public' | 'private' | 'password';
type LayoutType = 'grid' | 'collage' | 'mixed';

interface Album {
  id: string;
  title: string;
  description?: string;
  privacy: PrivacyType;
  password?: string;
  layout: LayoutType;
  theme: {
    backgroundColor: string;
    fontFamily: string;
    fontSize: string;
  };
  isPublished: boolean;
}

const privacyOptions = [
  { value: 'public', label: 'Public', description: 'Anyone can view this album' },
  { value: 'private', label: 'Private', description: 'Only you can view this album' },
  { value: 'password', label: 'Password Protected', description: 'Anyone with the password can view' },
];

const layoutOptions = [
  { value: 'grid', label: 'Grid Layout', description: 'Photos arranged in a regular grid' },
  { value: 'collage', label: 'Collage Layout', description: 'Photos arranged in an artistic collage' },
  { value: 'mixed', label: 'Mixed Layout', description: 'Combination of grid and collage styles' },
];

const themeOptions = {
  backgroundColor: [
    { value: '#ffffff', label: 'White' },
    { value: '#f8fafc', label: 'Light Gray' },
    { value: '#1f2937', label: 'Dark Gray' },
    { value: '#000000', label: 'Black' },
  ],
  fontFamily: [
    { value: 'Inter', label: 'Inter (Modern)' },
    { value: 'Georgia', label: 'Georgia (Classic)' },
    { value: 'Playfair Display', label: 'Playfair (Elegant)' },
    { value: 'Roboto', label: 'Roboto (Clean)' },
  ],
  fontSize: [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
  ],
};

export default function EditAlbumPage() {
  const params = useParams();
  const router = useRouter();
  const [album, setAlbum] = useState<Album | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    privacy: 'public' as PrivacyType,
    password: '',
    layout: 'grid' as LayoutType,
    theme: {
      backgroundColor: '#ffffff',
      fontFamily: 'Inter',
      fontSize: 'medium',
    },
    isPublished: false,
  });

  const albumId = params.id as string;

  useEffect(() => {
    if (albumId) {
      fetchAlbum();
    }
  }, [albumId]);

  const fetchAlbum = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await albumApi.getAlbum(albumId) as { album: Album };
      const albumData = response.album;
      
      setAlbum(albumData);
      setFormData({
        title: albumData.title,
        description: albumData.description || '',
        privacy: albumData.privacy,
        password: albumData.password || '',
        layout: albumData.layout,
        theme: albumData.theme,
        isPublished: albumData.isPublished,
      });
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
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

    try {
      setIsSaving(true);
      setError('');

      const updateData = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        privacy: formData.privacy,
        password: formData.privacy === 'password' ? formData.password : undefined,
        layout: formData.layout,
        theme: formData.theme,
        isPublished: formData.isPublished,
      };

      await albumApi.updateAlbum(albumId, updateData);
      
      // Redirect back to album view
      router.push(`/album/${albumId}`);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!globalThis.confirm('Are you sure you want to delete this album? This action cannot be undone.')) {
      return;
    }

    try {
      setIsSaving(true);
      await albumApi.deleteAlbum(albumId);
      router.push('/dashboard');
    } catch (err) {
      setError(handleApiError(err));
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error && !album) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 text-red-500">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Unable to Load Album</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => router.back()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Edit Album</h1>
          <button
            onClick={() => router.back()}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Album Title *
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter album title"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your album (optional)"
                />
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Privacy Settings</h2>
            <div className="space-y-4">
              {privacyOptions.map((option) => (
                <div key={option.value} className="flex items-start">
                  <input
                    type="radio"
                    id={`privacy-${option.value}`}
                    name="privacy"
                    value={option.value}
                    checked={formData.privacy === option.value}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      privacy: e.target.value as PrivacyType
                    }))}
                    className="mt-1 mr-3"
                  />
                  <div>
                    <label htmlFor={`privacy-${option.value}`} className="block text-sm font-medium text-gray-700">
                      {option.label}
                    </label>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                </div>
              ))}

              {formData.privacy === 'password' && (
                <div className="ml-6">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Album Password *
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full max-w-md px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter password"
                    required
                  />
                </div>
              )}
            </div>
          </div>

          {/* Layout Settings */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Layout & Theme</h2>
            
            <div className="mb-6">
              <span className="block text-sm font-medium text-gray-700 mb-3">Layout Style</span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4" role="radiogroup">
                {layoutOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`border rounded-lg p-4 cursor-pointer transition-colors text-left ${
                      formData.layout === option.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                    onClick={() => setFormData(prev => ({ ...prev, layout: option.value as LayoutType }))}
                  >
                    <input
                      type="radio"
                      name="layout"
                      value={option.value}
                      checked={formData.layout === option.value}
                      onChange={() => {}}
                      className="sr-only"
                    />
                    <h3 className="font-medium text-gray-900">{option.label}</h3>
                    <p className="text-sm text-gray-500 mt-1">{option.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-700 mb-2">Background Color</label>
                <select
                  id="backgroundColor"
                  value={formData.theme.backgroundColor}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    theme: { ...prev.theme, backgroundColor: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {themeOptions.backgroundColor.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="fontFamily" className="block text-sm font-medium text-gray-700 mb-2">Font Family</label>
                <select
                  id="fontFamily"
                  value={formData.theme.fontFamily}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    theme: { ...prev.theme, fontFamily: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {themeOptions.fontFamily.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="fontSize" className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                <select
                  id="fontSize"
                  value={formData.theme.fontSize}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    theme: { ...prev.theme, fontSize: e.target.value }
                  }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {themeOptions.fontSize.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Publish Settings */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Publish Settings</h2>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublished"
                checked={formData.isPublished}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                className="mr-3"
              />
              <div>
                <label htmlFor="isPublished" className="block text-sm font-medium text-gray-700">
                  Publish Album
                </label>
                <p className="text-sm text-gray-500">
                  Published albums are visible to others based on privacy settings
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            
            <button
              type="button"
              onClick={handleDelete}
              disabled={isSaving}
              className="flex-1 bg-red-600 text-white py-3 px-6 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Delete Album
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
