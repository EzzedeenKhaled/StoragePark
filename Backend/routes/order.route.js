import express from "express";
import { newOrder, getUserOrders } from "../controllers/order.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/make-order", protectRoute, newOrder); 
router.get('/user-orders', protectRoute, getUserOrders);

export default router;