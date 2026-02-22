import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShoppingCart,
  Star,
  Info,
  CheckCircle,
  ArrowRight,
  ChevronLeft,
} from "lucide-react";
import { getProductById, PRODUCTS, getMONEarned } from "../data/products";
import { useCart } from "../context/CartContext";
import MonBadge from "../components/MonBadge";
import ProductCard from "../components/ProductCard";

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { dispatch } = useCart();
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const product = getProductById(id!);
  if (!product) {
    return (
      <main
        style={{
          paddingTop: "64px",
          textAlign: "center",
          padding: "6rem 1.5rem",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
          Product not found
        </h1>
        <Link
          to="/products"
          className="btn-primary"
          style={{ marginTop: "1.5rem", display: "inline-flex" }}
        >
          Go to Products
        </Link>
      </main>
    );
  }

  const monEarned = getMONEarned(product.price).toFixed(2);
  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.id !== product.id,
  ).slice(0, 3);

  const handleAddToCart = () => {
    dispatch({ type: "ADD_ITEM", product });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <main style={{ paddingTop: "64px" }}>
      <div
        className="container-page"
        style={{ paddingTop: "2rem", paddingBottom: "4rem" }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "2rem",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/"
            style={{
              fontSize: "0.8125rem",
              color: "#A1A1AA",
              textDecoration: "none",
            }}
          >
            Home
          </Link>
          <span style={{ color: "#D4D4D8" }}>/</span>
          <Link
            to="/products"
            style={{
              fontSize: "0.8125rem",
              color: "#A1A1AA",
              textDecoration: "none",
            }}
          >
            Products
          </Link>
          <span style={{ color: "#D4D4D8" }}>/</span>
          <span
            style={{ fontSize: "0.8125rem", color: "#09090B", fontWeight: 600 }}
          >
            {product.name}
          </span>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "4rem",
            alignItems: "start",
          }}
        >
          {/* Gallery */}
          <div>
            <div
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                aspectRatio: "1",
                background: "#F4F4F5",
                marginBottom: "0.875rem",
                border: "1px solid #E4E4E7",
              }}
            >
              <img
                src={product.images[activeImg]}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  transition: "opacity 0.2s ease",
                }}
              />
            </div>
            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div style={{ display: "flex", gap: "0.625rem" }}>
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    style={{
                      width: "72px",
                      height: "72px",
                      borderRadius: "10px",
                      overflow: "hidden",
                      border:
                        i === activeImg
                          ? "2px solid #6E54FF"
                          : "2px solid transparent",
                      cursor: "pointer",
                      padding: 0,
                      background: "#F4F4F5",
                      transition: "border-color 0.15s",
                    }}
                  >
                    <img
                      src={img}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div>
            {/* Brand + Tags */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "0.75rem",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  padding: "3px 10px",
                  background: "#F4F4F5",
                  border: "1px solid #E4E4E7",
                  borderRadius: "6px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  color: "#3F3F46",
                }}
              >
                {product.brand}
              </span>
              {product.stock < 10 && (
                <span className="badge-success">Only {product.stock} left</span>
              )}
            </div>

            <h1
              className="text-heading-1"
              style={{ marginBottom: "0.75rem", color: "#09090B" }}
            >
              {product.name}
            </h1>

            {/* Rating */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "1.25rem",
              }}
            >
              <div style={{ display: "flex", gap: "2px" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    fill={
                      s <= Math.floor(product.rating)
                        ? "#F59E0B"
                        : "transparent"
                    }
                    color={
                      s <= Math.ceil(product.rating) ? "#F59E0B" : "#D4D4D8"
                    }
                  />
                ))}
              </div>
              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  color: "#52525B",
                }}
              >
                {product.rating}
              </span>
              <span style={{ fontSize: "0.875rem", color: "#A1A1AA" }}>
                ({product.reviewCount.toLocaleString()} reviews)
              </span>
            </div>

            {/* Price */}
            <div style={{ marginBottom: "0.125rem" }}>
              <span
                style={{
                  fontSize: "2rem",
                  fontWeight: 800,
                  color: "#09090B",
                  letterSpacing: "-0.03em",
                }}
              >
                ₹{product.price.toLocaleString("en-IN")}
              </span>
            </div>

            {/* MON Loyalty section */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "0.75rem 1rem",
                background: "#F3F1FF",
                border: "1.5px solid #D5CCFF",
                borderRadius: "10px",
                marginBottom: "1.5rem",
              }}
            >
              <img
                src="/assets/mon-token.svg"
                alt="MON"
                style={{ width: "24px", height: "24px", borderRadius: "50%" }}
              />
              <span
                style={{
                  fontWeight: 700,
                  color: "#5540D9",
                  fontSize: "0.9375rem",
                }}
              >
                You will earn{" "}
                <span style={{ color: "#6E54FF" }}>{monEarned} MON</span> on
                this order
              </span>

              {/* Tooltip */}
              <div style={{ position: "relative", marginLeft: "auto" }}>
                <button
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#8B75FF",
                    display: "flex",
                    alignItems: "center",
                  }}
                  aria-label="MON info"
                >
                  <Info size={16} />
                </button>
                {showTooltip && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "130%",
                      right: "-10px",
                      width: "220px",
                      background: "#09090B",
                      color: "white",
                      borderRadius: "10px",
                      padding: "10px 14px",
                      fontSize: "0.8rem",
                      lineHeight: 1.5,
                      zIndex: 10,
                      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontWeight: 600,
                        marginBottom: "4px",
                      }}
                    >
                      Issued by {product.brand} via MonCircle
                    </p>
                    <p style={{ margin: 0, color: "rgba(255,255,255,0.65)" }}>
                      MON is an on-chain loyalty asset credited to your MonVault
                      after delivery confirmation.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <p
              style={{
                fontSize: "0.9375rem",
                color: "#52525B",
                lineHeight: 1.8,
                marginBottom: "2rem",
              }}
            >
              {product.description}
            </p>

            {/* Tags */}
            <div
              style={{
                display: "flex",
                gap: "6px",
                marginBottom: "1.75rem",
                flexWrap: "wrap",
              }}
            >
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: "4px 12px",
                    background: "#F4F4F5",
                    borderRadius: "999px",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#52525B",
                    textTransform: "capitalize",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Add to cart */}
            <button
              id={`add-to-cart-detail-${product.id}`}
              onClick={handleAddToCart}
              className="btn-primary btn-lg"
              style={{ width: "100%", justifyContent: "center" }}
            >
              {added ? (
                <>
                  <CheckCircle size={18} /> Added to Cart!
                </>
              ) : (
                <>
                  <ShoppingCart size={18} /> Add to Cart
                </>
              )}
            </button>

            {/* Trust row */}
            <div
              style={{
                display: "flex",
                gap: "1.5rem",
                marginTop: "1.25rem",
                flexWrap: "wrap",
              }}
            >
              {[
                "Free shipping over ₹999",
                "30-day returns",
                "Secure checkout",
              ].map((t) => (
                <div
                  key={t}
                  style={{ display: "flex", alignItems: "center", gap: "6px" }}
                >
                  <CheckCircle size={13} color="#16A34A" />
                  <span
                    style={{
                      fontSize: "0.8rem",
                      color: "#52525B",
                      fontWeight: 500,
                    }}
                  >
                    {t}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div style={{ marginTop: "4rem" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
              }}
            >
              <h2 className="text-heading-3" style={{ margin: 0 }}>
                You may also like
              </h2>
              <Link
                to="/products"
                className="btn-ghost"
                style={{ fontSize: "0.875rem" }}
              >
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                gap: "1.25rem",
              }}
            >
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
        }
      `}</style>
    </main>
  );
}
