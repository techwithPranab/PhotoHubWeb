import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Album from '@/models/Album';
import type { AlbumPrivacy, AlbumLayout } from '@/types';

interface AlbumQuery {
  userId: string;
  $or?: Array<{ title: { $regex: string; $options: string } } | { description: { $regex: string; $options: string } }>;
  privacy?: AlbumPrivacy;
}

interface CreateAlbumBody {
  title: string;
  description?: string;
  privacy?: AlbumPrivacy;
  password?: string;
  layout?: AlbumLayout;
  theme?: {
    backgroundColor: string;
    fontFamily: string;
    fontSize: string;
  };
}

// GET /api/albums - Get user's albums
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const page = Number.parseInt(url.searchParams.get('page') || '1');
    const limit = Number.parseInt(url.searchParams.get('limit') || '12');
    const search = url.searchParams.get('search') || '';
    const privacy = url.searchParams.get('privacy') || '';

    await connectDB();

    const query: AlbumQuery = { userId: session.user.id };
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (privacy && ['public', 'private', 'password'].includes(privacy)) {
      query.privacy = privacy as AlbumPrivacy;
    }

    const skip = (page - 1) * limit;

    const albums = await Album.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Album.countDocuments(query);

    // Transform albums to include id field
    const transformedAlbums = albums.map(album => ({
      id: album._id.toString(),
      title: album.title,
      description: album.description,
      privacy: album.privacy,
      coverPhoto: album.coverPhoto,
      layout: album.layout,
      theme: album.theme,
      photoCount: album.photoCount,
      totalSize: album.totalSize,
      viewCount: album.viewCount,
      likeCount: album.likeCount,
      isPublished: album.isPublished,
      publishedAt: album.publishedAt,
      status: album.status,
      orderedAt: album.orderedAt,
      createdAt: album.createdAt,
      updatedAt: album.updatedAt
    }));

    return NextResponse.json({
      albums: transformedAlbums,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get albums error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch albums' },
      { status: 500 }
    );
  }
}

// POST /api/albums - Create new album
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateAlbumBody = await request.json();
    const { title, description, privacy, password, layout, theme } = body;

    if (!title || title.trim().length === 0) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    const albumData = {
      userId: session.user.id,
      title: title.trim(),
      description: description?.trim() || '',
      privacy: privacy || 'private',
      layout: layout || 'grid',
      theme: theme || {
        backgroundColor: '#ffffff',
        fontFamily: 'Inter',
        fontSize: 'medium'
      },
      ...(privacy === 'password' && password && { password: await (await import('bcryptjs')).hash(password, 12) })
    };

    const album = await Album.create(albumData);

    return NextResponse.json({
      success: true,
      album: {
        id: album._id.toString(), // Ensure it's a string
        title: album.title,
        description: album.description,
        privacy: album.privacy,
        layout: album.layout,
        theme: album.theme,
        photoCount: album.photoCount,
        createdAt: album.createdAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Create album error:', error);
    return NextResponse.json(
      { error: 'Failed to create album' },
      { status: 500 }
    );
  }
}
