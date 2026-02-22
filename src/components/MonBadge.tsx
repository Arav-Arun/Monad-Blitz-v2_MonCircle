interface MonBadgeProps {
  amount: number;
  size?: "sm" | "md";
}

export default function MonBadge({ amount, size = "md" }: MonBadgeProps) {
  const isSmall = size === "sm";
  return (
    <span
      className="badge-mon"
      style={{
        fontSize: isSmall ? "0.6875rem" : "0.75rem",
        padding: isSmall ? "2px 7px" : "3px 9px",
      }}
    >
      <img
        src="/assets/mon-token.svg"
        alt=""
        style={{
          width: isSmall ? 12 : 14,
          height: isSmall ? 12 : 14,
          borderRadius: "50%",
        }}
      />
      +{amount.toFixed(2)} MON
    </span>
  );
}
