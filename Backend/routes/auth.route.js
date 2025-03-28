import express from "express";
import { signup, login, signup_Partner, uploadDocument, verifyEmail, partnetInfoSignup, acceptedPartners } from "../controllers/auth.controller.js";

const router = express.Router();
router.post("/signup", signup);
router.post("/signup-partner", signup_Partner);
router.post("/upload-documents", uploadDocument);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.get("/partner-requests", partnetInfoSignup);
router.get("/partners-accepted", acceptedPartners);
// router.get("/logo", getLogo);
export default router;
