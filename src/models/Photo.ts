import mongoose, { Document, Schema } from 'mongoose';

export interface IPhoto extends Document {
  _id: string;
  albumId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  public_id: string; // Cloudinary public_id
  url: string; // Cloudinary secure_url
  thumbnailUrl: string; // Optimized thumbnail URL
  originalFilename: string;
  caption?: string;
  tags: string[];
  metadata: {
    width: number;
    height: number;
    format: string;
    bytes: number;
  };
  order: number; // For photo ordering in album
  createdAt: Date;
  updatedAt: Date;
}

const PhotoSchema = new Schema<IPhoto>({
  albumId: {
    type: Schema.Types.ObjectId,
    ref: 'Album',
    required: [true, 'Album ID is required']
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  public_id: {
    type: String,
    required: [true, 'Cloudinary public_id is required'],
    unique: true
  },
  url: {
    type: String,
    required: [true, 'Photo URL is required']
  },
  thumbnailUrl: {
    type: String,
    required: [true, 'Thumbnail URL is required']
  },
  originalFilename: {
    type: String,
    required: [true, 'Original filename is required']
  },
  caption: {
    type: String,
    maxlength: [500, 'Caption cannot be more than 500 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag cannot be more than 30 characters']
  }],
  metadata: {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    format: { type: String, required: true },
    bytes: { type: Number, required: true }
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
});

// Indexes for faster queries
PhotoSchema.index({ albumId: 1, order: 1 });
PhotoSchema.index({ userId: 1 });
PhotoSchema.index({ public_id: 1 });
PhotoSchema.index({ tags: 1 });

export default mongoose.models.Photo || mongoose.model<IPhoto>('Photo', PhotoSchema);
