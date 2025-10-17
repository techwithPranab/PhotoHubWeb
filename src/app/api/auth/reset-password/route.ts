import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user with valid reset token
    const users = await User.find({
      resetPasswordToken: { $exists: true },
      resetPasswordExpires: { $gt: new Date() }
    });

    let user = null;
    for (const u of users) {
      const isValidToken = await bcrypt.compare(token, u.resetPasswordToken);
      if (isValidToken) {
        user = u;
        break;
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400 }
      );
    }

    // Hash new password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Update user password and clear reset token
    await User.findByIdAndUpdate(user._id, {
      passwordHash,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully',
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Failed to reset password. Please try again.' },
      { status: 500 }
    );
  }
}
