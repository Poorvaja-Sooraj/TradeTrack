import { useState } from "react";
import api from "../services/api";

function Login({ setIsAuth }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", {
        username,
        password
      });

      localStorage.setItem("token", res.data.token);
      setIsAuth(true);
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div>
      <h2>Shop Owner Login</h2>

      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Login</button>

      {error && <p>{error}</p>}
    </div>
  );
}

export default Login;
