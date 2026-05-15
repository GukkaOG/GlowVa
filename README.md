# GlowVa

AI-powered beauty analysis web app. Upload a photo, get a personalized
skincare routine and unlimited chat advice from a beauty AI coach.

A product of SkinRenew LLC (DBA GlowVa).

## Stack

- Next.js 15 (App Router) + React 19
- TypeScript
- Tailwind CSS v4
- Drizzle ORM + Neon Postgres
- JWT cookie auth (jose + bcrypt)

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in DATABASE_URL and AUTH_SECRET
npm run db:push
npm run dev
```

Open http://localhost:3000.

## Environment variables

- `DATABASE_URL` — Neon Postgres connection string
- `AUTH_SECRET` — 32+ char secret (generate with `openssl rand -base64 32`)
- `NEXT_PUBLIC_SITE_URL` — production URL (e.g. `https://glowva.com`)

## Pricing tiers

- Spark — $2.99 / 24h
- Glow — $14.99 / 7 days
- Radiance — $39.99 / 30 days
- Goddess — $69.99 / 30 days, full lab access
