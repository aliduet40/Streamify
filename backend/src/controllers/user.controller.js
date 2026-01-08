//// Recommendation industry standard
// Controllers   --> named export controller
import { asyncHandler } from "../utils/asyncHandler.js"; // helper function
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const userRegister = asyncHandler(async (req, res) => {
  // user register steps
  // get details from user
  // data validation like email and username are empty
  // check if user already exist ()
  // check images and avatar
  // upload them on cloudinary (avatar , images)
  // create userObject - create entry in db
  // remove password and refresh token field from response
  // check user creation
  // return response

  const { username, fullname, email, password } = req.body;
  if (!fullname || fullname.trim() === "") {
    throw new ApiError(400, "fullname does not provide");
  }

  if (!email || email.trim() === "") {
    throw new ApiError(400, "email address does not provide");
  }

  if (!password || password.trim() === "") {
    throw new ApiError(400, "Password does not provide");
  }

  if (!username || username.trim() === "") {
    throw new ApiError(400, "username does not provide");
  }

  // check existing user in db find by email and username
  const existingUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  // console.log(`Existing User: ${existingUser}`)

  if (existingUser) {
    throw new ApiError(409, "This Username and email are already exist");
  }

  // const avatarLocalPath = req.files?.avatar?.[0]?.path;
  // const coverImageLocalPath = req.files?.coverImage?.[0]?.path || null;

  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path || null;
  console.log(req.files);
  console.log("Avatar Local Path:", avatarLocalPath);
  console.log("Cover Image Local Path:", coverImageLocalPath);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar must be required.");
  }

  // if (!avatarLocalPath?.secure_url) {
  //   throw new ApiError(400, "Avatar must be required.");
  // }
  // console.log("BEFORE Cloudinary upload");
  const avatarResponse = await uploadOnCloudinary(avatarLocalPath);
  const imageResponse = null;
  if (coverImageLocalPath) {
    imageResponse = await uploadOnCloudinary(coverImageLocalPath);
  }
  // console.log("AFTER Cloudinary upload");
  console.log("Cloudianry Avatar Response:", avatarResponse);
  console.log("Cloudinary Image Response:", imageResponse);

  const userCreated = await User.create({
    // insert userCreated object in db  mongodb query excuted
    fullname,
    email: email.toLowerCase(),
    avatar: avatarResponse?.secure_url,
    coverImage: imageResponse?.secure_url || "",
    password,
    username: username.toLowerCase(),
  });

  console.log("Avatar:", avatarResponse?.secure_url);
  // remove password and refresh token field from response

  const user = await User.findById(userCreated._id).select(
    "-password -refreshToken" // ye dono fields nhi ayeee G user response me
  );

  if (!user) {
    throw new ApiError(
      500,
      "User not found OR User registration requset has been failed."
    );
  }

  // it will return proper response through utils
  return res
    .status(201)
    .json(new ApiResponse(200, user, "User Register Successfully"));
});

// The 409 Conflict status code indicates that the server could not complete the client's request because it conflicts with the current state of the target resource. This error is commonly encountered in situations involving version control, concurrent edits, or attempts to create a duplicate resource.
