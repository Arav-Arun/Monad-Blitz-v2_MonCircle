import { TrendingUp, ArrowDownRight, Wallet } from "lucide-react";

interface WalletBalanceCardProps {
  balance: number;
  totalEarned: number;
  totalSpent: number;
  onWithdraw: () => void; // kept for API compatibility, unused
  onSpend: () => void;
}

export default function WalletBalanceCard({
  balance,
  totalEarned,
  totalSpent,
  onSpend,
}: WalletBalanceCardProps) {
  const fiatEquivalent = (balance * 1.83).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, #6E54FF 0%, #5540D9 60%, #3D2EAA 100%)",
        borderRadius: "24px",
        padding: "2.5rem",
        color: "white",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 20px 50px rgba(110, 84, 255, 0.3)",
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: "-30px",
          right: "-30px",
          width: "180px",
          height: "180px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
          filter: "blur(40px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-40px",
          left: "20%",
          width: "120px",
          height: "120px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
          filter: "blur(30px)",
        }}
      />

      <div style={{ position: "relative" }}>
        {/* Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "1.75rem",
          }}
        >
          <div style={{ 
            padding: "6px", 
            background: "rgba(255,255,255,0.15)", 
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <Wallet size={16} />
          </div>
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              color: "rgba(255,255,255,0.85)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Universal Balance
          </span>
        </div>

        {/* Balance */}
        <div style={{ marginBottom: "0.25rem" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
            <img
              src="/assets/mon-token.svg"
              alt="MON"
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                flexShrink: 0,
                border: "2px solid rgba(255,255,255,0.2)"
              }}
            />
            <span
              style={{
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}
            >
              {balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.7)",
                marginLeft: "4px"
              }}
            >
              MON
            </span>
          </div>
        </div>

        <p
          style={{
            margin: "0 0 2.5rem",
            fontSize: "1rem",
            color: "rgba(255,255,255,0.6)",
            fontWeight: 500,
          }}
        >
          ≈ ₹{fiatEquivalent} market value
        </p>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1rem",
            marginBottom: "2rem",
            background: "rgba(0,0,0,0.1)",
            padding: "1.25rem",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.05)"
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "4px",
              }}
            >
              <TrendingUp size={14} color="#4ADE80" />
              <span
                style={{
                  fontSize: "0.7rem",
                  color: "rgba(255,255,255,0.6)",
                  fontWeight: 600,
                  textTransform: "uppercase"
                }}
              >
                Earnings
              </span>
            </div>
            <span style={{ fontSize: "1.25rem", fontWeight: 800 }}>
              {totalEarned.toLocaleString()}
            </span>
          </div>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginBottom: "4px",
              }}
            >
              <ArrowDownRight size={14} color="#F87171" />
              <span
                style={{
                  fontSize: "0.7rem",
                  color: "rgba(255,255,255,0.6)",
                  fontWeight: 600,
                  textTransform: "uppercase"
                }}
              >
                Redeemed
              </span>
            </div>
            <span style={{ fontSize: "1.25rem", fontWeight: 800 }}>
              {totalSpent.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            id="wallet-spend-btn"
            onClick={onSpend}
            style={{
              flex: 1,
              height: "48px",
              padding: "0 1.5rem",
              background: "white",
              color: "#6E54FF",
              border: "none",
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "0.9375rem",
              cursor: "pointer",
              transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
              letterSpacing: "0.01em",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.02)";
              e.currentTarget.style.boxShadow = "0 6px 20px rgba(255,255,255,0.2)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
            }}
          >
            Start Shopping
          </button>
        </div>
      </div>
    </div>
  );
}
