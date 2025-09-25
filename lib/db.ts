import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon, PrismaNeonHTTP } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  db: PrismaClient | undefined;
  dbPool: PrismaClient | undefined;
};

neonConfig.poolQueryViaFetch = true;

const connectionString = `${process.env.DB_URL}`;

const adapterHttp = new PrismaNeonHTTP(connectionString, {});
const adapterWs = new PrismaNeon({ connectionString });

const db = globalForPrisma.db ?? new PrismaClient({ adapter: adapterHttp });
const dbPool = globalForPrisma.dbPool ?? new PrismaClient({ adapter: adapterWs });

if (process.env.NODE_ENV === 'development') {
  globalForPrisma.dbPool = dbPool;
  globalForPrisma.db = db;
}

export { db, dbPool };
