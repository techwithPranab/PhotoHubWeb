import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  siteName: string;
  siteDescription: string;
  defaultCurrency: string;
  allowRegistration: boolean;
  emailNotifications: boolean;
  orderAutoApproval: boolean;
  maxFileUploadSize: number;
  maintenanceMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>({
  siteName: {
    type: String,
    required: true,
    default: 'PhotoHub'
  },
  siteDescription: {
    type: String,
    required: true,
    default: 'Professional photography services'
  },
  defaultCurrency: {
    type: String,
    required: true,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
  },
  allowRegistration: {
    type: Boolean,
    default: true
  },
  emailNotifications: {
    type: Boolean,
    default: true
  },
  orderAutoApproval: {
    type: Boolean,
    default: false
  },
  maxFileUploadSize: {
    type: Number,
    default: 10,
    min: 1,
    max: 100
  },
  maintenanceMode: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
settingsSchema.index({}, { unique: true });

export const Settings = mongoose.models.Settings || mongoose.model<ISettings>('Settings', settingsSchema);
