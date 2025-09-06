import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon, PrismaNeonHTTP } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';

declare global {
  var dbClientWs: PrismaClient | undefined;
  var dbClientHttp: PrismaClient | undefined;
}

neonConfig.poolQueryViaFetch = true;

const connectionString = `${process.env.DB_URL}`;

const adapterWs = new PrismaNeon({ connectionString });
const dbClientWs = global.dbClientWs ?? new PrismaClient({ adapter: adapterWs });

const adapterHttp = new PrismaNeonHTTP(connectionString, {});
const dbClientHttp = global.dbClientHttp ?? new PrismaClient({ adapter: adapterHttp });

if (process.env.NODE_ENV === 'development') {
  global.dbClientWs = dbClientWs;
  global.dbClientHttp = dbClientHttp;
}

export { dbClientHttp, dbClientWs };
