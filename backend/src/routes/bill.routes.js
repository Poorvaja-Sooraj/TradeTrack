import express from "express";
import {
  createBill,
  getAllBills,
  getBillById
} from "../controllers/bill.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyToken, createBill);
router.get("/", verifyToken, getAllBills);
router.get("/:id", verifyToken, getBillById);

export default router;
