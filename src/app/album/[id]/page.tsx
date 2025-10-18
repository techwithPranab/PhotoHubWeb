'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PhotoUpload from '@/components/PhotoUpload';
import { albumApi, photoApi, handleApiError } from '@/lib/api';
import type { AlbumView, Photo } from '@/types';

export default function AlbumViewPage() {
  const params = useParams();
  const router = useRouter();
  const [album, setAlbum] = useState<AlbumView | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [passwordPrompt, setPasswordPrompt] = useState(false);
  const [password, setPassword] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const albumId = params.id as string;

  useEffect(() => {
    if (albumId && albumId !== 'undefined' && albumId.trim() !== '') {
      fetchAlbum();
    } else {
      setError('Invalid album ID');
      setIsLoading(false);
    }
  }, [albumId]);

  const fetchAlbum = async (albumPassword?: string) => {
    try {
      setIsLoading(true);
      setError('');
      
      const response = await albumApi.getAlbum(albumId, albumPassword);
      setAlbum(response.album);
      setPasswordPrompt(false);
    } catch (err) {
      const errorMessage = handleApiError(err);
      if (errorMessage.includes('Password required')) {
        setPasswordPrompt(true);
      } else if (errorMessage.includes('Invalid password')) {
        setError('Invalid password. Please try again.');
        setPasswordPrompt(true);
      } else if (errorMessage.includes('Access denied')) {
        setError('You do not have permission to view this album.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.trim()) {
      fetchAlbum(password);
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!globalThis.confirm('Are you sure you want to delete this photo?')) {
      return;
    }

    try {
      await photoApi.deletePhoto(photoId);
      
      // Update album state
      if (album) {
        const updatedPhotos = album.photos.filter(photo => photo.id !== photoId);
        setAlbum({
          ...album,
          photos: updatedPhotos,
          photoCount: updatedPhotos.length,
        });
      }
    } catch (err) {
      console.error('Delete photo error:', err);
      setError(handleApiError(err));
    }
  };

  const handleUploadComplete = () => {
    // Refresh album data
    fetchAlbum();
    setShowUpload(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (passwordPrompt) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Password Required</h2>
          <p className="text-gray-600 mb-6">
            This album is password protected. Please enter the password to view it.
          </p>
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Album Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter password"
                required
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
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

  if (!album) {
    return null;
  }

  const canEdit = album.userRole === 'owner' || album.userRole === 'collaborator';
  const canUpload = canEdit;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Album Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{album.title}</h1>
              {album.privacy === 'public' && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                  Public
                </span>
              )}
              {album.privacy === 'password' && (
                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                  Protected
                </span>
              )}
              {album.privacy === 'private' && (
                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm">
                  Private
                </span>
              )}
            </div>
            
            {album.description && (
              <p className="text-gray-600 mb-4">{album.description}</p>
            )}
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span>By {album.owner.name}</span>
              <span>•</span>
              <span>{album.photoCount} photos</span>
              <span>•</span>
              <span>Created {formatDate(album.createdAt)}</span>
              <span>•</span>
              <span>{album.viewCount} views</span>
            </div>
          </div>

          {canEdit && (
            <div className="flex gap-3">
              <button
                onClick={() => setShowUpload(!showUpload)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Add Photos
              </button>
              <Link
                href={`/editor/${album.id}`}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
              >
                Edit in Studio
              </Link>
              <Link
                href={`/order?albumId=${album.id}`}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-md hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-lg"
              >
                Order Now
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Upload Section */}
      {showUpload && canUpload && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upload Photos</h2>
            <button
              onClick={() => setShowUpload(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <PhotoUpload albumId={album.id} onUploadComplete={handleUploadComplete} />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}

      {/* Photos Grid */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Photos</h2>
        
        {album.photos.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
              <svg fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 className="text-base font-medium text-gray-900 mb-2">No photos yet</h3>
            <p className="text-gray-600 mb-4">
              {canUpload ? 'Start by uploading some photos to this album' : 'This album doesn\'t have any photos yet'}
            </p>
            {canUpload && (
              <button
                onClick={() => setShowUpload(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Upload Photos
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {album.photos.map((photo) => (
              <div key={photo.id} className="group relative">
                <button 
                  className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer w-full p-0 border-0"
                  onClick={() => setSelectedPhoto(photo)}
                >
                  <img
                    src={photo.thumbnailUrl}
                    alt={photo.caption || 'Photo'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </button>
                  
                  {canEdit && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePhoto(photo.id);
                      }}
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                
                {photo.caption && (
                  <p className="mt-2 text-sm text-gray-600 truncate">{photo.caption}</p>
                )}
                
                <div className="mt-1 text-xs text-gray-400">
                  {photo.metadata.width} × {photo.metadata.height} • {formatFileSize(photo.metadata.bytes)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-full overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">
                {selectedPhoto.caption || 'Photo'}
              </h3>
              <button
                onClick={() => setSelectedPhoto(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="p-4">
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.caption || 'Photo'}
                className="w-full h-auto max-h-96 object-contain mx-auto"
              />
              
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Dimensions:</span> {selectedPhoto.metadata.width} × {selectedPhoto.metadata.height}
                </div>
                <div>
                  <span className="font-medium">Size:</span> {formatFileSize(selectedPhoto.metadata.bytes)}
                </div>
                <div>
                  <span className="font-medium">Format:</span> {selectedPhoto.metadata.format.toUpperCase()}
                </div>
                <div>
                  <span className="font-medium">Uploaded:</span> {formatDate(selectedPhoto.createdAt)}
                </div>
              </div>
              
              {selectedPhoto.tags.length > 0 && (
                <div className="mt-4">
                  <span className="font-medium text-sm">Tags:</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedPhoto.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
