import express from 'express'
import upload from '../utils/multer.js'
import { uploadMedia } from '../utils/cloudinary.js'

const router = express.Router();

// Handle file upload for both images and videos
router.route('/upload-video').post(upload.single("file"), async(req, res) => {
  try {
    console.log('File upload request received');

    // Check if file was provided
    if (!req.file) {
      console.error('No file provided in the request');
      return res.status(400).json({
        success: false,
        message: "No file provided"
      });
    }

    // Log file details
    console.log('File details:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    });

    // Upload to Cloudinary
    const result = await uploadMedia(req.file.path);

    // Check if result exists
    if (!result) {
      console.error('Cloudinary upload failed with no error');
      return res.status(500).json({
        success: false,
        message: "Upload failed"
      });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: result,
      url: result.secure_url
    });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);

    // Return appropriate error message
    return res.status(500).json({
      success: false,
      message: error.message || "Server Error during upload"
    });
  }
});

// Add a route for image uploads specifically
router.route('/upload-image').post(upload.single("image"), async(req, res) => {
  try {
    console.log('Image upload request received');

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image provided"
      });
    }

    const result = await uploadMedia(req.file.path);

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      data: result,
      url: result.secure_url
    });
  } catch (error) {
    console.error("IMAGE UPLOAD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Server Error during image upload"
    });
  }
})


export default router;