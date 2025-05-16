import express from "express";
import { 
  getWarehouseStructure, 
  getAisleDetails, 
  updateRowStatus,
  deleteRow,
  resetWarehouse
} from "../controllers/warehouse.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/structure", protectRoute,  adminRoute, getWarehouseStructure);
router.get("/:aisleId", protectRoute,  adminRoute, getAisleDetails);
router.post("/:aisleId/rows/:rowId", protectRoute,  adminRoute, updateRowStatus);
router.delete("/:aisleId/rows/:rowId", protectRoute, adminRoute, deleteRow);
router.post('/reset', resetWarehouse);
export default router; 