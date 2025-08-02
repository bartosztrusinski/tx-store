import { type PrismaClient } from '@prisma/client';
import { z, type ZodType } from 'zod';

declare global {
  var prisma: PrismaClient | undefined;
}

export type ActionResponse<T extends ZodType> = {
  isSuccess: boolean;
  message?: string;
  errors?: {
    [K in keyof z.infer<T>]?: string[];
  };
};
