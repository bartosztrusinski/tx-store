import { cookies } from 'next/headers';

const COOKIE_KEY = 'tx-cart';
const MAX_AGE = 60 * 60 * 24 * 30;

export async function deleteCartCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_KEY);
}

export async function getCartCookie() {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_KEY)?.value ?? null;
}

export async function setCartCookie(value: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_KEY, value, {
    httpOnly: true,
    maxAge: MAX_AGE,
    sameSite: 'strict',
    secure: true,
  });
}
