import { User } from "../../modules/userModel.js";
import bcrypt from 'bcryptjs'
import { generateToken } from "../../utils/generateToken.js";
import { deleteMediaFromCloudinary, uploadMedia } from "../../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    
    const {name, email, password} = req.body;
    if(!name || !email || !password) {
      return res.status(400).json({success:false, message:"All field are required."})
    }

    const user = await User.findOne({email});
    if(user) {
      return res.status(400).json({success:false,message:"User already exist with this email"})
    }

    // password secure 
    const hashPassword = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password : hashPassword});
      return res.status(201).json({success:true, message:"Account create successfully"})

  } catch (error) {
   console.error(error)
   res.status(500).json({success:false,message:"failed to register"})
  }
}

export const login = async(req, res) => {

  try {
  
    const {email, password} = req.body;

    if(!email || !password) {
     return res.status(404).json({success:false, message:"All field are required"})
    }
    const user = await User.findOne({email});
    if(!user) {
      return res.status(400).json({ success: false, message: "Incorrect email" });

    } 

    const isPasswordMatch = await bcrypt.compare(password, user.password)
    if(!isPasswordMatch) {
      return res.status(400).json({success:false, message:"Incorrect password"})
    }

    // generateToken link with another component
    return generateToken(res, user, `Welcome back ${user.name}`);

    
  } catch (error) {
    console.log(error)
    res.status(500).json({message:"Server Error"})
  }
}

export const logout = async(_, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { maxAge: 0 }) 
      .json({
        message: "Logged out successfully", 
        success: true
      });

  } catch (error) {
    console.log(error);
   return res.status(500).json({
      success: false,
      message: "Failed to logout"
    });
  }
};

export const getUserProfile = async(req, res) => {
  try {
    //req from middleware
    const userId = req.id;

    const user = await User.findById(userId).select("-password");

    if(!user) {
      return res.status(401).json({success:false, message:"Profile not found"})
    }
    return res.status(200).json({success:true, user})

  } catch (error) {
    console.log(error)
    return res.status(500).json({success:true, message:"Server Error"})
  }
}



    export const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { name } = req.body;
    const profilePhoto = req.file;

    if (!userId) {
      return res.status(400).json({ success: false, message: "User ID is required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Delete old profile photo if it exists
    if (user.photoUrl) {
      const publicId = user.photoUrl.split("/").pop().split(".")[0];
      await deleteMediaFromCloudinary(publicId);
    }

    let photoUrl = user.photoUrl; // Default to existing photoUrl
    
    // Upload new photo if provided
    if (profilePhoto) {
      const cloudResponse = await uploadMedia(profilePhoto.path);
      if (!cloudResponse || !cloudResponse.secure_url) {
        return res.status(500).json({ success: false, message: "Failed to upload image" });
      }
      photoUrl = cloudResponse.secure_url;
    }

    // Update user data
    const updatedData = { name, photoUrl };
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });

    return res.status(200).json({
      success: true,
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};
