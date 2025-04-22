import express from "express";
import multer from "multer";
import { createProduct, getActiveItems } from "../controllers/product.controller.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

// Public route for customers
router.get('/active-items', getActiveItems);
router.post("/create", upload.single("imageProduct"), createProduct);

export default router;