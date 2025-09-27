export function mergeArraysByKey<T extends Record<string, unknown>, K extends keyof T>(
  arr1: T[],
  arr2: T[],
  key: K,
  overlapCallback?: (item1: T, item2: T) => T,
): T[] {
  const map = new Map<T[K], T>(arr1.map((item) => [item[key], item]));
  arr2.forEach((item2) => {
    const item1 = map.get(item2[key]);
    map.set(
      item2[key],
      item1 && overlapCallback ? overlapCallback(item1, item2) : { ...item1, ...item2 },
    );
  });
  return Array.from(map.values());
}
