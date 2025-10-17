// API utility functions for making requests to our backend

import type { CreateAlbumForm, Album, AlbumView, Photo, Order, User, UploadResponse, PaginatedResponse } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

// API Response types
interface AlbumResponse {
  album: AlbumView;
  userRole: 'owner' | 'collaborator' | 'viewer';
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const response = await fetch(url, {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Album API functions
export const albumApi = {
  getAlbums: (filters?: { search?: string; privacy?: string; page?: number; limit?: number }): Promise<PaginatedResponse<Album>> => {
    const params = new URLSearchParams();
    if (filters?.search) params.append('search', filters.search);
    if (filters?.privacy) params.append('privacy', filters.privacy);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    return apiRequest(`/api/albums?${params.toString()}`);
  },

  getAlbum: (id: string, password?: string): Promise<AlbumResponse> => {
    const params = new URLSearchParams();
    if (password) params.append('password', password);

    return apiRequest(`/api/albums/${id}?${params.toString()}`);
  },

  createAlbum: (data: CreateAlbumForm): Promise<Album> => {
    return apiRequest('/api/albums', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateAlbum: (id: string, data: Partial<CreateAlbumForm>): Promise<Album> => {
    return apiRequest(`/api/albums/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  deleteAlbum: (id: string): Promise<{ success: boolean }> => {
    return apiRequest(`/api/albums/${id}`, {
      method: 'DELETE',
    });
  },
};

// Photo API functions
export const photoApi = {
  uploadPhoto: (file: File, albumId: string, caption?: string, tags?: string): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('albumId', albumId);
    if (caption) formData.append('caption', caption);
    if (tags) formData.append('tags', tags);

    return apiRequest('/api/photos/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type header to let browser set it
    });
  },

  deletePhoto: (photoId: string): Promise<{ success: boolean }> => {
    return apiRequest(`/api/photos/delete?photoId=${photoId}`, {
      method: 'DELETE',
    });
  },

  updatePhoto: (photoId: string, data: { caption?: string; tags?: string[] }): Promise<Photo> => {
    return apiRequest(`/api/photos/${photoId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Order API functions
export const orderApi = {
  getOrders: (): Promise<Order[]> => {
    return apiRequest('/api/orders');
  },

  getOrder: (id: string): Promise<Order> => {
    return apiRequest(`/api/orders/${id}`);
  },

  createOrder: (data: Partial<Order>): Promise<Order> => {
    return apiRequest('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  updateOrderStatus: (id: string, status: string): Promise<Order> => {
    return apiRequest(`/api/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },
};

// User API functions
export const userApi = {
  getProfile: (): Promise<User> => {
    return apiRequest('/api/user/profile');
  },

  updateProfile: (data: Partial<User>): Promise<User> => {
    return apiRequest('/api/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  updatePassword: (data: { currentPassword: string; newPassword: string }): Promise<{ success: boolean }> => {
    return apiRequest('/api/user/password', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// Error handling utility
export const handleApiError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// File upload progress tracking
export const uploadWithProgress = (
  file: File,
  albumId: string,
  onProgress?: (progress: number) => void
): Promise<UploadResponse> => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('albumId', albumId);

    const xhr = new XMLHttpRequest();

    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          onProgress(progress);
        }
      });
    }

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (e) {
          console.error('Response parsing error:', e);
          reject(new Error('Invalid response format'));
        }
      } else {
        reject(new Error(`Upload failed with status: ${xhr.status}`));
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed'));
    });

    xhr.open('POST', '/api/photos/upload');
    xhr.send(formData);
  });
};
