import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon, PrismaNeonHTTP } from '@prisma/adapter-neon';
import { type Prisma, PrismaClient } from '@prisma/client';

type DbClient = Prisma.TransactionClient | PrismaClient;

neonConfig.poolQueryViaFetch = true;

const globalForPrisma = globalThis as unknown as {
  db: PrismaClient | undefined;
  dbPool: PrismaClient | undefined;
};

const connectionString = `${process.env.DB_URL}`;

const adapterHttp = new PrismaNeonHTTP(connectionString, {});
const adapterWs = new PrismaNeon({ connectionString });

const db = globalForPrisma.db ?? new PrismaClient({ adapter: adapterHttp });
const dbPool = globalForPrisma.dbPool ?? new PrismaClient({ adapter: adapterWs });
const dbTransaction = dbPool.$transaction.bind(dbPool);

if (process.env.NODE_ENV === 'development') {
  globalForPrisma.dbPool = dbPool;
  globalForPrisma.db = db;
}

export { db, dbPool, dbTransaction };
export type { DbClient };
