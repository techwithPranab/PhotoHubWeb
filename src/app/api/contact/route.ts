import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { sendContactNotificationEmail, sendContactConfirmationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const session = await getServerSession(authOptions);

    const { name, email, subject, orderNumber, message } = await request.json();

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Name, email, subject, and message are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Determine category based on subject keywords
    let category: 'general' | 'technical' | 'billing' | 'order' | 'feature-request' | 'bug-report' = 'general';
    const subjectLower = subject.toLowerCase();

    if (subjectLower.includes('order') || subjectLower.includes('shipping') || subjectLower.includes('delivery')) {
      category = 'order';
    } else if (subjectLower.includes('billing') || subjectLower.includes('payment') || subjectLower.includes('refund')) {
      category = 'billing';
    } else if (subjectLower.includes('bug') || subjectLower.includes('error') || subjectLower.includes('problem')) {
      category = 'bug-report';
    } else if (subjectLower.includes('feature') || subjectLower.includes('request') || subjectLower.includes('suggestion')) {
      category = 'feature-request';
    } else if (subjectLower.includes('technical') || subjectLower.includes('login') || subjectLower.includes('account')) {
      category = 'technical';
    }

    // Determine priority based on content
    let priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium';
    const messageLower = message.toLowerCase();

    if (messageLower.includes('urgent') || messageLower.includes('emergency') || messageLower.includes('asap')) {
      priority = 'urgent';
    } else if (category === 'bug-report' || messageLower.includes('not working') || messageLower.includes('broken')) {
      priority = 'high';
    } else if (category === 'billing' || messageLower.includes('refund') || messageLower.includes('cancel')) {
      priority = 'high';
    }

    // Get IP address and user agent
    const ipAddress = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Create contact record
    const contactData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      subject: subject.trim(),
      orderNumber: orderNumber?.trim(),
      message: message.trim(),
      userId: session?.user?.id || null,
      status: 'new' as const,
      priority,
      category,
      userAgent,
      ipAddress
    };

    // Save to database
    const contact = new Contact(contactData);
    const savedContact = await contact.save();

    // Send notification email to admin/support team
    try {
      await sendContactNotificationEmail(savedContact);
    } catch (emailError) {
      console.error('Failed to send contact notification email:', emailError);
      // Don't fail the request if email fails
    }

    // Send confirmation email to user
    try {
      await sendContactConfirmationEmail(savedContact);
    } catch (emailError) {
      console.error('Failed to send contact confirmation email:', emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you within 24 hours.',
      contactId: savedContact._id
    });

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    );
  }
}
