import { useState } from "react";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  ArrowDownRight,
  Award,
  ArrowRight,
  Users,
} from "lucide-react";
import WalletBalanceCard from "../components/WalletBalanceCard";
import WalletActivityItem from "../components/WalletActivityItem";
import BrandEarnCard from "../components/BrandEarnCard";

const MOCK_ACTIVITY = [
  {
    brand: "Nike",
    action: "Purchase · Air Motion Pro",
    mon: 65,
    date: "Feb 20",
    type: "earn" as const,
  },
  {
    brand: "Adidas",
    action: "Purchase · UltraBoost Strike",
    mon: 87,
    date: "Feb 18",
    type: "earn" as const,
  },
  {
    brand: "Nike",
    action: "MON redeemed at checkout",
    mon: 200,
    date: "Feb 15",
    type: "spend" as const,
  },
  {
    brand: "Puma",
    action: "Purchase · Studio Flow Hoodie",
    mon: 22,
    date: "Feb 12",
    type: "earn" as const,
  },
  {
    brand: "Fossil",
    action: "Purchase · Leather Wallet",
    mon: 11,
    date: "Feb 8",
    type: "earn" as const,
  },
  {
    brand: "Sony",
    action: "Purchase · Studio Headphones",
    mon: 133,
    date: "Jan 30",
    type: "earn" as const,
  },
  {
    brand: "Adidas",
    action: "Tier bonus credited",
    mon: 42,
    date: "Jan 20",
    type: "earn" as const,
  },
  {
    brand: "Nike",
    action: "Purchase · Trail Runner X",
    mon: 47,
    date: "Jan 14",
    type: "earn" as const,
  },
];

const BRAND_SOURCES = [
  {
    brand: "Nike",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1024px-Logo_NIKE.svg.png",
    monEarned: 510,
    tier: "Gold Member",
  },
  {
    brand: "Adidas",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/1024px-Adidas_Logo.svg.png",
    monEarned: 381,
    tier: "Silver Member",
  },
  {
    brand: "Sony",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ca/Sony_logo.svg/1024px-Sony_logo.svg.png",
    monEarned: 133,
    tier: "Member",
  },
  {
    brand: "Puma",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Puma_AG_Rudolf_Dassler_Sport.svg/1024px-Puma_AG_Rudolf_Dassler_Sport.svg.png",
    monEarned: 135,
    tier: "Silver Member",
  },
  {
    brand: "Fossil",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Fossil_Group_logo.svg/1024px-Fossil_Group_logo.svg.png",
    monEarned: 81,
    tier: "Member",
  },
];

