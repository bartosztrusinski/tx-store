import { getCurrentUser } from '@/lib/auth';

type DalErrorType = 'unauthenticated' | 'unauthorized';

const defaultMessage: Record<DalErrorType, string> = {
  unauthenticated: 'You must be logged in to perform this action.',
  unauthorized: 'You are not authorized to perform this action.',
};

export class DalError extends Error {
  type: DalErrorType;

  constructor({
    message,
    type,
    ...options
  }: ErrorOptions & { message?: string; type: DalErrorType }) {
    super(message ?? defaultMessage[type], options);
    this.name = 'DalError';
    this.type = type;
  }
}

export function isUnauthenticated(error: Error): boolean {
  return error instanceof DalError && error.type === 'unauthenticated';
}

export function isUnauthorized(error: Error): boolean {
  return error instanceof DalError && error.type === 'unauthorized';
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    throw new DalError({ type: 'unauthenticated' });
  }

  return user;
}
