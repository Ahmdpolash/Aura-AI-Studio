<h1 align="center">✨ Luma Studio — AI Image Processing & Transformation Suite</h1>

<p align="center">
  A production-grade AI-powered image editing platform built with <strong>Next.js 16</strong>, <strong>NextAuth.js</strong>, <strong>Prisma ORM</strong>, <strong>Neon PostgreSQL</strong>, <strong>ImageKit AI Transformations</strong>, and <strong>Stripe Billing</strong>.
</p>

---

## 🚀 Key Features

- **🪄 AI Background Removal**: Instant subject isolation with edge detection and hair transparency (`e-bgremove` & `e-removedotbg`).
- **🌄 AI Background Replacer**: Synthesize custom realistic backgrounds using text prompts (`e-changebg`).
- **⚡ AI Super-Resolution Upscaling**: 2x resolution upscaling with high-frequency micro-texture enhancement (`e-upscale` & `e-retouch`).
- **✍️ Watermark & Typography Overlay**: Real-time customizable text and branding watermarks with custom fonts, colors, and positioning.
- **🎛️ Interactive Split Comparison Canvas**: Real-time draggable before-and-after comparison slider to inspect fine edge details.
- **🔐 Google OAuth Authentication**: Effortless sign-in and session management via NextAuth.js.
- **📊 Usage Quotas & Limiting**: 3 free uploads/transformations for new users, automatically tracked in PostgreSQL.
- **💳 Stripe Subscription Integration**: Pro upgrade flow ($19/mo) with webhook-driven unlimited credit provisioning.
- **📂 Cloud Image Delivery**: Client-side signed direct uploads to ImageKit with global CDN delivery.

---

## 🛠️ Architecture & Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **Database & ORM**: PostgreSQL (Neon Serverless) + Prisma ORM
- **Authentication**: NextAuth.js (Google OAuth Provider)
- **Image Pipeline**: ImageKit Next.js SDK & Real-time Transformation Engine
- **Payments**: Stripe Checkout & Webhooks
- **Styling**: Tailwind CSS v4, Lucide Icons, Radix UI Primitives

---

## ⚙️ Environment Variables

Create a `.env` file with the following variables:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@endpoint.neon.tech/neondb?sslmode=require"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# ImageKit
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="public_..."
IMAGEKIT_PRIVATE_KEY="private_..."

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_PRICE_ID="price_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

---

## 🏃 Getting Started

1. **Install dependencies:**
   ```bash
   bun install
   # or npm install
   ```

2. **Sync database schema:**
   ```bash
   bun x prisma db push
   ```

3. **Start development server:**
   ```bash
   bun run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the landing page, or visit [http://localhost:3000/playground](http://localhost:3000/playground) to access the studio.
