import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { cloudinary } from '@/lib/cloudinary';
import connectDB from '@/lib/mongodb';
import Photo from '@/models/Photo';
import Album from '@/models/Album';

interface Collaborator {
  userId: string;
  permission: 'view' | 'edit' | 'comment';
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const photoId = url.searchParams.get('photoId');

    if (!photoId) {
      return NextResponse.json({ error: 'Photo ID is required' }, { status: 400 });
    }

    await connectDB();

    // Find the photo
    const photo = await Photo.findById(photoId);
    if (!photo) {
      return NextResponse.json({ error: 'Photo not found' }, { status: 404 });
    }

    // Verify ownership or permission
    const album = await Album.findById(photo.albumId);
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    const hasPermission = album.userId.toString() === session.user.id ||
      album.collaborators.some(
        (collab: Collaborator) => collab.userId.toString() === session.user.id && 
        ['edit'].includes(collab.permission)
      );

    if (!hasPermission) {
      return NextResponse.json({ error: 'No permission to delete this photo' }, { status: 403 });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(photo.public_id);

    // Delete from database
    await Photo.findByIdAndDelete(photoId);

    // Update album photo count and total size
    await Album.findByIdAndUpdate(photo.albumId, {
      $inc: { 
        photoCount: -1,
        totalSize: -photo.metadata.bytes 
      }
    });

    // If this was the cover photo, update the cover
    if (album.coverPhoto === photo.url) {
      const firstPhoto = await Photo.findOne({ albumId: photo.albumId }).sort({ order: 1 });
      await Album.findByIdAndUpdate(photo.albumId, {
        coverPhoto: firstPhoto?.url || null
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete photo' },
      { status: 500 }
    );
  }
}
