import express from "express";
import { signup_Partner, uploadDocument, partnetInfoSignup, acceptedPartners, getPartnerProfile, updatePartner, getPartnerItems, changeIsActive } from "../controllers/partner.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import multer from "multer";


const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/update", upload.single("profileImage"), updatePartner);
router.post("/signup-partner", signup_Partner);
router.post("/upload-documents", uploadDocument);
router.get("/partner-requests", partnetInfoSignup);
router.get("/partners-accepted", acceptedPartners);
router.get("/profile", protectRoute, getPartnerProfile);
router.get("/items", protectRoute, getPartnerItems);
router.put("/toggle-active", protectRoute, changeIsActive);


export default router;
