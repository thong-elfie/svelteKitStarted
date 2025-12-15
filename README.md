# SvelteKit E-commerce Platform

Production-ready e-commerce platform built with SvelteKit, featuring a public storefront and admin dashboard.

## Features

- **Public Storefront** (SSR for SEO)
  - Product listing and detail pages
  - Shopping cart
  - Checkout flow
  
- **Admin Dashboard** (CSR)
  - Order management
  - Product management
  - Analytics dashboard

- **Authentication**
  - Email/password login
  - Cookie-based sessions (httpOnly, secure)
  - Role-based access control (USER, ADMIN)

- **Payment Integration**
  - Abstracted payment provider layer
  - Support for Stripe and VNPay
  - Webhook handling with signature verification

## Tech Stack

- **Framework**: SvelteKit (latest)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Cookie-based sessions
- **Payment**: Stripe / VNPay (configurable)
- **Deployment**: Node adapter

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   └── layout/          # Layout components (Header, Footer, Sidebar)
│   ├── server/              # Server-side business logic
│   │   ├── auth/            # Authentication & session management
│   │   ├── order/           # Order processing
│   │   ├── payment/         # Payment provider abstraction
│   │   └── product/         # Product management
│   ├── stores/              # Svelte stores (cart, etc.)
│   ├── utils/               # Utility functions
│   └── types/               # TypeScript type definitions
├── routes/
│   ├── (store)/             # Public storefront (SSR)
│   ├── (admin)/             # Admin dashboard (CSR)
│   ├── auth/                # Authentication pages
│   └── api/                 # API endpoints
├── hooks.server.ts          # Global request hooks
└── app.html                 # HTML template
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- pnpm (recommended) or npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```

4. Update environment variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `SESSION_SECRET`: Random 32+ character string
   - `PAYMENT_PROVIDER`: "stripe" or "vnpay"
   - Payment provider credentials

5. Generate Prisma client and push schema:
   ```bash
   pnpm db:generate
   pnpm db:push
   ```

6. Start development server:
   ```bash
   pnpm dev
   ```

## Architecture Decisions

### Route Groups

- **(store)**: Public-facing pages with SSR enabled for SEO
- **(admin)**: Admin dashboard with SSR disabled (CSR only)

### Authentication Flow

1. User submits login form
2. Server validates credentials with bcrypt
3. Session created in database
4. httpOnly cookie set with session ID
5. `hooks.server.ts` loads user on every request
6. Admin routes protected via `+layout.server.ts`

### Payment Flow

1. User creates order (status: PENDING)
2. Payment intent created via abstracted provider
3. User redirected to payment gateway
4. Payment gateway sends webhook
5. Webhook verified and order status updated
6. Stock decremented on successful payment

### Server Logic Organization

All business logic lives in `lib/server/*`:
- **Thin controllers**: API routes delegate to service functions
- **Service layer**: Handles business logic and validation
- **Database layer**: Prisma client singleton

This structure makes it easy to migrate to NestJS later by moving service functions to NestJS providers.

## API Endpoints

- `POST /api/auth/login` - Authenticate user
- `POST /api/orders/create` - Create new order
- `POST /api/payments/create` - Create payment intent
- `POST /api/payments/webhook` - Handle payment webhooks

## Database Schema

- **User**: Authentication and user data
- **Session**: Database-backed sessions
- **Product**: Product catalog
- **Order**: Customer orders
- **OrderItem**: Order line items
- **Payment**: Payment tracking

## Deployment

Build for production:
```bash
pnpm build
```

Start production server:
```bash
node build
```

## Migration to NestJS

The codebase is structured for easy backend migration:

1. Move `lib/server/*` services to NestJS providers
2. Replace SvelteKit API routes with NestJS controllers
3. Keep SvelteKit for frontend rendering
4. Use NestJS as API backend

## License

MIT
