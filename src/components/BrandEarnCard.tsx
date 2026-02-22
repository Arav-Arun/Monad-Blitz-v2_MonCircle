import { Link } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

interface BrandEarnCardProps {
  brand: string;
  logo: string;
  monEarned: number;
  tier: string;
}

export default function BrandEarnCard({
  brand,
  logo,
  monEarned,
  tier,
}: BrandEarnCardProps) {
  const { c } = useTheme();

  return (
    <div
      style={{
        background: c.cardBg,
        border: `1.5px solid ${c.border}`,
        borderRadius: "14px",
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.875rem",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "#6E54FF";
        (e.currentTarget as HTMLElement).style.boxShadow =
          "0 4px 16px rgba(110, 84, 255, 0.12)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = c.border;
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <div
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "10px",
            background: c.surfaceBg,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            flexShrink: 0,
            border: `1px solid ${c.border}`,
          }}
        >
          <img
            src={logo}
            alt={brand}
            style={{ width: "30px", height: "30px", objectFit: "contain" }}
            onError={(e) => {
              // Show brand initial as fallback
              const el = e.currentTarget as HTMLImageElement;
              el.style.display = "none";
              const parent = el.parentElement;
              if (parent && !parent.querySelector(".brand-initial")) {
                const div = document.createElement("div");
                div.className = "brand-initial";
                div.textContent = brand[0];
                div.style.cssText =
                  "font-weight:800;font-size:1rem;color:#6E54FF;";
                parent.appendChild(div);
              }
            }}
          />
        </div>
        <div>
          <p
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: "0.9rem",
              color: c.textPrimary,
            }}
          >
            {brand}
          </p>
          <p style={{ margin: 0, fontSize: "0.75rem", color: c.textTertiary }}>
            {tier}
          </p>
        </div>
      </div>

      <div>
        <p
          style={{
            margin: "0 0 2px",
            fontSize: "0.75rem",
            color: c.textTertiary,
            fontWeight: 500,
          }}
        >
          MON earned
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <img
            src="/assets/mon-token.svg"
            alt=""
            style={{ width: "16px", height: "16px", borderRadius: "50%" }}
          />
          <span
            style={{
              fontWeight: 800,
              fontSize: "1.25rem",
              color: "#6E54FF",
              letterSpacing: "-0.02em",
            }}
          >
            {monEarned.toLocaleString()}
          </span>
          <span
            style={{
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: c.textTertiary,
            }}
          >
            MON
          </span>
        </div>
      </div>

      <Link
        to="/products"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "0.5rem",
          background: "rgba(110,84,255,0.12)",
          color: "#6E54FF",
          borderRadius: "8px",
          fontSize: "0.8125rem",
          fontWeight: 700,
          textDecoration: "none",
          transition: "all 0.15s",
          letterSpacing: "0.01em",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "#6E54FF";
          (e.currentTarget as HTMLElement).style.color = "white";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background =
            "rgba(110,84,255,0.12)";
          (e.currentTarget as HTMLElement).style.color = "#6E54FF";
        }}
      >
        Shop & Spend
      </Link>
    </div>
  );
}
