import { type PrismaClient } from '@prisma/client';
import { type z, type ZodAny, type ZodType } from 'zod';

declare global {
  var prisma: PrismaClient | undefined;
}

export type ActionResponse<T extends ZodType = ZodAny> = {
  errors?: Partial<Record<keyof z.infer<T>, string[]>>;
  isSuccess: boolean;
  message?: string;
};
