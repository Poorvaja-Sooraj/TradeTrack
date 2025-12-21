import express from "express";
import {
  getAllProducts,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/product.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/", verifyToken, createProduct);
router.get("/", verifyToken, getAllProducts);
router.get("/search", verifyToken, searchProducts);
router.put("/:id", verifyToken, updateProduct);
router.delete("/:id", verifyToken, deleteProduct);

export default router;
