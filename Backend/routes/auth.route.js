import express from "express";
import { signup, login, logout, refreshToken, verifyEmail, getProfile, forgotPassword, verifyCode, resetPassword } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
router.post("/verify-email", verifyEmail);
router.post("/verify-code", verifyCode);
router.post("/forgot-password", forgotPassword);
router.get("/profile", protectRoute, getProfile);
router.post("/reset-password", resetPassword);

export default router;