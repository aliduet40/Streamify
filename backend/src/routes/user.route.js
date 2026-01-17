import { Router } from "express";
// import { body } from "express-validator";
import {
  userRegister,
  userLogin,
  logoutUser,
  getCurrentUser,
  updateUserProfile,
  updateAvatar,
  updateCoverImage,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/register").post(
  upload.fields([
    { name: "avatar", maxCount: 1 },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  userRegister,
);

router.route("/login").post(userLogin);
// secured protects routes verify by JWT
router.route("/logout").post(verifyJWT, logoutUser);

export default router;

// Recommendation industry standard
// Routes  --> default export router

//  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OTY2NmVlZmE5YmU3OTg0ZWQxYWVkZWUiLCJpYXQiOjE3Njg0Nzk1NDgsImV4cCI6MTc2OTA4NDM0OH0.EyXfsMnbkIPOFaZd6b9xWA7_1znddq7_s3R3FxnDmFQ"
