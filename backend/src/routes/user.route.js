import { Router } from "express";
import {
  deleteUserProfile,
  updateUserAvatar,
  updateUserCoverImage,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/delete").delete(verifyJWT, deleteUserProfile);

export default router;

// Recommendation industry standard
// Routes  --> default export router
