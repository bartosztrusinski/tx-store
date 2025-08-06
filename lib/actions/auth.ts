'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { LoginSchema, RegisterSchema } from '@/lib/schemas/auth';
import type { ActionResponse } from '@/lib/types';

export async function logIn(
  _: ActionResponse<typeof LoginSchema>,
  formData: FormData,
): Promise<ActionResponse<typeof LoginSchema>> {
  const data = Object.fromEntries(formData.entries());
  const validationResult = LoginSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      isSuccess: false,
      message: validationResult.error.flatten().formErrors[0],
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { email, password, callbackUrl } = validationResult.data;

  try {
    await auth.api.signInEmail({ body: { email, password } });
  } catch (error) {
    return {
      isSuccess: false,
      message:
        error instanceof Error ?
          error.message
        : 'An error occurred while logging in. Please try again later.',
    };
  }

  redirect(callbackUrl);
}

export async function register(
  _: ActionResponse<typeof RegisterSchema>,
  formData: FormData,
): Promise<ActionResponse<typeof RegisterSchema>> {
  const data = Object.fromEntries(formData.entries());
  const validationResult = RegisterSchema.safeParse(data);

  if (!validationResult.success) {
    return {
      isSuccess: false,
      message: validationResult.error.flatten().formErrors[0],
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { email, name, password } = validationResult.data;

  try {
    await auth.api.signUpEmail({
      body: { email, name, password },
    });
  } catch (error) {
    return {
      isSuccess: false,
      message:
        error instanceof Error ?
          error.message
        : 'An error occurred while creating your account. Please try again later.',
    };
  }

  redirect('/');
}

export async function logOut() {
  await auth.api.signOut({ headers: await headers() });
}
