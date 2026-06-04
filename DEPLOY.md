# AdVerse Live — Deployment Guide (PHP + MySQL)

This repo now ships a **static Next.js front-end** plus a **PHP/MySQL REST API** backend.
The front-end is built into `web/out/`, and the backend lives under `backend/api/`.

The recommended Hostinger setup is:
- `public_html/` contains static files from `web/out/`
- `public_html/backend/api/` contains the PHP API files
- `backend/init/schema.sql` is used to create the MySQL schema and seed data

---

## 1. Configure the PHP API

1. Copy `backend/api/config.php` and update it with your database settings.
2. Create the MySQL database and user.
3. Import `backend/init/schema.sql` into the database.

The seeded admin credentials are:
- **Email:** `admin@example.com`
- **Password:** `Admin1234!`
- **Dashboard URL:** `/admin`

This gives you a working admin user immediately after the database is installed.

---

## 2. Configure the front-end environment

In `web/.env.example` the API base is already set to:

```ini
NEXT_PUBLIC_API_BASE=/backend/api
```

Copy this file to `web/.env.local` and set your site URL:

```bash
cd web
copy .env.example .env.local
```

Then open `.env.local` and set:

```ini
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_API_BASE=/backend/api
```

If you host the PHP backend under a different path, update `NEXT_PUBLIC_API_BASE` accordingly.

---

## 3. Build the front-end

```bash
cd web
npm install
npm run build
```

That produces `web/out/`, which is the directory you upload to `public_html/`.

---

## 4. Deploy to Hostinger

### A. Static files

Upload the contents of `web/out/` into `public_html/`.
Make sure `.htaccess` is included: it is already present inside `web/out/`.

### B. PHP API

Upload the `backend/api/` directory to `public_html/backend/api/`.
The API expects requests at `/backend/api/*.php` by default.

### C. SQL schema

Import `backend/init/schema.sql` into your MySQL database once.
This creates the tables, seed data, and the admin test account.

---

## 5. Accessing the site and admin

After deployment:
- Front-end: `https://yourdomain.com`
- Admin dashboard: `https://yourdomain.com/admin`

Use the seeded admin credentials above to test the admin dashboard immediately.

---

## 6. Updating the site later

Whenever you change the UI or front-end code:

```bash
cd web
npm run build
```

Re-upload the updated contents of `web/out/` to `public_html/`.
The backend PHP files only need to be re-uploaded if you change files under `backend/api/`.

---

## 7. Notes

- The front-end is still statically exported, but the app depends on a PHP API for auth, user data, quiz history, wallet, and friends functionality.
- `backend/api/config.php` must be configured with your production database credentials.
- If the PHP API is not reachable, the front-end will not be able to log in or load user data.

---

## 8. Troubleshooting

- **Login fails**: verify `NEXT_PUBLIC_API_BASE` points to the PHP API path and `backend/api/config.php` has valid DB credentials.
- **Admin page denies access**: log in with `admin@example.com` and `Admin1234!`, then open `/admin`.
- **404 errors on refresh**: make sure `.htaccess` is present in `public_html/`.
- **Database errors**: import `backend/init/schema.sql` into MySQL and confirm the `users` table exists.

---

## 9. Deploy archive

A deploy archive is included in the repository root named `adverse-live-deploy.zip`.
It contains the static site output plus the PHP backend files needed for Hostinger deployment.
