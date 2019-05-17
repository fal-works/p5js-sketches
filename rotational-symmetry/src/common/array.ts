/**
 * ------------------------------------------------------------------------
 *  Common array utility
 * ------------------------------------------------------------------------
 */

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
 * @param array
 * @param {loopArrayCallBack} callback
 */
export function loop<T>(
  array: T[],
  callback: (currentValue: T, index?: number, array?: T[]) => any
) {
  const arrayLength = array.length;

  for (let i = 0; i < arrayLength; i += 1) {
    callback(array[i], i, array);
  }
}

export function loopBackwardsLimited<T>(
  array: T[],
  callback: (currentValue: T, index?: number, array?: T[]) => any,
  arrayLength: number
) {
  if (arrayLength < 0)
    throw new RangeError(`arrayLength ${arrayLength} is invalid.`);

  while (arrayLength--) {
    callback(array[arrayLength], arrayLength, array);
  }
}

/**
 * Runs `callback` once for each element of `array` in descending order.
 * @param array
 * @param {loopArrayCallback} callback
 */
export function loopBackwards<T>(
  array: T[],
  callback: (currentValue: T, index?: number, array?: T[]) => any
) {
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
) {
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
 * Creates a new 1-dimensional array from a 2-dimensional array.
 * @param arrays
 */
export function flat<T>(arrays: T[][]): T[] {
  return [].concat.apply([], arrays);
}

/**
 * An alternative to `Array.prototype.flat()`.
 * @param array
 */
export function flatRecursive<T>(
  array: (T | T[])[],
  depth: number = 1
): (T | T[])[] {
  if (depth <= 0) return array;

  const accumulator: (T | T[])[] = [];
  const len = array.length;

  for (let i = 0; i < len; i += 1) {
    const currentElement = array[i];

    if (Array.isArray(currentElement))
      accumulator.concat(flatRecursive(currentElement, depth - 1));
    else accumulator.concat(currentElement);
  }

  return accumulator;
}
