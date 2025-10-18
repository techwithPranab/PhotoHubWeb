import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import AlbumPage from '@/models/AlbumPage';
import Album from '@/models/Album';
import { authOptions } from '@/lib/auth';

// GET /api/editor/pages/[albumId]/[pageId] - Get specific page
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ albumId: string; pageId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { albumId, pageId } = await params;

    // Verify user has access to this album
    const album = await Album.findById(albumId);
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    if (album.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get the specific page
    const page = await AlbumPage.findOne({ _id: pageId, albumId });
    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: page
    });

  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch page' },
      { status: 500 }
    );
  }
}

// PUT /api/editor/pages/[albumId]/[pageId] - Update specific page
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ albumId: string; pageId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { albumId, pageId } = await params;
    const updates = await request.json();

    // Verify user has access to this album
    const album = await Album.findById(albumId);
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    if (album.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Update the page
    const updatedPage = await AlbumPage.findOneAndUpdate(
      { _id: pageId, albumId },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedPage) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: updatedPage
    });

  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update page' },
      { status: 500 }
    );
  }
}

// DELETE /api/editor/pages/[albumId]/[pageId] - Delete specific page
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ albumId: string; pageId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { albumId, pageId } = await params;

    // Verify user has access to this album
    const album = await Album.findById(albumId);
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    if (album.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get the page to be deleted
    const pageToDelete = await AlbumPage.findOne({ _id: pageId, albumId });
    if (!pageToDelete) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Delete the page
    await AlbumPage.deleteOne({ _id: pageId, albumId });

    // Reorder remaining pages
    await AlbumPage.updateMany(
      { 
        albumId, 
        pageNumber: { $gt: pageToDelete.pageNumber } 
      },
      { $inc: { pageNumber: -1 } }
    );

    return NextResponse.json({
      success: true,
      message: 'Page deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete page' },
      { status: 500 }
    );
  }
}
