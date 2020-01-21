/**
 * Jumber.
 * Source code in TypeScript: https://github.com/fal-works/p5js-sketches/tree/master/jumber
 *
 * Bundled libraries:
 *   @fal-works/creative-coding-core (MIT license)
 *   @fal-works/p5-extension (MIT license)
 *
 * @copyright 2020 FAL
 * @version 0.1.0
 */

(function(p5) {
  "use strict";

  p5 = p5 && p5.hasOwnProperty("default") ? p5["default"] : p5;

  /**
   * creative-coding-core
   *
   * Utility library that might be useful for creative coding.
   * GitHub repository: {@link https://github.com/fal-works/creative-coding-core}
   *
   * @module creative-coding-core
   * @copyright 2019-2020 FAL
   * @author FAL <contact@fal-works.com>
   * @license MIT
   * @version 0.7.2
   */

  /**
   * Runs `callback` once for each element of `array` from index `start` up to (but not including) `end`.
   * Unlike `Array.prototype.forEach()`, an element of `array` should not be removed during the iteration.
   * @param array
   * @param callback
   */
  const loopRange = (array, callback, start, end) => {
    for (let i = start; i < end; i += 1) callback(array[i], i, array);
  };
  /**
   * Runs `callback` once for each element of `array`.
   * Unlike `Array.prototype.forEach()`, an element of `array` should not be removed during the iteration.
   * @param array
   * @param callback
   */
  const loop = (array, callback) => loopRange(array, callback, 0, array.length);
  /**
   * Runs `callback` once for each element of `array` from index `start` up to (but not including) `end` in descending order.
   * @param array
   * @param callback
   */
  const loopRangeBackwards = (array, callback, start, end) => {
    let index = end;
    while (index > start) {
      --index;
      callback(array[index], index, array);
    }
  };
  /**
   * Runs `callback` once for each element of `array` in descending order.
   * @param array
   * @param callback
   */
  const loopBackwards = (array, callback) =>
    loopRangeBackwards(array, callback, 0, array.length);
  /**
   * Joins two arrays within the specified range and runs `callback` once for each joined pair.
   * You should not remove elements from arrays during the iteration.
   * @param arrayA
   * @param arrayB
   * @param callback
   * @param endA
   * @param endB
   */
  const nestedLoopJoinWithRange = (
    arrayA,
    arrayB,
    callback,
    startA,
    endA,
    startB,
    endB
  ) => {
    for (let i = startA; i < endA; i += 1) {
      for (let k = startB; k < endB; k += 1) callback(arrayA[i], arrayB[k]);
    }
  };
  /**
   * Joins two arrays and runs `callback` once for each joined pair.
   * You should not remove elements from arrays during the iteration.
   * @param arrayA
   * @param arrayB
   * @param callback
   */
  const nestedLoopJoin = (arrayA, arrayB, callback) =>
    nestedLoopJoinWithRange(
      arrayA,
      arrayB,
      callback,
      0,
      arrayA.length,
      0,
      arrayB.length
    );
  /**
   * Runs `callback` once for each pair within `array` from index `start` up to (but not including) `end`.
   * @param array
   * @param callback
   */
  const roundRobinWithRange = (array, callback, start, end) => {
    const iLen = end - 1;
    for (let i = start; i < iLen; i += 1) {
      for (let k = i + 1; k < end; k += 1) callback(array[i], array[k]);
    }
  };
  /**
   * Runs `callback` once for each pair within `array`.
   * @param array
   * @param callback
   */
  const roundRobin = (array, callback) =>
    roundRobinWithRange(array, callback, 0, array.length);
  /**
   * Unifies `arrayOrValue` to array format.
   * @param arrayOrValue - Either an array, value or undefined.
   *   - If already an array, a shallow copy is returned.
   *   - If falsy, a new empty array is returned.
   * @returns A new array.
   */
  const unifyToArray = arrayOrValue =>
    arrayOrValue
      ? Array.isArray(arrayOrValue)
        ? arrayOrValue.slice()
        : [arrayOrValue]
      : [];
  /**
   * Creates a new 1-dimensional array by concatenating sub-array elements of a 2-dimensional array.
   * @param arrays
   * @returns A new 1-dimensional array.
   */
  const flatNaive = arrays => [].concat(...arrays);
  /**
   * An alternative to `Array.prototype.flat()`.
   * @param array
   * @param depth
   * @returns A new array.
   */
  const flatRecursive = (array, depth = 1) =>
    depth > 0
      ? array.reduce(
          (acc, cur) =>
            acc.concat(
              Array.isArray(cur) ? flatRecursive(cur, depth - 1) : cur
            ),
          []
        )
      : array;
  /**
   * Fills `array` by running `factory` and assigning the result for each index of `array`.
   * @param array
   * @param factory A function that returns a new element for assigning to `array`.
   * @param length The length to populate. Default value is `array.length`.
   * @returns Filled `array`.
   */
  const populate = (array, factory, length) => {
    const len = length || array.length;
    for (let i = 0; i < len; i += 1) array[i] = factory(i);
    return array;
  };
  /**
   * Creates a new array filled by running `factory` for each index and assigning the result.
   * @param factory
   * @param length
   * @returns A new populated array.
   */
  const createPopulated = (factory, length) =>
    populate(new Array(length), factory);
  /**
   * Creates a new array of integer numbers starting from `0`.
   * @param length
   * @returns A new number array.
   */
  const createIntegerSequence = length => {
    const array = new Array(length);
    for (let i = 0; i < length; i += 1) array[i] = i;
    return array;
  };
  /**
   * Creates a new array of numbers within `range`.
   * @param range
   * @returns A new number array.
   */
  const fromRange = range => {
    const { start, end } = range;
    const length = end - start;
    const array = new Array(length);
    for (let i = 0; i < length; i += 1) array[i] = start + i;
    return array;
  };
  /**
   * Creates a new array by filtering and mapping `array`.
   * @param array
   * @param callback
   * @returns New array, filtered and mapped.
   */
  const filterMap = (array, callback) => {
    const result = [];
    const len = array.length;
    for (let i = 0; i < len; i += 1) {
      const mappedValue = callback(array[i], i, array);
      if (mappedValue !== undefined) result.push(mappedValue);
    }
    return result;
  };
  /**
   * Runs each function of `functionArray` without any arguments.
   * An element of `functionArray` should not be removed during the iteration.
   * @param functionArray
   * @param argument
   */
  const loopRun = functionArray => {
    const len = functionArray.length;
    for (let i = 0; i < len; i += 1) functionArray[i]();
  };
  /**
   * Runs each function of `functionArray` with given `argument`.
   * An element of `functionArray` should not be removed during the iteration.
   * @param functionArray
   * @param argument
   */
  const loopRunWithArgument = (functionArray, argument) => {
    const len = functionArray.length;
    for (let i = 0; i < len; i += 1) functionArray[i](argument);
  };
  /**
   * Copies values from `source` to `destination`.
   * @param destination
   * @param source
   * @param destinationPosition
   * @param sourcePosition
   * @param length
   */
  const blit = (
    destination,
    source,
    destinationPosition,
    sourcePosition,
    length
  ) => {
    let i = length;
    while (i) {
      i -= 1;
      destination[destinationPosition + i] = source[sourcePosition + i];
    }
  };

  const fullName = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    loopArrayRange: loopRange,
    loopArray: loop,
    loopArrayRangeBackwards: loopRangeBackwards,
    loopArrayBackwards: loopBackwards,
    arrayNestedLoopJoinWithRange: nestedLoopJoinWithRange,
    arrayNestedLoopJoin: nestedLoopJoin,
    arrayRoundRobinWithRange: roundRobinWithRange,
    arrayRoundRobin: roundRobin,
    unifyToArray: unifyToArray,
    flatArrayNaive: flatNaive,
    flatArrayRecursive: flatRecursive,
    populateArray: populate,
    createPopulatedArray: createPopulated,
    createIntegerSequence: createIntegerSequence,
    arrayFromRange: fromRange,
    filterMapArray: filterMap,
    loopRunArray: loopRun,
    loopRunArrayWithArgument: loopRunWithArgument,
    blitArray: blit
  });

  const index = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    FullName: fullName,
    loopRange: loopRange,
    loop: loop,
    loopRangeBackwards: loopRangeBackwards,
    loopBackwards: loopBackwards,
    nestedLoopJoinWithRange: nestedLoopJoinWithRange,
    nestedLoopJoin: nestedLoopJoin,
    roundRobinWithRange: roundRobinWithRange,
    roundRobin: roundRobin,
    unifyToArray: unifyToArray,
    flatNaive: flatNaive,
    flatRecursive: flatRecursive,
    populate: populate,
    createPopulated: createPopulated,
    createIntegerSequence: createIntegerSequence,
    fromRange: fromRange,
    filterMap: filterMap,
    loopRun: loopRun,
    loopRunWithArgument: loopRunWithArgument,
    blit: blit
  });

  /**
   * Creates an array-list unit.
   * @param initialCapacity
   */
  const create = initialCapacity => {
    return {
      array: new Array(initialCapacity),
      size: 0
    };
  };
  /**
   * Creates an array-list unit filled with `value`.
   * @param size
   * @param value
   */
  const createFilled = (size, value) => {
    return {
      array: new Array(size).fill(value),
      size
    };
  };
  /**
   * Creates an array-list unit, filled by running `factory` and assignint the result for each index.
   * @param size
   * @param factory
   */
  const createPopulated$1 = (size, factory) => {
    return {
      array: populate(new Array(size), factory),
      size
    };
  };
  /**
   * Creates an array-list unit by reusing the reference to `array`.
   * The `size` of the array-list will be `array.length`.
   * Be sure that `array` is filled with valid elements.
   *
   * @param array
   * @returns A new array-list unit.
   */
  const fromArray = array => {
    return {
      array,
      size: array.length
    };
  };
  /**
   * Adds `element` to `arrayList`.
   * @param arrayList
   * @param element
   */
  const add = (arrayList, element) => {
    arrayList.array[arrayList.size] = element;
    arrayList.size += 1;
  };
  /**
   * Adds `element` to `arrayList`. Same as `add()`.
   * @param arrayList
   * @param element
   */
  const push = add;
  /**
   * Removes and returns the last element of `arrayList`.
   * Be sure that `arrayList` is not empty.
   * @param arrayList
   * @returns The last element of `arrayList`.
   */
  const pop = arrayList => {
    const lastIndex = arrayList.size - 1;
    const removedElement = arrayList.array[lastIndex];
    arrayList.size = lastIndex;
    return removedElement;
  };
  /**
   * Returns the element of `arrayList` at `index`.
   * @param arrayList
   * @returns The element of `arrayList` at `index`.
   */
  const get = (arrayList, index) => arrayList.array[index];
  /**
   * Returns the last element of `arrayList`.
   * Be sure that `arrayList` is not empty.
   * @param arrayList
   * @returns The last element of `arrayList`.
   */
  const peek = arrayList => arrayList.array[arrayList.size - 1];
  /**
   * Returns the last element of `arrayList`.
   * Be sure that `arrayList` is not empty.
   * Same as `peek()`.
   * @param arrayList
   * @returns The last element of `arrayList`.
   */
  const getLast = peek;
  /**
   * Adds all elements of `array` to `arrayList`.
   * @param arrayList
   * @param array
   */
  const addArray = (arrayList, array) => {
    const { array: thisArray, size: destinaionPosition } = arrayList;
    const len = array.length;
    let i = len;
    while (i) {
      i -= 1;
      thisArray[destinaionPosition + i] = array[i];
    }
    arrayList.size += len;
  };
  /**
   * Adds all elements of `source` to `destination`.
   * @param destination
   * @param source
   */
  const addList = (destination, source) => {
    const { array: destinationArray, size: destinaionPosition } = destination;
    const { array: sourceArray, size: len } = source;
    let i = len;
    while (i) {
      i -= 1;
      destinationArray[destinaionPosition + i] = sourceArray[i];
    }
    destination.size += len;
  };
  /**
   * Clears the contents of `arrayList`.
   * This just sets `size` to `0` and does not nullify references.
   * @param arrayList
   */
  const clear = arrayList => {
    arrayList.size = 0;
  };
  /**
   * Nullifies the slots that are not used.
   * @param arrayList
   */
  const cleanUnusedSlots = arrayList => {
    const { array, size } = arrayList;
    const capacity = array.length;
    array.length = size;
    array.length = capacity;
  };
  /**
   * Clears the contents of `arrayList` and also nullifies all references.
   * @param arrayList
   */
  const clearReference = arrayList => {
    arrayList.size = 0;
    cleanUnusedSlots(arrayList);
  };
  /**
   * Runs `callback` for each element of `arrayList`.
   * @param arrayList
   * @param callback
   */
  const loop$1 = (arrayList, callback) =>
    loopRange(arrayList.array, callback, 0, arrayList.size);
  /**
   * Runs `callback` for each element of `arrayList` in descending order.
   * @param arrayList
   * @param callback
   */
  const loopBackwards$1 = (arrayList, callback) =>
    loopRangeBackwards(arrayList.array, callback, 0, arrayList.size);
  /**
   * Finds the first element where `predicate` returns true.
   * @param arrayList
   * @param predicate Function that returns `true` if a given value matches the condition.
   * @returns The found `element`. `undefined` if not found.
   */
  const find = (arrayList, predicate) => {
    const { array, size } = arrayList;
    for (let i = 0; i < size; i += 1) {
      if (predicate(array[i], i, array)) return array[i];
    }
    return undefined;
  };
  /**
   * Finds `element` in `arrayList`.
   * @param arrayList
   * @param element
   * @returns The index of `element`. `-1` if not found.
   */
  const findIndex = (arrayList, element) => {
    const { array, size } = arrayList;
    for (let i = 0; i < size; i += 1) {
      if (array[i] === element) return i;
    }
    return -1;
  };
  /**
   * Removes the element at `index`.
   * All subsequent elements will be shifted to the previous index.
   * @param arrayList
   * @param index
   * @returns The removed element.
   */
  const removeShift = (arrayList, index) => {
    const { array, size } = arrayList;
    const removedElement = array[index];
    array.copyWithin(index, index + 1, size);
    arrayList.size = size - 1;
    return removedElement;
  };
  /**
   * Removes `element`.
   * All subsequent elements will be shifted to the previous index.
   * @param arrayList
   * @param element
   * @returns The removed element, or `null` if not found.
   */
  const removeShiftElement = (arrayList, element) => {
    const index = findIndex(arrayList, element);
    if (index >= 0) return removeShift(arrayList, index);
    return null;
  };
  /**
   * Removes the element at `index` by moving the last element to `index` and overwriting the existing value.
   * Faster than `removeShift()` and may be useful if you do not need to preserve order of elements.
   *
   * @param arrayList
   * @param index
   * @returns The removed element.
   */
  const removeSwap = (arrayList, index) => {
    const array = arrayList.array;
    const removedElement = array[index];
    const lastIndex = arrayList.size - 1;
    array[index] = array[lastIndex];
    arrayList.size = lastIndex;
    return removedElement;
  };
  /**
   * Removes `element` by replacing it with the last element.
   * @param arrayList
   * @param element
   * @returns The removed element, or `null` if not found.
   */
  const removeSwapElement = (arrayList, element) => {
    const index = findIndex(arrayList, element);
    if (index >= 0) return removeSwap(arrayList, index);
    return null;
  };
  /**
   * Runs `predicate` for each element and removes the element if `predicate` returns `true`.
   * This does not use `removeShift()` internally.
   *
   * Note: Do not add elements within this loop.
   *
   * @param arrayList
   * @param predicate
   * @returns `true` if any element has been removed.
   */
  const removeShiftAll = (arrayList, predicate) => {
    const { array, size } = arrayList;
    let writeIndex = 0;
    let found = false;
    for (let readIndex = 0; readIndex < size; readIndex += 1) {
      const value = array[readIndex];
      if (predicate(value, readIndex, array)) {
        found = true;
        continue;
      }
      array[writeIndex] = value;
      writeIndex += 1;
    }
    arrayList.size = writeIndex;
    return found;
  };
  /**
   * Run `removeSwap()` for all indices of element where `predicate` returns true.
   * @param arrayList
   * @param predicate
   * @returns `true` if any element has been removed.
   */
  const removeSwapAll = (arrayList, predicate) => {
    let found = false;
    const array = arrayList.array;
    for (let i = 0; i < arrayList.size; i += 1) {
      if (predicate(array[i], i, array)) {
        removeSwap(arrayList, i);
        found = true;
      }
    }
    return found;
  };
  /**
   * Fills the entire `arrayList` by running `factory` and assigning result for each index.
   * @param arrayList
   * @param factory
   */
  const populate$1 = (arrayList, factory) => {
    populate(arrayList.array, factory);
    arrayList.size = arrayList.array.length;
    return arrayList;
  };
  /**
   * Joins two arrayLists and runs `callback` once for each joined pair.
   * You should not remove elements from arrayLists during the iteration.
   * @param arrayListA
   * @param arrayListB
   * @param callback
   */
  const nestedLoopJoin$1 = (arrayListA, arrayListB, callback) =>
    nestedLoopJoinWithRange(
      arrayListA.array,
      arrayListB.array,
      callback,
      0,
      arrayListA.size,
      0,
      arrayListB.size
    );
  /**
   * Runs `callback` once for each pair within `arrayList`.
   * @param arrayList
   * @param callback
   */
  const roundRobin$1 = (arrayList, callback) =>
    roundRobinWithRange(arrayList.array, callback, 0, arrayList.size);

  const fullName$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    createArrayList: create,
    createFilledArrayList: createFilled,
    createPopulatedArrayList: createPopulated$1,
    arrayListFromArray: fromArray,
    addToArrayList: add,
    pushToArrayList: push,
    popFromArrayList: pop,
    getFromArrayList: get,
    peekFromArrayList: peek,
    getLastFromArrayList: getLast,
    addArrayToArrayList: addArray,
    addListToArrayList: addList,
    clearArrayList: clear,
    cleanUnusedSlotsOfArrayList: cleanUnusedSlots,
    clearReferenceOfArrayList: clearReference,
    loopArrayList: loop$1,
    loopArrayListBackwards: loopBackwards$1,
    findInArrayList: find,
    findIndexInArrayList: findIndex,
    removeShiftFromArrayList: removeShift,
    removeShiftElementFromArrayList: removeShiftElement,
    removeSwapFromArrayList: removeSwap,
    removeSwapElementFromArrayList: removeSwapElement,
    removeShiftAllFromArrayList: removeShiftAll,
    removeSwapAllFromArrayList: removeSwapAll,
    populateArrayList: populate$1,
    arrayListNestedLoopJoin: nestedLoopJoin$1,
    arrayListRoundRobin: roundRobin$1
  });

  const index$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    FullName: fullName$1,
    create: create,
    createFilled: createFilled,
    createPopulated: createPopulated$1,
    fromArray: fromArray,
    add: add,
    push: push,
    pop: pop,
    get: get,
    peek: peek,
    getLast: getLast,
    addArray: addArray,
    addList: addList,
    clear: clear,
    cleanUnusedSlots: cleanUnusedSlots,
    clearReference: clearReference,
    loop: loop$1,
    loopBackwards: loopBackwards$1,
    find: find,
    findIndex: findIndex,
    removeShift: removeShift,
    removeShiftElement: removeShiftElement,
    removeSwap: removeSwap,
    removeSwapElement: removeSwapElement,
    removeShiftAll: removeShiftAll,
    removeSwapAll: removeSwapAll,
    populate: populate$1,
    nestedLoopJoin: nestedLoopJoin$1,
    roundRobin: roundRobin$1
  });

  /**
   * Creates an array-based queue.
   * @param capacity
   * @returns A queue object.
   */
  const create$1 = capacity => ({
    array: new Array(capacity),
    headIndex: 0,
    tailIndex: 0,
    size: 0
  });
  /**
   * Checks if `queue` is empty.
   * @param queue
   * @returns `true` if `queue.size === 0`.
   */
  const isEmpty = queue => queue.size === 0;
  /**
   * Checks if `queue` is full.
   * @param queue
   * @returns `true` if `queue.size === queue.array.length`.
   */
  const isFull = queue => queue.size === queue.array.length;
  /**
   * Adds `element` to `queue` as the last (newest) element.
   * Be sure that `queue` is not full.
   * @param queue
   * @param element
   */
  const enqueue = (queue, element) => {
    const { array, tailIndex } = queue;
    array[tailIndex] = element;
    const nextTailIndex = tailIndex + 1;
    queue.tailIndex = nextTailIndex < array.length ? nextTailIndex : 0;
    queue.size += 1;
  };
  /**
   * Adds `element` to `queue` as the last (newest) element if `queue` is not yet full.
   * @param queue
   * @param element
   */
  const enqueueSafe = (queue, element) => {
    if (!isFull(queue)) enqueue(queue, element);
  };
  /**
   * Removes the top (oldest) element from `queue`.
   * Be sure that `queue` is not empty.
   * @param queue
   * @returns Removed element.
   */
  const dequeue = queue => {
    const { array, headIndex } = queue;
    const nextHeadIndex = headIndex + 1;
    queue.headIndex = nextHeadIndex < array.length ? nextHeadIndex : 0;
    queue.size -= 1;
    return array[headIndex];
  };
  /**
   * Removes the top (oldest) element from `queue` if `queue` is not empty.
   * @param queue
   * @returns Removed element, or `undefined` if empty.
   */
  const dequeueSafe = queue => (isEmpty(queue) ? undefined : dequeue(queue));
  /**
   * Removes the top (oldest) element from `queue` only if `queue` is full.
   * @param queue
   * @returns Removed element, or `undefined` if not full.
   */
  const dequeueIfFull = queue => (isFull(queue) ? dequeue(queue) : undefined);
  /**
   * Retunrs the top (oldest) element from `queue`.
   * Be sure that `queue` is not empty.
   * @param queue
   * @returns Removed element.
   */
  const peek$1 = queue => queue.array[queue.headIndex];
  /**
   * Retunrs the top (oldest) element from `queue`.
   * @param queue
   * @returns Removed element, or `undefined` if empty.
   */
  const peekSafe = queue => {
    const { headIndex } = queue;
    return headIndex !== queue.tailIndex ? queue.array[headIndex] : undefined;
  };
  /**
   * Runs `callback` for each element of `queue`.
   * @param arrayList
   * @param callback
   */
  const loop$2 = (queue, callback) => {
    if (queue.size === 0) return;
    const { array, headIndex, tailIndex } = queue;
    if (headIndex < tailIndex) {
      loopRange(array, callback, headIndex, tailIndex);
      return;
    }
    loopRange(array, callback, headIndex, array.length);
    loopRange(array, callback, 0, tailIndex);
  };
  /**
   * Removes the top (oldest) element from `queue` if `predicate` returns true.
   * Be sure that `queue` is not empty.
   * @param queue
   * @param predicate Function that returns `true` if a given value matches the condition.
   * @returns Removed element, or `undefined` if not removed.
   */
  const dequeueIf = (queue, predicate) => {
    const { array, headIndex } = queue;
    const topElement = array[headIndex];
    if (!predicate(topElement)) return undefined;
    const nextHeadIndex = headIndex + 1;
    queue.headIndex = nextHeadIndex < array.length ? nextHeadIndex : 0;
    queue.size -= 1;
    return topElement;
  };
  /**
   * Removes the top (oldest) element from `queue` if `predicate` returns true.
   * @param queue
   * @param predicate Function that returns `true` if a given value matches the condition.
   * @returns Removed element, or `undefined` if empty or not removed.
   */
  const dequeueSafeIf = (queue, predicate) =>
    isEmpty(queue) ? undefined : dequeueIf(queue, predicate);
  /**
   * Clears the contents of `queue`.
   * This does not nullify references.
   * @param queue
   */
  const clear$1 = queue => {
    queue.headIndex = 0;
    queue.tailIndex = 0;
    queue.size = 0;
  };
  /**
   * Clears the contents of `queue` and also nullifies all references.
   * @param queue
   */
  const clearReference$1 = queue => {
    clear$1(queue);
    const { array } = queue;
    const capacity = array.length;
    array.length = 0;
    array.length = capacity;
  };

  const fullName$2 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    createArrayQueue: create$1,
    arrayQueueIsEmpty: isEmpty,
    arrayQueueIsFull: isFull,
    enqueue: enqueue,
    enqueueSafe: enqueueSafe,
    dequeue: dequeue,
    dequeueSafe: dequeueSafe,
    dequeueIfFull: dequeueIfFull,
    loopArrayQueue: loop$2,
    peekArrayQueue: peek$1,
    peekArrayQueueSafe: peekSafe,
    dequeueIf: dequeueIf,
    dequeueSafeIf: dequeueSafeIf,
    clearArrayQueue: clear$1,
    clearArrayQueueReference: clearReference$1
  });

  const index$2 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    FullName: fullName$2,
    create: create$1,
    isEmpty: isEmpty,
    isFull: isFull,
    enqueue: enqueue,
    enqueueSafe: enqueueSafe,
    dequeue: dequeue,
    dequeueSafe: dequeueSafe,
    dequeueIfFull: dequeueIfFull,
    peek: peek$1,
    peekSafe: peekSafe,
    loop: loop$2,
    dequeueIf: dequeueIf,
    dequeueSafeIf: dequeueSafeIf,
    clear: clear$1,
    clearReference: clearReference$1
  });

  const create$2 = factory => {
    return {
      value: undefined,
      factory
    };
  };
  const get$1 = object => object.value || (object.value = object.factory());
  const clear$2 = object => {
    object.value = undefined;
  };

  const lazy = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    create: create$2,
    get: get$1,
    clear: clear$2
  });

  const from = (prototypeStructure, length) => {
    const data = {};
    for (const key of Object.keys(prototypeStructure))
      data[key] = new Array(length).fill(prototypeStructure[key]);
    return {
      data,
      length
    };
  };

  const structureOfArrays = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    from: from
  });

  const {
    abs,
    acos,
    asin,
    atan,
    atan2,
    ceil,
    cos,
    exp,
    floor,
    log,
    max,
    min,
    pow,
    round,
    sin,
    sqrt,
    tan,
    clz32,
    imul,
    sign,
    log10,
    log2,
    log1p,
    expm1,
    cosh,
    sinh,
    tanh,
    acosh,
    asinh,
    atanh,
    hypot,
    trunc,
    fround,
    cbrt
  } = Math;
  /**
   * Same as `Math.sqrt`.
   * @returns √x
   */
  const squareRoot = sqrt;
  /**
   * Same as `Math.clz32`.
   */
  const leadingZeros32 = clz32;
  /**
   * Same as `Math.imul`.
   */
  const multInt = imul;
  /**
   * Same as `Math.hypot`.
   */
  const hypotenuse = hypot;
  /**
   * Same as `Math.trunc`.
   */
  const integerPart = trunc;
  /**
   * Same as `Math.fround`.
   */
  const floatRound = fround;
  /**
   * Same as `Math.cbrt`.
   * @returns ∛x
   */
  const cubeRoot = cbrt;
  const square = v => v * v;
  const cube = v => v * v * v;
  const pow4 = v => square(v * v);
  const pow5 = v => square(v * v) * v;
  const squareInt = v => imul(v, v);
  const cubeInt = v => imul(imul(v, v), v);
  /**
   * Checks whether `a` and `b` are considered equal.
   * @param a
   * @param b
   * @returns `true` if the absolute difference of `a` and `b` is smaller than `Number.EPSILON`.
   */
  const equal = (a, b) => abs(a - b) < 2.220446049250313e-16;
  /**
   * Similar to `Math.min` but accepts only two arguments.
   * @param a
   * @param b
   * @returns The smaller of `a` or `b`.
   */
  const min2 = (a, b) => (a < b ? a : b);
  /**
   * Similar to `Math.max` but accepts only two arguments.
   * @param a
   * @param b
   * @returns The larger of `a` or `b`.
   */
  const max2 = (a, b) => (a > b ? a : b);
  /**
   * Safe version of `Math.atan2`;
   * @param y
   * @param x
   * @returns The angle from x-axis to the point. `0` if both `x` and `y` are `0`.
   */
  const atan2safe = (y, x) => (y !== 0 || x !== 0 ? atan2(y, x) : 0);
  /**
   * Calculates the sum of squares of `x` and `y`.
   * @param x
   * @param y
   * @returns `x^2 + y^2`.
   */
  const hypotenuseSquared2D = (x, y) => x * x + y * y;
  /**
   * A 2D version of `Math.hypot`. Calculates the square root of the sum of squares of `x` and `y`.
   * @param x
   * @param y
   * @returns `√(x^2 + y^2)`.
   */
  const hypotenuse2D = (x, y) => sqrt(x * x + y * y);
  /**
   * Linearly interpolates between `start` and `end` by `ratio`.
   * The result will not be clamped.
   * @param start
   * @param end
   * @param ratio
   * @returns Interpolated value, e.g. `start` if `ratio == 0`, `end` if `ratio == 1`.
   */
  const lerp = (start, end, ratio) => start + ratio * (end - start);
  /**
   * Clamps `value` between `min` and `max`.
   * @param value
   * @param min
   * @param max
   * @returns Clamped value equal or greater than `min` and equal or less than `max`.
   */
  const clamp = (value, min, max) =>
    value < min ? min : value > max ? max : value;
  /**
   * Clamps `value` between `min` and `max`, or returns the average of them if `min > max`.
   * @param value
   * @param min
   * @param max
   * @returns Constrained value.
   */
  const constrain = (value, min, max) =>
    min > max ? (min + max) / 2 : value < min ? min : value > max ? max : value;
  /**
   * Maps `value` from the range [`inStart`, `inEnd`] to the range [`outStart`, `outEnd`].
   * @param value
   * @param inStart
   * @param inEnd
   * @param outStart
   * @param outEnd
   * @returns Mapped value (unclamped).
   */
  const map = (value, inStart, inEnd, outStart, outEnd) =>
    outStart + ((outEnd - outStart) * (value - inStart)) / (inEnd - inStart);
  /**
   * Creates a mapping function that maps `value` from the range [`inStart`, `inEnd`] to the range [`outStart`, `outEnd`].
   * @param inStart
   * @param inEnd
   * @param outStart
   * @param outEnd
   * @returns New mapping function.
   */
  const createMap = (inStart, inEnd, outStart, outEnd) => {
    const inLength = inEnd - inStart;
    const outLength = outEnd - outStart;
    return value => outStart + (outLength * (value - inStart)) / inLength;
  };
  /**
   * Maps `value` from the range [`start`, `end`] to the range [0, 1].
   * @param value
   * @param start
   * @param end
   * @returns Mapped value between 0 and 1 (unclamped).
   */
  const inverseLerp = (value, start, end) => (value - start) / (end - start);

  const numeric = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    abs: abs,
    acos: acos,
    asin: asin,
    atan: atan,
    atan2: atan2,
    ceil: ceil,
    cos: cos,
    exp: exp,
    floor: floor,
    log: log,
    max: max,
    min: min,
    pow: pow,
    round: round,
    sin: sin,
    sqrt: sqrt,
    tan: tan,
    clz32: clz32,
    imul: imul,
    sign: sign,
    log10: log10,
    log2: log2,
    log1p: log1p,
    expm1: expm1,
    cosh: cosh,
    sinh: sinh,
    tanh: tanh,
    acosh: acosh,
    asinh: asinh,
    atanh: atanh,
    hypot: hypot,
    trunc: trunc,
    fround: fround,
    cbrt: cbrt,
    squareRoot: squareRoot,
    leadingZeros32: leadingZeros32,
    multInt: multInt,
    hypotenuse: hypotenuse,
    integerPart: integerPart,
    floatRound: floatRound,
    cubeRoot: cubeRoot,
    square: square,
    cube: cube,
    pow4: pow4,
    pow5: pow5,
    squareInt: squareInt,
    cubeInt: cubeInt,
    equal: equal,
    min2: min2,
    max2: max2,
    atan2safe: atan2safe,
    hypotenuseSquared2D: hypotenuseSquared2D,
    hypotenuse2D: hypotenuse2D,
    lerp: lerp,
    clamp: clamp,
    constrain: constrain,
    map: map,
    createMap: createMap,
    inverseLerp: inverseLerp
  });

  const { E, LN10, LN2, LOG2E, LOG10E } = Math;
  const ONE_HALF = 1 / 2;
  const ONE_THIRD = 1 / 3;
  const TWO_THIRDS = 2 / 3;
  const ONE_QUARTER = 1 / 4;
  const TWO_QUARTERS = ONE_HALF;
  const THREE_QUARTERS = 3 / 4;
  const INVERSE30 = 1 / 30;
  const INVERSE60 = 1 / 60;
  const INVERSE255 = 1 / 255;
  /**
   * √2
   */
  const SQUARE_ROOT_TWO = Math.SQRT2;
  /**
   * √(1 / 2) = 1 / √2 = √2 / 2
   */
  const SQUARE_ROOT_ONE_HALF = Math.SQRT1_2;
  /**
   * √3
   */
  const SQUARE_ROOT_THREE = Math.sqrt(3);
  /**
   * 1 / √2 = √(1 / 2) = √2 / 2
   */
  const ONE_OVER_SQUARE_ROOT_TWO = SQUARE_ROOT_ONE_HALF;
  /**
   * 2 / √2 = √2
   */
  const TWO_OVER_SQUARE_ROOT_TWO = SQUARE_ROOT_TWO;
  /**
   * 1 / √3
   */
  const ONE_OVER_SQUARE_ROOT_THREE = 1 / SQUARE_ROOT_THREE;
  /**
   * 2 / √3
   */
  const TWO_OVER_SQUARE_ROOT_THREE = 2 / SQUARE_ROOT_THREE;
  /**
   * √3 / 2
   */
  const SQUARE_ROOT_THREE_OVER_TWO = SQUARE_ROOT_THREE / 2;
  /**
   * √2 / 2 = √(1 / 2) = 1 / √2
   */
  const SQUARE_ROOT_TWO_OVER_TWO = SQUARE_ROOT_ONE_HALF;

  const constants = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    E: E,
    LN10: LN10,
    LN2: LN2,
    LOG2E: LOG2E,
    LOG10E: LOG10E,
    ONE_HALF: ONE_HALF,
    ONE_THIRD: ONE_THIRD,
    TWO_THIRDS: TWO_THIRDS,
    ONE_QUARTER: ONE_QUARTER,
    TWO_QUARTERS: TWO_QUARTERS,
    THREE_QUARTERS: THREE_QUARTERS,
    INVERSE30: INVERSE30,
    INVERSE60: INVERSE60,
    INVERSE255: INVERSE255,
    SQUARE_ROOT_TWO: SQUARE_ROOT_TWO,
    SQUARE_ROOT_ONE_HALF: SQUARE_ROOT_ONE_HALF,
    SQUARE_ROOT_THREE: SQUARE_ROOT_THREE,
    ONE_OVER_SQUARE_ROOT_TWO: ONE_OVER_SQUARE_ROOT_TWO,
    TWO_OVER_SQUARE_ROOT_TWO: TWO_OVER_SQUARE_ROOT_TWO,
    ONE_OVER_SQUARE_ROOT_THREE: ONE_OVER_SQUARE_ROOT_THREE,
    TWO_OVER_SQUARE_ROOT_THREE: TWO_OVER_SQUARE_ROOT_THREE,
    SQUARE_ROOT_THREE_OVER_TWO: SQUARE_ROOT_THREE_OVER_TWO,
    SQUARE_ROOT_TWO_OVER_TWO: SQUARE_ROOT_TWO_OVER_TWO
  });

  const PI = Math.PI;
  const TWO_PI = 2 * PI;
  const HALF_PI = PI / 2;
  const THIRD_PI = PI / 3;
  const QUARTER_PI = PI / 4;
  const THREE_QUARTERS_PI = 3 * QUARTER_PI;
  const SIN30 = ONE_HALF;
  const SIN45 = ONE_OVER_SQUARE_ROOT_TWO;
  const SIN60 = SQUARE_ROOT_THREE_OVER_TWO;
  const COS30 = SIN60;
  const COS45 = SIN45;
  const COS60 = SIN30;
  const DEGREES_TO_RADIANS = TWO_PI / 360;
  const RADIANS_TO_DEGREES = 360 / TWO_PI;
  const createArray = resolution => {
    const array = new Array(resolution);
    const interval = TWO_PI / resolution;
    for (let i = 0; i < resolution; i += 1) array[i] = i * interval;
    return array;
  };
  const fromDegrees = degrees => DEGREES_TO_RADIANS * degrees;
  const toDegrees = radians => RADIANS_TO_DEGREES * radians;
  /**
   * Calculates the angle in radians from origin to `position`.
   * @param position
   * @returns The angle. `0` if `position` is a zero vector.
   */
  const fromOrigin = position => {
    const { x, y } = position;
    return x !== 0 || y !== 0 ? atan2(position.y, position.x) : 0;
  };
  /**
   * Calculates the angle in radians between two points.
   * @param from
   * @param to
   * @returns The angle. `0` if both points are the same.
   */
  const betweenPoints = (from, to) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    return dx !== 0 || dy !== 0 ? atan2(dy, dx) : 0;
  };
  /**
   * Calculates the angle in radians between two points.
   * @returns The angle. `0` if both points are the same.
   */
  const betweenCoordinates = (x1, y1, x2, y2) =>
    x1 !== x2 || y1 !== y2 ? atan2(x2 - x1, y2 - y1) : 0;

  const angle = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    PI: PI,
    TWO_PI: TWO_PI,
    HALF_PI: HALF_PI,
    THIRD_PI: THIRD_PI,
    QUARTER_PI: QUARTER_PI,
    THREE_QUARTERS_PI: THREE_QUARTERS_PI,
    SIN30: SIN30,
    SIN45: SIN45,
    SIN60: SIN60,
    COS30: COS30,
    COS45: COS45,
    COS60: COS60,
    DEGREES_TO_RADIANS: DEGREES_TO_RADIANS,
    RADIANS_TO_DEGREES: RADIANS_TO_DEGREES,
    createArray: createArray,
    fromDegrees: fromDegrees,
    toDegrees: toDegrees,
    fromOrigin: fromOrigin,
    betweenPoints: betweenPoints,
    betweenCoordinates: betweenCoordinates
  });

  /**
   * @param x
   * @param y
   * @returns A new 2D vector.
   */
  const create$3 = (x, y) => ({ x, y });
  /**
   * Zero vector.
   */
  const zero = {
    x: 0,
    y: 0
  };
  /**
   * Checks if a given vector is completely zero.
   * @param v
   * @returns `true` if zero.
   */
  const isZero = v => v.x === 0 && v.y === 0;
  /**
   * Creates a new vector from polar coordinates `angle` and `length`.
   * @param length
   * @param angle
   * @returns new `Vector2D`.
   */
  const fromPolar = (length, angle) => {
    return {
      x: length * cos(angle),
      y: length * sin(angle)
    };
  };
  /**
   * Creates a new vector by adding two vectors.
   * @param a
   * @param b
   * @returns new `Vector2D`.
   */
  const add$1 = (a, b) => {
    return {
      x: a.x + b.x,
      y: a.y + b.y
    };
  };
  /**
   * Creates a new vector by adding cartesian coordinates.
   * @param vector
   * @param x
   * @param y
   * @returns new `Vector2D`.
   */
  const addCartesian = (vector, x, y) => {
    return {
      x: vector.x + x,
      y: vector.y + y
    };
  };
  /**
   * Creates a new vector by adding polar coordinates.
   * @param vector
   * @param length
   * @param angle
   * @returns new `Vector2D`.
   */
  const addPolar = (vector, length, angle) => {
    return {
      x: vector.x + length * cos(angle),
      y: vector.y + length * sin(angle)
    };
  };
  /**
   * Creates a new vector by subtracting `b` from `a`.
   * @param a
   * @param b
   * @returns new `Vector2D`.
   */
  const subtract = (a, b) => {
    return {
      x: a.x - b.x,
      y: a.y - b.y
    };
  };
  /**
   * Creates a new vector by subtracting cartesian coordinates.
   * @param vector
   * @param x
   * @param y
   * @returns new `Vector2D`.
   */
  const subtractCartesian = (vector, x, y) => {
    return {
      x: vector.x - x,
      y: vector.y - y
    };
  };
  /**
   * Creates a new vector by subtracting polar coordinates.
   * @param vector
   * @param length
   * @param angle
   * @returns new `Vector2D`.
   */
  const subtractPolar = (vector, length, angle) => {
    return {
      x: vector.x - length * cos(angle),
      y: vector.y - length * sin(angle)
    };
  };
  /**
   * Creates a new vector with multiplied values.
   * @param vector
   * @param multiplier
   * @returns new `Vector2D`.
   */
  const multiply = (vector, multiplier) => {
    return {
      x: vector.x * multiplier,
      y: vector.y * multiplier
    };
  };
  /**
   * Creates a new vector with divided values.
   * @param vector
   * @param multiplier
   * @returns new `Vector2D`.
   */
  const divide = (vector, divisor) => {
    return {
      x: vector.x / divisor,
      y: vector.y / divisor
    };
  };
  /**
   * Calculates square of distance between `vectorA` and `vectorB`.
   * @param vectorA
   * @param vectorB
   * @returns Square of distance.
   */
  const distanceSquared = (vectorA, vectorB) =>
    hypotenuseSquared2D(vectorB.x - vectorA.x, vectorB.y - vectorA.y);
  /**
   * Calculates distance between `vectorA` and `vectorB`.
   * @param vectorA
   * @param vectorB
   * @returns Distance.
   */
  const distance = (vectorA, vectorB) =>
    hypotenuse2D(vectorB.x - vectorA.x, vectorB.y - vectorA.y);
  /**
   * Returns string e.g. `{x:0,y:0}`
   * @param vector
   * @returns String expression.
   */
  const toStr = vector => `{x:${vector.x},y:${vector.y}}`;
  /**
   * Creates a new vector with same values.
   * @param vector
   */
  const copy = vector => {
    return {
      x: vector.x,
      y: vector.y
    };
  };
  /**
   * Calculates squared length of `vector`.
   * @param vector
   * @returns The squared length.
   */
  const lengthSquared = vector => hypotenuseSquared2D(vector.x, vector.y);
  /**
   * Calculates length of `vector`.
   * @param vector
   * @returns The length.
   */
  const length = vector => hypotenuse2D(vector.x, vector.y);
  /**
   * Calculates angle of `vector` in radians.
   * @param vector
   * @returns The angle. `0` if `vector` is a zero vector.
   */
  const angle$1 = vector => {
    const { x, y } = vector;
    return x !== 0 || y !== 0 ? atan2(vector.y, vector.x) : 0;
  };
  /**
   * Calculates the dot product of `vectorA` and `vectorB`.
   * @param vectorA
   * @param vectorB
   * @returns The dot product.
   */
  const dot = (vectorA, vectorB) =>
    vectorA.x * vectorB.x + vectorA.y * vectorB.y;
  /**
   * Creates a new unit vector from `vector`.
   * @param vector
   * @returns new `Vector2D`.
   */
  const normalize = vector => {
    const { x, y } = vector;
    const length = hypotenuse2D(x, y);
    return {
      x: x / length,
      y: y / length
    };
  };
  /**
   * Creates a new normal unit vector from a point to another.
   * @param to
   * @param from
   * @returns new `Vector2D`.
   */
  const normalizeBetween = (from, to) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = hypotenuse2D(dx, dy);
    return {
      x: dx / distance,
      y: dy / distance
    };
  };

  /**
   * @returns A new mutable 2D vector.
   */
  const create$4 = () => ({ x: 0, y: 0 });
  const add$2 = (vector, otherVector) => {
    vector.x += otherVector.x;
    vector.y += otherVector.y;
    return vector;
  };
  const addCartesian$1 = (vector, x, y) => {
    vector.x += x;
    vector.y += y;
    return vector;
  };
  const addPolar$1 = (vector, length, angle) => {
    vector.x += length * cos(angle);
    vector.y += length * sin(angle);
    return vector;
  };
  const subtract$1 = (vector, otherVector) => {
    vector.x -= otherVector.x;
    vector.y -= otherVector.y;
    return vector;
  };
  const subtractCartesian$1 = (vector, x, y) => {
    vector.x -= x;
    vector.y -= y;
    return vector;
  };
  const subtractPolar$1 = (vector, length, angle) => {
    vector.x -= length * cos(angle);
    vector.y -= length * sin(angle);
    return vector;
  };
  const set = (vector, sourceVector) => {
    vector.x = sourceVector.x;
    vector.y = sourceVector.y;
    return vector;
  };
  const setCartesian = (vector, x, y) => {
    vector.x = x;
    vector.y = y;
    return vector;
  };
  const setPolar = (vector, length, angle) => {
    vector.x = length * cos(angle);
    vector.y = length * sin(angle);
    return vector;
  };
  const multiply$1 = (vector, multiplier) => {
    vector.x *= multiplier;
    vector.y *= multiplier;
    return vector;
  };
  const divide$1 = (vector, divisor) => {
    const multiplier = 1 / divisor;
    vector.x *= multiplier;
    vector.y *= multiplier;
    return vector;
  };
  const clamp$1 = (vector, minX, maxX, minY, maxY) => {
    vector.x = clamp(vector.x, minX, maxX);
    vector.y = clamp(vector.y, minY, maxY);
    return vector;
  };
  const constrain$1 = (vector, minX, maxX, minY, maxY) => {
    vector.x = constrain(vector.x, minX, maxX);
    vector.y = constrain(vector.y, minY, maxY);
    return vector;
  };
  /**
   * Updates `vector` so that the distance from another point will be at least equal or larger than `minDistance`.
   * @param vector
   * @param from
   * @param minDistance
   */
  const separate = (vector, from, minDistance) => {
    const distanceSquared$1 = distanceSquared(vector, from);
    if (distanceSquared$1 >= minDistance * minDistance) return vector;
    const angle$1 = betweenPoints(from, vector);
    vector.x = from.x + minDistance * cos(angle$1);
    vector.y = from.y + minDistance * sin(angle$1);
    return vector;
  };
  /**
   * Updates `a` and `b` so that the distance will be at least equal or larger than `minDistance`.
   * @param a
   * @param b
   * @param minDistance
   * @param midPointRatio The ratio for determining the midpoint from `a` to `b`.
   */
  const separateEachOther = (a, b, minDistance, midPointRatio) => {
    const distanceSquared$1 = distanceSquared(a, b);
    if (distanceSquared$1 >= minDistance * minDistance) return;
    const angleFromA = betweenPoints(a, b);
    const midX = lerp(a.x, b.x, midPointRatio);
    const midY = lerp(a.y, b.y, midPointRatio);
    const halfMinDistance = minDistance / 2;
    const bDisplacementX = halfMinDistance * cos(angleFromA);
    const bDisplacementY = halfMinDistance * sin(angleFromA);
    b.x = midX + bDisplacementX;
    b.y = midY + bDisplacementY;
    a.x = midX - bDisplacementX;
    a.y = midY - bDisplacementY;
    return;
  };

  const mutable = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    create: create$4,
    add: add$2,
    addCartesian: addCartesian$1,
    addPolar: addPolar$1,
    subtract: subtract$1,
    subtractCartesian: subtractCartesian$1,
    subtractPolar: subtractPolar$1,
    set: set,
    setCartesian: setCartesian,
    setPolar: setPolar,
    multiply: multiply$1,
    divide: divide$1,
    clamp: clamp$1,
    constrain: constrain$1,
    separate: separate,
    separateEachOther: separateEachOther
  });

  const add$3 = (sourceA, sourceB, target) => {
    target.x = sourceA.x + sourceB.x;
    target.y = sourceA.y + sourceB.y;
    return target;
  };
  const addCartesian$2 = (source, x, y, target) => {
    target.x = source.x + x;
    target.y = source.y + y;
    return target;
  };
  const addPolar$2 = (source, length, angle, target) => {
    target.x = source.x + length * cos(angle);
    target.y = source.y + length * sin(angle);
    return target;
  };
  const subtract$2 = (sourceA, sourceB, target) => {
    target.x = sourceA.x - sourceB.x;
    target.y = sourceA.y - sourceB.y;
    return target;
  };
  const subtractCartesian$2 = (source, x, y, target) => {
    target.x = source.x - x;
    target.y = source.y - y;
    return target;
  };
  const subtractPolar$2 = (source, length, angle, target) => {
    target.x = source.x - length * cos(angle);
    target.y = source.y - length * sin(angle);
    return target;
  };
  const setCartesian$1 = (x, y, target) => {
    target.x = x;
    target.y = y;
    return target;
  };
  const setPolar$1 = (length, angle, target) => {
    target.x = length * cos(angle);
    target.y = length * sin(angle);
    return target;
  };
  const multiply$2 = (source, multiplier, target) => {
    target.x = source.x * multiplier;
    target.y = source.y * multiplier;
    return target;
  };
  const divide$2 = (source, divisor, target) => {
    const multiplier = 1 / divisor;
    target.x = source.x * multiplier;
    target.y = source.y * multiplier;
    return target;
  };
  const clamp$2 = (vector, minX, maxX, minY, maxY, target) => {
    target.x = clamp(vector.x, minX, maxX);
    target.y = clamp(vector.y, minY, maxY);
    return target;
  };
  const constrain$2 = (vector, minX, maxX, minY, maxY, target) => {
    target.x = constrain(vector.x, minX, maxX);
    target.y = constrain(vector.y, minY, maxY);
    return target;
  };
  const normalize$1 = (vector, target) => {
    const { x, y } = vector;
    const length = hypotenuse2D(x, y);
    target.x = x / length;
    target.y = y / length;
    return target;
  };
  const normalizeBetween$1 = (from, to, target) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = hypotenuse2D(dx, dy);
    target.x = dx / distance;
    target.y = dy / distance;
    return target;
  };

  const assign = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    add: add$3,
    addCartesian: addCartesian$2,
    addPolar: addPolar$2,
    subtract: subtract$2,
    subtractCartesian: subtractCartesian$2,
    subtractPolar: subtractPolar$2,
    setCartesian: setCartesian$1,
    setPolar: setPolar$1,
    multiply: multiply$2,
    divide: divide$2,
    clamp: clamp$2,
    constrain: constrain$2,
    normalize: normalize$1,
    normalizeBetween: normalizeBetween$1
  });

  const fullName$3 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    createVector: create$3,
    zeroVector: zero,
    vectorIsZero: isZero,
    vectorFromPolar: fromPolar,
    addVector: add$1,
    addCartesian: addCartesian,
    addPolar: addPolar,
    subtractVector: subtract,
    subtractCartesian: subtractCartesian,
    subtractPolar: subtractPolar,
    multiplyVector: multiply,
    divideVector: divide,
    distanceOfVectorsSquared: distanceSquared,
    distanceOfVectors: distance,
    vectorToStr: toStr,
    copyVector: copy,
    vectorLengthSquared: lengthSquared,
    vectorLength: length,
    vectorAngle: angle$1,
    createVectorMutable: create$4,
    addVectorMutable: add$2,
    addCartesianMutable: addCartesian$1,
    addPolarMutable: addPolar$1,
    subtractVectorMutable: subtract$1,
    subtractCartesianMutable: subtractCartesian$1,
    subtractPolarMutable: subtractPolar$1,
    setVector: set,
    setCartesian: setCartesian,
    setPolar: setPolar,
    multiplyVectorMutable: multiply$1,
    divideVectorMutable: divide$1,
    clampVector: clamp$1,
    constrainVector: constrain$1,
    separateVector: separate,
    separateVectors: separateEachOther,
    addVectorAssign: add$3,
    addCartesianAssign: addCartesian$2,
    addPolarAssign: addPolar$2,
    subtractVectorAssign: subtract$2,
    subtractCartesianAssign: subtractCartesian$2,
    subtractPolarAssign: subtractPolar$2,
    multiplyVectorAssign: multiply$2,
    divideVectorAssign: divide$2,
    clampVectorAssign: clamp$2,
    constrainVectorAssign: constrain$2
  });

  const index$3 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Mutable: mutable,
    Assign: assign,
    FullName: fullName$3,
    create: create$3,
    zero: zero,
    isZero: isZero,
    fromPolar: fromPolar,
    add: add$1,
    addCartesian: addCartesian,
    addPolar: addPolar,
    subtract: subtract,
    subtractCartesian: subtractCartesian,
    subtractPolar: subtractPolar,
    multiply: multiply,
    divide: divide,
    distanceSquared: distanceSquared,
    distance: distance,
    toStr: toStr,
    copy: copy,
    lengthSquared: lengthSquared,
    length: length,
    angle: angle$1,
    dot: dot,
    normalize: normalize,
    normalizeBetween: normalizeBetween
  });

  const create$5 = (topLeftPosition, size) => ({
    topLeft: topLeftPosition,
    bottomRight: {
      x: topLeftPosition.x + size.width,
      y: topLeftPosition.y + size.height
    }
  });
  const createFromCenter = (centerPosition, size) => {
    const { x, y } = centerPosition;
    const halfWidth = size.width / 2;
    const halfHeight = size.height / 2;
    return {
      topLeft: { x: x - halfWidth, y: y - halfHeight },
      bottomRight: { x: x + halfWidth, y: y + halfHeight }
    };
  };
  /**
   * Checks if `region` contains `point`.
   * @param region
   * @param point
   * @param margin
   * @returns `true` if contained.
   */
  const containsPoint = (region, point, margin) => {
    const { topLeft, bottomRight } = region;
    const { x, y } = point;
    return (
      x >= topLeft.x + margin &&
      y >= topLeft.y + margin &&
      x < bottomRight.x - margin &&
      y < bottomRight.y - margin
    );
  };
  const getWidth = region => region.bottomRight.x - region.topLeft.x;
  const getHeight = region => region.bottomRight.y - region.topLeft.y;
  const getSize = region => {
    const { topLeft, bottomRight } = region;
    return {
      width: bottomRight.x - topLeft.x,
      height: bottomRight.y - topLeft.y
    };
  };
  /**
   * Returns the center point of `region`.
   * Note that the result will be invalid if the region is infinite.
   * @param region
   * @return The center point.
   */
  const getCenterPoint = region => {
    const { topLeft, bottomRight } = region;
    return {
      x: (topLeft.x + bottomRight.x) / 2,
      y: (topLeft.y + bottomRight.y) / 2
    };
  };
  /**
   * Creates a new `RectangleRegion` by scaling `region` with `scaleFactor`.
   * @param region
   * @param scaleFactor
   * @param originType
   * @returns A new scaled `RectangleRegion` unit.
   */
  const createScaled = (region, scaleFactor, originType) => {
    const { topLeft, bottomRight } = region;
    switch (originType) {
      case 0:
        return {
          topLeft,
          bottomRight: {
            x: lerp(topLeft.x, bottomRight.x, scaleFactor),
            y: lerp(topLeft.y, bottomRight.y, scaleFactor)
          }
        };
      case 1: {
        const center = getCenterPoint(region);
        const size = getSize(region);
        const halfWidth = scaleFactor * (size.width / 2);
        const halfHeight = scaleFactor * (size.height / 2);
        return {
          topLeft: {
            x: center.x - halfWidth,
            y: center.y - halfHeight
          },
          bottomRight: {
            x: center.x + halfWidth,
            y: center.y + halfHeight
          }
        };
      }
    }
  };
  /**
   * Clones the given `RectangleRegion` instance;
   * @param region
   * @returns The cloned instance.
   */
  const copy$1 = region => ({
    topLeft: copy(region.topLeft),
    bottomRight: copy(region.bottomRight)
  });
  /**
   * @returns A `RectangleRegion` instance with `Infinity` values.
   */
  const createInfinite = () => ({
    topLeft: { x: -Infinity, y: -Infinity },
    bottomRight: { x: Infinity, y: Infinity }
  });
  /**
   * Creates a new `RectangleRegion` by adding `margin` to `region`.
   * @param region
   * @param margin
   * @returns A new `RectangleRegion` unit.
   */
  const addMargin = (region, margin) => {
    const {
      topLeft: originalTopLeft,
      bottomRight: originalBottomRight
    } = region;
    return {
      topLeft: {
        x: originalTopLeft.x - margin,
        y: originalTopLeft.y - margin
      },
      bottomRight: {
        x: originalBottomRight.x + margin,
        y: originalBottomRight.y + margin
      }
    };
  };
  /**
   * Creates a new `RectangleRegion` by adding `margins` to `region`.
   * @param region
   * @param margins
   * @returns A new `RectangleRegion` unit.
   */
  const addMargins = (region, margins) => {
    const {
      topLeft: originalTopLeft,
      bottomRight: originalBottomRight
    } = region;
    return {
      topLeft: {
        x: originalTopLeft.x - margins.left,
        y: originalTopLeft.y - margins.top
      },
      bottomRight: {
        x: originalBottomRight.x + margins.right,
        y: originalBottomRight.y + margins.bottom
      }
    };
  };

  const rectangleRegion = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    create: create$5,
    createFromCenter: createFromCenter,
    containsPoint: containsPoint,
    getWidth: getWidth,
    getHeight: getHeight,
    getSize: getSize,
    getCenterPoint: getCenterPoint,
    createScaled: createScaled,
    copy: copy$1,
    createInfinite: createInfinite,
    addMargin: addMargin,
    addMargins: addMargins
  });

  /**
   * Calculates the aspect ratio i.e. `width / height`.
   * @param size
   */
  const getAspectRatio = size => size.width / size.height;
  /**
   * Calculates the area i.e. `width * height`.
   * @param size
   */
  const getArea = size => size.width * size.height;
  /**
   * @returns A `RectangleSize` instance with `Infinity` values.
   */
  const createInfinite$1 = () => ({
    width: Infinity,
    height: Infinity
  });

  const rectangleSize = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    getAspectRatio: getAspectRatio,
    getArea: getArea,
    createInfinite: createInfinite$1
  });

  const createCurve = vertexPropertyList => {
    const paths = [];
    const len = vertexPropertyList.length;
    let previousVertex = vertexPropertyList[0];
    let previousControlLine = previousVertex.controlLine;
    for (let i = 1; i < len; i += 1) {
      const currentVertex = vertexPropertyList[i];
      const currentControlLine = currentVertex.controlLine;
      paths.push({
        controlPoint1: addPolar(
          previousVertex.point,
          0.5 * previousControlLine.length,
          previousControlLine.angle
        ),
        controlPoint2: subtractPolar(
          currentVertex.point,
          0.5 * currentControlLine.length,
          currentControlLine.angle
        ),
        targetPoint: currentVertex.point
      });
      previousVertex = currentVertex;
      previousControlLine = currentControlLine;
    }
    return {
      startPoint: vertexPropertyList[0].point,
      paths
    };
  };

  const bezier = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    createCurve: createCurve
  });

  /**
   * Calculates the squared distance between [`x1`, `y1`] and [`x2`, `y2`];
   * @param x1
   * @param y1
   * @param x2
   * @param y2
   * @returns `dx^2 + dy^2`.
   */
  const distanceSquared$1 = (x1, y1, x2, y2) =>
    hypotenuseSquared2D(x2 - x1, y2 - y1);
  /**
   * Calculates the distance between [`x1`, `y1`] and [`x2`, `y2`];
   * @param x1
   * @param y1
   * @param x2
   * @param y2
   * @returns `√(dx^2 + dy^2)`.
   */
  const distance$1 = (x1, y1, x2, y2) => hypotenuse2D(x2 - x1, y2 - y1);

  const coordinates2d = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    distanceSquared: distanceSquared$1,
    distance: distance$1
  });

  /**
   * "easeInQuad" function.
   * @param x Any ratio.
   * @returns Eased ratio. `0` if x=0, `1` if x=1.
   */
  const quad = square;
  /**
   * "easeInCubic" function.
   * @param x Any ratio.
   * @returns Eased ratio. `0` if x=0, `1` if x=1.
   */
  const cubic = cube;
  /**
   * "easeInQuart" function.
   * @param x Any ratio.
   * @returns Eased ratio. `0` if x=0, `1` if x=1.
   */
  const quart = pow4;
  /**
   * "easeInExpo" function.
   * @param x Any ratio.
   * @returns Eased ratio. `0` if x=0, `1` if x=1.
   */
  const expo = x => (x ? pow(2, 10 * (x - 1)) : 0);
  /**
   * Creates a new "easeInBack" function with `coefficient`.
   * @param coefficient Defaults to 1.70158
   * @returns "easeInBack" function.
   */
  const createBack = (coefficient = 1.70158) => x =>
    x * x * ((coefficient + 1) * x - coefficient);

  const _in = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    quad: quad,
    cubic: cubic,
    quart: quart,
    expo: expo,
    createBack: createBack
  });

  /**
   * "easeOutQuad" function.
   * @param x Any ratio.
   * @returns Eased ratio. `0` if x=0, `1` if x=1.
   */
  const quad$1 = x => -square(x - 1) + 1;
  /**
   * "easeOutCubic" function.
   * @param x Any ratio.
   * @returns Eased ratio. `0` if x=0, `1` if x=1.
   */
  const cubic$1 = x => cube(x - 1) + 1;
  /**
   * "easeOutQuart" function.
   * @param x Any ratio.
   * @returns Eased ratio. `0` if x=0, `1` if x=1.
   */
  const quart$1 = x => -pow4(x - 1) + 1;
  /**
   * "easeOutExpo" function.
   * @param x Any ratio.
   * @returns Eased ratio. `0` if x=0, `1` if x=1.
   */
  const expo$1 = x => (x < 1 ? -pow(2, -10 * x) + 1 : 1);
  /**
   * Creates a new "easeOutBack" function with `coefficient`.
   * @param coefficient Defaults to 1.70158
   * @returns "easeOutBack" function.
   */
  const createBack$1 = (coefficient = 1.70158) => {
    return x => {
      const r = x - 1;
      const r2 = r * r;
      return (coefficient + 1) * (r * r2) + coefficient * r2 + 1;
    };
  };

  const out = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    quad: quad$1,
    cubic: cubic$1,
    quart: quart$1,
    expo: expo$1,
    createBack: createBack$1
  });

  /**
   * Concatenates two easing functions without normalization.
   * @param easingA - Any easing function.
   * @param easingB - Any easing function.
   * @param thresholdRatio - Defaults to `0.5`.
   * @returns New easing function.
   */
  const concatenate = (easingA, easingB, thresholdRatio = 0.5) => {
    const inverseThresholdRatio = 1 / thresholdRatio;
    return ratio => {
      if (ratio < thresholdRatio) return easingA(inverseThresholdRatio * ratio);
      else {
        const ratioB = 1 - thresholdRatio;
        return easingB((ratio - thresholdRatio) / ratioB);
      }
    };
  };
  /**
   * Integrates two easing functions.
   * Results of both functions will be normalized depending on `thresholdRatio`.
   * @param easingA - Any easing function.
   * @param easingB - Any easing function.
   * @param thresholdRatio - Defaults to `0.5`.
   * @returns New easing function.
   */
  const integrate = (easingA, easingB, thresholdRatio = 0.5) => {
    const inverseThresholdRatio = 1 / thresholdRatio;
    return ratio => {
      if (ratio < thresholdRatio)
        return thresholdRatio * easingA(inverseThresholdRatio * ratio);
      else {
        const ratioB = 1 - thresholdRatio;
        return (
          thresholdRatio + ratioB * easingB((ratio - thresholdRatio) / ratioB)
        );
      }
    };
  };

  /**
   * "easeInOutQuad" function.
   * @param x Any ratio.
   * @returns Eased ratio. `0` if x=0, `1` if x=1.
   */
  const quad$2 = integrate(quad, quad$1);
  /**
   * "easeInOutCubic" function.
   * @param x Any ratio.
   * @returns Eased ratio. `0` if x=0, `1` if x=1.
   */
  const cubic$2 = integrate(cubic, cubic$1);
  /**
   * "easeInOutQuart" function.
   * @param x Any ratio.
   * @returns Eased ratio. `0` if x=0, `1` if x=1.
   */
  const quart$2 = integrate(quart, quart$1);
  /**
   * "easeInOutExpo" function.
   * @param x Any ratio.
   * @returns Eased ratio. `0` if x=0, `1` if x=1.
   */
  const expo$2 = integrate(expo, expo$1);
  /**
   * Creates a new "easeInOutBack" function with `coefficient`.
   * @param coefficient Defaults to 1.70158
   * @returns "easeInOutBack" function.
   */
  const createBack$2 = coefficient =>
    integrate(createBack(coefficient), createBack$1(coefficient));

  const inOut = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    quad: quad$2,
    cubic: cubic$2,
    quart: quart$2,
    expo: expo$2,
    createBack: createBack$2
  });

  /**
   * "easeOutInQuad" function.
   * @param x Any ratio.
   * @returns Eased ratio. `0` if x=0, `1` if x=1.
   */
  const quad$3 = integrate(quad$1, quad);
  /**
   * "easeOutInCubic" function.
   * @param x Any ratio.
   * @returns Eased ratio. `0` if x=0, `1` if x=1.
   */
  const cubic$3 = integrate(cubic$1, cubic);
  /**
   * "easeOutInQuart" function.
   * @param x Any ratio.
   * @returns Eased ratio. `0` if x=0, `1` if x=1.
   */
  const quart$3 = integrate(quart$1, quart);
  /**
   * "easeOutInExpo" function.
   * @param x Any ratio.
   * @returns Eased ratio. `0` if x=0, `1` if x=1.
   */
  const expo$3 = integrate(expo$1, expo);
  /**
   * Creates a new "easeOutInBack" function with `coefficient`.
   * @param coefficient Defaults to 1.70158
   * @returns "easeOutInBack" function.
   */
  const createBack$3 = coefficient =>
    integrate(createBack$1(coefficient), createBack(coefficient));

  const outIn = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    quad: quad$3,
    cubic: cubic$3,
    quart: quart$3,
    expo: expo$3,
    createBack: createBack$3
  });

  /**
   * "easeLinear" function.
   * @param x Any ratio.
   * @returns Eased ratio (same as `x`). `0` if x=0, `1` if x=1.
   */
  const linear = x => x;

  const fullName$4 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    easeInQuad: quad,
    easeInCubic: cubic,
    easeInQuart: quart,
    easeInExpo: expo,
    createEaseInBack: createBack,
    easeOutQuad: quad$1,
    easeOutCubic: cubic$1,
    easeOutQuart: quart$1,
    easeOutExpo: expo$1,
    createEaseOutBack: createBack$1,
    easeInOutQuad: quad$2,
    easeInOutCubic: cubic$2,
    easeInOutQuart: quart$2,
    easeInOutExpo: expo$2,
    createEaseInOutBack: createBack$2,
    easeOutInQuad: quad$3,
    easeOutInCubic: cubic$3,
    easeOutInQuart: quart$3,
    easeOutInExpo: expo$3,
    createEaseOutInBack: createBack$3,
    easeLinear: linear,
    concatenateEasing: concatenate,
    integrateEasing: integrate
  });

  const index$4 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    In: _in,
    Out: out,
    InOut: inOut,
    OutIn: outIn,
    FullName: fullName$4,
    linear: linear,
    concatenate: concatenate,
    integrate: integrate
  });

  /**
   * The base random function that returns a random number from `0` up to (but not including) `1`.
   * Defaults to `Math.random`.
   * @returns A random value.
   */
  let random = Math.random;
  /**
   * Returns random value from `0` up to (but not including) `1`.
   * @returns A random value.
   */
  let ratio = random;
  /**
   * Sets `randomFunction` as the base function (which is initially set to `Math.random`)
   * so that it will be used as the base of all `Random` functions.
   * @param randomFunction - Any function that returns a (pseudo-)random number from `0` up to (but not including) `1`.
   */
  const setBaseFunction = randomFunction => {
    random = randomFunction;
    ratio = randomFunction;
  };

  /**
   * Returns random value from `0` up to (but not including) `max`.
   * @param max
   * @returns A random value.
   */
  const value = max => random() * max;
  /**
   * Returns random value from `0` to (but not including) `2 * PI`.
   * @returns A random radians value.
   */
  const angle$2 = () => random() * TWO_PI;
  /**
   * Returns random value from `start` up to (but not including) `end`.
   * @param start
   * @param end
   * @returns A random value.
   */
  const between = (start, end) => start + random() * (end - start);
  /**
   * Returns random value from `range.start` up to (but not including) `range.end`.
   * @param range
   * @returns A random value.
   */
  const inRange = range => between(range.start, range.end);
  /**
   * Returns `true` or `false` randomly.
   * @param probability A number between 0 and 1.
   * @returns `true` with the given `probability`.
   */
  const bool = probability => random() < probability;
  /**
   * Returns `1` or `-1` randomly.
   * @param positiveProbability A number between 0 and 1 for the probability of a positive value being returned.
   * @returns Either `1` or `-1`.
   */
  const sign$1 = positiveProbability =>
    random() < positiveProbability ? 1 : -1;
  /**
   * Returns a positive or negative value randomly with a magnitude from `0` up to (but not including) `maxMagnitude`.
   * @param maxMagnitude
   * @returns A random value.
   */
  const signed = maxMagnitude =>
    (random() < 0.5 ? 1 : -1) * random() * maxMagnitude;
  /**
   * Returns a positive or negative value randomly with a magnitude from `0` up to (but not including) `PI`.
   * @returns A random radians value.
   */
  const signedAngle = () => (random() < 0.5 ? 1 : -1) * random() * PI;

  /**
   * Returns a new vector with `length` and random angle.
   * @param length
   * @returns New `Vector2D` unit.
   */
  const vector = length => fromPolar(length, angle$2());
  /**
   * Returns a random point in `region`.
   * @param region
   * @returns Random `Vector2D`.
   */
  const pointInRectangleRegion = region => {
    const { topLeft, bottomRight } = region;
    return {
      x: between(topLeft.x, bottomRight.x),
      y: between(topLeft.y, bottomRight.y)
    };
  };

  /**
   * Returns random integer from 0 up to (but not including) `maxInt`.
   * `maxInt` is not expected to be negative.
   * @param maxInt
   * @returns A random integer value.
   */
  const value$1 = maxInt => floor(random() * maxInt);
  /**
   * Returns random integer from `minInt` up to (but not including) `maxInt`.
   * The case where `minInt > maxInt` or `maxInt <= 0` is not expected.
   * @param minInt
   * @param maxInt
   * @returns A random integer value.
   */
  const between$1 = (minInt, maxInt) =>
    minInt + floor(random() * (maxInt - minInt));
  /**
   * Returns a positive or negative integer randomly
   * with a magnitude from `0` up to (but not including) `maxMagnitude`.
   * @param maxMagnitude
   * @returns A random signed value.
   */
  const signed$1 = maxMagnitude =>
    (random() < 0.5 ? 1 : -1) * floor(random() * maxMagnitude);

  const integer = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    value: value$1,
    between: between$1,
    signed: signed$1
  });

  /**
   * Returns a random value at intervals of `step` from `0` up to (but not including) `1`.
   * @param step - E.g. if `0.25`, the result is either `0`, `0.25`, `0.5` or `0.75`.
   * @returns A random value.
   */
  const ratio$1 = step => floor(random() / step) * step;
  /**
   * Returns a random value at intervals of `step` from `0` up to (but not including) `max`.
   * @param step
   * @param max
   * @returns A random value.
   */
  const value$2 = (step, max) => floor(random() * (max / step)) * step;
  /**
   * Returns a random value at intervals of `step` from `min` up to (but not including) `max`.
   * @param step
   * @param min
   * @param max
   * @returns A random value.
   */
  const between$2 = (step, min, max) =>
    min + floor(random() * ((max - min) / step)) * step;
  /**
   * Returns a positive or negative value randomly at intervals of `step`
   * with a magnitude from `0` up to (but not including) `maxMagnitude`.
   * @param step
   * @param maxMagnitude
   * @returns A random signed value.
   */
  const signed$2 = (step, maxMagnitude) =>
    (random() < 0.5 ? 1 : -1) * floor(random() * (maxMagnitude / step)) * step;
  /**
   * Returns a random value at intervals of `step` from `0` to (but not including) `2 * PI`.
   * @param step - Interval angle.
   * @returns A random radians value.
   */
  const angle$3 = step => floor(random() * (TWO_PI / step)) * step;
  /**
   * Returns a positive or negative value randomly at intervals of `step`
   * with a magnitude from `0` up to (but not including) `PI`.
   * @param step - Interval angle.
   * @returns A random signed radians value.
   */
  const signedAngle$1 = step =>
    (random() < 0.5 ? 1 : -1) * floor(random() * (PI / step)) * step;

  const discrete = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    ratio: ratio$1,
    value: value$2,
    between: between$2,
    signed: signed$2,
    angle: angle$3,
    signedAngle: signedAngle$1
  });

  /**
   * Returns one element of `array` randomly.
   * `array` is not expected to be empty.
   * @param array
   * @returns A random element.
   */
  const get$2 = array => array[value$1(array.length)];
  /**
   * Removes and returns one element from `array` randomly.
   * `array` is not expected to be empty.
   * @param array
   * @returns A random element.
   */
  const removeGet = array => array.splice(value$1(array.length), 1)[0];

  const arrays = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    get: get$2,
    removeGet: removeGet
  });

  /**
   * Similar to `ratio()`, but remaps the result by `curve`.
   * @param curve Function that takes a random value between [0, 1] and returns a remapped value.
   * @returns A random value.
   */
  const ratio$2 = curve => curve(random());
  /**
   * Similar to `value()`, but remaps the result by `curve`.
   * @param curve Function that takes a random value between [0, 1] and returns a remapped value.
   * @param magnitude
   * @returns A random value.
   */
  const value$3 = (curve, magnitude) => curve(random()) * magnitude;
  /**
   * Similar to `between()`, but remaps the result by `curve`.
   * @param curve Function that takes a random value between [0, 1] and returns a remapped value.
   * @param start
   * @param end
   * @returns A random value.
   */
  const between$3 = (curve, start, end) =>
    start + curve(random()) * (end - start);
  /**
   * Similar to `inRange()`, but remaps the result by `curve`.
   * @param curve Function that takes a random value between [0, 1] and returns a remapped value.
   * @param range
   * @returns A random value.
   */
  const inRange$1 = (curve, range) => between$3(curve, range.start, range.end);
  /**
   * Similar to the normal `angle()`, but remaps the result by `curve`.
   * @param curve Any function that takes a random value between [0, 1) and returns a remapped value.
   * @returns A random radians value.
   */
  const angle$4 = curve => curve(random()) * TWO_PI;
  /**
   * Similar to the normal `signed()`, but remaps the result by `curve`.
   * @param curve Any function that takes a random value between [0, 1) and returns a remapped value.
   * @param magnitude
   * @returns A random signed value.
   */
  const signed$3 = (curve, magnitude) =>
    (random() < 0.5 ? 1 : -1) * curve(random()) * magnitude;
  /**
   * Similar to the normal `signedAngle()`, but remaps the result by `curve`.
   * @param curve Any function that takes a random value between [0, 1) and returns a remapped value.
   * @param magnitude
   * @returns A random signed radians value.
   */
  const signedAngle$2 = curve =>
    (random() < 0.5 ? 1 : -1) * curve(random()) * PI;

  const curved = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    ratio: ratio$2,
    value: value$3,
    between: between$3,
    inRange: inRange$1,
    angle: angle$4,
    signed: signed$3,
    signedAngle: signedAngle$2
  });

  const fullName$5 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    setBaseRandomFunction: setBaseFunction,
    get randomRatio() {
      return ratio;
    },
    randomValue: value,
    randomAngle: angle$2,
    randomBetween: between,
    randomInRange: inRange,
    randomBool: bool,
    randomSign: sign$1,
    randomSigned: signed,
    randomSignedAngle: signedAngle,
    randomInteger: value$1,
    randomIntegerBetween: between$1,
    randomIntegerSigned: signed$1,
    randomDiscreteRatio: ratio$1,
    randomDiscreteValue: value$2,
    randomDiscreteAngle: angle$3,
    randomDiscreteBetween: between$2,
    randomDiscreteSigned: signed$2,
    randomDiscreteSignedAngle: signedAngle$1,
    randomFromArray: get$2,
    randomRemoveFromArray: removeGet,
    randomRatioCurved: ratio$2,
    randomValueCurved: value$3,
    randomBetweenCurved: between$3,
    randomInRangeCurved: inRange$1,
    randomVector: vector,
    randomPointInRectangleRegin: pointInRectangleRegion
  });

  const index$5 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Integer: integer,
    Discrete: discrete,
    Arrays: arrays,
    Curved: curved,
    FullName: fullName$5,
    get random() {
      return random;
    },
    get ratio() {
      return ratio;
    },
    setBaseFunction: setBaseFunction,
    value: value,
    angle: angle$2,
    between: between,
    inRange: inRange,
    bool: bool,
    sign: sign$1,
    signed: signed,
    signedAngle: signedAngle,
    vector: vector,
    pointInRectangleRegion: pointInRectangleRegion
  });

  /**
   * Calculates the scale factor for fitting `nonScaledSize` to `targetSize` keeping the original aspect ratio.
   *
   * @param nonScaledSize
   * @param targetSize
   * @param fittingOption Defaults to `FIT_TO_BOX`.
   */
  const calculateScaleFactor = (nonScaledSize, targetSize, fittingOption) => {
    switch (fittingOption) {
      default:
      case "FIT_TO_BOX":
        return min2(
          targetSize.width / nonScaledSize.width,
          targetSize.height / nonScaledSize.height
        );
      case "FIT_WIDTH":
        return targetSize.width / nonScaledSize.width;
      case "FIT_HEIGHT":
        return targetSize.height / nonScaledSize.height;
    }
  };

  const fitBox = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    calculateScaleFactor: calculateScaleFactor
  });

  /**
   * Finds HTML element by `id`. If not found, returns `document.body`.
   * @param id
   */
  const getElementOrBody = id => document.getElementById(id) || document.body;
  /**
   * Returns the width and height of `node`.
   * If `node === document.body`, returns the inner width and height of `window`.
   * @param node
   */
  const getElementSize = node =>
    node === document.body
      ? {
          width: window.innerWidth,
          height: window.innerHeight
        }
      : node.getBoundingClientRect();

  const htmlUtility = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    getElementOrBody: getElementOrBody,
    getElementSize: getElementSize
  });

  const returnVoid = () => {};
  const returnUndefined = () => undefined;
  const returnNull = () => null;
  const returnZero = () => 0;
  const returnOne = () => 1;
  const returnTrue = () => true;
  const returnFalse = () => false;
  const returnArgument = argument => argument;
  /**
   * Runs `callback` without any arguments.
   * @param callback - Any function that can be run without any arguments.
   */
  const runSelf = callback => callback();

  const constantFunction = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    returnVoid: returnVoid,
    returnUndefined: returnUndefined,
    returnNull: returnNull,
    returnZero: returnZero,
    returnOne: returnOne,
    returnTrue: returnTrue,
    returnFalse: returnFalse,
    returnArgument: returnArgument,
    runSelf: runSelf
  });

  let verbose = returnVoid;
  const outputVerbose = (yes = true) => {
    verbose = yes ? console.info : returnVoid;
  };
  const TIMER = "timer ";
  const CREATED = ": created.";
  const STARTING = ": starting...";
  const STARTED = ": started.";
  const COMPLETING = ": completing...";
  const COMPLETED = ": completed.";

  let nextComponentId = 0;
  /**
   * Callback function for running `component.step()`.
   * @param component
   */
  const step = component => component.step();
  /**
   * Callback function for running `component.reset()`.
   * @param component
   */
  const reset = component => component.reset();
  const defaultName = "no name";
  /**
   * Base class for other classes implementing `Component`.
   */
  class Base {
    constructor(onStart, onComplete) {
      this.id = nextComponentId++;
      this.name = defaultName;
      this.onStart = onStart;
      this.onComplete = onComplete;
      this.isStarted = false;
      this.isCompleted = false;
      verbose(TIMER, this.id, CREATED);
    }
    /**
     * If `this` is not yet started,
     * runs all functions in `this.onStart`, and sets `this.isStarted` to `true`.
     * @returns `true` if just started. `false` if already started.
     */
    tryStart() {
      if (this.isStarted) return false;
      const { id, name } = this;
      verbose(TIMER, id, name, STARTING);
      loopRunWithArgument(this.onStart, id);
      verbose(TIMER, id, name, STARTED);
      return (this.isStarted = true);
    }
    /**
     * Runs all functions in `this.onComplete`, and sets `this.isCompleted` to `true`.
     * @returns `true`.
     */
    complete() {
      const { id, name } = this;
      verbose(TIMER, id, name, COMPLETING);
      loopRunWithArgument(this.onComplete, id);
      verbose(TIMER, id, name, COMPLETED);
      return (this.isCompleted = true);
    }
    /**
     * Sets the name of `this` for debug purpose.
     * @param name
     * @returns `this` instance.
     */
    setName(name) {
      this.name = name;
      return this;
    }
  }

  const component = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    step: step,
    reset: reset,
    Base: Base
  });

  const createProgress = duration => {
    return {
      duration,
      ratioChangeRate: 1 / max2(1, duration),
      count: 0,
      ratio: 0
    };
  };
  const updateProgress = progress => {
    progress.count += 1;
    progress.ratio += progress.ratioChangeRate;
  };
  const resetProgress = progress => {
    progress.count = 0;
    progress.ratio = 0;
  };
  class Unit extends Base {
    constructor(onStart, onProgress, onComplete, progress) {
      super(onStart, onComplete);
      this.onProgress = onProgress;
      this.progress = progress;
    }
    static create(onStart, onProgress, onComplete, progress) {
      return new Unit(onStart, onProgress, onComplete, progress);
    }
    step() {
      if (this.isCompleted) return true;
      this.tryStart();
      const { progress } = this;
      if (progress.count >= progress.duration) {
        progress.ratio = 1;
        loopRunWithArgument(this.onProgress, progress);
        return this.complete();
      }
      loopRunWithArgument(this.onProgress, progress);
      updateProgress(progress);
      return false;
    }
    reset() {
      resetProgress(this.progress);
      this.isStarted = false;
      this.isCompleted = false;
      return this;
    }
    setName(name) {
      super.setName(name);
      return this;
    }
  }
  /**
   * Creates a `Timer` instance.
   * @param parameters
   * @returns New `Timer` instance.
   */
  const create$6 = parameters => {
    return Unit.create(
      unifyToArray(parameters.onStart),
      unifyToArray(parameters.onProgress),
      unifyToArray(parameters.onComplete),
      createProgress(parameters.duration)
    );
  };
  const dummy = Unit.create([], [], [], createProgress(0));
  dummy.isStarted = true;
  dummy.isCompleted = true;

  const setIndex = (chain, index) => {
    chain.index = index;
    chain.currentComponent = chain.components[index];
  };
  /**
   * Increments component index. Set `chain` completed if there is no next component.
   * @param chain
   * @returns `true` if completed i.e. there is no next component.
   */
  const setNextIndex = chain => {
    const nextIndex = chain.index + 1;
    if (nextIndex < chain.components.length) {
      setIndex(chain, nextIndex);
      return false;
    }
    return chain.complete();
  };
  class Unit$1 extends Base {
    constructor(components) {
      super([], []);
      this.components = components.slice();
      this.index = 0;
      this.currentComponent = components[0];
    }
    static create(components) {
      return new Unit$1(components);
    }
    step() {
      this.tryStart();
      if (!this.currentComponent.step()) return false;
      return setNextIndex(this);
    }
    reset() {
      loop(this.components, reset);
      setIndex(this, 0);
      this.isStarted = false;
      this.isCompleted = false;
      return this;
    }
    pushComponent(component) {
      this.components.push(component);
    }
    setName(name) {
      super.setName(name);
      return this;
    }
  }
  /**
   * Creates a sequential composite from `components`.
   * @param components
   * @returns New `Timer.Chain` instance.
   */
  const create$7 = components => Unit$1.create(components);

  const chain = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Unit: Unit$1,
    create: create$7
  });

  class Unit$2 extends Base {
    constructor(components) {
      super([], []);
      this.components = components.slice();
      this.runningComponentList = fromArray(components.slice());
    }
    static create(components) {
      return new Unit$2(components);
    }
    step() {
      this.tryStart();
      const { runningComponentList } = this;
      removeShiftAll(runningComponentList, step);
      if (runningComponentList.size > 0) return false;
      return this.complete();
    }
    reset() {
      const { runningComponentList } = this;
      clear(runningComponentList);
      addArray(runningComponentList, this.components);
      loop$1(runningComponentList, reset);
      this.isStarted = false;
      this.isCompleted = false;
      return this;
    }
    setName(name) {
      super.setName(name);
      return this;
    }
    addComponent(component) {
      this.components.push(component);
      add(this.runningComponentList, component);
    }
  }
  /**
   * Creates a parallel composite from `components`.
   * @param components
   * @returns New `Timer.Parallel` instance.
   */
  const create$8 = components => Unit$2.create(components);

  const parallel = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Unit: Unit$2,
    create: create$8
  });

  class Unit$3 extends Base {
    constructor(component, loopCount) {
      super([], []);
      this.component = component;
      this.loopCount = loopCount;
      this.remainingCount = loopCount;
    }
    static create(component, loopCount) {
      return new Unit$3(component, loopCount);
    }
    step() {
      this.tryStart();
      if (!this.component.step()) return false;
      if (this.isCompleted) return true;
      if ((this.remainingCount -= 1) > 0) {
        this.component.reset();
        return false;
      }
      return this.complete();
    }
    reset() {
      const { loopCount } = this;
      this.remainingCount = loopCount;
      this.component.reset();
      this.isStarted = false;
      this.isCompleted = false;
      return this;
    }
    setName(name) {
      super.setName(name);
      return this;
    }
  }
  /**
   * Creates a looped component from `component`.
   * @param component
   * @param loopCount `Infinity` if not specified.
   * @returns New `Timer.Loop` instance.
   */
  const create$9 = (component, loopCount = Infinity) =>
    Unit$3.create(component, loopCount);

  const loop$3 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Unit: Unit$3,
    create: create$9
  });

  const create$a = capacity => {
    return {
      runningComponents: create(capacity),
      newComponentsBuffer: create(capacity)
    };
  };
  const add$4 = (timerSet, component) =>
    add(timerSet.newComponentsBuffer, component);
  const step$1 = timerSet => {
    const { runningComponents, newComponentsBuffer } = timerSet;
    addList(runningComponents, newComponentsBuffer);
    clear(newComponentsBuffer);
    removeShiftAll(runningComponents, step);
  };
  const clear$3 = timerSet => {
    clear(timerSet.runningComponents);
    clear(timerSet.newComponentsBuffer);
  };
  /**
   * Creates a timer set instance and returns a set of bound functions.
   * @param capacity
   */
  const construct = capacity => {
    const timerSet = create$a(capacity);
    return {
      add: add$4.bind(undefined, timerSet),
      step: step$1.bind(undefined, timerSet),
      clear: clear$3.bind(undefined, timerSet)
    };
  };

  const set$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    create: create$a,
    add: add$4,
    step: step$1,
    clear: clear$3,
    construct: construct
  });

  const index$6 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Component: component,
    Chain: chain,
    Parallel: parallel,
    Loop: loop$3,
    Set: set$1,
    chain: create$7,
    parallel: create$8,
    loop: create$9,
    outputVerbose: outputVerbose,
    Unit: Unit,
    create: create$6,
    dummy: dummy
  });

  const morseCodeMap = new Map([
    ["A", ".-"],
    ["B", "-..."],
    ["C", "-.-."],
    ["D", "-.."],
    ["E", "."],
    ["F", "..-."],
    ["G", "--."],
    ["H", "...."],
    ["I", ".."],
    ["J", ".---"],
    ["K", "-.-"],
    ["L", ".-.."],
    ["M", "--"],
    ["N", "-."],
    ["O", "---"],
    ["P", ".--."],
    ["Q", "--.-"],
    ["R", ".-."],
    ["S", "..."],
    ["T", "-"],
    ["U", "..-"],
    ["V", "...-"],
    ["W", ".--"],
    ["X", "-..-"],
    ["Y", "-.--"],
    ["Z", "--.."],
    ["1", ".----"],
    ["2", "..---"],
    ["3", "...--"],
    ["4", "....-"],
    ["5", "....."],
    ["6", "-...."],
    ["7", "--..."],
    ["8", "---.."],
    ["9", "----."],
    ["0", "-----"],
    [".", ".-.-.-"],
    [",", "--..--"],
    [":", "---..."],
    ["?", "..--.."],
    ["'", ".----."],
    ["!", "-.-.--"],
    ["-", "-....-"],
    ["/", "-..-."],
    ["@", ".--.-."],
    ["(", "-.--."],
    [")", "-.--.-"],
    ['"', ".-..-."],
    ["=", "-...-"],
    ["+", ".-.-."]
  ]);
  const createSignalUnit = (isOn, length, codeString) => {
    let s = "";
    const binaryCharacter = isOn ? "1" : "0";
    for (let i = 0; i < length; i += 1) {
      s += binaryCharacter;
    }
    return Object.freeze({
      isOn,
      length,
      codeString,
      binaryString: s
    });
  };
  const createOnSignalUnit = (length, codeString) =>
    createSignalUnit(true, length, codeString);
  const createOffSignalUnit = (length, codeString) =>
    createSignalUnit(false, length, codeString);
  const DIT = createOnSignalUnit(1, ".");
  const DAH = createOnSignalUnit(3, "-");
  const INTER_ELEMENT_GAP = createOffSignalUnit(1, "");
  const SHORT_GAP = createOffSignalUnit(3, " ");
  const MEDIUM_GAP = createOffSignalUnit(7, " / ");
  const NUL = createOffSignalUnit(0, "");
  function encode(sentence) {
    const upperCaseSentence = sentence.toUpperCase();
    const signals = [];
    let gap = undefined;
    for (let i = 0, len = upperCaseSentence.length; i < len; i += 1) {
      const character = upperCaseSentence.charAt(i);
      if (character === " ") {
        gap = MEDIUM_GAP;
        continue;
      } else if (character.charCodeAt(0) === 0) {
        if (gap) signals.push(gap);
        gap = undefined;
        signals.push(NUL);
        continue;
      }
      const code = morseCodeMap.get(character);
      if (!code) continue;
      for (let k = 0, kLen = code.length; k < kLen; k += 1) {
        if (gap) signals.push(gap);
        switch (code.charAt(k)) {
          case ".":
            signals.push(DIT);
            break;
          case "-":
          case "_":
            signals.push(DAH);
            break;
          default:
            continue;
        }
        gap = INTER_ELEMENT_GAP;
      }
      gap = SHORT_GAP;
    }
    return signals;
  }
  const toString = signals =>
    signals.reduce((acc, cur) => acc + cur.codeString, "");
  const toBinaryString = signals =>
    signals.reduce((acc, cur) => acc + cur.binaryString, "");
  const getTotalLength = signals =>
    signals.reduce((acc, cur) => acc + cur.length, 0);

  const signal = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    DIT: DIT,
    DAH: DAH,
    INTER_ELEMENT_GAP: INTER_ELEMENT_GAP,
    SHORT_GAP: SHORT_GAP,
    MEDIUM_GAP: MEDIUM_GAP,
    NUL: NUL,
    encode: encode,
    toString: toString,
    toBinaryString: toBinaryString,
    getTotalLength: getTotalLength
  });

  /**
   * Returns duration time per dot in milliseconds.
   * @param wpm - word (PARIS) per minute
   */
  function wpmToDotDuration(wpm) {
    return 1000 / (50 * (wpm / 60));
  }
  const create$b = (on, off, wpm = 25, signals = [], loop = false) => {
    return {
      on,
      off,
      wpm,
      unitTime: wpmToDotDuration(wpm),
      loop,
      signals,
      index: 0,
      timeout: undefined
    };
  };
  const stop = channel => {
    if (channel.timeout) {
      channel.off(NUL);
      clearTimeout(channel.timeout);
      channel.timeout = undefined;
    }
    channel.index = 0;
  };
  const runCurrentSignal = channel => {
    const { unitTime, signals, index, on, off } = channel;
    const currentSignal = signals[index];
    if (currentSignal.isOn) on(currentSignal);
    else off(currentSignal);
    return unitTime * currentSignal.length;
  };
  const setNextRun = (run, channel, ms) => {
    channel.timeout = setTimeout(() => {
      channel.timeout = undefined;
      run(channel);
    }, ms);
  };
  const run = channel => {
    const currentSignalTimeLength = runCurrentSignal(channel);
    channel.index += 1;
    if (channel.index < channel.signals.length) {
      setNextRun(run, channel, currentSignalTimeLength);
      return;
    }
    channel.timeout = setTimeout(() => {
      if (channel.loop) {
        channel.off(NUL);
        channel.timeout = undefined;
      } else {
        channel.off(MEDIUM_GAP);
        setNextRun(run, channel, MEDIUM_GAP.length);
      }
    }, currentSignalTimeLength);
    channel.index = 0;
  };
  const start = (channel, signals) => {
    stop(channel);
    if (signals) channel.signals = signals;
    run(channel);
  };

  const channel = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    wpmToDotDuration: wpmToDotDuration,
    create: create$b,
    stop: stop,
    start: start
  });

  const index$7 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Signal: signal,
    Channel: channel
  });

  /**
   * Creates a `Timer` instance for tweening value using `setValue()`.
   * @param setValue A function that receives the tweened value.
   * @param duration Duration frame count.
   * @param parameters `start`, `end` and `easing`(linear by default).
   * @returns New `Timer` instance.
   */
  const create$c = (setValue, duration, parameters) => {
    const { start, end } = parameters;
    const ease = parameters.easing || linear;
    return create$6({
      duration,
      onProgress: progress => setValue(lerp(start, end, ease(progress.ratio)))
    });
  };
  /**
   * Creates a `Timer` instance for tweening value using `setValue()`.
   * The parameters are evaluated at the timing when the timer starts.
   * @param setValue A function that receives the tweened value.
   * @param duration Duration frame count.
   * @param getParameters A function that returns `start`, `end` and `easing`(linear by default).
   * @returns New `Timer` instance.
   */
  const setCreate = (setValue, duration, getParameters) => {
    let startValue;
    let endValue;
    let ease;
    return create$6({
      duration,
      onStart: () => {
        const { start, end, easing } = getParameters();
        startValue = start;
        endValue = end;
        ease = easing || linear;
      },
      onProgress: progress =>
        setValue(lerp(startValue, endValue, ease(progress.ratio)))
    });
  };

  /**
   * Creates a `Timer` instance for tweening `vector` from the current values.
   * @param vector The vector to tween.
   * @param duration Duration frame count.
   * @param parameters `target`, `duration` and `easing`(linear by default).
   * @returns New `Timer` instance.
   */
  const create$d = (vector, duration, parameters) => {
    const { x: startX, y: startY } = vector;
    const { x: endX, y: endY } = parameters.target;
    const ease = parameters.easing || linear;
    return create$6({
      duration,
      onProgress: progress => {
        const ratio = ease(progress.ratio);
        setCartesian(
          vector,
          lerp(startX, endX, ratio),
          lerp(startY, endY, ratio)
        );
      }
    });
  };
  /**
   * Creates a `Timer` instance for tweening `vector`.
   * The starting values of `vector` and the parameters are evaluated at the timing when the timer starts.
   * @param vector The vector to tween.
   * @param duration Duration frame count.
   * @param parameters `target`, `duration` and `easing`(linear by default).
   * @returns New `Timer` instance.
   */
  const setCreate$1 = (vector, duration, getParameters) => {
    let startX, startY;
    let endX, endY;
    let ease;
    return create$6({
      duration,
      onStart: () => {
        const { target, easing } = getParameters();
        ({ x: startX, y: startY } = vector);
        ({ x: endX, y: endY } = target);
        ease = easing || linear;
      },
      onProgress: progress => {
        const ratio = ease(progress.ratio);
        setCartesian(
          vector,
          lerp(startX, endX, ratio),
          lerp(startY, endY, ratio)
        );
      }
    });
  };

  const vector2d = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    create: create$d,
    setCreate: setCreate$1
  });

  const index$8 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Vector2D: vector2d,
    create: create$c,
    setCreate: setCreate
  });

  /**
   * Creates a `Repeater` unit.
   * @param callback
   * @param frequency Frequency per frame for running `callback`. Defaults to `1`.
   * @returns A new `Repeater` unit.
   */
  const create$e = (callback, frequency = 1) => ({
    callback,
    frequency,
    accumulation: 0
  });
  /**
   * Runs a `Repeater` unit.
   * @param repeater
   */
  const run$1 = repeater => {
    repeater.accumulation += repeater.frequency;
    while (repeater.accumulation >= 1) {
      repeater.accumulation -= 1;
      repeater.callback();
    }
  };
  /**
   * Resets a `Repeater` unit.
   * @param repeater
   */
  const reset$1 = repeater => {
    repeater.accumulation = 0;
  };

  const repeater = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    create: create$e,
    run: run$1,
    reset: reset$1
  });

  /**
   * Prints info message.
   */
  let info = returnVoid;
  /**
   * Prints warning message.
   */
  let warn = returnVoid;
  /**
   * Prints error message.
   */
  let error = returnVoid;
  /**
   * Sets if info messages should be output to console log.
   * @param yes
   */
  const outputInfo = (yes = true) => {
    info = yes ? console.info : returnVoid;
  };
  /**
   * Sets if warning messages should be output to console log.
   * @param yes
   */
  const outputWarn = (yes = true) => {
    warn = yes ? console.warn : returnVoid;
  };
  /**
   * Sets if error messages should be output to console log.
   * @param yes
   */
  const outputError = (yes = true) => {
    error = yes ? console.error : returnVoid;
  };

  const log$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    get info() {
      return info;
    },
    get warn() {
      return warn;
    },
    get error() {
      return error;
    },
    outputInfo: outputInfo,
    outputWarn: outputWarn,
    outputError: outputError
  });

  const createQuantity = (x, y, vx, vy) => {
    return {
      x,
      y,
      vx: vx || 0,
      vy: vy || 0
    };
  };
  /**
   * Updates the kinematic quantity naively by Euler method, i.e. adding velocity to position.
   * @param quantity
   */
  const updateEuler = quantity => {
    quantity.x += quantity.vx;
    quantity.y += quantity.vy;
  };
  /**
   * Updates the kinematic quantity naively by Euler method,
   * i.e. adding velocity to position and adding acceleration to velocity.
   * @param quantity
   * @param ax
   * @param ay
   */
  const updateEulerAccelerated = (quantity, ax, ay) => {
    quantity.x += quantity.vx;
    quantity.y += quantity.vy;
    quantity.vx += ax;
    quantity.vy += ay;
  };
  /**
   * Updates the kinematic quantity by Velocity Verlet method.
   * Be sure to use `postUpdateVerlet()` with updated acceleration values after using this function.
   *
   * Not sure if this implementation is correct!
   * @param quantity
   */
  const updateVerlet = (quantity, ax, ay) => {
    quantity.vx2 = quantity.vx + 0.5 * ax;
    quantity.vy2 = quantity.vy + 0.5 * ay;
    quantity.vx += ax;
    quantity.vy += ay;
    quantity.x += quantity.vx2;
    quantity.y += quantity.vy2;
  };
  /**
   * Completes updating the kinematic quantity by Velocity Verlet method after updating the force.
   *
   * Not sure if this implementation is correct!
   * @param quantity
   */
  const postUpdateVerlet = (quantity, ax, ay) => {
    quantity.vx = quantity.vx2 + 0.5 * ax;
    quantity.vy = quantity.vy2 + 0.5 * ay;
  };
  /**
   * Assigns position values to `target` vector.
   * @param quantity
   * @param target
   * @returns `target` vector with assigned position.
   */
  const positionVector = (quantity, target) =>
    setCartesian$1(quantity.x, quantity.y, target);
  /**
   * Extracts velocity values to `target` vector.
   * @param quantity
   * @param target
   * @returns `target` vector with assigned velocity.
   */
  const velocityVector = (quantity, target) =>
    setCartesian$1(quantity.vx, quantity.vy, target);
  /**
   * Returns the speed.
   * @param quantity
   * @returns The speed.
   */
  const getSpeed = quantity => hypotenuse2D(quantity.vx, quantity.vy);
  /**
   * Returns the velocity angle.
   * @param quantity
   * @returns The angle.
   */
  const getVelocityAngle = quantity => atan2safe(quantity.vy, quantity.vx);
  /**
   * Truncates the speed (magnitude of velocity) if it is greater than `maxSpeed`.
   * @param quantity
   * @param maxSpeed
   * @returns The `quantity` instance with truncated velocity values.
   */
  const truncateVelocity = (quantity, maxSpeed) => {
    const { vx, vy } = quantity;
    if (hypotenuseSquared2D(vx, vy) <= maxSpeed * maxSpeed) return quantity;
    const angle = atan2(vy, vx);
    quantity.vx = maxSpeed * cos(angle);
    quantity.vy = maxSpeed * sin(angle);
    return quantity;
  };
  /**
   * Set values of `velocity` to `quantity`.
   * @param quantity
   * @param velocity
   * @returns The `quantity` instance with assigned velocity.
   */
  const setVelocity = (quantity, velocity) => {
    quantity.vx = velocity.x;
    quantity.vy = velocity.y;
    return quantity;
  };
  /**
   * Set velocity values to `quantity`.
   * @param quantity
   * @param velocity
   * @returns The `quantity` instance with assigned velocity.
   */
  const setVelocityCartesian = (quantity, vx, vy) => {
    quantity.vx = vx;
    quantity.vy = vy;
    return quantity;
  };
  /**
   * Set velocity values to `quantity`.
   * @param quantity
   * @param velocity
   * @returns The `quantity` instance with assigned velocity.
   */
  const setVelocityPolar = (quantity, length, angle) => {
    quantity.vx = length * cos(angle);
    quantity.vy = length * sin(angle);
    return quantity;
  };
  /**
   * Let `quantity` bounce if it is out of `region`.
   * @param region
   * @param coefficientOfRestitution
   * @param quantity
   * @returns `true` if bounced.
   */
  const bounceInRectangleRegion = (
    region,
    coefficientOfRestitution,
    quantity
  ) => {
    const { x, y, vx, vy } = quantity;
    const { x: leftX, y: topY } = region.topLeft;
    const { x: rightX, y: bottomY } = region.bottomRight;
    if (x < leftX) {
      quantity.x = leftX;
      if (vx < 0) quantity.vx = -coefficientOfRestitution * vx;
      return true;
    } else if (x >= rightX) {
      quantity.x = rightX - 1;
      if (vx > 0) quantity.vx = -coefficientOfRestitution * vx;
      return true;
    }
    if (y < topY) {
      quantity.y = topY;
      if (vy < 0) quantity.vy = -coefficientOfRestitution * vy;
      return true;
    } else if (y >= bottomY) {
      quantity.y = bottomY - 1;
      if (vy > 0) quantity.vy = -coefficientOfRestitution * vy;
      return true;
    }
    return false;
  };

  const kinematics = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    createQuantity: createQuantity,
    updateEuler: updateEuler,
    updateEulerAccelerated: updateEulerAccelerated,
    updateVerlet: updateVerlet,
    postUpdateVerlet: postUpdateVerlet,
    positionVector: positionVector,
    velocityVector: velocityVector,
    getSpeed: getSpeed,
    getVelocityAngle: getVelocityAngle,
    truncateVelocity: truncateVelocity,
    setVelocity: setVelocity,
    setVelocityCartesian: setVelocityCartesian,
    setVelocityPolar: setVelocityPolar,
    bounceInRectangleRegion: bounceInRectangleRegion
  });

  const createQuantity$1 = (x, y, vx, vy) => {
    return {
      x,
      y,
      vx: vx || 0,
      vy: vy || 0,
      fx: 0,
      fy: 0
    };
  };
  const createVerletQuantity = (x, y, vx, vy) => {
    return {
      x,
      y,
      vx: vx || 0,
      vy: vy || 0,
      vx2: 0,
      vy2: 0,
      fx: 0,
      fy: 0
    };
  };
  /**
   * Updates the kinematic quantity naively by Euler method. Applies the below:
   * 1. Update position by adding velocity.
   * 2. Update velocity by applying force.
   * 3. Clear force to zero.
   *
   * Not sure if this implementation is correct!
   * @param quantity
   */
  const updateEuler$1 = quantity => {
    updateEulerAccelerated(quantity, quantity.fx, quantity.fy);
    quantity.fx = 0;
    quantity.fy = 0;
  };
  /**
   * Updates the kinematic quantity by Velocity Verlet method.
   * Be sure to update force after running this function and then run `postUpdateVerlet()`.
   *
   * Not sure if this implementation is correct!
   * @param quantity
   */
  const updateVerlet$1 = quantity => {
    updateVerlet(quantity, quantity.fx, quantity.fy);
    quantity.fx = 0;
    quantity.fy = 0;
  };
  /**
   * Completes updating the kinematic quantity by Velocity Verlet method after updating the force.
   *
   * Not sure if this implementation is correct!
   * @param quantity
   */
  const postUpdateVerlet$1 = quantity => {
    postUpdateVerlet(quantity, quantity.fx, quantity.fy);
  };
  /**
   * Extracts force values to `target` vector.
   * @param quantity
   * @param target
   * @returns `target` vector with assigned acceleration.
   */
  const forceVector = (quantity, target) =>
    setCartesian$1(quantity.fx, quantity.fy, target);
  /**
   * Truncates the magnitude of force if it is greater than `maxMagnitude`.
   * @param quantity
   * @param maxSpeed
   * @returns The `quantity` instance with truncated force values.
   */
  const truncateForce = (quantity, maxMagnitude) => {
    const { fx, fy } = quantity;
    if (hypotenuseSquared2D(fx, fy) <= maxMagnitude * maxMagnitude)
      return quantity;
    const angle = atan2(fy, fx);
    quantity.fx = maxMagnitude * cos(angle);
    quantity.fy = maxMagnitude * sin(angle);
    return quantity;
  };
  /**
   * Adds `force` to `quantity`.
   * @param quantity
   * @param force
   * @returns The `quantity` instance with assigned force.
   */
  const addForce = (quantity, force) => {
    quantity.fx += force.x;
    quantity.fy += force.y;
    return quantity;
  };
  /**
   * Adds force values to `quantity`.
   * @param quantity
   * @param fx
   * @param fy
   * @returns The `quantity` instance with assigned force.
   */
  const addForceCartesian = (quantity, fx, fy) => {
    quantity.fx += fx;
    quantity.fy += fy;
    return quantity;
  };
  /**
   * Adds force values to `quantity`.
   * @param quantity
   * @param magnitude
   * @param angle
   * @returns The `quantity` instance with assigned force.
   */
  const addForcePolar = (quantity, magnitude, angle) => {
    quantity.fx += magnitude * cos(angle);
    quantity.fy += magnitude * sin(angle);
    return quantity;
  };

  const simpleDynamics = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    createQuantity: createQuantity$1,
    createVerletQuantity: createVerletQuantity,
    updateEuler: updateEuler$1,
    updateVerlet: updateVerlet$1,
    postUpdateVerlet: postUpdateVerlet$1,
    forceVector: forceVector,
    truncateForce: truncateForce,
    addForce: addForce,
    addForceCartesian: addForceCartesian,
    addForcePolar: addForcePolar
  });

  const createQuantity$2 = (x, y, mass, vx, vy) => {
    return {
      x,
      y,
      vx: vx || 0,
      vy: vy || 0,
      fx: 0,
      fy: 0,
      mass
    };
  };
  const createVerletQuantity$1 = (x, y, mass, vx, vy) => {
    return {
      x,
      y,
      vx: vx || 0,
      vy: vy || 0,
      vx2: 0,
      vy2: 0,
      fx: 0,
      fy: 0,
      mass
    };
  };
  /**
   * Updates the kinematic quantity naively by Euler method. Applies the below:
   * 1. Update position by adding velocity.
   * 2. Update velocity by applying force.
   * 3. Clear force to zero.
   *
   * Not sure if this implementation is correct!
   * @param quantity
   */
  const updateEuler$2 = quantity => {
    const { mass } = quantity;
    updateEulerAccelerated(quantity, quantity.fx / mass, quantity.fy / mass);
    quantity.fx = 0;
    quantity.fy = 0;
  };
  /**
   * Updates the kinematic quantity by Velocity Verlet method.
   * Be sure to update force after running this function and then run `postUpdateVerlet()`.
   *
   * Not sure if this implementation is correct!
   * @param quantity
   */
  const updateVerlet$2 = quantity => {
    const { mass } = quantity;
    updateVerlet(quantity, quantity.fx / mass, quantity.fy / mass);
    quantity.fx = 0;
    quantity.fy = 0;
  };
  /**
   * Completes updating the kinematic quantity by Velocity Verlet method after updating the force.
   *
   * Not sure if this implementation is correct!
   * @param quantity
   */
  const postUpdateVerlet$2 = quantity => {
    const { mass } = quantity;
    postUpdateVerlet(quantity, quantity.fx / mass, quantity.fy / mass);
  };

  const dynamics = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    createQuantity: createQuantity$2,
    createVerletQuantity: createVerletQuantity$1,
    updateEuler: updateEuler$2,
    updateVerlet: updateVerlet$2,
    postUpdateVerlet: postUpdateVerlet$2
  });

  let constant = 1;
  let minusConstant = -constant;
  const setConstant = value => {
    constant = value;
    minusConstant = -constant;
  };
  /**
   * Calculates gravitation force.
   * @param attractedRelative Relative position from attractor to attracted.
   * @param massProduct Pre-calcultad product of mass of attractor and attracted.
   * @param distance Pre-calculated distance.
   * @param target Vector to assign the result.
   * @returns The `target` vector with assigned gravitation force.
   */
  const calculateCore = (attractedRelative, massProduct, distance, target) =>
    multiply$2(
      attractedRelative,
      (minusConstant * massProduct) / (distance * distance * distance),
      target
    );
  /**
   * Calculates gravitation force applied on point mass `attracted` exerted by point mass `attractor`.
   * @param attractor Object that has `x`, `y` and `mass`.
   * @param attracted Object that has `x`, `y` and `mass`.
   * @param target Vector to assign the result.
   * @returns The `target` vector with assigned gravitation force.
   */
  const calculate = (attractor, attracted, target) =>
    calculateCore(
      subtract$2(attracted, attractor, target),
      attractor.mass * attracted.mass,
      distance(attractor, attracted),
      target
    );
  /**
   * Calculates gravitation force, assuming that the mass is always `1`.
   * @param attractedRelative Relative position from attractor to attracted.
   * @param distance Pre-calculated distance.
   * @param target Vector to assign the result.
   * @returns The `target` vector with assigned gravitation force.
   */
  const calculateCoreSimple = (attractedRelative, distance, target) =>
    multiply$2(
      attractedRelative,
      minusConstant / (distance * distance * distance),
      target
    );
  /**
   * Calculates gravitation force applied on point `attracted` exerted by point `attractor`, assuming that the mass is always `1`.
   * @param attractor
   * @param attracted
   * @param target Vector to assign the result.
   * @returns The `target` vector with assigned gravitation force.
   */
  const calculateSimple = (attractor, attracted, target) =>
    calculateCoreSimple(
      subtract$2(attracted, attractor, target),
      distance(attractor, attracted),
      target
    );
  /**
   * Adds gravitation force between `bodyA` and `bodyB`.
   * @param bodyA
   * @param bodyB
   * @param forceOnBodyB
   */
  const addForceEachOther = (bodyA, bodyB, forceOnBodyB) => {
    const { x: forceX, y: forceY } = forceOnBodyB;
    bodyA.fx -= forceX;
    bodyA.fy -= forceY;
    bodyB.fx += forceX;
    bodyB.fy += forceY;
  };
  const temporalGravitation = { x: 0, y: 0 };
  /**
   * Set of functions that calculate gravitation force and apply it on the body.
   */
  const attract = {
    /**
     * Calculates gravitation force using pre-calculated values and applies it on `attracted`.
     * @param attracted
     * @param attractedRelative The relative position from the attractor to `attracted`.
     * @param massProduct The pre-calculated product of mass of the attractor and `attracted`
     * @param distance The pre-calculated distance between the attractor and `attracted`.
     */
    precalculated: (attracted, attractedRelative, massProduct, distance) =>
      addForce(
        attracted,
        calculateCore(
          attractedRelative,
          massProduct,
          distance,
          temporalGravitation
        )
      ),
    /**
     * Calculates gravitation force and applies it on `attracted`.
     */
    calculate: (attractor, attracted) =>
      addForce(attracted, calculate(attractor, attracted, temporalGravitation)),
    /**
     * Calculates gravitation force using pre-calculated distance and applies it on `attracted`,
     * assuming that the mass is always `1`.
     * @param attracted
     * @param attractedRelative The relative position from the attractor to `attracted`.
     * @param distance The pre-calculated distance between the attractor and `attracted`.
     */
    precalculatedSimple: (attracted, attractedRelative, distance) =>
      addForce(
        attracted,
        calculateCoreSimple(attractedRelative, distance, temporalGravitation)
      ),
    /**
     * Calculates gravitation force and applies it on `attracted`,
     * assuming that the mass is always `1`.
     */
    calculateSimple: (attractor, attracted) =>
      addForce(
        attracted,
        calculateSimple(attractor, attracted, temporalGravitation)
      )
  };
  /**
   * Set of functions that calculate gravitation force and apply it on both bodies.
   */
  const attractEachOther = {
    /**
     * Calculates gravitation force using pre-calculated values and applies it on both `bodyA` and `bodyB`.
     * @param bodyA
     * @param bodyB
     * @param bodyBRelative The relative position from `bodyA` to `bodyB`.
     * @param massProduct The pre-calculated product of mass of `bodyA` and `bodyB`
     * @param distance The pre-calculated distance between `bodyA` and `bodyB`.
     */
    precalculated: (bodyA, bodyB, bodyBRelative, massProduct, distance) =>
      addForceEachOther(
        bodyA,
        bodyB,
        calculateCore(bodyBRelative, massProduct, distance, temporalGravitation)
      ),
    /**
     * Calculates gravitation force and applies it on both `bodyA` and `bodyB`.
     */
    calculate: (bodyA, bodyB) =>
      addForceEachOther(
        bodyA,
        bodyB,
        calculate(bodyA, bodyB, temporalGravitation)
      ),
    /**
     * Calculates gravitation force using pre-calculated distance and applies it on both `bodyA` and `bodyB`,
     * assuming that the mass is always `1`.
     * @param bodyA
     * @param bodyB
     * @param bodyBRelative The relative position from `bodyA` to `bodyB`.
     * @param distance The pre-calculated distance between `bodyA` and `bodyB`.
     */
    precalculatedSimple: (bodyA, bodyB, bodyBRelative, distance) =>
      addForceEachOther(
        bodyA,
        bodyB,
        calculateCoreSimple(bodyBRelative, distance, temporalGravitation)
      ),
    /**
     * Calculates gravitation force and applies it on both `bodyA` and `bodyB`,
     * assuming that the mass is always `1`.
     */
    calculateSimple: (bodyA, bodyB) =>
      addForceEachOther(
        bodyA,
        bodyB,
        calculateSimple(bodyA, bodyB, temporalGravitation)
      )
  };

  const gravitation = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    get constant() {
      return constant;
    },
    setConstant: setConstant,
    calculateCore: calculateCore,
    calculate: calculate,
    calculateCoreSimple: calculateCoreSimple,
    calculateSimple: calculateSimple,
    attract: attract,
    attractEachOther: attractEachOther
  });

  /**
   * Updates rotation by adding `rotationVelocity` to `rotationAngle`.
   * @param quantity
   */
  const update = quantity => {
    quantity.rotationAngle += quantity.rotationVelocity;
  };
  /**
   * Creates a new rotation quantity with random initial angle, random rotation direction and
   * random rotational speed within the given range.
   * @param minRotationSpeed
   * @param maxRotationSpeed
   * @returns New `Rotation.Quantity`.
   */
  const createRandomQuantity = (minRotationSpeed, maxRotationSpeed) => {
    return {
      rotationAngle: angle$2(),
      rotationVelocity: signed(between(minRotationSpeed, maxRotationSpeed))
    };
  };

  const rotation = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    update: update,
    createRandomQuantity: createRandomQuantity
  });

  /**
   * Calculates the impulse force by the bounce.
   * @param vx
   * @param vy
   * @param normalUnitVector The normal vector from the collision point.
   * @param restitution
   * @param target The target vector for storing the result.
   * @returns The `target` vector with assigned values.
   */
  const calculateForce = (vx, vy, normalUnitVector, restitution, target) => {
    const dotProduct = -(vx * normalUnitVector.x + vy * normalUnitVector.y);
    multiply$2(normalUnitVector, (1 + restitution) * dotProduct, target);
    return target;
  };
  /**
   * Constrains the position and updates the velocity if the position is out of `region`
   * so that it bounces at the region bounds.
   * @param quantity
   * @param region
   * @param restitution
   */
  const withinRectangle = (quantity, region, restitution) => {
    const { x, y } = quantity;
    const {
      topLeft: { x: minX, y: minY },
      bottomRight: { x: maxX, y: maxY }
    } = region;
    if (x < minX) {
      quantity.x = minX;
      quantity.vx = -restitution * quantity.vx;
    } else if (x >= maxX) {
      quantity.x = maxX - 1;
      quantity.vx = -restitution * quantity.vx;
    }
    if (y < minY) {
      quantity.y = minY;
      quantity.vy = -restitution * quantity.vy;
    } else if (y >= maxY) {
      quantity.y = maxY - 1;
      quantity.vy = -restitution * quantity.vy;
    }
  };
  /** A temporal vector for storing the impulsive force by the bounce. */
  const bounceForce = create$4();
  /**
   * Calculates and adds the impulsive force by the bounce.
   * @param quantity
   * @param normalUnitVector
   * @param restitution
   */
  const addForce$1 = (quantity, normalUnitVector, restitution) =>
    addForce(
      quantity,
      calculateForce(
        quantity.vx,
        quantity.vy,
        normalUnitVector,
        restitution,
        bounceForce
      )
    );
  const normalUnitVector = create$4();
  /**
   * Calculates and adds the impulsive force by the bounce.
   * Note that the penetration will not be fixed.
   */
  const addForceEachOther$1 = {
    calculate: (quantityA, quantityB, restitution) => {
      const bRelativeVelocityX = quantityB.vx - quantityA.vx;
      const bRelativeVelocityY = quantityB.vy - quantityA.vy;
      normalizeBetween$1(quantityA, quantityB, normalUnitVector);
      calculateForce(
        bRelativeVelocityX,
        bRelativeVelocityY,
        normalUnitVector,
        restitution,
        bounceForce
      );
      addForce(quantityB, bounceForce);
      multiply$1(bounceForce, -1);
      addForce(quantityA, bounceForce);
    },
    preCalculated: (
      quantityA,
      quantityB,
      bRelativeVelocityX,
      bRelativeVelocityY,
      normalUnitVectorToB,
      restitution
    ) => {
      calculateForce(
        bRelativeVelocityX,
        bRelativeVelocityY,
        normalUnitVectorToB,
        restitution,
        bounceForce
      );
      addForce(quantityB, bounceForce);
      multiply$1(bounceForce, -1);
      addForce(quantityA, bounceForce);
    }
  };
  /**
   * Constrains the position and adds the force if the position is out of `region`
   * so that it bounces at the region bounds.
   * @param quantity
   * @param region
   * @param restitution
   */
  const addForceWithinRectangle = (quantity, region, restitution) => {
    const { x, y } = quantity;
    const {
      topLeft: { x: minX, y: minY },
      bottomRight: { x: maxX, y: maxY }
    } = region;
    const forceFactor = 1 + restitution;
    if (x < minX) {
      quantity.x = minX;
      quantity.fx -= forceFactor * quantity.vx;
    } else if (x >= maxX) {
      quantity.x = maxX - 1;
      quantity.fx -= forceFactor * quantity.vx;
    }
    if (y < minY) {
      quantity.y = minY;
      quantity.fy -= forceFactor * quantity.vy;
    } else if (y >= maxY) {
      quantity.y = maxY - 1;
      quantity.fy -= forceFactor * quantity.vy;
    }
  };

  const bounce = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    calculateForce: calculateForce,
    withinRectangle: withinRectangle,
    addForce: addForce$1,
    addForceEachOther: addForceEachOther$1,
    addForceWithinRectangle: addForceWithinRectangle
  });

  /**
   * Creates an array of HSV values with random hue ∈ [0, 360].
   * @param saturation
   * @param value
   * @returns New array of HSV values.
   */
  const withRandomHue = (saturation, value$1) => [
    value(360),
    saturation,
    value$1
  ];
  /**
   * Converts HSV values (hue ∈ [0, 360], saturation ∈ [0, 1] and value ∈ [0, 1])
   * to RGB values (red, green, blue ∈ [0, 1]).
   * @param hsvValues
   * @returns New array of RGB values.
   */
  const toRGB = hsvValues => {
    const [hue, saturation, value] = hsvValues;
    const c = value * saturation;
    const dividedHue = hue * INVERSE60;
    const x = c * (1 - abs((dividedHue % 2) - 1));
    let tmpValues;
    switch (floor(dividedHue)) {
      case 0:
        tmpValues = [c, x, 0];
        break;
      case 1:
        tmpValues = [x, c, 0];
        break;
      case 2:
        tmpValues = [0, c, x];
        break;
      case 3:
        tmpValues = [0, x, c];
        break;
      case 4:
        tmpValues = [x, 0, c];
        break;
      case 5:
        tmpValues = [c, 0, x];
        break;
      default:
        tmpValues = [0, 0, 0];
        break;
    }
    const m = value - c;
    return [tmpValues[0] + m, tmpValues[1] + m, tmpValues[2] + m];
  };

  const hsv = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    withRandomHue: withRandomHue,
    toRGB: toRGB
  });

  const CCC = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Angle: angle,
    ArrayList: index$1,
    ArrayQueue: index$2,
    Arrays: index,
    Bezier: bezier,
    Bounce: bounce,
    ConstantFunction: constantFunction,
    Coordinates2D: coordinates2d,
    Dynamics: dynamics,
    Easing: index$4,
    FitBox: fitBox,
    Gravitation: gravitation,
    HSV: hsv,
    HtmlUtility: htmlUtility,
    Kinematics: kinematics,
    Lazy: lazy,
    Log: log$1,
    MathConstants: constants,
    MorseCode: index$7,
    Numeric: numeric,
    Random: index$5,
    RectangleRegion: rectangleRegion,
    RectangleSize: rectangleSize,
    Repeater: repeater,
    Rotation: rotation,
    SimpleDynamics: simpleDynamics,
    StructureOfArrays: structureOfArrays,
    Timer: index$6,
    Tween: index$8,
    Vector2D: index$3
  });

  /**
   * p5-extension
   *
   * An extension for p5.js.
   * GitHub repository: {@link https://github.com/fal-works/p5-extension}
   *
   * @module p5-extension
   * @copyright 2019-2020 FAL
   * @author FAL <contact@fal-works.com>
   * @license MIT
   * @version 0.7.2
   */

  const {
    RectangleRegion,
    FitBox,
    Arrays: {
      FullName: { loopArray, unifyToArray: unifyToArray$1 }
    },
    ArrayList,
    Vector2D,
    Vector2D: {
      FullName: {
        vectorFromPolar,
        copyVector,
        zeroVector,
        constrainVector,
        setCartesian: setCartesian$2
      }
    },
    Coordinates2D: { distance: distance$2 },
    Numeric: {
      sin: sin$1,
      cos: cos$1,
      round: round$1,
      lerp: lerp$1,
      inverseLerp: inverseLerp$1,
      max2: max2$1,
      clamp: clamp$3
    },
    MathConstants: {
      ONE_OVER_SQUARE_ROOT_TWO: ONE_OVER_SQUARE_ROOT_TWO$1,
      INVERSE255: INVERSE255$1
    },
    Random: {
      FullName: { randomValue, randomSigned }
    },
    Angle,
    Angle: { TWO_PI: TWO_PI$1 },
    HSV,
    ConstantFunction,
    ConstantFunction: { returnVoid: returnVoid$1 },
    Tween,
    Timer
  } = CCC;

  /**
   * The shared `p5` instance.
   */
  let p;
  /**
   * The shared `ScaledCanvas` instance.
   */
  let canvas;
  /**
   * The shared render.
   */
  let renderer;
  /**
   * Sets the given `p5` instance to be shared.
   * @param instance
   */
  const setP5Instance = instance => {
    p = instance;
    renderer = p;
  };
  /**
   * Sets the given `ScaledCanvas` instance to be shared.
   * @param scaledCanvas
   */
  const setCanvas = scaledCanvas => {
    canvas = scaledCanvas;
  };
  /**
   * Sets the given `ScaledCanvas` instance to be shared.
   * This will affect many drawing functions of p5-extension.
   * @param rendererInstance
   */
  const setRenderer = rendererInstance => {
    renderer = rendererInstance;
  };

  /**
   * Creates a new `p5.Color` instance from `color`.
   * @param color Either a grayness value, a color code string, an array of color values or another `p5.Color` instance.
   * @returns A new `p5.Color` instance.
   */
  const parseColor = color =>
    color instanceof p5.Color ? Object.create(color) : p.color(color);
  /**
   * Creates a function that applies a stroke color.
   * @param color `null` will be `noStroke()` and `undefined` will have no effects.
   * @returns A function that runs either `stroke()`, `noStroke()` or nothing.
   */
  const parseStroke = color => {
    if (color === null) return () => renderer.noStroke();
    if (color === undefined) return returnVoid$1;
    const colorObject = parseColor(color);
    return () => renderer.stroke(colorObject);
  };
  /**
   * Creates a function that applies a fill color.
   * @param color `null` will be `noFill()` and `undefined` will have no effects.
   * @returns A function that runs either `fill()`, `noFill()` or nothing.
   */
  const parseFill = color => {
    if (color === null) return () => renderer.noFill();
    if (color === undefined) return returnVoid$1;
    const colorObject = parseColor(color);
    return () => renderer.fill(colorObject);
  };
  /**
   * Creates a new `p5.Color` instance by replacing the alpha value with `alpha`.
   * The color mode should be `RGB` when using this function.
   * @param color
   * @param alpha
   */
  const colorWithAlpha = (color, alpha) => {
    const colorObject = parseColor(color);
    return p.color(
      p.red(colorObject),
      p.green(colorObject),
      p.blue(colorObject),
      alpha
    );
  };
  /**
   * Creates a new color by reversing each RGB value of the given `color`.
   * The alpha value will remain the same.
   * Be sure that the color mode is set to RGB ∈ [0, 255].
   * @param color
   * @returns New `p5.Color` instance with reversed RGB values.
   */
  const reverseColor = color =>
    p.color(
      255 - p.red(color),
      255 - p.green(color),
      255 - p.blue(color),
      p.alpha(color)
    );
  /**
   * Creates a new color from HSV values.
   * Be sure that the color mode is set to RGB (red, green, blue, alpha ∈ [0, 255]).
   * @param hue [0, 360]
   * @param saturation [0, 1]
   * @param value [0, 1]
   * @param alpha [0, 255]
   * @returns New `p5.Color` instance.
   */
  const hsvColor = (hue, saturation, value, alpha = 255) => {
    const [r, g, b] = HSV.toRGB([hue, saturation, value]);
    return p.color(r * 255, g * 255, b * 255, alpha);
  };
  /**
   * Converts a `p5.Color` instance to an object representation.
   * @param color
   * @returns RGB values.
   */
  const colorToRGB = color => {
    return {
      r: p.red(color),
      g: p.green(color),
      b: p.blue(color)
    };
  };
  /**
   * Converts a `p5.Color` instance to an object representation.
   * @param color
   * @returns ARGB values.
   */
  const colorToARGB = color => {
    return {
      a: p.alpha(color),
      r: p.red(color),
      g: p.green(color),
      b: p.blue(color)
    };
  };

  /**
   * Creats an `AlphaColor` unit.
   * The max alpha of `stroke()` and `fill()` should be set to `255` when using this function.
   * @param color
   * @param resolution
   */
  const create$f = (color, resolution) => {
    const colors = new Array(resolution);
    const maxIndex = resolution - 1;
    const baseColor = parseColor(color);
    if (resolution === 1) {
      colors[0] = baseColor;
    } else {
      const baseAlpha = p.alpha(baseColor);
      for (let i = 1; i < resolution; i += 1) {
        const alpha = baseAlpha * (i / maxIndex);
        colors[i] = colorWithAlpha(baseColor, alpha);
      }
    }
    return {
      colors,
      maxIndex
    };
  };
  /**
   * Gets a `p5.Color` instance.
   * @param alphaColor
   * @param alpha Alpha value from `0` to `255`.
   * @returns A `p5.Color` instance.
   */
  const get$3 = (alphaColor, alpha) =>
    alphaColor.colors[round$1(alphaColor.maxIndex * alpha * INVERSE255$1)];

  const alphaColor = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    create: create$f,
    get: get$3
  });

  /**
   * A list of functions that will be called in `p.setup()` just after creating canvas in `startSketch()`.
   */
  const onSetup = [];

  const overwrite = (shapeColor, strokeColor, fillColor, alphaResolution) => {
    if (alphaResolution === 1) {
      shapeColor.stroke = parseStroke(strokeColor);
      shapeColor.fill = parseFill(fillColor);
      return shapeColor;
    }
    if (strokeColor === null) {
      shapeColor.stroke = () => renderer.noStroke();
    } else if (strokeColor === undefined) {
      shapeColor.stroke = returnVoid$1;
    } else {
      const strokeAlphaColor = create$f(strokeColor, alphaResolution);
      shapeColor.stroke = alpha =>
        renderer.stroke(get$3(strokeAlphaColor, alpha));
    }
    if (fillColor === null) {
      shapeColor.fill = () => renderer.noFill();
    } else if (fillColor === undefined) {
      shapeColor.fill = returnVoid$1;
    } else {
      const fillAlphaColor = create$f(fillColor, alphaResolution);
      shapeColor.fill = alpha => renderer.fill(get$3(fillAlphaColor, alpha));
    }
    return shapeColor;
  };
  /**
   * Creates a `ShapeColor` unit.
   * The max alpha of `stroke()` and `fill()` should be set to `255` when using this function.
   * @param strokeColor `null` will be `noStroke()` and `undefined` will have no effects.
   * @param fillColor `null` will be `noFill()` and `undefined` will have no effects.
   * @param alphaResolution
   */
  const create$1$1 = (strokeColor, fillColor, alphaResolution) => {
    const shapeColor = {
      stroke: returnVoid$1,
      fill: returnVoid$1
    };
    const prepareShapeColor = overwrite.bind(
      undefined,
      shapeColor,
      strokeColor,
      fillColor,
      alphaResolution
    );
    if (p) return prepareShapeColor();
    onSetup.push(prepareShapeColor);
    return shapeColor;
  };
  /**
   * Applies the stroke and fill colors.
   * @param shapeColor
   * @param alpha Alpha value from `0` to `255`.
   */
  const apply = (shapeColor, alpha) => {
    if (alpha < 1) {
      renderer.noStroke();
      renderer.noFill();
      return;
    }
    shapeColor.stroke(alpha);
    shapeColor.fill(alpha);
  };

  const shapeColor = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    create: create$1$1,
    apply: apply
  });

  /**
   * Stores the current canvas pixels and returns a function that restores them.
   * @param renderer - Instance of either p5 or p5.Graphics. Defaults to shared `p`.
   * @param prepareCallback - Function that will be run just before `loadPixels()`.
   * @returns A function that restores the canvas pixels.
   */
  const storePixels = (renderer = p, prepareCallback) => {
    if (prepareCallback) {
      renderer.push();
      prepareCallback(renderer);
      renderer.pop();
    }
    renderer.loadPixels();
    const storedPixels = renderer.pixels;
    return () => {
      renderer.pixels = storedPixels;
      renderer.updatePixels();
    };
  };
  /**
   * Creates a function for setting color to the specified point.
   * Should be used in conjunction with loadPixels() and updatePixels().
   * @param renderer - Instance of either p5 or p5.Graphics.
   * @param logicalX - The logical x index of the point.
   * @param logicalY - The logical y index of the point.
   * @param red - The red value (0 - 255).
   * @param green - The green value (0 - 255).
   * @param blue - The blue value (0 - 255).
   */
  const createSetPixel = (renderer = p) => {
    const density = renderer.pixelDensity();
    const pixelWidth = renderer.width * density;
    const { pixels } = renderer;
    return (logicalX, logicalY, red, green, blue, alpha) => {
      const startX = logicalX * density;
      const endX = startX + density;
      const startY = logicalY * density;
      const endY = startY + density;
      for (let y = startY; y < endY; y += 1) {
        const pixelIndexAtX0 = y * pixelWidth;
        for (let x = startX; x < endX; x += 1) {
          const valueIndex = 4 * (pixelIndexAtX0 + x);
          pixels[valueIndex] = red;
          pixels[valueIndex + 1] = green;
          pixels[valueIndex + 2] = blue;
          pixels[valueIndex + 3] = alpha;
        }
      }
    };
  };
  /**
   * Creates a function for setting color to the specified row of pixels.
   * Should be used in conjunction with loadPixels() and updatePixels().
   * @param renderer - Instance of either p5 or p5.Graphics.
   * @param logicalY - The logical y index of the pixel row.
   * @param red - The red value (0 - 255).
   * @param green - The green value (0 - 255).
   * @param blue - The blue value (0 - 255).
   * @param alpha - The alpha value (0 - 255).
   */
  const createSetPixelRow = (renderer = p) => {
    const density = renderer.pixelDensity();
    const pixelWidth = renderer.width * density;
    const { pixels } = renderer;
    return (logicalY, red, green, blue, alpha) => {
      const startY = logicalY * density;
      const endY = startY + density;
      for (let y = startY; y < endY; y += 1) {
        const pixelIndexAtX0 = y * pixelWidth;
        for (let x = 0; x < pixelWidth; x += 1) {
          const valueIndex = 4 * (pixelIndexAtX0 + x);
          pixels[valueIndex] = red;
          pixels[valueIndex + 1] = green;
          pixels[valueIndex + 2] = blue;
          pixels[valueIndex + 3] = alpha;
        }
      }
    };
  };

  /**
   * Runs `drawCallback` translated with `offsetX` and `offsetY`,
   * then restores the transformation by calling `translate()` with negative values.
   * Used to avoid calling `push()` and `pop()` frequently.
   *
   * @param drawCallback
   * @param offsetX
   * @param offsetY
   */
  const drawTranslated = (drawCallback, offsetX, offsetY) => {
    renderer.translate(offsetX, offsetY);
    drawCallback();
    renderer.translate(-offsetX, -offsetY);
  };
  /**
   * Runs `drawCallback` rotated with `angle`,
   * then restores the transformation by calling `rotate()` with the negative value.
   * Used to avoid calling `push()` and `pop()` frequently.
   *
   * @param drawCallback
   * @param angle
   */
  const drawRotated = (drawCallback, angle) => {
    renderer.rotate(angle);
    drawCallback();
    renderer.rotate(-angle);
  };
  /**
   * Composite of `drawTranslated()` and `drawRotated()`.
   *
   * @param drawCallback
   * @param offsetX
   * @param offsetY
   * @param angle
   */
  const drawTranslatedAndRotated = (drawCallback, offsetX, offsetY, angle) => {
    renderer.translate(offsetX, offsetY);
    drawRotated(drawCallback, angle);
    renderer.translate(-offsetX, -offsetY);
  };
  /**
   * Runs `drawCallback` scaled with `scaleFactor`,
   * then restores the transformation by scaling with the inversed factor.
   * Used to avoid calling `push()` and `pop()` frequently.
   *
   * @param drawCallback
   * @param scaleFactor
   */
  const drawScaled = (drawCallback, scaleFactor) => {
    renderer.scale(scaleFactor);
    drawCallback();
    renderer.scale(1 / scaleFactor);
  };
  /**
   * Composite of `drawTranslated()` and `drawScaled()`.
   *
   * @param drawCallback
   * @param offsetX
   * @param offsetY
   * @param scaleFactor
   */
  const drawTranslatedAndScaled = (
    drawCallback,
    offsetX,
    offsetY,
    scaleFactor
  ) => {
    renderer.translate(offsetX, offsetY);
    drawScaled(drawCallback, scaleFactor);
    renderer.translate(-offsetX, -offsetY);
  };
  /**
   * Composite of `drawTranslated()`, `drawRotated()` and `drawScaled()`.
   *
   * @param drawCallback
   * @param offsetX
   * @param offsetY
   * @param angle
   * @param scaleFactor
   */
  const drawTransformed = (
    drawCallback,
    offsetX,
    offsetY,
    angle,
    scaleFactor
  ) => {
    renderer.translate(offsetX, offsetY);
    renderer.rotate(angle);
    renderer.scale(scaleFactor);
    drawCallback();
    renderer.scale(1 / scaleFactor);
    renderer.rotate(-angle);
    renderer.translate(-offsetX, -offsetY);
  };
  let lastTranslateX = 0;
  let lastTranslateY = 0;
  let lastRotateAngle = 0;
  let lastScaleFactor = 1;
  /**
   * Runs `translate()`. The given arguments will be saved.
   *
   * Note: Do not switch renderer with `setRenderer()` before undoing this operation with `undoTranslate()`.
   * @param x
   * @param y
   */
  const translate = (x, y) => {
    lastTranslateX = x;
    lastTranslateY = y;
    renderer.translate(x, y);
  };
  /**
   * Applies the inverse of the last transformation by `translate()`.
   */
  const undoTranslate = () => {
    renderer.translate(-lastTranslateX, -lastTranslateY);
  };
  /**
   * Runs `rotate()`. The given argument will be saved.
   *
   * Note: Do not switch renderer with `setRenderer()` before undoing this operation with `undoRotate()`.
   * @param angle
   */
  const rotate = angle => {
    lastRotateAngle = angle;
    renderer.rotate(angle);
  };
  /**
   * Applies the inverse of the last transformation by `rotate()`.
   */
  const undoRotate = () => {
    renderer.rotate(-lastRotateAngle);
  };
  /**
   * Runs `scale()`. The given argument will be saved.
   *
   * Note: Do not switch renderer with `setRenderer()` before undoing this operation with `undoScale()`.
   * @param scaleFactor
   */
  const scale = scaleFactor => {
    lastScaleFactor = scaleFactor;
    renderer.scale(scaleFactor);
  };
  /**
   * Applies the inverse of the last transformation by `scale()`.
   */
  const undoScale = () => {
    renderer.scale(1 / lastScaleFactor);
  };
  /**
   * Runs `translate()` and `rotate()`. The given arguments will be saved.
   *
   * Note: Do not switch renderer with `setRenderer()` before undoing this operation with `undoTranslateRotate()`.
   * @param x
   * @param y
   * @param angle
   */
  const translateRotate = (x, y, angle) => {
    lastTranslateX = x;
    lastTranslateY = y;
    lastRotateAngle = angle;
    renderer.translate(x, y);
    renderer.rotate(angle);
  };
  /**
   * Applies the inverse of the last transformation by `translateRotate()`.
   */
  const undoTranslateRotate = () => {
    renderer.rotate(-lastRotateAngle);
    renderer.translate(-lastTranslateX, -lastTranslateY);
  };
  /**
   * Runs `translate()` and `scale()`. The given arguments will be saved.
   *
   * Note: Do not switch renderer with `setRenderer()` before undoing this operation with `undoTranslateScale()`.
   * @param x
   * @param y
   * @param scaleFactor
   */
  const translateScale = (x, y, scaleFactor) => {
    lastTranslateX = x;
    lastTranslateY = y;
    lastScaleFactor = scaleFactor;
    renderer.translate(x, y);
    renderer.scale(scaleFactor);
  };
  /**
   * Applies the inverse of the last transformation by `translateScale()`.
   */
  const undoTranslateScale = () => {
    renderer.scale(1 / lastScaleFactor);
    renderer.translate(-lastTranslateX, -lastTranslateY);
  };
  /**
   * Runs `rotate()` and `scale()`. The given arguments will be saved.
   *
   * Note: Do not switch renderer with `setRenderer()` before undoing this operation with `undoRotateScale()`.
   * @param angle
   * @param scaleFactor
   */
  const rotateScale = (angle, scaleFactor) => {
    lastRotateAngle = angle;
    lastScaleFactor = scaleFactor;
    renderer.rotate(angle);
    renderer.scale(scaleFactor);
  };
  /**
   * Applies the inverse of the last transformation by `rotateScale()`.
   */
  const undoRotateScale = () => {
    renderer.scale(1 / lastScaleFactor);
    renderer.rotate(-lastRotateAngle);
  };
  /**
   * Runs `translate()`, `rotate()` and `scale()`. The given arguments will be saved.
   *
   * Note: Do not switch renderer with `setRenderer()` before undoing this operation with `undoTransform()`.
   * @param x
   * @param y
   * @param angle
   * @param scaleFactor
   */
  const transform = (x, y, angle, scaleFactor) => {
    lastTranslateX = x;
    lastTranslateY = y;
    lastRotateAngle = angle;
    lastScaleFactor = scaleFactor;
    renderer.translate(x, y);
    renderer.rotate(angle);
    renderer.scale(scaleFactor);
  };
  /**
   * Applies the inverse of the last transformation by `transform()`.
   */
  const undoTransform = () => {
    renderer.scale(1 / lastScaleFactor);
    renderer.rotate(-lastRotateAngle);
    renderer.translate(-lastTranslateX, -lastTranslateY);
  };

  /**
   * similar to p5 `curveVertex()` but takes a 2d-vector as argument.
   * @param vector
   */
  const curveVertexFromVector = vector =>
    renderer.curveVertex(vector.x, vector.y);
  /**
   * Draws a curve through `vertices`.
   * @param vertices
   */
  const drawCurve = vertices => {
    const { length } = vertices;
    renderer.beginShape();
    curveVertexFromVector(vertices[0]);
    for (let i = 0; i < length; i += 1) curveVertexFromVector(vertices[i]);
    curveVertexFromVector(vertices[length - 1]);
    renderer.endShape();
  };
  /**
   * Draws a curve through `vertices`, smoothly connecting the first and last vertex.
   * @param vertices
   */
  const drawCurveClosed = vertices => {
    const { length } = vertices;
    renderer.beginShape();
    for (let i = 0; i < length; i += 1) curveVertexFromVector(vertices[i]);
    for (let i = 0; i < 3; i += 1) curveVertexFromVector(vertices[i]);
    renderer.endShape();
  };

  const drawPath = path => {
    const { controlPoint1, controlPoint2, targetPoint } = path;
    renderer.bezierVertex(
      controlPoint1.x,
      controlPoint1.y,
      controlPoint2.x,
      controlPoint2.y,
      targetPoint.x,
      targetPoint.y
    );
  };
  const drawBezierCurve = curve => {
    const { startPoint, paths } = curve;
    renderer.vertex(startPoint.x, startPoint.y);
    loopArray(paths, drawPath);
  };
  const drawControlLine = vertex => {
    const { point, controlLine } = vertex;
    const { x, y } = point;
    const controlPointOffset = vectorFromPolar(
      0.5 * controlLine.length,
      controlLine.angle
    );
    const controlX = controlPointOffset.x;
    const controlY = controlPointOffset.y;
    renderer.line(x - controlX, y - controlY, x + controlX, y + controlY);
  };
  const drawBezierControlLines = vertices => {
    loopArray(vertices, drawControlLine);
  };

  const graphicsToImage = graphics => {
    const g = graphics;
    const { width, height } = g;
    const image = p.createImage(width, height);
    image.copy(graphics, 0, 0, width, height, 0, 0, width, height);
    return image;
  };

  let shakeFactor = 0;
  let shakeDecayFactor = 0;
  let shakeType = "DEFAULT";
  const setShake = (
    initialFactor,
    decayFactor,
    type = "DEFAULT",
    force = false
  ) => {
    if (decayFactor >= 1) return;
    if (!force && shakeFactor !== 0) return;
    shakeFactor = initialFactor;
    shakeDecayFactor = decayFactor;
    shakeType = type;
  };
  const applyShake = () => {
    if (shakeFactor === 0) return;
    const { width, height } = canvas.logicalSize;
    const xShake =
      shakeType === "VERTICAL" ? 0 : randomSigned(shakeFactor * width);
    const yShake =
      shakeType === "HORIZONTAL" ? 0 : randomSigned(shakeFactor * height);
    p.translate(xShake, yShake);
    shakeFactor *= shakeDecayFactor;
    if (shakeFactor < 0.001) shakeFactor = 0;
  };

  const line = (from, to) => renderer.line(from.x, from.y, to.x, to.y);
  const lineWithMargin = (from, to, margin) => {
    const angle = Angle.betweenPoints(from, to);
    const offsetX = margin * cos$1(angle);
    const offsetY = margin * sin$1(angle);
    return renderer.line(
      from.x + offsetX,
      from.y + offsetY,
      to.x - offsetX,
      to.y - offsetY
    );
  };
  const lineAtOrigin = destination =>
    renderer.line(0, 0, destination.x, destination.y);
  const circleAtOrigin = size => renderer.circle(0, 0, size);
  const arcAtOrigin = (width, height, startRatio, endRatio, mode, detail) =>
    renderer.arc(
      0,
      0,
      width,
      height,
      startRatio * TWO_PI$1,
      endRatio * TWO_PI$1,
      mode,
      detail
    );
  const circularArcAtOrigin = (size, startRatio, endRatio, mode, detail) =>
    renderer.arc(
      0,
      0,
      size,
      size,
      startRatio * TWO_PI$1,
      endRatio * TWO_PI$1,
      mode,
      detail
    );

  /**
   * Draws texture on `renderer` by applying `runSetPixel` to each coordinate.
   * @param runSetPixel - A function that takes `setPixel`, `x`, `y` as arguments and internally runs `setPixel`.
   * @param renderer - Instance of either p5 or p5.Graphics. Defaults to the shared `p`.
   */
  const drawTexture = (runSetPixel, renderer = p) => {
    const { width, height } = renderer;
    renderer.loadPixels();
    const setPixel = createSetPixel(renderer);
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        runSetPixel(setPixel, x, y);
      }
    }
    renderer.updatePixels();
  };
  /**
   * Creates a texture by applying `runSetPixel` to each coordinate of a new `p5.Graphics` instance.
   * @param widht
   * @param height
   * @param runSetPixel - A function that takes `setPixel`, `x`, `y` as arguments and internally runs `setPixel`.
   * @returns New `p5.Graphics` instance.
   */
  const createTexture = (width, height, runSetPixel) => {
    const graphics = p.createGraphics(width, height);
    drawTexture(runSetPixel, graphics);
    return graphics;
  };
  /**
   * Draws texture on `renderer` by applying `runSetPixelRow` to each y coordinate.
   * @param runSetPixelRow - A function that takes `setPixelRow` and `y` as arguments and internally runs `setPixel`.
   * @param renderer - Instance of either p5 or p5.Graphics. Defaults to the shared `p`.
   */
  const drawTextureRowByRow = (runSetPixelRow, renderer = p) => {
    const { height } = renderer;
    renderer.loadPixels();
    const setPixelRow = createSetPixelRow(renderer);
    for (let y = 0; y < height; y += 1) runSetPixelRow(setPixelRow, y);
    renderer.updatePixels();
  };
  /**
   * Creates a texture by applying `runSetPixelRow` to each y coordinate of a new `p5.Graphics` instance.
   * @param width
   * @param height
   * @param runSetPixelRow - A function that takes `setPixelRow` and `y` as arguments and internally runs `setPixel`.
   * @returns New `p5.Graphics` instance.
   */
  const createTextureRowByRow = (width, height, runSetPixelRow) => {
    const graphics = p.createGraphics(width, height);
    drawTextureRowByRow(runSetPixelRow, graphics);
    return graphics;
  };

  /**
   * Draws a trimmed line between [`x1`, `y1`] and [`x2`, `y2`] using the given trimming ratios.
   * @param x1
   * @param y1
   * @param x2
   * @param y2
   * @param startRatio - A number between 0 and 1.
   * @param endRatio - A number between 0 and 1.
   */
  const draw = (x1, y1, x2, y2, startRatio, endRatio) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    renderer.line(
      x1 + startRatio * dx,
      y1 + startRatio * dy,
      x1 + endRatio * dx,
      y1 + endRatio * dy
    );
  };
  /**
   * Creates a function that draws a trimmed line between [`x1`, `y1`] and [`x2`, `y2`].
   * @param x1
   * @param y1
   * @param x2
   * @param y2
   * @returns A new drawing function.
   */
  const create$2$1 = (x1, y1, x2, y2) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return (startRatio, endRatio) =>
      renderer.line(
        x1 + startRatio * dx,
        y1 + startRatio * dy,
        x1 + endRatio * dx,
        y1 + endRatio * dy
      );
  };

  const line$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    draw: draw,
    create: create$2$1
  });

  /**
   * Draws a trimmed ellipse at [`x`, `y`] using the given size and trimming ratios.
   * @param x
   * @param y
   * @param sizeX
   * @param sizeY
   * @param startRatio - A number between 0 and 1.
   * @param endRatio - A number between 0 and 1.
   * @param mode - Either `CHORD`, `PIE` or `OPEN`.
   * @param detail - For WebGL only. Defaults to `25`.
   */
  const draw$1 = (x, y, sizeX, sizeY, startRatio, endRatio, mode, detail) => {
    if (startRatio === endRatio) return;
    renderer.arc(
      x,
      y,
      sizeX,
      sizeY,
      startRatio * TWO_PI$1,
      endRatio * TWO_PI$1,
      mode,
      detail
    );
  };
  /**
   * Creates a function that draws a trimmed ellipse at [`x`, `y`] with the given size.
   * @param x
   * @param y
   * @param sizeX
   * @param sizeY
   * @param mode - Either `CHORD`, `PIE` or `OPEN`.
   * @param detail - For WebGL only. Defaults to `25`.
   * @returns A new drawing function.
   */
  const create$3$1 = (x, y, sizeX, sizeY, mode, detail) => (
    startRatio,
    endRatio
  ) => draw$1(x, y, sizeX, sizeY, startRatio, endRatio, mode, detail);

  const ellipse = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    draw: draw$1,
    create: create$3$1
  });

  /**
   * Draws a trimmed circle at [`x`, `y`] using the given size and trimming ratios.
   * @param x
   * @param y
   * @param size
   * @param startRatio - A number between 0 and 1.
   * @param endRatio - A number between 0 and 1.
   * @param mode - Either `CHORD`, `PIE` or `OPEN`.
   * @param detail - For WebGL only. Defaults to `25`.
   */
  const draw$2 = (x, y, size, startRatio, endRatio, mode, detail) =>
    draw$1(x, y, size, size, startRatio, endRatio, mode, detail);
  /**
   * Creates a function that draws a trimmed circle at [`x`, `y`] with the given size.
   * @param x
   * @param y
   * @param size
   * @param mode - Either `CHORD`, `PIE` or `OPEN`.
   * @param detail - For WebGL only. Defaults to `25`.
   * @returns A new drawing function.
   */
  const create$4$1 = (x, y, size, mode, detail) =>
    create$3$1(x, y, size, size, mode, detail);

  const circle = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    draw: draw$2,
    create: create$4$1
  });

  /** For internal use in `createPaths()`. */
  const createPathParameters = (from, to) => {
    return {
      from,
      to,
      length: distance$2(from.x, from.y, to.x, to.y)
    };
  };
  /**
   * For internal use in `createPolygon()`.
   * @param vertices
   */
  const createPaths = vertices => {
    const vertexCount = vertices.length;
    const pathParameters = new Array(vertexCount);
    const lastIndex = vertexCount - 1;
    let totalLength = 0;
    for (let i = 0; i < lastIndex; i += 1) {
      const parameter = createPathParameters(vertices[i], vertices[i + 1]);
      pathParameters[i] = parameter;
      totalLength += parameter.length;
    }
    const lastParameter = createPathParameters(
      vertices[lastIndex],
      vertices[0]
    );
    pathParameters[lastIndex] = lastParameter;
    totalLength += lastParameter.length;
    const paths = new Array(vertexCount);
    for (let i = 0, lastThresholdRatio = 0; i < vertexCount; i += 1) {
      const parameters = pathParameters[i];
      const lengthRatio = parameters.length / totalLength;
      const nextThresholdRatio = lastThresholdRatio + lengthRatio;
      paths[i] = {
        from: parameters.from,
        to: parameters.to,
        previousRatio: lastThresholdRatio,
        nextRatio: nextThresholdRatio
      };
      lastThresholdRatio = nextThresholdRatio;
    }
    return paths;
  };
  /** For internal use in `createPolygon()`. */
  const getStartPathIndex = (startRatio, paths) => {
    for (let i = paths.length - 1; i >= 0; i -= 1) {
      if (paths[i].previousRatio <= startRatio) return i;
    }
    return 0;
  };
  /** For internal use in `createPolygon()`. */
  const getEndPathIndex = (endRatio, paths) => {
    const { length } = paths;
    for (let i = 0; i < length; i += 1) {
      if (endRatio <= paths[i].nextRatio) return i;
    }
    return length - 1;
  };
  /** For internal use in `createPolygon()`. */
  const drawVertexOnPath = (path, lerpRatio) => {
    const { from, to } = path;
    renderer.vertex(
      lerp$1(from.x, to.x, lerpRatio),
      lerp$1(from.y, to.y, lerpRatio)
    );
  };
  /**
   * Creates a function for drawing trimmed 2D polygon through `vertices`.
   * @param vertices
   * @returns Function for drawing trimmed 2D polygon.
   */
  const create$5$1 = vertices => {
    const paths = createPaths(vertices);
    return (startRatio, endRatio) => {
      const startPathIndex = getStartPathIndex(startRatio, paths);
      const endPathIndex = getEndPathIndex(endRatio, paths);
      const startPathRatio = inverseLerp$1(
        startRatio,
        paths[startPathIndex].previousRatio,
        paths[startPathIndex].nextRatio
      );
      const endPathRatio = inverseLerp$1(
        endRatio,
        paths[endPathIndex].previousRatio,
        paths[endPathIndex].nextRatio
      );
      renderer.beginShape();
      drawVertexOnPath(paths[startPathIndex], startPathRatio);
      if (startPathIndex !== endPathIndex) {
        for (let i = startPathIndex; i < endPathIndex; i += 1) {
          const nextVertex = paths[i].to;
          renderer.vertex(nextVertex.x, nextVertex.y);
        }
      }
      drawVertexOnPath(paths[endPathIndex], endPathRatio);
      renderer.endShape();
    };
  };

  const polygon = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    create: create$5$1
  });

  const createCorner = (x, y, width, height) => {
    const x2 = x + width;
    const y2 = y + height;
    return create$5$1([
      { x, y },
      { x: x2, y },
      { x: x2, y: y2 },
      { x, y: y2 }
    ]);
  };
  const createCenter = (x, y, width, height) => {
    const halfWidth = 0.5 * width;
    const halfHeight = 0.5 * height;
    const x1 = x - halfWidth;
    const y1 = y - halfHeight;
    const x2 = x + halfWidth;
    const y2 = y + halfHeight;
    return create$5$1([
      { x: x1, y: y1 },
      { x: x2, y: y1 },
      { x: x2, y: y2 },
      { x: x1, y: y2 }
    ]);
  };

  const rectangle = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    createCorner: createCorner,
    createCenter: createCenter
  });

  const createCorner$1 = (x, y, size) => createCorner(x, y, size, size);
  const createCenter$1 = (x, y, size) => createCenter(x, y, size, size);

  const square$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    createCorner: createCorner$1,
    createCenter: createCenter$1
  });

  const fullName$6 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    drawTrimmedLine: draw,
    createTrimmedLine: create$2$1,
    drawTrimmedEllipse: draw$1,
    createTrimmedEllipse: create$3$1,
    drawTrimmedCircle: draw$2,
    createTrimmedCircle: create$4$1,
    createTrimmedPolygon: create$5$1,
    createTrimmedRectangleCorner: createCorner,
    createTrimmedRectangleCenter: createCenter,
    createTrimmedSquareCorner: createCorner$1,
    createTrimmedSquareCenter: createCenter$1
  });

  const index$9 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Line: line$1,
    Ellipse: ellipse,
    Circle: circle,
    Polygon: polygon,
    Rectangle: rectangle,
    Square: square$1,
    FullName: fullName$6
  });

  const create$6$1 = parameters => {
    const {
      displaySize,
      initialDisplayPosition,
      initialFocusPoint,
      minZoomFactor,
      maxZoomFactor
    } = parameters;
    const regionBoundary =
      parameters.regionBoundary || RectangleRegion.createInfinite();
    const zoomFactorThreshold = FitBox.calculateScaleFactor(
      RectangleRegion.getSize(regionBoundary),
      displaySize
    );
    const zoomFactorRangeStart = minZoomFactor
      ? max2$1(zoomFactorThreshold, minZoomFactor)
      : zoomFactorThreshold;
    const zoomFactorRangeEnd = maxZoomFactor
      ? max2$1(zoomFactorRangeStart, maxZoomFactor)
      : Infinity;
    return {
      displaySize,
      displayPosition: copyVector(initialDisplayPosition || zeroVector),
      regionBoundary,
      zoomFactorRange: {
        start: zoomFactorRangeStart,
        end: zoomFactorRangeEnd
      },
      focusPoint: initialFocusPoint
        ? copyVector(initialFocusPoint)
        : regionBoundary
        ? RectangleRegion.getCenterPoint(regionBoundary)
        : copyVector(zeroVector),
      zoomFactor: 1,
      zoomTimer: Timer.dummy,
      targetZoomFactor: undefined,
      targetFocusPoint: undefined,
      focusPointEasingFactor: 0.1
    };
  };
  const update$1 = camera => {
    const {
      displaySize: { width, height },
      regionBoundary: {
        topLeft: { x: leftX, y: topY },
        bottomRight: { x: rightX, y: bottomY }
      },
      zoomFactor,
      focusPoint,
      targetFocusPoint,
      focusPointEasingFactor
    } = camera;
    if (targetFocusPoint) {
      focusPoint.x +=
        focusPointEasingFactor * (targetFocusPoint.x - focusPoint.x);
      focusPoint.y +=
        focusPointEasingFactor * (targetFocusPoint.y - focusPoint.y);
    }
    const logicalHalfWidth = width / (2 * zoomFactor);
    const logicalHalfHeight = height / (2 * zoomFactor);
    const minX = leftX + logicalHalfWidth;
    const maxX = rightX - logicalHalfWidth;
    const minY = topY + logicalHalfHeight;
    const maxY = bottomY - logicalHalfHeight;
    constrainVector(focusPoint, minX, maxX, minY, maxY);
    Timer.Component.step(camera.zoomTimer);
  };
  const draw$3 = (camera, drawCallback) => {
    const { displaySize, displayPosition, focusPoint, zoomFactor } = camera;
    drawTranslatedAndScaled(
      drawCallback,
      displayPosition.x + displaySize.width / 2 - zoomFactor * focusPoint.x,
      displayPosition.y + displaySize.height / 2 - zoomFactor * focusPoint.y,
      zoomFactor
    );
  };
  /**
   * Stops and discards the timer for zoom in/out that is currently running.
   * @param camera
   */
  const stopTweenZoom = camera => {
    camera.zoomTimer = Timer.dummy;
    camera.targetZoomFactor = undefined;
  };
  /**
   * Sets the zoom factor of `camera` immediately to `zoomFactor`.
   * If any zoom timer is set by `tweenZoom`, it will be stopped and discarded.
   * @param camera
   * @param zoomFactor
   */
  const setZoom = (camera, zoomFactor) => {
    const { zoomFactorRange } = camera;
    const newZoomFactor = clamp$3(
      zoomFactor,
      zoomFactorRange.start,
      zoomFactorRange.end
    );
    camera.zoomFactor = newZoomFactor;
    stopTweenZoom(camera);
  };
  /**
   * Creates and sets a `Timer` component for changing the zoom factor.
   * The timer will be automatically run in `Camera.update`.
   * If any timer is already running, it will be overwritten.
   * @param camera
   * @param targetZoomFactor
   * @param easing Optional
   * @param duration Optional. Defaults to 60
   */
  const tweenZoom = (camera, targetZoomFactor, easing, duration = 60) => {
    const { zoomFactorRange } = camera;
    const endZoomFactor = clamp$3(
      targetZoomFactor,
      zoomFactorRange.start,
      zoomFactorRange.end
    );
    const timer = Tween.create(v => (camera.zoomFactor = v), duration, {
      start: camera.zoomFactor,
      end: endZoomFactor,
      easing
    });
    timer.onComplete.push(stopTweenZoom.bind(undefined, camera));
    camera.targetZoomFactor = endZoomFactor;
    return (camera.zoomTimer = timer);
  };
  /**
   * Converts `screenPosition` to the logical position in the world that is currently displayed by `camera`.
   * @param camera
   * @param screenPosition
   * @param target The vector to receive the result.
   * @returns The `target` vector.
   */
  const getWorldPosition = (camera, screenPosition, target) => {
    const { displaySize, displayPosition, focusPoint, zoomFactor } = camera;
    const inverseFactor = 1 / zoomFactor;
    return setCartesian$2(
      target,
      inverseFactor *
        (screenPosition.x - (displayPosition.x + displaySize.width / 2)) +
        focusPoint.x,
      inverseFactor *
        (screenPosition.y - (displayPosition.y + displaySize.height / 2)) +
        focusPoint.y
    );
  };
  /**
   * Converts `worldPosition` to the actual position on the screen.
   * @param camera
   * @param worldPosition
   * @param target The vector to receive the result.
   * @returns The `target` vector.
   */
  const getScreenPosition = (camera, worldPosition, target) => {
    const { displaySize, displayPosition, focusPoint, zoomFactor } = camera;
    return setCartesian$2(
      target,
      displayPosition.x +
        displaySize.width / 2 +
        zoomFactor * (worldPosition.x - focusPoint.x),
      displayPosition.y +
        displaySize.height / 2 +
        zoomFactor * (worldPosition.y - focusPoint.y)
    );
  };

  const camera = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    create: create$6$1,
    update: update$1,
    draw: draw$3,
    stopTweenZoom: stopTweenZoom,
    setZoom: setZoom,
    tweenZoom: tweenZoom,
    getWorldPosition: getWorldPosition,
    getScreenPosition: getScreenPosition
  });

  /**
   * Logical position (independent of the canvas scale factor) of the mouse.
   */
  const position = { x: 0, y: 0 };
  /**
   * Logical position (independent of the canvas scale factor) of the mouse
   * at the previous frame.
   */
  const previousPosition = { x: 0, y: 0 };
  /**
   * Logical displacement (independent of the canvas scale factor) of the mouse
   * from the previous frame.
   */
  const displacement = { x: 0, y: 0 };
  /**
   * Updates `position`, `previousPosition` and `displacement` of the mouse cursor
   * calculating from its physical position.
   */
  const updatePosition = () => {
    if (!canvas) return;
    const factor = 1 / canvas.scaleFactor;
    Vector2D.Mutable.set(previousPosition, position);
    Vector2D.Mutable.setCartesian(
      position,
      factor * p.mouseX,
      factor * p.mouseY
    );
    Vector2D.Assign.subtract(position, previousPosition, displacement);
  };
  /**
   * Sets mouse position to the center point of the canvas.
   */
  const setCenter = () =>
    Vector2D.Mutable.set(position, canvas.logicalCenterPosition);
  /**
   * Runs `callback` translated with the logical mouse position.
   * @param callback
   */
  const drawAtCursor = callback =>
    drawTranslated(callback, position.x, position.y);
  /**
   * Checks if the mouse cursor position is contained in the region of the canvas.
   * @returns `true` if mouse cursor is on the canvas.
   */
  const isOnCanvas = () =>
    RectangleRegion.containsPoint(canvas.logicalRegion, position, 0);

  /**
   * The global flag that indicates if mouse events should be handled.
   */
  let active = true;
  /**
   * Sets the global flag that indicates if mouse events should be handled.
   * @param flag
   */
  const setActive = flag => {
    active = flag;
  };
  /**
   * A `Handler` function with no effect.
   * @returns Nothing so that subsequent `Handler`s will be called.
   */
  const emptyHandler = ConstantFunction.returnVoid;
  /**
   * A `Handler` function with no effect.
   * @returns `false` so that subsequent `Handler`s will be ignored.
   */
  const stopHandler = ConstantFunction.returnFalse;
  /**
   * Run all `handlers`.
   * @param handlers
   * @returns `false` if any handler returned `false`. If not, `true`.
   */
  const runHandlers = handlers => {
    let result = true;
    for (let i = 0; i < handlers.length; i += 1)
      result = handlers[i](position) !== false && result;
    return result;
  };
  /**
   * Creates a `Listener` that will be referred by each mouse event.
   * @param callbacks
   * @returns A `Listener` object.
   */
  const createListener = callbacks => ({
    onClicked: unifyToArray$1(callbacks.onClicked),
    onPressed: unifyToArray$1(callbacks.onPressed),
    onReleased: unifyToArray$1(callbacks.onReleased),
    onMoved: unifyToArray$1(callbacks.onMoved),
    onEnter: unifyToArray$1(callbacks.onEnter),
    onLeave: unifyToArray$1(callbacks.onLeave),
    isMouseOver: callbacks.isMouseOver || ConstantFunction.returnTrue,
    active: true,
    mouseOver: false
  });
  /**
   * The `Listener` that will be called first by any mouse event.
   * Set a `Handler` function that returns `false` here for ignoring subsequent `Handler`s.
   */
  const topListener = createListener({});
  /**
   * A stack of `Listener` objects that will be called by any mouse event.
   * Set a `Handler` function that returns `false` for ignoring subsequent `Handler`s.
   */
  const listenerStack = ArrayList.create(32);
  /**
   * The `Listener` that will be called last by any mouse event
   * after checking the `Handler`s in `listenerStack`.
   */
  const bottomListener = createListener({});
  /**
   * Adds `listener` to `listenerStack`.
   * @param listener
   */
  const addListener = listener => ArrayList.add(listenerStack, listener);
  /**
   * Creates a new `Listener` and adds it to `listenerStack`.
   * @param callbacks
   * @returns Created `Listener`.
   */
  const addNewListener = callbacks => {
    const newListener = createListener(callbacks);
    ArrayList.add(listenerStack, newListener);
    return newListener;
  };
  /**
   * Removes `listener` from `listenerStack`.
   * @param listener
   */
  const removeListener = listener =>
    ArrayList.removeShiftElement(listenerStack, listener);
  /**
   * @param type
   * @returns A function that gets the handler functions (corresponding to `type`) from `listener`.
   */
  const createGetHandlers = type => {
    switch (type) {
      case 0:
        return listener => listener.onClicked;
      case 1:
        return listener => listener.onPressed;
      case 2:
        return listener => listener.onReleased;
      case 3:
        return listener => listener.onMoved;
    }
  };
  /**
   * @param type
   * @returns A function that gets the handler functions (corresponding to `type`) from `listener` and runs them.
   */
  const createRunHandlers = type => {
    const getHandlers = createGetHandlers(type);
    return listener => {
      if (!(listener.active && listener.mouseOver)) return true;
      return runHandlers(getHandlers(listener));
    };
  };
  /**
   * @param type
   * @returns A function that should be called by `type` and runs registered event handlers.
   */
  const createOnEvent = type => {
    const runHandlersOf = createRunHandlers(type);
    return () => {
      if (!active) return;
      if (runHandlersOf(topListener) === false) return;
      const listeners = listenerStack.array;
      let index = listenerStack.size - 1;
      while (index >= 0) {
        if (runHandlersOf(listeners[index]) === false) return;
        index -= 1;
      }
      runHandlersOf(bottomListener);
    };
  };
  const onClicked = createOnEvent(0);
  const onPressed = createOnEvent(1);
  const onReleased = createOnEvent(2);
  const setMouseOverFalse = listener => {
    listener.mouseOver = false;
    return true;
  };
  const updateRun = listener => {
    if (!listener.active) return;
    if (!listener.isMouseOver(position)) {
      if (listener.mouseOver) {
        listener.mouseOver = false;
        return runHandlers(listener.onLeave);
      }
      return;
    }
    if (!listener.mouseOver) {
      listener.mouseOver = true;
      const onEnterResult = runHandlers(listener.onEnter) !== false;
      return runHandlers(listener.onMoved) !== false && onEnterResult;
    }
    return runHandlers(listener.onMoved);
  };
  const onMoved = () => {
    if (!active) return;
    let processListener = updateRun;
    if (processListener(topListener) === false) {
      processListener = setMouseOverFalse;
    }
    const listeners = listenerStack.array;
    let index = listenerStack.size - 1;
    while (index >= 0) {
      if (processListener(listeners[index]) === false) {
        processListener = setMouseOverFalse;
      }
      index -= 1;
    }
    processListener(bottomListener);
  };

  const event = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    get active() {
      return active;
    },
    setActive: setActive,
    emptyHandler: emptyHandler,
    stopHandler: stopHandler,
    createListener: createListener,
    topListener: topListener,
    listenerStack: listenerStack,
    bottomListener: bottomListener,
    addListener: addListener,
    addNewListener: addNewListener,
    removeListener: removeListener,
    onClicked: onClicked,
    onPressed: onPressed,
    onReleased: onReleased,
    onMoved: onMoved
  });

  var State;
  (function(State) {
    State[(State["Default"] = 0)] = "Default";
    State[(State["MouseOver"] = 1)] = "MouseOver";
    State[(State["Pressed"] = 2)] = "Pressed";
    State[(State["Inactive"] = 3)] = "Inactive";
    State[(State["Hidden"] = 4)] = "Hidden";
  })(State || (State = {}));
  const setStateDefault = button => {
    button.state = State.Default;
    button.draw = button.drawDefault;
    button.listener.active = true;
  };
  const setStateMouseOver = button => {
    button.state = State.MouseOver;
    button.draw = button.drawMouseOver;
    button.listener.active = true;
  };
  const setStatePressed = button => {
    button.state = State.Pressed;
    button.draw = button.drawPressed;
    button.listener.active = true;
  };
  const setStateInactive = button => {
    button.state = State.Inactive;
    button.draw = button.drawInactive;
    button.listener.active = false;
  };
  const setStateHidden = button => {
    button.state = State.Hidden;
    button.draw = returnVoid$1;
    button.listener.active = false;
  };
  /**
   * Creates a new `Button` unit.
   * @param parameters
   * @param addListenerOnStack Either the new listener should be automatically added to `Mouse.Event.listenerStack`.
   *   Defaults to `true`.
   */
  const create$7$1 = (parameters, addListenerOnStack = true) => {
    const drawDefault = parameters.drawDefault;
    const drawMouseOver = parameters.drawMouseOver || drawDefault;
    const drawPressed = parameters.drawPressed || drawDefault;
    const drawInactive = parameters.drawInactive || drawDefault;
    const draw = drawDefault;
    const listener = addListenerOnStack
      ? addNewListener(parameters)
      : createListener(parameters);
    const button = {
      listener,
      drawDefault,
      drawMouseOver,
      drawPressed,
      drawInactive,
      draw,
      state: State.Default
    };
    const allowSubsequentEvents = !!parameters.allowSubsequentEvents;
    const setMouseOver = () => {
      setStateMouseOver(button);
      return allowSubsequentEvents;
    };
    const setDefault = () => {
      setStateDefault(button);
      return allowSubsequentEvents;
    };
    const setPressed = () => {
      setStatePressed(button);
      return allowSubsequentEvents;
    };
    const autoCursor = () => p.cursor("auto");
    const pointerCursor = () => p.cursor("pointer");
    listener.onEnter.push(setMouseOver, pointerCursor);
    listener.onPressed.push(setPressed);
    listener.onClicked.push(setMouseOver);
    listener.onLeave.push(setDefault, autoCursor);
    if (!allowSubsequentEvents) {
      listener.onMoved.push(stopHandler);
      listener.onReleased.push(stopHandler);
    }
    return button;
  };
  /**
   * Calls `button.draw()`.
   * @param button
   */
  const draw$4 = button => button.draw();

  const button = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    get State() {
      return State;
    },
    setStateDefault: setStateDefault,
    setStateMouseOver: setStateMouseOver,
    setStatePressed: setStatePressed,
    setStateInactive: setStateInactive,
    setStateHidden: setStateHidden,
    create: create$7$1,
    draw: draw$4
  });

  const index$1$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Event: event,
    Button: button,
    position: position,
    previousPosition: previousPosition,
    displacement: displacement,
    updatePosition: updatePosition,
    setCenter: setCenter,
    drawAtCursor: drawAtCursor,
    isOnCanvas: isOnCanvas
  });

  const anyKeyIsDown = keyCodes => {
    for (const keyCode of keyCodes) {
      if (p.keyIsDown(keyCode)) return true;
    }
    return false;
  };

  const keyboard = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    anyKeyIsDown: anyKeyIsDown
  });

  let horizontalMove = 0;
  let verticalMove = 0;
  const unitVector = { x: 0, y: 0 };
  let up = false;
  let left = false;
  let down = false;
  let right = false;
  const setVec = (x, y) => Vector2D.Mutable.setCartesian(unitVector, x, y);
  const update$1$1 = () => {
    horizontalMove = (left ? -1 : 0) + (right ? 1 : 0);
    verticalMove = (up ? -1 : 0) + (down ? 1 : 0);
    switch (horizontalMove) {
      case -1:
        switch (verticalMove) {
          case -1:
            setVec(-ONE_OVER_SQUARE_ROOT_TWO$1, -ONE_OVER_SQUARE_ROOT_TWO$1);
            break;
          case 0:
            setVec(-1, 0);
            break;
          case 1:
            setVec(-ONE_OVER_SQUARE_ROOT_TWO$1, ONE_OVER_SQUARE_ROOT_TWO$1);
            break;
        }
        break;
      case 0:
        switch (verticalMove) {
          case -1:
            setVec(0, -1);
            break;
          case 0:
            setVec(0, 0);
            break;
          case 1:
            setVec(0, 1);
            break;
        }
        break;
      case 1:
        switch (verticalMove) {
          case -1:
            setVec(ONE_OVER_SQUARE_ROOT_TWO$1, -ONE_OVER_SQUARE_ROOT_TWO$1);
            break;
          case 0:
            setVec(1, 0);
            break;
          case 1:
            setVec(ONE_OVER_SQUARE_ROOT_TWO$1, ONE_OVER_SQUARE_ROOT_TWO$1);
            break;
        }
        break;
    }
  };
  const onPressed$1 = () => {
    switch (p.key) {
      case "w":
        up = true;
        break;
      case "a":
        left = true;
        break;
      case "s":
        down = true;
        break;
      case "d":
        right = true;
        break;
    }
    switch (p.keyCode) {
      case 38:
        up = true;
        break;
      case 37:
        left = true;
        break;
      case 40:
        down = true;
        break;
      case 39:
        right = true;
        break;
    }
    update$1$1();
  };
  const onReleased$1 = () => {
    switch (p.key) {
      case "w":
        up = false;
        break;
      case "a":
        left = false;
        break;
      case "s":
        down = false;
        break;
      case "d":
        right = false;
        break;
    }
    switch (p.keyCode) {
      case 38:
        up = false;
        break;
      case 37:
        left = false;
        break;
      case 40:
        down = false;
        break;
      case 39:
        right = false;
        break;
    }
    update$1$1();
  };

  const moveKeys = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    get horizontalMove() {
      return horizontalMove;
    },
    get verticalMove() {
      return verticalMove;
    },
    unitVector: unitVector,
    get up() {
      return up;
    },
    get left() {
      return left;
    },
    get down() {
      return down;
    },
    get right() {
      return right;
    },
    onPressed: onPressed$1,
    onReleased: onReleased$1
  });

  let paused = false;
  /**
   * Pauses the sketch by `p.noLoop()`.
   */
  const pause = () => {
    p.noLoop();
    paused = true;
  };
  /**
   * Resumes the sketch by `p.loop()`.
   */
  const resume = () => {
    p.loop();
    paused = false;
  };
  /**
   * Pauses the sketch by `p.noLoop()`.
   * If already paused, resumes by `p.loop()`.
   */
  const pauseOrResume = () => {
    if (paused) resume();
    else pause();
  };

  /**
   * Creates a 1-dimensional noise function with offset parameter.
   * @param offset Random if not specified.
   * @returns New function that runs `noise()` of p5.
   */
  const withOffset = (offset = randomValue(4096)) => x => p.noise(offset + x);
  /**
   * Creates a 2-dimensional noise function with offset parameters.
   * @param offsetX Random if not specified.
   * @param offsetY Random if not specified.
   * @returns New function that runs `noise()` of p5.
   */
  const withOffset2 = (
    offsetX = randomValue(4096),
    offsetY = randomValue(256)
  ) => (x, y) => p.noise(offsetX + x, offsetY + y);
  /**
   * Creates a 3-dimensional noise function with offset parameters.
   * @param offsetX Random if not specified.
   * @param offsetY Random if not specified.
   * @param offsetZ Random if not specified.
   * @returns New function that runs `noise()` of p5.
   */
  const withOffset3 = (
    offsetX = randomValue(4096),
    offsetY = randomValue(256),
    offsetZ = randomValue(16)
  ) => (x, y, z) => p.noise(offsetX + x, offsetY + y, offsetZ + z);
  /**
   * Creates a noise function without arguments that returns every time an updated value.
   * @param changeRate
   * @param offset Random if not specified.
   * @returns New function that runs `noise()` of p5, internally changing the `x` argument by `changeRate`.
   */
  const withChangeRate = (changeRate, offset = randomValue(4096)) => {
    let x = offset;
    return () => p.noise((x += changeRate));
  };
  /**
   * Creates a 1-dimensional noise function that returns every time an updated value.
   * @param changeRate
   * @param offsetX Random if not specified.
   * @param offsetY Random if not specified.
   * @returns New function that runs `noise()` of p5, internally changing the `y` argument by `changeRate`.
   */
  const withChangeRate1 = (
    changeRate,
    offsetX = randomValue(4096),
    offsetY = randomValue(256)
  ) => {
    let y = offsetY;
    return x => p.noise(offsetX + x, (y += changeRate));
  };
  /**
   * Creates a 2-dimensional noise function that returns every time an updated value.
   * @param changeRate
   * @param offsetX Random if not specified.
   * @param offsetY Random if not specified.
   * @param offsetZ Random if not specified.
   * @returns New function that runs `noise()` of p5, internally changing the `z` argument by `changeRate`.
   */
  const withChangeRate2 = (
    changeRate,
    offsetX = randomValue(4096),
    offsetY = randomValue(256),
    offsetZ = randomValue(16)
  ) => {
    let z = offsetZ;
    return (x, y) => p.noise(offsetX + x, offsetY + y, (z += changeRate));
  };
  /**
   * The expected average value of the result of p5 `noise()`.
   * (May not be accurate)
   */
  const AVERAGE = (repetition => {
    let accumulation = 0;
    let n = 1;
    for (let i = 0; i < repetition; i += 1) accumulation += n /= 2;
    return accumulation / 2;
  })(10);

  const noise = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    withOffset: withOffset,
    withOffset2: withOffset2,
    withOffset3: withOffset3,
    withChangeRate: withChangeRate,
    withChangeRate1: withChangeRate1,
    withChangeRate2: withChangeRate2,
    AVERAGE: AVERAGE
  });

  /**
   * @returns The width and height of the window.
   */
  const getWindowSize = () => ({
    width: p.windowWidth,
    height: p.windowHeight
  });

  /** @returns `true` if `a` equals `b`. */
  const compareScalingData = (a, b) => {
    if (a.scaleFactor !== b.scaleFactor) return false;
    const sizeA = a.logicalSize;
    const sizeB = b.logicalSize;
    return sizeA.width === sizeB.width && sizeB.height === sizeB.height;
  };
  const getPhysicalCanvasSize = data => {
    const { scaleFactor, logicalSize } = data;
    return {
      width: scaleFactor * logicalSize.width,
      height: scaleFactor * logicalSize.height
    };
  };
  const getScaledCanvasAttributes = data => {
    const { scaleFactor, logicalSize } = data;
    const drawScaledFunction =
      scaleFactor !== 1
        ? drawCallback => drawScaled(drawCallback, scaleFactor)
        : drawCallback => drawCallback();
    return {
      logicalSize,
      logicalRegion: RectangleRegion.create(Vector2D.zero, logicalSize),
      logicalCenterPosition: {
        x: logicalSize.width / 2,
        y: logicalSize.height / 2
      },
      scaleFactor,
      drawScaled: drawScaledFunction
    };
  };
  const constructCanvas = (getScalingData, renderer) => {
    const scalingData = getScalingData();
    const { width, height } = getPhysicalCanvasSize(scalingData);
    const p5Canvas = p.createCanvas(width, height, renderer);
    const canvas = Object.assign(
      { p5Canvas },
      getScaledCanvasAttributes(scalingData)
    );
    let previousScalingData = scalingData;
    const resizeIfNeeded = noRedraw => {
      const scalingData = getScalingData();
      if (compareScalingData(previousScalingData, scalingData)) return;
      const { width, height } = getPhysicalCanvasSize(scalingData);
      p.resizeCanvas(width, height, noRedraw);
      const data = getScaledCanvasAttributes(scalingData);
      Object.assign(canvas, data);
      previousScalingData = scalingData;
    };
    return Object.assign(canvas, { resizeIfNeeded });
  };
  /**
   * Creates a `ScaledCanvas` instance with the scaled size that fits to the physical container size.
   *
   * @param parameters.logicalSize
   * @param parameters.getPhysicalContainerSize Defaults to a function that gets the window size.
   * @param parameters.fittingOption No scaling if `null`.
   * @param parameters.renderer
   * @returns A `ScaledCanvas` instance.
   */
  const createScaledCanvas = parameters => {
    const {
      logicalSize,
      getPhysicalContainerSize,
      fittingOption,
      renderer
    } = Object.assign(
      {
        getPhysicalContainerSize: getWindowSize
      },
      parameters
    );
    const getScaleFactor =
      fittingOption !== null
        ? () =>
            FitBox.calculateScaleFactor(
              logicalSize,
              getPhysicalContainerSize(),
              fittingOption
            )
        : constantFunction.returnOne;
    const getScalingData = () => ({
      scaleFactor: getScaleFactor(),
      logicalSize
    });
    return constructCanvas(getScalingData, renderer);
  };
  /**
   * Creates a `ScaledCanvas` instance with the scaled height that fits to the physical container size.
   * The width will be determined according to the aspect ratio of the container size.
   *
   * @param parameters.logicalHeight
   * @param parameters.getPhysicalContainerSize Defaults to a function that gets the window size.
   * @param parameters.renderer
   * @param parameters.disableScaling
   * @returns A `ScaledCanvas` instance.
   */
  const createFullScaledCanvas = parameters => {
    const { logicalHeight, getPhysicalContainerSize, renderer } = Object.assign(
      { getPhysicalContainerSize: getWindowSize },
      parameters
    );
    const getScaleFactor = !parameters.disableScaling
      ? () => getPhysicalContainerSize().height / logicalHeight
      : constantFunction.returnOne;
    const getScalingData = () => {
      const scaleFactor = getScaleFactor();
      return {
        scaleFactor,
        logicalSize: {
          width: getPhysicalContainerSize().width / scaleFactor,
          height: logicalHeight
        }
      };
    };
    return constructCanvas(getScalingData, renderer);
  };

  /**
   * Calls `new p5()` with the given settings information.
   * @param settings
   */
  const startSketch = settings => {
    const htmlElement =
      typeof settings.htmlElement === "string"
        ? htmlUtility.getElementOrBody(settings.htmlElement)
        : settings.htmlElement;
    const {
      logicalCanvasWidth,
      logicalCanvasHeight,
      initialize,
      setP5Methods,
      fittingOption,
      renderer
    } = settings;
    new p5(p => {
      setP5Instance(p);
      p.setup = () => {
        const getPhysicalContainerSize = htmlElement
          ? htmlUtility.getElementSize.bind(undefined, htmlElement)
          : undefined;
        const scaledCanvas = logicalCanvasWidth
          ? createScaledCanvas({
              logicalSize: {
                width: logicalCanvasWidth,
                height: logicalCanvasHeight
              },
              getPhysicalContainerSize,
              fittingOption,
              renderer
            })
          : createFullScaledCanvas({
              logicalHeight: logicalCanvasHeight,
              getPhysicalContainerSize,
              renderer
            });
        setCanvas(scaledCanvas);
        index.loopRunWithArgument(onSetup, p);
        onSetup.length = 0;
        initialize();
      };
      setP5Methods(p);
    }, htmlElement);
  };

  const p5ex = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    AlphaColor: alphaColor,
    Camera: camera,
    KeyBoard: keyboard,
    Mouse: index$1$1,
    MoveKeys: moveKeys,
    Noise: noise,
    ShapeColor: shapeColor,
    TrimmedShape2D: index$9,
    applyShake: applyShake,
    arcAtOrigin: arcAtOrigin,
    get canvas() {
      return canvas;
    },
    circleAtOrigin: circleAtOrigin,
    circularArcAtOrigin: circularArcAtOrigin,
    colorToARGB: colorToARGB,
    colorToRGB: colorToRGB,
    colorWithAlpha: colorWithAlpha,
    createFullScaledCanvas: createFullScaledCanvas,
    createScaledCanvas: createScaledCanvas,
    createSetPixel: createSetPixel,
    createSetPixelRow: createSetPixelRow,
    createTexture: createTexture,
    createTextureRowByRow: createTextureRowByRow,
    curveVertexFromVector: curveVertexFromVector,
    drawBezierControlLines: drawBezierControlLines,
    drawBezierCurve: drawBezierCurve,
    drawCurve: drawCurve,
    drawCurveClosed: drawCurveClosed,
    drawRotated: drawRotated,
    drawScaled: drawScaled,
    drawTexture: drawTexture,
    drawTextureRowByRow: drawTextureRowByRow,
    drawTransformed: drawTransformed,
    drawTranslated: drawTranslated,
    drawTranslatedAndRotated: drawTranslatedAndRotated,
    drawTranslatedAndScaled: drawTranslatedAndScaled,
    getWindowSize: getWindowSize,
    graphicsToImage: graphicsToImage,
    hsvColor: hsvColor,
    line: line,
    lineAtOrigin: lineAtOrigin,
    lineWithMargin: lineWithMargin,
    onSetup: onSetup,
    get p() {
      return p;
    },
    parseColor: parseColor,
    parseFill: parseFill,
    parseStroke: parseStroke,
    pause: pause,
    pauseOrResume: pauseOrResume,
    get renderer() {
      return renderer;
    },
    resume: resume,
    reverseColor: reverseColor,
    rotate: rotate,
    rotateScale: rotateScale,
    scale: scale,
    setCanvas: setCanvas,
    setP5Instance: setP5Instance,
    setRenderer: setRenderer,
    setShake: setShake,
    startSketch: startSketch,
    storePixels: storePixels,
    transform: transform,
    translate: translate,
    translateRotate: translateRotate,
    translateScale: translateScale,
    undoRotate: undoRotate,
    undoRotateScale: undoRotateScale,
    undoScale: undoScale,
    undoTransform: undoTransform,
    undoTranslate: undoTranslate,
    undoTranslateRotate: undoTranslateRotate,
    undoTranslateScale: undoTranslateScale
  });

  /**
   * ---- Common ----------------------------------------------------------------
   */
  const {
    Arrays,
    Vector2D: Vector2D$1,
    RectangleRegion: RectangleRegion$1,
    Random,
    Kinematics,
    Bounce
  } = CCC;
  const { onSetup: onSetup$1, ShapeColor, Camera } = p5ex;
  /**
   * Shared p5 instance.
   */
  let p$1;
  onSetup$1.push(p5Instance => {
    p$1 = p5Instance;
  });
  /**
   * Shared canvas instance.
   */
  let canvas$1;
  onSetup$1.push(() => {
    canvas$1 = canvas;
  });
  let area;
  let boundary;
  let camera$1;
  const resetCommon = () => {
    area = RectangleRegion$1.createScaled(canvas$1.logicalRegion, 2, 1);
    boundary = RectangleRegion$1.addMargin(area, -50);
    camera$1 = Camera.create({
      displaySize: canvas$1.logicalSize,
      regionBoundary: RectangleRegion$1.addMargins(area, {
        left: canvas$1.logicalSize.width / 2,
        right: canvas$1.logicalSize.width / 2,
        top: canvas$1.logicalSize.height / 2,
        bottom: canvas$1.logicalSize.height / 2
      })
    });
    camera$1.zoomFactor = 1;
    camera$1.focusPointEasingFactor = 0.015;
  };

  /**
   * ---- Settings --------------------------------------------------------------
   */
  /**
   * The id of the HTML element to which the canvas should belong.
   */
  const HTML_ELEMENT_ID = "Jumber";
  /**
   * The logical height of the canvas.
   */
  const LOGICAL_CANVAS_HEIGHT = 1080;

  const GraphNode = (() => {
    const colorCodes = ["#FFE600", "#A4C520", "#0086AB"];
    let drawFunctions;
    onSetup$1.push(() => {
      drawFunctions = colorCodes.map(colorCode => {
        const g = p$1.createGraphics(120, 120);
        g.noStroke();
        g.fill(colorWithAlpha(colorCode, 64));
        g.circle(64, 64, 100);
        g.fill(colorWithAlpha(colorCode, 160));
        g.circle(60, 60, 100);
        return (x, y) => p$1.image(g, x, y);
      });
    });
    const create = () => {
      const position = Random.pointInRectangleRegion(boundary);
      const velocity = Random.vector(3);
      return Object.assign(
        Object.assign(
          {},
          Kinematics.createQuantity(
            position.x,
            position.y,
            velocity.x,
            velocity.y
          )
        ),
        { draw: Random.Arrays.get(drawFunctions) }
      );
    };
    const update = node => {
      Kinematics.updateEuler(node);
      Bounce.withinRectangle(node, boundary, 1);
    };
    const draw = node => node.draw(node.x, node.y);
    return { create, update, draw };
  })();

  const GraphEdge = (() => {
    const color = ShapeColor.create([0, 32], undefined, 1);
    const markerColor = ShapeColor.create("#BF1E56", undefined, 256);
    const create = (nodeA, nodeB) => ({
      nodeA,
      nodeB,
      markerFactor: 0
    });
    const update = edge => {
      if (edge.markerFactor > 0) edge.markerFactor -= 0.005;
    };
    const draw = edge => {
      const {
        nodeA: { x: ax, y: ay },
        nodeB: { x: bx, y: by }
      } = edge;
      p$1.strokeWeight(2);
      ShapeColor.apply(color, 255);
      p$1.line(ax, ay, bx, by);
      const markerAlpha = 255 * edge.markerFactor;
      if (markerAlpha < 1) return;
      p$1.strokeWeight(2 + 4 * edge.markerFactor);
      ShapeColor.apply(markerColor, markerAlpha);
      p$1.line(ax, ay, bx, by);
    };
    const getOhterNode = (edge, node) =>
      edge.nodeA === node ? edge.nodeB : edge.nodeA;
    const mark = edge => {
      edge.markerFactor = 1;
    };
    return {
      create,
      update,
      draw,
      getOhterNode,
      mark
    };
  })();

  const Graph = (() => {
    let nodes;
    let edges;
    let focusedNode;
    const markerColor = ShapeColor.create("#BF1E56", null, 1);
    const boundaryColor = ShapeColor.create([0, 64], null, 1);
    const getIncidentEdges = node =>
      edges.filter(edge => edge.nodeA === node || edge.nodeB === node);
    const reset = () => {
      nodes = Arrays.createPopulated(GraphNode.create, 48);
      edges = [];
      Arrays.roundRobin(nodes, (a, b) => {
        if (Random.bool(0.8)) return;
        if (getIncidentEdges(a).length >= 3 || getIncidentEdges(b).length >= 3)
          return;
        edges.push(GraphEdge.create(a, b));
      });
      const initialFocusedNode = nodes.find(
        node => getIncidentEdges(node).length > 0
      );
      if (!initialFocusedNode) {
        console.error("Failed to reset.");
        return;
      }
      focusedNode = initialFocusedNode;
      camera$1.targetFocusPoint = focusedNode;
    };
    const update = () => {
      Arrays.loop(nodes, GraphNode.update);
      Arrays.loop(edges, GraphEdge.update);
      Camera.update(camera$1);
    };
    const drawGraph = () => {
      Arrays.loop(edges, GraphEdge.draw);
      Arrays.loop(nodes, GraphNode.draw);
      p$1.strokeWeight(4);
      ShapeColor.apply(markerColor, 255);
      p$1.circle(focusedNode.x, focusedNode.y, 120);
      p$1.strokeWeight(2);
      ShapeColor.apply(boundaryColor, 255);
      p$1.rectMode(p$1.CORNERS);
      p$1.rect(
        area.topLeft.x,
        area.topLeft.y,
        area.bottomRight.x,
        area.bottomRight.y
      );
    };
    const draw = () => {
      Camera.draw(camera$1, drawGraph);
    };
    const changeFocus = () => {
      const nextEdge = Random.Arrays.get(getIncidentEdges(focusedNode));
      const nextNode = GraphEdge.getOhterNode(nextEdge, focusedNode);
      focusedNode = nextNode;
      camera$1.targetFocusPoint = focusedNode;
      GraphEdge.mark(nextEdge);
    };
    return { reset, update, draw, changeFocus };
  })();

  /**
   * ---- Sketch ----------------------------------------------------------------
   */
  let drawBackground;
  const reset$2 = () => {
    p$1.background(252);
    drawBackground = storePixels();
    resetCommon();
    Graph.reset();
  };
  const initialize = () => {
    p$1.imageMode(p$1.CENTER);
    reset$2();
  };
  const updateSketch = () => {
    Graph.update();
    if (p$1.frameCount % 180 === 0) Graph.changeFocus();
  };
  const drawSketch = () => {
    Graph.draw();
  };
  const draw$5 = () => {
    updateSketch();
    drawBackground();
    canvas$1.drawScaled(drawSketch);
  };

  /**
   * ---- Main ------------------------------------------------------------------
   */
  const keyTyped = () => {
    switch (p$1.key) {
      case "p":
        pauseOrResume();
        break;
      case "g":
        p$1.save("image.png");
        break;
    }
  };
  const setP5Methods = p => {
    p.draw = draw$5;
    p.keyTyped = keyTyped;
    p.windowResized = () => {
      canvas$1.resizeIfNeeded();
      reset$2();
    };
  };
  startSketch({
    htmlElement: HTML_ELEMENT_ID,
    logicalCanvasHeight: LOGICAL_CANVAS_HEIGHT,
    initialize: initialize,
    setP5Methods
  });
})(p5);
//# sourceMappingURL=sketch.js.map
