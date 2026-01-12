import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
// protected routes verify by JWT token
export const verifyJWT = asyncHandler(async (req, _, next) => {
  // JWT format
  // authorization: Bearer 7734jdbnddnndm..

  // if(req.headers.Authorization || req.headers.Authorization.startsWith("Bearer") ||req.cookies?.AccessToken){

  // }
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.AccessToken) {
      token = req.cookies.AccessToken;
    }

    if (!token) {
      throw new ApiError(401, "Token is not found.Not Authorized User");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }

    // add user in request obj
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token:");
  }
});
