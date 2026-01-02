import api from "./api";

export const fetchExpiryWarnings = async () => {
  const res = await api.get("/notifications/expiry");
  return res.data;
};

export const fetchLowStockWarnings = async () => {
  const res = await api.get("/notifications/low-stock");
  return res.data;
};