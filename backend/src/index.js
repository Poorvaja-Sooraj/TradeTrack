import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import healthRoute from "./routes/health.js";
import productRoutes from "./routes/product.routes.js";
import billRoutes from "./routes/bill.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/health", healthRoute);
app.use("/products", productRoutes);
app.use("/bills", billRoutes);

app.listen(PORT);
