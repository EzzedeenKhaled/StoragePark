import express from "express";
import multer from "multer";
import { createProduct, getActiveItems, getProductById, getItemsByCategory, getRelatedItems, getOnSaleItems, searchProducts, setDiscount } from "../controllers/product.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// Public route for customers
router.get('/active-items', getActiveItems);
router.get('/search', searchProducts);
router.post("/create", upload.single("imageProduct"), createProduct);
router.get('/:productId', getProductById);
router.get('/category/:category', getItemsByCategory);
router.post('/category', getRelatedItems);
router.post("/onSale", getOnSaleItems);
router.put('/discount', protectRoute, setDiscount);

export default router;