import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

neonConfig.poolQueryViaFetch = true;

const connectionString = `${process.env.DB_URL}`;
const adapter = new PrismaNeon({ connectionString });
const prisma = global.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV === 'development') global.prisma = prisma;

export { prisma };
