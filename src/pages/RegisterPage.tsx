import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Wallet, ArrowRight, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';

export default function RegisterPage() {
  const { login } = useAuth();
  const { c } = useTheme();
  const { address, isConnected } = useAccount();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    walletAddress: "",
  });

  useEffect(() => {
    if (address) {
      setFormData(prev => ({ ...prev, walletAddress: address }));
    }
  }, [address]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
        setError("Please connect your wallet first.");
        return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, walletAddress: address }),
      });
      const data = await res.json();
      if (data.success) {
        login(data.token, data.user);
        navigate("/monvault");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Server error. Please try again.");
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
        padding: "2rem 0",
      }}
    >
      <div
        className="card"
        style={{
          width: "440px",
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
            <Sparkles size={24} color="#6E54FF" />
          </div>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: c.textPrimary,
              margin: "0 0 0.5rem",
            }}
          >
            Join MonMart
          </h1>
          <p style={{ color: c.textSecondary, fontSize: "0.875rem" }}>
            Start earning rewards on every purchase
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
          <label
            style={{
              display: "block",
              fontSize: "0.8125rem",
              fontWeight: 700,
              color: "#6E54FF",
              marginBottom: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}
          >
            1. Connect Your Wallet (Compulsory)
          </label>
          <div style={{ display: "flex", justifyContent: "center", background: "rgba(110,84,255,0.05)", padding: "1rem", borderRadius: "12px", border: "1.5px dashed rgba(110,84,255,0.2)" }}>
            <ConnectButton />
          </div>
          {isConnected && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "8px", color: "#16A34A", fontSize: "0.75rem", fontWeight: 600 }}>
              <ShieldCheck size={14} /> Wallet Connected Successfully
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.125rem", opacity: isConnected ? 1 : 0.5, pointerEvents: isConnected ? "auto" : "none" }}>
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
              2. Your Details
            </label>
            <div style={{ position: "relative", marginBottom: "12px" }}>
              <User
                size={16}
                color={c.textTertiary}
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                type="text"
                required
                className="input"
                placeholder="Full Name"
                style={{ paddingLeft: "40px" }}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div style={{ position: "relative", marginBottom: "12px" }}>
              <Mail
                size={16}
                color={c.textTertiary}
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                type="email"
                required
                className="input"
                placeholder="Email Address"
                style={{ paddingLeft: "40px" }}
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
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
                placeholder="Create Password"
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
            {loading ? <Loader2 size={18} className="animate-spin" /> : <>Create Account <ArrowRight size={18} /></>}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.875rem", color: c.textSecondary }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#6E54FF", fontWeight: 700, textDecoration: "none" }}>
            Log In
          </Link>
        </p>
      </div>
    </main>
  );
}
