//// Recommendation industry standard
// Controllers   --> named export controller
import { asyncHandler } from "../utils/asyncHandler.js"; // helper function
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

const generateAccessTokenAndRefreshToken = async (id) => {
  const user = await User.findById(id);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken; // refresh token add in user table
  const savedUser = await user.save({ validateBeforeSave: false }); // "Database me save kar do, validation check mat karo
  console.log(savedUser);
  return { accessToken, refreshToken };
};

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(200, req.user, "Fetch User Info Successfully");
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;
  if (!fullname || !email) {
    throw new ApiError("Fullname and email are required.");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { fullname: fullname, email },
    },
    { new: true }, // return new updated records
  ).select("-password -refreshToken"); // fetch user in db all info except password and refreshToken
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedUserProfile: user },
        "Update User Profile Successfully",
      ),
    );
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  // if avatarLocalPath not exist
  if (!avatarLocalPath) {
    throw new ApiError(
      400,
      "Profile picture is required.Please upload an avatar.",
    );
  }
  const avatarUrl = await uploadOnCloudinary(avatarLocalPath);
  // if file not uploaded on cloudinary
  if (!avatarUrl.url) {
    throw new ApiError(
      400,
      "Profile picture update failed. Please try again or upload a different image.",
    );
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true },
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Update User Avatar Successfully"));
});

// Update User Cover Image
const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;
  let imageUrl = "";
  // if image local path exist because coverimage is optional
  if (coverImageLocalPath) {
    imageUrl = await uploadOnCloudinary(coverImageLocalPath);
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: imageUrl.url,
      },
    },
    { new: true },
  ).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Update user cover image successfully"));
});

const deleteUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user?._id;
  // const { id } = req.params;
  // console.log("Request Params:", req.params);
  console.log("User id:", userId);
  const user = await User.findById(userId);
  console.log(user);
  if (!user) {
    throw new ApiError(404, " User account not found or already deleted.");
  }
  const userDeleted = await User.findByIdAndDelete(userId);
  console.log("User deleted:", userDeleted);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "User Account deleted Successfully."));
});

export {
  deleteUserProfile,
  updateUserAvatar,
  updateUserCoverImage,
  updateUserProfile,
};

// The 409 Conflict status code indicates that the server could not complete the client's request because it conflicts with the current state of the target resource. This error is commonly encountered in situations involving version control, concurrent edits, or attempts to create a duplicate resource.
