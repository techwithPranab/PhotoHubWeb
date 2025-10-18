import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import { Settings } from '@/models/Settings';

// GET /api/admin/settings - Get system settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    await dbConnect();

    // Get settings or return defaults
    let settings = await Settings.findOne();
    
    if (!settings) {
      // Create default settings if none exist
      settings = await Settings.create({
        siteName: 'PhotoHub',
        siteDescription: 'Professional photography services',
        defaultCurrency: 'USD',
        allowRegistration: true,
        emailNotifications: true,
        orderAutoApproval: false,
        maxFileUploadSize: 10,
        maintenanceMode: false,
      });
    }

    return NextResponse.json({ settings });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/settings - Update system settings
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.role || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const data = await request.json();

    await dbConnect();

    // Update or create settings
    const settings = await Settings.findOneAndUpdate(
      {},
      {
        $set: {
          siteName: data.siteName,
          siteDescription: data.siteDescription,
          defaultCurrency: data.defaultCurrency,
          allowRegistration: data.allowRegistration,
          emailNotifications: data.emailNotifications,
          orderAutoApproval: data.orderAutoApproval,
          maxFileUploadSize: data.maxFileUploadSize,
          maintenanceMode: data.maintenanceMode,
          updatedAt: new Date(),
        }
      },
      { 
        new: true, 
        upsert: true,
        setDefaultsOnInsert: true 
      }
    );

    return NextResponse.json({ 
      message: 'Settings updated successfully',
      settings 
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
