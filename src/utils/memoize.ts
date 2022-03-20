/* eslint-disable @typescript-eslint/no-explicit-any */

export function memoize<T>(fn: (...args: T[]) => any, resolver?: (...args: T[]) => any) {
  const cache = new Map();   
  const memoized = function (this: any, ...args: T[]) {
    const key = resolver
      ? resolver(...args)
      : (args.length === 1)
        ? args[0]
        : JSON.stringify(args);
    return cache.has(key)
      ? cache.get(key)
      : cache.set(key, fn.call(this, ...args)) && cache.get(key);
  }
  memoized.cache = cache;
  return memoized;
}
