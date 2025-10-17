import mongoose, { Document, Schema } from 'mongoose';

export interface ITemplate extends Document {
  _id: string;
  name: string;
  description: string;
  image: string;
  category: 'photo-books' | 'wedding' | 'baby' | 'travel' | 'yearbook' | 'coffee-table' | 'magazine';
  size: string;
  pages: string;
  binding: string;
  price: string;
  features: string[];
  popular: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TemplateSchema = new Schema<ITemplate>({
  name: {
    type: String,
    required: [true, 'Template name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  image: {
    type: String,
    required: [true, 'Image path is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['photo-books', 'wedding', 'baby', 'travel', 'yearbook', 'coffee-table', 'magazine']
  },
  size: {
    type: String,
    required: [true, 'Size is required'],
    trim: true
  },
  pages: {
    type: String,
    required: [true, 'Pages range is required'],
    trim: true
  },
  binding: {
    type: String,
    required: [true, 'Binding type is required'],
    trim: true
  },
  price: {
    type: String,
    required: [true, 'Price is required'],
    trim: true
  },
  features: [{
    type: String,
    trim: true,
    maxlength: [100, 'Feature cannot be more than 100 characters']
  }],
  popular: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
});

// Indexes for faster queries
TemplateSchema.index({ category: 1 });
TemplateSchema.index({ popular: -1 });
TemplateSchema.index({ name: 1 });

export default mongoose.models.Template || mongoose.model<ITemplate>('Template', TemplateSchema);
