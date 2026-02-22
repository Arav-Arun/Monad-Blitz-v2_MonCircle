import { Link } from "react-router-dom";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

interface BrandEarnCardProps {
  brand: string;
  logo: string;
  monEarned: number;
  tier: string;
  onWithdraw?: () => Promise<void>;
}

export default function BrandEarnCard({
  brand,
  logo,
  monEarned,
  tier,
  onWithdraw,
}: BrandEarnCardProps) {
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async () => {
    if (!onWithdraw) return;
    setLoading(true);
    try {
      await onWithdraw();
    } finally {
      setLoading(false);
    }
  };

  const isEligible = monEarned >= 100;

  return (
    <div
      className="card"
      style={{
        padding: "1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        border: "1px solid var(--color-border)",
        background: "var(--color-surface)",
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-6px)";
        e.currentTarget.style.boxShadow = "var(--shadow-xl)";
        e.currentTarget.style.borderColor = "var(--color-primary-light)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "var(--color-border)";
      }}
    >
      {/* Top Section: Logo & Brand Info */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            background: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            border: "1px solid rgba(0,0,0,0.03)",
          }}
        >
          <img
            src={logo}
            alt={brand}
            style={{ width: "38px", height: "38px", objectFit: "contain" }}
          />
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <h3
              style={{
                margin: 0,
                fontSize: "1rem",
                fontWeight: 700,
                color: "var(--color-text-primary)",
                letterSpacing: "-0.01em",
              }}
            >
              {brand}
            </h3>
            {tier.includes("Gold") && (
              <Sparkles size={14} color="#EAB308" />
            )}
          </div>
          <p
            style={{
              margin: "2px 0 0",
              fontSize: "0.75rem",
              color: "#6E54FF",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.02em",
            }}
          >
            {tier}
          </p>
        </div>
      </div>

      {/* Middle Section: MON Balance */}
      <div
        style={{
          background: "var(--color-surface-2)",
          padding: "1rem",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p
            style={{
              margin: "0 0 4px",
              fontSize: "0.7rem",
              fontWeight: 600,
              color: "var(--color-text-tertiary)",
              textTransform: "uppercase",
            }}
          >
            Available Rewards
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <img
              src="/assets/mon-token.svg"
              alt="MON"
              style={{ width: "18px", height: "18px", borderRadius: "50%" }}
            />
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: 800,
                color: "var(--color-text-primary)",
                letterSpacing: "-0.02em",
              }}
            >
              {monEarned.toLocaleString()}
            </span>
            <span
              style={{
                fontSize: "0.875rem",
                fontWeight: 600,
                color: "var(--color-text-tertiary)",
              }}
            >
              MON
            </span>
          </div>
        </div>

        {isEligible && (
          <div
            style={{
              padding: "4px 8px",
              background: "rgba(22, 163, 74, 0.1)",
              color: "#16A34A",
              borderRadius: "6px",
              fontSize: "0.65rem",
              fontWeight: 700,
            }}
          >
            ELGIBLE
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div style={{ display: "flex", gap: "0.75rem" }}>
        <button
          onClick={handleWithdraw}
          disabled={!isEligible || loading}
          style={{
            flex: 1,
            height: "42px",
            background: isEligible ? "#6E54FF" : "var(--color-surface-3)",
            color: isEligible ? "white" : "var(--color-text-tertiary)",
            border: "none",
            borderRadius: "10px",
            fontSize: "0.8125rem",
            fontWeight: 700,
            cursor: isEligible && !loading ? "pointer" : "not-allowed",
            transition: "all 0.15s",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            boxShadow: isEligible ? "0 4px 12px rgba(110,84,255,0.25)" : "none",
          }}
        >
          {loading ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            "Cash Out"
          )}
        </button>
        
        <Link
          to="/products"
          title="Shop this brand"
          style={{
            width: "42px",
            height: "42px",
            background: "var(--color-surface-2)",
            color: "var(--color-text-secondary)",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1px solid var(--color-border)",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--color-surface-3)";
            e.currentTarget.style.color = "#6E54FF";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--color-surface-2)";
            e.currentTarget.style.color = "var(--color-text-secondary)";
          }}
        >
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}
