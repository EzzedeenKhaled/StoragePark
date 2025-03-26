import express from "express";
import { signup, login, signup_Partner, uploadDocument, verifyEmail } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signup-partner", signup_Partner);
router.post("/upload-documents", uploadDocument);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
export default router;
