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
  console.log("Request Files:", req.files);
  console.log("Request Body:", req.body);

  // console.log("Avatar Local Path:", avatarLocalPath);
  // console.log("Cover Image Local Path:", coverImageLocalPath);

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar must be required.");
  }

  // if (!avatarLocalPath?.secure_url) {
  //   throw new ApiError(400, "Avatar must be required.");
  // }
  // console.log("BEFORE Cloudinary upload");
  const avatarResponse = await uploadOnCloudinary(avatarLocalPath);
  let imageResponse = null;
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

  // console.log("Avatar:", avatarResponse?.secure_url);
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

export const userLogin = asyncHandler(async (req, res) => {
  // steps of user login
  //1. get emial and password from user
  //2. valiadate from email and password.
  // find the user
  // check the password
  // 3. generate access token (short lived)
  // 4. payload some user data aquired (like id ,name etc)
  // 5. user not loggedIn or invalid credentials throw error
  // 6. some securty reason admin expires access token it will craete refresh token
  // 7. both refresh token are same user now access again for app resources
  // 8. refresh token saves as sessions or cookies from user browser

  const { username, email, password } = req.body;
  if (!password || !(username || email)) {
    throw new ApiError(400, "Username/email and password are required");
  }
  // const userFind = await User.findOne({
  //   $or: [{ username }, { email }].select("+password"),
  // }); // find user in db by email and username

  const userFind = await User.findOne({
    $or: [{ username }, { email }],
  }).select("+password");

  // console.log("Password type:", typeof password);
  // console.log("DB Password type:", typeof userFind.password);
  // console.log("Password:", password);
  // console.log("DB Password:", userFind.password);
  console.log("User:", userFind);
  // If user not exists
  if (!userFind) {
    throw new ApiError(404, "User does not exits");
  }

  // if user is exist then we will do checking user password

  const isPasswordValid = await userFind.isPaswordCorrect(password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid User Credentials:");
  }

  // if user passowrd correct then it will create JWT token

  const { accessToken, refreshToken } =
    await generateAccessTokenAndRefreshToken(userFind._id);
  const loggedInUser = await User.findById(userFind._id).select(
    "-password -refreshToken"
  );

  console.log("AccessToken:", accessToken);
  console.log("RefreshToken:", refreshToken);

  // Send secure cookies only server can modify the cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("AccessToken", accessToken, options) // send the cookie
    .cookie("RefreshToken", refreshToken, options) // send the cookie
    .json(
      new ApiResponse(
        200,
        { loggedInUser: loggedInUser, accessToken, refreshToken },
        "User Login Successfully."
      )
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  const id = req.user._id;
  await User.findByIdAndUpdate(
    id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true } // return new updated records
  );
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("AccessToken", options) // when clear cookies use quotes use as string not variable
    .clearCookie("RefreshToken", options) // when clear cookies use quotes use as string not variable
    .json(new ApiResponse(200, {}, "User logout Successfully"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;
  if (!incomingRefreshToken) {
    throw new ApiError(401, "UnAuthorized Request or Invalid Request");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ApiError(401, "Invalid Refresh Token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token is expires or already used");
    }

    const { accessToken, newRefreshToken } =
      await generateAccessTokenAndRefreshToken(user?._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("AccessToken", accessToken, options)
      .cookie("RefreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, NewRefreshToken: newRefreshToken },
          "Your Access Token is Refresh"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Refresh Token");
  }
});

export const forgotPassword = asyncHandler(async (req, res) => {
  // ye check krna k lea user loggedIn h ya nhi uske lea middleware bnaya h hmne agr user loggedIn nhi h to password forgot ka sense nhi bnta
  const { oldPassword, newPassword } = req.body;
  // find user who change the password agr wo password change kr rh mtlb wo loggedIn user
  const user = await User.findById(req.user?._id);
  // Checked user old password or verify password is not found it will throw error
  const isPasswordCorrect = await user.isPaswordCorrect(oldPassword);
  // if old password wrong throw error
  if (!isPasswordCorrect) {
    throw new ApiError(400, "Authentication Failed Invalid Password.try agian");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false }); // password field modify h ab db password save kr rh
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password Changed Successfully"));
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(200, req.user, "Fetch User Info Successfully");
});

export const updateUserProfile = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;
  if (!fullname || !email) {
    throw new ApiError("Fullname and email are required.");
  }
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { fullname: fullname, email },
    },
    { new: true } // return new updated records
  ).select("-password -refreshToken"); // fetch user in db all info except password and refreshToken
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { updatedUserProfile: user },
        "Update User Profile Successfully"
      )
    );
});

export const updateAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;
  // if avatarLocalPath not exist
  if (!avatarLocalPath) {
    throw new ApiError(
      400,
      "Profile picture is required.Please upload an avatar."
    );
  }
  const avatarUrl = await uploadOnCloudinary(avatarLocalPath);
  // if file not uploaded on cloudinary
  if (!avatarUrl.url) {
    throw new ApiError(
      400,
      "Profile picture update failed. Please try again or upload a different image."
    );
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Update User Avatar Successfully"));
});

// Update User Cover Image
export const updateCoverImage = asyncHandler(async (req, res) => {
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
    { new: true }
  ).select("-password");
  return res
    .status(200)
    .json(new ApiResponse(200, user, "Update user cover image successfully"));
});

// The 409 Conflict status code indicates that the server could not complete the client's request because it conflicts with the current state of the target resource. This error is commonly encountered in situations involving version control, concurrent edits, or attempts to create a duplicate resource.
