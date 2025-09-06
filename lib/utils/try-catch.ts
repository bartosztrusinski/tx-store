type Failure<E> = readonly [null, E];
type Operation<T> = Promise<T> | (() => T) | (() => Promise<T>);
type ResultAsync<T, E> = Promise<Success<T> | Failure<E>>;
type ResultSync<T, E> = Success<T> | Failure<E>;
type Success<T> = readonly [T, null];

export function tryCatch<T, E = Error>(operation: () => T): ResultSync<T, E>;
export function tryCatch<T, E = Error>(operation: () => Promise<T>): ResultAsync<T, E>;
export function tryCatch<T, E = Error>(operation: Promise<T>): ResultAsync<T, E>;
export function tryCatch<T, E = Error>(
  operation: Operation<T>,
): ResultSync<T, E> | ResultAsync<T, E> {
  try {
    const result = typeof operation === 'function' ? operation() : operation;

    if (isPromise(result)) {
      return result
        .then((data) => [data, null] as const)
        .catch((error) => [null, error as E] as const);
    }

    return [result, null] as const;
  } catch (error) {
    return [null, error as E] as const;
  }
}

function isPromise(value: unknown): value is Promise<unknown> {
  return (
    Boolean(value) &&
    (typeof value === 'object' || typeof value === 'function') &&
    typeof (value as { then?: unknown }).then === 'function'
  );
}
