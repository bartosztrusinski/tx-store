import 'server-only';
import { cookies } from 'next/headers';

const COOKIE_KEY = 'cart-session-id';
const MAX_AGE = 60 * 60 * 24 * 30;

export async function deleteGuestCartCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_KEY);
}

export async function getGuestCartCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_KEY)?.value ?? null;
}

export async function setGuestCartCookie(value: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_KEY, value, {
    httpOnly: true,
    maxAge: MAX_AGE,
    sameSite: 'strict',
    secure: true,
  });
}
