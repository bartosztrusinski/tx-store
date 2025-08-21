'use client';

import { type ActionDispatch, useCallback, useEffect, useSyncExternalStore } from 'react';

export function usePersistedReducer<T, A>(
  key: string,
  reducer: (state: T, action: A) => T,
  initialState: T,
): [T, ActionDispatch<[action: A]>] {
  const localStorageState = useSyncExternalStore(
    subscribe,
    () => getLocalStorageItem(key),
    () => JSON.stringify(initialState),
  );

  const state: T = localStorageState ? JSON.parse(localStorageState) : initialState;

  const dispatch = useCallback(
    (action: A) => {
      try {
        const currentState = getLocalStorageItem(key);
        const nextState = reducer(currentState ? JSON.parse(currentState) : initialState, action);

        if (nextState === undefined || nextState === null) {
          removeLocalStorageItem(key);
          return;
        }

        setLocalStorageItem(key, nextState);
      } catch (error) {
        console.warn(error);
      }
    },
    [key, reducer, initialState],
  );

  useEffect(() => {
    if (getLocalStorageItem(key) === null && typeof initialState !== 'undefined') {
      setLocalStorageItem(key, initialState);
    }
  }, [key, initialState]);

  return [state, dispatch];
}

function dispatchStorageEvent(key: string, newValue: string | null) {
  window.dispatchEvent(new StorageEvent('storage', { key, newValue }));
}

function getLocalStorageItem(key: string) {
  return window.localStorage.getItem(key);
}

function removeLocalStorageItem(key: string) {
  window.localStorage.removeItem(key);
  dispatchStorageEvent(key, null);
}

function setLocalStorageItem(key: string, value: unknown) {
  const stringifiedValue = JSON.stringify(value);
  window.localStorage.setItem(key, stringifiedValue);
  dispatchStorageEvent(key, stringifiedValue);
}

function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}
