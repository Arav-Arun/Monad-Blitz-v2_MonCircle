import { Info } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function CheckoutMonCard() {
  const { state, dispatch, cartTotal, monDiscount, maxRedeemableMON } = useCart();
  const { user } = useAuth();

  const totalUserMON = user?.balances 
    ? Object.values(user.balances).reduce((sum, val) => sum + val, 0)
    : 0;

  const CONVERSION_RATE = 1.83;
  const redeemableValueINR = maxRedeemableMON * CONVERSION_RATE;

  return (
    <div
      style={{
        border: state.monApplied ? "2px solid #6E54FF" : "1.5px solid #E4E4E7",
        borderRadius: "14px",
        overflow: "hidden",
        transition: "border-color 0.2s ease",
        background: "white",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1rem 1.25rem",
          background: state.monApplied ? "#F3F1FF" : "white",
          transition: "background 0.2s ease",
          borderBottom: "1px solid #F4F4F5",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img
            src="/assets/mon-token.svg"
            alt="MON"
            style={{ width: "32px", height: "32px", borderRadius: "50%" }}
          />
          <div>
            <p
              style={{
                margin: 0,
                fontWeight: 700,
                fontSize: "0.9375rem",
                color: "#09090B",
              }}
            >
              Pay with MON
            </p>
            <p style={{ margin: 0, fontSize: "0.8rem", color: "#6E54FF" }}>
              {totalUserMON.toFixed(2)} MON available · ₹
              {redeemableValueINR.toLocaleString("en-IN", {
                maximumFractionDigits: 0,
              })}{" "}
              redeemable
            </p>
          </div>
        </div>

        {/* Toggle */}
        <button
          id="mon-pay-toggle"
          onClick={() => dispatch({ type: "TOGGLE_MON" })}
          style={{
            width: "48px",
            height: "26px",
            borderRadius: "999px",
            background: state.monApplied ? "#6E54FF" : "#E4E4E7",
            border: "none",
            cursor: "pointer",
            position: "relative",
            transition: "background 0.2s ease",
            flexShrink: 0,
          }}
          aria-label="Toggle MON payment"
          role="switch"
          aria-checked={state.monApplied}
        >
          <span
            style={{
              position: "absolute",
              top: "3px",
              left: state.monApplied ? "25px" : "3px",
              width: "20px",
              height: "20px",
              background: "white",
              borderRadius: "50%",
              transition: "left 0.2s ease",
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            }}
          />
        </button>
      </div>

      {/* Applied state */}
      {state.monApplied && (
        <div style={{ padding: "1rem 1.25rem" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.625rem",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "0.875rem", color: "#52525B" }}>
                Order total
              </span>
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#09090B",
                }}
              >
                ₹{cartTotal.toLocaleString("en-IN")}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <span
                  style={{
                    fontSize: "0.875rem",
                    color: "#6E54FF",
                    fontWeight: 500,
                  }}
                >
                  MON applied ({maxRedeemableMON.toFixed(2)} MON × ₹1.83)
                </span>
                <div
                  title="MON is your on-chain loyalty reward. 1 MON = ₹1.83 value on checkout."
                  style={{ color: "#A1A1AA", cursor: "help" }}
                >
                  <Info size={13} />
                </div>
              </div>
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "#16A34A",
                }}
              >
                −₹{Math.round(monDiscount).toLocaleString("en-IN")}
              </span>
            </div>
            <div style={{ height: "1px", background: "#F4F4F5" }} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{ fontSize: "1rem", fontWeight: 700, color: "#09090B" }}
              >
                Final amount
              </span>
              <span
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 800,
                  color: "#6E54FF",
                }}
              >
                ₹{Math.round(cartTotal - monDiscount).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
