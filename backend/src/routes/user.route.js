import { Router } from "express";
import { body } from "express-validator";
import { userRegister } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
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

export default router;

// Recommendation industry standard
// Routes  --> default export router
