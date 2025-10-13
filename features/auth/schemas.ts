import { z } from 'zod';

const callbackPath = z
  .string({ message: 'Invalid callback path.' })
  .refine((path) => path.startsWith('/'), { message: 'Invalid callback path.' })
  .optional();

const email = z
  .string({ message: 'Please enter a valid email address.' })
  .email({ message: 'Please enter a valid email address.' })
  .trim();

export const loginSchema = z.object({
  callbackPath,
  email,
  password: z
    .string({ message: 'Please enter a valid password.' })
    .min(1, { message: 'Please enter a password.' })
    .trim(),
});

export const registerSchema = z
  .object({
    callbackPath,
    confirmPassword: z.string({ message: 'Please confirm your password.' }).trim(),
    email,
    name: z
      .string({ message: 'Please enter a valid name.' })
      .min(3, { message: 'Name must be at least 3 characters long.' })
      .trim(),
    password: z
      .string({ message: 'Please enter a valid password.' })
      .min(8, { message: 'Password must be at least 8 characters long.' })
      .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter.' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter.' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number.' })
      .regex(/[!@#$%^&*()_+]/, {
        message: 'Password must contain at least one special character.',
      })
      .trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });
