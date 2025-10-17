import mongoose, { Document, Schema } from 'mongoose';

export interface IEditorProject extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  albumId: mongoose.Types.ObjectId;
  projectName: string;
  description?: string;
  thumbnail?: string;
  
  // Editor configuration
  editorSettings: {
    canvasWidth: number;
    canvasHeight: number;
    unit: 'px' | 'in' | 'cm' | 'mm';
    dpi: number;
    showGrid: boolean;
    snapToGrid: boolean;
    gridSize: number;
    showGuides: boolean;
    snapToGuides: boolean;
  };
  
  // Project metadata
  lastEditedPageId?: mongoose.Types.ObjectId;
  totalPages: number;
  status: 'draft' | 'published' | 'archived';
  version: number;
  
  // Collaboration
  collaborators: Array<{
    userId: mongoose.Types.ObjectId;
    role: 'owner' | 'editor' | 'viewer';
    invitedAt: Date;
    lastActiveAt?: Date;
  }>;
  
  // Export settings
  exportSettings: {
    format: 'pdf' | 'jpg' | 'png';
    quality: 'low' | 'medium' | 'high' | 'print';
    colorProfile: 'sRGB' | 'CMYK' | 'Adobe RGB';
    bleed: number; // in mm
  };
  
  createdAt: Date;
  updatedAt: Date;
}

const EditorProjectSchema = new Schema<IEditorProject>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  albumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: true,
    unique: true // One editor project per album
  },
  projectName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  thumbnail: {
    type: String,
    trim: true
  },
  
  editorSettings: {
    canvasWidth: {
      type: Number,
      required: true,
      default: 800,
      min: 100,
      max: 5000
    },
    canvasHeight: {
      type: Number,
      required: true,
      default: 600,
      min: 100,
      max: 5000
    },
    unit: {
      type: String,
      required: true,
      enum: ['px', 'in', 'cm', 'mm'],
      default: 'px'
    },
    dpi: {
      type: Number,
      required: true,
      default: 300,
      min: 72,
      max: 600
    },
    showGrid: {
      type: Boolean,
      default: true
    },
    snapToGrid: {
      type: Boolean,
      default: true
    },
    gridSize: {
      type: Number,
      default: 20,
      min: 5,
      max: 100
    },
    showGuides: {
      type: Boolean,
      default: true
    },
    snapToGuides: {
      type: Boolean,
      default: true
    }
  },
  
  lastEditedPageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AlbumPage'
  },
  totalPages: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  status: {
    type: String,
    required: true,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  version: {
    type: Number,
    required: true,
    default: 1,
    min: 1
  },
  
  collaborators: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      required: true,
      enum: ['owner', 'editor', 'viewer'],
      default: 'viewer'
    },
    invitedAt: {
      type: Date,
      required: true,
      default: Date.now
    },
    lastActiveAt: {
      type: Date
    }
  }],
  
  exportSettings: {
    format: {
      type: String,
      required: true,
      enum: ['pdf', 'jpg', 'png'],
      default: 'pdf'
    },
    quality: {
      type: String,
      required: true,
      enum: ['low', 'medium', 'high', 'print'],
      default: 'high'
    },
    colorProfile: {
      type: String,
      required: true,
      enum: ['sRGB', 'CMYK', 'Adobe RGB'],
      default: 'sRGB'
    },
    bleed: {
      type: Number,
      default: 0,
      min: 0,
      max: 10
    }
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
EditorProjectSchema.index({ userId: 1, status: 1 });
EditorProjectSchema.index({ albumId: 1 });
EditorProjectSchema.index({ 'collaborators.userId': 1 });

export default mongoose.models.EditorProject || mongoose.model<IEditorProject>('EditorProject', EditorProjectSchema);
