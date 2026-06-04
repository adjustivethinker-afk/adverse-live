# AdVerse Live

> Earn. Speak. Belong.
> A premium iOS27-inspired earning platform with live voice rooms, 3-level referrals, gamification, and a Flutter-app feel — built for the next decade.

A complete production-ready monorepo:

- **`web/`** — Next.js 15 + TypeScript + Tailwind + Framer Motion + ShadCN-style UI primitives. Liquid glassmorphism, aurora gradients, 120 FPS animations, full dashboard, voice rooms, wallet, admin panel.
- **`api/`** — NestJS 10 + Prisma 6 + PostgreSQL + Redis + Socket.IO + WebRTC signaling. Modular architecture, JWT + refresh tokens, role-based access, anti-fraud, audit logs.
- **`docs/`** — Architecture, API reference, database ERD, design system, deployment.

The platform is built so every service used has a generous **free tier**: Neon / Supabase (PostgreSQL), Upstash (Redis), Cloudinary (storage), Resend or Brevo (email), Firebase Cloud Messaging (push), Metered (TURN/WebRTC), Vercel + Render / Fly.io (hosting).

---

## Quick start

```bash
# Install everything
npm install

# Frontend (http://localhost:3000)
npm run dev

# Backend (http://localhost:4000 · Swagger at /api/docs)
cd api
cp .env.example .env
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

The seed creates a Super Admin (`admin@adverse.live` / `admin12345`), one ad, six missions, and six achievements.

---

## What's inside

### Public site (`/`)
- **Hero** with animated glass cards, mouse-tilted preview dashboard, floating user cards, particles, live counters
- **Features** · 12 cards with gradient orbs and hover physics
- **Earning System** · 6 streams, live "paid out" counter
- **Voice Rooms** · live stage preview with VU meters + speaker requests + chat
- **Referral** · animated SVG network tree
- **How it works** · alternating timeline
- **Stats** · animated counters (signups, rooms, payouts)
- **Testimonials** · marquee of glass cards
- **FAQ** · spring-eased accordion
- **Footer** · liquid border, neon CTA, socials

### Authentication (`/login`, `/signup`, `/otp`, `/forgot-password`, `/two-factor`)
Glass cards with split layout, social login (Google · Apple · Facebook), 6-digit OTP grid with auto-advance, animated 2FA, magic-link recovery.

### Onboarding (`/welcome`)
Confetti, scaling reward gift, glass reward card with `+ ₨ 10` welcome bonus, CTAs to dashboard or voice rooms.

### Dashboard (`/dashboard`)
Full premium dashboard: hero greeting + actions, 4 stat cards with animated counters, 14-day earnings area chart, sources pie, daily progress, recent activity, weekly streak bars, leaderboard with you-highlighted row, live voice rooms list.

### Ads (`/ads`)
Watch timer with progress bar + verifying state + success animation + confetti, reward history list, fraud-detection note, daily cap progress.

### Team / Referral (`/team`)
Hero with referral link + invite code, 4 stats, 14-day growth bars, network activity feed, expandable L1 → L2 user tree.

### Wallet (`/wallet`)
Big balance card with sparkline, 6 mini stats with gradient orbs, tabbed transactions list with status badges and search.

### Deposit (`/deposit`)
Method selection (JazzCash · EasyPaisa · Bank), receipt upload, history with statuses.

### Withdrawal (`/withdraw`)
Method picker, receive-amount calculation, recent withdrawals.

### Voice Rooms (`/voice-rooms`, `/voice-rooms/[id]`)
- **List** with search, category chips, trending/featured badges, speaker avatars, listener counts.
- **Live room** with 6-speaker stage, VU meters, host crown, badges (VIP/Host/Mod), reactions row, gift sender, hand raise, mute, leave; speaker requests panel; live chat with auto-scroll.

### Profile, Notifications, Missions, Community, Security, Settings, Analytics
All polished, all matching the design language.

### Admin Panel (`/admin`)
Separate sidebar (rose accent) + topbar with fraud + pending counters. Pages:
- Super dashboard (revenue, signups, pending approvals, fraud watchlist)
- Users · search, status filter, ban/unban
- Voice rooms · feature, mute, force close
- Deposits · approve/reject with TXN view
- Withdrawals · pay out / hold / reject
- Fraud monitor with risk scoring
- Stubs for Reports, Logs, Moderation, Notifications, Settings, Analytics, Realtime

---

## Architecture

```
┌─────────────────────────┐      ┌─────────────────────────┐
│        web/ (Next 15)   │ ───▶ │     api/ (Nest 10)      │
│  React 19 · Tailwind    │      │  Prisma · PostgreSQL    │
│  Framer · Recharts      │      │  Redis · Socket.IO      │
│  ShadCN-style UI        │ ◀──── WebSocket realtime ───── │
└─────────────────────────┘      │  WebRTC signaling       │
            │                    │  S3-compatible storage  │
            ▼                    └────────────┬────────────┘
        Vercel                                │
                                              ▼
                                      Postgres (Neon)
                                      Redis (Upstash)
                                      Cloudinary
```

See [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) for the full design.

---

## Free-tier service mapping

| Layer | Service | Free Tier |
|-------|---------|-----------|
| DB | **Neon** Postgres | 500 MB, branching |
| Cache / Queue | **Upstash** Redis | 10,000 commands/day |
| Storage | **Cloudinary** | 25 credits/month |
| Email | **Resend** / **Brevo** | 100 / 300 mails/day |
| Push | **Firebase Cloud Messaging** | Unlimited |
| TURN/STUN | **Metered** | 50GB/month |
| Frontend | **Vercel** | Hobby tier |
| Backend | **Render** / **Fly.io** | Free instance |

See `api/.env.example` for env variables.

---

## Design system

- **Colors** — Midnight `#09090F`, Ink `#12131A`, Glass `rgba(255,255,255,0.08)`, Aurora gradient `#00E5FF → #4F46E5 → #8B5CF6`, Premium glow `#7C3AED`, Success `#00D26A`, Warning `#FFC700`, Danger `#FF4D6D`.
- **Type** — SF Pro Display · Inter · Manrope, with Apple-precision letter spacing.
- **Surfaces** — Liquid glass (`backdrop-filter: blur(24px) saturate(180%)`), aurora background, animated noise, floating orbs.
- **Motion** — Framer Motion springs (`stiffness: 220, damping: 22`), liquid easing (`cubic-bezier(0.65,0,0.35,1)`), 120 FPS micro-interactions.
- **Components** — `GlassCard`, `Button`, `Input`, `Badge`, `Avatar`, `StatCard`, `AuroraBackground`, `FloatingOrbs`, `Particles`.

See [`docs/DESIGN.md`](docs/DESIGN.md).

---

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — System design, modules, scaling
- [`docs/API.md`](docs/API.md) — REST + WebSocket reference
- [`docs/DATABASE.md`](docs/DATABASE.md) — Tables, indexes, ERD
- [`docs/DESIGN.md`](docs/DESIGN.md) — Tokens, components, motion
- [`docs/SECURITY.md`](docs/SECURITY.md) — Auth, fraud, compliance
- [`docs/DEPLOY.md`](docs/DEPLOY.md) — Deployment to free tiers

---

## License

MIT.
