"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { api } from "./api-client";

export type Gender = "male" | "female";

export type CurrentUser = {
  id: string;
  fullName: string;
  username: string;
  gender: Gender;
  city: string;
  phone: string;
  avatarUrl?: string | null;
  level: number;
  xp: number;
  balance: number;
  pending: number;
  totalEarned: number;
  joinedAt: string;
  referralCode: string;
  referredBy?: string | null;
  isAdmin?: boolean;
  streak?: number;
};

type SignupInput = {
  fullName: string;
  username: string;
  gender: Gender;
  city: string;
  phone: string;
  password: string;
  referralCode?: string;
};

type SignupResult = { ok: true } | { ok: false; error: string };

type AuthState = {
  user: CurrentUser | null;
  loading: boolean;
  hydrated: boolean;
  /** Hits /api/auth/me to refresh the cached user from the server. Safe to call anywhere. */
  refresh: () => Promise<void>;
  signup: (data: SignupInput) => Promise<SignupResult>;
  login: (identifier: string, password: string) => Promise<SignupResult>;
  logout: () => Promise<void>;
  /** Local-only patch (e.g. avatar tweak before server PATCH lands). */
  update: (patch: Partial<CurrentUser>) => void;
  /** Optimistic balance bump used by quiz reward flow. */
  credit: (amount: number, reason?: string) => void;
  debit: (amount: number, reason?: string) => void;
};

type ServerUser = {
  id: string;
  fullName: string;
  displayName: string;
  username: string;
  city: string | null;
  phone: string | null;
  avatarUrl: string | null;
  gender: string | null;
  level: number;
  xp: number;
  streak: number;
  referralCode: string;
  role: string;
  isAdmin: boolean;
  joinedAt: string;
  balance: number;
  pending: number;
  totalEarned: number;
};

function fromServer(u: ServerUser): CurrentUser {
  const g = (u.gender || "").toUpperCase();
  return {
    id: u.id,
    fullName: u.fullName,
    username: u.username,
    gender: g === "FEMALE" ? "female" : "male",
    city: u.city ?? "",
    phone: u.phone ?? "",
    avatarUrl: u.avatarUrl,
    level: u.level,
    xp: u.xp,
    streak: u.streak,
    balance: u.balance,
    pending: u.pending,
    totalEarned: u.totalEarned,
    joinedAt: u.joinedAt,
    referralCode: u.referralCode,
    isAdmin: u.isAdmin,
  };
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      hydrated: false,

      refresh: async () => {
        const res = await api<{ user: ServerUser }>("/api/auth/me");
        if (res.ok) set({ user: fromServer(res.data.user), hydrated: true });
        else set({ user: null, hydrated: true });
      },

      signup: async (data) => {
        set({ loading: true });
        const res = await api<{ user: ServerUser }>("/api/auth/signup", {
          method: "POST",
          json: {
            ...data,
            gender: data.gender.toUpperCase(),
          },
        });
        set({ loading: false });
        if (!res.ok) return { ok: false, error: res.error.message };
        set({ user: fromServer(res.data.user), hydrated: true });
        return { ok: true };
      },

      login: async (identifier, password) => {
        set({ loading: true });
        const res = await api<{ user: ServerUser }>("/api/auth/login", {
          method: "POST",
          json: { identifier, password },
        });
        set({ loading: false });
        if (!res.ok) return { ok: false, error: res.error.message };
        set({ user: fromServer(res.data.user), hydrated: true });
        return { ok: true };
      },

      logout: async () => {
        await api("/api/auth/logout", { method: "POST" }).catch(() => {});
        set({ user: null });
      },

      update: (patch) =>
        set((s) => (s.user ? { user: { ...s.user, ...patch } } : s)),

      credit: (amount) =>
        set((s) =>
          s.user
            ? {
                user: {
                  ...s.user,
                  balance: +(s.user.balance + amount).toFixed(2),
                  totalEarned: +(s.user.totalEarned + amount).toFixed(2),
                  xp: s.user.xp + Math.round(amount * 2),
                  level:
                    1 +
                    Math.floor(
                      (s.user.xp + Math.round(amount * 2)) / 200,
                    ),
                },
              }
            : s,
        ),

      debit: (amount) =>
        set((s) =>
          s.user
            ? {
                user: {
                  ...s.user,
                  balance: +(s.user.balance - amount).toFixed(2),
                },
              }
            : s,
        ),
    }),
    {
      name: "adverse-auth",
      // Only persist the user object so logout/login state is consistent on
      // refresh; loading/hydrated should reset every page-load.
      partialize: (s) => ({ user: s.user }),
    },
  ),
);

// ----------------- Quiz state (server-backed) -----------------

export type QuizAttempt = {
  date: string; // YYYY-MM-DD
  questionId: string;
  picked: number;
  correct: boolean;
  reward?: number;
  at: string;
};

type QuizState = {
  attempts: QuizAttempt[];
  recordAttempt: (a: QuizAttempt) => void;
  todaysAttempt: () => QuizAttempt | undefined;
  hoursUntilNextQuiz: () => number;
};

/** Local cache of attempts so the UI feels instant even before /api/quiz/history loads. */
export const useQuiz = create<QuizState>()(
  persist(
    (set, get) => ({
      attempts: [],
      recordAttempt: (a) =>
        set((s) => ({ attempts: [a, ...s.attempts].slice(0, 200) })),
      todaysAttempt: () => {
        const today = new Date();
        const key = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
        return get().attempts.find((a) => a.date === key);
      },
      hoursUntilNextQuiz: () => {
        const last = get().attempts[0];
        if (!last) return 0;
        const lastTime = new Date(last.at).getTime();
        const next = lastTime + 24 * 3600 * 1000;
        const ms = next - Date.now();
        return Math.max(0, ms / 3600 / 1000);
      },
    }),
    { name: "adverse-quiz" },
  ),
);
