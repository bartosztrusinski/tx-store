import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

const connectionString = `${process.env.POSTGRES_PRISMA_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV === 'development') globalForPrisma.prisma = prisma;

export { prisma };
