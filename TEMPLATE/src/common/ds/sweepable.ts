/**
 * ---- Sweepable ------------------------------------------------------------
 */

import { ArrayList } from "./array-list";

/**
 * An object that has a boolean `needsSweep` property.
 */
export interface Sweepable {
  /**
   * If true, the object will be removed from the belonging `ArrayList`
   * by calling `sweep()` or `loopSweep()`.
   */
  needsSweep: boolean;
}

/**
 * Removes all elements where `needsSweep == true`.
 * @param arrayList
 */
export const sweep = <T extends Sweepable>(arrayList: ArrayList<T>): void => {
  const { array, size } = arrayList;
  let writeIndex = 0;

  for (let readIndex = 0; readIndex < size; readIndex += 1) {
    const element = array[readIndex];

    if (element.needsSweep) continue;

    array[writeIndex] = element;
    writeIndex += 1;
  }

  arrayList.size = writeIndex;
};

/**
 * For each element,
 * 1. Runs `callback`.
 * 2. Removes the element from `arrayList` if `needsSweep == true`.
 *
 * Note: Do not add elements within this loop.
 *
 * @param arrayList
 */
export const loopSweep = <T extends Sweepable>(
  arrayList: ArrayList<T>,
  callback: (v: T) => void
): void => {
  const { array, size } = arrayList;
  let writeIndex = 0;

  for (let readIndex = 0; readIndex < size; readIndex += 1) {
    const element = array[readIndex];
    callback(element);

    if (element.needsSweep) continue;

    array[writeIndex] = element;
    writeIndex += 1;
  }

  arrayList.size = writeIndex;
};
