import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/mongodb';
import AlbumPage from '@/models/AlbumPage';
import EditorProject from '@/models/EditorProject';
import Album from '@/models/Album';
import { authOptions } from '@/lib/auth';

// GET /api/editor/pages/[albumId] - Get all pages for an album
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ albumId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { albumId } = await params;
    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // Verify user has access to this album
    const album = await Album.findById(albumId);
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    if (album.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get pages with pagination
    const pages = await AlbumPage.find({ albumId })
      .sort({ pageNumber: 1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await AlbumPage.countDocuments({ albumId });

    return NextResponse.json({
      success: true,
      data: {
        pages,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasNext: skip + limit < total,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Error fetching album pages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}

// POST /api/editor/pages/[albumId] - Create a new page
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ albumId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { albumId } = await params;
    const body = await request.json();

    // Verify user has access to this album
    const album = await Album.findById(albumId);
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    if (album.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get the next page number
    const lastPage = await AlbumPage.findOne({ albumId })
      .sort({ pageNumber: -1 })
      .select('pageNumber');
    
    const nextPageNumber = lastPage ? lastPage.pageNumber + 1 : 1;

    // Create the new page
    const newPage = new AlbumPage({
      albumId,
      pageNumber: body.pageNumber || nextPageNumber,
      pageType: body.pageType || 'content',
      layoutTemplate: body.layoutTemplate || 'blank',
      elements: body.elements || [],
      pageBackground: body.pageBackground || {
        type: 'color',
        value: '#ffffff',
        opacity: 1
      },
      dimensions: body.dimensions || {
        width: 800,
        height: 600,
        unit: 'px'
      }
    });

    await newPage.save();

    // Update the editor project total pages count
    await EditorProject.findOneAndUpdate(
      { albumId },
      { 
        $inc: { totalPages: 1 },
        $set: { lastEditedPageId: newPage._id }
      }
    );

    return NextResponse.json({
      success: true,
      data: newPage
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating album page:', error);
    
    if (error instanceof Error && 'code' in error && (error as Error & { code: number }).code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Page number already exists for this album' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create page' },
      { status: 500 }
    );
  }
}
