import { useTheme } from "../context/ThemeContext";

interface SectionHeaderProps {
  label?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionHeader({
  label,
  title,
  subtitle,
  centered = false,
}: SectionHeaderProps) {
  const { c } = useTheme();
  return (
    <div
      style={{ textAlign: centered ? "center" : "left", marginBottom: "2rem" }}
    >
      {label && (
        <span
          style={{
            display: "inline-block",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#6E54FF",
            marginBottom: "0.5rem",
          }}
        >
          {label}
        </span>
      )}
      <h2
        className="text-heading-2"
        style={{ margin: 0, color: c.textPrimary }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            margin: "0.625rem 0 0",
            fontSize: "1rem",
            color: c.textSecondary,
            maxWidth: centered ? "560px" : undefined,
            marginLeft: centered ? "auto" : undefined,
            marginRight: centered ? "auto" : undefined,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
