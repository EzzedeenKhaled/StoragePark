import express from "express";
import { signup_Partner, uploadDocument, partnetInfoSignup, acceptedPartners } from "../controllers/partner.controller.js";

const router = express.Router();

router.post("/signup-partner", signup_Partner);
router.post("/upload-documents", uploadDocument);
router.get("/partner-requests", partnetInfoSignup);
router.get("/partners-accepted", acceptedPartners);

export default router;
