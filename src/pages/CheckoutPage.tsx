import { useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, CreditCard, Lock, Truck } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import CheckoutMonCard from "../components/CheckoutMonCard";
import RewardPanel from "../components/RewardPanel";
import ScratchCard from "../components/ScratchCard";

type Step = "shipping" | "payment" | "review";

interface ShippingData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
}

const INITIAL_SHIPPING: ShippingData = {
  name: "Arjun Singh",
  email: "arjun@example.com",
  phone: "+91 98765 43210",
  address: "123, Monad Tower, Brigade Road",
  city: "Bangalore",
  state: "Karnataka",
  zip: "560001",
};

export default function CheckoutPage() {
  const { 
    state, 
    cartTotal, 
    totalMONEarned, 
    monDiscount, 
    dispatch, 
    monEarnedBreakdown, 
    monRedemptionBreakdown 
  } = useCart();
  const { c } = useTheme();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("shipping");
  const [shipping, setShipping] = useState<ShippingData>(INITIAL_SHIPPING);
  const [placed, setPlaced] = useState(false);
  const [finalEarnedMON, setFinalEarnedMON] = useState(0);

  const finalTotal = Math.round(cartTotal - monDiscount);
  const taxes = Math.round(cartTotal * 0.18);

  const handlePlaceOrder = async () => {
    try {
      // 1. Save order to our new MonMart backend (server.js)
      const orderId = "ORD-" + Math.random().toString(36).slice(2, 9).toUpperCase();
      await fetch('http://localhost:5000/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId,
          total: finalTotal + taxes,
          userId: user?.id,
          monEarned: monEarnedBreakdown,
          monRedeemed: state.monApplied ? monRedemptionBreakdown : {},
          customer: {
            name: shipping.name,
            email: shipping.email
          }
        })
      });

      // 2. Emit Autopilot event for MonCircle SDK (Zero-Hardcode)
      window.dispatchEvent(new CustomEvent('mon-purchase-success', {
        detail: {
          orderId,
          monAmount: totalMONEarned,
          userId: user?.id
        }
      }));

      setFinalEarnedMON(totalMONEarned);
      setPlaced(true);
      setTimeout(() => dispatch({ type: "CLEAR_CART" }), 100);
    } catch (err) {
      console.error('Order failed:', err);
      alert('Payment failed. Please try again.');
    }
  };

  if (placed) {
    return (
      <main
        style={{
          paddingTop: "64px",
          minHeight: "80vh",
          background: c.pageBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{ textAlign: "center", maxWidth: "420px", padding: "2rem" }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background: "#DCFCE7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem",
            }}
          >
            <CheckCircle size={36} color="#16A34A" />
          </div>
          <h1
            style={{
              fontSize: "1.625rem",
              fontWeight: 800,
              marginBottom: "0.5rem",
              color: c.textPrimary,
              letterSpacing: "-0.02em",
            }}
          >
            Order Placed!
          </h1>
          <p
            style={{
              color: c.textSecondary,
              marginBottom: "1.75rem",
              lineHeight: 1.7,
            }}
          >
            Your order is confirmed. You've earned{" "}
            <strong style={{ color: "#6E54FF" }}>{finalEarnedMON.toFixed(2)} MON</strong>{" "}
            from this purchase. It'll appear in your MonVault after delivery.
          </p>
          <div style={{ marginBottom: "2rem" }}>
            <p style={{ 
              fontSize: "0.8125rem", 
              fontWeight: 700, 
              color: c.textTertiary, 
              marginBottom: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}>
              YOUR ORDER REWARD
            </p>
            <ScratchCard amount={finalEarnedMON} />
          </div>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link to="/monvault" className="btn-primary">
              View MonVault
            </Link>
            <Link to="/products" className="btn-secondary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (state.items.length === 0) {
    return (
      <main
        style={{
          paddingTop: "64px",
          background: c.pageBg,
          textAlign: "center",
          padding: "6rem 1.5rem",
        }}
      >
        <h1 style={{ fontWeight: 700, color: c.textPrimary }}>
          Your cart is empty
        </h1>
        <Link
          to="/products"
          className="btn-primary"
          style={{ marginTop: "1rem", display: "inline-flex" }}
        >
          Shop Now
        </Link>
      </main>
    );
  }

  const STEPS: { id: Step; label: string; icon: React.ReactNode }[] = [
    { id: "shipping", label: "Shipping", icon: <Truck size={15} /> },
    { id: "payment", label: "Payment", icon: <CreditCard size={15} /> },
    { id: "review", label: "Review", icon: <CheckCircle size={15} /> },
  ];
  const stepIndex = STEPS.findIndex((s) => s.id === step);

  const labelStyle = {
    display: "block",
    fontSize: "0.8125rem",
    fontWeight: 600,
    color: c.textSecondary,
    marginBottom: "6px",
  } as const;
  const rowDiv = { display: "flex", justifyContent: "space-between" } as const;

  return (
    <main
      style={{ paddingTop: "64px", background: c.pageBg, minHeight: "100vh" }}
    >
      <div
        className="container-page"
        style={{ paddingTop: "2.5rem", paddingBottom: "4rem" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "2.5rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <h1 className="text-heading-1" style={{ color: c.textPrimary }}>
            Checkout
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "6px 14px",
                    borderRadius: "999px",
                    background:
                      i < stepIndex
                        ? "#DCFCE7"
                        : i === stepIndex
                          ? "#6E54FF"
                          : c.surfaceBg,
                    color:
                      i < stepIndex
                        ? "#16A34A"
                        : i === stepIndex
                          ? "white"
                          : c.textTertiary,
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    cursor: i < stepIndex ? "pointer" : "default",
                    transition: "all 0.2s",
                  }}
                  onClick={() => i < stepIndex && setStep(s.id)}
                >
                  {s.icon}
                  {s.label}
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    style={{
                      width: "20px",
                      height: "2px",
                      background: i < stepIndex ? "#16A34A" : c.border,
                      borderRadius: "1px",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 380px",
            gap: "2rem",
            alignItems: "start",
          }}
        >
          {/* Left — form area */}
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
          >
            {/* SHIPPING */}
            {step === "shipping" && (
              <div
                className="card"
                style={{ padding: "1.75rem", background: c.cardBg }}
              >
                <h2
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    margin: "0 0 1.5rem",
                    color: c.textPrimary,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <Truck size={18} color="#6E54FF" /> Shipping Information
                </h2>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                >
                  {[
                    {
                      label: "Full Name",
                      key: "name",
                      placeholder: "Arjun Singh",
                      colSpan: 1,
                    },
                    {
                      label: "Email",
                      key: "email",
                      placeholder: "arjun@email.com",
                      colSpan: 1,
                    },
                    {
                      label: "Phone",
                      key: "phone",
                      placeholder: "+91 98765 43210",
                      colSpan: 1,
                    },
                    {
                      label: "Address",
                      key: "address",
                      placeholder: "123, Brigade Road",
                      colSpan: 2,
                    },
                    {
                      label: "City",
                      key: "city",
                      placeholder: "Bangalore",
                      colSpan: 1,
                    },
                    {
                      label: "State",
                      key: "state",
                      placeholder: "Karnataka",
                      colSpan: 1,
                    },
                    {
                      label: "PIN Code",
                      key: "zip",
                      placeholder: "560001",
                      colSpan: 1,
                    },
                  ].map((field) => (
                    <div
                      key={field.key}
                      style={{ gridColumn: `span ${field.colSpan}` }}
                    >
                      <label style={labelStyle}>{field.label}</label>
                      <input
                        type="text"
                        className="input"
                        placeholder={field.placeholder}
                        value={shipping[field.key as keyof ShippingData]}
                        onChange={(e) =>
                          setShipping((prev) => ({
                            ...prev,
                            [field.key]: e.target.value,
                          }))
                        }
                        id={`shipping-${field.key}`}
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setStep("payment")}
                  className="btn-primary"
                  style={{ marginTop: "1.5rem", padding: "0.875rem 2rem" }}
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* PAYMENT */}
            {step === "payment" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.25rem",
                }}
              >
                <div
                  className="card"
                  style={{ padding: "1.75rem", background: c.cardBg }}
                >
                  <h2
                    style={{
                      fontSize: "1rem",
                      fontWeight: 700,
                      margin: "0 0 1.5rem",
                      color: c.textPrimary,
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                    }}
                  >
                    <CreditCard size={18} color="#6E54FF" /> Payment Method
                  </h2>
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                    }}
                  >
                    {[
                      {
                        label: "Card Number",
                        placeholder: "4242 4242 4242 4242",
                        colSpan: 2,
                      },
                      {
                        label: "Name on Card",
                        placeholder: "Arjun Singh",
                        colSpan: 2,
                      },
                      { label: "Expiry", placeholder: "MM / YY", colSpan: 1 },
                      { label: "CVV", placeholder: "···", colSpan: 1 },
                    ].map((field, i) => (
                      <div
                        key={i}
                        style={{ gridColumn: `span ${field.colSpan}` }}
                      >
                        <label style={labelStyle}>{field.label}</label>
                        <input
                          type="text"
                          className="input"
                          defaultValue={
                            field.label === "Card Number" ? "4242 4242 4242 4242" :
                            field.label === "Name on Card" ? "Arjun Singh" :
                            field.label === "Expiry" ? "12/26" :
                            field.label === "CVV" ? "123" : ""
                          }
                          placeholder={field.placeholder}
                          id={`card-${field.label.replace(/\s/g, "-").toLowerCase()}`}
                        />
                      </div>
                    ))}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginTop: "1rem",
                      padding: "0.625rem 0.875rem",
                      background: c.surfaceBg,
                      borderRadius: "8px",
                      border: `1px solid ${c.border}`,
                    }}
                  >
                    <Lock size={13} color={c.textTertiary} />
                    <span
                      style={{
                        fontSize: "0.75rem",
                        color: c.textTertiary,
                        fontWeight: 500,
                      }}
                    >
                      256-bit SSL encryption · PCI-DSS compliant
                    </span>
                  </div>
                </div>

                <div>
                  <p
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.08em",
                      color: c.textTertiary,
                      margin: "0 0 0.625rem",
                    }}
                  >
                    Loyalty Payment
                  </p>
                  <CheckoutMonCard />
                </div>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    onClick={() => setStep("shipping")}
                    className="btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep("review")}
                    className="btn-primary"
                    style={{ flex: 2, justifyContent: "center" }}
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* REVIEW */}
            {step === "review" && (
              <div
                className="card"
                style={{ padding: "1.75rem", background: c.cardBg }}
              >
                <h2
                  style={{
                    fontSize: "1rem",
                    fontWeight: 700,
                    margin: "0 0 1.5rem",
                    color: c.textPrimary,
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <CheckCircle size={18} color="#6E54FF" /> Review Your Order
                </h2>
                <div
                  style={{
                    background: c.surfaceBg,
                    borderRadius: "10px",
                    padding: "1rem",
                    marginBottom: "1.25rem",
                    border: `1px solid ${c.border}`,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        color: c.textSecondary,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Shipping to
                    </span>
                    <button
                      onClick={() => setStep("shipping")}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#6E54FF",
                        fontSize: "0.8125rem",
                        fontWeight: 600,
                        padding: 0,
                      }}
                    >
                      Edit
                    </button>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.875rem",
                      color: c.textPrimary,
                      fontWeight: 500,
                    }}
                  >
                    {shipping.name || "Arjun Singh"} ·{" "}
                    {shipping.address || "123 Brigade Road"},{" "}
                    {shipping.city || "Bangalore"}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.875rem",
                    marginBottom: "1.25rem",
                  }}
                >
                  {state.items.map((item) => (
                    <div
                      key={item.product.id}
                      style={{
                        display: "flex",
                        gap: "0.875rem",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          width: "52px",
                          height: "52px",
                          borderRadius: "8px",
                          overflow: "hidden",
                          background: c.surfaceBg,
                          border: `1px solid ${c.border}`,
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={item.product.images[0]}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
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
                          {item.product.name}
                        </p>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.8rem",
                            color: c.textTertiary,
                          }}
                        >
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <span
                        style={{
                          fontWeight: 700,
                          fontSize: "0.9375rem",
                          color: c.textPrimary,
                        }}
                      >
                        ₹
                        {(item.product.price * item.quantity).toLocaleString(
                          "en-IN",
                        )}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    height: "1px",
                    background: c.border,
                    margin: "0 0 1.25rem",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                    marginBottom: "1.5rem",
                  }}
                >
                  <div style={rowDiv}>
                    <span
                      style={{ fontSize: "0.875rem", color: c.textSecondary }}
                    >
                      Subtotal
                    </span>
                    <span style={{ fontWeight: 600, color: c.textPrimary }}>
                      ₹{cartTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                  {state.monApplied && (
                    <div style={rowDiv}>
                      <span
                        style={{
                          fontSize: "0.875rem",
                          color: "#6E54FF",
                          fontWeight: 500,
                        }}
                      >
                        MON discount
                      </span>
                      <span style={{ fontWeight: 600, color: "#16A34A" }}>
                        −₹{Math.round(monDiscount).toLocaleString("en-IN")}
                      </span>
                    </div>
                  )}
                  <div style={rowDiv}>
                    <span
                      style={{ fontSize: "0.875rem", color: c.textSecondary }}
                    >
                      GST (18%)
                    </span>
                    <span style={{ fontWeight: 600, color: c.textPrimary }}>
                      ₹{taxes.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div style={rowDiv}>
                    <span
                      style={{ fontSize: "0.875rem", color: c.textSecondary }}
                    >
                      Shipping
                    </span>
                    <span style={{ fontWeight: 600, color: "#16A34A" }}>
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
                  <div style={rowDiv}>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "1rem",
                        color: c.textPrimary,
                      }}
                    >
                      Total
                    </span>
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: "1.25rem",
                        color: "#6E54FF",
                      }}
                    >
                      ₹{(finalTotal + taxes).toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.75rem" }}>
                  <button
                    onClick={() => setStep("payment")}
                    className="btn-secondary"
                    style={{ flex: 1 }}
                  >
                    Back
                  </button>
                  <button
                    id="place-order-btn"
                    onClick={handlePlaceOrder}
                    className="btn-primary"
                    style={{
                      flex: 2,
                      justifyContent: "center",
                      padding: "0.875rem",
                    }}
                  >
                    <Lock size={15} /> Place Order
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right — sticky summary */}
          <div
            style={{
              position: "sticky",
              top: "80px",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            <div
              className="card"
              style={{ padding: "1.25rem", background: c.cardBg }}
            >
              <h3
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  margin: "0 0 1rem",
                  color: c.textPrimary,
                }}
              >
                Order ({state.items.length} items)
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                {state.items.map((item) => (
                  <div
                    key={item.product.id}
                    style={{
                      display: "flex",
                      gap: "0.75rem",
                      alignItems: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "8px",
                        overflow: "hidden",
                        background: c.surfaceBg,
                        border: `1px solid ${c.border}`,
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={item.product.images[0]}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.8125rem",
                          fontWeight: 600,
                          color: c.textPrimary,
                          lineHeight: 1.3,
                        }}
                      >
                        {item.product.name}
                      </p>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.75rem",
                          color: c.textTertiary,
                        }}
                      >
                        ×{item.quantity}
                      </p>
                    </div>
                    <span
                      style={{
                        fontSize: "0.8125rem",
                        fontWeight: 700,
                        color: c.textPrimary,
                      }}
                    >
                      ₹
                      {(item.product.price * item.quantity).toLocaleString(
                        "en-IN",
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  borderTop: `1px solid ${c.border}`,
                  marginTop: "1rem",
                  paddingTop: "1rem",
                }}
              >
                <div style={rowDiv}>
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: 700,
                      color: c.textPrimary,
                    }}
                  >
                    Order total
                  </span>
                  <span style={{ fontWeight: 800, color: c.textPrimary }}>
                    ₹{cartTotal.toLocaleString("en-IN")}
                  </span>
                </div>
                {state.monApplied && (
                  <div style={{ ...rowDiv, marginTop: "4px" }}>
                    <span
                      style={{
                        fontSize: "0.875rem",
                        color: "#6E54FF",
                        fontWeight: 500,
                      }}
                    >
                      After MON
                    </span>
                    <span style={{ fontWeight: 700, color: "#6E54FF" }}>
                      ₹{finalTotal.toLocaleString("en-IN")}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <RewardPanel showBrandBreakdown />
          </div>
        </div>
      </div>
    </main>
  );
}
