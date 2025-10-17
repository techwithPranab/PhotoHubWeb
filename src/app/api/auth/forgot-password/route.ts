import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find user by email
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      passwordHash: { $exists: true } // Only users with passwords (not OAuth users)
    });

    // Always return success to prevent email enumeration
    // but only actually send email if user exists
    if (user) {
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      const resetTokenHash = await bcrypt.hash(resetToken, 12);
      const resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Update user with reset token
      await User.findByIdAndUpdate(user._id, {
        resetPasswordToken: resetTokenHash,
        resetPasswordExpires: resetTokenExpires,
      });

      // In a real application, you would send an email here
      // For now, we'll log the reset URL
      const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`;
      console.log(`Password reset URL for ${email}: ${resetUrl}`);
      
      // Send password reset email
      await sendPasswordResetEmail(email, resetUrl);
    }

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, we\'ve sent you a password reset link.',
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Failed to process request. Please try again.' },
      { status: 500 }
    );
  }
}
