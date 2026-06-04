# Security

## Authentication

- **Password storage** — argon2id (memory-hard, side-channel resistant).
- **JWT access tokens** — 15 min, signed with `JWT_ACCESS_SECRET`.
- **Refresh tokens** — opaque (UUID concat), 30 days, stored in `Session` with `revokedAt`.
- **Logout** — revokes the session row.
- **Refresh rotation** — every refresh creates a new session and revokes the old.
- **2FA / TOTP** — optional, RFC 6238 compatible. `User.totpSecret` encrypted at rest.
- **Passkeys (WebAuthn)** — `Passkey` table ready. Add `@simplewebauthn/server` to enable.
- **OAuth** — Google · Apple · Facebook providers, captured in `AuthIdentity`.
- **OTP** — email/SMS codes; for production wire up Resend / Brevo (email) and Twilio (free trial) or Vonage.

## Authorization

- `JwtAuthGuard` on every authenticated route.
- `RolesGuard` enforces `@Roles(Role.ADMIN, Role.SUPER_ADMIN)` for admin endpoints.
- Resource ownership checks live in services (e.g. host can only end their room).

## Rate limiting

- Global throttler: 120 req / 60s / IP.
- Per-route stricter limits should be added to `/auth/login`, `/auth/signup`, `/ads/*` and `/withdrawals` via `@Throttle({ short: { limit: 5, ttl: 60000 } })`.

## Money safety

- Every credit / debit happens inside `prisma.$transaction`.
- Each transaction stores `balanceAfter`, making the ledger reconstructible.
- Withdrawals use a **two-phase** model:
  1. **Hold** (move balance → pending) on request.
  2. **Settle** or **refund** atomically on admin decision.
- Voice gifts atomically debit sender + credit receiver inside one transaction.

## Anti-fraud

`FraudSignal` rows accumulate from:

- `DEVICE_DUP` — same fingerprint across multiple accounts
- `IP_DUP` — same IP cluster
- `RAPID_REFERRAL` — referral burst velocity
- `AD_FRAUD` — watch ratio < threshold or rate > human limit
- `ABNORMAL_RATE` — payment / engagement abuse
- `GEO_HOPPING` — IP location switching too fast

Each signal carries `severity (LOW · MEDIUM · HIGH · CRITICAL)` and a `score`. The `AdsService` integrates a per-watch `fraudScore` that suppresses payouts above 70.

## Audit

- `AuditLog` records all admin actions, money moves, security changes, IP/UA.
- Stored forever (use partitioning + cold storage for retention).

## Encryption

- All connections HTTPS/WSS only.
- TLS termination at platform (Vercel / Render).
- Secrets injected via env vars; never committed.
- `.env.example` documents all required keys.

## Compliance / privacy

- Right-to-erasure: `User.deletedAt` soft-delete + nightly purge job.
- PII (email, phone) is scoped under user-only routes.
- Avatar uploads validated server-side (mime + size).
- KYC stub (`User.kycStatus`) ready for future verification integrations.

## Secrets

| Secret | Purpose |
|--|--|
| `JWT_ACCESS_SECRET` | Access token signing |
| `JWT_REFRESH_SECRET` | Reserved for future server-signed refresh |
| `DATABASE_URL` | Postgres |
| `REDIS_URL` | Redis |
| `CLOUDINARY_*` | Image uploads |
| `SMTP_*` / `MAIL_FROM` | Mail |
| `FIREBASE_SERVER_KEY` | Push |
| `TURN_*` | WebRTC ICE |
| OAuth keys | Social login |

Generate strong secrets:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```
