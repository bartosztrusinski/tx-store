'use server';

import { LoginSchema, RegisterSchema } from '@/lib/schemas/auth';
import type { ActionResponse } from '@/lib/types';

export async function login(
  prevState: ActionResponse<typeof LoginSchema>,
  formData: FormData,
): Promise<ActionResponse<typeof LoginSchema>> {
  const data = {
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const validationResult = LoginSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      isSuccess: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  // Perform login logic here

  return {
    isSuccess: true,
    message: 'Logged in successfully',
  };
}

export async function register(
  prevState: ActionResponse<typeof RegisterSchema>,
  formData: FormData,
): Promise<ActionResponse<typeof RegisterSchema>> {
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  };

  const validationResult = RegisterSchema.safeParse(data);

  if (!validationResult.success) {
    console.dir(validationResult.error);

    return {
      isSuccess: false,
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  // Perform registration logic here

  return {
    isSuccess: true,
    message: 'Account created successfully',
  };
}
