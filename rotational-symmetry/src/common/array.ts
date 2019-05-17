/**
 * ---- Common array utility -------------------------------------------------
 */

import { ArrayOrValue } from "./dataTypes";

export function loopLimited<T>(
  array: T[],
  callback: (currentValue: T, index?: number, array?: T[]) => any,
  arrayLength: number
) {
  for (let i = 0; i < arrayLength; i += 1) {
    callback(array[i], i, array);
  }
}

/**
 * Runs `callback` once for each element of `array`.
 * Unlike `forEach()`, an element of `array` should not be removed during the iteration.
 * @param array
 * @param callback
 */
export function loop<T>(
  array: T[],
  callback: (currentValue: T, index?: number, array?: T[]) => any
): void {
  const arrayLength = array.length;

  for (let i = 0; i < arrayLength; i += 1) {
    callback(array[i], i, array);
  }
}

export function loopBackwardsLimited<T>(
  array: T[],
  callback: (currentValue: T, index?: number, array?: T[]) => any,
  arrayLength: number
): void {
  if (arrayLength < 0)
    throw new RangeError(`arrayLength ${arrayLength} is invalid.`);

  while (arrayLength--) {
    callback(array[arrayLength], arrayLength, array);
  }
}

/**
 * Runs `callback` once for each element of `array` in descending order.
 * @param array
 * @param callback
 */
export function loopBackwards<T>(
  array: T[],
  callback: (currentValue: T, index?: number, array?: T[]) => any
): void {
  let arrayLength = array.length;

  while (arrayLength--) {
    callback(array[arrayLength], arrayLength, array);
  }
}

export function nestedLoopJoinLimited<T, U>(
  array: T[],
  otherArray: U[],
  callback: (element: T, otherElement: U) => any,
  arrayLength: number,
  otherArrayLength: number
): void {
  for (let i = 0; i < arrayLength; i += 1) {
    for (let k = 0; k < otherArrayLength; k += 1) {
      callback(array[i], otherArray[k]);
    }
  }
}

/**
 * Joins two arrays and runs `callback` once for each joined pair.
 * @param array
 * @param otherArray
 * @param callback
 */
export function nestedLoopJoin<T, U>(
  array: T[],
  otherArray: U[],
  callback: (element: T, otherElement: U) => any
): void {
  nestedLoopJoinLimited(
    array,
    otherArray,
    callback,
    array.length,
    otherArray.length
  );
}

export function roundRobinLimited<T>(
  array: T[],
  callback: (element: T, otherElement: T) => any,
  arrayLength: number
): void {
  const iLen = arrayLength - 1;
  for (let i = 0; i < iLen; i += 1) {
    for (let k = i + 1; k < arrayLength; k += 1) {
      callback(array[i], array[k]);
    }
  }
}

/**
 * Runs `callback` once for each pair within `array`.
 * @param array
 * @param callback
 */
export function roundRobin<T>(
  array: T[],
  callback: (element: T, otherElement: T) => any
): void {
  roundRobinLimited(array, callback, array.length);
}

/**
 * Creates a new 1-dimensional array by concatenating sub-array elements of a 2-dimensional array.
 * @param arrays
 * @return A new 1-dimensional array.
 */
export const flatNaive = <T>(arrays: T[][]): T[] => [].concat.apply([], arrays);

/**
 * An alternative to `Array.prototype.flat()`.
 * @param array
 * @param depth
 * @return A new array.
 */
export const flatRecursive = <T>(array: ArrayOrValue<T>[], depth: number = 1) =>
  depth > 0
    ? array.reduce(
        (acc: ArrayOrValue<T>[], cur): ArrayOrValue<T>[] =>
          acc.concat(Array.isArray(cur) ? flatRecursive(cur, depth - 1) : cur),
        []
      )
    : array;
