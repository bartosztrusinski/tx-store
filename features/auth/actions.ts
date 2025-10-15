'use server';

import { APIError } from 'better-auth/api';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { DalError } from '@/lib/dal';
import { type ActionResponse } from '@/lib/types';
import { tryCatch } from '@/lib/utils/try-catch';

import { loginSchema, registerSchema } from './schemas';

const DEFAULT_REDIRECT_PATH = '/';

export async function logIn(
  _: ActionResponse<typeof loginSchema>,
  formData: FormData,
): Promise<ActionResponse<typeof loginSchema>> {
  const data = Object.fromEntries(formData.entries());
  const validationResult = loginSchema.safeParse(data);

  if (!validationResult.success) {
    const { fieldErrors } = validationResult.error.flatten();

    return {
      isSuccess: false,
      validationErrors: fieldErrors,
    };
  }

  const { callbackPath, email, password } = validationResult.data;
  const [, error] = await tryCatch(() => auth.api.signInEmail({ body: { email, password } }));

  if (error) {
    console.error(error);

    return {
      isSuccess: false,
      message:
        error instanceof APIError || error instanceof DalError ?
          error.message
        : 'Could not log you in. Please try again in a moment.',
    };
  }

  redirect(callbackPath ?? DEFAULT_REDIRECT_PATH);
}

export async function logOut(): Promise<ActionResponse> {
  const headersList = await headers();
  const [result, error] = await tryCatch(() => auth.api.signOut({ headers: headersList }));

  if (error || !result.success) {
    console.error(error);

    return {
      isSuccess: false,
      message:
        error instanceof DalError ?
          error.message
        : 'Could not log you out. Please try again in a moment.',
    };
  }

  return {
    isSuccess: true,
    message: 'Logged out successfully',
  };
}

export async function register(
  _: ActionResponse<typeof registerSchema>,
  formData: FormData,
): Promise<ActionResponse<typeof registerSchema>> {
  const data = Object.fromEntries(formData.entries());
  const validationResult = registerSchema.safeParse(data);

  if (!validationResult.success) {
    const { fieldErrors } = validationResult.error.flatten();

    return {
      isSuccess: false,
      validationErrors: fieldErrors,
    };
  }

  const { callbackPath, email, name, password } = validationResult.data;
  const [, error] = await tryCatch(() => auth.api.signUpEmail({ body: { email, name, password } }));

  if (error) {
    console.error(error);

    return {
      isSuccess: false,
      message:
        error instanceof APIError || error instanceof DalError ?
          error.message
        : 'Could not sign you up. Please try again in a moment.',
    };
  }

  redirect(callbackPath ?? DEFAULT_REDIRECT_PATH);
}
