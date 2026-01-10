import { useEffect, useState } from "react";
import api from "../services/api";
import {
  fetchExpiryWarnings,
  fetchLowStockWarnings
} from "../services/notificationService";

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [barcode, setBarcode] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [editingId, setEditingId] = useState(null);

  const [expiryWarnings, setExpiryWarnings] = useState([]);
  const [lowStockWarnings, setLowStockWarnings] = useState([]);

  /* ================= LOAD PRODUCTS ================= */

  const loadProducts = async () => {
    try {
      const res = await api.get("/products");
      const data = res.data.data || res.data || [];
      data.sort((a, b) => a.name.localeCompare(b.name));
      setProducts(data);
      loadWarnings(data);
    } catch {
      alert("Failed to load products");
    }
  };

  const loadWarnings = async (currentProducts = []) => {
    try {
      const e = await fetchExpiryWarnings();
      const l = await fetchLowStockWarnings();

      const productNames = currentProducts.map(p =>
        p.name.toLowerCase()
      );

      const sortedExpiry = (e.warnings || [])
        .filter(w =>
          productNames.some(name =>
            w.toLowerCase().includes(name)
          )
        )
        .sort((a, b) => {
          const daysA = parseInt(a.match(/\d+/)?.[0] || 0);
          const daysB = parseInt(b.match(/\d+/)?.[0] || 0);
          return daysA - daysB;
        });

      const sortedLowStock = (l.warnings || [])
        .filter(w =>
          productNames.some(name =>
            w.toLowerCase().includes(name)
          )
        )
        .sort((a, b) => {
          const stockA = parseInt(a.match(/\d+/)?.[0] || 0);
          const stockB = parseInt(b.match(/\d+/)?.[0] || 0);
          return stockA - stockB;
        });

      setExpiryWarnings(sortedExpiry);
      setLowStockWarnings(sortedLowStock);
    } catch {}
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /* ================= ADD / UPDATE ================= */

  const handleSubmit = async () => {
    if (!name || !price || !stock) {
      alert("Name, price, and stock are required");
      return;
    }

    const payload = {
      name,
      barcode: barcode || null,
      price: Number(price),
      stock_quantity: Number(stock),
      expiry_date: expiryDate || null
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }
      resetForm();
      loadProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const resetForm = () => {
    setName("");
    setBarcode("");
    setPrice("");
    setStock("");
    setExpiryDate("");
    setEditingId(null);
  };

  const handleEdit = (p) => {
    setName(p.name);
    setBarcode(p.barcode || "");
    setPrice(p.price);
    setStock(p.stock_quantity);
    setExpiryDate(p.expiry_date || "");
    setEditingId(p.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    await api.delete(`/products/${id}`);
    loadProducts();
  };

  /* ================= RENDER ================= */

  return (
    <div className="products-page">
      
      {/* ADD PRODUCT BOX */}
      <div className="add-product-wrapper">
        <section className="add-product-card">
          <h2>{editingId ? "Update Product" : "Add Product"}</h2>

          <div className="form-grid">
            <div className="form-field">
              <label>Product Name</label>
              <input value={name} onChange={e => setName(e.target.value)} />
            </div>

            <div className="form-field">
              <label>Product ID</label>
              <input value={barcode} onChange={e => setBarcode(e.target.value)} />
            </div>

            <div className="form-field">
              <label>Price (₹)</label>
              <input
                type="number"
                value={price}
                onChange={e => setPrice(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Stock</label>
              <input
                type="number"
                value={stock}
                onChange={e => setStock(e.target.value)}
              />
            </div>

            <div className="form-field">
              <label>Expiry Date</label>
              <input
                type="date"
                value={expiryDate}
                onChange={e => setExpiryDate(e.target.value)}
              />
            </div>
          </div>

          <div className="form-actions">
            <button className="primary" onClick={handleSubmit}>
              {editingId ? "Update Product" : "Add Product"}
            </button>

            {editingId && (
              <button className="secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </section>
      </div>

      {/* ALERTS */}
      <section className="alerts-row">
        <div className="alert-card">
          <h3>Expiry Alerts</h3>
          {expiryWarnings.length === 0 ? (
            <p>No expiry issues</p>
          ) : (
            <ul>
              {expiryWarnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="alert-card">
          <h3>Low Stock Alerts</h3>
          {lowStockWarnings.length === 0 ? (
            <p>No low stock</p>
          ) : (
            <ul>
              {lowStockWarnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* PRODUCT GRID */}
      <section className="product-grid">
        {products.map(p => (
          <div key={p.id} className="product-card">
            <h4>{p.name}</h4>
            <p className="muted">{p.barcode || "-"}</p>
            <p>₹ {p.price}</p>
            <p>Stock: {p.stock_quantity}</p>
            {p.expiry_date && <p>Expiry: {p.expiry_date}</p>}

            <div className="card-actions">
              <button className="edit" onClick={() => handleEdit(p)}>
                Edit
              </button>
              <button className="delete" onClick={() => handleDelete(p.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

export default ProductsPage;
