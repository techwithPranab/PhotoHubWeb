import mongoose, { Document, Schema } from 'mongoose';

export interface IContact extends Document {
  _id: string;
  name: string;
  email: string;
  subject: string;
  orderNumber?: string;
  message: string;
  userId?: string; // Reference to User if logged in
  status: 'new' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: 'general' | 'technical' | 'billing' | 'order' | 'feature-request' | 'bug-report';
  userAgent?: string;
  ipAddress?: string;
  response?: string;
  respondedBy?: string; // Admin user ID who responded
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ContactSchema = new Schema<IContact>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot be more than 200 characters']
  },
  orderNumber: {
    type: String,
    trim: true,
    maxlength: [50, 'Order number cannot be more than 50 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot be more than 2000 characters']
  },
  userId: {
    type: String,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['new', 'in-progress', 'resolved', 'closed'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['general', 'technical', 'billing', 'order', 'feature-request', 'bug-report'],
    default: 'general'
  },
  userAgent: {
    type: String,
    maxlength: [500, 'User agent cannot be more than 500 characters']
  },
  ipAddress: {
    type: String,
    maxlength: [45, 'IP address cannot be more than 45 characters']
  },
  response: {
    type: String,
    maxlength: [2000, 'Response cannot be more than 2000 characters']
  },
  respondedBy: {
    type: String,
    ref: 'User'
  },
  respondedAt: {
    type: Date
  }
}, {
  timestamps: true,
});

// Indexes for faster queries
ContactSchema.index({ email: 1 });
ContactSchema.index({ status: 1 });
ContactSchema.index({ priority: 1 });
ContactSchema.index({ category: 1 });
ContactSchema.index({ createdAt: -1 });
ContactSchema.index({ userId: 1 });

export default mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema);
