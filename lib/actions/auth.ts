'use server';

import bcrypt from 'bcryptjs';
import { AuthError } from 'next-auth';

import { prisma } from '@/lib/prisma';
import { signIn } from '@/lib/auth';
import { LoginSchema, RegisterSchema } from '@/lib/schemas/auth';
import type { ActionResponse } from '@/lib/types';

export async function login(
  state: ActionResponse<typeof LoginSchema>,
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
      message: validationResult.error.flatten().formErrors[0],
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validationResult.data;

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: '/',
    });
  } catch (error) {
    if (!(error instanceof AuthError)) {
      throw error;
    }

    if (error.type === 'CredentialsSignin') {
      return {
        isSuccess: false,
        message: 'Please enter correct credentials',
      };
    }

    return {
      isSuccess: false,
      message: 'An error occurred while logging in. Please try again later.',
    };
  }

  return {
    isSuccess: true,
    message: 'Logged in successfully',
  };
}

export async function register(
  state: ActionResponse<typeof RegisterSchema>,
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
    return {
      isSuccess: false,
      message: validationResult.error.flatten().formErrors[0],
      errors: validationResult.error.flatten().fieldErrors,
    };
  }

  const { email, name, password } = validationResult.data;

  const existingUser = await prisma.user.findUnique({
    where: {
      email: validationResult.data.email,
    },
  });

  if (existingUser) {
    return {
      isSuccess: false,
      errors: {
        email: ['Email already in use'],
      },
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
    },
  });

  // TODO Email verification

  return {
    isSuccess: true,
    message: 'Account created successfully',
  };
}
