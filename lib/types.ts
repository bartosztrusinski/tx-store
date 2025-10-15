import { type z, type ZodType } from 'zod';

export type ActionResponse<T extends ZodType | undefined = undefined> = (T extends ZodType ?
  | { isSuccess: false; validationErrors?: ValidationErrors<T> }
  | { isSuccess: true; validationErrors?: never }
: { isSuccess: boolean }) & { message?: string };

type ValidationErrors<Schema extends ZodType> = Partial<Record<keyof z.infer<Schema>, string[]>>;
