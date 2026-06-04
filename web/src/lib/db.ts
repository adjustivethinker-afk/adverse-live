import { PrismaClient } from "@prisma/client";

// Vercel/Next.js serverless re-imports modules between requests in dev,
// which would create a new PrismaClient per import and exhaust the
// connection pool. We cache it on globalThis so HMR + warm Lambda
// invocations re-use a single client.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
