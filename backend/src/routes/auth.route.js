import { Router } from "express";
import {
  refreshAccessToken,
  forgotPassword,
} from "../controllers/user.controller.js";
import { deleteUserProfile } from "../controllers/auth.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/refresh-token").post(verifyJWT, refreshAccessToken);
router.route("/forgot-password").post(verifyJWT, forgotPassword);
router.route("/:id").delete(deleteUserProfile);
export default router;
