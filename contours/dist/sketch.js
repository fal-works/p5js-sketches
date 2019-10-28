/**
 * Contours.
 * Source code in TypeScript: https://github.com/fal-works/p5js-sketches/tree/master/contours
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
   * @version 0.1.9
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
    createPopulated: createPopulated
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
  const add = (arrayList, element) => {
    arrayList.array[arrayList.size] = element;
    arrayList.size += 1;
  };
  const push = add;
  const pop = arrayList => {
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
  const get = object => object.value || (object.value = object.factory());
  const clear$1 = object => {
    object.value = undefined;
  };

  const lazy = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    create: create$1,
    get: get,
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
    clamp: clamp
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

  const random$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
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

  const emptyListener = () => {};
  const create$3 = (
    duration,
    onProgress = emptyListener,
    onComplete = emptyListener
  ) => {
    return {
      duration,
      progressRatioChangeRate: 1 / duration,
      onProgress,
      onComplete,
      count: 0,
      progressRatio: 0,
      isCompleted: false
    };
  };
  const dummy = create$3(0);
  const reset = timerUnit => {
    timerUnit.count = 0;
    timerUnit.progressRatio = 0;
    timerUnit.isCompleted = false;
  };
  const step = timerUnit => {
    if (timerUnit.isCompleted) return true;
    const { count, duration, progressRatioChangeRate } = timerUnit;
    if (count >= duration) {
      timerUnit.progressRatio = 1;
      timerUnit.onProgress(timerUnit);
      timerUnit.isCompleted = true;
      timerUnit.onComplete(timerUnit);
      return true;
    }
    timerUnit.onProgress(timerUnit);
    timerUnit.count += 1;
    timerUnit.progressRatio += progressRatioChangeRate;
    return false;
  };
  const addOnComplete = (timerUnit, onComplete) => {
    const newUnit = Object.assign({}, timerUnit);
    const oldOnComplete = timerUnit.onComplete;
    newUnit.onComplete = () => {
      oldOnComplete(newUnit);
      onComplete(newUnit);
    };
    return newUnit;
  };

  const step$1 = chain => {
    step(chain.current);
    return chain.isCompleted;
  };
  const setUnitIndex = (chain, index) => {
    chain.index = index;
    chain.current = chain.timers[index];
  };
  const reset$1 = chain => {
    loop(chain.timers, reset);
    setUnitIndex(chain, 0);
  };
  const next = chain => {
    setUnitIndex(chain, chain.index + 1);
    return chain.current;
  };
  const create$4 = (timers, looped = false) => {
    let newChain;
    const newTimers = new Array(timers.length);
    const shift = () => next(newChain);
    const lastIndex = timers.length - 1;
    for (let i = 0; i < lastIndex; i += 1) {
      newTimers[i] = addOnComplete(timers[i], shift);
    }
    if (looped)
      newTimers[lastIndex] = addOnComplete(timers[lastIndex], () =>
        reset$1(newChain)
      );
    else
      newTimers[lastIndex] = addOnComplete(
        timers[lastIndex],
        () => (newChain.isCompleted = true)
      );
    newChain = {
      timers: newTimers,
      current: newTimers[0],
      index: 0,
      isCompleted: false
    };
    return newChain;
  };
  const dummy$1 = create$4([dummy]);

  const chain = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    step: step$1,
    setUnitIndex: setUnitIndex,
    reset: reset$1,
    next: next,
    create: create$4,
    dummy: dummy$1
  });

  const create$5 = capacity => create(capacity);
  const addTimer = (timerSet, timer) => add(timerSet, () => step(timer));
  const addChain = (timerSet, chain$1) => add(timerSet, () => step$1(chain$1));
  const runStep = step => step();
  const step$2 = timerSet => {
    removeShiftAll(timerSet, runStep);
  };
  const clear$2 = timerSet => clearReference(timerSet);
  /**
   * Creates a timer set instance and returns a set of bound functions.
   * @param capacity
   */
  const construct = capacity => {
    const timerSet = create$5(capacity);
    return {
      addTimer: timer => addTimer(timerSet, timer),
      addChain: chain => addChain(timerSet, chain),
      step: () => step$2(timerSet),
      clear: () => clear$2(timerSet)
    };
  };

  const set$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    create: create$5,
    addTimer: addTimer,
    addChain: addChain,
    step: step$2,
    clear: clear$2,
    construct: construct
  });

  const index$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Chain: chain,
    Set: set$1,
    emptyListener: emptyListener,
    create: create$3,
    dummy: dummy,
    reset: reset,
    step: step,
    addOnComplete: addOnComplete
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
  class Unit {
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
  class On extends Unit {
    constructor(length, codeString) {
      super(true, length, codeString);
    }
  }
  class Off extends Unit {
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
    Unit: Unit,
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
  const create$6 = (on, off, wpm = 25, signals = [], loop = false) => {
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
    create: create$6,
    stop: stop,
    start: start
  });

  const index$2 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Signal: signal,
    Channel: channel
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
   * @version 0.1.9
   */

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
    typeof color === "string" ? p.color(color) : Object.assign({}, color);
  const emptyFunction = () => {};
  /**
   * Creates a function that applies a stroke color.
   * @param color `null` will be `noStroke()` and `undefined` will have no effects.
   * @return A function that runs either `stroke()`, `noStroke()` or nothing.
   */
  const parseStroke = color => {
    if (color === null) return p.noStroke.bind(p);
    if (color === undefined) return emptyFunction;
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
    if (color === undefined) return emptyFunction;
    const colorObject = parseColor(color);
    return p.fill.bind(p, colorObject);
  };
  /**
   * Creates a new `p5.Color` instance by replacing the alpha value with `alpha`.
   * @param color
   * @param alpha
   */
  const colorWithAlpha = (color, alpha) => {
    const colorObject = parseColor(color);
    colorObject.setAlpha(alpha);
    return colorObject;
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
    Angle
  } = CCC;
  const { sin: sin$1, cos: cos$1 } = Numeric;
  const { round: round$1 } = Numeric;
  const {
    ONE_OVER_SQUARE_ROOT_TWO: ONE_OVER_SQUARE_ROOT_TWO$1,
    INVERSE255: INVERSE255$1
  } = MathConstants;
  const { TWO_PI: TWO_PI$1 } = Angle;

  /**
   * Creats an `AlphaColor` unit.
   * The max alpha of `stroke()` and `fill()` should be set to `255` when using this function.
   * @param color
   * @param resolution
   */
  const create$7 = (color, resolution) => {
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
  const get$1 = (alphaColor, alpha) =>
    alphaColor.colors[round$1(alphaColor.maxIndex * alpha * INVERSE255$1)];

  const alphaColor = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    create: create$7,
    get: get$1
  });

  const emptyFunction$1 = () => {};
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
      stroke = emptyFunction$1;
    } else {
      const strokeAlphaColor = create$7(strokeColor, alphaResolution);
      stroke = alpha => p.stroke(get$1(strokeAlphaColor, alpha));
    }
    let fill;
    if (fillColor === null) {
      fill = () => p.noFill();
    } else if (fillColor === undefined) {
      fill = emptyFunction$1;
    } else {
      const fillAlphaColor = create$7(fillColor, alphaResolution);
      fill = alpha => p.fill(get$1(fillAlphaColor, alpha));
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
    drawAtCursor: drawAtCursor
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
            settings.fittingOption
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
    setCanvas: setCanvas,
    setP5Instance: setP5Instance,
    setShake: setShake,
    startSketch: startSketch
  });

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
   * @version 0.1.9
   */

  /**
   * Runs `callback` once for each element of `array` from index `start` up to (but not including) `end`.
   * Unlike `Array.prototype.forEach()`, an element of `array` should not be removed during the iteration.
   * @param array
   * @param callback
   */
  const loopRange$1 = (array, callback, start, end) => {
    for (let i = start; i < end; i += 1) callback(array[i], i, array);
  };
  /**
   * Runs `callback` once for each element of `array`.
   * Unlike `Array.prototype.forEach()`, an element of `array` should not be removed during the iteration.
   * @param array
   * @param callback
   */
  const loop$2 = (array, callback) =>
    loopRange$1(array, callback, 0, array.length);
  /**
   * Runs `callback` once for each element of `array` from index `start` up to (but not including) `end` in descending order.
   * @param array
   * @param callback
   */
  const loopRangeBackwards$1 = (array, callback, start, end) => {
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
  const loopBackwards$2 = (array, callback) =>
    loopRangeBackwards$1(array, callback, 0, array.length);
  /**
   * Joins two arrays within the specified range and runs `callback` once for each joined pair.
   * You should not remove elements from arrays during the iteration.
   * @param arrayA
   * @param arrayB
   * @param callback
   * @param endA
   * @param endB
   */
  const nestedLoopJoinWithRange$1 = (
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
  const nestedLoopJoin$2 = (arrayA, arrayB, callback) =>
    nestedLoopJoinWithRange$1(
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
  const roundRobinWithRange$1 = (array, callback, start, end) => {
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
  const roundRobin$2 = (array, callback) =>
    roundRobinWithRange$1(array, callback, 0, array.length);
  /**
   * Creates a new 1-dimensional array by concatenating sub-array elements of a 2-dimensional array.
   * @param arrays
   * @return A new 1-dimensional array.
   */
  const flatNaive$1 = arrays => [].concat(...arrays);
  /**
   * An alternative to `Array.prototype.flat()`.
   * @param array
   * @param depth
   * @return A new array.
   */
  const flatRecursive$1 = (array, depth = 1) =>
    depth > 0
      ? array.reduce(
          (acc, cur) =>
            acc.concat(
              Array.isArray(cur) ? flatRecursive$1(cur, depth - 1) : cur
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
  const populate$2 = (array, factory, length) => {
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
  const createPopulated$2 = (factory, length) =>
    populate$2(new Array(length), factory);

  const arrayUtility$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    loopRange: loopRange$1,
    loop: loop$2,
    loopRangeBackwards: loopRangeBackwards$1,
    loopBackwards: loopBackwards$2,
    nestedLoopJoinWithRange: nestedLoopJoinWithRange$1,
    nestedLoopJoin: nestedLoopJoin$2,
    roundRobinWithRange: roundRobinWithRange$1,
    roundRobin: roundRobin$2,
    flatNaive: flatNaive$1,
    flatRecursive: flatRecursive$1,
    populate: populate$2,
    createPopulated: createPopulated$2
  });

  /**
   * Creates an array-list unit.
   * @param initialCapacity
   */
  const create$8 = initialCapacity => {
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
  const createFilled$1 = (size, value) => {
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
  const createPopulated$1$1 = (size, factory) => {
    return {
      array: populate$2(new Array(size), factory),
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
  const fromArray$2 = array => {
    return {
      array,
      size: array.length
    };
  };
  const add$4 = (arrayList, element) => {
    arrayList.array[arrayList.size] = element;
    arrayList.size += 1;
  };
  const push$1 = add$4;
  const pop$1 = arrayList => {
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
  const clear$3 = arrayList => {
    arrayList.size = 0;
  };
  /**
   * Nullifies the slots that are not used.
   * @param arrayList
   */
  const cleanUnusedSlots$1 = arrayList => {
    const { array, size } = arrayList;
    const capacity = array.length;
    array.length = size;
    array.length = capacity;
  };
  /**
   * Clears the contents of `arrayList` and also nullifies all references.
   * @param arrayList
   */
  const clearReference$1 = arrayList => {
    arrayList.size = 0;
    cleanUnusedSlots$1(arrayList);
  };
  /**
   * Runs `callback` for each element of `arrayList`.
   * @param arrayList
   * @param callback
   */
  const loop$1$1 = (arrayList, callback) =>
    loopRange$1(arrayList.array, callback, 0, arrayList.size);
  /**
   * Runs `callback` for each element of `arrayList` in descending order.
   * @param arrayList
   * @param callback
   */
  const loopBackwards$1$1 = (arrayList, callback) =>
    loopRangeBackwards$1(arrayList.array, callback, 0, arrayList.size);
  /**
   * Finds the first element where `predicate` returns true.
   * @param arrayList
   * @param predicate Function that returns `true` if a given value matches the condition.
   * @return The found `element`. `undefined` if not found.
   */
  const find$1 = (arrayList, predicate) => {
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
  const findIndex$1 = (arrayList, element) => {
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
  const removeShift$1 = (arrayList, index) => {
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
  const removeShiftElement$1 = (arrayList, element) => {
    const index = findIndex$1(arrayList, element);
    if (index >= 0) return removeShift$1(arrayList, index);
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
  const removeSwap$1 = (arrayList, index) => {
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
  const removeSwapElement$1 = (arrayList, element) => {
    const index = findIndex$1(arrayList, element);
    if (index >= 0) return removeSwap$1(arrayList, index);
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
  const removeShiftAll$1 = (arrayList, predicate) => {
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
  const removeSwapAll$1 = (arrayList, predicate) => {
    let found = false;
    const array = arrayList.array;
    for (let i = 0; i < arrayList.size; i += 1) {
      if (predicate(array[i], i, array)) {
        removeSwap$1(arrayList, i);
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
  const populate$1$1 = (arrayList, factory) => {
    populate$2(arrayList.array, factory);
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
  const nestedLoopJoin$1$1 = (arrayListA, arrayListB, callback) =>
    nestedLoopJoinWithRange$1(
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
  const roundRobin$1$1 = (arrayList, callback) =>
    roundRobinWithRange$1(arrayList.array, callback, 0, arrayList.size);

  const arrayList$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    create: create$8,
    createFilled: createFilled$1,
    createPopulated: createPopulated$1$1,
    fromArray: fromArray$2,
    add: add$4,
    push: push$1,
    pop: pop$1,
    clear: clear$3,
    cleanUnusedSlots: cleanUnusedSlots$1,
    clearReference: clearReference$1,
    loop: loop$1$1,
    loopBackwards: loopBackwards$1$1,
    find: find$1,
    findIndex: findIndex$1,
    removeShift: removeShift$1,
    removeShiftElement: removeShiftElement$1,
    removeSwap: removeSwap$1,
    removeSwapElement: removeSwapElement$1,
    removeShiftAll: removeShiftAll$1,
    removeSwapAll: removeSwapAll$1,
    populate: populate$1$1,
    nestedLoopJoin: nestedLoopJoin$1$1,
    roundRobin: roundRobin$1$1
  });

  const create$1$2 = factory => {
    return {
      value: undefined,
      factory
    };
  };
  const get$2 = object => object.value || (object.value = object.factory());
  const clear$1$1 = object => {
    object.value = undefined;
  };

  const lazy$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    create: create$1$2,
    get: get$2,
    clear: clear$1$1
  });

  const from$1 = (prototypeStructure, length) => {
    const data = {};
    for (const key of Object.keys(prototypeStructure))
      data[key] = new Array(length).fill(prototypeStructure[key]);
    return {
      data,
      length
    };
  };

  const structureOfArrays$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    from: from$1
  });

  const {
    abs: abs$1,
    acos: acos$1,
    asin: asin$1,
    atan: atan$1,
    atan2: atan2$1,
    ceil: ceil$1,
    cos: cos$2,
    exp: exp$1,
    floor: floor$1,
    log: log$1,
    max: max$1,
    min: min$1,
    pow: pow$1,
    round: round$2,
    sin: sin$2,
    sqrt: sqrt$1,
    tan: tan$1,
    clz32: clz32$1,
    imul: imul$1,
    sign: sign$1,
    log10: log10$1,
    log2: log2$1,
    log1p: log1p$1,
    expm1: expm1$1,
    cosh: cosh$1,
    sinh: sinh$1,
    tanh: tanh$1,
    acosh: acosh$1,
    asinh: asinh$1,
    atanh: atanh$1,
    hypot: hypot$1,
    trunc: trunc$1,
    fround: fround$1,
    cbrt: cbrt$1
  } = Math;
  /**
   * Same as `Math.sqrt`.
   * @return √x
   */
  const squareRoot$1 = sqrt$1;
  /**
   * Same as `Math.clz32`.
   */
  const leadingZeros32$1 = clz32$1;
  /**
   * Same as `Math.imul`.
   */
  const multInt$1 = imul$1;
  /**
   * Same as `Math.hypot`.
   */
  const hypotenuse$1 = hypot$1;
  /**
   * Same as `Math.trunc`.
   */
  const integerPart$1 = trunc$1;
  /**
   * Same as `Math.fround`.
   */
  const floatRound$1 = fround$1;
  /**
   * Same as `Math.cbrt`.
   * @return ∛x
   */
  const cubeRoot$1 = cbrt$1;
  const square$1 = v => v * v;
  const cube$1 = v => v * v * v;
  const pow4$1 = v => square$1(v * v);
  const pow5$1 = v => square$1(v * v) * v;
  const squareInt$1 = v => imul$1(v, v);
  const cubeInt$1 = v => imul$1(imul$1(v, v), v);
  /**
   * Checks whether `a` and `b` are considered equal.
   * @param a
   * @param b
   * @return `true` if the absolute difference of `a` and `b` is smaller than `Number.EPSILON`.
   */
  const equal$1 = (a, b) => abs$1(a - b) < 2.220446049250313e-16;
  /**
   * Similar to `Math.min` but accepts only two arguments.
   * @param a
   * @param b
   * @return The smaller of `a` or `b`.
   */
  const min2$1 = (a, b) => (a < b ? a : b);
  /**
   * Similar to `Math.max` but accepts only two arguments.
   * @param a
   * @param b
   * @return The larger of `a` or `b`.
   */
  const max2$1 = (a, b) => (a > b ? a : b);
  /**
   * Safe version of `Math.atan2`;
   * @param y
   * @param x
   * @return The angle from x-axis to the point. `0` if both `x` and `y` are `0`.
   */
  const atan2safe$1 = (y, x) => (y !== 0 || x !== 0 ? atan2$1(y, x) : 0);
  /**
   * Calculates the sum of squares of `x` and `y`.
   * @param x
   * @param y
   * @return `x^2 + y^2`.
   */
  const hypotenuseSquared2D$1 = (x, y) => x * x + y * y;
  /**
   * A 2D version of `Math.hypot`. Calculates the square root of the sum of squares of `x` and `y`.
   * @param x
   * @param y
   * @return `√(x^2 + y^2)`.
   */
  const hypotenuse2D$1 = (x, y) => sqrt$1(x * x + y * y);
  /**
   * Linearly interpolates between `start` and `end` by `ratio`.
   * The result will not be clamped.
   * @param start
   * @param end
   * @param ratio
   * @return Interpolated value, e.g. `start` if `ratio == 0`, `end` if `ratio == 1`.
   */
  const lerp$1 = (start, end, ratio) => start + ratio * (end - start);
  /**
   * Clamps `value` between `min` and `max`.
   * @param value
   * @param min
   * @param max
   * @return Clamped value equal or greater than `min` and equal or less than `max`.
   */
  const clamp$1 = (value, min, max) =>
    value < min ? min : value > max ? max : value;

  const numeric$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    abs: abs$1,
    acos: acos$1,
    asin: asin$1,
    atan: atan$1,
    atan2: atan2$1,
    ceil: ceil$1,
    cos: cos$2,
    exp: exp$1,
    floor: floor$1,
    log: log$1,
    max: max$1,
    min: min$1,
    pow: pow$1,
    round: round$2,
    sin: sin$2,
    sqrt: sqrt$1,
    tan: tan$1,
    clz32: clz32$1,
    imul: imul$1,
    sign: sign$1,
    log10: log10$1,
    log2: log2$1,
    log1p: log1p$1,
    expm1: expm1$1,
    cosh: cosh$1,
    sinh: sinh$1,
    tanh: tanh$1,
    acosh: acosh$1,
    asinh: asinh$1,
    atanh: atanh$1,
    hypot: hypot$1,
    trunc: trunc$1,
    fround: fround$1,
    cbrt: cbrt$1,
    squareRoot: squareRoot$1,
    leadingZeros32: leadingZeros32$1,
    multInt: multInt$1,
    hypotenuse: hypotenuse$1,
    integerPart: integerPart$1,
    floatRound: floatRound$1,
    cubeRoot: cubeRoot$1,
    square: square$1,
    cube: cube$1,
    pow4: pow4$1,
    pow5: pow5$1,
    squareInt: squareInt$1,
    cubeInt: cubeInt$1,
    equal: equal$1,
    min2: min2$1,
    max2: max2$1,
    atan2safe: atan2safe$1,
    hypotenuseSquared2D: hypotenuseSquared2D$1,
    hypotenuse2D: hypotenuse2D$1,
    lerp: lerp$1,
    clamp: clamp$1
  });

  const {
    E: E$1,
    LN10: LN10$1,
    LN2: LN2$1,
    LOG2E: LOG2E$1,
    LOG10E: LOG10E$1
  } = Math;
  const ONE_HALF$1 = 1 / 2;
  const ONE_THIRD$1 = 1 / 3;
  const TWO_THIRDS$1 = 2 / 3;
  const ONE_QUARTER$1 = 1 / 4;
  const TWO_QUARTERS$1 = ONE_HALF$1;
  const THREE_QUARTERS$1 = 3 / 4;
  const INVERSE30$1 = 1 / 30;
  const INVERSE60$1 = 1 / 60;
  const INVERSE255$2 = 1 / 255;
  /**
   * √2
   */
  const SQUARE_ROOT_TWO$1 = Math.SQRT2;
  /**
   * √(1 / 2) = 1 / √2 = √2 / 2
   */
  const SQUARE_ROOT_ONE_HALF$1 = Math.SQRT1_2;
  /**
   * √3
   */
  const SQUARE_ROOT_THREE$1 = Math.sqrt(3);
  /**
   * 1 / √2 = √(1 / 2) = √2 / 2
   */
  const ONE_OVER_SQUARE_ROOT_TWO$2 = SQUARE_ROOT_ONE_HALF$1;
  /**
   * 2 / √2 = √2
   */
  const TWO_OVER_SQUARE_ROOT_TWO$1 = SQUARE_ROOT_TWO$1;
  /**
   * 1 / √3
   */
  const ONE_OVER_SQUARE_ROOT_THREE$1 = 1 / SQUARE_ROOT_THREE$1;
  /**
   * 2 / √3
   */
  const TWO_OVER_SQUARE_ROOT_THREE$1 = 2 / SQUARE_ROOT_THREE$1;
  /**
   * √3 / 2
   */
  const SQUARE_ROOT_THREE_OVER_TWO$1 = SQUARE_ROOT_THREE$1 / 2;
  /**
   * √2 / 2 = √(1 / 2) = 1 / √2
   */
  const SQUARE_ROOT_TWO_OVER_TWO$1 = SQUARE_ROOT_ONE_HALF$1;

  const constants$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    E: E$1,
    LN10: LN10$1,
    LN2: LN2$1,
    LOG2E: LOG2E$1,
    LOG10E: LOG10E$1,
    ONE_HALF: ONE_HALF$1,
    ONE_THIRD: ONE_THIRD$1,
    TWO_THIRDS: TWO_THIRDS$1,
    ONE_QUARTER: ONE_QUARTER$1,
    TWO_QUARTERS: TWO_QUARTERS$1,
    THREE_QUARTERS: THREE_QUARTERS$1,
    INVERSE30: INVERSE30$1,
    INVERSE60: INVERSE60$1,
    INVERSE255: INVERSE255$2,
    SQUARE_ROOT_TWO: SQUARE_ROOT_TWO$1,
    SQUARE_ROOT_ONE_HALF: SQUARE_ROOT_ONE_HALF$1,
    SQUARE_ROOT_THREE: SQUARE_ROOT_THREE$1,
    ONE_OVER_SQUARE_ROOT_TWO: ONE_OVER_SQUARE_ROOT_TWO$2,
    TWO_OVER_SQUARE_ROOT_TWO: TWO_OVER_SQUARE_ROOT_TWO$1,
    ONE_OVER_SQUARE_ROOT_THREE: ONE_OVER_SQUARE_ROOT_THREE$1,
    TWO_OVER_SQUARE_ROOT_THREE: TWO_OVER_SQUARE_ROOT_THREE$1,
    SQUARE_ROOT_THREE_OVER_TWO: SQUARE_ROOT_THREE_OVER_TWO$1,
    SQUARE_ROOT_TWO_OVER_TWO: SQUARE_ROOT_TWO_OVER_TWO$1
  });

  const PI$1 = Math.PI;
  const TWO_PI$2 = 2 * PI$1;
  const HALF_PI$1 = PI$1 / 2;
  const THIRD_PI$1 = PI$1 / 3;
  const QUARTER_PI$1 = PI$1 / 4;
  const THREE_QUARTERS_PI$1 = 3 * QUARTER_PI$1;
  const SIN30$1 = ONE_HALF$1;
  const SIN45$1 = ONE_OVER_SQUARE_ROOT_TWO$2;
  const SIN60$1 = SQUARE_ROOT_THREE_OVER_TWO$1;
  const COS30$1 = SIN60$1;
  const COS45$1 = SIN45$1;
  const COS60$1 = SIN30$1;
  const DEGREES_TO_RADIANS$1 = TWO_PI$2 / 360;
  const RADIANS_TO_DEGREES$1 = 360 / TWO_PI$2;
  const createArray$1 = resolution => {
    const array = new Array(resolution);
    const interval = TWO_PI$2 / resolution;
    for (let i = 0; i < resolution; i += 1) array[i] = i * interval;
    return array;
  };
  const fromDegrees$1 = degrees => DEGREES_TO_RADIANS$1 * degrees;
  const toDegrees$1 = radians => RADIANS_TO_DEGREES$1 * radians;
  /**
   * Calculates the angle in radians from origin to `position`.
   * @param position
   * @return The angle. `0` if `position` is a zero vector.
   */
  const fromOrigin$1 = position => {
    const { x, y } = position;
    return x !== 0 || y !== 0 ? atan2$1(position.y, position.x) : 0;
  };
  /**
   * Calculates the angle in radians between two points.
   * @param from
   * @param to
   * @return The angle. `0` if both points are the same.
   */
  const betweenPoints$1 = (from, to) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    return dx !== 0 || dy !== 0 ? atan2$1(dy, dx) : 0;
  };
  /**
   * Calculates the angle in radians between two points.
   * @return The angle. `0` if both points are the same.
   */
  const betweenCoordinates$1 = (x1, y1, x2, y2) =>
    x1 !== x2 || y1 !== y2 ? atan2$1(x2 - x1, y2 - y1) : 0;

  const angle$3 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    PI: PI$1,
    TWO_PI: TWO_PI$2,
    HALF_PI: HALF_PI$1,
    THIRD_PI: THIRD_PI$1,
    QUARTER_PI: QUARTER_PI$1,
    THREE_QUARTERS_PI: THREE_QUARTERS_PI$1,
    SIN30: SIN30$1,
    SIN45: SIN45$1,
    SIN60: SIN60$1,
    COS30: COS30$1,
    COS45: COS45$1,
    COS60: COS60$1,
    DEGREES_TO_RADIANS: DEGREES_TO_RADIANS$1,
    RADIANS_TO_DEGREES: RADIANS_TO_DEGREES$1,
    createArray: createArray$1,
    fromDegrees: fromDegrees$1,
    toDegrees: toDegrees$1,
    fromOrigin: fromOrigin$1,
    betweenPoints: betweenPoints$1,
    betweenCoordinates: betweenCoordinates$1
  });

  const create$2$1 = (topLeftPosition, size) => {
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
  const containsPoint$1 = (region, point, margin) => {
    const { topLeft, rightBottom } = region;
    const { x, y } = point;
    return (
      x >= topLeft.x + margin &&
      y >= topLeft.y + margin &&
      x < rightBottom.x - margin &&
      y < rightBottom.y - margin
    );
  };
  const getWidth$1 = region => region.rightBottom.x - region.topLeft.x;
  const getHeight$1 = region => region.rightBottom.y - region.topLeft.y;
  const getSize$1 = region => {
    const { topLeft, rightBottom } = region;
    return {
      width: rightBottom.x - topLeft.x,
      height: rightBottom.y - topLeft.y
    };
  };
  const getCenterPoint$1 = region => {
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
  const createScaled$1 = (region, scaleFactor, originType) => {
    const { topLeft, rightBottom } = region;
    switch (originType) {
      case 0:
        return {
          topLeft,
          rightBottom: {
            x: lerp$1(topLeft.x, rightBottom.x, scaleFactor),
            y: lerp$1(topLeft.y, rightBottom.y, scaleFactor)
          }
        };
      case 1: {
        const center = getCenterPoint$1(region);
        const size = getSize$1(region);
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

  const rectangleRegion$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    create: create$2$1,
    containsPoint: containsPoint$1,
    getWidth: getWidth$1,
    getHeight: getHeight$1,
    getSize: getSize$1,
    getCenterPoint: getCenterPoint$1,
    createScaled: createScaled$1
  });

  /**
   * Calculates the aspect ratio i.e. `width / height`.
   * @param size
   */
  const getAspectRatio$1 = size => size.width / size.height;
  /**
   * Calculates the area i.e. `width * height`.
   * @param size
   */
  const getArea$1 = size => size.width * size.height;

  const rectangleSize$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    getAspectRatio: getAspectRatio$1,
    getArea: getArea$1
  });

  /**
   * Zero vector.
   */
  const zero$1 = {
    x: 0,
    y: 0
  };
  /**
   * Checks if a given vector is completely zero.
   * @param v
   * @return `true` if zero.
   */
  const isZero$1 = v => v.x === 0 && v.y === 0;
  /**
   * Creates a new vector from polar coordinates `angle` and `length`.
   * @param length
   * @param angle
   * @return new `Vector2D`.
   */
  const fromPolar$1 = (length, angle) => {
    return {
      x: length * cos$2(angle),
      y: length * sin$2(angle)
    };
  };
  /**
   * Creates a new vector by adding two vectors.
   * @param a
   * @param b
   * @return new `Vector2D`.
   */
  const add$1$1 = (a, b) => {
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
  const addCartesian$3 = (vector, x, y) => {
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
  const addPolar$3 = (vector, length, angle) => {
    return {
      x: vector.x + length * cos$2(angle),
      y: vector.y + length * sin$2(angle)
    };
  };
  /**
   * Creates a new vector by subtracting `b` from `a`.
   * @param a
   * @param b
   * @return new `Vector2D`.
   */
  const subtract$3 = (a, b) => {
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
  const subtractCartesian$3 = (vector, x, y) => {
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
  const subtractPolar$3 = (vector, length, angle) => {
    return {
      x: vector.x - length * cos$2(angle),
      y: vector.y - length * sin$2(angle)
    };
  };
  /**
   * Creates a new vector with multiplied values.
   * @param vector
   * @param multiplier
   * @return new `Vector2D`.
   */
  const multiply$3 = (vector, multiplier) => {
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
  const divide$3 = (vector, divisor) => {
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
  const distanceSquared$1 = (vectorA, vectorB) =>
    hypotenuseSquared2D$1(vectorB.x - vectorA.x, vectorB.y - vectorA.y);
  /**
   * Calculates distance between `vectorA` and `vectorB`.
   * @param vectorA
   * @param vectorB
   * @return Distance.
   */
  const distance$1 = (vectorA, vectorB) =>
    hypotenuse2D$1(vectorB.x - vectorA.x, vectorB.y - vectorA.y);
  /**
   * Returns string e.g. `{x:0,y:0}`
   * @param vector
   * @return String expression.
   */
  const toStr$1 = vector => `{x:${vector.x},y:${vector.y}}`;
  /**
   * Creates a new vector with same values.
   * @param vector
   */
  const copy$1 = vector => {
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
  const lengthSquared$1 = vector => hypotenuseSquared2D$1(vector.x, vector.y);
  /**
   * Calculates length of `vector`.
   * @param vector
   * @return The length.
   */
  const length$1 = vector => hypotenuse2D$1(vector.x, vector.y);
  /**
   * Calculates angle of `vector` in radians.
   * @param vector
   * @return The angle. `0` if `vector` is a zero vector.
   */
  const angle$1$1 = vector => {
    const { x, y } = vector;
    return x !== 0 || y !== 0 ? atan2$1(vector.y, vector.x) : 0;
  };

  const add$2$1 = (vector, otherVector) => {
    vector.x += otherVector.x;
    vector.y += otherVector.y;
    return vector;
  };
  const addCartesian$1$1 = (vector, x, y) => {
    vector.x += x;
    vector.y += y;
    return vector;
  };
  const addPolar$1$1 = (vector, length, angle) => {
    vector.x += length * cos$2(angle);
    vector.y += length * sin$2(angle);
    return vector;
  };
  const subtract$1$1 = (vector, otherVector) => {
    vector.x -= otherVector.x;
    vector.y -= otherVector.y;
    return vector;
  };
  const subtractCartesian$1$1 = (vector, x, y) => {
    vector.x -= x;
    vector.y -= y;
    return vector;
  };
  const subtractPolar$1$1 = (vector, length, angle) => {
    vector.x -= length * cos$2(angle);
    vector.y -= length * sin$2(angle);
    return vector;
  };
  const set$2 = (vector, sourceVector) => {
    vector.x = sourceVector.x;
    vector.y = sourceVector.y;
    return vector;
  };
  const setCartesian$2 = (vector, x, y) => {
    vector.x = x;
    vector.y = y;
    return vector;
  };
  const setPolar$2 = (vector, length, angle) => {
    vector.x = length * cos$2(angle);
    vector.y = length * sin$2(angle);
    return vector;
  };
  const multiply$1$1 = (vector, multiplier) => {
    vector.x *= multiplier;
    vector.y *= multiplier;
    return vector;
  };
  const divide$1$1 = (vector, divisor) => {
    vector.x /= divisor;
    vector.y /= divisor;
    return vector;
  };

  const mutable$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    add: add$2$1,
    addCartesian: addCartesian$1$1,
    addPolar: addPolar$1$1,
    subtract: subtract$1$1,
    subtractCartesian: subtractCartesian$1$1,
    subtractPolar: subtractPolar$1$1,
    set: set$2,
    setCartesian: setCartesian$2,
    setPolar: setPolar$2,
    multiply: multiply$1$1,
    divide: divide$1$1
  });

  const add$3$1 = (sourceA, sourceB, target) => {
    target.x = sourceA.x + sourceB.x;
    target.y = sourceA.y + sourceB.y;
    return target;
  };
  const addCartesian$2$1 = (source, x, y, target) => {
    target.x = source.x + x;
    target.y = source.y + y;
    return target;
  };
  const addPolar$2$1 = (source, length, angle, target) => {
    target.x = source.x + length * cos$2(angle);
    target.y = source.y + length * sin$2(angle);
    return target;
  };
  const subtract$2$1 = (sourceA, sourceB, target) => {
    target.x = sourceA.x - sourceB.x;
    target.y = sourceA.y - sourceB.y;
    return target;
  };
  const subtractCartesian$2$1 = (source, x, y, target) => {
    target.x = source.x - x;
    target.y = source.y - y;
    return target;
  };
  const subtractPolar$2$1 = (source, length, angle, target) => {
    target.x = source.x - length * cos$2(angle);
    target.y = source.y - length * sin$2(angle);
    return target;
  };
  const setCartesian$1$1 = (x, y, target) => {
    target.x = x;
    target.y = y;
    return target;
  };
  const setPolar$1$1 = (length, angle, target) => {
    target.x = length * cos$2(angle);
    target.y = length * sin$2(angle);
    return target;
  };
  const multiply$2$1 = (source, multiplier, target) => {
    target.x = source.x * multiplier;
    target.y = source.y * multiplier;
    return target;
  };
  const divide$2$1 = (source, divisor, target) => {
    target.x = source.x / divisor;
    target.y = source.y / divisor;
    return target;
  };

  const assign$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    add: add$3$1,
    addCartesian: addCartesian$2$1,
    addPolar: addPolar$2$1,
    subtract: subtract$2$1,
    subtractCartesian: subtractCartesian$2$1,
    subtractPolar: subtractPolar$2$1,
    setCartesian: setCartesian$1$1,
    setPolar: setPolar$1$1,
    multiply: multiply$2$1,
    divide: divide$2$1
  });

  const index$3 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Mutable: mutable$1,
    Assign: assign$1,
    zero: zero$1,
    isZero: isZero$1,
    fromPolar: fromPolar$1,
    add: add$1$1,
    addCartesian: addCartesian$3,
    addPolar: addPolar$3,
    subtract: subtract$3,
    subtractCartesian: subtractCartesian$3,
    subtractPolar: subtractPolar$3,
    multiply: multiply$3,
    divide: divide$3,
    distanceSquared: distanceSquared$1,
    distance: distance$1,
    toStr: toStr$1,
    copy: copy$1,
    lengthSquared: lengthSquared$1,
    length: length$1,
    angle: angle$1$1
  });

  const createCurve$1 = vertexPropertyList => {
    const paths = [];
    const len = vertexPropertyList.length;
    let previousVertex = vertexPropertyList[0];
    let previousControlLine = previousVertex.controlLine;
    for (let i = 1; i < len; i += 1) {
      const currentVertex = vertexPropertyList[i];
      const currentControlLine = currentVertex.controlLine;
      paths.push({
        controlPoint1: addPolar$3(
          previousVertex.point,
          0.5 * previousControlLine.length,
          previousControlLine.angle
        ),
        controlPoint2: subtractPolar$3(
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

  const bezier$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    createCurve: createCurve$1
  });

  /**
   * Creates an easing function that takes `start`, `end` and `ratio` as arguments.
   * @param easingFunction
   */
  const bind$1 = easingFunction => (start, end, ratio) =>
    start + easingFunction(ratio) * (end - start);
  /**
   * Concatenates two easing functions without normalization.
   * @param easingFunctionA
   * @param easingFunctionB
   * @param thresholdRatio
   * @return New easing function.
   */
  const concatenate$1 = (
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
  const integrate$1 = (
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
  const easeLinear$1 = ratio => ratio;
  /**
   * easeInQuad.
   * @param ratio
   */
  const easeInQuad$1 = square$1;
  /**
   * easeOutQuad.
   * @param ratio
   */
  const easeOutQuad$1 = ratio => -square$1(ratio - 1) + 1;
  /**
   * easeInCubic.
   * @param ratio
   */
  const easeInCubic$1 = cube$1;
  /**
   * easeOutCubic.
   * @param ratio
   */
  const easeOutCubic$1 = ratio => cube$1(ratio - 1) + 1;
  /**
   * easeInQuart.
   * @param ratio
   */
  const easeInQuart$1 = pow4$1;
  /**
   * easeOutQuart.
   * @param ratio
   */
  const easeOutQuart$1 = ratio => -pow4$1(ratio - 1) + 1;
  /**
   * Creates an easeOutBack function.
   * @param ratio
   */
  const createEaseOutBack$1 = (coefficient = 1.70158) => ratio => {
    const r = ratio - 1;
    return (coefficient + 1) * cube$1(r) + coefficient * square$1(r) + 1;
  };
  const easeInOutQuad$1 = integrate$1(easeInQuad$1, easeOutQuad$1);
  const easeOutInQuad$1 = integrate$1(easeOutQuad$1, easeInQuad$1);
  const easeInOutCubic$1 = integrate$1(easeInCubic$1, easeOutCubic$1);
  const easeOutInCubic$1 = integrate$1(easeOutCubic$1, easeInCubic$1);
  const easeInOutQuart$1 = integrate$1(easeInQuart$1, easeOutQuart$1);
  const easeOutInQuart$1 = integrate$1(easeOutQuart$1, easeInQuart$1);

  const easing$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    bind: bind$1,
    concatenate: concatenate$1,
    integrate: integrate$1,
    easeLinear: easeLinear$1,
    easeInQuad: easeInQuad$1,
    easeOutQuad: easeOutQuad$1,
    easeInCubic: easeInCubic$1,
    easeOutCubic: easeOutCubic$1,
    easeInQuart: easeInQuart$1,
    easeOutQuart: easeOutQuart$1,
    createEaseOutBack: createEaseOutBack$1,
    easeInOutQuad: easeInOutQuad$1,
    easeOutInQuad: easeOutInQuad$1,
    easeInOutCubic: easeInOutCubic$1,
    easeOutInCubic: easeOutInCubic$1,
    easeInOutQuart: easeInOutQuart$1,
    easeOutInQuart: easeOutInQuart$1
  });

  const { random: random$2 } = Math;
  /**
   * Returns random value from `0` up to (but not including) `max`.
   * @param max
   * @return A random value.
   */
  const value$1 = max => random$2() * max;
  /**
   * Returns random value from `0` to (but not including) `2 * PI`.
   * @return A random radians value.
   */
  const angle$2$1 = () => random$2() * TWO_PI$2;
  /**
   * Returns random value from `start` up to (but not including) `end`.
   * @param start
   * @param end
   * @return A random value.
   */
  const between$1 = (start, end) => start + random$2() * (end - start);
  /**
   * Returns random value from `range.start` up to (but not including) `range.end`.
   * @param range
   * @return A random value.
   */
  const inRange$1 = range => between$1(range.start, range.end);
  /**
   * Returns random integer from 0 up to (but not including) `maxInt`.
   * `maxInt` is not expected to be negative.
   * @param maxInt
   * @return A random integer value.
   */
  const integer$1 = maxInt => floor$1(random$2() * maxInt);
  /**
   * Returns random integer from `minInt` up to (but not including) `maxInt`.
   * The case where `minInt > maxInt` or `maxInt <= 0` is not expected.
   * @param minInt
   * @param maxInt
   * @return A random integer value.
   */
  const integerBetween$1 = (minInt, maxInt) =>
    minInt + floor$1(random$2() * (maxInt - minInt));
  /**
   * Returns `n` or `-n` randomly.
   * @param n Any number.
   * @return A random-signed value of `n`.
   */
  const signed$1 = n => (random$2() < 0.5 ? n : -n);
  /**
   * Returns one element of `array` randomly.
   * `array` is not expected to be empty.
   * @param array
   * @return A random element.
   */
  const fromArray$1$1 = array => array[integer$1(array.length)];
  /**
   * Removes and returns one element from `array` randomly.
   * `array` is not expected to be empty.
   * @param array
   * @return A random element.
   */
  const removeFromArray$1 = array =>
    array.splice(integer$1(array.length), 1)[0];
  /**
   * Returns `true` or `false` randomly.
   * @param probability A number between 0 and 1.
   * @return `true` with the given `probability`.
   */
  const bool$1 = probability => random$2() < probability;
  /**
   * Returns random value from `-absoluteValue` up to (but not including) `absoluteValue`.
   * @param absoluteValue
   * @return A random value.
   */
  const fromAbsolute$1 = absoluteValue =>
    -absoluteValue + random$2() * 2 * absoluteValue;
  /**
   * Returns a new vector with `length` and random angle.
   * @param length
   * @return New `Vector2D` unit.
   */
  const vector$1 = length => fromPolar$1(length, angle$2$1());
  /**
   * Returns a random point in `region`.
   * @param region
   * @return Random `Vector2D`.
   */
  const pointInRectangleRegion$1 = region => {
    const { topLeft, rightBottom } = region;
    return {
      x: between$1(topLeft.x, rightBottom.x),
      y: between$1(topLeft.y, rightBottom.y)
    };
  };

  const random$1$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    value: value$1,
    angle: angle$2$1,
    between: between$1,
    inRange: inRange$1,
    integer: integer$1,
    integerBetween: integerBetween$1,
    signed: signed$1,
    fromArray: fromArray$1$1,
    removeFromArray: removeFromArray$1,
    bool: bool$1,
    fromAbsolute: fromAbsolute$1,
    vector: vector$1,
    pointInRectangleRegion: pointInRectangleRegion$1
  });

  /**
   * Calculates the scale factor for fitting `nonScaledSize` to `targetSize` keeping the original aspect ratio.
   *
   * @param nonScaledSize
   * @param targetSize
   * @param fittingOption Defaults to `FIT_TO_BOX`.
   */
  const calculateScaleFactor$1 = (nonScaledSize, targetSize, fittingOption) => {
    switch (fittingOption) {
      default:
      case "FIT_TO_BOX":
        return min2$1(
          targetSize.width / nonScaledSize.width,
          targetSize.height / nonScaledSize.height
        );
      case "FIT_WIDTH":
        return targetSize.width / nonScaledSize.width;
      case "FIT_HEIGHT":
        return targetSize.height / nonScaledSize.height;
    }
  };

  const fitBox$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    calculateScaleFactor: calculateScaleFactor$1
  });

  /**
   * Finds HTML element by `id`. If not found, returns `document.body`.
   * @param id
   */
  const getElementOrBody$1 = id => document.getElementById(id) || document.body;
  /**
   * Returns the width and height of `node`.
   * If `node === document.body`, returns the inner width and height of `window`.
   * @param node
   */
  const getElementSize$1 = node =>
    node === document.body
      ? {
          width: window.innerWidth,
          height: window.innerHeight
        }
      : node.getBoundingClientRect();

  const htmlUtility$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    getElementOrBody: getElementOrBody$1,
    getElementSize: getElementSize$1
  });

  const emptyListener$1 = () => {};
  const create$3$1 = (
    duration,
    onProgress = emptyListener$1,
    onComplete = emptyListener$1
  ) => {
    return {
      duration,
      progressRatioChangeRate: 1 / duration,
      onProgress,
      onComplete,
      count: 0,
      progressRatio: 0,
      isCompleted: false
    };
  };
  const dummy$2 = create$3$1(0);
  const reset$2 = timerUnit => {
    timerUnit.count = 0;
    timerUnit.progressRatio = 0;
    timerUnit.isCompleted = false;
  };
  const step$3 = timerUnit => {
    if (timerUnit.isCompleted) return true;
    const { count, duration, progressRatioChangeRate } = timerUnit;
    if (count >= duration) {
      timerUnit.progressRatio = 1;
      timerUnit.onProgress(timerUnit);
      timerUnit.isCompleted = true;
      timerUnit.onComplete(timerUnit);
      return true;
    }
    timerUnit.onProgress(timerUnit);
    timerUnit.count += 1;
    timerUnit.progressRatio += progressRatioChangeRate;
    return false;
  };
  const addOnComplete$1 = (timerUnit, onComplete) => {
    const newUnit = Object.assign({}, timerUnit);
    const oldOnComplete = timerUnit.onComplete;
    newUnit.onComplete = () => {
      oldOnComplete(newUnit);
      onComplete(newUnit);
    };
    return newUnit;
  };

  const step$1$1 = chain => {
    step$3(chain.current);
    return chain.isCompleted;
  };
  const setUnitIndex$1 = (chain, index) => {
    chain.index = index;
    chain.current = chain.timers[index];
  };
  const reset$1$1 = chain => {
    loop$2(chain.timers, reset$2);
    setUnitIndex$1(chain, 0);
  };
  const next$1 = chain => {
    setUnitIndex$1(chain, chain.index + 1);
    return chain.current;
  };
  const create$4$1 = (timers, looped = false) => {
    let newChain;
    const newTimers = new Array(timers.length);
    const shift = () => next$1(newChain);
    const lastIndex = timers.length - 1;
    for (let i = 0; i < lastIndex; i += 1) {
      newTimers[i] = addOnComplete$1(timers[i], shift);
    }
    if (looped)
      newTimers[lastIndex] = addOnComplete$1(timers[lastIndex], () =>
        reset$1$1(newChain)
      );
    else
      newTimers[lastIndex] = addOnComplete$1(
        timers[lastIndex],
        () => (newChain.isCompleted = true)
      );
    newChain = {
      timers: newTimers,
      current: newTimers[0],
      index: 0,
      isCompleted: false
    };
    return newChain;
  };
  const dummy$1$1 = create$4$1([dummy$2]);

  const chain$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    step: step$1$1,
    setUnitIndex: setUnitIndex$1,
    reset: reset$1$1,
    next: next$1,
    create: create$4$1,
    dummy: dummy$1$1
  });

  const create$5$1 = capacity => create$8(capacity);
  const addTimer$1 = (timerSet, timer) => add$4(timerSet, () => step$3(timer));
  const addChain$1 = (timerSet, chain$1) =>
    add$4(timerSet, () => step$1$1(chain$1));
  const runStep$1 = step => step();
  const step$2$1 = timerSet => {
    removeShiftAll$1(timerSet, runStep$1);
  };
  const clear$2$1 = timerSet => clearReference$1(timerSet);
  /**
   * Creates a timer set instance and returns a set of bound functions.
   * @param capacity
   */
  const construct$1 = capacity => {
    const timerSet = create$5$1(capacity);
    return {
      addTimer: timer => addTimer$1(timerSet, timer),
      addChain: chain => addChain$1(timerSet, chain),
      step: () => step$2$1(timerSet),
      clear: () => clear$2$1(timerSet)
    };
  };

  const set$1$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    create: create$5$1,
    addTimer: addTimer$1,
    addChain: addChain$1,
    step: step$2$1,
    clear: clear$2$1,
    construct: construct$1
  });

  const index$1$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Chain: chain$1,
    Set: set$1$1,
    emptyListener: emptyListener$1,
    create: create$3$1,
    dummy: dummy$2,
    reset: reset$2,
    step: step$3,
    addOnComplete: addOnComplete$1
  });

  const morseCodeMap$1 = new Map([
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
  class Unit$1 {
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
  class On$1 extends Unit$1 {
    constructor(length, codeString) {
      super(true, length, codeString);
    }
  }
  class Off$1 extends Unit$1 {
    constructor(length, codeString) {
      super(false, length, codeString);
    }
  }
  const DIT$1 = new On$1(1, ".");
  const DAH$1 = new On$1(3, "-");
  const INTER_ELEMENT_GAP$1 = new Off$1(1, "");
  const SHORT_GAP$1 = new Off$1(3, " ");
  const MEDIUM_GAP$1 = new Off$1(7, " / ");
  const NUL$1 = new Off$1(0, "");
  function encode$1(sentence) {
    const upperCaseSentence = sentence.toUpperCase();
    const signals = [];
    let gap = undefined;
    for (let i = 0, len = upperCaseSentence.length; i < len; i += 1) {
      const character = upperCaseSentence.charAt(i);
      if (character === " ") {
        gap = MEDIUM_GAP$1;
        continue;
      } else if (character.charCodeAt(0) === 0) {
        if (gap) signals.push(gap);
        gap = undefined;
        signals.push(NUL$1);
        continue;
      }
      const code = morseCodeMap$1.get(character);
      if (!code) continue;
      for (let k = 0, kLen = code.length; k < kLen; k += 1) {
        if (gap) signals.push(gap);
        switch (code.charAt(k)) {
          case ".":
            signals.push(DIT$1);
            break;
          case "-":
          case "_":
            signals.push(DAH$1);
            break;
          default:
            continue;
        }
        gap = INTER_ELEMENT_GAP$1;
      }
      gap = SHORT_GAP$1;
    }
    return signals;
  }
  const toString$1 = signals =>
    signals.reduce((acc, cur) => acc + cur.codeString, "");
  const toBinaryString$1 = signals =>
    signals.reduce((acc, cur) => acc + cur.binaryString, "");
  const getTotalLength$1 = signals =>
    signals.reduce((acc, cur) => acc + cur.length, 0);

  const signal$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Unit: Unit$1,
    DIT: DIT$1,
    DAH: DAH$1,
    INTER_ELEMENT_GAP: INTER_ELEMENT_GAP$1,
    SHORT_GAP: SHORT_GAP$1,
    MEDIUM_GAP: MEDIUM_GAP$1,
    NUL: NUL$1,
    encode: encode$1,
    toString: toString$1,
    toBinaryString: toBinaryString$1,
    getTotalLength: getTotalLength$1
  });

  /**
   * Returns duration time per dot in milliseconds.
   * @param wpm - word (PARIS) per minute
   */
  function wpmToDotDuration$1(wpm) {
    return 1000 / (50 * (wpm / 60));
  }
  const create$6$1 = (on, off, wpm = 25, signals = [], loop = false) => {
    return {
      on,
      off,
      wpm,
      unitTime: wpmToDotDuration$1(wpm),
      loop,
      signals,
      index: 0,
      timeout: undefined
    };
  };
  const stop$1 = channel => {
    if (channel.timeout) {
      channel.off(NUL$1);
      clearTimeout(channel.timeout);
      channel.timeout = undefined;
    }
    channel.index = 0;
  };
  const runCurrentSignal$1 = channel => {
    const { unitTime, signals, index, on, off } = channel;
    const currentSignal = signals[index];
    if (currentSignal.isOn) on(currentSignal);
    else off(currentSignal);
    return unitTime * currentSignal.length;
  };
  const setNextRun$1 = (run, channel, ms) => {
    channel.timeout = setTimeout(() => {
      channel.timeout = undefined;
      run(channel);
    }, ms);
  };
  const run$1 = channel => {
    const currentSignalTimeLength = runCurrentSignal$1(channel);
    channel.index += 1;
    if (channel.index < channel.signals.length) {
      setNextRun$1(run$1, channel, currentSignalTimeLength);
      return;
    }
    channel.timeout = setTimeout(() => {
      if (channel.loop) {
        channel.off(NUL$1);
        channel.timeout = undefined;
      } else {
        channel.off(MEDIUM_GAP$1);
        setNextRun$1(run$1, channel, MEDIUM_GAP$1.length);
      }
    }, currentSignalTimeLength);
    channel.index = 0;
  };
  const start$1 = (channel, signals) => {
    stop$1(channel);
    if (signals) channel.signals = signals;
    run$1(channel);
  };

  const channel$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    wpmToDotDuration: wpmToDotDuration$1,
    create: create$6$1,
    stop: stop$1,
    start: start$1
  });

  const index$2$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Signal: signal$1,
    Channel: channel$1
  });

  const createQuantity$3 = (x, y, vx, vy) => {
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
  const updateEuler$3 = quantity => {
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
  const updateEulerAccelerated$1 = (quantity, ax, ay) => {
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
  const updateVerlet$3 = (quantity, ax, ay) => {
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
  const postUpdateVerlet$3 = (quantity, ax, ay) => {
    quantity.vx = quantity.vx2 + 0.5 * ax;
    quantity.vy = quantity.vy2 + 0.5 * ay;
  };
  /**
   * Assigns position values to `target` vector.
   * @param quantity
   * @param target
   * @return `target` vector with assigned position.
   */
  const positionVector$1 = (quantity, target) =>
    setCartesian$1$1(quantity.x, quantity.y, target);
  /**
   * Extracts velocity values to `target` vector.
   * @param quantity
   * @param target
   * @return `target` vector with assigned velocity.
   */
  const velocityVector$1 = (quantity, target) =>
    setCartesian$1$1(quantity.vx, quantity.vy, target);
  /**
   * Returns the speed.
   * @param quantity
   * @return The speed.
   */
  const getSpeed$1 = quantity => hypotenuse2D$1(quantity.vx, quantity.vy);
  /**
   * Returns the velocity angle.
   * @param quantity
   * @return The angle.
   */
  const getVelocityAngle$1 = quantity => atan2safe$1(quantity.vy, quantity.vx);
  /**
   * Truncates the speed (magnitude of velocity) if it is greater than `maxSpeed`.
   * @param quantity
   * @param maxSpeed
   * @return The `quantity` instance with truncated velocity values.
   */
  const truncateVelocity$1 = (quantity, maxSpeed) => {
    const { vx, vy } = quantity;
    if (hypotenuseSquared2D$1(vx, vy) <= maxSpeed * maxSpeed) return quantity;
    const angle = atan2$1(vy, vx);
    quantity.vx = maxSpeed * cos$2(angle);
    quantity.vy = maxSpeed * sin$2(angle);
    return quantity;
  };
  /**
   * Set values of `velocity` to `quantity`.
   * @param quantity
   * @param velocity
   * @return The `quantity` instance with assigned velocity.
   */
  const setVelocity$1 = (quantity, velocity) => {
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
  const setVelocityCartesian$1 = (quantity, vx, vy) => {
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
  const setVelocityPolar$1 = (quantity, length, angle) => {
    quantity.vx = length * cos$2(angle);
    quantity.vy = length * sin$2(angle);
    return quantity;
  };
  /**
   * Let `quantity` bounce if it is out of `region`.
   * @param region
   * @param coefficientOfRestitution
   * @param quantity
   * @return `true` if bounced.
   */
  const bounceInRectangleRegion$1 = (
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

  const kinematics$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    createQuantity: createQuantity$3,
    updateEuler: updateEuler$3,
    updateEulerAccelerated: updateEulerAccelerated$1,
    updateVerlet: updateVerlet$3,
    postUpdateVerlet: postUpdateVerlet$3,
    positionVector: positionVector$1,
    velocityVector: velocityVector$1,
    getSpeed: getSpeed$1,
    getVelocityAngle: getVelocityAngle$1,
    truncateVelocity: truncateVelocity$1,
    setVelocity: setVelocity$1,
    setVelocityCartesian: setVelocityCartesian$1,
    setVelocityPolar: setVelocityPolar$1,
    bounceInRectangleRegion: bounceInRectangleRegion$1
  });

  const createQuantity$1$1 = (x, y, vx, vy) => {
    return {
      x,
      y,
      vx: vx || 0,
      vy: vy || 0,
      fx: 0,
      fy: 0
    };
  };
  const createVerletQuantity$2 = (x, y, vx, vy) => {
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
  const updateEuler$1$1 = quantity => {
    updateEulerAccelerated$1(quantity, quantity.fx, quantity.fy);
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
  const updateVerlet$1$1 = quantity => {
    updateVerlet$3(quantity, quantity.fx, quantity.fy);
    quantity.fx = 0;
    quantity.fy = 0;
  };
  /**
   * Completes updating the kinematic quantity by Velocity Verlet method after updating the force.
   *
   * Not sure if this implementation is correct!
   * @param quantity
   */
  const postUpdateVerlet$1$1 = quantity => {
    postUpdateVerlet$3(quantity, quantity.fx, quantity.fy);
    quantity.fx = 0;
    quantity.fy = 0;
  };
  /**
   * Extracts force values to `target` vector.
   * @param quantity
   * @param target
   * @return `target` vector with assigned acceleration.
   */
  const forceVector$1 = (quantity, target) =>
    setCartesian$1$1(quantity.fx, quantity.fy, target);
  /**
   * Truncates the magnitude of force if it is greater than `maxMagnitude`.
   * @param quantity
   * @param maxSpeed
   * @return The `quantity` instance with truncated force values.
   */
  const truncateForce$1 = (quantity, maxMagnitude) => {
    const { fx, fy } = quantity;
    if (hypotenuseSquared2D$1(fx, fy) <= maxMagnitude * maxMagnitude)
      return quantity;
    const angle = atan2$1(fy, fx);
    quantity.fx = maxMagnitude * cos$2(angle);
    quantity.fy = maxMagnitude * sin$2(angle);
    return quantity;
  };
  /**
   * Adds `force` to `quantity`.
   * @param quantity
   * @param force
   * @return The `quantity` instance with assigned force.
   */
  const addForce$1 = (quantity, force) => {
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
  const addForceCartesian$1 = (quantity, fx, fy) => {
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
  const addForcePolar$1 = (quantity, magnitude, angle) => {
    quantity.fx += magnitude * cos$2(angle);
    quantity.fy += magnitude * sin$2(angle);
    return quantity;
  };

  const simpleDynamics$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    createQuantity: createQuantity$1$1,
    createVerletQuantity: createVerletQuantity$2,
    updateEuler: updateEuler$1$1,
    updateVerlet: updateVerlet$1$1,
    postUpdateVerlet: postUpdateVerlet$1$1,
    forceVector: forceVector$1,
    truncateForce: truncateForce$1,
    addForce: addForce$1,
    addForceCartesian: addForceCartesian$1,
    addForcePolar: addForcePolar$1
  });

  const createQuantity$2$1 = (x, y, mass, vx, vy) => {
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
  const createVerletQuantity$1$1 = (x, y, mass, vx, vy) => {
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
  const updateEuler$2$1 = quantity => {
    const { mass } = quantity;
    updateEulerAccelerated$1(quantity, quantity.fx / mass, quantity.fy / mass);
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
  const updateVerlet$2$1 = quantity => {
    const { mass } = quantity;
    updateVerlet$3(quantity, quantity.fx / mass, quantity.fy / mass);
    quantity.fx = 0;
    quantity.fy = 0;
  };
  /**
   * Completes updating the kinematic quantity by Velocity Verlet method after updating the force.
   *
   * Not sure if this implementation is correct!
   * @param quantity
   */
  const postUpdateVerlet$2$1 = quantity => {
    const { mass } = quantity;
    postUpdateVerlet$3(quantity, quantity.fx / mass, quantity.fy / mass);
    quantity.fx = 0;
    quantity.fy = 0;
  };

  const dynamics$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    createQuantity: createQuantity$2$1,
    createVerletQuantity: createVerletQuantity$1$1,
    updateEuler: updateEuler$2$1,
    updateVerlet: updateVerlet$2$1,
    postUpdateVerlet: postUpdateVerlet$2$1
  });

  let constant$1 = 1;
  let minusConstant$1 = -constant$1;
  const setConstant$1 = value => {
    constant$1 = value;
    minusConstant$1 = -constant$1;
  };
  /**
   * Calculates gravitation force.
   * @param attractedRelative Relative position from attractor to attracted.
   * @param massProduct Pre-calcultad product of mass of attractor and attracted.
   * @param distance Pre-calculated distance.
   * @param target Vector to assign the result.
   * @return The `target` vector with assigned gravitation force.
   */
  const calculateCore$1 = (attractedRelative, massProduct, distance, target) =>
    multiply$2$1(
      attractedRelative,
      (minusConstant$1 * massProduct) / (distance * distance * distance),
      target
    );
  /**
   * Calculates gravitation force applied on point mass `attracted` exerted by point mass `attractor`.
   * @param attractor Object that has `x`, `y` and `mass`.
   * @param attracted Object that has `x`, `y` and `mass`.
   * @param target Vector to assign the result.
   * @return The `target` vector with assigned gravitation force.
   */
  const calculate$1 = (attractor, attracted, target) =>
    calculateCore$1(
      subtract$2$1(attracted, attractor, target),
      attractor.mass * attracted.mass,
      distance$1(attractor, attracted),
      target
    );
  /**
   * Calculates gravitation force, assuming that the mass is always `1`.
   * @param attractedRelative Relative position from attractor to attracted.
   * @param distance Pre-calculated distance.
   * @param target Vector to assign the result.
   * @return The `target` vector with assigned gravitation force.
   */
  const calculateCoreSimple$1 = (attractedRelative, distance, target) =>
    multiply$2$1(
      attractedRelative,
      minusConstant$1 / (distance * distance * distance),
      target
    );
  /**
   * Calculates gravitation force applied on point `attracted` exerted by point `attractor`, assuming that the mass is always `1`.
   * @param attractor
   * @param attracted
   * @param target Vector to assign the result.
   * @return The `target` vector with assigned gravitation force.
   */
  const calculateSimple$1 = (attractor, attracted, target) =>
    calculateCoreSimple$1(
      subtract$2$1(attracted, attractor, target),
      distance$1(attractor, attracted),
      target
    );
  /**
   * Adds gravitation force between `bodyA` and `bodyB`.
   * @param bodyA
   * @param bodyB
   * @param forceOnBodyB
   */
  const addForceEachOther$1 = (bodyA, bodyB, forceOnBodyB) => {
    const { x: forceX, y: forceY } = forceOnBodyB;
    bodyA.fx -= forceX;
    bodyA.fy -= forceY;
    bodyB.fx += forceX;
    bodyB.fy += forceY;
  };
  const temporalGravitation$1 = { x: 0, y: 0 };
  /**
   * Set of functions that calculate gravitation force and apply it on the body.
   */
  const attract$1 = {
    /**
     * Calculates gravitation force using pre-calculated values and applies it on `attracted`.
     * @param attracted
     * @param attractedRelative The relative position from the attractor to `attracted`.
     * @param massProduct The pre-calculated product of mass of the attractor and `attracted`
     * @param distance The pre-calculated distance between the attractor and `attracted`.
     */
    precalculated: (attracted, attractedRelative, massProduct, distance) =>
      addForce$1(
        attracted,
        calculateCore$1(
          attractedRelative,
          massProduct,
          distance,
          temporalGravitation$1
        )
      ),
    /**
     * Calculates gravitation force and applies it on `attracted`.
     */
    calculate: (attractor, attracted) =>
      addForce$1(
        attracted,
        calculate$1(attractor, attracted, temporalGravitation$1)
      ),
    /**
     * Calculates gravitation force using pre-calculated distance and applies it on `attracted`,
     * assuming that the mass is always `1`.
     * @param attracted
     * @param attractedRelative The relative position from the attractor to `attracted`.
     * @param distance The pre-calculated distance between the attractor and `attracted`.
     */
    precalculatedSimple: (attracted, attractedRelative, distance) =>
      addForce$1(
        attracted,
        calculateCoreSimple$1(
          attractedRelative,
          distance,
          temporalGravitation$1
        )
      ),
    /**
     * Calculates gravitation force and applies it on `attracted`,
     * assuming that the mass is always `1`.
     */
    calculateSimple: (attractor, attracted) =>
      addForce$1(
        attracted,
        calculateSimple$1(attractor, attracted, temporalGravitation$1)
      )
  };
  /**
   * Set of functions that calculate gravitation force and apply it on both bodies.
   */
  const attractEachOther$1 = {
    /**
     * Calculates gravitation force using pre-calculated values and applies it on both `bodyA` and `bodyB`.
     * @param bodyA
     * @param bodyB
     * @param bodyBRelative The relative position from `bodyA` to `bodyB`.
     * @param massProduct The pre-calculated product of mass of `bodyA` and `bodyB`
     * @param distance The pre-calculated distance between `bodyA` and `bodyB`.
     */
    precalculated: (bodyA, bodyB, bodyBRelative, massProduct, distance) =>
      addForceEachOther$1(
        bodyA,
        bodyB,
        calculateCore$1(
          bodyBRelative,
          massProduct,
          distance,
          temporalGravitation$1
        )
      ),
    /**
     * Calculates gravitation force and applies it on both `bodyA` and `bodyB`.
     */
    calculate: (bodyA, bodyB) =>
      addForceEachOther$1(
        bodyA,
        bodyB,
        calculate$1(bodyA, bodyB, temporalGravitation$1)
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
      addForceEachOther$1(
        bodyA,
        bodyB,
        calculateCoreSimple$1(bodyBRelative, distance, temporalGravitation$1)
      ),
    /**
     * Calculates gravitation force and applies it on both `bodyA` and `bodyB`,
     * assuming that the mass is always `1`.
     */
    calculateSimple: (bodyA, bodyB) =>
      addForceEachOther$1(
        bodyA,
        bodyB,
        calculateSimple$1(bodyA, bodyB, temporalGravitation$1)
      )
  };

  const gravitation$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    get constant() {
      return constant$1;
    },
    setConstant: setConstant$1,
    calculateCore: calculateCore$1,
    calculate: calculate$1,
    calculateCoreSimple: calculateCoreSimple$1,
    calculateSimple: calculateSimple$1,
    attract: attract$1,
    attractEachOther: attractEachOther$1
  });

  /**
   * Updates rotation by adding `rotationVelocity` to `rotationAngle`.
   * @param quantity
   */
  const update$2 = quantity => {
    quantity.rotationAngle += quantity.rotationVelocity;
  };
  /**
   * Creates a new rotation quantity with random initial angle, random rotation direction and
   * random rotational speed within the given range.
   * @param minRotationSpeed
   * @param maxRotationSpeed
   * @return New `Rotation.Quantity`.
   */
  const createRandomQuantity$1 = (minRotationSpeed, maxRotationSpeed) => {
    return {
      rotationAngle: angle$2$1(),
      rotationVelocity: signed$1(between$1(minRotationSpeed, maxRotationSpeed))
    };
  };

  const rotation$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    update: update$2,
    createRandomQuantity: createRandomQuantity$1
  });

  /**
   * Creates an array of HSV values with random hue ∈ [0, 360].
   * @param saturation
   * @param value
   * @return New array of HSV values.
   */
  const withRandomHue$1 = (saturation, value$1$1) => [
    value$1(360),
    saturation,
    value$1$1
  ];
  /**
   * Converts HSV values (hue ∈ [0, 360], saturation ∈ [0, 1] and value ∈ [0, 1])
   * to RGB values (red, green, blue ∈ [0, 1]).
   * @param hsvValues
   * @return New array of RGB values.
   */
  const toRGB$1 = hsvValues => {
    const [hue, saturation, value] = hsvValues;
    const c = value * saturation;
    const dividedHue = hue * INVERSE60$1;
    const x = c * (1 - abs$1((dividedHue % 2) - 1));
    let tmpValues;
    switch (floor$1(dividedHue)) {
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

  const hsv$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    withRandomHue: withRandomHue$1,
    toRGB: toRGB$1
  });

  const CCC$1 = /*#__PURE__*/ Object.freeze({
    Angle: angle$3,
    ArrayList: arrayList$1,
    ArrayUtility: arrayUtility$1,
    Bezier: bezier$1,
    Dynamics: dynamics$1,
    Easing: easing$1,
    FitBox: fitBox$1,
    Gravitation: gravitation$1,
    HSV: hsv$1,
    HtmlUtility: htmlUtility$1,
    Kinematics: kinematics$1,
    Lazy: lazy$1,
    MathConstants: constants$1,
    MorseCode: index$2$1,
    Numeric: numeric$1,
    Random: random$1$1,
    RectangleRegion: rectangleRegion$1,
    RectangleSize: rectangleSize$1,
    Rotation: rotation$1,
    SimpleDynamics: simpleDynamics$1,
    StructureOfArrays: structureOfArrays$1,
    Timer: index$1$1,
    Vector2D: index$3
  });

  /**
   * The id of the HTML element to which the canvas should belong.
   */
  const HTML_ELEMENT_ID = "Contours";
  /**
   * The HTML element to which the canvas should belong.
   */
  const HTML_ELEMENT = htmlUtility$1.getElementOrBody(HTML_ELEMENT_ID);
  /**
   * The logical size of the canvas.
   */
  const LOGICAL_CANVAS_SIZE = {
    width: 800,
    height: 800
  };

  const {
    ArrayUtility: ArrayUtility$1,
    Vector2D: Vector2D$1,
    ArrayList: ArrayList$1,
    Numeric: Numeric$1,
    Random: Random$1,
    Angle: Angle$1,
    Kinematics,
    SimpleDynamics,
    Rotation,
    Gravitation,
    RectangleRegion: RectangleRegion$1
  } = CCC$1;
  const { onSetup: onSetup$1, Mouse } = p5ex;
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

  let maxForceMagnitude = 0;
  const setMaxForceMagnitude = value => {
    maxForceMagnitude = value;
  };
  const DRAG_COEFFICIENT = 0.3;
  const VERTEX_COUNT = 6;
  const VERTEX_MIN_DISTANCE = 10;
  const VERTEX_MAX_DISTANCE_NOISE = 150;
  const DEFAULT_DELTA_TIME = 0.01;
  const DELTA_TIME_DECAY = 0.9;
  const unitVectors = Angle$1.createArray(VERTEX_COUNT).map(angle =>
    Vector2D$1.fromPolar(1, angle)
  );
  const { square: square$2 } = Numeric$1;
  const createVertexDistanceFunction = () => {
    const offset = Random$1.value(256);
    return t =>
      VERTEX_MIN_DISTANCE +
      VERTEX_MAX_DISTANCE_NOISE * square$2(p$1.noise(offset + t));
  };
  /**
   * Creates a `Contour` unit.
   * Set `colorMode(HSB, 360, 1, 1, 1)` before using this function.
   * @return New `Contour` instance.
   */
  const create$9 = () => {
    const position = Random$1.pointInRectangleRegion(canvas$1.logicalRegion);
    const velocity = Random$1.vector(5);
    return Object.assign(
      Object.assign(
        {},
        SimpleDynamics.createVerletQuantity(
          position.x,
          position.y,
          velocity.x,
          velocity.y
        )
      ),
      {
        rotationAngle: Random$1.angle(),
        rotationVelocity: 0,
        rotationFactor: Random$1.signed(1),
        vertexDistance: ArrayUtility$1.createPopulated(
          createVertexDistanceFunction,
          VERTEX_COUNT
        ),
        color: p$1.color(Random$1.value(360), 1, 1, 0.6),
        time: 0,
        deltaTime: DEFAULT_DELTA_TIME
      }
    );
  };
  let bounce;
  onSetup$1.push(() => {
    bounce = Kinematics.bounceInRectangleRegion.bind(
      undefined,
      canvas$1.logicalRegion,
      0.7
    );
  });
  const applyDrag = contour => {
    SimpleDynamics.addForceCartesian(
      contour,
      -DRAG_COEFFICIENT * contour.vx,
      -DRAG_COEFFICIENT * contour.vy
    );
    SimpleDynamics.addForcePolar(
      contour,
      Random$1.value(0.5),
      Random$1.angle()
    );
  };
  const update$3 = contour => {
    SimpleDynamics.updateVerlet(contour);
    Rotation.update(contour);
  };
  const postUpdate = contour => {
    const speed = Kinematics.getSpeed(contour);
    SimpleDynamics.truncateForce(contour, maxForceMagnitude);
    SimpleDynamics.postUpdateVerlet(contour);
    if (bounce(contour)) {
      if (speed > 5) contour.deltaTime += 1;
    }
    contour.rotationVelocity = contour.rotationFactor * speed * 0.01;
    const { deltaTime } = contour;
    const additionalDeltaTime = speed * 0.005;
    contour.time += deltaTime + additionalDeltaTime;
    contour.deltaTime =
      DEFAULT_DELTA_TIME + DELTA_TIME_DECAY * (deltaTime - DEFAULT_DELTA_TIME);
  };
  const draw = contour => {
    const { x, y, rotationAngle, vertexDistance, time } = contour;
    p$1.stroke(contour.color);
    p$1.translate(x, y);
    p$1.rotate(rotationAngle);
    p$1.beginShape();
    const len = VERTEX_COUNT + 3;
    for (let i = 0; i < len; i += 1) {
      const index = i % VERTEX_COUNT;
      const distance = vertexDistance[index](time);
      const unitVector = unitVectors[index];
      p$1.curveVertex(distance * unitVector.x, distance * unitVector.y);
    }
    p$1.endShape();
    p$1.rotate(-rotationAngle);
    p$1.translate(-x, -y);
  };
  const activate = contour => {
    contour.deltaTime += 20;
    SimpleDynamics.addForcePolar(contour, 100, Random$1.angle());
  };

  const contours = ArrayList$1.create(256);
  const reset$3 = () => {
    p$1.push();
    p$1.colorMode(p$1.HSB, 360, 1, 1, 1);
    ArrayList$1.clearReference(contours);
    for (let i = 0; i < 16; i += 1) ArrayList$1.add(contours, create$9());
    p$1.pop();
  };
  const attractToMouse = Gravitation.attract.calculateSimple.bind(
    undefined,
    Mouse.logicalPosition
  );
  const applyForce = contour => {
    attractToMouse(contour);
    applyDrag(contour);
  };
  const update$4 = () => {
    ArrayList$1.loop(contours, update$3);
    ArrayList$1.loop(contours, applyForce);
    ArrayList$1.loop(contours, postUpdate);
  };
  const draw$1 = () => {
    p$1.blendMode(p$1.DIFFERENCE);
    p$1.stroke(192);
    p$1.strokeWeight(6);
    p$1.noFill();
    ArrayList$1.loop(contours, draw);
  };
  const gather = () => {
    Gravitation.setConstant(1000000);
    setMaxForceMagnitude(3);
  };
  const release = () => {
    Gravitation.setConstant(100000);
    setMaxForceMagnitude(0.5);
    ArrayList$1.loop(contours, activate);
  };
  release();

  const {
    startSketch: startSketch$1,
    createPixels: createPixels$1,
    replaceCanvasPixels: replaceCanvasPixels$1,
    pauseOrResume: pauseOrResume$1
  } = p5ex;
  let drawBackground;
  let cursorColor;
  const reset$4 = reset$3;
  const initialize = () => {
    const backgroundPixels = createPixels$1(() => {
      canvas$1.drawScaled(() => {
        const { width, height } = LOGICAL_CANVAS_SIZE;
        const g = p$1.createGraphics(width / 4, height / 4);
        g.background(236, 232, 240);
        g.noStroke();
        g.fill(253, 252, 255);
        g.ellipse(g.width / 2, g.height / 2, g.width, g.height);
        g.filter(p$1.BLUR, 10);
        p$1.image(g, 0, 0, width, height);
      });
    });
    drawBackground = () => replaceCanvasPixels$1(backgroundPixels);
    cursorColor = p$1.color(96);
    Mouse.setCenter();
    reset$4();
  };
  const drawCursor = Mouse.drawAtCursor.bind(undefined, () => {
    const pressed = p$1.mouseIsPressed;
    if (pressed) p$1.rotate(0.1 * p$1.frameCount);
    const halfSize = pressed ? 30 : 20;
    p$1.stroke(cursorColor);
    p$1.strokeWeight(pressed ? 10 : 6);
    p$1.line(-halfSize, 0, halfSize, 0);
    p$1.line(0, -halfSize, 0, halfSize);
    if (pressed) p$1.rotate(-0.1 * p$1.frameCount);
  });
  const drawSketch = () => {
    draw$1();
    drawCursor();
  };
  const draw$2 = () => {
    update$4();
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
  const mouseIsOnCanvas = () =>
    RectangleRegion$1.containsPoint(
      canvas$1.logicalRegion,
      Mouse.logicalPosition,
      0
    );
  const mousePressed = () => {
    gather();
    if (mouseIsOnCanvas()) return false;
  };
  const setP5Methods = p => {
    p.draw = draw$2;
    p.keyTyped = keyTyped;
    p.mouseMoved = Mouse.updatePosition;
    p.mouseDragged = Mouse.updatePosition;
    p.mousePressed = mousePressed;
    p.mouseReleased = release;
  };
  startSketch$1({
    htmlElement: HTML_ELEMENT,
    logicalCanvasSize: LOGICAL_CANVAS_SIZE,
    initialize,
    setP5Methods,
    fittingOption: undefined
  });
})(p5);
//# sourceMappingURL=sketch.js.map
