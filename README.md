# AdVerse Live

> A lightweight earning platform with a static Next.js front-end and a PHP/MySQL backend.

This repository now supports a **static exported UI** plus a **PHP REST API** backend.
The front-end builds into `web/out/`, while the backend API files are served from `backend/api/`.

---

## What’s inside

- **Daily Quiz Reward** — one question per day, selected from a seeded quiz bank.
- **3-level Referral Team** — invite friends and earn bonus credit.
- **Wallet** — view balance, total earned, pending withdrawals, and transaction history.
- **Friends directory** — browse users by recent activity.
- **Profile** — complete your profile and track XP and streaks.
- **Admin dashboard** — admin-only analytics, user management, and moderation.

---

## Tech stack

| Layer        | Choice                                            |
| ------------ | ------------------------------------------------- |
| Framework    | Next.js 15 (App Router) — built with `output: "export"` |
| Front-end    | Static export from `web/out/`                     |
| API          | PHP REST endpoints in `backend/api/`              |
| Database     | MySQL with schema in `backend/init/schema.sql`    |
| UI           | Tailwind CSS, Zustand, Lucide icons               |
| Hosting      | Hostinger shared hosting or any PHP/MySQL host    |

---

## Quick start (local development)

```bash
cd web
copy .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## Build for deployment

```bash
cd web
npm run build
```

This generates the static site in `web/out/`.

---

## Deployment

1. Configure `backend/api/config.php` with your MySQL credentials.
2. Import `backend/init/schema.sql` into your MySQL database.
3. Upload the contents of `web/out/` to `public_html/`.
4. Upload `backend/api/` to `public_html/backend/api/`.
5. Set `NEXT_PUBLIC_API_BASE=/backend/api` in `web/.env.local` before building.

The seeded admin credentials are:
- **Email:** `admin@example.com`
- **Password:** `Admin1234!`
- **Admin dashboard:** `/admin`

---

## Project layout

```
backend/
├─ api/                  # PHP REST API endpoints
└─ init/schema.sql       # MySQL schema + seed data
web/
├─ out/                  # Static export output after build
├─ src/                  # Next.js source code
├─ .env.example
├─ package.json
├─ next.config.mjs
```

---

## Notes

- The app is static on the front-end but requires PHP and MySQL for backend workflows.
- `backend/api/config.php` must point to a working database and valid DB user.
- If the API is unreachable, login and user data will fail.
- The deploy package includes a static front-end plus PHP backend files.
