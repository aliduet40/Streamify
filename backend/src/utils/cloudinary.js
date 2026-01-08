// Two Steps Follow
// 1. user images and videos upload krega and usko hm apne server m rkhe g public folder m is lea k hmme shayd re-attempt ya uplaod ka scenrio bne to hm isko apne server m hold rkhr G
//2. next phase me local storage se hmre path se upload kre g cloudinary me

import { v2 as cloudinary } from "cloudinary"; // v2 ko hmne name dya h cloudinary
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log(
        "Wrong File Path System could not find your path try again!!!"
      );
    }
    // upload file on cloudianry
    const cloudinaryResponse = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    // when file upload on cloudinary successfully
    console.log(
      "File Successfully Uploaded on Cloudinary:",
      cloudinaryResponse.url
    );
    // console.log("WHOLE Cloudinary Response:", cloudinaryResponse);
    fs.unlinkSync(localFilePath); //when successfully file upload cloudianry it will delete my server
    return cloudinaryResponse; // return cloudinary URL
  } catch (error) {
    fs.unlinkSync(localFilePath); // remove locally saves file temporary files when the successfully upload files on cloudinary
    return null;
  }
};

export { uploadOnCloudinary };
