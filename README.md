# AdVerse Live

> A simple, lightweight earning platform for Pakistan.

**Static-only Next.js + Firebase** — the entire app builds to plain
HTML/CSS/JS that you can drop into Hostinger's `public_html` (or any
shared hosting). No Node.js server, no database server, no cron jobs.

---

## What's inside

- **Daily Quiz Reward** — one Roman Urdu question per day across Islamic,
  Pakistan, general knowledge and adab categories. PKR 30 reward for
  every correct answer; next try in 24 hours.
- **3-level Referral Team** — invite friends and earn L1/L2/L3
  commissions on their activity.
- **Wallet** — balance, total earned, transactions, deposits and
  withdrawals.
- **Friends directory** — browse Pakistani users with online presence
  driven by last-active heartbeats.
- **1-on-1 chat** — realtime messaging over Firebase Firestore.
- **Profile** — XP-based levels (New Member → Star User → Legend) and
  streaks.
- **Admin panel** — users, deposits, withdrawals, fraud, analytics.

UI is in English. The daily quiz questions and explanations stay in
Roman Urdu, since that's the way Pakistani users naturally play them.

---

## Tech stack

| Layer        | Choice                                            |
| ------------ | ------------------------------------------------- |
| Framework    | Next.js 15 (App Router) — built with `output: "export"` |
| Auth         | Firebase Auth (Email/Password + Google)           |
| Database     | Firebase Firestore (free Spark plan)              |
| UI           | Tailwind CSS, Framer Motion, Lucide icons         |
| State        | Zustand                                           |
| Hosting      | Hostinger shared hosting (`public_html`)          |

The whole site is static HTML/CSS/JS in `web/out/` after `npm run build`.

---

## Quick start (local development)

```bash
cd web
cp .env.example .env.local
# Fill NEXT_PUBLIC_FIREBASE_* keys (see DEPLOY.md §1)

npm install
npm run dev          # http://localhost:3000
```

## Build for deployment

```bash
cd web
npm run build        # produces web/out/ — upload to public_html
```

See [`DEPLOY.md`](./DEPLOY.md) for the step-by-step Hostinger guide.

---

## Project layout

```
web/
├─ src/
│  ├─ app/                # Next.js App Router pages (all client components)
│  ├─ components/         # UI components (glass cards, buttons, etc.)
│  └─ lib/
│     ├─ firebase.ts      # Firebase init helpers
│     ├─ firebase-db.ts   # Auth + Firestore data layer
│     └─ store.ts         # Zustand store wired to Firebase Auth
├─ firestore.rules        # Firestore security rules (paste into console)
├─ next.config.mjs        # output: "export"
├─ .env.example
└─ package.json
DEPLOY.md                 # Hostinger deployment walkthrough
```
