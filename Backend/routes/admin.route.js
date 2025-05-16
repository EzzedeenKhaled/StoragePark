import express from "express";
import {
  partnersUnverified,
  confirmPartnerRequest,
  rejectPartnerRequest,
  getAcceptedPartners,
  getAllQuantity,
  getPartnersAndCategories,
  getHighestSellingProducts,
  getLowQuantityStock,
  getOrderSummary,
  getOrderStatistics,
  getDataOrders,
  getFinancialOverview,
  getAllProducts,
  UpdateImage,
  deletePartner,
  deleteItem
} from "../controllers/admin.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
import {
  getCustomers,
  addCustomer,
  updateCustomer,
  deleteCustomer,
  getEmployees,
  addEmployee,
  updateEmployee,
  deleteEmployee
} from "../controllers/admin.controller.js";
import multer from "multer";

const router = express.Router();

// Customer routes
router.get("/customers", protectRoute, adminRoute, getCustomers);
router.post("/customers", protectRoute, adminRoute, addCustomer);
router.put("/customers/:id", protectRoute, adminRoute, updateCustomer);
router.delete("/customers/:id", protectRoute, adminRoute, deleteCustomer);

// Employee routes
router.get("/employees", protectRoute, adminRoute, getEmployees);
router.post("/employees", protectRoute, adminRoute, addEmployee);
router.put("/employees/:id", protectRoute, adminRoute, updateEmployee);
router.delete("/employees/:id", protectRoute, adminRoute, deleteEmployee);

// Partner routes
router.get("/partners/unverified", protectRoute, adminRoute, partnersUnverified);
router.post("/confirm-request", protectRoute, adminRoute, confirmPartnerRequest);
router.post("/cancel-request", protectRoute, adminRoute, rejectPartnerRequest);
router.get("/accepted", protectRoute, adminRoute, getAcceptedPartners);
router.get("/getAllQuantity", protectRoute, adminRoute, getAllQuantity);
router.get("/partnersAndCategories", protectRoute, adminRoute, getPartnersAndCategories);
router.get("/highestSelling", protectRoute, adminRoute, getHighestSellingProducts);
router.get("/lowQuantity", protectRoute, adminRoute, getLowQuantityStock);
router.delete('/deletePartner/:partnerId', protectRoute, adminRoute, deletePartner);

// Product routes
router.get("/allProducts", protectRoute, adminRoute, getAllProducts);
router.delete("/deleteItem", protectRoute, adminRoute, deleteItem);
router.get("/orderSummary", protectRoute, adminRoute, getOrderSummary);

// Order and financial routes
router.get("/order-stats", protectRoute, adminRoute, getOrderStatistics);
router.get("/getDataOrders", protectRoute, adminRoute, getDataOrders);
router.get("/financial-overview", protectRoute, adminRoute, getFinancialOverview);

// Change Image
const upload = multer({ storage: multer.memoryStorage() });
router.post("/updateImage", protectRoute, adminRoute, upload.single("profileImage"), UpdateImage);

export default router;