import {v2 as cloudinary} from 'cloudinary'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config({})

// Log Cloudinary configuration for debugging
const cloudConfig = {
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
};

console.log('Cloudinary Configuration:', {
  cloud_name: cloudConfig.cloud_name,
  api_key: cloudConfig.api_key ? '****' + cloudConfig.api_key.slice(-4) : 'missing',
  api_secret: cloudConfig.api_secret ? '****' : 'missing'
});

cloudinary.config(cloudConfig)


// uploadMedia to upload all file photo video

export const uploadMedia = async(file) => {
  try {
    console.log('Attempting to upload file:', file);

    // Check if file exists
    if (!fs.existsSync(file)) {
      console.error(`File does not exist at path: ${file}`);
      throw new Error(`File does not exist at path: ${file}`);
    }

    // Log file size
    const stats = fs.statSync(file);
    console.log(`File size: ${stats.size} bytes`);

    // Upload to Cloudinary with resource_type auto to handle both images and videos
    const uploadResponse = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
      timeout: 120000 // 2 minute timeout for large files
    });

    console.log('Upload successful:', {
      public_id: uploadResponse.public_id,
      url: uploadResponse.secure_url,
      format: uploadResponse.format,
      resource_type: uploadResponse.resource_type
    });

    // Delete the temporary file after successful upload
    fs.unlinkSync(file);

    return uploadResponse;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error; // Re-throw to handle in the route
  }
}


// deleteUpload file photo

export const deleteMediaFromCloudinary = async(publicId) => {
  try {
   await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.log(error)
  }
}

// deletUpload video files

export const deleteVideoFromCloudinary = async (publicId) => {
  try {

    await cloudinary.uploader.destroy(publicId, {resource_type:"video"})

  } catch (error) {
    console.log(error)
  }
}