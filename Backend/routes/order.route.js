import express from "express";
import { newOrder, getUserOrders,updateDeliveryGuyLocation,getOrderStatus, markOrderAsDelivered, checkOrderIdExists } from "../controllers/order.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/make-order", protectRoute, newOrder); 
router.get('/user-orders', protectRoute, getUserOrders);
router.get('/status/:orderId', getOrderStatus);
router.put('/update-delivery-location/:orderId',updateDeliveryGuyLocation);
router.put('/markDelivered/:orderId', markOrderAsDelivered);
router.get('/orderIdCheck/:orderId', checkOrderIdExists);

export default router;