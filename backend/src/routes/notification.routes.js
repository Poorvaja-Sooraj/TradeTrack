import express from "express";
import { getExpiryWarnings, getLowStockWarnings } from "../controllers/notification.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";


const router = express.Router();

router.get("/expiry", verifyToken, getExpiryWarnings);
router.get("/low-stock", verifyToken, getLowStockWarnings);

export default router;
