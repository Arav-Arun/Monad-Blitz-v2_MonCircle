import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import React from "react";

export default function MonBalanceChip() {
  const { user } = useAuth();
  const { isDark } = useTheme();

  const liveBalance = user?.balances 
    ? Object.values(user.balances).reduce((sum, val) => sum + (val as number), 0)
    : 0;

  return (
    <Link
      to="/monvault"
      id="mon-balance-chip"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "5px 14px",
        background: isDark ? "rgba(110,84,255,0.15)" : "#F3F1FF",
        border: "1.5px solid rgba(110,84,255,0.25)",
        borderRadius: "99px",
        textDecoration: "none",
        color: "#6E54FF",
        fontWeight: 700,
        fontSize: "0.8125rem",
        letterSpacing: "0.01em",
        transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
        whiteSpace: "nowrap",
        boxShadow: "0 2px 10px rgba(110,84,255,0.1)",
      }}
      onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
        (e.currentTarget as HTMLElement).style.background = "#6E54FF";
        (e.currentTarget as HTMLElement).style.color = "white";
        (e.currentTarget as HTMLElement).style.borderColor = "#6E54FF";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 15px rgba(110,84,255,0.3)";
      }}
      onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.background = isDark ? "rgba(110,84,255,0.15)" : "#F3F1FF";
        (e.currentTarget as HTMLElement).style.color = "#6E54FF";
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(110,84,255,0.25)";
        (e.currentTarget as HTMLElement).style.boxShadow = "0 2px 10px rgba(110,84,255,0.1)";
      }}
    >
      <img
        src="/assets/mon-token.svg"
        alt="MON"
        style={{ width: "16px", height: "16px", borderRadius: "50%" }}
      />
      <span>{liveBalance.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}</span>
      <span style={{ fontSize: "0.7rem", opacity: 0.8 }}>MON</span>
    </Link>
  );
}
