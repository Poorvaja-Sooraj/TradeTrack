import { useEffect, useState } from "react";
import api from "../services/api";

const BillHistory = () => {
  const [bills, setBills] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchBills();
  }, []);

  // Auto-clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const fetchBills = async () => {
    try {
      const res = await api.get("/bills");
      setBills(res.data.data || res.data || []);
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
          "Access denied. Please login again."
      );
    }
  };

  return (
    <div>
      <h2>Bill History</h2>

      {message && <p>{message}</p>}

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Bill ID</th>
            <th>Total</th>
            <th>Payment</th>
            <th>Date</th>
          </tr>
        </thead>

        <tbody>
          {bills.map((bill) => (
            <tr key={bill.id}>
              <td>{bill.id.slice(-6).toUpperCase()}</td>
              <td>{bill.total_amount}</td>
              <td>{bill.payment_method || bill.payment_mode}</td>
              <td>{new Date(bill.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BillHistory;
