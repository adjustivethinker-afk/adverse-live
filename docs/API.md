# API Reference

Base URL: `/api/v1`
Auth: `Authorization: Bearer <accessToken>` (JWT)
Realtime: WebSocket on `/realtime` namespace.

> Swagger UI is auto-generated and served at `/api/docs` when the API is running.

## Conventions

- All money is in PKR Decimal(18,2). Cents are stored.
- Pagination: `?cursor=<id>&take=<n>` (max 200).
- Errors are JSON: `{ statusCode, message, error }`.
- Rate limit: `120 req / 60s / IP` (Throttler).

---

## Auth

### `POST /auth/signup`
```json
{ "email": "...", "displayName": "...", "phone": "...", "password": "...", "referralCode": "AR0US71" }
```
Returns `{ user, accessToken, refreshToken }`. Builds 3-level referral chain and credits the ₨ 10 welcome bonus.

### `POST /auth/login`
```json
{ "email": "...", "password": "..." }
```

### `POST /auth/refresh`
```json
{ "refreshToken": "..." }
```

### `POST /auth/logout`  *(auth)*
Revokes the refresh token's session.

### `POST /auth/me`  *(auth)*
Returns the current user's id (and any session attributes).

---

## Users

| Method | Path | Auth | Description |
|--|--|--|--|
| `GET` | `/users/me` | yes | Current user with wallet |
| `PATCH` | `/users/me` | yes | Update profile |
| `GET` | `/users/leaderboard?period=weekly\|alltime` | no | Top earners |
| `GET` | `/users/:username` | no | Public profile |

---

## Wallet

| Method | Path | Description |
|--|--|--|
| `GET` | `/wallet` | Balance / pending / totals |
| `GET` | `/wallet/stats` | Today / week / month sums |
| `GET` | `/wallet/transactions?type&cursor&take` | Paginated transactions |

`TransactionType`: `AD_REWARD · REFERRAL_COMMISSION_L1 · REFERRAL_COMMISSION_L2 · REFERRAL_COMMISSION_L3 · WELCOME_BONUS · STREAK_BONUS · MISSION_REWARD · CHEST_REWARD · VOICE_GIFT_RECEIVED · VOICE_GIFT_SENT · DEPOSIT · WITHDRAWAL · ADJUSTMENT · REFUND · FEE`

---

## Ads

| Method | Path | Description |
|--|--|--|
| `GET` | `/ads/available` | Daily cap, watched today, available ads |
| `POST` | `/ads/:id/start` | Begin tracked watch |
| `POST` | `/ads/watches/:id/complete` | Finalize watch, credit reward, pay refs |
| `GET` | `/ads/history` | Recent watches |

```json
// POST /ads/watches/:id/complete
{ "watchSeconds": 30, "fingerprint": "..." }
// → { "credited": true, "amount": 30 }
```

---

## Referrals

| Method | Path | Description |
|--|--|--|
| `GET` | `/referrals/tree` | L1 + L2 nodes |
| `GET` | `/referrals/stats` | Counts + totalEarned |
| `GET` | `/referrals/top?period=weekly\|alltime` | Top referrers |

Rates: **L1 10% · L2 5% · L3 2%** of base earnings. Configurable via `Setting.platform.refRates`.

---

## Voice Rooms

| Method | Path | Description |
|--|--|--|
| `GET` | `/voice-rooms?category&search&featured` | List live rooms |
| `POST` | `/voice-rooms` | Create room (becomes host) |
| `POST` | `/voice-rooms/:id/join` | Join (with optional `password`) |
| `POST` | `/voice-rooms/:id/leave` | Leave |
| `POST` | `/voice-rooms/:id/messages` | Send chat message |
| `POST` | `/voice-rooms/:id/gifts` | Send gift, atomic balance transfer |
| `POST` | `/voice-rooms/:id/end` | Host ends room |

```json
// POST /voice-rooms
{ "title": "...", "description": "...", "category": "Talk", "tags": ["..."], "visibility": "PUBLIC", "password": null }
```

---

## Deposits

| Method | Path | Description |
|--|--|--|
| `POST` | `/deposits` | Submit deposit request |
| `GET` | `/deposits` | History |

```json
// POST /deposits
{ "method": "JAZZCASH", "amount": 1500, "txnRef": "JC...", "receiptUrl": "...", "note": "..." }
```

Admin moderation: `POST /admin/deposits/:id/approve` · `POST /admin/deposits/:id/reject`.

---

## Withdrawals

| Method | Path | Description |
|--|--|--|
| `POST` | `/withdrawals` | Request withdrawal (places hold) |
| `GET` | `/withdrawals` | History |

```json
// POST /withdrawals
{ "method": "JAZZCASH", "amount": 2000, "accountName": "...", "accountNumber": "..." }
```

Admin: `POST /admin/withdrawals/:id/complete` · `POST /admin/withdrawals/:id/reject`.

---

## Notifications

| Method | Path | Description |
|--|--|--|
| `GET` | `/notifications?kind` | List |
| `PATCH` | `/notifications/read-all` | Mark all read |
| `PATCH` | `/notifications/:id/read` | Mark one read |

---

## Missions

| Method | Path | Description |
|--|--|--|
| `GET` | `/missions/active` | Active missions with progress |
| `POST` | `/missions/:id/claim` | Claim completed reward |

---

## Community

| Method | Path | Auth | Description |
|--|--|--|--|
| `GET` | `/community/feed` | no | Latest posts |
| `POST` | `/community/posts` | yes | Create post |
| `POST` | `/community/posts/:id/like` | yes | Toggle like |
| `POST` | `/community/posts/:id/comments` | yes | Comment |

---

## Admin (Role: ADMIN, SUPER_ADMIN)

| Method | Path | Description |
|--|--|--|
| `GET` | `/admin/overview` | KPIs |
| `GET` | `/admin/users?search&status&take` | Users |
| `PATCH` | `/admin/users/:id/status` | Set ACTIVE/SUSPENDED/BANNED |
| `GET` | `/admin/fraud` | Unresolved fraud signals |
| `POST` | `/admin/deposits/:id/approve` | Approve deposit |
| `POST` | `/admin/deposits/:id/reject` | Reject deposit |
| `POST` | `/admin/withdrawals/:id/complete` | Pay out |
| `POST` | `/admin/withdrawals/:id/reject` | Refund balance |

---

## WebSocket events

Connect to `wss://api.adverse.live/realtime`.

### Client → server

| Event | Payload |
|--|--|
| `auth` | `{ userId }` (joins `user:{id}`) |
| `room:join` | `{ roomId }` |
| `room:leave` | `{ roomId }` |
| `room:message` | `{ roomId, body, userId }` |
| `room:reaction` | `{ roomId, userId, emoji }` |
| `voice:offer` | WebRTC SDP offer |
| `voice:answer` | WebRTC SDP answer |
| `voice:ice-candidate` | ICE candidate |

### Server → client

| Event | Payload |
|--|--|
| `notification:new` | Notification |
| `wallet:updated` | Wallet snapshot |
| `room:user-joined` | `{ userId }` |
| `room:user-left` | `{ userId }` |
| `room:user-muted` | `{ userId, muted }` |
| `room:message` | message |
| `room:gift` | gift |
| `room:reaction` | reaction |
| `room:speaker-request` | `{ userId }` |
| `room:speaker-accepted` | `{ userId }` |
| `room:speaker-denied` | `{ userId }` |
