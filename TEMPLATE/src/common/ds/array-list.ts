/**
 * ---- ArrayList ------------------------------------------------------------
 */

undefined;

/**
 * A basic array-based list.
 * Used for avoiding reallocation by adding or removing elements of `Array`.
 */
export interface ArrayList<T> {
  /**
   * The raw array that holds elements.
   * This should be dense but may not be filled.
   */
  array: T[];

  /**
   * The number of valid elements in `array`.
   */
  size: number;
}

export const create = <T>(initialCapacity: number): ArrayList<T> => {
  return {
    array: new Array<T>(initialCapacity),
    size: 0
  };
};

export const add = <T>(arrayList: ArrayList<T>, element: T): void => {
  arrayList.array[arrayList.size] = element;
  arrayList.size += 1;
};

export const push = add;

export const pop = <T>(arrayList: ArrayList<T>): T => {
  const lastIndex = arrayList.size - 1;
  const removedElement = arrayList.array[lastIndex];
  arrayList.size = lastIndex;

  return removedElement;
};

/**
 * Clears the contents of `arrayList`.
 * This just sets `size` to `0` and does not nullify references.
 * @param arrayList
 */
export const clear = <T>(arrayList: ArrayList<T>): void => {
  arrayList.size = 0;
};

/**
 * Clears the contents of `arrayList` and also nullifies all references..
 * @param arrayList
 */
export const clearReference = <T>(arrayList: ArrayList<T>): void => {
  arrayList.size = 0;
  const array = arrayList.array;
  const capacity = array.length;
  array.length = 0;
  array.length = capacity;
};

/**
 * Runs `callback` for each element of `arrayList`.
 * @param arrayList
 * @param callback
 */
export const loop = <T>(
  arrayList: ArrayList<T>,
  callback: (v: T) => void
): void => {
  const { array, size } = arrayList;

  for (let i = 0; i < size; i += 1) callback(array[i]);
};

/**
 * Removes the element at `index`.
 * All subsequent elements will be shifted to the previous index.
 * @param arrayList
 * @param index
 * @return The removed element.
 */
export const removeShift = <T>(arrayList: ArrayList<T>, index: number): T => {
  const { array, size } = arrayList;

  const removedElement = array[index];
  for (let i = index + 1; i < size; i += 1) array[i - 1] = array[i];

  return removedElement;
};

/**
 * Removes the element at `index` by moving the last element to `index` and overwriting the existing value.
 * Faster than `removeShift()` and may be useful if you do not need to preserve order of elements.
 *
 * @param arrayList
 * @param index
 * @return The removed element.
 */
export const removeSwap = <T>(arrayList: ArrayList<T>, index: number): T => {
  const array = arrayList.array;

  const removedElement = array[index];
  const lastIndex = arrayList.size - 1;
  array[index] = array[lastIndex];
  arrayList.size = lastIndex;

  return removedElement;
};
