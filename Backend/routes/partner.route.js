import express from "express";
import { signup_Partner, uploadDocument, partnetInfoSignup, acceptedPartners, getPartnerProfile, updatePartner, getPartnerItems, changeIsActive, getPartnerOrders, getTopSellingItemsByPartner, getTopSellingCategoriesByPartner, getStats, getMonthlySalesAndPurchases } from "../controllers/partner.controller.js";
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
router.get("/orders", protectRoute, getPartnerOrders);
router.get("/topSelling", protectRoute, getTopSellingItemsByPartner)
router.get("/topCategory", protectRoute, getTopSellingCategoriesByPartner)
router.get("/stats", protectRoute, getStats)
router.get("/salesAndPurchase", protectRoute, getMonthlySalesAndPurchases)

export default router;
