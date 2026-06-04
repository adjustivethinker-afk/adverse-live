"use client";
import { useEffect } from "react";
import { useAuth } from "@/lib/store";
import { touchHeartbeat } from "@/lib/api";

/**
 * Mounts once at the top of the tree and:
 *   1. Refreshes the current backend session and user state.
 *   2. Posts a heartbeat every 60 seconds while the tab is active
 *      (powers the "online now" presence dot on the friends list).
 */
export function SessionBoot() {
  const userId = useAuth((s) => s.user?.id);

  useEffect(() => {
    void useAuth.getState().refresh();
  }, []);

  // Heartbeat for "online" presence.
  useEffect(() => {
    if (!userId) return;
    const tick = () => {
      touchHeartbeat().catch(() => {});
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
