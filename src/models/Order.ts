import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
  albumId: mongoose.Types.ObjectId;
  albumTitle: string;
  printSize: 'small' | 'medium' | 'large' | 'xl';
  paperType: 'matte' | 'glossy' | 'premium';
  coverType: 'softcover' | 'hardcover';
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface IShippingInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface IOrder extends Document {
  _id: string;
  userId: mongoose.Types.ObjectId;
  orderNumber: string; // Unique order identifier
  items: IOrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  status: 'pending' | 'processing' | 'printing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  stripePaymentIntentId?: string;
  shippingInfo: IShippingInfo;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  albumId: {
    type: Schema.Types.ObjectId,
    ref: 'Album',
    required: true
  },
  albumTitle: {
    type: String,
    required: true
  },
  printSize: {
    type: String,
    enum: ['small', 'medium', 'large', 'xl'],
    required: true
  },
  paperType: {
    type: String,
    enum: ['matte', 'glossy', 'premium'],
    required: true
  },
  coverType: {
    type: String,
    enum: ['softcover', 'hardcover'],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  }
});

const ShippingInfoSchema = new Schema<IShippingInfo>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String, required: true },
  country: { type: String, required: true },
  phone: { type: String }
});

const OrderSchema = new Schema<IOrder>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  items: [OrderItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  shipping: {
    type: Number,
    required: true,
    min: 0
  },
  tax: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'printing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  stripePaymentIntentId: {
    type: String,
  },
  shippingInfo: {
    type: ShippingInfoSchema,
    required: true
  },
  trackingNumber: {
    type: String,
  },
  estimatedDelivery: {
    type: Date,
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  }
}, {
  timestamps: true,
});

// Indexes for faster queries
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ orderNumber: 1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ paymentStatus: 1 });

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
