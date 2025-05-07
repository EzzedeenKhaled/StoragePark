import express from "express";
import { partnersUnverified, confirmPartnerRequest,rejectPartnerRequest, getAcceptedPartners } from "../controllers/admin.controller.js";
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
  
  const router = express.Router();
  
  // Customer routes
  router.get("/customers",protectRoute, adminRoute, getCustomers);
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
router.post("/confirm-request", protectRoute, adminRoute, confirmPartnerRequest)
router.post("/cancel-request", protectRoute, adminRoute, rejectPartnerRequest)
router.get("/accepted", protectRoute, adminRoute, getAcceptedPartners);


export default router;