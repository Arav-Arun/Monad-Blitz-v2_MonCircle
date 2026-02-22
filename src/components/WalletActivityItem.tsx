import { useTheme } from "../context/ThemeContext";

interface WalletActivityItemProps {
  brand: string;
  action: string;
  mon: number;
  date: string;
  type: "earn" | "spend" | "withdraw";
}

export default function WalletActivityItem({
  brand,
  action,
  mon,
  date,
  type,
}: WalletActivityItemProps) {
  const { c } = useTheme();
  const isPositive = type === "earn";
  const icon = type === "earn" ? "↑" : type === "spend" ? "↓" : "⟵";
  const color =
    type === "earn" ? "#16A34A" : type === "spend" ? "#6E54FF" : "#D97706";
  const bg =
    type === "earn"
      ? "rgba(22,163,74,0.15)"
      : type === "spend"
        ? "rgba(110,84,255,0.15)"
        : "rgba(217,119,6,0.15)";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        padding: "0.875rem 0",
        borderBottom: `1px solid ${c.border}`,
      }}
    >
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "10px",
          background: bg,
          color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1rem",
          fontWeight: 700,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            margin: 0,
            fontWeight: 600,
            fontSize: "0.875rem",
            color: c.textPrimary,
          }}
        >
          {brand}
        </p>
        <p style={{ margin: 0, fontSize: "0.8rem", color: c.textTertiary }}>
          {action}
        </p>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p
          style={{
            margin: 0,
            fontWeight: 700,
            fontSize: "0.9375rem",
            color: isPositive ? "#16A34A" : color,
          }}
        >
          {isPositive ? "+" : "−"}
          {Math.abs(mon)} MON
        </p>
        <p style={{ margin: 0, fontSize: "0.75rem", color: c.textTertiary }}>
          {date}
        </p>
      </div>
    </div>
  );
}
