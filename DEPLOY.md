# AdVerse Live — Deployment Guide (Hostinger shared hosting)

The app is now a **fully static site** that runs entirely in the browser
with **Firebase** as its backend. There is **no Node.js server** required.

That means you can upload it to Hostinger's cheapest **shared hosting**
(`public_html`) — exactly like a plain HTML site — and everything works:
signup, login, daily quiz, wallet, friends, chat, profile.

---

## 1. Set up Firebase (free, no credit card)

1. Go to <https://console.firebase.google.com> and create a project. Disable
   Analytics if asked.
2. **Build → Authentication → Get started → Sign-in method**:
   - **Email/Password** → Enable → Save.
   - **Google** → Enable → set the support email → Save.
3. **Build → Firestore Database → Create database** → Start in **production**
   mode → choose `asia-south1` (Mumbai) for best Pakistan latency → Enable.
4. **Project Settings (gear icon) → General → "Your apps" → Web (`</>`)**.
   Register an app called "AdVerse Web" (no hosting checkbox needed).
   Copy the `firebaseConfig` values — these go into your `.env.local`.
5. **Firestore → Rules** — paste the contents of `web/firestore.rules`
   from this repo (the rules enforce per-user writes, one quiz attempt per
   day, and per-conversation chat access).

### Seed the question bank

In Firestore Console **manually create** the following two documents:

#### `settings/platform`

```json
{
  "welcomeBonus": 10,
  "dailyQuizReward": 30,
  "minWithdraw": 200,
  "refRates": { "l1": 0.1, "l2": 0.05, "l3": 0.02 }
}
```

#### `quizQuestions/q1` (and as many as you like)

```json
{
  "category": "ISLAMIC",
  "question": "Roza kis mahine mein farz kiya gaya?",
  "options": ["Rajab", "Shaban", "Ramazan", "Muharram"],
  "correctIndex": 2,
  "explanation": "Quran Pak mein Surah Al-Baqarah mein Ramazan ka zikr hai."
}
```

Add 30+ questions covering ISLAMIC / PAKISTAN / GENERAL / ADAB categories.
The app picks one per user per day deterministically.

---

## 2. Configure local env

```bash
cd web
cp .env.example .env.local
```

Open `.env.local` and paste your Firebase keys:

```ini
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=1:...:web:...
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## 3. Build the static site

```bash
cd web
npm install
npm run build
```

This produces a `web/out/` folder containing the entire site as plain
HTML/CSS/JS. Test it locally:

```bash
npx serve out -p 3000
# open http://localhost:3000
```

---

## 4. Upload to Hostinger `public_html`

The repo ships with a ready-made archive at the project root:
**`adverse-live-public_html.zip`**. It contains every file from
`web/out/` (including the `.htaccess`).

### Option A — Hostinger File Manager (easiest)

1. Log in to **hPanel → Hosting → Manage → File Manager → public_html**.
2. Delete any default `index.html` / placeholder files inside
   `public_html`.
3. Click **Upload Files → Upload archive** and drop
   `adverse-live-public_html.zip`.
4. Right-click the uploaded archive → **Extract** → extract into the
   current directory.
5. Delete the `.zip` after extraction.
6. Make sure **`.htaccess`** is visible (in File Manager → Settings →
   "Show hidden files"). If it's missing, create it manually using the
   contents of `web/public/.htaccess`.

### Option B — FTP (FileZilla)

1. **hPanel → Files → FTP Accounts** → note the host / user / password.
2. In FileZilla, connect to that FTP host.
3. On the right (server) navigate to `/public_html/`.
4. On the left (local) navigate to `web/out/`.
5. Select all files inside `out` (including `.htaccess` — enable
   "View → Show hidden files" if you don't see it) and drag them into
   `public_html`.

---

## 5. .htaccess — clean URLs, HTTPS, caching

A production-ready `.htaccess` is **already inside the build** — it sits
in `web/public/.htaccess` and is automatically copied into `web/out/`
during `npm run build`. After you extract `adverse-live-public_html.zip`
into `public_html`, it's ready to go.

If for any reason `.htaccess` doesn't get extracted (some File Manager
UIs hide dotfiles), create it manually with the contents of
`web/public/.htaccess` from the repo.

---

## 6. Add Firebase authorized domain

In Firebase Console:

1. **Authentication → Settings → Authorized domains → Add domain**.
2. Add `yourdomain.com` (and `www.yourdomain.com` if you use it).

Without this, login/signup will fail with `auth/unauthorized-domain`.

---

## 7. Updating the site later

Whenever you change code:

```bash
cd web
npm run build
```

Then re-upload the contents of `web/out/` over the existing files in
`public_html`. The `.htaccess` you created earlier doesn't need to be
re-uploaded.

---

## 8. What's where

| Feature              | How it works on shared hosting                |
|----------------------|-----------------------------------------------|
| Signup / Login       | Firebase Auth (email + password)              |
| User profile         | Firestore `users/{uid}` document              |
| Daily quiz           | Firestore `quizQuestions` + `quizAttempts`    |
| Wallet & history     | Firestore `users/{uid}.balance` + `transactions` |
| Friends list         | Firestore `users` ordered by `lastActiveAt`   |
| 1-on-1 chat          | Firestore `conversations/{id}/messages`       |
| Welcome bonus        | Applied at signup transaction                 |
| Referral code        | Stored on `users/{uid}.referralCode`          |
| Static HTML          | `web/out/` uploaded to `public_html`          |

No backend server, no database server, no cron jobs needed.

---

## 9. Limitations & caveats

1. **All Firebase keys are public** (they're in the JS bundle). Security
   relies on Firestore Rules — that's why `firestore.rules` is critical.
2. **Quiz answers ship to the client** — a power user could read the
   correct answer from network requests before submitting. For an MVP
   this is acceptable; to fully hide answers you'd need Cloud Functions
   (requires Firebase Blaze plan with billing — still has a free quota).
3. **No SSR / no API routes** — anything that needed a server is now
   client-side. Pages are pre-rendered as static HTML at build time and
   hydrated in the browser.

---

## 10. Troubleshooting

**Page shows blank / "Firebase configure nahi hua"** — your env vars
aren't set in `.env.local` or you forgot to rebuild after changing them.

**`auth/unauthorized-domain`** — add your domain in Firebase Console →
Authentication → Settings → Authorized domains.

**404 on every page after upload** — `.htaccess` is missing or
`public_html` is empty. Re-extract `out.zip` and confirm `index.html`
sits directly inside `public_html`.

**`Missing or insufficient permissions`** — Firestore Rules are too
strict or you didn't sign in. Make sure `firestore.rules` from the repo
is the active rule set.

**Quiz keeps repeating same question** — the daily question is picked
deterministically from `quizQuestions`. Add more questions in Firestore
to vary it.
