import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const deleteUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log("Request Params:", req.params);
  console.log("User id:", id);
  const user = await User.findById(id);
  console.log(user);
  if (!user) {
    throw new ApiError(404, " User account not found or already deleted.");
  }
  const userDeleted = await User.findByIdAndDelete(id);
  console.log("User deleted:", userDeleted);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "User Account deleted Successfully."));
});

export { deleteUserProfile };
