import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { getMONEarned } from "../data/products";
import MonBadge from "../components/MonBadge";
import RewardPanel from "../components/RewardPanel";

export default function CartPage() {
  const { state, dispatch, cartTotal, cartCount, totalMONEarned } = useCart();
  const { c } = useTheme();
  const navigate = useNavigate();

  if (state.items.length === 0) {
    return (
      <main
        style={{
          paddingTop: "64px",
          minHeight: "70vh",
          background: c.pageBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: c.surfaceBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.25rem",
            }}
          >
            <ShoppingBag size={28} color={c.textTertiary} />
          </div>
          <h1
            style={{
              fontSize: "1.375rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
              color: c.textPrimary,
            }}
          >
            Your cart is empty
          </h1>
          <p style={{ color: c.textSecondary, marginBottom: "1.5rem" }}>
            Add some products to earn MON!
          </p>
          <Link to="/products" className="btn-primary btn-lg">
            Start Shopping <ArrowRight size={18} />
          </Link>
        </div>
      </main>
    );
  }

  const brandBreakdown = state.items.reduce<Record<string, number>>(
    (acc, item) => {
      const mon =
        getMONEarned(item.product.price, item.product.monEarnRate) *
        item.quantity;
      acc[item.product.brand] = (acc[item.product.brand] || 0) + mon;
      return acc;
    },
    {},
  );

  const qtyBtnStyle = {
    width: "28px",
    height: "28px",
    borderRadius: "8px",
    border: `1.5px solid ${c.border}`,
    background: c.cardBg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: c.textSecondary,
  } as const;

  return (
    <main
      style={{ paddingTop: "64px", background: c.pageBg, minHeight: "100vh" }}
    >
      <div
        className="container-page"
        style={{ paddingTop: "2.5rem", paddingBottom: "4rem" }}
      >
        <h1
          className="text-heading-1"
          style={{ marginBottom: "0.375rem", color: c.textPrimary }}
        >
          Your Cart
        </h1>
        <p
          style={{
            color: c.textSecondary,
            marginBottom: "2.5rem",
            fontSize: "0.9375rem",
          }}
        >
          {cartCount} item{cartCount !== 1 ? "s" : ""} · Earn{" "}
          <strong style={{ color: "#6E54FF" }}>{totalMONEarned} MON</strong> on
          this order
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {/* Items */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
            {state.items.map((item) => {
              const monEarned =
                getMONEarned(item.product.price, item.product.monEarnRate) *
                item.quantity;
              return (
                <div
                  key={item.product.id}
                  style={{
                    display: "flex",
                    gap: "1.25rem",
                    padding: "1.25rem 0",
                    borderBottom: `1px solid ${c.border}`,
                    alignItems: "center",
                  }}
                >
                  <Link
                    to={`/product/${item.product.id}`}
                    style={{ flexShrink: 0 }}
                  >
                    <div
                      style={{
                        width: "90px",
                        height: "90px",
                        borderRadius: "12px",
                        overflow: "hidden",
                        background: c.surfaceBg,
                        border: `1px solid ${c.border}`,
                      }}
                    >
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            `https://placehold.co/90x90/6E54FF/white?text=${item.product.brand[0]}`;
                        }}
                      />
                    </div>
                  </Link>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: "0 0 2px",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: c.textTertiary,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                      }}
                    >
                      {item.product.brand}
                    </p>
                    <Link
                      to={`/product/${item.product.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <p
                        style={{
                          margin: "0 0 6px",
                          fontWeight: 700,
                          fontSize: "0.9375rem",
                          color: c.textPrimary,
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {item.product.name}
                      </p>
                    </Link>
                    <MonBadge amount={monEarned} size="sm" />
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-end",
                      gap: "0.75rem",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: "1rem",
                        color: c.textPrimary,
                      }}
                    >
                      ₹
                      {(item.product.price * item.quantity).toLocaleString(
                        "en-IN",
                      )}
                    </span>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <button
                        onClick={() =>
                          dispatch({
                            type: "UPDATE_QTY",
                            productId: item.product.id,
                            quantity: item.quantity - 1,
                          })
                        }
                        style={qtyBtnStyle}
                      >
                        <Minus size={13} />
                      </button>
                      <span
                        style={{
                          fontSize: "0.875rem",
                          fontWeight: 700,
                          minWidth: "20px",
                          textAlign: "center",
                          color: c.textPrimary,
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          dispatch({
                            type: "UPDATE_QTY",
                            productId: item.product.id,
                            quantity: item.quantity + 1,
                          })
                        }
                        style={qtyBtnStyle}
                      >
                        <Plus size={13} />
                      </button>
                      <button
                        onClick={() =>
                          dispatch({
                            type: "REMOVE_ITEM",
                            productId: item.product.id,
                          })
                        }
                        style={{
                          ...qtyBtnStyle,
                          border: "none",
                          background: "transparent",
                          color: "#DC2626",
                          marginLeft: "4px",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "rgba(220,38,38,0.1)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              position: "sticky",
              top: "80px",
            }}
          >
            <div
              className="card"
              style={{
                padding: "1.25rem",
                background: c.cardBg,
                borderColor: c.border,
              }}
            >
              <h3
                style={{
                  fontSize: "0.9375rem",
                  fontWeight: 700,
                  margin: "0 0 1.25rem",
                  color: c.textPrimary,
                }}
              >
                Order Summary
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.625rem",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span
                    style={{ fontSize: "0.875rem", color: c.textSecondary }}
                  >
                    Subtotal ({cartCount} items)
                  </span>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: c.textPrimary,
                    }}
                  >
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span
                    style={{ fontSize: "0.875rem", color: c.textSecondary }}
                  >
                    Shipping
                  </span>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      color: "#16A34A",
                    }}
                  >
                    Free
                  </span>
                </div>
                <div
                  style={{
                    height: "1px",
                    background: c.border,
                    margin: "0.25rem 0",
                  }}
                />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span style={{ fontWeight: 700, color: c.textPrimary }}>
                    Total
                  </span>
                  <span
                    style={{
                      fontWeight: 800,
                      fontSize: "1.125rem",
                      color: c.textPrimary,
                    }}
                  >
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
              <button
                id="cart-checkout-btn"
                onClick={() => navigate("/checkout")}
                className="btn-primary"
                style={{
                  width: "100%",
                  justifyContent: "center",
                  marginTop: "1.25rem",
                  padding: "0.875rem",
                }}
              >
                Proceed to Checkout <ArrowRight size={16} />
              </button>
            </div>

            <RewardPanel showBrandBreakdown />

            {Object.keys(brandBreakdown).length > 1 && (
              <div
                className="card"
                style={{
                  padding: "1.125rem",
                  background: c.cardBg,
                  borderColor: c.border,
                }}
              >
                <p
                  style={{
                    margin: "0 0 0.75rem",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    color: c.textTertiary,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  MON Breakdown
                </p>
                {Object.entries(brandBreakdown).map(([brand, mon]) => (
                  <div
                    key={brand}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "4px 0",
                      borderBottom: `1px solid ${c.border}`,
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.875rem",
                        color: c.textSecondary,
                        fontWeight: 500,
                      }}
                    >
                      {brand}
                    </span>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        fontWeight: 700,
                        color: "#6E54FF",
                      }}
                    >
                      +{mon} MON
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
