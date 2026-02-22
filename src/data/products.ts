export interface Product {
  id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  brand: string;
  monEarnRate: number; // MON per ₹100 spent
  description: string;
  tags: string[];
  stock: number;
  rating: number;
  reviewCount: number;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

export const CATEGORIES: Category[] = [
  {
    id: "sneakers",
    name: "Sneakers",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80",
    productCount: 24,
  },
  {
    id: "apparel",
    name: "Apparel",
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80",
    productCount: 38,
  },
  {
    id: "accessories",
    name: "Accessories",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    productCount: 19,
  },
  {
    id: "bags",
    name: "Bags",
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    productCount: 15,
  },
  {
    id: "watches",
    name: "Watches",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80",
    productCount: 12,
  },
  {
    id: "tech",
    name: "Tech",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80",
    productCount: 21,
  },
];

export const PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Air Motion Pro",
    price: 12999,
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80",
    ],
    category: "sneakers",
    brand: "Nike",
    monEarnRate: 0.5,
    description:
      "Experience unparalleled comfort with the Air Motion Pro. Engineered with our next-gen cushioning system for runners who demand more. Breathable mesh upper meets responsive foam midsole.",
    tags: ["running", "comfort", "performance"],
    stock: 24,
    rating: 4.8,
    reviewCount: 312,
    featured: true,
  },
  {
    id: "2",
    name: "UltraBoost Strike",
    price: 14500,
    images: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80",
    ],
    category: "sneakers",
    brand: "Adidas",
    monEarnRate: 0.6,
    description:
      "The UltraBoost Strike combines our legendary BOOST midsole with a Primeknit upper for a sock-like fit that moves with you. Maximum energy return, every step.",
    tags: ["boost", "lifestyle", "comfortable"],
    stock: 18,
    rating: 4.7,
    reviewCount: 289,
    featured: true,
  },
  {
    id: "3",
    name: "Classic Leather Club",
    price: 8999,
    images: [
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&q=80",
      "https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=800&q=80",
    ],
    category: "sneakers",
    brand: "Puma",
    monEarnRate: 0.4,
    description:
      "A timeless silhouette reborn. The Classic Leather Club features premium full-grain leather and a cupsole construction that gets better with age.",
    tags: ["classic", "leather", "lifestyle"],
    stock: 42,
    rating: 4.5,
    reviewCount: 178,
    featured: true,
  },
  {
    id: "4",
    name: "Essential Crew Tee",
    price: 2499,
    images: [
      "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    ],
    category: "apparel",
    brand: "Nike",
    monEarnRate: 0.4,
    description:
      "Cut from 100% organic cotton. The Essential Crew Tee is built for everyday wear — clean lines, precise fit, and a weight that breathes in any climate.",
    tags: ["casual", "cotton", "everyday"],
    stock: 120,
    rating: 4.6,
    reviewCount: 534,
    featured: true,
  },
  {
    id: "5",
    name: "Phantom Duffel",
    price: 6999,
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80",
    ],
    category: "bags",
    brand: "Adidas",
    monEarnRate: 0.45,
    description:
      "Built for the serious athlete. The Phantom Duffel features a divided main compartment, ventilated shoe bay, and water-resistant exterior.",
    tags: ["bags", "gym", "sport"],
    stock: 36,
    rating: 4.7,
    reviewCount: 203,
    featured: true,
  },
  {
    id: "6",
    name: "Precision Chronograph",
    price: 42000,
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80",
    ],
    category: "watches",
    brand: "Fossil",
    monEarnRate: 0.8,
    description:
      "Swiss precision meets modern design. The Precision Chronograph features a 42mm stainless steel case, sapphire crystal, and 100m water resistance.",
    tags: ["luxury", "watch", "chronograph"],
    stock: 8,
    rating: 4.9,
    reviewCount: 86,
  },
  {
    id: "7",
    name: "Trail Runner X",
    price: 9499,
    images: [
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80",
      "https://images.unsplash.com/photo-1508400487153-e5e66c1ebb28?w=800&q=80",
    ],
    category: "sneakers",
    brand: "Nike",
    monEarnRate: 0.5,
    description:
      "Conquer any terrain. The Trail Runner X pairs aggressive lugs with a protective rock plate and a breathable upper built to handle muddy, wet conditions.",
    tags: ["trail", "outdoor", "performance"],
    stock: 29,
    rating: 4.6,
    reviewCount: 145,
  },
  {
    id: "8",
    name: "Studio Flow Hoodie",
    price: 5499,
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=80",
      "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80",
    ],
    category: "apparel",
    brand: "Puma",
    monEarnRate: 0.4,
    description:
      "Designed for movement, worn beyond the studio. French terry construction with a relaxed cut and hidden hand warmers.",
    tags: ["hoodie", "casual", "athleisure"],
    stock: 67,
    rating: 4.5,
    reviewCount: 267,
    featured: true,
  },
  {
    id: "9",
    name: "Pro Elite Sunglasses",
    price: 7999,
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80",
      "https://images.unsplash.com/photo-1508296467595-2c84f3e7b1c6?w=800&q=80",
    ],
    category: "accessories",
    brand: "Nike",
    monEarnRate: 0.5,
    description:
      "Sport-performance meets street style. UV400 lenses with polarized coating, flexible rubber temples, and a durable nylon frame.",
    tags: ["sunglasses", "sport", "uv protection"],
    stock: 54,
    rating: 4.4,
    reviewCount: 98,
  },
  {
    id: "10",
    name: "Slim Fit Tech Jogger",
    price: 3799,
    images: [
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&q=80",
      "https://images.unsplash.com/photo-1589310243389-96a5483213a8?w=800&q=80",
    ],
    category: "apparel",
    brand: "Adidas",
    monEarnRate: 0.4,
    description:
      "Performance fabric meets everyday aesthetic. 4-way stretch, moisture-wicking finish, and a modern tapered cut designed to move with you.",
    tags: ["jogger", "athleisure", "stretch"],
    stock: 88,
    rating: 4.7,
    reviewCount: 412,
  },
  {
    id: "11",
    name: "Wireless Studio Headphones",
    price: 18999,
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80",
    ],
    category: "tech",
    brand: "Sony",
    monEarnRate: 0.7,
    description:
      "Industry-leading noise cancellation meets exceptional sound. 30-hour battery life, quick charge, and foldable design for the commuter who demands studio-quality audio.",
    tags: ["headphones", "noise cancelling", "wireless"],
    stock: 22,
    rating: 4.8,
    reviewCount: 756,
    featured: true,
  },
  {
    id: "12",
    name: "Leather Bifold Wallet",
    price: 2999,
    images: [
      "https://images.unsplash.com/photo-1553532434-5ab5b6b84993?w=800&q=80",
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80",
    ],
    category: "accessories",
    brand: "Fossil",
    monEarnRate: 0.35,
    description:
      "Full-grain leather with RFID-blocking lining. Slim profile with 8 card slots and a secure bill compartment that fits in any pocket.",
    tags: ["wallet", "leather", "rfid"],
    stock: 73,
    rating: 4.6,
    reviewCount: 321,
  },
];

export const getMONEarned = (price: number) => {
  const REWARD_ALLOCATION = 0.01;
  const CONVERSION_RATE = 1.83;
  return (price * REWARD_ALLOCATION) / CONVERSION_RATE;
};

export const getFeaturedProducts = () => PRODUCTS.filter((p) => p.featured);

export const getProductsByCategory = (category: string) =>
  PRODUCTS.filter((p) => p.category === category);

export const getProductById = (id: string) => PRODUCTS.find((p) => p.id === id);
