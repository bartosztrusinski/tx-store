import { z, type ZodType } from 'zod';

export type ActionResponse<T extends ZodType> = {
  isSuccess: boolean;
  message?: string;
  errors?: {
    [K in keyof z.infer<T>]?: string[];
  };
};
