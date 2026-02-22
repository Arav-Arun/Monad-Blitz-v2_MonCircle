import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, LogOut, Menu, X, Zap, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import MonBalanceChip from "./MonBalanceChip";

export default function Navbar() {
  const { cartCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Products", to: "/products" },
    { label: "MonVault", to: "/monvault" },
  ];

  const navBg = isDark
    ? scrolled
      ? "rgba(9,9,11,0.95)"
      : "rgba(9,9,11,0.98)"
    : scrolled
      ? "rgba(255,255,255,0.92)"
      : "rgba(255,255,255,0.98)";

  const borderColor = isDark ? "#27272a" : scrolled ? "#E4E4E7" : "transparent";
  const iconBtnStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    border: `1.5px solid ${isDark ? "#3f3f46" : "#E4E4E7"}`,
    background: isDark ? "#18181b" : "white",
    cursor: "pointer",
    color: isDark ? "#a1a1aa" : "#52525B",
    transition: "all 0.15s",
  } as const;

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        transition: "all 0.2s ease",
        backgroundColor: navBg,
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${borderColor}`,
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.08)" : "none",
      }}
    >
      <div
        className="container-page"
        style={{
          display: "flex",
          alignItems: "center",
          height: "64px",
          gap: "1.5rem",
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <img
            src="/assets/logomark.svg"
            alt="MonMart"
            style={{ height: "28px", width: "auto" }}
          />
          <span
            style={{
              fontWeight: 800,
              fontSize: "1.125rem",
              color: isDark ? "#f4f4f5" : "#09090B",
              letterSpacing: "-0.02em",
            }}
          >
            Mon<span style={{ color: "#6E54FF" }}>Mart</span>
          </span>
        </Link>

        {/* Nav links — desktop */}
        <nav
          style={{ display: "flex", gap: "8px", marginLeft: "8px", flex: 1 }}
          className="hidden-mobile"
        >
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              style={({ isActive }) => ({
                padding: "6px 14px",
                borderRadius: "8px",
                fontSize: "0.875rem",
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "#6E54FF" : isDark ? "#a1a1aa" : "#52525B",
                background: isActive
                  ? isDark
                    ? "rgba(110,84,255,0.15)"
                    : "#F3F1FF"
                  : "transparent",
                textDecoration: "none",
                transition: "all 0.15s",
              })}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginLeft: "auto",
          }}
        >
          <MonBalanceChip />

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Dark mode toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              style={iconBtnStyle}
              aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
              title={isDark ? "Light mode" : "Dark mode"}
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <button
              id="navbar-cart-btn"
              onClick={() => navigate("/cart")}
              style={{ ...iconBtnStyle, position: "relative" }}
              aria-label="Cart"
            >
              <ShoppingCart size={17} />
              {cartCount > 0 && (
                <span
                  style={{
                    position: "absolute",
                    top: "-4px",
                    right: "-4px",
                    background: "#6E54FF",
                    color: "white",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    borderRadius: "999px",
                    minWidth: "16px",
                    height: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 4px",
                    lineHeight: 1,
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    background: isDark ? "rgba(255,255,255,0.05)" : "#F4F4F5",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: isDark ? "#E4E4E7" : "#3F3F46",
                    border: `1px solid ${isDark ? "#27272a" : "#E4E4E7"}`,
                  }}
                >
                  {user.name.split(" ")[0]}
                </div>
                <button
                  onClick={logout}
                  style={{
                    ...iconBtnStyle,
                    borderColor: isDark ? "rgba(220,38,38,0.3)" : "rgba(220,38,38,0.1)",
                    color: "#DC2626",
                    background: isDark ? "rgba(220,38,38,0.05)" : "rgba(220,38,38,0.03)",
                  }}
                  title="Log Out"
                >
                  <LogOut size={17} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="btn-primary"
                style={{
                  padding: "8px 16px",
                  fontSize: "0.8125rem",
                  height: "38px",
                }}
              >
                Log In
              </button>
            )}
          </div>

          {/* Mobile menu btn */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="show-mobile"
            style={{ ...iconBtnStyle, display: "none" }}
            aria-label="Menu"
          >
            {menuOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          style={{
            borderTop: `1px solid ${isDark ? "#27272a" : "#E4E4E7"}`,
            padding: "0.75rem 1.5rem 1rem",
            background: isDark ? "#09090b" : "white",
          }}
        >
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 12px",
                borderRadius: "8px",
                fontSize: "0.9rem",
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "#6E54FF" : isDark ? "#a1a1aa" : "#52525B",
                background: isActive
                  ? isDark
                    ? "rgba(110,84,255,0.15)"
                    : "#F3F1FF"
                  : "transparent",
                textDecoration: "none",
                marginBottom: "4px",
              })}
            >
              {l.label === "MonVault" && <Zap size={15} />}
              {l.label}
            </NavLink>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
