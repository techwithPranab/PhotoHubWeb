import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

interface UserSettings {
  emailNotifications: boolean;
  marketingEmails: boolean;
  profileVisibility: 'public' | 'private';
  defaultAlbumPrivacy: 'public' | 'private' | 'password';
  twoFactorEnabled: boolean;
}

// Default settings for all users
const defaultSettings: UserSettings = {
  emailNotifications: true,
  marketingEmails: false,
  profileVisibility: 'public',
  defaultAlbumPrivacy: 'private',
  twoFactorEnabled: false,
};

// In-memory storage for settings (in production, this should be stored in database)
const userSettings = new Map<string, UserSettings>();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user settings or return defaults
    const settings = userSettings.get(session.user.id) || { ...defaultSettings };

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      emailNotifications,
      marketingEmails,
      profileVisibility,
      defaultAlbumPrivacy,
      twoFactorEnabled
    } = body;

    // Validate input
    const validProfileVisibility = ['public', 'private'];
    const validAlbumPrivacy = ['public', 'private', 'password'];

    if (profileVisibility && !validProfileVisibility.includes(profileVisibility)) {
      return NextResponse.json({ error: 'Invalid profile visibility setting' }, { status: 400 });
    }

    if (defaultAlbumPrivacy && !validAlbumPrivacy.includes(defaultAlbumPrivacy)) {
      return NextResponse.json({ error: 'Invalid default album privacy setting' }, { status: 400 });
    }

    // Get current settings or defaults
    const currentSettings = userSettings.get(session.user.id) || { ...defaultSettings };

    // Update settings
    const updatedSettings: UserSettings = {
      emailNotifications: emailNotifications ?? currentSettings.emailNotifications,
      marketingEmails: marketingEmails ?? currentSettings.marketingEmails,
      profileVisibility: profileVisibility ?? currentSettings.profileVisibility,
      defaultAlbumPrivacy: defaultAlbumPrivacy ?? currentSettings.defaultAlbumPrivacy,
      twoFactorEnabled: twoFactorEnabled ?? currentSettings.twoFactorEnabled,
    };

    // Store updated settings (in production, save to database)
    userSettings.set(session.user.id, updatedSettings);

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
