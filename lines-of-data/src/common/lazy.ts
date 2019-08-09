/**
 * ---- Common lazy evaluation utility ---------------------------------------
 */

export interface Lazy<T> {
  get: () => T;
  clear: () => Lazy<T>;
}

export const lazy = <T>(factory: () => T): Lazy<T> => {
  let value: T | undefined = undefined;
  const lazyObject = {
    get: () => {
      if (!value) value = factory();
      return value;
    },
    clear: () => {
      value = undefined;
      return lazyObject;
    }
  };
  return lazyObject;
};
