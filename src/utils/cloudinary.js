import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // upload the file on cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("===============================");
    console.log(response);
    console.log("===============================");

    // file has been uploaded successfully
    console.log("File is upload on cloudinary", response.url);
    return response;
  } catch (error) {
    // we use syncronous unlink function as we need to first unlink this file-path then we go further to code i.e. it's important to do this task first.
    fs.unlinkSync(localFilePath); // Remove the locally saved temprory fileas as the upload operation got failed
    return null;
  }
};




export {uploadOnCloudinary} 