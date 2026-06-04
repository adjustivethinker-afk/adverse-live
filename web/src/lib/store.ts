"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  signup,
  loginEmail,
  logout as apiLogout,
  refreshCurrentUser,
  updateMyProfile,
  signInWithGoogle as apiSignInWithGoogle,
  completeProfile as apiCompleteProfile,
  type AppUser,
  type SignupInput,
  type ProfileInput,
} from "./api";

export type Gender = "male" | "female";

export type CurrentUser = AppUser;

type Result<T = void> =
  | ({ ok: true } & T)
  | { ok: false; error: string };

type AuthState = {
  user: CurrentUser | null;
  loading: boolean;
  hydrated: boolean;
  refresh: () => Promise<void>;
  /** Email signup — only creates the auth account. */
  signup: (
    data: SignupInput,
  ) => Promise<Result<{ needsProfile: true }>>;
  /** Email login. */
  login: (
    email: string,
    password: string,
  ) => Promise<Result<{ needsProfile: boolean }>>;
  /** Google popup sign-in. */
  signInWithGoogle: () => Promise<Result<{ needsProfile: boolean }>>;
  /** Pick up Google redirect result on mount. */
  consumeRedirect: () => Promise<Result<{ needsProfile: boolean }> | null>;
  /** Finish onboarding by writing the Firestore profile + welcome bonus. */
  completeProfile: (data: ProfileInput) => Promise<Result>;
  /** Sign out. */
  logout: () => Promise<void>;
  update: (patch: Partial<CurrentUser>) => void;
  credit: (amount: number, reason?: string) => void;
  debit: (amount: number, reason?: string) => void;
  saveProfile: (patch: {
    fullName?: string;
    city?: string;
    avatarUrl?: string | null;
  }) => Promise<Result>;
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      loading: false,
      hydrated: false,

      refresh: async () => {
        try {
          const u = await refreshCurrentUser();
          set({ user: u, hydrated: true });
        } catch {
          set({ user: null, hydrated: true });
        }
      },

      signup: async (data) => {
        set({ loading: true });
        try {
          await signup(data);
          set({ loading: false, hydrated: true });
          return { ok: true, needsProfile: true };
        } catch (e) {
          set({ loading: false });
          return { ok: false, error: errorMessage(e) };
        }
      },

      login: async (email, password) => {
        set({ loading: true });
        try {
          const r = await loginEmail(email, password);
          if (r.kind === "existing") {
            set({ user: r.user, loading: false, hydrated: true });
            return { ok: true, needsProfile: false };
          }
          set({ loading: false, hydrated: true });
          return { ok: true, needsProfile: true };
        } catch (e) {
          set({ loading: false });
          return { ok: false, error: errorMessage(e) };
        }
      },

      signInWithGoogle: async () => {
        set({ loading: true });
        try {
          const r = await apiSignInWithGoogle();
          if (r.kind === "existing") {
            set({ user: r.user, loading: false, hydrated: true });
            return { ok: true, needsProfile: false };
          }
          set({ loading: false, hydrated: true });
          return { ok: true, needsProfile: true };
        } catch (e) {
          set({ loading: false });
          return { ok: false, error: errorMessage(e) };
        }
      },

      consumeRedirect: async () => {
        return null;
      },

      completeProfile: async (data) => {
        set({ loading: true });
        try {
          const u = await apiCompleteProfile(data);
          set({ user: u, loading: false, hydrated: true });
          return { ok: true };
        } catch (e) {
          set({ loading: false });
          return { ok: false, error: errorMessage(e) };
        }
      },

      logout: async () => {
        try {
          await apiLogout();
        } catch {}
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
                    Math.floor((s.user.xp + Math.round(amount * 2)) / 200),
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

      saveProfile: async (patch) => {
        try {
          await updateMyProfile(patch);
          const cur = get().user;
          if (cur) set({ user: { ...cur, ...patch } as CurrentUser });
          return { ok: true };
        } catch (e) {
          return { ok: false, error: errorMessage(e) };
        }
      },
    }),
    {
      name: "adverse-auth",
      partialize: (s) => ({ user: s.user }),
    },
  ),
);

function errorMessage(e: unknown): string {
  if (e instanceof Error) {
    const m = e.message;
    if (m.includes("auth/email-already-in-use"))
      return "This email is already registered. Try signing in instead.";
    if (m.includes("auth/invalid-email")) return "Invalid email address.";
    if (m.includes("auth/weak-password"))
      return "Password is too weak (use at least 8 characters).";
    if (
      m.includes("auth/wrong-password") ||
      m.includes("auth/invalid-credential")
    )
      return "Wrong email or password.";
    if (m.includes("auth/user-not-found")) return "No account found with this email.";
    if (m.includes("auth/too-many-requests"))
      return "Too many attempts. Please try again in a few minutes.";
    if (m.includes("auth/network-request-failed"))
      return "Check your internet connection and try again.";
    if (m.includes("auth/popup-closed-by-user"))
      return "Sign-in window was closed. Please try again.";
    if (m.includes("auth/cancelled-popup-request")) return "";
    if (m.includes("auth/popup-blocked"))
      return "Your browser blocked the sign-in popup. Please allow popups and retry.";
    if (m.includes("auth/account-exists-with-different-credential"))
      return "This email is already registered with a different sign-in method.";
    if (m.includes("auth/unauthorized-domain"))
      return "This domain is not authorized. Check your backend auth configuration.";
    if (m.includes("auth/operation-not-allowed"))
      return "This sign-in method is disabled. Contact the site administrator to enable it.";
    if (m.includes("auth/configuration-not-found"))
      return "Authentication is not configured. Contact the site administrator.";
    if (
      m.includes("Missing or insufficient permissions") ||
      m.includes("permission-denied") ||
      m.includes("PERMISSION_DENIED")
    )
      return "Backend database is not set up yet. Contact the site administrator.";
    if (m.includes("FAILED_PRECONDITION") || m.includes("UNAVAILABLE"))
      return "Backend database is not reachable. Check your internet or that the backend is running.";
    return m;
  }
  return String(e);
}

// ----------------- Quiz state (local cache) -----------------

export type QuizAttempt = {
  date: string;
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
