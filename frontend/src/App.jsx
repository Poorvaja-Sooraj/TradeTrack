import { useState } from "react";
import ProductsPage from "./pages/ProductsPage";
import Billing from "./pages/Billing";
import BillHistory from "./pages/BillHistory";
import Login from "./pages/login";

function App() {
  const [isAuth, setIsAuth] = useState(
    !!localStorage.getItem("token")
  );

  const [page, setPage] = useState("products");

  if (!isAuth) {
    return <Login setIsAuth={setIsAuth} />;
  }

  return (
    <div>
      <h1>TradeTrack</h1>

      <nav>
        <button onClick={() => setPage("products")}>
          Products
        </button>
        <button onClick={() => setPage("billing")}>
          Billing
        </button>
        <button onClick={() => setPage("history")}>
          Bill History
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            location.reload();
          }}
        >
          Logout
        </button>
      </nav>

      {page === "products" && <ProductsPage />}
      {page === "billing" && <Billing />}
      {page === "history" && <BillHistory />}
    </div>
  );
}

export default App;
