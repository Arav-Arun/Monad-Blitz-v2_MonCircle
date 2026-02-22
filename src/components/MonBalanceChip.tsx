import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function MonBalanceChip() {
  const { state } = useCart();

  return (
    <Link
      to="/monvault"
      id="mon-balance-chip"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "6px 12px",
        background: "rgba(110,84,255,0.12)",
        border: "1.5px solid rgba(110,84,255,0.3)",
        borderRadius: "999px",
        textDecoration: "none",
        color: "#6E54FF",
        fontWeight: 700,
        fontSize: "0.8125rem",
        letterSpacing: "0.01em",
        transition: "all 0.15s ease",
        whiteSpace: "nowrap",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = "#6E54FF";
        (e.currentTarget as HTMLElement).style.color = "white";
        (e.currentTarget as HTMLElement).style.borderColor = "#6E54FF";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background =
          "rgba(110,84,255,0.12)";
        (e.currentTarget as HTMLElement).style.color = "#6E54FF";
        (e.currentTarget as HTMLElement).style.borderColor =
          "rgba(110,84,255,0.3)";
      }}
    >
      <img
        src="/assets/mon-token.svg"
        alt="MON"
        style={{ width: "16px", height: "16px", borderRadius: "50%" }}
      />
      {state.monBalance.toLocaleString()} MON
    </Link>
  );
}
