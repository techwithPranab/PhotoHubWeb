import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import mongoose from 'mongoose';
import connectDB from '@/lib/mongodb';
import EditorProject from '@/models/EditorProject';
import Album from '@/models/Album';
import AlbumPage from '@/models/AlbumPage';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET /api/editor/projects - Get user's editor projects
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = Number.parseInt(searchParams.get('page') || '1');
    const limit = Number.parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const skip = (page - 1) * limit;

    // Build query
    interface ProjectQuery {
      $or: Array<{ userId: string } | { 'collaborators.userId': string }>;
      status?: string;
    }

    const query: ProjectQuery = {
      $or: [
        { userId: session.user.id },
        { 'collaborators.userId': session.user.id }
      ]
    };

    if (status) {
      query.status = status;
    }

    // Get projects with pagination
    const projects = await EditorProject.find(query)
      .populate('albumId', 'title description thumbnail createdAt')
      .populate('userId', 'name email image')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await EditorProject.countDocuments(query);

    return NextResponse.json({
      success: true,
      data: {
        projects,
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
    console.error('Error fetching editor projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/editor/projects - Create new editor project
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const body = await request.json();
    const { albumId, projectName, description, editorSettings } = body;

    // Convert albumId to ObjectId
    const albumObjectId = mongoose.Types.ObjectId.createFromHexString(albumId);

    // Verify the album exists and user has access
    const album = await Album.findById(albumObjectId);
    if (!album) {
      return NextResponse.json({ error: 'Album not found' }, { status: 404 });
    }

    if (album.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Check if editor project already exists for this album
    const existingProject = await EditorProject.findOne({ albumId: albumObjectId });
    if (existingProject) {
      const populatedProject = await EditorProject.findById(existingProject._id)
        .populate('albumId', 'title description thumbnail')
        .populate('userId', 'name email image');

      return NextResponse.json({
        success: true,
        data: populatedProject,
        message: 'Editor project already exists'
      });
    }

    // Create new editor project
    const editorProject = new EditorProject({
      userId: session.user.id,
      albumId: albumObjectId,
      projectName: projectName || album.title || 'Untitled Project',
      description: description || album.description,
      editorSettings: {
        canvasWidth: 800,
        canvasHeight: 600,
        unit: 'px',
        dpi: 300,
        showGrid: true,
        snapToGrid: true,
        gridSize: 20,
        showGuides: true,
        snapToGuides: true,
        ...editorSettings
      },
      collaborators: [{
        userId: session.user.id,
        role: 'owner',
        invitedAt: new Date()
      }],
      exportSettings: {
        format: 'pdf',
        quality: 'high',
        colorProfile: 'sRGB',
        bleed: 0
      }
    });

    await editorProject.save();

    // Create initial page if album has no pages
    const pageCount = await AlbumPage.countDocuments({ albumId: albumObjectId });
    if (pageCount === 0) {
      const initialPage = new AlbumPage({
        albumId: albumObjectId,
        pageNumber: 1,
        pageType: 'cover',
        layoutTemplate: 'blank',
        elements: [],
        pageBackground: {
          type: 'color',
          value: '#ffffff',
          opacity: 1
        },
        dimensions: {
          width: editorProject.editorSettings.canvasWidth,
          height: editorProject.editorSettings.canvasHeight,
          unit: editorProject.editorSettings.unit
        }
      });

      await initialPage.save();

      editorProject.lastEditedPageId = initialPage._id;
      editorProject.totalPages = 1;
      await editorProject.save();
    }

    const populatedProject = await EditorProject.findById(editorProject._id)
      .populate('albumId', 'title description thumbnail')
      .populate('userId', 'name email image');

    return NextResponse.json({
      success: true,
      data: populatedProject
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating editor project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
