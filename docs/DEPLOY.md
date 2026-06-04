# Deployment (free tier friendly)

## Topology

| Layer | Provider | Why |
|--|--|--|
| Frontend | **Vercel Hobby** | Free, automatic deploys, edge runtime, ISR/PPR |
| Backend | **Render Free** or **Fly.io** | Free Node container; Render auto-sleeps but easy to wake |
| Database | **Neon Postgres** | 500 MB free, branching, serverless |
| Redis | **Upstash** | 10k commands/day, REST + native protocol |
| Storage | **Cloudinary** | 25 credits/month, image transforms |
| Email | **Resend** or **Brevo** | 100/day or 300/day free |
| Push | **Firebase Cloud Messaging** | Unlimited, free |
| TURN/STUN | **Metered.live** | 50 GB/month free |
| Domain | **Cloudflare DNS** | Free DNS + DDoS |

## Frontend

```bash
# In the repo root
vercel link
vercel env add NEXT_PUBLIC_API_URL          # https://api.adverse.live/api/v1
vercel env add NEXT_PUBLIC_REALTIME_URL     # wss://api.adverse.live/realtime
vercel deploy --prod
```

Vercel auto-builds `web/` because of the Next.js project root.

## Backend

### Render

1. Create a **Web Service** from the `api/` folder.
2. Build command: `npm ci && npm run build && npx prisma migrate deploy`.
3. Start command: `npm run start`.
4. Set env vars from `api/.env.example`.
5. Add **Cron Job** to keep instance warm (every 10 min).

### Fly.io

```bash
cd api
fly launch
fly secrets set $(cat .env | xargs)
fly deploy
```

## Database (Neon)

```bash
# Set DATABASE_URL to the Neon pooled connection
cd api
npx prisma migrate deploy
npx prisma db seed
```

## CI / CD

Suggested GitHub Actions workflow (`.github/workflows/ci.yml`):

```yaml
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: 'npm' }
      - run: npm ci
      - run: npm run build --workspace=web
      - run: cd api && npx prisma generate && npm run build
```

## Domain & TLS

1. Buy domain (Namecheap / Cloudflare Registrar).
2. Add DNS at Cloudflare:
   - `A @  → <vercel ip>` (or Vercel CNAME)
   - `A api → <render/fly ip>`
   - `CNAME www → cname.vercel-dns.com`
3. Enable **Full (Strict)** TLS, **Always Use HTTPS**.

## Realtime + voice

- WebSocket: open one upgrade connection per user; Render and Fly.io support upgrades natively.
- TURN: paste credentials from Metered.live into `TURN_URL`, `TURN_USER`, `TURN_PASS`.
- For >8 listeners per room, swap signaling for an SFU like LiveKit (free dev tier).

## Backups

- Neon offers point-in-time recovery in paid tier; for free, schedule `pg_dump` daily via Render cron to S3-compatible storage.

## Monitoring

- Vercel Analytics (free) for the frontend.
- For backend, add **Better Stack Logs** (free) and **Healthchecks.io** (free) for cron heartbeats.
