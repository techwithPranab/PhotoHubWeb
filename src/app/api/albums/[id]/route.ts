import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Album from '@/models/Album';
import Photo from '@/models/Photo';
import type { AlbumPrivacy, AlbumLayout } from '@/types';

interface Collaborator {
  userId: string;
  permission: 'view' | 'edit' | 'comment';
}

interface UpdateAlbumBody {
  title?: string;
  description?: string;
  privacy?: AlbumPrivacy;
  password?: string;
  layout?: AlbumLayout;
  theme?: {
    backgroundColor: string;
    fontFamily: string;
    fontSize: string;
  };
  isPublished?: boolean;
  publishedAt?: Date;
}

// GET /api/albums/[id] - Get album details with photos
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: albumId } = await params;

    // Validate albumId
    if (!albumId || albumId === 'undefined' || albumId.trim() === '') {
      return NextResponse.json({ error: 'Invalid album ID' }, { status: 400 });
    }

    const url = new URL(request.url);
    const password = url.searchParams.get('password');

    await connectDB();

    const album = await Album.findById(albumId).populate('userId', 'name email');
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    const session = await getServerSession(authOptions);
    const isOwner = session?.user?.id === album.userId._id.toString();
    const isCollaborator = album.collaborators.some(
      (collab: Collaborator) => collab.userId.toString() === session?.user?.id
    );

    // Check access permissions
    if (album.privacy === 'private' && !isOwner && !isCollaborator) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    if (album.privacy === 'password' && !isOwner && !isCollaborator) {
      if (!password) {
        return NextResponse.json({ error: 'Password required' }, { status: 401 });
      }

      const bcrypt = await import('bcryptjs');
      const isPasswordValid = await bcrypt.compare(password, album.password);
      if (!isPasswordValid) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
      }
    }

    // Get photos
    const photos = await Photo.find({ albumId })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    // Increment view count if not owner
    if (!isOwner) {
      await Album.findByIdAndUpdate(albumId, { $inc: { viewCount: 1 } });
    }

    let userRole = 'viewer';
    if (isOwner) {
      userRole = 'owner';
    } else if (isCollaborator) {
      userRole = 'collaborator';
    }

    const albumData = {
      id: album._id,
      title: album.title,
      description: album.description,
      privacy: album.privacy,
      coverPhoto: album.coverPhoto,
      layout: album.layout,
      theme: album.theme,
      photoCount: album.photoCount,
      pageCount: album.photoCount, // For ordering purposes
      totalSize: album.totalSize,
      viewCount: album.viewCount,
      likeCount: album.likeCount,
      isPublished: album.isPublished,
      publishedAt: album.publishedAt,
      createdAt: album.createdAt,
      updatedAt: album.updatedAt,
      owner: {
        id: album.userId._id,
        name: album.userId.name,
        email: album.userId.email
      },
      photos: photos.map(photo => ({
        id: photo._id,
        url: photo.url,
        thumbnailUrl: photo.thumbnailUrl,
        caption: photo.caption,
        tags: photo.tags,
        metadata: photo.metadata,
        order: photo.order,
        createdAt: photo.createdAt
      })),
      userRole
    };

    return NextResponse.json({ album: albumData });

  } catch (error) {
    console.error('Get album error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch album' },
      { status: 500 }
    );
  }
}

// PUT /api/albums/[id] - Update album
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: albumId } = await params;
    const body: UpdateAlbumBody = await request.json();

    await connectDB();

    const album = await Album.findById(albumId);
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    // Check permission
    const isOwner = album.userId.toString() === session.user.id;
    const hasEditPermission = album.collaborators.some(
      (collab: Collaborator) => collab.userId.toString() === session.user.id && 
      collab.permission === 'edit'
    );

    if (!isOwner && !hasEditPermission) {
      return NextResponse.json({ error: 'No permission to edit this album' }, { status: 403 });
    }

    const updateData: Record<string, unknown> = {};
    const allowedFields: (keyof UpdateAlbumBody)[] = ['title', 'description', 'privacy', 'layout', 'theme', 'isPublished'];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    // Handle password update
    if (body.privacy === 'password' && body.password) {
      const bcrypt = await import('bcryptjs');
      updateData.password = await bcrypt.hash(body.password, 12);
    }

    // Set publishedAt when publishing
    if (body.isPublished && !album.isPublished) {
      updateData.publishedAt = new Date();
    }

    const updatedAlbum = await Album.findByIdAndUpdate(
      albumId,
      updateData,
      { new: true }
    );

    return NextResponse.json({ 
      success: true, 
      album: updatedAlbum 
    });

  } catch (error) {
    console.error('Update album error:', error);
    return NextResponse.json(
      { error: 'Failed to update album' },
      { status: 500 }
    );
  }
}

// DELETE /api/albums/[id] - Delete album
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: albumId } = await params;

    await connectDB();

    const album = await Album.findById(albumId);
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    // Only owner can delete album
    if (album.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Only album owner can delete' }, { status: 403 });
    }

    // Get all photos to delete from Cloudinary
    const photos = await Photo.find({ albumId });
    
    // Delete photos from Cloudinary
    const { cloudinary } = await import('@/lib/cloudinary');
    for (const photo of photos) {
      try {
        await cloudinary.uploader.destroy(photo.public_id);
      } catch (error) {
        console.error('Error deleting photo from Cloudinary:', error);
      }
    }

    // Delete photos from database
    await Photo.deleteMany({ albumId });

    // Delete album
    await Album.findByIdAndDelete(albumId);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete album error:', error);
    return NextResponse.json(
      { error: 'Failed to delete album' },
      { status: 500 }
    );
  }
}
