import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, ArrowRight, Loader2, Wallet } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSignMessage } from 'wagmi';

export default function LoginPage() {
  const { login } = useAuth();
  const { c } = useTheme();
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        login(data.token, data.user);
        navigate("/monvault");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWalletLogin = async () => {
    if (!address) return;
    setLoading(true);
    setError("");
    try {
      const message = `Logging into MonMart with wallet: ${address}`;
      const signature = await signMessageAsync({ message });

      const res = await fetch("http://localhost:5000/api/auth/wallet-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, signature, message }),
      });
      const data = await res.json();
      if (data.success) {
        login(data.token, data.user);
        navigate("/monvault");
      } else {
        setError(data.error || "Wallet login failed. Is your account registered?");
      }
    } catch (err: any) {
      setError(err.message || "Wallet signature failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        paddingTop: "64px",
        minHeight: "100vh",
        background: c.pageBg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        className="card"
        style={{
          width: "400px",
          maxWidth: "90%",
          padding: "2.5rem",
          background: c.cardBg,
          boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              background: "rgba(110,84,255,0.1)",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
            }}
          >
            <Lock size={24} color="#6E54FF" />
          </div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: c.textPrimary,
              margin: "0 0 0.5rem",
            }}
          >
            Welcome Back
          </h1>
          <p style={{ color: c.textSecondary, fontSize: "0.875rem" }}>
            Log in to manage your MonVault
          </p>
        </div>

        {error && (
          <div
            style={{
              background: "#FEE2E2",
              color: "#DC2626",
              padding: "0.75rem",
              borderRadius: "8px",
              fontSize: "0.8125rem",
              marginBottom: "1.5rem",
              fontWeight: 600,
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
            <ConnectButton />
          </div>
          {isConnected && (
            <button
              onClick={handleWalletLogin}
              disabled={loading}
              className="btn-secondary"
              style={{ 
                width: "100%", 
                justifyContent: "center", 
                gap: "10px", 
                borderColor: "#6E54FF", 
                color: "#6E54FF",
                fontWeight: 700
              }}
            >
              <Wallet size={18} /> {loading ? "Signing..." : "Login with Wallet"}
            </button>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
          <div style={{ flex: 1, height: "1px", background: c.border }}></div>
          <span style={{ fontSize: "0.75rem", color: c.textTertiary, fontWeight: 600 }}>OR USE PASSWORD</span>
          <div style={{ flex: 1, height: "1px", background: c.border }}></div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: c.textSecondary,
                marginBottom: "6px",
              }}
            >
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                size={16}
                color={c.textTertiary}
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                type="email"
                required
                className="input"
                placeholder="you@example.com"
                style={{ paddingLeft: "40px" }}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: c.textSecondary,
                marginBottom: "6px",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                size={16}
                color={c.textTertiary}
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                type="password"
                required
                className="input"
                placeholder="••••••••"
                style={{ paddingLeft: "40px" }}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: "100%", justifyContent: "center", padding: "0.875rem", marginTop: "0.5rem" }}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <>Log In with Password <ArrowRight size={18} /></>}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: c.textSecondary }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: "#6E54FF", fontWeight: 700, textDecoration: "none" }}>
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
