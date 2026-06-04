# AdVerse Live · Web

Next.js 15 · TypeScript · Tailwind · Framer Motion · ShadCN-style components.

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Routes

- `/` — Landing
- `/login`, `/signup`, `/forgot-password`, `/otp`, `/two-factor`
- `/welcome` — Confetti onboarding
- `/dashboard`, `/ads`, `/team`, `/wallet`, `/deposit`, `/withdraw`
- `/voice-rooms`, `/voice-rooms/:id`
- `/missions`, `/community`, `/notifications`, `/profile`, `/security`, `/settings`, `/analytics`
- `/admin/*` — Super admin panel

## Design system

See `../docs/DESIGN.md`. Components live under `src/components/ui/`, effects under `src/components/fx/`, landing sections under `src/components/landing/`.

## Env

Create `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_REALTIME_URL=ws://localhost:4000/realtime
```
