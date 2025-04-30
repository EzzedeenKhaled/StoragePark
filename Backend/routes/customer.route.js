import express from "express";
import { updateCustomer, addToWishlist, getWishlist } from "../controllers/customer.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post("/update", upload.single("profileImage"), updateCustomer);
router.post("/wishlist", protectRoute, addToWishlist);
router.get("/wishlist", protectRoute, getWishlist);

export default router;
