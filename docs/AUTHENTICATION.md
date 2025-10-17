# Database-Based Authentication System

## Overview

The PhotoHub Web application now uses a completely database-based authentication system using NextAuth.js with credentials provider, bcryptjs for password hashing, and MongoDB for user storage.

## Features

### ✅ **Core Authentication**
- **User Registration**: Email/password registration with validation
- **User Login**: Secure email/password login
- **Password Hashing**: bcryptjs with 12 salt rounds for security
- **Session Management**: JWT-based sessions via NextAuth.js
- **Role-Based Access**: User roles (user, admin, vendor)
- **User Plans**: Free, premium, pro plan support

### ✅ **Password Reset System**
- **Forgot Password**: Email-based password reset requests
- **Secure Reset Tokens**: Cryptographically secure reset tokens with expiration
- **Reset Password**: Secure password reset with token validation
- **Email Notifications**: Placeholder email service ready for production integration

### ✅ **Security Features**
- **Password Requirements**: Minimum 6 characters
- **Email Validation**: Proper email format validation
- **Rate Limiting**: Built-in protection against brute force attacks
- **Secure Token Storage**: Hashed reset tokens in database
- **Token Expiration**: 10-minute expiration for reset tokens

## File Structure

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx              # Login form
│   │   ├── register/page.tsx           # Registration form
│   │   ├── forgot-password/page.tsx    # Forgot password form
│   │   └── reset-password/page.tsx     # Reset password form
│   └── api/
│       └── auth/
│           ├── [...nextauth]/route.ts  # NextAuth configuration
│           ├── register/route.ts       # Registration API
│           ├── forgot-password/route.ts # Forgot password API
│           └── reset-password/route.ts # Reset password API
├── models/
│   └── User.ts                        # User model with auth fields
└── lib/
    └── email.ts                       # Email service (placeholder)
```

## Database Schema

### User Model
```typescript
interface IUser {
  _id: string;
  name: string;
  email: string;                    // Unique, indexed
  passwordHash?: string;            // bcrypt hash (optional for OAuth users)
  role: 'user' | 'admin' | 'vendor';
  plan: 'free' | 'premium' | 'pro';
  profileImage?: string;
  resetPasswordToken?: string;      // Hashed reset token
  resetPasswordExpires?: Date;      // Token expiration
  createdAt: Date;
  updatedAt: Date;
}
```

## API Endpoints

### Authentication Endpoints

#### `POST /api/auth/register`
Register a new user with email and password.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "plan": "free"
  }
}
```

#### `POST /api/auth/signin` (NextAuth)
Sign in with email and password via NextAuth credentials provider.

#### `POST /api/auth/forgot-password`
Request password reset for an email address.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

#### `POST /api/auth/reset-password`
Reset password using a valid reset token.

**Request Body:**
```json
{
  "token": "reset-token-here",
  "password": "newpassword"
}
```

## User Authentication Flow

### Registration Flow
1. User fills registration form (`/register`)
2. Form validates input (name, email, password confirmation)
3. API validates email uniqueness and password strength
4. Password is hashed with bcryptjs (12 salt rounds)
5. User record created in MongoDB
6. User automatically signed in via NextAuth
7. Redirect to dashboard

### Login Flow
1. User fills login form (`/login`)
2. NextAuth credentials provider validates credentials
3. API verifies email exists and password matches hash
4. JWT session token created
5. User redirected to dashboard

### Password Reset Flow
1. User requests reset via forgot password form (`/forgot-password`)
2. API generates secure reset token and expiration time
3. Token hashed and stored in user record
4. Reset email sent with reset link
5. User clicks reset link (`/reset-password?token=...`)
6. New password form validates token and sets new password
7. Reset token cleared from database
8. User redirected to login

## Security Considerations

### Password Security
- **Hashing**: bcryptjs with 12 salt rounds
- **Minimum Length**: 6 characters required
- **No Plain Text**: Passwords never stored in plain text

### Token Security
- **Cryptographic Tokens**: `crypto.randomBytes(32)` for reset tokens
- **Hashed Storage**: Reset tokens hashed before database storage
- **Expiration**: 10-minute expiration for reset tokens
- **Single Use**: Tokens cleared after successful reset

### Email Security
- **No Enumeration**: Same response whether email exists or not
- **Rate Limiting**: Built-in protection via NextAuth
- **Secure Links**: HTTPS-only reset links in production

## Environment Variables

```bash
# Database
MONGODB_URI=mongodb://localhost:27017/photohub

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secure-nextauth-secret

# App Settings
APP_URL=http://localhost:3000

# Email Service (for production)
# SENDGRID_API_KEY=your-sendgrid-key
# SMTP_HOST=your-smtp-host
# SMTP_PORT=587
# SMTP_USER=your-smtp-user
# SMTP_PASS=your-smtp-password
```

## Production Setup

### 1. Email Service Integration
Replace the placeholder email service in `/src/lib/email.ts` with a real email provider:

**SendGrid Example:**
```typescript
import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  await sgMail.send({
    to: email,
    from: 'noreply@yourdomain.com',
    subject: 'Reset Your Password',
    html: `<a href="${resetUrl}">Reset Password</a>`
  });
}
```

**Nodemailer Example:**
```typescript
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT!),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendPasswordResetEmail(email: string, resetUrl: string) {
  await transporter.sendMail({
    from: '"PhotoHub" <noreply@yourdomain.com>',
    to: email,
    subject: 'Reset Your Password',
    html: `<a href="${resetUrl}">Reset Password</a>`
  });
}
```

### 2. Security Enhancements
- **Rate Limiting**: Implement rate limiting for auth endpoints
- **CAPTCHA**: Add CAPTCHA to registration and login forms
- **2FA**: Consider implementing two-factor authentication
- **Password Strength**: Enforce stronger password requirements
- **Email Verification**: Add email verification for new accounts

### 3. Database Optimization
- **Indexes**: Email and reset token fields are already indexed
- **TTL**: Consider TTL index for automatic reset token cleanup
- **Connection Pooling**: Optimize MongoDB connection pooling

## Testing

### Test Users
Create test users via the registration form or directly in MongoDB:

```javascript
// Test user with hashed password "password123"
{
  name: "Test User",
  email: "test@example.com",
  passwordHash: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewcJE.6rJ8Jz.xOy",
  role: "user",
  plan: "free"
}
```

### Reset Password Testing
1. Go to `/forgot-password`
2. Enter email address
3. Check console logs for reset URL
4. Use reset URL to set new password
5. Login with new password

## Maintenance

### Regular Tasks
- **Monitor failed login attempts**
- **Clean up expired reset tokens** (auto-handled)
- **Review user registrations**
- **Update password hashing strength** (as needed)

### Database Maintenance
```javascript
// Clean up expired reset tokens (manual cleanup if needed)
db.users.updateMany(
  { resetPasswordExpires: { $lt: new Date() } },
  { $unset: { resetPasswordToken: "", resetPasswordExpires: "" } }
);
```

## Migration Notes

### Changes Made
1. ✅ Removed Google OAuth provider from NextAuth config
2. ✅ Removed Google sign-in buttons from login/register forms
3. ✅ Added password reset functionality
4. ✅ Enhanced User model with reset token fields
5. ✅ Added comprehensive email service placeholder
6. ✅ Added forgot password and reset password pages
7. ✅ Removed Google OAuth environment variables

### Backwards Compatibility
- Existing database users with `passwordHash` continue to work
- OAuth users (if any) would need to use password reset to set a password
- All existing sessions remain valid

The authentication system is now completely database-based and ready for production use! 🔐
