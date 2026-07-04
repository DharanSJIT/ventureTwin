import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config({ override: true });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for Profile Images
export const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: any, file: any) => {
    return {
      folder: 'venturetwin/avatars',
      format: 'png', // or keep original
      public_id: `${req.user?._id || 'user'}_avatar`, // user._id appended by auth middleware
    };
  },
});

// Storage for PDF Resumes
export const resumeStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: any, file: any) => {
    return {
      folder: 'venturetwin/resumes',
      resource_type: 'raw', 
      public_id: `${req.user?._id || 'user'}_resume.pdf`, // For raw files, extension in public_id is needed
    };
  },
});

export default cloudinary;
