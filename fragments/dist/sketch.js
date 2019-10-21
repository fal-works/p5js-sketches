/**
 * Fragments.
 * Source code in TypeScript: https://github.com/fal-works/p5js-sketches/tree/master/fragments
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
   * @version 0.1.8
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
    for (let i = 0; i < len; i += 1) array[i] = factory();
    return array;
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
    populate: populate
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
  const createPopulated = (size, factory) => {
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

  const arrayList = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    create: create,
    createFilled: createFilled,
    createPopulated: createPopulated,
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
    populate: populate$1
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

  const sq = v => v * v;
  const cubic = v => v * v * v;
  const PI = Math.PI;
  const HALF_PI = PI / 2;
  const TWO_PI = 2 * PI;
  const nearlyEqual = (a, b) => Math.abs(a - b) < 0.0000000000001;

  const math = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    sq: sq,
    cubic: cubic,
    PI: PI,
    HALF_PI: HALF_PI,
    TWO_PI: TWO_PI,
    nearlyEqual: nearlyEqual
  });

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
      x: length * Math.cos(angle),
      y: length * Math.sin(angle)
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
      x: vector.x + length * Math.cos(angle),
      y: vector.y + length * Math.sin(angle)
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
      x: vector.x - length * Math.cos(angle),
      y: vector.y - length * Math.sin(angle)
    };
  };
  const distanceSquared = (vectorA, vectorB) =>
    sq(vectorB.x - vectorA.x) + sq(vectorB.y - vectorA.y);
  const distance = (vectorA, vectorB) =>
    Math.sqrt(distanceSquared(vectorA, vectorB));
  const toStr = vector => `{x:${vector.x},y:${vector.y}}`;
  const copy = vector => {
    return {
      x: vector.x,
      y: vector.y
    };
  };

  const vector2d = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    zero: zero,
    isZero: isZero,
    fromPolar: fromPolar,
    add: add$1,
    addCartesian: addCartesian,
    addPolar: addPolar,
    subtract: subtract,
    subtractCartesian: subtractCartesian,
    subtractPolar: subtractPolar,
    distanceSquared: distanceSquared,
    distance: distance,
    toStr: toStr,
    copy: copy
  });

  const DEGREES_TO_RADIANS_FACTOR = TWO_PI / 360;
  const RADIANS_TO_DEGREES_FACTOR = 360 / TWO_PI;
  const createArray = resolution => {
    const array = new Array(resolution);
    const interval = TWO_PI / resolution;
    for (let i = 0; i < resolution; i += 1) array[i] = i * interval;
    return array;
  };
  const fromDegrees = degrees => DEGREES_TO_RADIANS_FACTOR * degrees;
  const toDegrees = radians => RADIANS_TO_DEGREES_FACTOR * radians;
  /**
   * Calculates the angle in radians from origin to `position`.
   * @param position
   * @return The angle. `0` if `position` is a zero vector.
   */
  const fromOrigin = position =>
    isZero(position) ? 0 : Math.atan2(position.y, position.x);
  /**
   * Calculates the angle in radians between two points.
   * @param from
   * @param to
   * @return The angle. `0` if both points are the same.
   */
  const between = (from, to) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    if (dx === 0 && dy === 0) return 0;
    return Math.atan2(dy, dx);
  };

  const angle = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    createArray: createArray,
    fromDegrees: fromDegrees,
    toDegrees: toDegrees,
    fromOrigin: fromOrigin,
    between: between
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

  const rectangleRegion = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    create: create$2,
    containsPoint: containsPoint
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

  const add$2 = (vector, sourceVector) => {
    vector.x += sourceVector.x;
    vector.y += sourceVector.y;
    return vector;
  };
  const addCartesian$1 = (vector, x, y) => {
    vector.x += x;
    vector.y += y;
    return vector;
  };
  const addPolar$1 = (vector, length, angle) => {
    vector.x += length * Math.cos(angle);
    vector.y += length * Math.sin(angle);
    return vector;
  };
  const subtract$1 = (vector, sourceVector) => {
    vector.x -= sourceVector.x;
    vector.y -= sourceVector.y;
    return vector;
  };
  const subtractCartesian$1 = (vector, x, y) => {
    vector.x -= x;
    vector.y -= y;
    return vector;
  };
  const subtractPolar$1 = (vector, length, angle) => {
    vector.x -= length * Math.cos(angle);
    vector.y -= length * Math.sin(angle);
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
    vector.x = length * Math.cos(angle);
    vector.y = length * Math.sin(angle);
    return vector;
  };

  const vector2dMutable = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    add: add$2,
    addCartesian: addCartesian$1,
    addPolar: addPolar$1,
    subtract: subtract$1,
    subtractCartesian: subtractCartesian$1,
    subtractPolar: subtractPolar$1,
    set: set,
    setCartesian: setCartesian,
    setPolar: setPolar
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
  const easeInQuad = sq;
  /**
   * easeOutQuad.
   * @param ratio
   */
  const easeOutQuad = ratio => -sq(ratio - 1) + 1;
  /**
   * easeInCubic.
   * @param ratio
   */
  const easeInCubic = cubic;
  /**
   * easeOutCubic.
   * @param ratio
   */
  const easeOutCubic = ratio => cubic(ratio - 1) + 1;
  /**
   * easeInQuart.
   * @param ratio
   */
  const easeInQuart = ratio => Math.pow(ratio, 4);
  /**
   * easeOutQuart.
   * @param ratio
   */
  const easeOutQuart = ratio => -Math.pow(ratio - 1, 4) + 1;
  /**
   * Creates an easeOutBack function.
   * @param ratio
   */
  const createEaseOutBack = (coefficient = 1.70158) => ratio => {
    const r = ratio - 1;
    return (coefficient + 1) * cubic(r) + coefficient * sq(r) + 1;
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

  /**
   * Returns random value from `0` up to (but not including) `max`.
   * @param max
   * @return A random value.
   */
  const value = max => Math.random() * max;
  /**
   * Returns random value from `0` to (but not including) `2 * PI`.
   * @return A random radians value.
   */
  const angle$1 = () => Math.random() * TWO_PI;
  /**
   * Returns random value from `start` up to (but not including) `end`.
   * @param start
   * @param end
   * @return A random value.
   */
  const between$1 = (start, end) => start + Math.random() * (end - start);
  /**
   * Returns random value from `range.start` up to (but not including) `range.end`.
   * @param range
   * @return A random value.
   */
  const inRange = range => between$1(range.start, range.end);
  /**
   * Returns random integer from 0 up to (but not including) `maxInt`.
   * `maxInt` is not expected to be negative.
   * @param maxInt
   * @return A random integer value.
   */
  const integer = maxInt => Math.floor(Math.random() * maxInt);
  /**
   * Returns random integer from `minInt` up to (but not including) `maxInt`.
   * The case where `minInt > maxInt` is not expected.
   * @param minInt
   * @param maxInt
   * @return A random integer value.
   */
  const integerBetween = (minInt, maxInt) => minInt + integer(maxInt - minInt);
  /**
   * Returns `n` or `-n` randomly.
   * @param n Any number.
   * @return A random-signed value of `n`.
   */
  const signed = n => (Math.random() < 0.5 ? n : -n);
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
  const bool = probability => Math.random() < probability;

  const random = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    value: value,
    angle: angle$1,
    between: between$1,
    inRange: inRange,
    integer: integer,
    integerBetween: integerBetween,
    signed: signed,
    fromArray: fromArray$1,
    removeFromArray: removeFromArray,
    bool: bool
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
        return Math.min(
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

  const set$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    create: create$5,
    addTimer: addTimer,
    addChain: addChain,
    step: step$2,
    clear: clear$2
  });

  const index = /*#__PURE__*/ Object.freeze({
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

  const index$1 = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    Signal: signal,
    Channel: channel
  });

  const CCC = /*#__PURE__*/ Object.freeze({
    Angle: angle,
    ArrayList: arrayList,
    ArrayUtility: arrayUtility,
    Bezier: bezier,
    Easing: easing,
    FitBox: fitBox,
    HtmlUtility: htmlUtility,
    Lazy: lazy,
    Math: math,
    MorseCode: index$1,
    MutableVector2D: vector2dMutable,
    Random: random,
    RectangleRegion: rectangleRegion,
    RectangleSize: rectangleSize,
    StructureOfArrays: structureOfArrays,
    Timer: index,
    Vector2D: vector2d
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
   * @version 0.1.8
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
    if (color === null) return () => p.noStroke();
    if (color === undefined) return emptyFunction;
    const colorObject = parseColor(color);
    return () => p.stroke(colorObject);
  };
  /**
   * Creates a function that applies a fill color.
   * @param color `null` will be `noFill()` and `undefined` will have no effects.
   * @return A function that runs either `fill()`, `noFill()` or nothing.
   */
  const parseFill = color => {
    if (color === null) return () => p.noFill();
    if (color === undefined) return emptyFunction;
    const colorObject = parseColor(color);
    return () => p.fill(colorObject);
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
  const inversed255 = 1 / 255;
  /**
   * Gets a `p5.Color` instance.
   * @param alphaColor
   * @param alpha Alpha value from `0` to `255`.
   * @return A `p5.Color` instance.
   */
  const get$1 = (alphaColor, alpha) =>
    alphaColor.colors[Math.round(alphaColor.maxIndex * alpha * inversed255)];

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
    arrayUtility.loop(paths, drawPath);
  };
  const drawControlLine = vertex => {
    const { point, controlLine } = vertex;
    const { x, y } = point;
    const controlPointOffset = vector2d.fromPolar(
      0.5 * controlLine.length,
      controlLine.angle
    );
    const controlX = controlPointOffset.x;
    const controlY = controlPointOffset.y;
    p.line(x - controlX, y - controlY, x + controlX, y + controlY);
  };
  const drawBezierControlLines = vertices => {
    arrayUtility.loop(vertices, drawControlLine);
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
      shakeType === "VERTICAL" ? 0 : random.signed(shakeFactor * width);
    const yShake =
      shakeType === "HORIZONTAL" ? 0 : random.signed(shakeFactor * height);
    p.translate(xShake, yShake);
    shakeFactor *= shakeDecayFactor;
    if (shakeFactor < 0.001) shakeFactor = 0;
  };

  const TWO_PI$1 = math.TWO_PI;
  const line = (from, to) => p.line(from.x, from.y, to.x, to.y);
  const lineWithMargin = (from, to, margin) => {
    const angle$1 = angle.between(from, to);
    const offsetX = margin * Math.cos(angle$1);
    const offsetY = margin * Math.sin(angle$1);
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
  const eventHandlerStack = arrayList.create(32);
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
    arrayList.add(eventHandlerStack, createdHandler);
    return createdHandler;
  };
  /**
   * Removes `handler` from `eventHandlerStack`.
   * @param handler
   */
  const removeEventHandler = handler => {
    arrayList.removeShiftElement(eventHandlerStack, handler);
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

  const mouse = /*#__PURE__*/ Object.freeze({
    __proto__: null,
    logicalPosition: logicalPosition,
    updatePosition: updatePosition,
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
    onMoved: onMoved
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
  const ONE_FRAC_ROOT_TWO = 1 / Math.sqrt(2);
  const setVec = (x, y) => vector2dMutable.setCartesian(unitVector, x, y);
  const update = () => {
    horizontalMove = (left ? -1 : 0) + (right ? 1 : 0);
    verticalMove = (up ? -1 : 0) + (down ? 1 : 0);
    switch (horizontalMove) {
      case -1:
        switch (verticalMove) {
          case -1:
            setVec(-ONE_FRAC_ROOT_TWO, -ONE_FRAC_ROOT_TWO);
            break;
          case 0:
            setVec(-1, 0);
            break;
          case 1:
            setVec(-ONE_FRAC_ROOT_TWO, ONE_FRAC_ROOT_TWO);
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
            setVec(ONE_FRAC_ROOT_TWO, -ONE_FRAC_ROOT_TWO);
            break;
          case 0:
            setVec(1, 0);
            break;
          case 1:
            setVec(ONE_FRAC_ROOT_TWO, ONE_FRAC_ROOT_TWO);
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
    update();
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
    update();
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
    const maxCanvasSize = htmlUtility.getElementSize(
      typeof node === "string" ? htmlUtility.getElementOrBody(node) : node
    );
    const scaleFactor =
      fittingOption !== null
        ? fitBox.calculateScaleFactor(logicalSize, maxCanvasSize, fittingOption)
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
      logicalRegion: rectangleRegion.create(vector2d.zero, logicalSize),
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
        ? htmlUtility.getElementOrBody(settings.htmlElement)
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
        arrayUtility.loop(onSetup, listener => listener(p));
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
    setCanvas: setCanvas,
    setP5Instance: setP5Instance,
    setShake: setShake,
    startSketch: startSketch
  });

  /**
   * The id of the HTML element to which the canvas should belong.
   */
  const HTML_ELEMENT_ID = "Fragments";
  /**
   * The HTML element to which the canvas should belong.
   */
  const HTML_ELEMENT = htmlUtility.getElementOrBody(HTML_ELEMENT_ID);
  /**
   * The logical size of the canvas.
   */
  const LOGICAL_CANVAS_SIZE = {
    width: 800,
    height: 800
  };

  /**
   * Shared p5 instance.
   */
  let p$1;
  onSetup.push(() => {
    p$1 = p;
  });
  /**
   * Shared canvas instance.
   */
  let canvas$1;
  onSetup.push(() => {
    canvas$1 = canvas;
  });

  const SIZE = 100;
  const HALF_SIZE = SIZE / 2;
  let graphics;
  onSetup.push(p => {
    graphics = p.createGraphics(SIZE, SIZE);
    graphics.translate(0.05 * SIZE, 0.05 * SIZE);
    graphics.stroke(0, 64, 64, 8);
    let vx = 0.3;
    const shapeSize = Math.floor(0.9 * SIZE);
    for (let x = 0, maxX = shapeSize; x <= maxX; x += vx) {
      graphics.line(0, 0, x, shapeSize);
      vx += 0.005;
    }
  });
  const randomAngle = random.angle;
  const randomBetween = random.between;
  const create$8 = () => {
    return {
      position: {
        x: randomBetween(0.25, 0.75) * canvas$1.logicalSize.width,
        y: -HALF_SIZE
      },
      velocity: { x: 0, y: randomBetween(2, 5) },
      rotation: {
        angle: randomAngle(),
        velocity: randomBetween(0.005, 0.02)
      },
      scale: {
        factor: { x: 1, y: 1 },
        parameter: { x: randomAngle(), y: randomAngle() },
        parameterChangeRate: {
          x: randomBetween(0.01, 0.05),
          y: randomBetween(0.01, 0.05)
        }
      }
    };
  };
  const MutVec = vector2dMutable;
  let thresholdY;
  onSetup.push(() => {
    thresholdY = canvas$1.logicalRegion.rightBottom.y + HALF_SIZE;
  });
  const updateRotation = rotation => {
    rotation.angle += rotation.velocity;
  };
  const updateScale = scale => {
    const { factor, parameter, parameterChangeRate } = scale;
    MutVec.add(parameter, parameterChangeRate);
    factor.x = Math.sin(parameter.x);
    factor.y = Math.sin(parameter.y);
  };
  const update$1 = fragment => {
    const { position, velocity, rotation, scale } = fragment;
    MutVec.add(position, velocity);
    updateRotation(rotation);
    updateScale(scale);
    return position.y >= thresholdY;
  };
  const draw = fragment => {
    const { position, scale, rotation } = fragment;
    const { x, y } = position;
    const { angle } = rotation;
    const { x: scaleX, y: scaleY } = scale.factor;
    if (scaleX === 0 || scaleY === 0) return;
    p$1.translate(x, y);
    p$1.rotate(angle);
    p$1.scale(scaleX, scaleY);
    p$1.image(graphics, 0, 0);
    p$1.scale(1 / scaleX, 1 / scaleY);
    p$1.rotate(-angle);
    p$1.translate(-x, -y);
  };

  const { ArrayList } = CCC;
  const {
    startSketch: startSketch$1,
    createPixels: createPixels$1,
    replaceCanvasPixels: replaceCanvasPixels$1,
    pauseOrResume: pauseOrResume$1
  } = p5ex;
  let drawBackground;
  const fragments = ArrayList.create(256);
  const prelaod = () => {};
  const initialize = () => {
    const backgroundPixels = createPixels$1(() => {
      canvas$1.drawScaled(() => {
        const { width, height } = LOGICAL_CANVAS_SIZE;
        const g = p$1.createGraphics(width / 4, height / 4);
        g.background(232, 236, 240);
        g.noStroke();
        g.fill(252, 253, 255);
        g.ellipse(g.width / 2, g.height / 2, g.width, g.height);
        g.filter(p$1.BLUR, 10);
        p$1.image(g, 0, 0, width, height);
      });
    });
    drawBackground = () => replaceCanvasPixels$1(backgroundPixels);
    p$1.imageMode(p$1.CENTER);
  };
  const drawSketch = () => {
    if (p$1.frameCount % 4 === 0) ArrayList.add(fragments, create$8());
    ArrayList.removeShiftAll(fragments, update$1);
    ArrayList.loop(fragments, draw);
  };
  const draw$1 = () => {
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
    p.preload = prelaod;
    p.draw = draw$1;
    p.keyTyped = keyTyped;
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
