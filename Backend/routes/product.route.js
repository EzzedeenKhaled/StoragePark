import express from "express";
import multer from "multer";
import { createProduct, getActiveItems, getProductById, getItemsByCategory } from "../controllers/product.controller.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// Public route for customers
router.get('/active-items', getActiveItems);
router.post("/create", upload.single("imageProduct"), createProduct);
router.get('/:productId', getProductById);
router.get('/category/:category', getItemsByCategory);

export default router;