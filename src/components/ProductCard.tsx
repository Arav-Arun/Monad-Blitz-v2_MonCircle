import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import { type Product, getMONEarned } from "../data/products";
import { useCart } from "../context/CartContext";
import { useTheme } from "../context/ThemeContext";
import MonBadge from "./MonBadge";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { dispatch } = useCart();
  const { c } = useTheme();
  const monEarned = getMONEarned(product.price, product.monEarnRate);

  return (
    <article
      className="card card-hover"
      style={{
        display: "flex",
        flexDirection: "column",
        background: c.cardBg,
        borderColor: c.border,
      }}
    >
      <Link
        to={`/product/${product.id}`}
        style={{
          textDecoration: "none",
          display: "block",
          flexShrink: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            aspectRatio: "4/3",
            overflow: "hidden",
            background: c.surfaceBg,
          }}
        >
          <img
            src={product.images[0]}
            alt={product.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.4s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                `https://placehold.co/400x300/6E54FF/white?text=${product.brand}`;
            }}
            loading="lazy"
          />
        </div>
        {/* Brand tag */}
        <span
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: "6px",
            padding: "2px 8px",
            fontSize: "0.7rem",
            fontWeight: 700,
            color: "#09090B",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          {product.brand}
        </span>
      </Link>

      {/* Content */}
      <div
        style={{
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
          flex: 1,
          background: c.cardBg,
        }}
      >
        {/* Rating */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <Star size={12} fill="#F59E0B" color="#F59E0B" />
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 600,
              color: c.textSecondary,
            }}
          >
            {product.rating}
          </span>
          <span style={{ fontSize: "0.75rem", color: c.textTertiary }}>
            ({product.reviewCount})
          </span>
        </div>

        <Link to={`/product/${product.id}`} style={{ textDecoration: "none" }}>
          <h3
            style={{
              fontSize: "0.9375rem",
              fontWeight: 600,
              color: c.textPrimary,
              margin: 0,
              lineHeight: 1.3,
              letterSpacing: "-0.01em",
            }}
          >
            {product.name}
          </h3>
        </Link>

        {/* Price + MON */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: "auto",
            paddingTop: "0.5rem",
          }}
        >
          <div>
            <span
              style={{
                fontSize: "1.0625rem",
                fontWeight: 700,
                color: c.textPrimary,
              }}
            >
              ₹{product.price.toLocaleString("en-IN")}
            </span>
          </div>
          <MonBadge amount={monEarned} size="sm" />
        </div>

        {/* Add to cart */}
        <button
          id={`add-to-cart-${product.id}`}
          onClick={() => dispatch({ type: "ADD_ITEM", product })}
          className="btn-primary"
          style={{ marginTop: "0.5rem", width: "100%" }}
        >
          <ShoppingCart size={15} />
          Add to Cart
        </button>
      </div>
    </article>
  );
}
