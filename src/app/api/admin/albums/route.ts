import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Album from '@/models/Album';
import Photo from '@/models/Photo';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const query: Record<string, unknown> = {};
    if (status && status !== 'all') {
      query.status = status;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const albums = await Album.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .populate('userId', 'name email');

    // Get photo counts for each album
    const albumsWithCounts = await Promise.all(
      albums.map(async (album) => {
        const photosCount = await Photo.countDocuments({ albumId: album._id });
        
        return {
          id: album._id,
          title: album.title,
          description: album.description,
          status: album.status || 'draft',
          createdAt: album.createdAt,
          updatedAt: album.updatedAt,
          userId: {
            name: album.userId?.name || 'Unknown',
            email: album.userId?.email || 'Unknown'
          },
          photosCount,
          coverImage: album.coverImage,
          orderId: album.orderId,
          orderedAt: album.orderedAt
        };
      })
    );

    const total = await Album.countDocuments(query);

    return NextResponse.json({
      albums: albumsWithCounts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Admin albums fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { albumId, action, newStatus } = body;

    const album = await Album.findById(albumId);
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    if (action === 'update-status' && newStatus) {
      const validStatuses = ['draft', 'published', 'ordered', 'archived'];
      if (!validStatuses.includes(newStatus)) {
        return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
      }
      album.status = newStatus;
    }

    album.updatedAt = new Date();
    await album.save();

    return NextResponse.json({
      success: true,
      album: {
        id: album._id,
        status: album.status
      }
    });

  } catch (error) {
    console.error('Admin album update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { albumId } = body;

    const album = await Album.findById(albumId);
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    // Delete associated photos
    await Photo.deleteMany({ albumId });

    // Delete the album
    await Album.findByIdAndDelete(albumId);

    return NextResponse.json({
      success: true,
      message: 'Album deleted successfully'
    });

  } catch (error) {
    console.error('Admin album delete error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
