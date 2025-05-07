import express from "express";
import { newOrder, getUserOrders,updateDeliveryGuyLocation,getOrderStatus, deleteOrder } from "../controllers/order.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/make-order", protectRoute, newOrder); 
router.get('/user-orders', protectRoute, getUserOrders);
router.get('/status/:orderId', getOrderStatus);
router.put('/update-delivery-location/:orderId',updateDeliveryGuyLocation);
router.delete('/delete/:orderId', deleteOrder);
export default router;