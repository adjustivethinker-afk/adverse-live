"use client";
import { useEffect } from "react";
import { useAuth } from "@/lib/store";

/**
 * Mounts once at the top of the tree and:
 *   1. Pulls the live session from /api/auth/me on first load
 *   2. Posts a heartbeat every 60 seconds while the tab is active
 *      (powers the "online now" presence dot on the friends list).
 */
export function SessionBoot() {
  const refresh = useAuth((s) => s.refresh);
  const userId = useAuth((s) => s.user?.id);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!userId) return;
    const tick = () => {
      // Fire-and-forget; ignore failures (offline, server cold start, etc).
      fetch("/api/friends/heartbeat", {
        method: "POST",
        credentials: "include",
      }).catch(() => {});
    };
    tick();
    const id = setInterval(tick, 60_000);
    const onFocus = () => tick();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(id);
      window.removeEventListener("focus", onFocus);
    };
  }, [userId]);

  return null;
}
