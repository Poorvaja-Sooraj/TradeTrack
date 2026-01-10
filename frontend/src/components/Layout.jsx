import { useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { AuthContext } from "../context/auth/AuthContext";

const Layout = ({ children }) => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <div className="app-container">
      <h1>TradeTrack</h1>

      <nav className="app-navbar">
        <NavLink to="/products" className="nav-link">
          Products
        </NavLink>

        <NavLink to="/billing" className="nav-link">
          Billing
        </NavLink>

        <NavLink to="/bills" className="nav-link">
          Bill History
        </NavLink>

        <button className="nav-link logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      {children}
    </div>
  );
};

export default Layout;
