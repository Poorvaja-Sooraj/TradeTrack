import { useEffect, useState } from "react";
import api from "../services/api";

const Billing = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [billItems, setBillItems] = useState([]);
  const [paymentMode, setPaymentMode] = useState("CASH");

  const [message, setMessage] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Load products
  useEffect(() => {
    api
      .get("/products")
      .then((res) => setProducts(res.data.data || []))
      .catch(() => setMessage("Failed to load products"));
  }, []);

  // Auto-clear success message
  useEffect(() => {
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

  const addToBill = () => {
    if (!selectedProduct) {
      setMessage("Please select a product");
      return;
    }

    if (!quantity || quantity <= 0) {
      setMessage("Enter a valid quantity");
      return;
    }

    if (quantity > selectedProduct.stock_quantity) {
      setMessage(
        `Only ${selectedProduct.stock_quantity} items left in stock`
      );
      return;
    }

    const existing = billItems.find(
      (item) => item.product_id === selectedProduct.id
    );

    if (existing) {
      existing.quantity += quantity;
      existing.subtotal = existing.quantity * existing.price;
      setBillItems([...billItems]);
    } else {
      setBillItems([
        ...billItems,
        {
          product_id: selectedProduct.id,
          name: selectedProduct.name,
          price: selectedProduct.price,
          quantity,
          subtotal: selectedProduct.price * quantity,
        },
      ]);
    }

    setSearch("");
    setSelectedProduct(null);
    setQuantity(1);
    setMessage("");
  };

  const createBill = async () => {
    if (billItems.length === 0) {
      setMessage("Bill is empty");
      return;
    }

    const payload = {
      payment_method: paymentMode.toLowerCase(),
      items: billItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
    };

    setLoading(true);

    try {
      await api.post("/bills", payload);
      setSuccessMsg("Bill created successfully");
      setBillItems([]);
      setMessage("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to create bill");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="billing-page">
      <h2>Billing Screen</h2>
      <br></br>
      {/* Product Search */}
      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          value={search}
          placeholder="Search product"
          onChange={(e) => {
            setSearch(e.target.value);
            setSelectedProduct(null);
          }}
        />

        {search && !selectedProduct && (
          <ul style={{ border: "1px solid #ccc", padding: "4px" }}>
            {products
              .filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((p) => (
                <li
                  key={p.id}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedProduct(p);
                    setSearch(p.name);
                  }}
                >
                  {p.name}
                </li>
              ))}
          </ul>
        )}
      </div>

      {/* Quantity + Add */}
      <div style={{ marginBottom: "16px" }}>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <br></br>
        <br></br>
        <button style={{ marginRight: "8px" }} onClick={addToBill}>
            Add to Bill
        </button>
      </div>

      {/* Bill Items Table */}
      <div style={{ marginBottom: "16px" }}>
        <table border="1" cellPadding="10" cellSpacing="0" width="100%">
          <thead>
            <tr>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {billItems.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{item.subtotal}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total */}
      <div style={{ marginBottom: "16px" }}>
        <h3>
          Total: ₹
          {billItems.reduce((sum, item) => sum + item.subtotal, 0)}
        </h3>
      </div>

      {/* Payment + Create */}
      <div style={{ marginBottom: "16px" }}>
        <select
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
        >
          <option value="CASH">Cash</option>
          <option value="CARD">Card</option>
          <option value="UPI">UPI</option>
        </select>

        <button disabled={loading} onClick={createBill}>
          {loading ? "Creating..." : "Create Bill"}
        </button>
      </div>

      {/* Messages */}
      {successMsg && <p>{successMsg}</p>}
      {message && <p>{message}</p>}
    </div>
  );
};

export default Billing;
