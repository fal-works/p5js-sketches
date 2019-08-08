/**
 * ---- Sweepable ------------------------------------------------------------
 */

import { ArrayList } from "./array-list";

export interface Sweepable {
  needsSweep: boolean;
}

export const sweep = <T extends Sweepable>(arrayList: ArrayList<T>) => {
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

export const loopSweep = <T extends Sweepable>(
  arrayList: ArrayList<T>,
  callback: (v: T) => void
) => {
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
