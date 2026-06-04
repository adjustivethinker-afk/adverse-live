# AdVerse Live API

NestJS + Prisma + PostgreSQL + Redis + Socket.IO.

## Run

```bash
cp .env.example .env
npm install
npx prisma generate
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

API runs on `http://localhost:4000/api/v1`. Swagger UI on `/api/docs`.

## Modules

- `auth` — signup, login, refresh, JWT, OAuth ready, 2FA fields
- `users` — me, leaderboard, public profile
- `wallet` — balance, atomic ledger, stats, transactions
- `ads` — list/start/complete with anti-fraud + cap, history
- `referrals` — 3-level chain, commissions, tree, top
- `voice-rooms` — list, create, join, leave, message, gift, end
- `deposits` — request + admin approve/reject
- `withdrawals` — request (with hold) + admin complete/reject
- `notifications` — list, mark read, push helper
- `missions` — active, claim
- `community` — feed, post, comment, like
- `admin` — overview, user mgmt, fraud, payment moderation
- `realtime` — Socket.IO gateway with WebRTC signaling

## Money invariants

Every credit/debit goes through `WalletService.post()` inside `prisma.$transaction`, so balances and the ledger never drift.

## See also

- `../docs/API.md` — complete REST + WS reference
- `../docs/DATABASE.md` — schema + ERD
- `../docs/SECURITY.md` — auth, fraud, audit
