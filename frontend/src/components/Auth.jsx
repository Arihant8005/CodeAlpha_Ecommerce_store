import { useState } from "react";
import "./Auth.css";

function Auth({ onLogin, onClose }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint =
      mode === "login"
        ? "http://localhost:5000/api/auth/login"
        : "http://localhost:5000/api/auth/register";

    const body =
      mode === "login"
        ? { email, password }
        : { name, email, password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong");
      }

      if (mode === "login") {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        alert("Login successful!");
        onLogin(data.user);
      } else {
        alert("Registration successful! Please login.");
        setMode("login");
        setName("");
        setPassword("");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="auth-container">
    <div className="auth-header">
      <h2>
        {mode === "login" ? "Welcome Back" : "Create Account"}
      </h2>

      <p>
        {mode === "login"
          ? "Login to continue shopping."
          : "Create your ShopEasy account."}
      </p>
    </div>

    <form className="auth-form" onSubmit={handleSubmit}>
      {mode === "register" && (
        <div className="auth-field">
          <label>Full Name</label>

          <input
            type="text"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
      )}

      <div className="auth-field">
        <label>Email Address</label>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="auth-field">
        <label>Password</label>

        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />
      </div>

      <button
        type="submit"
        className="auth-submit"
        disabled={loading}
      >
        {loading
          ? "Please wait..."
          : mode === "login"
          ? "Login"
          : "Create Account"}
      </button>
    </form>

    <div className="auth-switch">
      {mode === "login"
        ? "Don't have an account?"
        : "Already have an account?"}

      <button
        type="button"
        onClick={() =>
          setMode(mode === "login" ? "register" : "login")
        }
      >
        {mode === "login" ? " Register" : " Login"}
      </button>
    </div>

    <button
      className="auth-close"
      onClick={onClose}
    >
      Close
    </button>
  </div>
);
}

export default Auth;