import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TrendingUp,
  ArrowDownRight,
  Award,
  ArrowRight,
  Users,
  Loader2,
} from "lucide-react";
import WalletBalanceCard from "../components/WalletBalanceCard";
import WalletActivityItem from "../components/WalletActivityItem";
import BrandEarnCard from "../components/BrandEarnCard";
import { useAuth } from "../context/AuthContext";

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
];

export default function MonVaultPage() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"all" | "earn" | "spend">("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.orders) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token, navigate]);

  // Aggregate stats from user balances
  const userBalances = user?.balances || {};
  const balance = Object.values(userBalances).reduce((sum, val) => sum + (val as number), 0);
  
  // Map backend orders to Activity items (Earn + Spend)
  const activity: any[] = [];
  orders.forEach((o: any) => {
    const date = new Date(o.createdAt).toLocaleDateString('en-IN', { 
      month: 'short', 
      day: 'numeric' 
    });

    // 1. Earnings
    if (o.monEarned) {
      Object.entries(o.monEarned).forEach(([brand, amount]) => {
        if (Number(amount) > 0) {
          activity.push({
            brand: brand === "Global" ? "MonMart" : brand,
            action: `Earned on ${o.orderId}`,
            mon: Number(amount),
            date,
            type: "earn" as const,
          });
        }
      });
    }

    // 2. Redemptions (Deductions)
    if (o.monRedeemed) {
      Object.entries(o.monRedeemed).forEach(([brand, amount]) => {
        if (Number(amount) > 0) {
          activity.push({
            brand: brand === "Global" ? "MonMart" : brand,
            action: `Used on ${o.orderId}`,
            mon: Number(amount),
            date,
            type: "spend" as const,
          });
        }
      });
    }
  });

  const totalEarned = activity.filter(a => a.type === "earn").reduce((sum, a) => sum + a.mon, 0);
  const totalSpent = activity.filter(a => a.type === "spend").reduce((sum, a) => sum + a.mon, 0);
  const activeBrands = Object.keys(userBalances).length;
  const lifetimeValue = Math.round(totalEarned * 1.83); // Total ever earned

  const handleWithdraw = async (brand: string, amount: number) => {
    try {
      const res = await fetch("http://localhost:5000/api/withdraw", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ brand, amount }),
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        window.location.reload(); // Quick refresh to update balances
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error("Withdrawal failed:", err);
    }
  };

  const filtered =
    activeTab === "all"
      ? activity
      : activity.filter((a) => a.type === activeTab);

  const STATS = [
    {
      icon: <TrendingUp size={18} />,
      label: "Live Balance",
      value: `${balance.toFixed(2)} MON`,
      sub: `≈ ₹${(balance * 1.83).toLocaleString()}`,
      color: "#6E54FF",
    },
    {
      icon: <ArrowDownRight size={18} />,
      label: "Total Spent",
      value: `${totalSpent.toLocaleString()} MON`,
      sub: `≈ ₹${(totalSpent * 1.83).toLocaleString()}`,
      color: "var(--color-text-secondary)",
    },
    {
      icon: <Users size={18} />,
      label: "Brand Sources",
      value: `${activeBrands}`,
      sub: "Active loyalty accounts",
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

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "var(--color-surface)" }}>
        <Loader2 size={40} className="animate-spin" color="#6E54FF" />
      </div>
    );
  }

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
        <div className="monvault-grid">
          {/* Activity */}
          <div className="card" style={{ padding: "1.5rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
                flexWrap: "wrap",
                gap: "1rem",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                  letterSpacing: "-0.01em",
                }}
              >
                Activity Feed
              </h2>
              {/* Tabs */}
              <div
                style={{
                  display: "flex",
                  gap: "4px",
                  background: "var(--color-surface-2)",
                  padding: "4px",
                  borderRadius: "12px",
                }}
              >
                {(["all", "earn", "spend"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "999px",
                      border: "none",
                      background:
                        activeTab === tab
                          ? "white"
                          : "transparent",
                      color:
                        activeTab === tab
                          ? "#6E54FF"
                          : "var(--color-text-secondary)",
                      fontWeight: activeTab === tab ? 700 : 500,
                      fontSize: "0.8125rem",
                      cursor: "pointer",
                      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                      boxShadow:
                        activeTab === tab
                          ? "0 2px 8px rgba(0,0,0,0.06)"
                          : "none",
                      textTransform: "capitalize",
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ minHeight: "300px" }}>
              {filtered.map((item, i) => (
                <WalletActivityItem key={i} {...item} />
              ))}
              
              {filtered.length === 0 && (
                <div style={{ 
                  textAlign: "center", 
                  padding: "4rem 0",
                  color: "var(--color-text-tertiary)"
                }}>
                  <p style={{ fontSize: "0.9rem", margin: 0 }}>No matching activity found.</p>
                </div>
              )}
            </div>
          </div>

          {/* Right col — Brand Sources only */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2
                style={{
                  margin: 0,
                  fontSize: "1.125rem",
                  fontWeight: 700,
                  color: "var(--color-text-primary)",
                  letterSpacing: "-0.01em",
                }}
              >
                Brand Loyalty
              </h2>
              <Link
                to="/products"
                style={{
                  fontSize: "0.8125rem",
                  color: "#6E54FF",
                  fontWeight: 600,
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <span>Shop more</span>
                <ArrowRight size={14} />
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "1.25rem",
              }}
            >
              {Object.entries(userBalances).map(([brandName, amount]) => {
                const source = BRAND_SOURCES.find(s => s.brand === brandName) || {
                  brand: brandName,
                  logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_6M2E-G-6y7E-G-6y7E-G-6y7E-G-6y7E-G-6y7E",
                  tier: "Active Member"
                };
                return (
                  <BrandEarnCard 
                    key={brandName} 
                    {...source} 
                    monEarned={amount as number} 
                    onWithdraw={async () => {
                      await handleWithdraw(brandName, amount as number);
                    }}
                  />
                );
              })}
              
              {Object.keys(userBalances).length === 0 && (
                 <div className="card" style={{ padding: "2rem", textAlign: "center", background: "var(--color-surface-2)" }}>
                    <p style={{ color: "var(--color-text-tertiary)", fontSize: "0.875rem", margin: 0 }}>
                        Start shopping to earn brand rewards!
                    </p>
                 </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .monvault-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 2rem;
          margin-top: 2rem;
          align-items: start;
        }

        @media (max-width: 1100px) {
          .monvault-grid { 
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
