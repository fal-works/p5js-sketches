/**
 * ------------------------------------------------------------------------
 *  Common random utility
 * ------------------------------------------------------------------------
 */

/**
 * Returns random value from `start` up to (but not including) `end`.
 * @param start
 * @param end
 */
export function between(start: number, end: number): number {
  return start + Math.random() * (end - start);
}

/**
 * Returns random integer from 0 up to (but not including) `maxInt`.
 * `maxInt` is not expected to be negative.
 * @param maxInt
 */
export function int(maxInt: number): number {
  return Math.floor(Math.random() * maxInt);
}

/**
 * Returns random integer from the min number up to (but not including) the max number.
 * The case where `minInt < maxInt` is not expected.
 * @param minInt
 * @param maxInt
 */
export function intBetween(minInt: number, maxInt: number): number {
  return minInt + int(maxInt - minInt);
}

/**
 * Returns `n` or `-n` randomly.
 * @param n - any number
 */
export function signed(n: number): number {
  if (Math.random() < 0.5) return n;

  return -n;
}

/**
 * Returns one element of `array` randomly.
 * Throws error if `array` is empty.
 * @param array
 */
export function fromArray<T>(array: T[]): T {
  const length = array.length;
  if (length === 0) throw new Error("Passed empty array.");

  return array[int(length)];
}

/**
 * Removes and returns one element from `array` randomly.
 * Throws error if `array` is empty.
 * @param array
 */
export function removeFromArray<T>(array: T[]): T {
  const length = array.length;
  if (length === 0) throw new Error("Passed empty array.");

  return array.splice(int(length), 1)[0];
}
