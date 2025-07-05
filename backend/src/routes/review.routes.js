import { Router } from "express";

import {createReview, getAllReviews, deleteReview} from "../controllers/review.controllers.js";
import { auth as authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

// routes
router.route("/").post(authMiddleware, createReview);
router.route("/").get(authMiddleware, getAllReviews);
router.route("/:reviewId").delete(authMiddleware, deleteReview);

export default router;
