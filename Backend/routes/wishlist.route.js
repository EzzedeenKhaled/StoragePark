import express from "express";
import { addToWishlist, removeFromWishlist, getWishlist } from "../controllers/wishlist.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();
router.post("/add-to-wishlist", protectRoute, addToWishlist);
router.delete("/remove-from-wishlist", protectRoute, removeFromWishlist);
router.get("/get-wishlist", protectRoute, getWishlist);

export default router;
