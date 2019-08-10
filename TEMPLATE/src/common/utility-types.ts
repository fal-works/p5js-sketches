/**
 * -----------------------------------------------------------------------------
 * @module common/utility-types
 */

undefined;

export type Mutable<T> = {
  -readonly [P in keyof T]: T[P];
};
