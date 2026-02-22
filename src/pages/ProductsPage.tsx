import { useState, useMemo, type Dispatch, type SetStateAction } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";
import { PRODUCTS, CATEGORIES } from "../data/products";
import ProductCard from "../components/ProductCard";
import SectionHeader from "../components/SectionHeader";
import { useTheme } from "../context/ThemeContext";

const SORT_OPTIONS = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Most MON Earned", value: "mon-desc" },
  { label: "Top Rated", value: "rating" },
];

const BRANDS = ["Nike", "Adidas", "Puma", "Fossil", "Sony"];
const PRICE_RANGES = [
  { label: "Under ₹3,000", min: 0, max: 3000 },
  { label: "₹3,000 – ₹10,000", min: 3000, max: 10000 },
  { label: "₹10,000 – ₹20,000", min: 10000, max: 20000 },
  { label: "Above ₹20,000", min: 20000, max: Infinity },
];

interface FilterSidebarProps {
  activeCategory: string;
  selectedBrands: string[];
  selectedPrice: number | null;
  onCategoryChange: (cat: string) => void;
  onBrandToggle: (brand: string) => void;
  onPriceChange: Dispatch<SetStateAction<number | null>>;
}

function FilterSidebar({
  activeCategory,
  selectedBrands,
  selectedPrice,
  onCategoryChange,
  onBrandToggle,
  onPriceChange,
}: FilterSidebarProps) {
  const { c } = useTheme();

  const activeBtnStyle = {
    background: "rgba(110,84,255,0.15)",
    color: "#6E54FF",
    fontWeight: 700,
  };
  const inactiveBtnStyle = {
    background: "transparent",
    color: c.textSecondary,
    fontWeight: 500,
  };

  return (
    <aside style={{ minWidth: "220px" }}>
      {/* Categories */}
      <div style={{ marginBottom: "2rem" }}>
        <h4
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: c.textTertiary,
            margin: "0 0 0.875rem",
          }}
        >
          Category
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <button
            onClick={() => onCategoryChange("")}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "7px 10px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              transition: "all 0.15s",
              fontSize: "0.875rem",
              ...(!activeCategory ? activeBtnStyle : inactiveBtnStyle),
            }}
          >
            All Products
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "7px 10px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                transition: "all 0.15s",
                fontSize: "0.875rem",
                ...(activeCategory === cat.id
                  ? activeBtnStyle
                  : inactiveBtnStyle),
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div style={{ marginBottom: "2rem" }}>
        <h4
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: c.textTertiary,
            margin: "0 0 0.875rem",
          }}
        >
          Brand
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {BRANDS.map((brand) => (
            <label
              key={brand}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                padding: "4px 0",
              }}
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => onBrandToggle(brand)}
                style={{
                  accentColor: "#6E54FF",
                  width: "15px",
                  height: "15px",
                  cursor: "pointer",
                }}
              />
              <span
                style={{
                  fontSize: "0.875rem",
                  color: c.textPrimary,
                  fontWeight: 500,
                }}
              >
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div style={{ marginBottom: "2rem" }}>
        <h4
          style={{
            fontSize: "0.75rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: c.textTertiary,
            margin: "0 0 0.875rem",
          }}
        >
          Price Range
        </h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {PRICE_RANGES.map((range, i) => (
            <button
              key={range.label}
              onClick={() => onPriceChange(selectedPrice === i ? null : i)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "7px 10px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                transition: "all 0.15s",
                fontSize: "0.875rem",
                ...(selectedPrice === i ? activeBtnStyle : inactiveBtnStyle),
              }}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [sort, setSort] = useState("newest");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const { c } = useTheme();

  const activeCategory = searchParams.get("category") || "";

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  };

  const handleCategoryChange = (cat: string) => {
    if (cat) setSearchParams({ category: cat });
    else setSearchParams({});
  };

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    if (activeCategory)
      list = list.filter((p) => p.category === activeCategory);
    if (selectedBrands.length)
      list = list.filter((p) => selectedBrands.includes(p.brand));
    if (selectedPrice !== null) {
      const range = PRICE_RANGES[selectedPrice];
      list = list.filter((p) => p.price >= range.min && p.price < range.max);
    }
    switch (sort) {
      case "price-asc":
        list = list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list = list.sort((a, b) => b.price - a.price);
        break;
      case "mon-desc":
        list = list.sort((a, b) => b.monEarnRate - a.monEarnRate);
        break;
      case "rating":
        list = list.sort((a, b) => b.rating - a.rating);
        break;
    }
    return list;
  }, [activeCategory, selectedBrands, selectedPrice, sort]);

  const hasFilters =
    selectedBrands.length > 0 || selectedPrice !== null || !!activeCategory;

  return (
    <main
      style={{ paddingTop: "64px", background: c.pageBg, minHeight: "100vh" }}
    >
      <div className="container-page section-sm">
        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            marginBottom: "1.5rem",
            flexWrap: "wrap",
            gap: "1rem",
          }}
        >
          <div>
            <SectionHeader
              label="Shop"
              title="All Products"
              subtitle={`${filtered.length} items — earn MON on every order`}
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            {hasFilters && (
              <button
                onClick={() => {
                  setSelectedBrands([]);
                  setSelectedPrice(null);
                  setSearchParams({});
                }}
                className="btn-ghost"
                style={{
                  fontSize: "0.8125rem",
                  color: "#DC2626",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                }}
              >
                <X size={13} /> Clear filters
              </button>
            )}
            <button
              className="btn-secondary show-mobile"
              style={{ display: "none" }}
            >
              <SlidersHorizontal size={15} /> Filters
            </button>
            <div style={{ position: "relative" }}>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                style={{
                  appearance: "none",
                  padding: "0.5rem 2.25rem 0.5rem 0.875rem",
                  border: `1.5px solid ${c.border}`,
                  borderRadius: "10px",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: c.textPrimary,
                  background: c.cardBg,
                  cursor: "pointer",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={15}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: c.textSecondary,
                }}
              />
            </div>
          </div>
        </div>

        <div
          style={{ display: "flex", gap: "2.5rem", alignItems: "flex-start" }}
        >
          <div className="filter-sidebar">
            <FilterSidebar
              activeCategory={activeCategory}
              selectedBrands={selectedBrands}
              selectedPrice={selectedPrice}
              onCategoryChange={handleCategoryChange}
              onBrandToggle={toggleBrand}
              onPriceChange={setSelectedPrice}
            />
          </div>

          <div style={{ flex: 1 }}>
            {filtered.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "4rem 0",
                  color: c.textTertiary,
                }}
              >
                <p style={{ fontSize: "1.125rem", fontWeight: 600 }}>
                  No products found
                </p>
                <p style={{ fontSize: "0.875rem" }}>
                  Try adjusting your filters
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
                  gap: "1.25rem",
                }}
              >
                {filtered.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .filter-sidebar { flex-shrink: 0; }
        @media (max-width: 768px) {
          .filter-sidebar { display: none; }
          .show-mobile { display: flex !important; }
        }
      `}</style>
    </main>
  );
}
