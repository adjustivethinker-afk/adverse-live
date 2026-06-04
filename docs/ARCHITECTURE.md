# Architecture

AdVerse Live is a modular monorepo that runs entirely on free-tier services in production.

## Topology

```
                      ┌─────────────────────────────────────┐
                      │           Edge / Vercel             │
                      │   Next.js 15 App Router · ISR/PPR   │
                      └─────────────────┬───────────────────┘
                                        │ HTTPS · WSS
                                        ▼
                      ┌─────────────────────────────────────┐
                      │       NestJS API (Render/Fly)       │
                      │   REST  · Socket.IO · WebRTC sig    │
                      └────┬───────────────┬──────────┬─────┘
                           │               │          │
                           ▼               ▼          ▼
                  ┌──────────────┐  ┌────────────┐  ┌──────────────┐
                  │ Postgres     │  │ Redis      │  │ Cloudinary   │
                  │ (Neon)       │  │ (Upstash)  │  │ (CDN/storage)│
                  └──────────────┘  └────────────┘  └──────────────┘

                                   ┌────────────────────┐
                                   │  Metered TURN/STUN │
                                   │  WebRTC P2P voice  │
                                   └────────────────────┘
```

## Frontend (`/web`)

- **Framework** — Next.js 15 App Router (RSC + streaming).
- **Styling** — Tailwind 3 with a custom token system (midnight, glass, aurora gradients).
- **State** — Zustand for client-side state, React Server Components for data.
- **Realtime** — `socket.io-client` connection to `/realtime` namespace.
- **Charts** — Recharts (lightweight, accessible).
- **Forms** — `react-hook-form` + `zod`.
- **Toasts** — Sonner.
- **Confetti** — `canvas-confetti`.

### Route map

| Route | Purpose |
|-------|---------|
| `/` | Landing |
| `/login`, `/signup`, `/otp`, `/forgot-password`, `/two-factor` | Auth |
| `/welcome` | Onboarding + welcome bonus |
| `/dashboard` | User home |
| `/ads` | Reward ad watcher |
| `/team` | 3-level referral network |
| `/wallet`, `/deposit`, `/withdraw` | Money |
| `/voice-rooms`, `/voice-rooms/[id]` | Live audio |
| `/missions` | Gamification |
| `/community` | Feed + posts |
| `/notifications` | Inbox |
| `/profile`, `/security`, `/settings`, `/analytics` | User account |
| `/admin/*` | Admin panel (role-gated) |

## Backend (`/api`)

NestJS modules:

- **AuthModule** — signup, login, refresh, OTP, 2FA (TOTP), JWT + refresh sessions, OAuth (Google · Apple · Facebook).
- **UsersModule** — profiles, leaderboard, follows.
- **WalletModule** — atomic post() helper with `$transaction` for safe credit/debit. Stats (today / week / month).
- **AdsModule** — list available ads, start/complete watch, anti-fraud scoring, daily caps. Pays referral commissions on success.
- **ReferralsModule** — 3-level chain creation on signup, automatic L1/L2/L3 commission payouts via wallet service.
- **VoiceRoomsModule** — create / join / leave / message / gift / end. Hashed room passwords. Integrates with realtime gateway.
- **DepositsModule** — manual review queue, receipt upload, audit trail.
- **WithdrawalsModule** — pending hold (`pending` column) → admin pay out → completion.
- **NotificationsModule** — in-app store + push fan-out helper.
- **MissionsModule** — daily/weekly/one-time goals with claim flow.
- **CommunityModule** — posts / comments / likes.
- **AdminModule** — overview metrics, user management, fraud queue, deposit/withdrawal moderation. Role-gated via `RolesGuard`.
- **RealtimeModule** — Socket.IO gateway with namespaces:
  - `user:{id}` — personal events
  - `room:{roomId}` — room presence, chat, gifts, reactions
  - WebRTC signaling: `voice:offer`, `voice:answer`, `voice:ice-candidate`

### Money invariants

- All wallet movements happen inside `prisma.$transaction`.
- Every transaction emits a `Transaction` record with `balanceAfter` (immutable ledger).
- Withdrawal requests **hold** the balance (move into `pending`) immediately.
- Rejection refunds the held balance atomically.
- All `Decimal(18,2)` for ledgering precision.

### Fraud detection

- `AdWatch.fraudScore` computed from watch duration vs expected.
- `FraudSignal` table accumulates device-fingerprint duplicates, IP clusters, geo-hopping, abnormal rates.
- High-severity unresolved signals surface in admin dashboard automatically.

### Realtime

```ts
// Server-side helpers from RealtimeGateway
realtime.pushNotification(userId, payload);
realtime.pushWallet(userId, payload);
realtime.pushRoom(roomId, "room:gift", payload);
```

## Voice infrastructure

For free tiers we recommend **mesh/peer-to-peer WebRTC** for rooms ≤ 8 speakers (the default `maxSpeakers`). The Nest gateway only does signaling; actual audio is browser-to-browser through STUN/TURN. For larger rooms, swap in a free SFU like **Janus** or commercial **LiveKit** later — the data model already includes `rtcRoomId`.

## Scaling path

- Move SFU off-cluster (LiveKit cloud, Mediasoup) for >50 listener rooms.
- Add Redis adapter to Socket.IO for horizontal scale.
- Use BullMQ for withdrawal batching, fraud scoring, push fan-out.
- Add CDN cache (Cloudflare) in front of `/api/v1/voice-rooms` (cache 10s).
