import { useEffect, useState } from "react";
import api from "../services/api";

function ProductsPage() {
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [editingId, setEditingId] = useState(null);

  // Load all products
  const loadProducts = async () => {
    try {
      const res = await api.get("/products");

      // Works for both:
      // { success: true, data: [...] }
      // or just [...]
      setProducts(res.data.data || res.data);
    } catch (err) {
      console.error("Failed to load products", err);
      alert("Unable to load products. Are you logged in?");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Add or Update product
  const handleSubmit = async () => {
    if (!name || !price || !stock) {
      alert("All fields are required");
      return;
    }

    const payload = {
      name,
      price: Number(price),
      stock_quantity: Number(stock)
    };

    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
      } else {
        await api.post("/products", payload);
      }

      loadProducts();
      resetForm();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  // Reset form
  const resetForm = () => {
    setName("");
    setPrice("");
    setStock("");
    setEditingId(null);
  };

  // Edit product
  const handleEdit = (product) => {
    setName(product.name);
    setPrice(product.price);
    setStock(product.stock_quantity);
    setEditingId(product.id);
  };

  // Delete product
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/products/${id}`);
      loadProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div>
      <h2>Products</h2>

      {/* Product Form */}
      <div>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        <button onClick={handleSubmit}>
          {editingId ? "Update Product" : "Add Product"}
        </button>

        {editingId && (
          <button onClick={resetForm}>Cancel</button>
        )}
      </div>

      <br />

      {/* Products Table */}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.price}</td>
              <td>{p.stock_quantity}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductsPage;
