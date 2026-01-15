import { Router } from "express";
// import { body } from "express-validator";
import {
  userRegister,
  userLogin,
  logoutUser,
  refreshAccessToken,
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
  userRegister
);

router.route("/login").post(userLogin);
// secured protects routes verify by JWT
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

export default router;

// Recommendation industry standard
// Routes  --> default export router
