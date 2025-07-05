import { Router } from "express";
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,getAllUsers,deleteUser
} from "../controllers/user.controllers.js";
import { auth as authMiddleware  } from "../middlewares/auth.middleware.js";
import {isAdmin} from "../middlewares/isAdmin.middleware.js";

const router = Router();

// routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser); 
router.route("/profile").get(authMiddleware, getUserProfile).put(authMiddleware, updateUserProfile);
router.route("/").get(authMiddleware,isAdmin,getAllUsers)
router.route("/:userId").delete(authMiddleware,isAdmin,deleteUser); 


export default router;