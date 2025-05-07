import express from "express";
import { verifyToken } from "../middleware/auth.middleware.js";
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
router.get("/customers", verifyToken, getCustomers);
router.post("/customers", verifyToken, addCustomer);
router.put("/customers/:id", verifyToken, updateCustomer);
router.delete("/customers/:id", verifyToken, deleteCustomer);

// Employee routes
router.get("/employees", verifyToken, getEmployees);
router.post("/employees", verifyToken, addEmployee);
router.put("/employees/:id", verifyToken, updateEmployee);
router.delete("/employees/:id", verifyToken, deleteEmployee);

export default router; 