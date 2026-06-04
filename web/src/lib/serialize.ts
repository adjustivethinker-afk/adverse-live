import type { User, Wallet } from "@prisma/client";

export type SerializedUser = {
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

export function serializeUser(
  u: User & { wallet?: Wallet | null },
): SerializedUser {
  return {
    id: u.id,
    fullName: u.fullName,
    displayName: u.displayName,
    username: u.username,
    city: u.city,
    phone: u.phone,
    avatarUrl: u.avatarUrl,
    gender: u.gender,
    level: u.level,
    xp: u.xp,
    streak: u.streak,
    referralCode: u.referralCode,
    role: u.role,
    isAdmin: u.role === "ADMIN" || u.role === "SUPER_ADMIN",
    joinedAt: u.createdAt.toISOString(),
    balance: Number(u.wallet?.balance ?? 0),
    pending: Number(u.wallet?.pending ?? 0),
    totalEarned: Number(u.wallet?.totalEarned ?? 0),
  };
}
