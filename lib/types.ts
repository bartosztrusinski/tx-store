import { type z, type ZodType } from 'zod';

export type ActionResponse<T extends ZodType | undefined = undefined> = (T extends ZodType ?
  { fieldErrors?: FieldErrors<T>; isSuccess: false } | { fieldErrors?: never; isSuccess: true }
: { isSuccess: boolean }) & { message?: string };

type FieldErrors<Schema extends ZodType> = Partial<Record<keyof z.infer<Schema>, string[]>>;
