import express from "express";
import multer from "multer";
import { createProduct } from "../controllers/product.controller.js";

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post("/create", upload.single("imageProduct"), createProduct);

export default router;