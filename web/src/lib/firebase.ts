"use client";

/**
 * Lightweight client utilities previously bundled with Firebase helpers.
 * The Firebase SDK was removed during the backend migration; keep useful
 * helpers here so other modules can import them without pulling the
 * Firebase runtime.
 */

/** Deterministic 1:1 conversation id between two user ids. */
export function conversationIdFor(a: string, b: string): string {
  return [a, b].sort().join("__");
}

/** Today's date as YYYY-MM-DD in local PK timezone (Asia/Karachi, UTC+5). */
export function pkTodayKey(): string {
  const now = new Date();
  // Shift to UTC+5 then take YYYY-MM-DD
  const pk = new Date(now.getTime() + 5 * 60 * 60 * 1000);
  return pk.toISOString().slice(0, 10);
}

/** Generate a 6-8 char alphanumeric referral code. */
export function generateReferralCode(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 8; i++) {
    out += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return out;
}
