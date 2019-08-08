/**
 * ---- ArrayList ------------------------------------------------------------
 */

export interface ArrayList<T> {
  array: T[];
  size: number;
}

export const create = <T>(initialCapacity: number) => {
  return {
    array: new Array<T>(initialCapacity),
    size: 0
  };
};

export const add = <T>(arrayList: ArrayList<T>, element: T) => {
  arrayList.array[arrayList.size] = element;
  arrayList.size += 1;
};

export const push = add;

export const pop = <T>(arrayList: ArrayList<T>) => {
  const lastIndex = arrayList.size - 1;
  const removedElement = arrayList.array[lastIndex];
  arrayList.size = lastIndex;

  return removedElement;
};

export const clear = <T>(arrayList: ArrayList<T>) => {
  arrayList.size = 0;
};

export const clearReference = <T>(arrayList: ArrayList<T>) => {
  arrayList.size = 0;
  const array = arrayList.array;
  const capacity = array.length;
  array.length = 0;
  array.length = capacity;
};

export const loop = <T>(arrayList: ArrayList<T>, callback: (v: T) => void) => {
  const { array, size } = arrayList;

  for (let i = 0; i < size; i += 1) callback(array[i]);
};

export const removeShift = <T>(arrayList: ArrayList<T>, index: number) => {
  const { array, size } = arrayList;

  const removedElement = array[index];
  for (let i = index + 1; i < size; i += 1) array[i - 1] = array[i];

  return removedElement;
};

export const removeSwap = <T>(arrayList: ArrayList<T>, index: number) => {
  const array = arrayList.array;

  const removedElement = array[index];
  const lastIndex = arrayList.size - 1;
  array[index] = array[lastIndex];
  arrayList.size = lastIndex;

  return removedElement;
};
