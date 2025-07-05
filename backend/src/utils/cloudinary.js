import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import APIError from "./apiError.js";
import { configDotenv } from "dotenv";
configDotenv();

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadCloudinary = async (localFile) => {
  try {
    if (!localFile) return null;

    const response = await cloudinary.uploader.upload(localFile);
    if (response) {
      fs.unlinkSync(localFile);
    }
    return response;
  } catch (error) {
    console.log(error);
    fs.unlinkSync(localFile);
    throw new APIError("Error uploading image", 400);
  }
};

const deleteFromCloudinary = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw new APIError(400, "Error deleting Image");
  }
};

export { uploadCloudinary, deleteFromCloudinary };
