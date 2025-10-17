import mongoose, { Document, Schema } from 'mongoose';

export interface IAlbumElement {
  id: string;
  type: 'photo' | 'text' | 'sticker' | 'background' | 'shape';
  url?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  layerIndex: number;
  
  // Text-specific properties
  text?: string;
  font?: string;
  fontSize?: number;
  color?: string;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: 'left' | 'center' | 'right';
  
  // Photo-specific properties
  opacity?: number;
  filter?: string;
  
  // Shape-specific properties
  shapeType?: 'rectangle' | 'circle' | 'triangle' | 'line';
  fillColor?: string;
  strokeColor?: string;
  strokeWidth?: number;
  
  // General styling
  borderRadius?: number;
  shadow?: {
    offsetX: number;
    offsetY: number;
    blur: number;
    color: string;
  };
}

export interface IAlbumPage extends Document {
  _id: string;
  albumId: mongoose.Types.ObjectId;
  pageNumber: number;
  pageType: 'cover' | 'content' | 'back';
  layoutTemplate?: string;
  elements: IAlbumElement[];
  pageBackground: {
    type: 'color' | 'gradient' | 'image' | 'pattern';
    value: string;
    opacity?: number;
  };
  dimensions: {
    width: number;
    height: number;
    unit: 'px' | 'in' | 'cm' | 'mm';
  };
  createdAt: Date;
  updatedAt: Date;
}

const AlbumElementSchema = new Schema<IAlbumElement>({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['photo', 'text', 'sticker', 'background', 'shape']
  },
  url: {
    type: String,
    required: function(this: IAlbumElement) {
      return this.type === 'photo' || this.type === 'sticker' || this.type === 'background';
    }
  },
  x: {
    type: Number,
    required: true,
    default: 0
  },
  y: {
    type: Number,
    required: true,
    default: 0
  },
  width: {
    type: Number,
    required: true,
    min: 1
  },
  height: {
    type: Number,
    required: true,
    min: 1
  },
  rotation: {
    type: Number,
    default: 0,
    min: -360,
    max: 360
  },
  layerIndex: {
    type: Number,
    required: true,
    default: 0
  },
  
  // Text properties
  text: String,
  font: {
    type: String,
    default: 'Arial'
  },
  fontSize: {
    type: Number,
    default: 16,
    min: 8,
    max: 200
  },
  color: {
    type: String,
    default: '#000000'
  },
  fontWeight: {
    type: String,
    default: 'normal',
    enum: ['normal', 'bold', '100', '200', '300', '400', '500', '600', '700', '800', '900']
  },
  fontStyle: {
    type: String,
    default: 'normal',
    enum: ['normal', 'italic', 'oblique']
  },
  textAlign: {
    type: String,
    default: 'left',
    enum: ['left', 'center', 'right', 'justify']
  },
  
  // Photo properties
  opacity: {
    type: Number,
    default: 1,
    min: 0,
    max: 1
  },
  filter: String,
  
  // Shape properties
  shapeType: {
    type: String,
    enum: ['rectangle', 'circle', 'triangle', 'line']
  },
  fillColor: String,
  strokeColor: String,
  strokeWidth: {
    type: Number,
    default: 1,
    min: 0
  },
  
  // General styling
  borderRadius: {
    type: Number,
    default: 0,
    min: 0
  },
  shadow: {
    offsetX: { type: Number, default: 0 },
    offsetY: { type: Number, default: 0 },
    blur: { type: Number, default: 0 },
    color: { type: String, default: 'rgba(0,0,0,0.3)' }
  }
}, { _id: false });

const AlbumPageSchema = new Schema<IAlbumPage>({
  albumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album',
    required: true,
    index: true
  },
  pageNumber: {
    type: Number,
    required: true,
    min: 1
  },
  pageType: {
    type: String,
    required: true,
    enum: ['cover', 'content', 'back'],
    default: 'content'
  },
  layoutTemplate: {
    type: String,
    default: 'blank'
  },
  elements: [AlbumElementSchema],
  pageBackground: {
    type: {
      type: String,
      required: true,
      enum: ['color', 'gradient', 'image', 'pattern'],
      default: 'color'
    },
    value: {
      type: String,
      required: true,
      default: '#ffffff'
    },
    opacity: {
      type: Number,
      default: 1,
      min: 0,
      max: 1
    }
  },
  dimensions: {
    width: {
      type: Number,
      required: true,
      default: 800
    },
    height: {
      type: Number,
      required: true,
      default: 600
    },
    unit: {
      type: String,
      required: true,
      enum: ['px', 'in', 'cm', 'mm'],
      default: 'px'
    }
  }
}, {
  timestamps: true
});

// Compound index for efficient page queries
AlbumPageSchema.index({ albumId: 1, pageNumber: 1 }, { unique: true });

// Index for ordering pages
AlbumPageSchema.index({ albumId: 1, pageNumber: 1, pageType: 1 });

export default mongoose.models.AlbumPage || mongoose.model<IAlbumPage>('AlbumPage', AlbumPageSchema);
