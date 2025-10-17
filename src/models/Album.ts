import mongoose, { Document, Schema } from 'mongoose';

export interface ICollaborator {
  userId: mongoose.Types.ObjectId;
  permission: 'view' | 'edit' | 'comment';
  addedAt: Date;
}

export interface IAlbum extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId; // Album owner
  title: string;
  description?: string;
  privacy: 'public' | 'private' | 'password';
  password?: string; // Hashed password for password-protected albums
  coverPhoto?: string; // URL to cover photo
  layout: 'grid' | 'collage' | 'mixed';
  theme: {
    backgroundColor: string;
    fontFamily: string;
    fontSize: string;
  };
  collaborators: ICollaborator[];
  photoCount: number;
  totalSize: number; // Total size in bytes
  isPublished: boolean;
  publishedAt?: Date;
  viewCount: number;
  likeCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const CollaboratorSchema = new Schema<ICollaborator>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  permission: {
    type: String,
    enum: ['view', 'edit', 'comment'],
    default: 'view'
  },
  addedAt: {
    type: Date,
    default: Date.now
  }
});

const AlbumSchema = new Schema<IAlbum>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  title: {
    type: String,
    required: [true, 'Album title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  privacy: {
    type: String,
    enum: ['public', 'private', 'password'],
    default: 'private'
  },
  password: {
    type: String,
    // Only required if privacy is 'password'
  },
  coverPhoto: {
    type: String,
  },
  layout: {
    type: String,
    enum: ['grid', 'collage', 'mixed'],
    default: 'grid'
  },
  theme: {
    backgroundColor: {
      type: String,
      default: '#ffffff'
    },
    fontFamily: {
      type: String,
      default: 'Inter'
    },
    fontSize: {
      type: String,
      default: 'medium'
    }
  },
  collaborators: [CollaboratorSchema],
  photoCount: {
    type: Number,
    default: 0
  },
  totalSize: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date,
  },
  viewCount: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
});

// Indexes for faster queries
AlbumSchema.index({ userId: 1, createdAt: -1 });
AlbumSchema.index({ privacy: 1, isPublished: 1 });
AlbumSchema.index({ title: 'text', description: 'text' });

export default mongoose.models.Album || mongoose.model<IAlbum>('Album', AlbumSchema);
