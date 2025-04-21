import express from "express";
import { updateCustomer, addToWishlist, getWishlist } from "../controllers/customer.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/update", updateCustomer);
router.post("/wishlist", protectRoute, addToWishlist);
router.get("/wishlist", protectRoute, getWishlist);

export default router;
