import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Mock asset data - in production, this would come from a database or CDN
const mockAssets = [
  // Stock Photos
  {
    id: 'photo-1',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop',
    title: 'Mountain Landscape',
    category: 'nature',
    tags: ['mountain', 'landscape', 'nature'],
    size: { width: 400, height: 300 }
  },
  {
    id: 'photo-2',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=200&h=150&fit=crop',
    title: 'Forest Path',
    category: 'nature',
    tags: ['forest', 'path', 'trees'],
    size: { width: 400, height: 300 }
  },
  {
    id: 'photo-3',
    type: 'photo',
    url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop',
    thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=150&fit=crop',
    title: 'Ocean Wave',
    category: 'nature',
    tags: ['ocean', 'wave', 'water'],
    size: { width: 400, height: 300 }
  },
  
  // Stickers/Icons
  {
    id: 'sticker-1',
    type: 'sticker',
    url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ff6b6b"%3E%3Cpath d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/%3E%3C/svg%3E',
    thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ff6b6b"%3E%3Cpath d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/%3E%3C/svg%3E',
    title: 'Heart',
    category: 'icons',
    tags: ['heart', 'love', 'romance'],
    size: { width: 50, height: 50 }
  },
  {
    id: 'sticker-2',
    type: 'sticker',
    url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ffd93d"%3E%3Cpath d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/%3E%3C/svg%3E',
    thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ffd93d"%3E%3Cpath d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/%3E%3C/svg%3E',
    title: 'Star',
    category: 'icons',
    tags: ['star', 'favorite', 'rating'],
    size: { width: 50, height: 50 }
  },

  // Backgrounds
  {
    id: 'bg-1',
    type: 'background',
    url: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Cdefs%3E%3Cpattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"%3E%3Cpath d="M 10 0 L 0 0 0 10" fill="none" stroke="%23e5e7eb" stroke-width="1"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100" height="100" fill="white"/%3E%3Crect width="100" height="100" fill="url(%23grid)"/%3E%3C/svg%3E',
    thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"%3E%3Cdefs%3E%3Cpattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"%3E%3Cpath d="M 10 0 L 0 0 0 10" fill="none" stroke="%23e5e7eb" stroke-width="1"/%3E%3C/pattern%3E%3C/defs%3E%3Crect width="100" height="100" fill="white"/%3E%3Crect width="100" height="100" fill="url(%23grid)"/%3E%3C/svg%3E',
    title: 'Grid Pattern',
    category: 'patterns',
    tags: ['grid', 'pattern', 'minimal'],
    size: { width: 800, height: 600 }
  }
];

// GET /api/assets - Get assets with filtering
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type'); // 'photo', 'sticker', 'background'
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '20');

    let filteredAssets = [...mockAssets];

    // Filter by type
    if (type) {
      filteredAssets = filteredAssets.filter(asset => asset.type === type);
    }

    // Filter by category
    if (category) {
      filteredAssets = filteredAssets.filter(asset => asset.category === category);
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filteredAssets = filteredAssets.filter(asset =>
        asset.title.toLowerCase().includes(searchLower) ||
        asset.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAssets = filteredAssets.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: {
        assets: paginatedAssets,
        pagination: {
          page,
          limit,
          total: filteredAssets.length,
          totalPages: Math.ceil(filteredAssets.length / limit),
          hasNext: endIndex < filteredAssets.length,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching assets:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch assets' },
      { status: 500 }
    );
  }
}
