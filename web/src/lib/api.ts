import { NextResponse } from "next/server";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function fail(message: string, status = 400, code?: string) {
  return NextResponse.json({ ok: false, error: { message, code } }, { status });
}

/** Mark a route handler dynamic when it reads cookies/headers. */
export const dynamic = "force-dynamic";

/** Pick a daily quiz question deterministically from the DB. */
export function dayKey(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}
