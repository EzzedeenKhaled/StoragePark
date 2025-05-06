import express from "express";
import { addReview, getReviewsByItemId, getReviewsByCategory, getPartnerRatingsSummary } from "../controllers/review.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/addReviews", protectRoute, addReview);
router.get("/getItemRev/:itemId", protectRoute, getReviewsByItemId);
router.get("/getCategoryRev/:categoryName", protectRoute, getReviewsByCategory);
router.get("/partner-rating", protectRoute, getPartnerRatingsSummary);
export default router;