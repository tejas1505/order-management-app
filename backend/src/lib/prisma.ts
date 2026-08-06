import { PrismaClient } from "@prisma/client";

// Reuse a single PrismaClient instance across the app (and hot reloads in dev).
const prisma = new PrismaClient();

export default prisma;
