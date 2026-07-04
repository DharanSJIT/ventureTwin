import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function run() {
  try {
    const res = await cloudinary.uploader.upload('package.json', { 
      resource_type: 'image', // test forcing it as image even though it's json, just to see if 403 is bypassed, or better test an actual image
      folder: 'test',
    });
    console.log('SUCCESS:', res);
  } catch (err) {
    console.error('ERROR:', err);
  }
}

run();
