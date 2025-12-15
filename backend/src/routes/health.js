import express from "express";
import { supabase } from "../supabaseClient.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .limit(1);

  if (error) {
    return res.status(500).json({ status: "error", error });
  }

  res.json({
    status: "ok",
    database: "connected",
    sampleData: data
  });
});

export default router;
