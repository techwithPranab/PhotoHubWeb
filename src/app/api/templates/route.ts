import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Template from '@/models/Template';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = {};
    if (category && category !== 'all') {
      query = { category };
    }

    const templates = await Template.find(query).sort({ popular: -1, createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: templates,
      count: templates.length
    });

  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'description', 'image', 'category', 'size', 'pages', 'binding', 'price'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    const template = await Template.create(body);

    return NextResponse.json({
      success: true,
      data: template
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create template' },
      { status: 500 }
    );
  }
}
