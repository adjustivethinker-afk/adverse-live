# AdVerse Live — Free-Tier Deployment Guide

Yeh guide aap ko **bilkul zero rupay** par poori app worldwide live karne ke
liye step-by-step le ke jaayega. Sab services free tier par hain — credit
card sirf ek service (Render) maange ga aur charge nahi hoga jab tak aap
khud upgrade na karein.

---

## Architecture

```
┌──────────────┐   HTTPS    ┌──────────────────┐
│  Vercel      │ ─────────▶ │  Render          │
│  (Frontend   │            │  (NestJS API)    │
│   Next.js)   │ ◀─ WSS ──▶ │  + Socket.IO     │
└──────────────┘            └─────────┬────────┘
                                      │
                ┌─────────────────────┼──────────────────────┐
                ▼                     ▼                      ▼
          ┌──────────┐          ┌──────────┐          ┌──────────────┐
          │  Neon    │          │ Upstash  │          │  Cloudinary  │
          │ Postgres │          │  Redis   │          │   (images)   │
          └──────────┘          └──────────┘          └──────────────┘
                                      │
                                      ▼
                              ┌──────────────┐    ┌─────────────┐
                              │   Resend     │    │  Metered    │
                              │   (email)    │    │  TURN/STUN  │
                              └──────────────┘    └─────────────┘
```

| Layer       | Service       | Free Tier Limit                          | Pakistan Latency |
| ----------- | ------------- | ---------------------------------------- | ---------------- |
| Frontend    | **Vercel**    | 100 GB bandwidth/mo, unlimited builds    | Excellent (CDN)  |
| Backend     | **Render**    | 512 MB RAM, 750 hr/mo (always-on free)   | Good (Singapore) |
| Database    | **Neon**      | 0.5 GB storage, branching, unlimited rows| Good (Singapore) |
| Cache       | **Upstash**   | 10K commands/day, 256 MB                 | Excellent (global)|
| Storage     | **Cloudinary**| 25 GB storage, 25 GB bandwidth/mo        | Excellent (CDN)  |
| Email       | **Resend**    | 3,000 emails/mo, 100/day                 | n/a              |
| Push        | **Firebase**  | Unlimited (free)                         | n/a              |
| TURN/STUN   | **Metered**   | 50 GB/mo                                 | Good             |

---

## Phase 1 — Sign up for free accounts (~15 minutes)

Aap ko sirf **email** ki zaroorat hai. Order yeh rakhein:

1. **GitHub** — https://github.com/signup
   (Repo push karne ke liye, aur Vercel/Render dono ko GitHub se connect karna hoga.)

2. **Neon (Postgres database)** — https://neon.tech
   - Sign in with GitHub
   - "Create project" → name: `adverse-live`, region: **Singapore**
   - Dashboard → "Connection string" → copy the **Pooled connection** URL
   - Yeh aap ka `DATABASE_URL` hai (sslmode=require add karein agar nahi hai)

3. **Upstash (Redis)** — https://upstash.com
   - Sign in with GitHub
   - "Create Database" → name: `adverse-redis`, type: **Regional**, region: **AP-Southeast** (Singapore)
   - Dashboard → "Connect" → copy the **TLS** connection URL (`rediss://`)
   - Yeh aap ka `REDIS_URL` hai

4. **Cloudinary (file storage)** — https://cloudinary.com/users/register_free
   - Verify email
   - Dashboard → copy **Cloud name**, **API Key**, **API Secret**

5. **Resend (transactional email)** — https://resend.com/signup
   - Verify email
   - "API Keys" → "Create API Key" → copy
   - Production ke liye apna domain verify karna hoga (DNS records)
   - Test ke liye `onboarding@resend.dev` from address use kar sakte hain

6. **Render** — https://render.com (credit card optional, free plan kaafi hai)
   - Sign in with GitHub

7. **Vercel** — https://vercel.com/signup
   - Sign in with GitHub

8. **Metered (TURN server)** — https://www.metered.ca/stun-turn (sirf agar voice rooms public network par chahiye)
   - Sign up free → "Subuser" create karein → copy TURN URL/user/pass

---

## Phase 2 — Push code to GitHub (5 minutes)

```bash
cd "c:/Users/Stop Here/Desktop/game"
git init
git add .
git commit -m "Initial commit — AdVerse Live"
git branch -M main

# GitHub par naya repo banayein (https://github.com/new) — name: adverse-live
# Phir:
git remote add origin https://github.com/<YOUR-USERNAME>/adverse-live.git
git push -u origin main
```

> **Tip:** `.gitignore` already covers `.env`, `node_modules`, `.next`, `dist`. So secrets safe rahenge.

---

## Phase 3 — Deploy backend on Render (10 minutes)

Hum ne aap ke liye `render.yaml` blueprint already commit kar diya hai.

1. Open https://dashboard.render.com → **New +** → **Blueprint**
2. Connect your `adverse-live` GitHub repo
3. Render `render.yaml` parhega aur `adverse-api` service auto-create karega
4. Click **Apply** — pehla deploy ~5 minute lega

### Environment variables Render dashboard mein set karein

`adverse-api` → Environment tab → in keys ko fill karein:

