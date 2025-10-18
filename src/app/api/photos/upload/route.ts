import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { cloudinary } from '@/lib/cloudinary';
import connectDB from '@/lib/mongodb';
import Photo from '@/models/Photo';
import Album from '@/models/Album';
import type { CloudinaryUploadResult } from '@/types';

interface Collaborator {
  userId: string;
  permission: 'view' | 'edit' | 'comment';
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const albumId = formData.get('albumId') as string;
    const caption = formData.get('caption') as string;
    const tags = formData.get('tags') as string;

    if (!file || !albumId) {
      return NextResponse.json({ error: 'File and albumId are required' }, { status: 400 });
    }

    await connectDB();

    // Verify album ownership or collaboration
    const album = await Album.findById(albumId);
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    const hasPermission = album.userId.toString() === session.user.id ||
      album.collaborators.some(
        (collab: Collaborator) => collab.userId.toString() === session.user.id && 
        ['edit'].includes(collab.permission)
      );

    if (!hasPermission) {
      return NextResponse.json({ error: 'No permission to upload to this album' }, { status: 403 });
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          resource_type: 'image',
          folder: `photohub/albums/${albumId}`,
          use_filename: true,
          unique_filename: true,
        },
        (error, result) => {
          if (error) reject(new Error(error.message || 'Upload failed'));
          else if (result) resolve(result as CloudinaryUploadResult);
          else reject(new Error('Upload failed: no result'));
        }
      ).end(buffer);
    });

    // Generate thumbnail URL
    const thumbnailUrl = cloudinary.url(uploadResult.public_id, {
      width: 300,
      height: 300,
      crop: 'fill',
      quality: 'auto',
      format: 'auto',
    });

    // Get current photo count for ordering
    const photoCount = await Photo.countDocuments({ albumId });

    // Save photo metadata to database
    const photo = await Photo.create({
      albumId,
      userId: session.user.id,
      public_id: uploadResult.public_id,
      url: uploadResult.secure_url,
      thumbnailUrl,
      originalFilename: file.name,
      caption: caption || '',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      metadata: {
        width: uploadResult.width,
        height: uploadResult.height,
        format: uploadResult.format,
        bytes: uploadResult.bytes,
      },
      order: photoCount,
    });

    // Update album photo count and total size
    await Album.findByIdAndUpdate(albumId, {
      $inc: { 
        photoCount: 1,
        totalSize: uploadResult.bytes 
      },
      ...(photoCount === 0 && { coverPhoto: uploadResult.secure_url })
    });

    return NextResponse.json({
      success: true,
      photo: {
        id: photo._id,
        url: photo.url,
        thumbnailUrl: photo.thumbnailUrl,
        caption: photo.caption,
        tags: photo.tags,
        metadata: photo.metadata,
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image' },
      { status: 500 }
    );
  }
}
