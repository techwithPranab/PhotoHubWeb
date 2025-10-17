// Common type aliases
export type UserRole = 'user' | 'admin' | 'vendor';
export type UserPlan = 'free' | 'premium' | 'pro';
export type AlbumPrivacy = 'public' | 'private' | 'password';
export type AlbumLayout = 'grid' | 'collage' | 'mixed';
export type PrintSize = 'small' | 'medium' | 'large' | 'xl';
export type PaperType = 'matte' | 'glossy' | 'premium';
export type CoverType = 'softcover' | 'hardcover';
export type OrderStatus = 'pending' | 'processing' | 'printing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type CollaborationPermission = 'view' | 'edit' | 'comment';

// Next.js API error response
export interface ApiError {
  error: string;
  details?: string;
}

// Next.js API success response
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  plan: UserPlan;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

// Album types
export interface Album {
  id: string;
  userId: string;
  title: string;
  description?: string;
  privacy: AlbumPrivacy;
  coverPhoto?: string;
  layout: AlbumLayout;
  theme: {
    backgroundColor: string;
    fontFamily: string;
    fontSize: string;
  };
  photoCount: number;
  totalSize: number;
  isPublished: boolean;
  publishedAt?: string;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AlbumView extends Album {
  owner: {
    id: string;
    name: string;
    email: string;
  };
  photos: Photo[];
  userRole: 'owner' | 'collaborator' | 'viewer';
}

// Photo types
export interface Photo {
  id: string;
  albumId: string;
  userId: string;
  public_id: string; // Cloudinary public_id
  url: string;
  thumbnailUrl: string;
  originalFilename: string;
  caption?: string;
  tags: string[];
  metadata: {
    width: number;
    height: number;
    format: string;
    bytes: number;
  };
  order: number;
  createdAt: string;
  updatedAt: string;
}

// Order types
export interface OrderItem {
  albumId: string;
  albumTitle: string;
  printSize: PrintSize;
  paperType: PaperType;
  coverType: CoverType;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface ShippingInfo {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  stripePaymentIntentId?: string;
  shippingInfo: ShippingInfo;
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Form types
export interface CreateAlbumForm {
  title: string;
  description?: string;
  privacy: AlbumPrivacy;
  password?: string;
  layout: AlbumLayout;
  theme: {
    backgroundColor: string;
    fontFamily: string;
    fontSize: string;
  };
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Upload types
export interface UploadProgress {
  [fileId: string]: number;
}

export interface UploadResponse {
  success: boolean;
  photo?: {
    id: string;
    url: string;
    thumbnailUrl: string;
    caption?: string;
    tags: string[];
    metadata: {
      width: number;
      height: number;
      format: string;
      bytes: number;
    };
  };
  error?: string;
}

// Pagination types
export interface PaginationInfo {
  current: number;
  pages: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationInfo;
}

// Search and filter types
export interface AlbumFilters {
  search?: string;
  privacy?: AlbumPrivacy;
  page?: number;
  limit?: number;
}

// Collaboration types
export interface Collaborator {
  userId: string;
  permission: CollaborationPermission;
  addedAt: string;
}

// Cloudinary types
export interface CloudinaryUploadResult {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
  created_at: string;
}
