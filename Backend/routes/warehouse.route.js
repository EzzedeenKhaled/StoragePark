import express from "express";
import { 
  getWarehouseStructure, 
  getAisleDetails, 
  updateRowStatus 
} from "../controllers/warehouse.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/structure", protectRoute, getWarehouseStructure);
router.get("/:aisleId", protectRoute, getAisleDetails);
router.post("/:aisleId/rows/:rowId", protectRoute, updateRowStatus);

export default router; 