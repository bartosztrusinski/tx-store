export function splitByKeys<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[],
): [Pick<T, K>, Omit<T, K>] {
  return [pick(obj, keys), omit(obj, keys)];
}

function omit<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key as K)),
  ) as Omit<T, K>;
}

function pick<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  return Object.fromEntries(Object.entries(obj).filter(([key]) => keys.includes(key as K))) as Pick<
    T,
    K
  >;
}
