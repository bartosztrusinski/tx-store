import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { headers } from 'next/headers';

import { dbPool } from './db';

export const auth = betterAuth({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  database: prismaAdapter(dbPool, { provider: 'postgresql' }),
  emailAndPassword: { enabled: true },
  plugins: [nextCookies()],
});

export async function getCurrentUser() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user ?? null;
}

export async function getSession() {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.session ?? null;
}
