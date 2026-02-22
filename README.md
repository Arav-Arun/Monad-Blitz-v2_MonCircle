# MON Loyalty API

A production-ready, multi-tenant loyalty infrastructure for e-commerce platforms.

## Core Features
- **Reward Isolation**: Isolated balances per platform and seller.
- **Flexible Modes**:
  - `SINGLE`: Unified rewards at the platform level.
  - `MULTI`: Isolated reward pools for different sellers.
  - `HYBRID`: Split rewards between platform and seller pools (70/30).
- **Stripe-Level API**: Secure API key authentication and clean REST endpoints.

## Tech Stack
- Node.js & Express
- TypeScript
- Prisma ORM (PostgreSQL)
- JWT-based Auth

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and provide your `DATABASE_URL`.
```bash
cp .env.example .env
```

### 3. Database Migration
```bash
npx prisma migrate dev --name init
```

### 4. Run Development Server
```bash
npm run dev
```

## API Usage Example

### Create a Platform
```bash
POST /v1/platforms
{
  "name": "Stond Emporium",
  "mode": "HYBRID",
  "platformRewardRate": 0.0002
}
```

### Create a Seller (MULTI/HYBRID only)
**Header**: `Authorization: Bearer sk_xxxx`
```bash
POST /v1/sellers
{
  "name": "Nike Official",
  "rewardRate": 0.0005
}
```

### Record an Order
**Header**: `Authorization: Bearer sk_xxxx`
```bash
POST /v1/orders
{
  "platformId": "...",
  "sellerId": "...",
  "userId": "user_123",
  "amount": 5000,
  "orderId": "ord_001"
}
```

### Check Balance
```bash
GET /v1/users/user_123/balance?platformId=...&sellerId=...
```

## License
MIT
