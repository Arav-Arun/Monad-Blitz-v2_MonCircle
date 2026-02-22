import { Link } from "react-router-dom";
import { ArrowRight, Zap, Shield, TrendingUp } from "lucide-react";
import {
  getFeaturedProducts,
  CATEGORIES,
  getMONEarned,
} from "../data/products";
import ProductCard from "../components/ProductCard";
import SectionHeader from "../components/SectionHeader";
import { useTheme } from "../context/ThemeContext";

export default function HomePage() {
  const { c } = useTheme();
  const featured = getFeaturedProducts().slice(0, 4);

  return (
    <main style={{ background: c.pageBg, minHeight: "100vh" }}>
      {/* HERO */}
      <section
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          background: c.heroGradient,
          paddingTop: "7rem",
          paddingBottom: "2rem",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            right: "5%",
            width: "400px",
            height: "400px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(110,84,255,0.12) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "5%",
            left: "3%",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(110,84,255,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          className="container-page"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "center",
            width: "100%",
          }}
        >
          {/* Left */}
          <div style={{ animation: "fadeInUp 0.5s ease" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                background: "rgba(110, 84, 255, 0.1)",
                border: "1px solid rgba(110, 84, 255, 0.3)",
                borderRadius: "999px",
                marginBottom: "1.5rem",
              }}
            >
              <img
                src="/assets/mon-token.svg"
                alt=""
                style={{ width: "18px", height: "18px", borderRadius: "50%" }}
              />
              <span
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 700,
                  color: "#6E54FF",
                }}
              >
                Powered by MonCircle — Loyalty on Monad
              </span>
            </div>

            <h1
              className="text-display"
              style={{ marginBottom: "1.5rem", color: c.textPrimary }}
            >
              Shop Smart. <span style={{ color: "#6E54FF" }}>Own your</span>{" "}
              Loyalty.
            </h1>

            <p
              style={{
                fontSize: "1.125rem",
                color: c.textSecondary,
                lineHeight: 1.7,
                marginBottom: "2.5rem",
                maxWidth: "480px",
              }}
            >
              Every purchase earns you{" "}
              <strong style={{ color: "#6E54FF" }}>MON</strong> — a real
              on-chain asset, not locked points. Spend it across brands, or hold
              it. Your rewards, your rules.
            </p>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              <Link to="/products" className="btn-primary btn-lg">
                Shop Now <ArrowRight size={18} />
              </Link>
              <Link to="/monvault" className="btn-secondary btn-lg">
                View MonVault
              </Link>
            </div>

            {/* Trust indicators */}
            <div
              style={{
                display: "flex",
                gap: "2.5rem",
                marginTop: "3.75rem",
                flexWrap: "wrap",
              }}
            >
              {[
                { label: "12K+ products", sub: "across brands" },
                { label: "1M+ MON", sub: "rewards issued" },
                { label: "48+ brands", sub: "on MonCircle" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p
                    style={{
                      margin: 0,
                      fontWeight: 800,
                      fontSize: "1.0625rem",
                      color: c.textPrimary,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {stat.label}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.8rem",
                      color: c.textTertiary,
                      fontWeight: 500,
                    }}
                  >
                    {stat.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — hero visual */}
          <div
            style={{
              position: "relative",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "100%",
                maxWidth: "480px",
                aspectRatio: "1",
                borderRadius: "32px",
                overflow: "hidden",
                boxShadow: "0 24px 80px rgba(110, 84, 255, 0.25)",
                position: "relative",
              }}
            >
              <img
                src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&q=90"
                alt="Feature product"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              {/* Floating MON card */}
              <div
                style={{
                  position: "absolute",
                  bottom: "24px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "rgba(255,255,255,0.95)",
                  backdropFilter: "blur(12px)",
                  borderRadius: "16px",
                  padding: "1rem 1.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                  border: "1px solid rgba(255,255,255,0.8)",
                  whiteSpace: "nowrap",
                }}
              >
                <img
                  src="/assets/mon-token.svg"
                  alt=""
                  style={{ width: "38px", height: "38px", borderRadius: "50%" }}
                />
                <div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.75rem",
                      color: "#A1A1AA",
                      fontWeight: 600,
                    }}
                  >
                    You will earn
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "1.375rem",
                      fontWeight: 800,
                      color: "#6E54FF",
                      letterSpacing: "-0.02em",
                      lineHeight: 1.1,
                    }}
                  >
                    +{getMONEarned(12999).toFixed(0)} MON
                  </p>
                </div>
                <div
                  style={{
                    padding: "4px 10px",
                    background: "#DCFCE7",
                    color: "#16A34A",
                    borderRadius: "999px",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                  }}
                >
                  Live
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LOYALTY STRIP */}
      <section style={{ background: "#09090B", padding: "1.5rem 0" }}>
        <div className="container-page">
          <div
            style={{
              display: "flex",
              gap: "2rem",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {[
              {
                icon: <TrendingUp size={16} />,
                text: "Earn MON on every purchase",
              },
              { icon: <Zap size={16} />, text: "Spend MON on brands you love" },
              {
                icon: <Shield size={16} />,
                text: "Your loyalty, owned by you",
              },
            ].map((item) => (
              <div
                key={item.text}
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span style={{ color: "#6E54FF" }}>{item.icon}</span>
                <span
                  style={{
                    color: "#A1A1AA",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                  }}
                >
                  {item.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="section" style={{ background: c.pageBg }}>
        <div className="container-page">
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: "2rem",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <SectionHeader
              label="Editor's Pick"
              title="Featured Products"
              subtitle="Handpicked items with the best MON earn rates this week."
            />
            <Link to="/products" className="btn-secondary">
              View all <ArrowRight size={15} />
            </Link>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section
        className="section"
        style={{
          background: c.surfaceBg,
          paddingTop: "3rem",
          paddingBottom: "3rem",
        }}
      >
        <div className="container-page">
          <SectionHeader label="Browse" title="Shop by Category" centered />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: "1rem",
            }}
          >
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                style={{ textDecoration: "none", display: "block" }}
              >
                <div
                  style={{
                    borderRadius: "14px",
                    overflow: "hidden",
                    position: "relative",
                    aspectRatio: "4/3",
                    cursor: "pointer",
                    transition: "transform 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.02)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        `https://placehold.co/400x300/6E54FF/white?text=${cat.name}`;
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "12px",
                      left: "12px",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 700,
                        color: "white",
                        fontSize: "0.9375rem",
                      }}
                    >
                      {cat.name}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.75rem",
                        color: "rgba(255,255,255,0.7)",
                      }}
                    >
                      {cat.productCount} items
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* MONCIRCLE EXPLAINER */}
      <section className="section" style={{ background: c.pageBg }}>
        <div className="container-page">
          <div
            style={{
              background: "linear-gradient(135deg, #09090B 0%, #1a1245 100%)",
              borderRadius: "24px",
              padding: "3rem 2rem",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "3rem",
              alignItems: "center",
            }}
          >
            <div>
              <img
                src="/logo-white.svg"
                alt="Monad"
                style={{ height: "28px", marginBottom: "1.5rem", opacity: 0.9 }}
              />
              <h2
                className="text-heading-2"
                style={{ color: "white", marginBottom: "1rem" }}
              >
                Loyalty that you actually own.
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: "0.9375rem",
                  lineHeight: 1.8,
                  marginBottom: "1.5rem",
                }}
              >
                MonCircle issues MON on Monad — a real on-chain asset, not a
                locked app point. Shop across brands, earn MON everywhere.
              </p>
              <Link to="/monvault" className="btn-primary btn-lg">
                Open MonVault <ArrowRight size={18} />
              </Link>
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {[
                {
                  icon: "🛍️",
                  title: "Earn on every order",
                  desc: "MON is credited instantly when you shop at any MonCircle brand.",
                },
                {
                  icon: "💸",
                  title: "Use across brands",
                  desc: "Spend your Nike MON at Adidas. Loyalty without silos.",
                },
                {
                  icon: "🔒",
                  title: "Truly yours",
                  desc: "Stored on-chain. Not locked to an app, not lost if a brand closes.",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  style={{
                    display: "flex",
                    gap: "1rem",
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: "12px",
                    padding: "1rem",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <span style={{ fontSize: "1.5rem", flexShrink: 0 }}>
                    {f.icon}
                  </span>
                  <div>
                    <p
                      style={{
                        margin: "0 0 4px",
                        fontWeight: 700,
                        color: "white",
                        fontSize: "0.9rem",
                      }}
                    >
                      {f.title}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        color: "rgba(255,255,255,0.5)",
                        fontSize: "0.8125rem",
                        lineHeight: 1.6,
                      }}
                    >
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROMO BANNERS */}
      <section
        className="section"
        style={{ paddingTop: "0", background: c.pageBg }}
      >
        <div className="container-page">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1.25rem",
            }}
          >
            <div
              style={{
                borderRadius: "16px",
                padding: "2rem",
                background: c.promoBg,
                border: `1.5px solid ${c.promoBorder}`,
                position: "relative",
                overflow: "hidden",
              }}
            >
              <p
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#6E54FF",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "0.5rem",
                }}
              >
                Double MON Weekend
              </p>
              <h3
                style={{
                  fontSize: "1.375rem",
                  fontWeight: 800,
                  color: c.textPrimary,
                  margin: "0 0 0.75rem",
                  letterSpacing: "-0.02em",
                }}
              >
                Earn 2× this weekend
              </h3>
              <p
                style={{
                  color: c.textSecondary,
                  fontSize: "0.875rem",
                  margin: "0 0 1.25rem",
                  lineHeight: 1.6,
                }}
              >
                All sneakers & apparel. Limited window — Friday to Sunday only.
              </p>
              <Link to="/products" className="btn-primary">
                Shop Now <ArrowRight size={15} />
              </Link>
            </div>
            <div
              style={{
                borderRadius: "16px",
                padding: "2rem",
                background: c.promoBg,
                border: `1.5px solid ${c.promoBorder}`,
                position: "relative",
                overflow: "visible",
              }}
            >
              <p
                style={{
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  color: "#6E54FF",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "0.5rem",
                }}
              >
                New In
              </p>
              <h3
                style={{
                  fontSize: "1.375rem",
                  fontWeight: 800,
                  color: c.textPrimary,
                  margin: "0 0 0.75rem",
                  letterSpacing: "-0.02em",
                }}
              >
                Studio Collection
              </h3>
              <p
                style={{
                  color: c.textSecondary,
                  fontSize: "0.875rem",
                  margin: "0 0 1.25rem",
                  lineHeight: 1.6,
                }}
              >
                Discover our latest apparel pieces with premium materials and
                modern designs.
              </p>
              <Link to="/products?category=apparel" className="btn-secondary">
                Explore <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
