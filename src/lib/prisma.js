import { PrismaClient } from "@prisma/client";

// Use a non-generic global key to avoid collisions
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.PRISMA_CLIENT || new PrismaClient({ log: ["error"] });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.PRISMA_CLIENT = prisma;
}

export default prisma;
