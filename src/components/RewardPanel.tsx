import { useCart } from "../context/CartContext";

interface RewardPanelProps {
  showBrandBreakdown?: boolean;
}

export default function RewardPanel({
  showBrandBreakdown = false,
}: RewardPanelProps) {
  const { state, totalMONEarned } = useCart();

  // Group by brand
  const brandBreakdown = state.items.reduce<
    Record<string, { mon: number; brand: string }>
  >((acc, item) => {
    const monPer = Number(((item.product.price * item.quantity * 0.01) / 1.83).toFixed(2));
    const key = item.product.brand;
    if (!acc[key]) acc[key] = { mon: 0, brand: key };
    acc[key].mon = Number((acc[key].mon + monPer).toFixed(2));
    return acc;
  }, {});

  const brandEntries = Object.values(brandBreakdown);
  const hasTierBonus = totalMONEarned > 0;

  return (
    <div
      style={{
        borderRadius: "14px",
        background: "linear-gradient(135deg, #F3F1FF 0%, #E9E5FF 100%)",
        border: "1.5px solid #D5CCFF",
        padding: "1.125rem 1.25rem",
      }}
    >
      <p
        style={{
          margin: "0 0 0.75rem",
          fontSize: "0.75rem",
          fontWeight: 700,
          color: "#6E54FF",
          textTransform: "uppercase",
          letterSpacing: "0.08em",
        }}
      >
        You will earn
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "6px",
          marginBottom: "0.875rem",
        }}
      >
        <img
          src="/assets/mon-token.svg"
          alt="MON"
          style={{
            width: "22px",
            height: "22px",
            borderRadius: "50%",
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontSize: "2rem",
            fontWeight: 800,
            color: "#6E54FF",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          +{totalMONEarned.toFixed(2)}
        </span>
        <span style={{ fontSize: "1rem", fontWeight: 600, color: "#8B75FF" }}>
          MON
        </span>
      </div>

      {showBrandBreakdown && brandEntries.length > 1 && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.375rem",
            marginBottom: "0.75rem",
          }}
        >
          {brandEntries.map((entry) => (
            <div
              key={entry.brand}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "0.8125rem",
                  color: "#8B75FF",
                  fontWeight: 500,
                }}
              >
                {entry.brand}
              </span>
              <span
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  color: "#6E54FF",
                }}
              >
                +{entry.mon.toFixed(2)} MON
              </span>
            </div>
          ))}
        </div>
      )}

      {hasTierBonus && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "0.375rem 0.75rem",
            background: "rgba(110, 84, 255, 0.12)",
            borderRadius: "8px",
          }}
        >
          <span
            style={{ fontSize: "0.75rem", color: "#5540D9", fontWeight: 500 }}
          >
            🔥 Tier bonus active — earn 1.2× MON
          </span>
        </div>
      )}

      <p
        style={{
          margin: "0.625rem 0 0",
          fontSize: "0.75rem",
          color: "#8B75FF",
        }}
      >
        Credited to your MonVault after delivery confirmation.
      </p>
    </div>
  );
}