| Key                  | Value                                                  |
| -------------------- | ------------------------------------------------------ |
| `APP_URL`            | `https://adverse-live.vercel.app` (Phase 4 ke baad final URL) |
| `CORS_ORIGINS`       | Same as APP_URL                                        |
| `DATABASE_URL`       | Neon pooled URL (Phase 1, step 2)                      |
| `REDIS_URL`          | Upstash rediss:// URL (Phase 1, step 3)                |
| `CLOUDINARY_*`       | (Phase 1, step 4)                                      |
| `SMTP_HOST`          | `smtp.resend.com`                                      |
| `SMTP_USER`          | `resend`                                               |
| `SMTP_PASS`          | Resend API key (Phase 1, step 5)                       |
| `MAIL_FROM`          | `AdVerse Live <onboarding@resend.dev>` (or your domain)|
| `TURN_USER`/`TURN_PASS` | Metered creds (Phase 1, step 8)                     |

`JWT_*` secrets Render khud generate kar lega.

### Pehli baar database migrate karein

Render web shell par (service ka **Shell** tab):
```bash
npx prisma migrate deploy
npm run prisma:seed   # admin user + sample quiz questions
```

### Verify

- Render apne aap ek URL deta hai jaise `https://adverse-api.onrender.com`
- Browser mein kholein: `https://adverse-api.onrender.com/health` — should return `{"status":"ok",...}`
- `https://adverse-api.onrender.com/api/v1/auth/me` should return 401 (means routes wired up)

---

## Phase 4 — Deploy frontend on Vercel (5 minutes)

1. Open https://vercel.com/new
2. Import the `adverse-live` GitHub repo
3. **Important — Root Directory:** click **Edit** → set to `web`
4. **Framework Preset:** Next.js (auto-detected)
5. **Build Command:** `npm run build` (default)
6. **Environment Variables** — add these:

   | Key                       | Value                                                  |
   | ------------------------- | ------------------------------------------------------ |
   | `NEXT_PUBLIC_SITE_URL`    | `https://adverse-live.vercel.app` (or your custom domain) |
   | `NEXT_PUBLIC_API_URL`     | `https://adverse-api.onrender.com/api/v1`              |
   | `NEXT_PUBLIC_REALTIME_URL`| `wss://adverse-api.onrender.com/realtime`              |

7. Click **Deploy**. ~2-3 minute mein live ho jayega.

### Update CORS on Render

Vercel ne aap ko ek URL diya (e.g. `https://adverse-live-abc123.vercel.app`).
Wapas Render dashboard mein jayein:
- `APP_URL` aur `CORS_ORIGINS` ko us URL se update karein
- Service auto-redeploy ho jayegi

---

## Phase 5 — Custom domain (optional, free with Cloudflare)

1. Domain khareedein (Pakistan se: PKNIC `.pk` Rs. 3000/yr, ya Namecheap `.live` ~$2/yr)
2. Cloudflare par add karein (free) — DNS lo
3. Vercel project → **Domains** → `adverse.live` add karein → Vercel DNS records bata dega — Cloudflare mein paste karein
4. Render API ke liye subdomain: `api.adverse.live` → Render → Custom domains → CNAME instructions
5. `NEXT_PUBLIC_*` aur `CORS_ORIGINS` ko naye domains se update karein

---

## Phase 6 — Post-deploy checklist

- [ ] `/health` returns 200 on Render
- [ ] `/ready` returns `{db: "up"}` (proves Neon connection works)
- [ ] Vercel home page renders without console errors
- [ ] Signup → Login → Quiz → Voice room → Chat all work end-to-end
- [ ] Admin login works at `/admin` (default seeded admin: `admin@adverse.live` / password from seed.ts)
- [ ] **Change the admin password** immediately after first login
- [ ] Resend domain verification done (else emails go to spam)
- [ ] Cloudflare proxy ON for both domains (DDoS protection free)
- [ ] Render keep-alive (free plan sleeps after 15 min) — use **UptimeRobot** (free) to ping `/health` every 5 min

---

## Troubleshooting

| Issue | Fix |
| ----- | --- |
| Vercel build fails on TypeScript error | `npm run build` locally first; we already fixed all known errors |
| Render says "Application failed to respond" | Check that you bind to `0.0.0.0` and `process.env.PORT` (already done in `main.ts`) |
| Frontend gets CORS error | `CORS_ORIGINS` on Render must match Vercel URL **exactly** (no trailing slash) |
| Prisma migration fails | Make sure Neon pooled URL ends with `?sslmode=require&pgbouncer=true` |
| Voice room peer fails to connect | Set `TURN_*` env vars (free Metered subuser) |
| Render free plan goes to sleep | UptimeRobot ping every 5 minutes keeps it warm |

---

## What I need from you (when ready)

Aap ke paas yeh detail aa jayein to mujhe bata dein, main directly env vars
aur deploy commands run kar dunga:

1. ✅ **GitHub username** — repo push karne ke liye
2. ✅ **Neon DATABASE_URL** — Phase 1 step 2 ke baad
3. ✅ **Upstash REDIS_URL** — Phase 1 step 3 ke baad
4. ✅ **Cloudinary cloud name + API key + secret** — Phase 1 step 4
5. ✅ **Resend API key** — Phase 1 step 5
6. ⏳ **Custom domain** (optional) — agar `.live` ya `.pk` lena chahein

Ya phir **aap khud step-by-step follow karein** — har step screenshot le ke
mujhe bhej dein, main har jagah real-time guide karoonga.
