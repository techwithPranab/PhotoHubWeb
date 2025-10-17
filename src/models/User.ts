import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: 'user' | 'admin' | 'vendor';
  plan: 'free' | 'premium' | 'pro';
  profileImage?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  passwordHash: {
    type: String,
    // Not required for OAuth users
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'vendor'],
    default: 'user'
  },
  plan: {
    type: String,
    enum: ['free', 'premium', 'pro'],
    default: 'free'
  },
  profileImage: {
    type: String,
  },
  resetPasswordToken: {
    type: String,
  },
  resetPasswordExpires: {
    type: Date,
  }
}, {
  timestamps: true,
});

// Index for faster queries
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
