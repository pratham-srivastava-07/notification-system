import { prismaClient } from "@notify/shared";

// Prevent multiple instances of Prisma Client in development
const globalForPrisma = global as unknown as { prisma: typeof prismaClient };

export const db = globalForPrisma.prisma || prismaClient;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
