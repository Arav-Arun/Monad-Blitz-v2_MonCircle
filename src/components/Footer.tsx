import { Link } from "react-router-dom";
import { Github, Twitter, Instagram, Zap } from "lucide-react";

export default function Footer() {
  return (
    <footer
      style={{ background: "#09090B", color: "#A1A1AA", marginTop: "auto" }}
    >
      {/* Loyalty Strip */}
      <div
        style={{
          background: "#6E54FF",
          padding: "1.25rem 0",
        }}
      >
        <div className="container-page">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <img
                src="/assets/mon-token.svg"
                alt="MON"
                style={{ width: "20px", height: "20px", borderRadius: "50%" }}
              />
              <span
                style={{
                  fontSize: "0.9rem",
                  fontWeight: 700,
                  color: "white",
                  letterSpacing: "-0.01em",
                }}
              >
                Powered by MonCircle — Your Loyalty, On-Chain.
              </span>
            </div>
            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {[
                "Earn MON on every purchase",
                "Spend MON on brands you love",
                "Your loyalty, owned by you",
              ].map((item) => (
                <div
                  key={item}
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <Zap size={13} color="rgba(255,255,255,0.7)" />
                  <span
                    style={{
                      fontSize: "0.8125rem",
                      color: "rgba(255,255,255,0.85)",
                      fontWeight: 500,
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-page" style={{ padding: "3rem 1.5rem" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "2.5rem",
            marginBottom: "2.5rem",
          }}
        >
          {/* Brand col */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <img
                src="/assets/logomark.svg"
                alt="MonMart"
                style={{ height: "24px", filter: "brightness(0) invert(1)" }}
              />
              <span
                style={{
                  fontWeight: 800,
                  fontSize: "1.0625rem",
                  color: "white",
                  letterSpacing: "-0.02em",
                }}
              >
                Mon<span style={{ color: "#8B75FF" }}>Mart</span>
              </span>
            </div>
            <p
              style={{
                fontSize: "0.875rem",
                lineHeight: 1.7,
                margin: 0,
                color: "#71717A",
              }}
            >
              The next-gen commerce platform with integrated loyalty rewards on
              Monad.
            </p>
            <div style={{ display: "flex", gap: "10px", marginTop: "1.25rem" }}>
              {[Twitter, Instagram, Github].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "8px",
                    border: "1px solid #3F3F46",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#71717A",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "#6E54FF";
                    (e.currentTarget as HTMLElement).style.color = "#8B75FF";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor =
                      "#3F3F46";
                    (e.currentTarget as HTMLElement).style.color = "#71717A";
                  }}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            {
              title: "Shop",
              links: [
                "Sneakers",
                "Apparel",
                "Accessories",
                "Bags",
                "Watches",
                "Tech",
              ],
            },
            {
              title: "MonCircle",
              links: [
                "About MonCircle",
                "MonVault",
                "Earn MON",
                "Brands",
                "Developers",
              ],
            },
            {
              title: "Help",
              links: [
                "FAQ",
                "Shipping Policy",
                "Returns",
                "Track Order",
                "Contact Us",
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4
                style={{
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "white",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  margin: "0 0 1rem",
                }}
              >
                {col.title}
              </h4>
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {col.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      style={{
                        fontSize: "0.875rem",
                        color: "#71717A",
                        textDecoration: "none",
                        transition: "color 0.15s",
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.color = "white")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = "#71717A")
                      }
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid #27272A",
            paddingTop: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "0.8125rem", color: "#52525B", margin: 0 }}>
            © 2025 MonMart. Loyalty powered by{" "}
            <span style={{ color: "#8B75FF", fontWeight: 600 }}>MonCircle</span>{" "}
            on Monad.
          </p>
          <p style={{ fontSize: "0.75rem", color: "#3F3F46", margin: 0 }}>
            MON tokens are issued via smart contracts on Monad. This is a demo
            platform.
          </p>
        </div>
      </div>
    </footer>
  );
}
