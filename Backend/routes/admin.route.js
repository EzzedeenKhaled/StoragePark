import express from "express";
import { partnersUnverified, confirmPartnerRequest,rejectPartnerRequest, getAcceptedPartners } from "../controllers/admin.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();


router.get("/partners/unverified", protectRoute, adminRoute, partnersUnverified);
router.post("/confirm-request", protectRoute, adminRoute, confirmPartnerRequest)
router.post("/cancel-request", protectRoute, adminRoute, rejectPartnerRequest)
router.get("/accepted", protectRoute, adminRoute, getAcceptedPartners);


export default router;