/**
 * Die Welle.
 * Source code in TypeScript: https://github.com/fal-works/p5js-sketches/tree/master/die-welle
 *
 * Bundled libraries:
 *   @fal-works/creative-coding-core (MIT license)
 *   @fal-works/p5-extension (MIT license)
 *
 * @copyright 2019 FAL
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
   * @copyright 2019 FAL
   * @author FAL <contact@fal-works.com>
   * @license MIT
   * @version 0.1.12
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
   * Creates a new 1-dimensional array by concatenating sub-array elements of a 2-dimensional array.
   * @param arrays
   * @return A new 1-dimensional array.
   */
  const flatNaive = arrays => [].concat(...arrays);
  /**
   * An alternative to `Array.prototype.flat()`.
   * @param array
   * @param depth
   * @return A new array.
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
   * @return Filled `array`.
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
   * @return A new populated array.
   */
  const createPopulated = (factory, length) =>
    populate(new Array(length), factory);
  /**
   * Creates a new array of integer numbers starting from `0`.
   * @param length
   * @return A new number array.
   */
  const createIntegerSequence = length => {
    const array = new Array(length);
    for (let i = 0; i < length; i += 1) array[i] = i;
    return array;
  };
  /**
   * Creates a new array of numbers within `range`.
   * @param range
   * @return A new number array.
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
   * @return New array, filtered and mapped.
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
   * Runs each function of `functionArray` with given `argument`.
   * An element of `functionArray` should not be removed during the iteration.
   * @param functionArray
   * @param argument
   */
  const loopRun = (functionArray, argument) => {
    const len = functionArray.length;
    for (let i = 0; i < len; i += 1) functionArray[i](argument, i);
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

  const arrayUtility = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    loopRange: loopRange,
    loop: loop,
    loopRangeBackwards: loopRangeBackwards,
    loopBackwards: loopBackwards,
    nestedLoopJoinWithRange: nestedLoopJoinWithRange,
    nestedLoopJoin: nestedLoopJoin,
    roundRobinWithRange: roundRobinWithRange,
    roundRobin: roundRobin,
    flatNaive: flatNaive,
    flatRecursive: flatRecursive,
    populate: populate,
    createPopulated: createPopulated,
    createIntegerSequence: createIntegerSequence,
    fromRange: fromRange,
    filterMap: filterMap,
    loopRun: loopRun,
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
   * @return A new array-list unit.
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
   * @return The last element of `arrayList`.
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
   * @return The element of `arrayList` at `index`.
   */
  const get = (arrayList, index) => arrayList.array[index];
  /**
   * Returns the last element of `arrayList`.
   * Be sure that `arrayList` is not empty.
   * @param arrayList
   * @return The last element of `arrayList`.
   */
  const peek = arrayList => arrayList.array[arrayList.size - 1];
  /**
   * Returns the last element of `arrayList`.
   * Be sure that `arrayList` is not empty.
   * Same as `peek()`.
   * @param arrayList
   * @return The last element of `arrayList`.
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
   * @return The found `element`. `undefined` if not found.
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
   * @return The index of `element`. `-1` if not found.
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
   * @return The removed element.
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
   * @return The removed element, or `null` if not found.
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
   * @return The removed element.
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
   * @return The removed element, or `null` if not found.
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
   * @return `true` if any element has been removed.
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
   * @return `true` if any element has been removed.
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

  const arrayList = /*#__PURE__*/ Object.freeze({
    __proto__: null,
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

  const create$1 = factory => {
    return {
      value: undefined,
      factory
    };
  };
  const get$1 = object => object.value || (object.value = object.factory());
  const clear$1 = object => {
    object.value = undefined;
  };

  const lazy = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    create: create$1,
    get: get$1,
    clear: clear$1
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
   * @return √x
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
   * @return ∛x
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
   * @return `true` if the absolute difference of `a` and `b` is smaller than `Number.EPSILON`.
   */
  const equal = (a, b) => abs(a - b) < 2.220446049250313e-16;
  /**
   * Similar to `Math.min` but accepts only two arguments.
   * @param a
   * @param b
   * @return The smaller of `a` or `b`.
   */
  const min2 = (a, b) => (a < b ? a : b);
  /**
   * Similar to `Math.max` but accepts only two arguments.
   * @param a
   * @param b
   * @return The larger of `a` or `b`.
   */
  const max2 = (a, b) => (a > b ? a : b);
  /**
   * Safe version of `Math.atan2`;
   * @param y
   * @param x
   * @return The angle from x-axis to the point. `0` if both `x` and `y` are `0`.
   */
  const atan2safe = (y, x) => (y !== 0 || x !== 0 ? atan2(y, x) : 0);
  /**
   * Calculates the sum of squares of `x` and `y`.
   * @param x
   * @param y
   * @return `x^2 + y^2`.
   */
  const hypotenuseSquared2D = (x, y) => x * x + y * y;
  /**
   * A 2D version of `Math.hypot`. Calculates the square root of the sum of squares of `x` and `y`.
   * @param x
   * @param y
   * @return `√(x^2 + y^2)`.
   */
  const hypotenuse2D = (x, y) => sqrt(x * x + y * y);
  /**
   * Linearly interpolates between `start` and `end` by `ratio`.
   * The result will not be clamped.
   * @param start
   * @param end
   * @param ratio
   * @return Interpolated value, e.g. `start` if `ratio == 0`, `end` if `ratio == 1`.
   */
  const lerp = (start, end, ratio) => start + ratio * (end - start);
  /**
   * Clamps `value` between `min` and `max`.
   * @param value
   * @param min
   * @param max
   * @return Clamped value equal or greater than `min` and equal or less than `max`.
   */
  const clamp = (value, min, max) =>
    value < min ? min : value > max ? max : value;
  /**
   * Maps `value` from the range [`inStart`, `inEnd`] to the range [`outStart`, `outEnd`].
   * @param value
   * @param inStart
   * @param inEnd
   * @param outStart
   * @param outEnd
   * @return Mapped value (unclamped).
   */
  const map = (value, inStart, inEnd, outStart, outEnd) =>
    outStart + ((outEnd - outStart) * (value - inStart)) / (inEnd - inStart);
  /**
   * Creates a mapping function that maps `value` from the range [`inStart`, `inEnd`] to the range [`outStart`, `outEnd`].
   * @param inStart
   * @param inEnd
   * @param outStart
   * @param outEnd
   * @return New mapping function.
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
   * @return Mapped value between 0 and 1 (unclamped).
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
   * @return The angle. `0` if `position` is a zero vector.
   */
  const fromOrigin = position => {
    const { x, y } = position;
    return x !== 0 || y !== 0 ? atan2(position.y, position.x) : 0;
  };
  /**
   * Calculates the angle in radians between two points.
   * @param from
   * @param to
   * @return The angle. `0` if both points are the same.
   */
  const betweenPoints = (from, to) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    return dx !== 0 || dy !== 0 ? atan2(dy, dx) : 0;
  };
  /**
   * Calculates the angle in radians between two points.
   * @return The angle. `0` if both points are the same.
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

  const create$2 = (topLeftPosition, size) => {
    return {
      topLeft: topLeftPosition,
      rightBottom: {
        x: topLeftPosition.x + size.width,
        y: topLeftPosition.y + size.height
      }
    };
  };
  /**
   * Checks if `region` contains `point`.
   * @param region
   * @param point
   * @param margin
   * @return `true` if contained.
   */
  const containsPoint = (region, point, margin) => {
    const { topLeft, rightBottom } = region;
    const { x, y } = point;
    return (
      x >= topLeft.x + margin &&
      y >= topLeft.y + margin &&
      x < rightBottom.x - margin &&
      y < rightBottom.y - margin
    );
  };
  const getWidth = region => region.rightBottom.x - region.topLeft.x;
  const getHeight = region => region.rightBottom.y - region.topLeft.y;
  const getSize = region => {
    const { topLeft, rightBottom } = region;
    return {
      width: rightBottom.x - topLeft.x,
      height: rightBottom.y - topLeft.y
    };
  };
  const getCenterPoint = region => {
    const { topLeft, rightBottom } = region;
    return {
      x: (topLeft.x + rightBottom.x) / 2,
      y: (topLeft.y + rightBottom.y) / 2
    };
  };
  /**
   * Creates a new `RectangleRegion` by scaling `region` with `scaleFactor`.
   * @param region
   * @param scaleFactor
   * @param originType
   * @return A new scaled `RectangleRegion` unit.
   */
  const createScaled = (region, scaleFactor, originType) => {
    const { topLeft, rightBottom } = region;
    switch (originType) {
      case 0:
        return {
          topLeft,
          rightBottom: {
            x: lerp(topLeft.x, rightBottom.x, scaleFactor),
            y: lerp(topLeft.y, rightBottom.y, scaleFactor)
          }
        };
      case 1: {
        const center = getCenterPoint(region);
        const size = getSize(region);
        const halfWidth = size.width / 2;
        const halfHeight = size.height / 2;
        return {
          topLeft: {
            x: center.x - halfWidth,
            y: center.y - halfHeight
          },
          rightBottom: {
            x: center.x + halfWidth,
            y: center.y + halfHeight
          }
        };
      }
    }
  };

  const rectangleRegion = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    create: create$2,
    containsPoint: containsPoint,
    getWidth: getWidth,
    getHeight: getHeight,
    getSize: getSize,
    getCenterPoint: getCenterPoint,
    createScaled: createScaled
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

  const rectangleSize = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    getAspectRatio: getAspectRatio,
    getArea: getArea
  });

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
   * @return `true` if zero.
   */
  const isZero = v => v.x === 0 && v.y === 0;
  /**
   * Creates a new vector from polar coordinates `angle` and `length`.
   * @param length
   * @param angle
   * @return new `Vector2D`.
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
   * @return new `Vector2D`.
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
   * @return new `Vector2D`.
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
   * @return new `Vector2D`.
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
   * @return new `Vector2D`.
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
   * @return new `Vector2D`.
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
   * @return new `Vector2D`.
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
   * @return new `Vector2D`.
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
   * @return new `Vector2D`.
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
   * @return Square of distance.
   */
  const distanceSquared = (vectorA, vectorB) =>
    hypotenuseSquared2D(vectorB.x - vectorA.x, vectorB.y - vectorA.y);
  /**
   * Calculates distance between `vectorA` and `vectorB`.
   * @param vectorA
   * @param vectorB
   * @return Distance.
   */
  const distance = (vectorA, vectorB) =>
    hypotenuse2D(vectorB.x - vectorA.x, vectorB.y - vectorA.y);
  /**
   * Returns string e.g. `{x:0,y:0}`
   * @param vector
   * @return String expression.
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
   * @return The squared length.
   */
  const lengthSquared = vector => hypotenuseSquared2D(vector.x, vector.y);
  /**
   * Calculates length of `vector`.
   * @param vector
   * @return The length.
   */
  const length = vector => hypotenuse2D(vector.x, vector.y);
  /**
   * Calculates angle of `vector` in radians.
   * @param vector
   * @return The angle. `0` if `vector` is a zero vector.
   */
  const angle$1 = vector => {
    const { x, y } = vector;
    return x !== 0 || y !== 0 ? atan2(vector.y, vector.x) : 0;
  };

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
    vector.x /= divisor;
    vector.y /= divisor;
    return vector;
  };

  const mutable = /*#__PURE__*/ Object.freeze({
    __proto__: null,
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
    divide: divide$1
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
    target.x = source.x / divisor;
    target.y = source.y / divisor;
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
    divide: divide$2
  });

  const index = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Mutable: mutable,
    Assign: assign,
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
    angle: angle$1
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
   * Creates an easing function that takes `start`, `end` and `ratio` as arguments.
   * @param easingFunction
   */
  const bind = easingFunction => (start, end, ratio) =>
    start + easingFunction(ratio) * (end - start);
  /**
   * Concatenates two easing functions without normalization.
   * @param easingFunctionA
   * @param easingFunctionB
   * @param thresholdRatio
   * @return New easing function.
   */
  const concatenate = (
    easingFunctionA,
    easingFunctionB,
    thresholdRatio = 0.5
  ) => {
    return ratio => {
      if (ratio < thresholdRatio)
        return easingFunctionA(ratio / thresholdRatio);
      else {
        const ratioB = 1 - thresholdRatio;
        return easingFunctionB((ratio - thresholdRatio) / ratioB);
      }
    };
  };
  /**
   * Integrates two easing functions.
   * Results of both functions will be normalized depending on `thresholdRatio`.
   * @param easingFunctionA
   * @param easingFunctionB
   * @param thresholdRatio
   * @return New easing function.
   */
  const integrate = (
    easingFunctionA,
    easingFunctionB,
    thresholdRatio = 0.5
  ) => {
    return ratio => {
      if (ratio < thresholdRatio)
        return thresholdRatio * easingFunctionA(ratio / thresholdRatio);
      else {
        const ratioB = 1 - thresholdRatio;
        return (
          thresholdRatio +
          ratioB * easingFunctionB((ratio - thresholdRatio) / ratioB)
        );
      }
    };
  };
  /**
   * Linear easing function.
   * @param ratio
   */
  const easeLinear = ratio => ratio;
  /**
   * easeInQuad.
   * @param ratio
   */
  const easeInQuad = square;
  /**
   * easeOutQuad.
   * @param ratio
   */
  const easeOutQuad = ratio => -square(ratio - 1) + 1;
  /**
   * easeInCubic.
   * @param ratio
   */
  const easeInCubic = cube;
  /**
   * easeOutCubic.
   * @param ratio
   */
  const easeOutCubic = ratio => cube(ratio - 1) + 1;
  /**
   * easeInQuart.
   * @param ratio
   */
  const easeInQuart = pow4;
  /**
   * easeOutQuart.
   * @param ratio
   */
  const easeOutQuart = ratio => -pow4(ratio - 1) + 1;
  /**
   * Creates an easeOutBack function.
   * @param ratio
   */
  const createEaseOutBack = (coefficient = 1.70158) => ratio => {
    const r = ratio - 1;
    return (coefficient + 1) * cube(r) + coefficient * square(r) + 1;
  };
  const easeInOutQuad = integrate(easeInQuad, easeOutQuad);
  const easeOutInQuad = integrate(easeOutQuad, easeInQuad);
  const easeInOutCubic = integrate(easeInCubic, easeOutCubic);
  const easeOutInCubic = integrate(easeOutCubic, easeInCubic);
  const easeInOutQuart = integrate(easeInQuart, easeOutQuart);
  const easeOutInQuart = integrate(easeOutQuart, easeInQuart);

  const easing = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    bind: bind,
    concatenate: concatenate,
    integrate: integrate,
    easeLinear: easeLinear,
    easeInQuad: easeInQuad,
    easeOutQuad: easeOutQuad,
    easeInCubic: easeInCubic,
    easeOutCubic: easeOutCubic,
    easeInQuart: easeInQuart,
    easeOutQuart: easeOutQuart,
    createEaseOutBack: createEaseOutBack,
    easeInOutQuad: easeInOutQuad,
    easeOutInQuad: easeOutInQuad,
    easeInOutCubic: easeInOutCubic,
    easeOutInCubic: easeOutInCubic,
    easeInOutQuart: easeInOutQuart,
    easeOutInQuart: easeOutInQuart
  });

  const { random } = Math;
  /**
   * Returns random value from `0` up to (but not including) `1`. Same as `Math.random()`.
   * @return A random value.
   */
  const ratio = random;
  /**
   * Returns random value from `0` up to (but not including) `max`.
   * @param max
   * @return A random value.
   */
  const value = max => random() * max;
  /**
   * Returns random value from `0` to (but not including) `2 * PI`.
   * @return A random radians value.
   */
  const angle$2 = () => random() * TWO_PI;
  /**
   * Returns random value from `start` up to (but not including) `end`.
   * @param start
   * @param end
   * @return A random value.
   */
  const between = (start, end) => start + random() * (end - start);
  /**
   * Returns random value from `range.start` up to (but not including) `range.end`.
   * @param range
   * @return A random value.
   */
  const inRange = range => between(range.start, range.end);
  /**
   * Returns random integer from 0 up to (but not including) `maxInt`.
   * `maxInt` is not expected to be negative.
   * @param maxInt
   * @return A random integer value.
   */
  const integer = maxInt => floor(random() * maxInt);
  /**
   * Returns random integer from `minInt` up to (but not including) `maxInt`.
   * The case where `minInt > maxInt` or `maxInt <= 0` is not expected.
   * @param minInt
   * @param maxInt
   * @return A random integer value.
   */
  const integerBetween = (minInt, maxInt) =>
    minInt + floor(random() * (maxInt - minInt));
  /**
   * Returns `n` or `-n` randomly.
   * @param n Any number.
   * @return A random-signed value of `n`.
   */
  const signed = n => (random() < 0.5 ? n : -n);
  /**
   * Returns one element of `array` randomly.
   * `array` is not expected to be empty.
   * @param array
   * @return A random element.
   */
  const fromArray$1 = array => array[integer(array.length)];
  /**
   * Removes and returns one element from `array` randomly.
   * `array` is not expected to be empty.
   * @param array
   * @return A random element.
   */
  const removeFromArray = array => array.splice(integer(array.length), 1)[0];
  /**
   * Returns `true` or `false` randomly.
   * @param probability A number between 0 and 1.
   * @return `true` with the given `probability`.
   */
  const bool = probability => random() < probability;
  /**
   * Returns random value from `-absoluteValue` up to (but not including) `absoluteValue`.
   * @param absoluteValue
   * @return A random value.
   */
  const fromAbsolute = absoluteValue =>
    -absoluteValue + random() * 2 * absoluteValue;
  /**
   * Returns a new vector with `length` and random angle.
   * @param length
   * @return New `Vector2D` unit.
   */
  const vector = length => fromPolar(length, angle$2());
  /**
   * Returns a random point in `region`.
   * @param region
   * @return Random `Vector2D`.
   */
  const pointInRectangleRegion = region => {
    const { topLeft, rightBottom } = region;
    return {
      x: between(topLeft.x, rightBottom.x),
      y: between(topLeft.y, rightBottom.y)
    };
  };
  /**
   * Similar to `ratio()`, but remaps the result by `curve`.
   * @param curve Function that takes a random value between [0, 1] and returns a remapped value.
   * @return A random value.
   */
  const ratioCurved = curve => curve(random());
  /**
   * Similar to `value()`, but remaps the result by `curve`.
   * @param curve Function that takes a random value between [0, 1] and returns a remapped value.
   * @param magnitude
   * @return A random value.
   */
  const valueCurved = (curve, magnitude) => curve(random()) * magnitude;
  /**
   * Similar to `between()`, but remaps the result by `curve`.
   * @param curve Function that takes a random value between [0, 1] and returns a remapped value.
   * @param start
   * @param end
   * @return A random value.
   */
  const betweenCurved = (curve, start, end) =>
    start + curve(random()) * (end - start);
  /**
   * Similar to `inRange()`, but remaps the result by `curve`.
   * @param curve Function that takes a random value between [0, 1] and returns a remapped value.
   * @param range
   * @return A random value.
   */
  const inRangeCurved = (curve, range) =>
    betweenCurved(curve, range.start, range.end);

  const random$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    ratio: ratio,
    value: value,
    angle: angle$2,
    between: between,
    inRange: inRange,
    integer: integer,
    integerBetween: integerBetween,
    signed: signed,
    fromArray: fromArray$1,
    removeFromArray: removeFromArray,
    bool: bool,
    fromAbsolute: fromAbsolute,
    vector: vector,
    pointInRectangleRegion: pointInRectangleRegion,
    ratioCurved: ratioCurved,
    valueCurved: valueCurved,
    betweenCurved: betweenCurved,
    inRangeCurved: inRangeCurved
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

  const createProgress = duration => {
    return {
      duration,
      ratioChangeRate: 1 / duration,
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
  const createListnerArray = listeners =>
    listeners
      ? Array.isArray(listeners)
        ? listeners.slice()
        : [listeners]
      : [];
  class Unit {
    constructor(onProgress, onComplete, progress, isCompleted) {
      this.onProgress = onProgress;
      this.onComplete = onComplete;
      this.progress = progress;
      this.isCompleted = isCompleted;
    }
    static create(onProgress, onComplete, progress, isCompleted = false) {
      return new Unit(onProgress, onComplete, progress, isCompleted);
    }
    step() {
      if (this.isCompleted) return true;
      const { progress } = this;
      if (progress.count >= progress.duration) return this.complete(progress);
      return this.update(progress);
    }
    reset() {
      resetProgress(this.progress);
      this.isCompleted = false;
      return this;
    }
    update(progress) {
      loopRun(this.onProgress, progress);
      updateProgress(progress);
      return false;
    }
    complete(progress) {
      progress.ratio = 1;
      loopRun(this.onProgress, progress);
      loopRun(this.onComplete, progress);
      return (this.isCompleted = true);
    }
  }
  /**
   * Creates a `Timer` instance.
   * @param parameters
   * @return New `Timer` instance.
   */
  const create$3 = parameters => {
    return Unit.create(
      createListnerArray(parameters.onProgress),
      createListnerArray(parameters.onComplete),
      createProgress(parameters.duration)
    );
  };
  const dummy = Unit.create([], [], createProgress(0), true);

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

  const component = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    step: step,
    reset: reset
  });

  const setIndex = (chain, index) => {
    chain.index = index;
    chain.currentComponent = chain.components[index];
  };
  /**
   * Increments component index. Set `chain` completed if there is no next component.
   * @param chain
   * @return `true` if completed i.e. there is no next component.
   */
  const setNextIndex = chain => {
    const nextIndex = chain.index + 1;
    if (nextIndex < chain.components.length) {
      setIndex(chain, nextIndex);
      return false;
    }
    chain.isCompleted = true;
    return true;
  };
  class Unit$1 {
    constructor(components) {
      this.components = components.slice();
      this.index = 0;
      this.currentComponent = components[0];
      this.isCompleted = false;
    }
    static create(components) {
      return new Unit$1(components);
    }
    step() {
      if (!this.currentComponent.step()) return false;
      return setNextIndex(this);
    }
    reset() {
      loop(this.components, reset);
      setIndex(this, 0);
      this.isCompleted = false;
      return this;
    }
  }
  /**
   * Creates a sequential composite from `components`.
   * @param components
   * @return New `Timer.Chain` instance.
   */
  const create$4 = components => Unit$1.create(components);

  const chain = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Unit: Unit$1,
    create: create$4
  });

  class Unit$2 {
    constructor(components) {
      this.components = components.slice();
      this.runningComponentList = fromArray(components.slice());
      this.isCompleted = false;
    }
    static create(components) {
      return new Unit$2(components);
    }
    step() {
      removeShiftAll(this.runningComponentList, step);
      if (this.runningComponentList.size > 0) return false;
      return (this.isCompleted = true);
    }
    reset() {
      const { runningComponentList } = this;
      clear(runningComponentList);
      addArray(runningComponentList, this.components);
      loop$1(runningComponentList, reset);
      this.isCompleted = false;
      return this;
    }
  }
  /**
   * Creates a parallel composite from `components`.
   * @param components
   * @return New `Timer.Parallel` instance.
   */
  const create$5 = components => Unit$2.create(components);

  const parallel = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Unit: Unit$2,
    create: create$5
  });

  class Unit$3 {
    constructor(component, loopCount) {
      this.component = component;
      this.loopCount = loopCount;
      this.remainingCount = loopCount;
      this.isCompleted = loopCount <= 0;
    }
    static create(component, loopCount) {
      return new Unit$3(component, loopCount);
    }
    step() {
      if (!this.component.step()) return false;
      if (this.isCompleted) return true;
      if ((this.remainingCount -= 1) > 0) {
        this.component.reset();
        return false;
      }
      return (this.isCompleted = true);
    }
    reset() {
      const { loopCount } = this;
      this.remainingCount = loopCount;
      if (loopCount > 0) {
        this.component.reset();
        this.isCompleted = false;
      } else {
        this.isCompleted = true;
      }
      return this;
    }
  }
  /**
   * Creates a looped component from `component`.
   * @param component
   * @param loopCount `Infinity` if not specified.
   * @return New `Timer.Loop` instance.
   */
  const create$6 = (component, loopCount = Infinity) =>
    Unit$3.create(component, loopCount);

  const loop$2 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Unit: Unit$3,
    create: create$6
  });

  const create$7 = capacity => {
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
  const clear$2 = timerSet => {
    clear(timerSet.runningComponents);
    clear(timerSet.newComponentsBuffer);
  };
  /**
   * Creates a timer set instance and returns a set of bound functions.
   * @param capacity
   */
  const construct = capacity => {
    const timerSet = create$7(capacity);
    return {
      add: add$4.bind(undefined, timerSet),
      step: step$1.bind(undefined, timerSet),
      clear: clear$2.bind(undefined, timerSet)
    };
  };

  const set$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    create: create$7,
    add: add$4,
    step: step$1,
    clear: clear$2,
    construct: construct
  });

  const index$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Component: component,
    Chain: chain,
    Parallel: parallel,
    Loop: loop$2,
    Set: set$1,
    chain: create$4,
    parallel: create$5,
    loop: create$6,
    Unit: Unit,
    create: create$3,
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
  class Unit$4 {
    constructor(isOn, length, codeString) {
      this.isOn = isOn;
      this.length = length;
      this.codeString = codeString;
      let s = "";
      const binaryCharacter = isOn ? "1" : "0";
      for (let i = 0; i < length; i += 1) {
        s += binaryCharacter;
      }
      this.binaryString = s;
    }
  }
  class On extends Unit$4 {
    constructor(length, codeString) {
      super(true, length, codeString);
    }
  }
  class Off extends Unit$4 {
    constructor(length, codeString) {
      super(false, length, codeString);
    }
  }
  const DIT = new On(1, ".");
  const DAH = new On(3, "-");
  const INTER_ELEMENT_GAP = new Off(1, "");
  const SHORT_GAP = new Off(3, " ");
  const MEDIUM_GAP = new Off(7, " / ");
  const NUL = new Off(0, "");
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
    Unit: Unit$4,
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
  const create$8 = (on, off, wpm = 25, signals = [], loop = false) => {
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
    create: create$8,
    stop: stop,
    start: start
  });

  const index$2 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Signal: signal,
    Channel: channel
  });

  const returnVoid = () => {};
  const returnUndefined = () => undefined;
  const returnNull = () => null;
  const returnZero = () => 0;
  const returnOne = () => 1;

  const constantFunction = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    returnVoid: returnVoid,
    returnUndefined: returnUndefined,
    returnNull: returnNull,
    returnZero: returnZero,
    returnOne: returnOne
  });

  /**
   * Creates a `Timer` instance for tweening value using `setValue()`.
   * @param parameters `start`, `end`, `duration` and `easing`(linear by default).
   * @return New `Timer` instance.
   */
  const create$9 = (setValue, parameters) => {
    const { start, end, duration } = parameters;
    const ease = parameters.easing || easeLinear;
    return create$3({
      duration,
      onProgress: progress => setValue(lerp(start, end, ease(progress.ratio)))
    });
  };

  /**
   * Creates a `Timer` instance for tweening `vector`.
   * @param parameters `target`, `duration` and `easing`(linear by default).
   * @return New `Timer` instance.
   */
  const create$a = (vector, parameters) => {
    const { duration } = parameters;
    const { x: startX, y: startY } = vector;
    const { x: endX, y: endY } = parameters.target;
    const ease = parameters.easing || easeLinear;
    return create$3({
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

  const vector2d = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    create: create$a
  });

  const index$3 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Vector2D: vector2d,
    create: create$9
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
   * @return `target` vector with assigned position.
   */
  const positionVector = (quantity, target) =>
    setCartesian$1(quantity.x, quantity.y, target);
  /**
   * Extracts velocity values to `target` vector.
   * @param quantity
   * @param target
   * @return `target` vector with assigned velocity.
   */
  const velocityVector = (quantity, target) =>
    setCartesian$1(quantity.vx, quantity.vy, target);
  /**
   * Returns the speed.
   * @param quantity
   * @return The speed.
   */
  const getSpeed = quantity => hypotenuse2D(quantity.vx, quantity.vy);
  /**
   * Returns the velocity angle.
   * @param quantity
   * @return The angle.
   */
  const getVelocityAngle = quantity => atan2safe(quantity.vy, quantity.vx);
  /**
   * Truncates the speed (magnitude of velocity) if it is greater than `maxSpeed`.
   * @param quantity
   * @param maxSpeed
   * @return The `quantity` instance with truncated velocity values.
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
   * @return The `quantity` instance with assigned velocity.
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
   * @return The `quantity` instance with assigned velocity.
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
   * @return The `quantity` instance with assigned velocity.
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
   * @return `true` if bounced.
   */
  const bounceInRectangleRegion = (
    region,
    coefficientOfRestitution,
    quantity
  ) => {
    const { x, y, vx, vy } = quantity;
    const { x: leftX, y: topY } = region.topLeft;
    const { x: rightX, y: bottomY } = region.rightBottom;
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
    quantity.fx = 0;
    quantity.fy = 0;
  };
  /**
   * Extracts force values to `target` vector.
   * @param quantity
   * @param target
   * @return `target` vector with assigned acceleration.
   */
  const forceVector = (quantity, target) =>
    setCartesian$1(quantity.fx, quantity.fy, target);
  /**
   * Truncates the magnitude of force if it is greater than `maxMagnitude`.
   * @param quantity
   * @param maxSpeed
   * @return The `quantity` instance with truncated force values.
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
   * @return The `quantity` instance with assigned force.
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
   * @return The `quantity` instance with assigned force.
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
   * @return The `quantity` instance with assigned force.
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
    quantity.fx = 0;
    quantity.fy = 0;
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
   * @return The `target` vector with assigned gravitation force.
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
   * @return The `target` vector with assigned gravitation force.
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
   * @return The `target` vector with assigned gravitation force.
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
   * @return The `target` vector with assigned gravitation force.
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
   * @return New `Rotation.Quantity`.
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
   * Creates an array of HSV values with random hue ∈ [0, 360].
   * @param saturation
   * @param value
   * @return New array of HSV values.
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
   * @return New array of RGB values.
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
    Angle: angle,
    ArrayList: arrayList,
    ArrayUtility: arrayUtility,
    Bezier: bezier,
    ConstantFunction: constantFunction,
    Dynamics: dynamics,
    Easing: easing,
    FitBox: fitBox,
    Gravitation: gravitation,
    HSV: hsv,
    HtmlUtility: htmlUtility,
    Kinematics: kinematics,
    Lazy: lazy,
    MathConstants: constants,
    MorseCode: index$2,
    Numeric: numeric,
    Random: random$1,
    RectangleRegion: rectangleRegion,
    RectangleSize: rectangleSize,
    Rotation: rotation,
    SimpleDynamics: simpleDynamics,
    StructureOfArrays: structureOfArrays,
    Timer: index$1,
    Tween: index$3,
    Vector2D: index
  });

  /**
   * p5-extension
   *
   * An extension for p5.js.
   * GitHub repository: {@link https://github.com/fal-works/p5-extension}
   *
   * @module p5-extension
   * @copyright 2019 FAL
   * @author FAL <contact@fal-works.com>
   * @license MIT
   * @version 0.1.12
   */

  const {
    HtmlUtility,
    RectangleRegion,
    FitBox,
    ArrayUtility,
    ArrayList,
    Vector2D,
    Numeric,
    MathConstants,
    Random,
    Angle,
    HSV,
    ConstantFunction
  } = CCC;
  const { sin: sin$1, cos: cos$1 } = Numeric;
  const { round: round$1 } = Numeric;
  const {
    ONE_OVER_SQUARE_ROOT_TWO: ONE_OVER_SQUARE_ROOT_TWO$1,
    INVERSE255: INVERSE255$1
  } = MathConstants;
  const { TWO_PI: TWO_PI$1 } = Angle;
  const { returnVoid: returnVoid$1 } = ConstantFunction;

  /**
   * The shared `p5` instance.
   */
  let p;
  /**
   * The shared `ScaledCanvas` instance.
   */
  let canvas;
  /**
   * Sets the given `p5` instance to be shared.
   * @param instance
   */
  const setP5Instance = instance => {
    p = instance;
  };
  /**
   * Sets the given `ScaledCanvas` instance to be shared.
   * @param scaledCanvas
   */
  const setCanvas = scaledCanvas => {
    canvas = scaledCanvas;
  };

  /**
   * Creates a new `p5.Color` instance from another `p5.Color` or a color code string.
   * @param color
   */
  const parseColor = color =>
    typeof color === "string" ? p.color(color) : Object.create(color);
  /**
   * Creates a function that applies a stroke color.
   * @param color `null` will be `noStroke()` and `undefined` will have no effects.
   * @return A function that runs either `stroke()`, `noStroke()` or nothing.
   */
  const parseStroke = color => {
    if (color === null) return p.noStroke.bind(p);
    if (color === undefined) return returnVoid$1;
    const colorObject = parseColor(color);
    return p.stroke.bind(p, colorObject);
  };
  /**
   * Creates a function that applies a fill color.
   * @param color `null` will be `noFill()` and `undefined` will have no effects.
   * @return A function that runs either `fill()`, `noFill()` or nothing.
   */
  const parseFill = color => {
    if (color === null) return p.noFill.bind(p);
    if (color === undefined) return returnVoid$1;
    const colorObject = parseColor(color);
    return p.fill.bind(p, colorObject);
  };
  /**
   * Creates a new `p5.Color` instance by replacing the alpha value with `alpha`.
   * The color mode should be `RGB` when using this function.
   * @param color
   * @param alpha
   */
  const colorWithAlpha = (color, alpha) => {
    const colorObject = typeof color === "string" ? p.color(color) : color;
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
   * @return New `p5.Color` instance with reversed RGB values.
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
   * @return New `p5.Color` instance.
   */
  const hsvColor = (hue, saturation, value, alpha = 255) => {
    const [r, g, b] = HSV.toRGB([hue, saturation, value]);
    return p.color(r * 255, g * 255, b * 255, alpha);
  };

  /**
   * Creats an `AlphaColor` unit.
   * The max alpha of `stroke()` and `fill()` should be set to `255` when using this function.
   * @param color
   * @param resolution
   */
  const create$b = (color, resolution) => {
    const colors = new Array(resolution);
    const maxIndex = resolution - 1;
    if (resolution === 1) {
      colors[0] =
        typeof color === "string" ? p.color(color) : Object.assign({}, color);
    } else {
      const baseAlpha = p.alpha(color);
      for (let i = 1; i < resolution; i += 1) {
        const alpha = baseAlpha * (i / maxIndex);
        colors[i] = colorWithAlpha(color, alpha);
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
   * @return A `p5.Color` instance.
   */
  const get$2 = (alphaColor, alpha) =>
    alphaColor.colors[round$1(alphaColor.maxIndex * alpha * INVERSE255$1)];

  const alphaColor = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    create: create$b,
    get: get$2
  });

  /**
   * Creates a `ShapeColor` unit.
   * The max alpha of `stroke()` and `fill()` should be set to `255` when using this function.
   * @param strokeColor `null` will be `noStroke()` and `undefined` will have no effects.
   * @param fillColor `null` will be `noFill()` and `undefined` will have no effects.
   * @param alphaResolution
   */
  const create$1$1 = (strokeColor, fillColor, alphaResolution) => {
    if (alphaResolution === 1) {
      return {
        stroke: parseStroke(strokeColor),
        fill: parseFill(fillColor)
      };
    }
    let stroke;
    if (strokeColor === null) {
      stroke = () => p.noStroke();
    } else if (strokeColor === undefined) {
      stroke = returnVoid$1;
    } else {
      const strokeAlphaColor = create$b(strokeColor, alphaResolution);
      stroke = alpha => p.stroke(get$2(strokeAlphaColor, alpha));
    }
    let fill;
    if (fillColor === null) {
      fill = () => p.noFill();
    } else if (fillColor === undefined) {
      fill = returnVoid$1;
    } else {
      const fillAlphaColor = create$b(fillColor, alphaResolution);
      fill = alpha => p.fill(get$2(fillAlphaColor, alpha));
    }
    return { stroke, fill };
  };
  /**
   * Applies the stroke and fill colors.
   * @param shapeColor
   * @param alpha Alpha value from `0` to `255`.
   */
  const apply = (shapeColor, alpha) => {
    if (alpha < 1) {
      p.noStroke();
      p.noFill();
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
   * Runs `drawCallback` and `p.loadPixels()`, then returns `p.pixels`.
   * The style and transformations will be restored by using `p.push()` and `p.pop()`.
   * @param p The p5 instance.
   * @param drawCallback
   * @return Pixels of the canvas after applying `drawCallback`.
   */
  const createPixels = drawCallback => {
    p.push();
    drawCallback();
    p.pop();
    p.loadPixels();
    return p.pixels;
  };
  /**
   * Replaces the whole pixels of the canvas.
   * Assigns the given pixels to `p.pixels` and calls `p.updatePixels()`.
   * @param pixels
   */
  const replaceCanvasPixels = pixels => {
    p.pixels = pixels;
    p.updatePixels();
  };

  /**
   * Runs `drawCallback` translated with `offsetX` and `offsetY`,
   * then restores the transformation by calling `p.translate()` with negative values.
   * Used to avoid calling `p.push()` and `p.pop()` frequently.
   *
   * @param drawCallback
   * @param offsetX
   * @param offsetY
   */
  const drawTranslated = (drawCallback, offsetX, offsetY) => {
    p.translate(offsetX, offsetY);
    drawCallback();
    p.translate(-offsetX, -offsetY);
  };
  /**
   * Runs `drawCallback` rotated with `angle`,
   * then restores the transformation by calling `p.rotate()` with the negative value.
   * Used to avoid calling `p.push()` and `p.pop()` frequently.
   *
   * @param drawCallback
   * @param angle
   */
  const drawRotated = (drawCallback, angle) => {
    p.rotate(angle);
    drawCallback();
    p.rotate(-angle);
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
    p.translate(offsetX, offsetY);
    drawRotated(drawCallback, angle);
    p.translate(-offsetX, -offsetY);
  };
  /**
   * Runs `drawCallback` scaled with `scaleFactor`,
   * then restores the transformation by scaling with the inversed factor.
   * Used to avoid calling `p.push()` and `p.pop()` frequently.
   *
   * @param drawCallback
   * @param scaleFactor
   */
  const drawScaled = (drawCallback, scaleFactor) => {
    p.scale(scaleFactor);
    drawCallback();
    p.scale(1 / scaleFactor);
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
    p.translate(offsetX, offsetY);
    p.rotate(angle);
    p.scale(scaleFactor);
    drawCallback();
    p.scale(1 / scaleFactor);
    p.rotate(-angle);
    p.translate(-offsetX, -offsetY);
  };
  let lastTranslateX = 0;
  let lastTranslateY = 0;
  let lastRotateAngle = 0;
  let lastScaleFactor = 1;
  /**
   * Runs `translate()`. The given arguments will be saved.
   * @param x
   * @param y
   */
  const translate = (x, y) => {
    lastTranslateX = x;
    lastTranslateY = y;
    p.translate(x, y);
  };
  /**
   * Applies the inverse of the last transformation by `translate()`.
   */
  const undoTranslate = () => {
    p.translate(-lastTranslateX, -lastTranslateY);
  };
  /**
   * Runs `rotate()`. The given argument will be saved.
   * @param angle
   */
  const rotate = angle => {
    lastRotateAngle = angle;
    p.rotate(angle);
  };
  /**
   * Applies the inverse of the last transformation by `rotate()`.
   */
  const undoRotate = () => {
    p.rotate(-lastRotateAngle);
  };
  /**
   * Runs `scale()`. The given argument will be saved.
   * @param scaleFactor
   */
  const scale = scaleFactor => {
    lastScaleFactor = scaleFactor;
    p.scale(scaleFactor);
  };
  /**
   * Applies the inverse of the last transformation by `scale()`.
   */
  const undoScale = () => {
    p.scale(1 / lastScaleFactor);
  };
  /**
   * Runs `translate()` and `rotate()`. The given arguments will be saved.
   * @param x
   * @param y
   * @param angle
   */
  const translateRotate = (x, y, angle) => {
    lastTranslateX = x;
    lastTranslateY = y;
    lastRotateAngle = angle;
    p.translate(x, y);
    p.rotate(angle);
  };
  /**
   * Applies the inverse of the last transformation by `translateRotate()`.
   */
  const undoTranslateRotate = () => {
    p.rotate(-lastRotateAngle);
    p.translate(-lastTranslateX, -lastTranslateY);
  };
  /**
   * Runs `translate()` and `scale()`. The given arguments will be saved.
   * @param x
   * @param y
   * @param scaleFactor
   */
  const translateScale = (x, y, scaleFactor) => {
    lastTranslateX = x;
    lastTranslateY = y;
    lastScaleFactor = scaleFactor;
    p.translate(x, y);
    p.scale(scaleFactor);
  };
  /**
   * Applies the inverse of the last transformation by `translateScale()`.
   */
  const undoTranslateScale = () => {
    p.scale(1 / lastScaleFactor);
    p.translate(-lastTranslateX, -lastTranslateY);
  };
  /**
   * Runs `rotate()` and `scale()`. The given arguments will be saved.
   * @param angle
   * @param scaleFactor
   */
  const rotateScale = (angle, scaleFactor) => {
    lastRotateAngle = angle;
    lastScaleFactor = scaleFactor;
    p.rotate(angle);
    p.scale(scaleFactor);
  };
  /**
   * Applies the inverse of the last transformation by `rotateScale()`.
   */
  const undoRotateScale = () => {
    p.scale(1 / lastScaleFactor);
    p.rotate(-lastRotateAngle);
  };
  /**
   * Runs `translate()`, `rotate()` and `scale()`. The given arguments will be saved.
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
    p.translate(x, y);
    p.rotate(angle);
    p.scale(scaleFactor);
  };
  /**
   * Applies the inverse of the last transformation by `transform()`.
   */
  const undoTransform = () => {
    p.scale(1 / lastScaleFactor);
    p.rotate(-lastRotateAngle);
    p.translate(-lastTranslateX, -lastTranslateY);
  };

  const drawPath = path => {
    const { controlPoint1, controlPoint2, targetPoint } = path;
    p.bezierVertex(
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
    p.vertex(startPoint.x, startPoint.y);
    ArrayUtility.loop(paths, drawPath);
  };
  const drawControlLine = vertex => {
    const { point, controlLine } = vertex;
    const { x, y } = point;
    const controlPointOffset = Vector2D.fromPolar(
      0.5 * controlLine.length,
      controlLine.angle
    );
    const controlX = controlPointOffset.x;
    const controlY = controlPointOffset.y;
    p.line(x - controlX, y - controlY, x + controlX, y + controlY);
  };
  const drawBezierControlLines = vertices => {
    ArrayUtility.loop(vertices, drawControlLine);
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
      shakeType === "VERTICAL" ? 0 : Random.signed(shakeFactor * width);
    const yShake =
      shakeType === "HORIZONTAL" ? 0 : Random.signed(shakeFactor * height);
    p.translate(xShake, yShake);
    shakeFactor *= shakeDecayFactor;
    if (shakeFactor < 0.001) shakeFactor = 0;
  };

  const line = (from, to) => p.line(from.x, from.y, to.x, to.y);
  const lineWithMargin = (from, to, margin) => {
    const angle = Angle.betweenPoints(from, to);
    const offsetX = margin * cos$1(angle);
    const offsetY = margin * sin$1(angle);
    return p.line(
      from.x + offsetX,
      from.y + offsetY,
      to.x - offsetX,
      to.y - offsetY
    );
  };
  const lineAtOrigin = destination =>
    p.line(0, 0, destination.x, destination.y);
  const circleAtOrigin = size => p.circle(0, 0, size);
  const arcAtOrigin = (width, height, startRatio, endRatio, mode, detail) =>
    p.arc(
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
    p.arc(
      0,
      0,
      size,
      size,
      startRatio * TWO_PI$1,
      endRatio * TWO_PI$1,
      mode,
      detail
    );

  const logicalPosition = { x: 0, y: 0 };
  const updatePosition = () => {
    if (!canvas) return;
    const factor = 1 / canvas.scaleFactor;
    logicalPosition.x = factor * p.mouseX;
    logicalPosition.y = factor * p.mouseY;
  };
  /**
   * Sets mouse position to the center point of the canvas.
   */
  const setCenter = () =>
    Vector2D.Mutable.set(logicalPosition, canvas.logicalCenterPosition);
  const emptyCallback = () => true;
  const stopCallback = () => false;
  const createEventHandler = handler => {
    return {
      onClicked: handler.onClicked || emptyCallback,
      onPressed: handler.onPressed || emptyCallback,
      onReleased: handler.onReleased || emptyCallback,
      onMoved: handler.onMoved || emptyCallback
    };
  };
  /**
   * The EventHandler that will be checked first by `onClicked` and other similar functions.
   * Set a callback that returns `false` here for ignoring other handlers in `handlerStack`.
   */
  const topEventHandler = createEventHandler({});
  const eventHandlerStack = ArrayList.create(32);
  /**
   * The EventHandler that will be checked last by `onClicked` and other similar functions
   * after checking all handlers in `eventHandlerStack`.
   */
  const bottomEventHandler = createEventHandler({});
  /**
   * Creates an `EventHandler` and adds it to `eventHandlerStack`.
   * @param handler
   * @return Created `EventHandler`.
   */
  const addEventHandler = handler => {
    const createdHandler = createEventHandler(handler);
    ArrayList.add(eventHandlerStack, createdHandler);
    return createdHandler;
  };
  /**
   * Removes `handler` from `eventHandlerStack`.
   * @param handler
   */
  const removeEventHandler = handler => {
    ArrayList.removeShiftElement(eventHandlerStack, handler);
  };
  const runCallback = callback => callback(logicalPosition);
  const createGetCallback = event => {
    switch (event) {
      case 0:
        return handler => handler.onClicked;
      case 1:
        return handler => handler.onPressed;
      case 2:
        return handler => handler.onReleased;
      case 3:
        return handler => handler.onMoved;
    }
  };
  const createOnEvent = event => {
    const getCallback = createGetCallback(event);
    return () => {
      const runNext = runCallback(getCallback(topEventHandler));
      if (!runNext) return;
      const handlers = eventHandlerStack.array;
      let index = eventHandlerStack.size - 1;
      while (index >= 0) {
        const runNext = runCallback(getCallback(handlers[index]));
        if (!runNext) break;
        index -= 1;
      }
      runCallback(getCallback(bottomEventHandler));
    };
  };
  const onClicked = createOnEvent(0);
  const onPressed = createOnEvent(1);
  const onReleased = createOnEvent(2);
  const onMoved = createOnEvent(3);
  const drawAtCursor = callback =>
    drawTranslated(callback, logicalPosition.x, logicalPosition.y);
  /**
   * Checks if the mouse cursor position is contained in the region of the canvas.
   * @return `true` if mouse cursor is on the canvas.
   */
  const isOnCanvas = () =>
    RectangleRegion.containsPoint(canvas.logicalRegion, logicalPosition, 0);

  const mouse = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    logicalPosition: logicalPosition,
    updatePosition: updatePosition,
    setCenter: setCenter,
    emptyCallback: emptyCallback,
    stopCallback: stopCallback,
    createEventHandler: createEventHandler,
    topEventHandler: topEventHandler,
    eventHandlerStack: eventHandlerStack,
    bottomEventHandler: bottomEventHandler,
    addEventHandler: addEventHandler,
    removeEventHandler: removeEventHandler,
    onClicked: onClicked,
    onPressed: onPressed,
    onReleased: onReleased,
    onMoved: onMoved,
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
  const update$1 = () => {
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
    update$1();
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
    update$1();
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
   * If already paused, resumes by `p.loop()`.
   */
  const pauseOrResume = () => {
    if (paused) {
      p.loop();
      paused = false;
    } else {
      p.noLoop();
      paused = true;
    }
  };

  /**
   * Creates a 1-dimensional noise function with offset parameter.
   * @param offset Random if not specified.
   * @return New function that runs `noise()` of p5.
   */
  const withOffset = (offset = Random.value(4096)) => x => p.noise(offset + x);
  /**
   * Creates a 2-dimensional noise function with offset parameters.
   * @param offsetX Random if not specified.
   * @param offsetY Random if not specified.
   * @return New function that runs `noise()` of p5.
   */
  const withOffset2 = (
    offsetX = Random.value(4096),
    offsetY = Random.value(256)
  ) => (x, y) => p.noise(offsetX + x, offsetY + y);
  /**
   * Creates a 3-dimensional noise function with offset parameters.
   * @param offsetX Random if not specified.
   * @param offsetY Random if not specified.
   * @param offsetZ Random if not specified.
   * @return New function that runs `noise()` of p5.
   */
  const withOffset3 = (
    offsetX = Random.value(4096),
    offsetY = Random.value(256),
    offsetZ = Random.value(16)
  ) => (x, y, z) => p.noise(offsetX + x, offsetY + y, offsetZ + z);
  /**
   * Creates a noise function without arguments that returns every time an updated value.
   * @param changeRate
   * @param offset Random if not specified.
   * @return New function that runs `noise()` of p5, internally changing the `x` argument by `changeRate`.
   */
  const withChangeRate = (changeRate, offset = Random.value(4096)) => {
    let x = offset;
    return () => p.noise((x += changeRate));
  };
  /**
   * Creates a 1-dimensional noise function that returns every time an updated value.
   * @param changeRate
   * @param offsetX Random if not specified.
   * @param offsetY Random if not specified.
   * @return New function that runs `noise()` of p5, internally changing the `y` argument by `changeRate`.
   */
  const withChangeRate1 = (
    changeRate,
    offsetX = Random.value(4096),
    offsetY = Random.value(256)
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
   * @return New function that runs `noise()` of p5, internally changing the `z` argument by `changeRate`.
   */
  const withChangeRate2 = (
    changeRate,
    offsetX = Random.value(4096),
    offsetY = Random.value(256),
    offsetZ = Random.value(16)
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
   * A list of functions that will be called in `p.setup()` just after creating canvas in `startSketch()`.
   */
  const onSetup = [];

  /**
   * Runs `p.createCanvas()` with the scaled size that fits to `node`.
   * Returns a `ScaledCanvas` instance, which includes the created canvas and the scale factor.
   *
   * @param node The HTML element or its ID.
   * @param logicalSize
   * @param fittingOption No scaling if `null`.
   * @param renderer
   * @return A `ScaledCanvas` instance.
   */
  const createScaledCanvas = (node, logicalSize, fittingOption, renderer) => {
    const maxCanvasSize = HtmlUtility.getElementSize(
      typeof node === "string" ? HtmlUtility.getElementOrBody(node) : node
    );
    const scaleFactor =
      fittingOption !== null
        ? FitBox.calculateScaleFactor(logicalSize, maxCanvasSize, fittingOption)
        : 1;
    const p5Canvas = p.createCanvas(
      scaleFactor * logicalSize.width,
      scaleFactor * logicalSize.height,
      renderer
    );
    const drawScaledFunction =
      scaleFactor !== 1
        ? drawCallback => drawScaled(drawCallback, scaleFactor)
        : drawCallback => drawCallback();
    return {
      p5Canvas,
      scaleFactor,
      logicalSize,
      logicalRegion: RectangleRegion.create(Vector2D.zero, logicalSize),
      drawScaled: drawScaledFunction,
      logicalCenterPosition: {
        x: logicalSize.width / 2,
        y: logicalSize.height / 2
      }
    };
  };

  /**
   * Calls `new p5()` with the given settings information.
   * @param settings
   */
  const startSketch = settings => {
    const htmlElement =
      typeof settings.htmlElement === "string"
        ? HtmlUtility.getElementOrBody(settings.htmlElement)
        : settings.htmlElement;
    new p5(p => {
      setP5Instance(p);
      p.setup = () => {
        setCanvas(
          createScaledCanvas(
            htmlElement,
            settings.logicalCanvasSize,
            settings.fittingOption,
            settings.renderer
          )
        );
        ArrayUtility.loop(onSetup, listener => listener(p));
        onSetup.length = 0;
        settings.initialize();
      };
      settings.setP5Methods(p);
    }, htmlElement);
  };

  const p5ex = /*#__PURE__*/ Object.freeze({
    AlphaColor: alphaColor,
    KeyBoard: keyboard,
    Mouse: mouse,
    MoveKeys: moveKeys,
    Noise: noise,
    ShapeColor: shapeColor,
    applyShake: applyShake,
    arcAtOrigin: arcAtOrigin,
    get canvas() {
      return canvas;
    },
    circleAtOrigin: circleAtOrigin,
    circularArcAtOrigin: circularArcAtOrigin,
    colorWithAlpha: colorWithAlpha,
    createPixels: createPixels,
    createScaledCanvas: createScaledCanvas,
    drawBezierControlLines: drawBezierControlLines,
    drawBezierCurve: drawBezierCurve,
    drawRotated: drawRotated,
    drawScaled: drawScaled,
    drawTransformed: drawTransformed,
    drawTranslated: drawTranslated,
    drawTranslatedAndRotated: drawTranslatedAndRotated,
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
    pauseOrResume: pauseOrResume,
    replaceCanvasPixels: replaceCanvasPixels,
    reverseColor: reverseColor,
    rotate: rotate,
    rotateScale: rotateScale,
    scale: scale,
    setCanvas: setCanvas,
    setP5Instance: setP5Instance,
    setShake: setShake,
    startSketch: startSketch,
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
   * ---- Settings --------------------------------------------------------------
   */
  /**
   * The id of the HTML element to which the canvas should belong.
   */
  const HTML_ELEMENT_ID = "DieWelle";
  /**
   * The HTML element to which the canvas should belong.
   */
  const HTML_ELEMENT = htmlUtility.getElementOrBody(HTML_ELEMENT_ID);
  /**
   * The logical size of the canvas.
   */
  const LOGICAL_CANVAS_SIZE = {
    width: 640,
    height: 360
  };

  /**
   * ---- Common ----------------------------------------------------------------
   */
  const {
    ArrayList: ArrayList$1,
    ArrayUtility: ArrayUtility$1,
    Random: Random$1,
    Timer
  } = CCC;
  const {
    square: square$1,
    sin: sin$2,
    createMap: createNumericMap,
    floor: floor$1
  } = numeric;
  const { easeOutQuad: easeOutQuad$1 } = easing;
  const {
    onSetup: onSetup$1,
    hsvColor: hsvColor$1,
    reverseColor: reverseColor$1,
    Noise,
    translate: translate$1,
    undoTranslate: undoTranslate$1
  } = p5ex;
  const { width, height } = LOGICAL_CANVAS_SIZE;
  const halfHeight = height / 2;
  const MARGIN = 100;
  const LEFT_X = -MARGIN;
  const RIGHT_X = width + MARGIN;
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

  /**
   * ---- Function --------------------------------------------------------------
   */
  function drawGradation(fromColor, toColor, gradient = 1, interval = 1) {
    const { width, height } = LOGICAL_CANVAS_SIZE;
    p$1.strokeWeight(interval * 2);
    for (let y = 0; y < height; y += interval) {
      const lerpRatio = Math.pow(y / (height - 1), gradient);
      p$1.stroke(p$1.lerpColor(fromColor, toColor, lerpRatio));
      p$1.line(0, y, width - 1, y);
    }
  }

  /**
   * ---- Vertex ----------------------------------------------------------------
   */
  const create$c = (x, y, noiseOffsetX, noiseOffsetY) => {
    return {
      x,
      y,
      noiseX: Noise.withChangeRate(0.008, noiseOffsetX),
      noiseY: Noise.withChangeRate(0.008, noiseOffsetY)
    };
  };
  const update$2 = vertex => {
    vertex.x -= 4;
    return vertex.x <= LEFT_X;
  };
  const xToRadians = createNumericMap(0, width, 0, Math.PI);
  const yFactor = x =>
    x > 0 && x < width ? square$1(sin$2(xToRadians(x))) : 0;
  const noiseAverage = Noise.AVERAGE;
  const draw = vertex => {
    const x = vertex.x + 140 * (vertex.noiseX() - noiseAverage);
    const y = vertex.y + 140 * (vertex.noiseY() - noiseAverage);
    p$1.curveVertex(x, yFactor(x) * y);
  };

  /**
   * ---- Vertices --------------------------------------------------------------
   */
  const create$d = () => ArrayList$1.create(32);
  const reset$1 = vertices => {
    ArrayList$1.clear(vertices);
    [0.25, 0.5, 0.75, 1].forEach(factor =>
      ArrayList$1.add(vertices, create$c(factor * width, 0))
    );
  };
  const update$3 = vertices => ArrayList$1.removeShiftAll(vertices, update$2);
  const addNewVertex = (vertices, y, noiseOffsetX, noiseOffsetY) =>
    ArrayList$1.add(vertices, create$c(RIGHT_X, y, noiseOffsetX, noiseOffsetY));
  const draw$1 = vertices => {
    p$1.beginShape();
    p$1.curveVertex(LEFT_X - 20, 0);
    p$1.curveVertex(LEFT_X - 10, 0);
    p$1.curveVertex(LEFT_X, 0);
    ArrayList$1.loop(vertices, draw);
    p$1.curveVertex(RIGHT_X, 0);
    p$1.curveVertex(RIGHT_X + 10, 0);
    p$1.curveVertex(RIGHT_X + 20, 0);
    p$1.endShape();
  };

  /**
   * ---- Wave ------------------------------------------------------------------
   */
  let colors;
  onSetup$1.push(() => {
    colors = ArrayUtility$1.createIntegerSequence(360).map(hue =>
      reverseColor$1(hsvColor$1(hue, 1, 0.8, 96))
    );
  });
  const getColor = hue => colors[floor$1(hue) % 360];
  const create$e = hue => {
    return {
      vertices: create$d(),
      hue
    };
  };
  const update$4 = wave => {
    update$3(wave.vertices);
    wave.hue += 1;
  };
  const draw$2 = wave => {
    p$1.stroke(getColor(wave.hue));
    draw$1(wave.vertices);
  };
  const reset$2 = wave => reset$1(wave.vertices);

  /**
   * ---- Waves -----------------------------------------------------------------
   */
  const WAVE_COUNT = 40;
  const NOISE_OFFSET_INTERVAL = 2 / WAVE_COUNT;
  const HUE_INTERVAL = 120 / WAVE_COUNT;
  const VERTEX_INTERVAL_DURATION = 30;
  let positiveY = false;
  const addNewVertex$1 = waveList => {
    const yFactor =
      (positiveY ? 1 : -1) * Random$1.valueCurved(easeOutQuad$1, 0.7);
    const y = yFactor * halfHeight;
    const noiseOffsetX = Random$1.value(4096);
    const noiseOffsetY = Random$1.value(4096);
    ArrayList$1.loop(waveList, (wave, index) => {
      const additionalOffset = index * NOISE_OFFSET_INTERVAL;
      addNewVertex(
        wave.vertices,
        y,
        noiseOffsetX + additionalOffset,
        noiseOffsetY + additionalOffset
      );
    });
    positiveY = !positiveY;
  };
  const create$f = () => {
    const list = ArrayList$1.createPopulated(WAVE_COUNT, index =>
      create$e(index * HUE_INTERVAL)
    );
    const timer = Timer.loop(
      Timer.create({
        duration: VERTEX_INTERVAL_DURATION,
        onProgress: () => ArrayList$1.loop(list, update$4),
        onComplete: () => addNewVertex$1(list)
      })
    );
    return { list, timer };
  };
  const update$5 = waves => waves.timer.step();
  const draw$3 = waves => {
    p$1.push();
    p$1.blendMode(p$1.DIFFERENCE);
    p$1.noFill();
    ArrayList$1.loop(waves.list, draw$2);
    p$1.pop();
  };
  const reset$3 = waves => {
    ArrayList$1.loop(waves.list, reset$2);
    waves.timer.reset();
  };

  /**
   * ---- Main ------------------------------------------------------------------
   */
  const {
    startSketch: startSketch$1,
    createPixels: createPixels$1,
    replaceCanvasPixels: replaceCanvasPixels$1,
    pauseOrResume: pauseOrResume$1
  } = p5ex;
  let drawBackground;
  const waves = create$f();
  const reset$4 = reset$3.bind(undefined, waves);
  const initialize = () => {
    const backgroundPixels = createPixels$1(() => {
      canvas$1.drawScaled(() => {
        drawGradation(p$1.color(255), p$1.color(240, 244, 255), 4, 4);
      });
    });
    drawBackground = replaceCanvasPixels$1.bind(undefined, backgroundPixels);
    reset$4();
  };
  const updateSketch = update$5.bind(undefined, waves);
  const drawSketch = () => {
    translate$1(0, halfHeight);
    draw$3(waves);
    undoTranslate$1();
  };
  const draw$4 = () => {
    updateSketch();
    drawBackground();
    canvas$1.drawScaled(drawSketch);
  };
  const keyTyped = () => {
    switch (p$1.key) {
      case "p":
        pauseOrResume$1();
        break;
      case "g":
        p$1.save("image.png");
        break;
    }
  };
  const setP5Methods = p => {
    p.draw = draw$4;
    p.keyTyped = keyTyped;
  };
  startSketch$1({
    htmlElement: HTML_ELEMENT,
    logicalCanvasSize: LOGICAL_CANVAS_SIZE,
    initialize,
    setP5Methods,
    fittingOption: null
  });
})(p5);
//# sourceMappingURL=sketch.js.map
