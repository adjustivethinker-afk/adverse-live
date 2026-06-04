"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Gender = "male" | "female";

export type CurrentUser = {
  id: string;
  fullName: string;
  username: string;
  gender: Gender;
  city: string;
  phone: string;
  avatarUrl?: string;
  level: number;
  xp: number;
  balance: number;
  pending: number;
  totalEarned: number;
  joinedAt: string;
  referralCode: string;
  referredBy?: string | null;
  isAdmin?: boolean;
};

type AuthState = {
  user: CurrentUser | null;
  signup: (data: Omit<CurrentUser, "id" | "level" | "xp" | "balance" | "pending" | "totalEarned" | "joinedAt" | "referralCode" | "isAdmin"> & { password: string; referralCode?: string }) => void;
  login: (username: string) => boolean;
  logout: () => void;
  update: (patch: Partial<CurrentUser>) => void;
  credit: (amount: number, reason?: string) => void;
  debit: (amount: number, reason?: string) => void;
};

const seed = (overrides: Partial<CurrentUser> = {}): CurrentUser => ({
  id: "u_" + Math.random().toString(36).slice(2, 10),
  fullName: "Aroush Khan",
  username: "aroush",
  gender: "female",
  city: "Karachi",
  phone: "+92 300 0000000",
  level: 1,
  xp: 0,
  balance: 10,
  pending: 0,
  totalEarned: 10,
  joinedAt: new Date().toISOString(),
  referralCode: "AR" + Math.random().toString(36).slice(2, 8).toUpperCase(),
  ...overrides,
});

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      signup: (data) => {
        const user = seed({
          fullName: data.fullName,
          username: data.username,
          gender: data.gender,
          city: data.city,
          phone: data.phone,
          referredBy: data.referralCode || null,
        });
        set({ user });
      },
      login: (username) => {
        const existing = get().user;
        if (existing && existing.username === username) return true;
        // Demo: create a stub user on login
        set({ user: seed({ username, fullName: username }) });
        return true;
      },
      logout: () => set({ user: null }),
      update: (patch) => set((s) => (s.user ? { user: { ...s.user, ...patch } } : s)),
      credit: (amount) =>
        set((s) =>
          s.user
            ? {
                user: {
                  ...s.user,
                  balance: +(s.user.balance + amount).toFixed(2),
                  totalEarned: +(s.user.totalEarned + amount).toFixed(2),
                  xp: s.user.xp + Math.round(amount * 2),
                  level: 1 + Math.floor((s.user.xp + Math.round(amount * 2)) / 200),
                },
              }
            : s,
        ),
      debit: (amount) =>
        set((s) =>
          s.user
            ? {
                user: { ...s.user, balance: +(s.user.balance - amount).toFixed(2) },
              }
            : s,
        ),
    }),
    { name: "adverse-auth" },
  ),
);

// ----------------- Quiz state -----------------

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

export const useQuiz = create<QuizState>()(
  persist(
    (set, get) => ({
      attempts: [],
      recordAttempt: (a) => set((s) => ({ attempts: [a, ...s.attempts].slice(0, 200) })),
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
