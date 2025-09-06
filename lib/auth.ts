import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';

import { dbClientWs } from './prisma';

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  database: prismaAdapter(dbClientWs, { provider: 'postgresql' }),
  emailAndPassword: { enabled: true },
  plugins: [nextCookies()],
});
