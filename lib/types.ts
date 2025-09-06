import { type z, type ZodAny, type ZodType } from 'zod';

export type ActionResponse<T extends ZodType = ZodAny> = {
  errors?: Partial<Record<keyof z.infer<T>, string[]>>;
  isSuccess: boolean;
  message?: string;
};
