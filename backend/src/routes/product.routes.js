import express from "express";
import {
  getAllProducts,
  searchProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/product.controller.js";

const router = express.Router();

router.post("/", createProduct);
router.get("/", getAllProducts);
router.get("/search", searchProducts);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;
