import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.routes.js";
import healthRoute from "./routes/health.js";
import productRoutes from "./routes/product.routes.js";
import billRoutes from "./routes/bill.routes.js";
import notificationRoutes from "./routes/notification.routes.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/health", healthRoute);
app.use("/products", productRoutes);
app.use("/bills", billRoutes);
app.use("/notifications", notificationRoutes);


app.listen(5000, () => {
  console.log("Server running on port 5000");
});

app.get("/", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "TradeTrack Backend is live"
  });
});

