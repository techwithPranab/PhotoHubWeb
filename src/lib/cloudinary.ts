import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

// Helper function to generate optimized URLs
export const getOptimizedImageUrl = (publicId: string, options: {
  width?: number;
  height?: number;
  quality?: string;
  format?: string;
} = {}) => {
  const {
    width = 800,
    height,
    quality = 'auto',
    format = 'auto'
  } = options;

  return cloudinary.url(publicId, {
    width,
    height,
    quality,
    format,
    crop: 'fill',
    gravity: 'auto',
  });
};

// Generate thumbnail URL
export const getThumbnailUrl = (publicId: string, size: number = 300) => {
  return cloudinary.url(publicId, {
    width: size,
    height: size,
    quality: 'auto',
    format: 'auto',
    crop: 'fill',
    gravity: 'auto',
  });
};

// Generate preview URL for album covers
export const getAlbumCoverUrl = (publicId: string) => {
  return cloudinary.url(publicId, {
    width: 400,
    height: 300,
    quality: 'auto',
    format: 'auto',
    crop: 'fill',
    gravity: 'auto',
  });
};
