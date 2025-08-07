import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
  password: z.string().min(1, {
    message: 'Please enter your password',
  }),
  callbackUrl: z.string().refine((url) => url.startsWith('/'), {
    message: 'Invalid callback URL',
  }),
});

export const registerSchema = z
  .object({
    name: z.string().min(3, {
      message: 'Name must be at least 3 characters long',
    }),
    email: z.string().email({
      message: 'Please enter a valid email address',
    }),
    password: z
      .string()
      .min(8, {
        message: 'Password must be at least 8 characters long',
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter',
      })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter',
      })
      .regex(/[0-9]/, {
        message: 'Password must contain at least one number',
      })
      .regex(/[!@#$%^&*()_+]/, {
        message: 'Password must contain at least one special character',
      }),
    confirmPassword: z.string(),
    callbackUrl: z.string().refine((url) => url.startsWith('/'), {
      message: 'Invalid callback URL',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
