// Email service for sending password reset and other notifications
// In production, integrate with services like SendGrid, AWS SES, or Nodemailer

interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

import { IContact } from '@/models/Contact';

export async function sendPasswordResetEmail(email: string, resetUrl: string): Promise<void> {
  const emailData: EmailData = {
    to: email,
    subject: 'Reset Your Password - PhotoHub',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">PhotoHub</h1>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ddd;">
          <h2 style="color: #333; margin-top: 0;">Reset Your Password</h2>
          
          <p>Hello,</p>
          
          <p>We received a request to reset your password for your PhotoHub account. If you made this request, click the button below to reset your password:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Reset Password</a>
          </div>
          
          <p>Or copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background: #eee; padding: 10px; border-radius: 5px;">${resetUrl}</p>
          
          <p><strong>This link will expire in 10 minutes for security reasons.</strong></p>
          
          <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          
          <p style="font-size: 14px; color: #666;">
            Best regards,<br>
            The PhotoHub Team
          </p>
          
          <p style="font-size: 12px; color: #999;">
            If you're having trouble clicking the button, copy and paste the URL above into your web browser.
          </p>
        </div>
      </body>
      </html>
    `,
    text: `
      Reset Your Password - PhotoHub
      
      Hello,
      
      We received a request to reset your password for your PhotoHub account.
      
      Click this link to reset your password: ${resetUrl}
      
      This link will expire in 10 minutes for security reasons.
      
      If you didn't request a password reset, please ignore this email.
      
      Best regards,
      The PhotoHub Team
    `
  };

  // NOTE: In production, replace this with actual email sending service
  console.log('\n=== EMAIL WOULD BE SENT ===');
  console.log('To:', emailData.to);
  console.log('Subject:', emailData.subject);
  console.log('Reset URL:', resetUrl);
  console.log('========================\n');

  // Example implementation with SendGrid:
  // const sgMail = require('@sendgrid/mail');
  // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  // await sgMail.send(emailData);

  // Example implementation with Nodemailer:
  // const nodemailer = require('nodemailer');
  // const transporter = nodemailer.createTransporter({ ... });
  // await transporter.sendMail(emailData);

  // For now, just resolve immediately
  await Promise.resolve();
}

export async function sendWelcomeEmail(email: string, name: string): Promise<void> {
  console.log(`Welcome email would be sent to ${email} for user ${name}`);
  await Promise.resolve();
}

export async function sendOrderConfirmationEmail(email: string, orderData: unknown): Promise<void> {
  console.log(`Order confirmation email would be sent to ${email}`, orderData);
  await Promise.resolve();
}

export async function sendContactNotificationEmail(contact: IContact): Promise<void> {
  // Email to admin/support team about new contact submission
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@photohub.com';

  // Determine priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return '#dc3545';
      case 'high': return '#fd7e14';
      case 'medium': return '#ffc107';
      default: return '#28a745';
    }
  };

  const emailData: EmailData = {
    to: adminEmail,
    subject: `New Contact Form Submission: ${contact.subject}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Submission</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">PhotoHub</h1>
          <p style="color: white; margin: 5px 0 0 0;">New Contact Form Submission</p>
        </div>

        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ddd;">
          <h2 style="color: #333; margin-top: 0;">Contact Details</h2>

          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #ddd; font-weight: bold; width: 120px;">Name:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${contact.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${contact.email}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #ddd; font-weight: bold;">Subject:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${contact.subject}</td>
            </tr>
            ${contact.orderNumber ? `
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #ddd; font-weight: bold;">Order Number:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${contact.orderNumber}</td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #ddd; font-weight: bold;">Priority:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">
                <span style="background: ${getPriorityColor(contact.priority)}; color: white; padding: 2px 8px; border-radius: 3px; font-size: 12px;">
                  ${contact.priority.toUpperCase()}
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #ddd; font-weight: bold;">Category:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${contact.category.replace('-', ' ').toUpperCase()}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #ddd; font-weight: bold;">Submitted:</td>
              <td style="padding: 8px 0; border-bottom: 1px solid #ddd;">${new Date(contact.createdAt).toLocaleString()}</td>
            </tr>
          </table>

          <h3 style="color: #333; margin-top: 30px;">Message:</h3>
          <div style="background: white; padding: 15px; border-radius: 5px; border: 1px solid #ddd; margin: 10px 0;">
            ${contact.message.replaceAll('\n', '<br>')}
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/contacts/${contact._id}" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">View in Admin Panel</a>
          </div>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

          <p style="font-size: 14px; color: #666;">
            Best regards,<br>
            PhotoHub System
          </p>
        </div>
      </body>
      </html>
    `,
    text: `
      New Contact Form Submission - PhotoHub

      Contact Details:
      Name: ${contact.name}
      Email: ${contact.email}
      Subject: ${contact.subject}
      ${contact.orderNumber ? `Order Number: ${contact.orderNumber}` : ''}
      Priority: ${contact.priority.toUpperCase()}
      Category: ${contact.category.replace('-', ' ').toUpperCase()}
      Submitted: ${new Date(contact.createdAt).toLocaleString()}

      Message:
      ${contact.message}

      View in Admin Panel: ${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/contacts/${contact._id}
    `
  };

  console.log('\n=== CONTACT NOTIFICATION EMAIL WOULD BE SENT ===');
  console.log('To:', emailData.to);
  console.log('Subject:', emailData.subject);
  console.log('Contact ID:', contact._id);
  console.log('=====================================\n');

  // NOTE: In production, replace this with actual email sending service
  await Promise.resolve();
}

export async function sendContactConfirmationEmail(contact: IContact): Promise<void> {
  // Email to user confirming their contact submission
  const emailData: EmailData = {
    to: contact.email,
    subject: 'We received your message - PhotoHub',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Message Received</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 28px;">PhotoHub</h1>
        </div>

        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ddd;">
          <h2 style="color: #333; margin-top: 0;">Thank you for contacting us!</h2>

          <p>Hi ${contact.name},</p>

          <p>We've received your message and appreciate you reaching out to us. Here's a summary of what you sent:</p>

          <div style="background: white; padding: 20px; border-radius: 5px; border: 1px solid #ddd; margin: 20px 0;">
            <p><strong>Subject:</strong> ${contact.subject}</p>
            ${contact.orderNumber ? `<p><strong>Order Number:</strong> ${contact.orderNumber}</p>` : ''}
            <p><strong>Message:</strong></p>
            <div style="background: #f5f5f5; padding: 10px; border-radius: 3px; margin-top: 10px;">
              ${contact.message.replaceAll('\n', '<br>')}
            </div>
          </div>

          <p>Our support team will review your message and get back to you within 24 hours. For urgent matters, please call us directly at 1-800-PHOTO-HUB.</p>

          <p>In the meantime, you can:</p>
          <ul>
            <li>Check our <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/help" style="color: #667eea;">Help Center</a> for quick answers</li>
            <li>View your <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/orders" style="color: #667eea;">order status</a> if you have an active order</li>
            <li>Browse our <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/faq" style="color: #667eea;">FAQ</a> for common questions</li>
          </ul>

          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

          <p style="font-size: 14px; color: #666;">
            Best regards,<br>
            The PhotoHub Support Team
          </p>

          <p style="font-size: 12px; color: #999;">
            Reference ID: ${contact._id}
          </p>
        </div>
      </body>
      </html>
    `,
    text: `
      Thank you for contacting us! - PhotoHub

      Hi ${contact.name},

      We've received your message and appreciate you reaching out to us.

      Subject: ${contact.subject}
      ${contact.orderNumber ? `Order Number: ${contact.orderNumber}` : ''}

      Message:
      ${contact.message}

      Our support team will review your message and get back to you within 24 hours.

      Reference ID: ${contact._id}

      Best regards,
      The PhotoHub Support Team
    `
  };

  console.log('\n=== CONTACT CONFIRMATION EMAIL WOULD BE SENT ===');
  console.log('To:', emailData.to);
  console.log('Subject:', emailData.subject);
  console.log('Reference ID:', contact._id);
  console.log('=====================================\n');

  // NOTE: In production, replace this with actual email sending service
  await Promise.resolve();
}
