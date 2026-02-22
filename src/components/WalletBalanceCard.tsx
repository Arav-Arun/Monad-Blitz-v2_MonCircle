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
  const fiatEquivalent = (balance * 0.5).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  });

  return (
    <div
      style={{
        background:
          "linear-gradient(135deg, #6E54FF 0%, #5540D9 60%, #3D2EAA 100%)",
        borderRadius: "20px",
        padding: "2rem",
        color: "white",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background decoration */}
      <div
        style={{
          position: "absolute",
          top: "-60px",
          right: "-60px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.06)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-40px",
          left: "40%",
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
        }}
      />

      <div style={{ position: "relative" }}>
        {/* Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            marginBottom: "1.5rem",
          }}
        >
          <Wallet size={18} color="rgba(255,255,255,0.7)" />
          <span
            style={{
              fontSize: "0.875rem",
              fontWeight: 500,
              color: "rgba(255,255,255,0.7)",
              letterSpacing: "0.05em",
            }}
          >
            MON BALANCE
          </span>
        </div>

        {/* Balance */}
        <div style={{ marginBottom: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
            <img
              src="/assets/mon-token.svg"
              alt="MON"
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "50%",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "clamp(2.5rem, 5vw, 3.5rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}
            >
              {balance.toLocaleString()}
            </span>
            <span
              style={{
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "rgba(255,255,255,0.7)",
              }}
            >
              MON
            </span>
          </div>
        </div>

        <p
          style={{
            margin: "0 0 2rem",
            fontSize: "0.9rem",
            color: "rgba(255,255,255,0.6)",
            fontWeight: 500,
          }}
        >
          ≈ ₹{fiatEquivalent} fiat value
        </p>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: "1.5rem",
            marginBottom: "1.75rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                marginBottom: "2px",
              }}
            >
              <TrendingUp size={13} color="rgba(255,255,255,0.6)" />
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.6)",
                  fontWeight: 500,
                }}
              >
                Total earned
              </span>
            </div>
            <span style={{ fontSize: "1.125rem", fontWeight: 700 }}>
              +{totalEarned.toLocaleString()} MON
            </span>
          </div>
          <div
            style={{
              width: "1px",
              background: "rgba(255,255,255,0.15)",
              alignSelf: "stretch",
            }}
          />
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                marginBottom: "2px",
              }}
            >
              <ArrowDownRight size={13} color="rgba(255,255,255,0.6)" />
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "rgba(255,255,255,0.6)",
                  fontWeight: 500,
                }}
              >
                Total spent
              </span>
            </div>
            <span style={{ fontSize: "1.125rem", fontWeight: 700 }}>
              −{totalSpent.toLocaleString()} MON
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button
            id="wallet-spend-btn"
            onClick={onSpend}
            style={{
              flex: 1,
              padding: "0.75rem",
              background: "white",
              color: "#6E54FF",
              border: "none",
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "0.875rem",
              cursor: "pointer",
              transition: "all 0.15s",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#F3F1FF")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "white")}
          >
            Spend MON →
          </button>
        </div>
      </div>
    </div>
  );
}
