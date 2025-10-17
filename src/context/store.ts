import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'vendor';
  plan: 'free' | 'premium' | 'pro';
}

interface Album {
  id: string;
  title: string;
  description?: string;
  privacy: 'public' | 'private' | 'password';
  coverPhoto?: string;
  photoCount: number;
  createdAt: string;
}

interface Photo {
  id: string;
  url: string;
  thumbnailUrl: string;
  caption?: string;
  tags: string[];
  metadata: {
    width: number;
    height: number;
    format: string;
    bytes: number;
  };
  order: number;
  createdAt: string;
}

interface AppState {
  // User state
  user: User | null;
  setUser: (user: User | null) => void;

  // Albums state
  albums: Album[];
  setAlbums: (albums: Album[]) => void;
  addAlbum: (album: Album) => void;
  updateAlbum: (id: string, updates: Partial<Album>) => void;
  removeAlbum: (id: string) => void;

  // Current album state
  currentAlbum: (Album & { photos: Photo[] }) | null;
  setCurrentAlbum: (album: (Album & { photos: Photo[] }) | null) => void;

  // Photos state
  photos: Photo[];
  setPhotos: (photos: Photo[]) => void;
  addPhoto: (photo: Photo) => void;
  updatePhoto: (id: string, updates: Partial<Photo>) => void;
  removePhoto: (id: string) => void;
  reorderPhotos: (photos: Photo[]) => void;

  // Upload state
  isUploading: boolean;
  uploadProgress: { [key: string]: number };
  setUploading: (uploading: boolean) => void;
  setUploadProgress: (fileId: string, progress: number) => void;
  clearUploadProgress: () => void;

  // UI state
  isLoading: boolean;
  error: string | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Modal states
  showCreateAlbumModal: boolean;
  showUploadModal: boolean;
  showShareModal: boolean;
  selectedPhotos: string[];
  setShowCreateAlbumModal: (show: boolean) => void;
  setShowUploadModal: (show: boolean) => void;
  setShowShareModal: (show: boolean) => void;
  setSelectedPhotos: (photoIds: string[]) => void;
  togglePhotoSelection: (photoId: string) => void;
  clearSelection: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // User state
  user: null,
  setUser: (user) => set({ user }),

  // Albums state
  albums: [],
  setAlbums: (albums) => set({ albums }),
  addAlbum: (album) => set((state) => ({ albums: [album, ...state.albums] })),
  updateAlbum: (id, updates) => 
    set((state) => ({
      albums: state.albums.map((album) =>
        album.id === id ? { ...album, ...updates } : album
      ),
    })),
  removeAlbum: (id) =>
    set((state) => ({
      albums: state.albums.filter((album) => album.id !== id),
    })),

  // Current album state
  currentAlbum: null,
  setCurrentAlbum: (album) => set({ currentAlbum: album }),

  // Photos state
  photos: [],
  setPhotos: (photos) => set({ photos }),
  addPhoto: (photo) => set((state) => ({ photos: [...state.photos, photo] })),
  updatePhoto: (id, updates) =>
    set((state) => ({
      photos: state.photos.map((photo) =>
        photo.id === id ? { ...photo, ...updates } : photo
      ),
    })),
  removePhoto: (id) =>
    set((state) => ({
      photos: state.photos.filter((photo) => photo.id !== id),
    })),
  reorderPhotos: (photos) => set({ photos }),

  // Upload state
  isUploading: false,
  uploadProgress: {},
  setUploading: (uploading) => set({ isUploading: uploading }),
  setUploadProgress: (fileId, progress) =>
    set((state) => ({
      uploadProgress: { ...state.uploadProgress, [fileId]: progress },
    })),
  clearUploadProgress: () => set({ uploadProgress: {} }),

  // UI state
  isLoading: false,
  error: null,
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  // Modal states
  showCreateAlbumModal: false,
  showUploadModal: false,
  showShareModal: false,
  selectedPhotos: [],
  setShowCreateAlbumModal: (show) => set({ showCreateAlbumModal: show }),
  setShowUploadModal: (show) => set({ showUploadModal: show }),
  setShowShareModal: (show) => set({ showShareModal: show }),
  setSelectedPhotos: (photoIds) => set({ selectedPhotos: photoIds }),
  togglePhotoSelection: (photoId) =>
    set((state) => {
      const isSelected = state.selectedPhotos.includes(photoId);
      return {
        selectedPhotos: isSelected
          ? state.selectedPhotos.filter((id) => id !== photoId)
          : [...state.selectedPhotos, photoId],
      };
    }),
  clearSelection: () => set({ selectedPhotos: [] }),
}));
