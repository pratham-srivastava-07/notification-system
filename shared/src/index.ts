import { PrismaClient } from "@prisma/client";
export * from "./schema/types";
export const prismaClient = new PrismaClient()
