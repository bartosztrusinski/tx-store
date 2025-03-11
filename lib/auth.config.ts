import bcrypt from 'bcryptjs';
import Credentials from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';

import { prisma } from '@/lib/prisma';
import { LoginSchema } from '@/lib/schemas/auth';

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validationResult = LoginSchema.safeParse(credentials);

        if (!validationResult.success) {
          return null;
        }

        const { email, password } = validationResult.data;

        const user = await prisma.user.findUnique({
          where: {
            email,
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
          return null;
        }

        return user;
      },
    }),
  ],
} satisfies NextAuthConfig;
