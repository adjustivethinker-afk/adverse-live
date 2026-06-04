"use client";

export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: { message: string; code?: string } };

/**
 * Tiny typed wrapper around fetch that:
 *  - Sends/receives JSON
 *  - Includes credentials (so the httpOnly session cookie travels)
 *  - Always returns the discriminated `ApiResult` shape, never throws
 *    on HTTP errors (so call sites can branch on `res.ok`).
 *  - Throws only on network/parse failure.
 */
export async function api<T = unknown>(
  path: string,
  init: RequestInit & { json?: unknown } = {},
): Promise<ApiResult<T>> {
  const { json, headers, ...rest } = init;
  const res = await fetch(path, {
    ...rest,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...headers,
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
    cache: "no-store",
  });
  let payload: unknown = null;
  try {
    payload = await res.json();
  } catch {
    // Some endpoints (logout, etc.) might return empty body
  }
  if (!res.ok) {
    const errObj =
      payload && typeof payload === "object" && "error" in payload
        ? (payload as { error?: { message?: string; code?: string } }).error
        : undefined;
    const message = errObj?.message ?? `Request failed (${res.status})`;
    const code = errObj?.code;
    return { ok: false, error: { message, code } };
  }
  // Server responses are wrapped as { ok, data } already.
  if (payload && typeof payload === "object" && "data" in payload) {
    return {
      ok: true,
      data: (payload as { data: T }).data,
    };
  }
  return { ok: true, data: payload as T };
}