export default function MonVaultPage() {
  const [activeTab, setActiveTab] = useState<"all" | "earn" | "spend">("all");

  const balance = 1240;
  const totalEarned = 1640;
  const totalSpent = 200;
  const activeBrands = 5;
  const lifetimeValue = Math.round(totalEarned * 0.5);

  const filtered =
    activeTab === "all"
      ? MOCK_ACTIVITY
      : MOCK_ACTIVITY.filter((a) => a.type === activeTab);

  const STATS = [
    {
      icon: <TrendingUp size={18} />,
      label: "Total Earned",
      value: `${totalEarned.toLocaleString()} MON`,
      sub: `≈ ₹${(totalEarned * 0.5).toLocaleString()}`,
      color: "#6E54FF",
    },
    {
      icon: <ArrowDownRight size={18} />,
      label: "Total Spent",
      value: `${totalSpent.toLocaleString()} MON`,
      sub: `≈ ₹${(totalSpent * 0.5).toLocaleString()}`,
      color: "var(--color-text-secondary)",
    },
    {
      icon: <Users size={18} />,
      label: "Active Brands",
      value: `${activeBrands}`,
      sub: "on MonCircle",
      color: "var(--color-text-secondary)",
    },
    {
      icon: <Award size={18} />,
      label: "Lifetime Value",
      value: `₹${lifetimeValue.toLocaleString()}`,
      sub: "from loyalty",
      color: "#16A34A",
    },
  ];

  return (
    <main
      style={{
        paddingTop: "64px",
        background: "var(--color-surface)",
        minHeight: "100vh",
      }}
    >
      <div
        className="container-page"
        style={{ paddingTop: "2.5rem", paddingBottom: "4rem" }}
      >
        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <p
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#6E54FF",
              margin: "0 0 0.25rem",
            }}
          >
            MonCircle
          </p>
          <h1
            className="text-heading-1"
            style={{
              marginBottom: "0.375rem",
              color: "var(--color-text-primary)",
            }}
          >
            MonVault
          </h1>
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "0.9375rem",
              margin: 0,
            }}
          >
            Your decentralized loyalty wallet — powered by Monad
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1.5rem",
            alignItems: "start",
          }}
        >
          {/* Balance Card */}
          <div>
            <WalletBalanceCard
              balance={balance}
              totalEarned={totalEarned}
              totalSpent={totalSpent}
              onWithdraw={() => {}}
              onSpend={() => (window.location.href = "/products")}
            />
          </div>

          {/* Stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="card"
                style={{ padding: "1.25rem" }}
              >
                <div style={{ color: stat.color, marginBottom: "0.75rem" }}>
                  {stat.icon}
                </div>
                <p
                  style={{
                    margin: "0 0 2px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "var(--color-text-tertiary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {stat.label}
                </p>
                <p
                  style={{
                    margin: "0 0 2px",
                    fontSize: "1.25rem",
                    fontWeight: 800,
                    color: "var(--color-text-primary)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.75rem",
                    color: "var(--color-text-tertiary)",
                    fontWeight: 500,
                  }}
                >
                  {stat.sub}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Main content — two columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: "2rem",
            marginTop: "2rem",
            alignItems: "start",
          }}
        >
          {/* Activity */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.25rem",
                flexWrap: "wrap",
                gap: "0.75rem",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "1rem",
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                }}
              >
                Activity
              </h2>
              {/* Tabs */}
              <div
                style={{
                  display: "flex",
                  gap: "4px",
                  background: "var(--color-surface-2)",
                  padding: "3px",
                  borderRadius: "10px",
                }}
              >
                {(["all", "earn", "spend"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "7px",
                      border: "none",
                      background:
                        activeTab === tab
                          ? "var(--color-white)"
                          : "transparent",
                      color:
                        activeTab === tab
                          ? "var(--color-text-primary)"
                          : "var(--color-text-secondary)",
                      fontWeight: activeTab === tab ? 700 : 500,
                      fontSize: "0.8125rem",
                      cursor: "pointer",
                      transition: "all 0.15s",
                      boxShadow:
                        activeTab === tab
                          ? "0 1px 4px rgba(0,0,0,0.08)"
                          : "none",
                      textTransform: "capitalize",
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div>
              {filtered.map((item, i) => (
                <WalletActivityItem key={i} {...item} />
              ))}
            </div>

            {filtered.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  color: "var(--color-text-tertiary)",
                  fontSize: "0.875rem",
                  padding: "2rem 0",
                }}
              >
                No {activeTab} activity yet.
              </p>
            )}
          </div>

          {/* Right col — Brand Sources only */}
          <div>
            <div className="card" style={{ padding: "1.25rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "1rem",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontSize: "1rem",
                    fontWeight: 700,
                    color: "var(--color-text-primary)",
                  }}
                >
                  Brand Sources
                </h2>
                <Link
                  to="/products"
                  style={{
                    fontSize: "0.8125rem",
                    color: "#6E54FF",
                    fontWeight: 600,
                    textDecoration: "none",
                  }}
                >
                  Shop more{" "}
                  <ArrowRight
                    size={13}
                    style={{ display: "inline", verticalAlign: "middle" }}
                  />
                </Link>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.875rem",
                }}
              >
                {BRAND_SOURCES.map((brand) => (
                  <BrandEarnCard key={brand.brand} {...brand} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .monvault-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
