'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { mergeCurrentUserAndGuestCarts } from '@/features/cart/data';
import { auth } from '@/lib/auth';
import { type ActionResponse } from '@/lib/types';

import { loginSchema, registerSchema } from './schemas';

export async function logIn(
  _: ActionResponse<typeof loginSchema>,
  formData: FormData,
): Promise<ActionResponse<typeof loginSchema>> {
  const data = Object.fromEntries(formData.entries());
  const validationResult = loginSchema.safeParse(data);

  if (!validationResult.success) {
    const { fieldErrors, formErrors } = validationResult.error.flatten();

    return {
      fieldErrors,
      isSuccess: false,
      message: formErrors[0],
    };
  }

  const { callbackUrl, email, password } = validationResult.data;

  try {
    const { user } = await auth.api.signInEmail({
      body: { email, password },
    });
    await mergeCurrentUserAndGuestCarts(user.id);
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

export async function logOut() {
  await auth.api.signOut({ headers: await headers() });
}

export async function register(
  _: ActionResponse<typeof registerSchema>,
  formData: FormData,
): Promise<ActionResponse<typeof registerSchema>> {
  const data = Object.fromEntries(formData.entries());
  const validationResult = registerSchema.safeParse(data);

  if (!validationResult.success) {
    const { fieldErrors, formErrors } = validationResult.error.flatten();

    return {
      fieldErrors,
      isSuccess: false,
      message: formErrors[0],
    };
  }

  const { callbackUrl, email, name, password } = validationResult.data;

  try {
    const { user } = await auth.api.signUpEmail({
      body: { email, name, password },
    });
    await mergeCurrentUserAndGuestCarts(user.id);
  } catch (error) {
    return {
      isSuccess: false,
      message:
        error instanceof Error ?
          error.message
        : 'An error occurred while creating your account. Please try again later.',
    };
  }

  redirect(callbackUrl);
}
