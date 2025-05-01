import express from "express";
import { addReview, getReviewsByItemId, getReviewsByCategory } from "../controllers/review.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/addReviews", protectRoute, addReview);
router.get("/getItemRev/:itemId", protectRoute, getReviewsByItemId);
router.get("/getCategoryRev/:categoryName", protectRoute, getReviewsByCategory);
export default router;