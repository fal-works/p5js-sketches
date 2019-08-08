/**
 * Lines of Data.
 * Website => https://www.fal-works.com/
 * @copyright 2019 FAL
 * @author FAL <contact@fal-works.com>
 * @version 0.1.0
 * @license CC-BY-SA-3.0
 */

(function(p5) {
  "use strict";

  p5 = p5 && p5.hasOwnProperty("default") ? p5["default"] : p5;

  /**
   * ---- ArrayList ------------------------------------------------------------
   */
  const create = initialCapacity => {
    return {
      array: new Array(initialCapacity),
      size: 0
    };
  };
  const add = (arrayList, element) => {
    arrayList.array[arrayList.size] = element;
    arrayList.size += 1;
  };
  const clear = arrayList => {
    arrayList.size = 0;
  };
  const loop = (arrayList, callback) => {
    const { array, size } = arrayList;
    for (let i = 0; i < size; i += 1) callback(array[i]);
  };

  /**
   * ---- Sweepable ------------------------------------------------------------
   */
  const sweep = arrayList => {
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
   * ---- Common environment utility -------------------------------------------
   */
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

  /**
   * ---- p5 shared variables --------------------------------------------------
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
   * ---- Common bounding box utility ------------------------------------------
   */
  /**
   * Returns `true` if `size` contains `point`.
   * @param size
   */
  const containsPoint = (size, point, margin) => {
    const { x, y } = point;
    return (
      x >= margin &&
      y >= margin &&
      x < size.width - margin &&
      y < size.height - margin
    );
  };
  /**
   * Calculates the scale factor for fitting `nonScaledSize` to `targetSize` keeping the original aspect ratio.
   *
   * @param nonScaledSize
   * @param targetSize
   * @param fittingOption
   */
  const getScaleFactor = (nonScaledSize, targetSize, fittingOption) => {
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

  /**
   * ---- p5.js transformation utility -----------------------------------------
   */
  /**
   * Runs `drawCallback` rotated with `angle`,
   * then restores the transformation by calling `p.rotate()` with the negative value.
   * Used to avoid calling `p.push()` and `p.pop()` frequently.
   *
   * @param drawCallback
   * @param angle
   */
  function drawRotated(drawCallback, angle) {
    p.rotate(angle);
    drawCallback();
    p.rotate(-angle);
  }
  /**
   * Composite of `drawTranslated()` and `drawRotated()`.
   *
   * @param drawCallback
   * @param offsetX
   * @param offsetY
   * @param angle
   */
  function drawTranslatedAndRotated(drawCallback, offsetX, offsetY, angle) {
    p.translate(offsetX, offsetY);
    drawRotated(drawCallback, angle);
    p.translate(-offsetX, -offsetY);
  }
  /**
   * Runs `drawCallback` scaled with `scaleFactor`,
   * then restores the transformation by scaling with the inversed factor.
   * Used to avoid calling `p.push()` and `p.pop()` frequently.
   *
   * @param drawCallback
   * @param scaleFactor
   */
  function drawScaled(drawCallback, scaleFactor) {
    p.scale(scaleFactor);
    drawCallback();
    p.scale(1 / scaleFactor);
  }

  /**
   * ---- p5.js canvas utility -------------------------------------------------
   */
  /**
   * Runs `p.createCanvas()` with the scaled size that fits to `node`.
   * Returns the created canvas and the scale factor.
   *
   * @param node - The HTML element or its ID.
   * @param logicalSize
   * @param fittingOption
   * @param renderer
   */
  function createScaledCanvas(node, logicalSize, fittingOption, renderer) {
    const maxCanvasSize = getElementSize(
      typeof node === "string" ? getElementOrBody(node) : node
    );
    const scaleFactor = getScaleFactor(
      logicalSize,
      maxCanvasSize,
      fittingOption
    );
    const canvas = p.createCanvas(
      scaleFactor * logicalSize.width,
      scaleFactor * logicalSize.height,
      renderer
    );
    return {
      p5Canvas: canvas,
      scaleFactor: scaleFactor,
      logicalSize: logicalSize,
      drawScaled: drawCallback => drawScaled(drawCallback, scaleFactor),
      logicalCenterPosition: {
        x: logicalSize.width / 2,
        y: logicalSize.height / 2
      }
    };
  }

  /**
   * ---- p5util main -----------------------------------------------------------
   */
  /**
   * Calls `new p5()` with the given settings information.
   * @param settings
   */
  const startSketch = settings => {
    const htmlElement = getElementOrBody(settings.htmlElementId);
    new p5(p => {
      setP5Instance(p);
      p.setup = () => {
        setCanvas(createScaledCanvas(htmlElement, settings.logicalCanvasSize));
        settings.initialize();
      };
      settings.setP5Methods(p);
    }, htmlElement);
  };

  /**
   * ---- p5.js pixels utility -------------------------------------------------
   */
  /**
   * Runs `drawCallback` and `p.loadPixels()`, then returns `p.pixels`.
   * The style and transformations will be restored by using `p.push()` and `p.pop()`.
   * @param p The p5 instance.
   * @param drawCallback
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
  const replacePixels = pixels => {
    p.pixels = pixels;
    p.updatePixels();
  };

  /**
   * ---- p5.js pause utility --------------------------------------------------
   */
  let paused = false;
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
   * ---- Settings -------------------------------------------------------------
   */
  /**
   * The id of the HTML element to which the canvas should belong.
   */
  const HTML_ELEMENT_ID = "LinesOfData";
  /**
   * The logical size of the canvas.
   */
  const LOGICAL_CANVAS_SIZE = {
    width: 800,
    height: 800
  };

  /**
   * ---- Vector 2D ------------------------------------------------------------
   */
  const addPolar = (vector, angle, length) => {
    return {
      x: vector.x + length * Math.cos(angle),
      y: vector.y + length * Math.sin(angle)
    };
  };

  /**
   * ---- Common lazy evaluation utility ---------------------------------------
   */
  function lazy(factory) {
    let value = undefined;
    const lazyObject = {
      get: () => {
        if (!value) value = factory();
        return value;
      },
      clear: () => {
        value = undefined;
        return lazyObject;
      }
    };
    return lazyObject;
  }

  /**
   * ---- Common math utility --------------------------------------------------
   */
  const sq = v => v * v;
  const cubic = v => v * v * v;
  const TWO_PI = 2 * Math.PI;
  const createAngleArray = resolution => {
    const array = new Array(resolution);
    const interval = TWO_PI / resolution;
    for (let i = 0; i < resolution; i += 1) array[i] = i * interval;
    return array;
  };
  const nearlyEqual = (a, b) => Math.abs(a - b) < 0.0000000000001;

  /**
   * ---- Common random utility ------------------------------------------------
   */
  /**
   * Returns random value from `start` up to (but not including) `end`.
   * @param start
   * @param end
   * @return A random value.
   */
  const between = (start, end) => start + Math.random() * (end - start);
  /**
   * Returns random value from `range.start` up to (but not including) `range.end`.
   * @param range
   * @return A random value.
   */
  const inRange = range => between(range.start, range.end);
  const betweenPow = (start, end, exponent) =>
    start + Math.pow(Math.random(), exponent) * (end - start);
  const inRangePow = (range, exponent) =>
    betweenPow(range.start, range.end, exponent);
  /**
   * Returns random integer from 0 up to (but not including) `maxInt`.
   * `maxInt` is not expected to be negative.
   * @param maxInt
   * @return A random integer value.
   */
  const pickInt = maxInt => Math.floor(Math.random() * maxInt);
  /**
   * Returns one element of `array` randomly.
   * `array` is not expected to be empty.
   * @param array
   * @return A random element.
   */
  const fromArray = array => array[pickInt(array.length)];
  const bool = probability => Math.random() < probability;

  /**
   * ---- Common easing utility ------------------------------------------------
   */
  /**
   * easeInQuad.
   * @param ratio
   */
  function easeInQuad(ratio) {
    return sq(ratio);
  }
  /**
   * easeOutCubic.
   * @param ratio
   */
  function easeOutCubic(ratio) {
    return cubic(ratio - 1) + 1;
  }

  /**
   * ---- Common array utility -------------------------------------------------
   */
  /**
   * Runs `callback` once for each element of `array`.
   * Unlike `forEach()`, an element of `array` should not be removed during the iteration.
   * @param array
   * @param callback
   */
  function loop$1(array, callback) {
    const arrayLength = array.length;
    for (let i = 0; i < arrayLength; i += 1) {
      callback(array[i], i, array);
    }
  }

  /**
   * ---- Common timer utility ------------------------------------------------
   */
  const emptyListener = () => {};
  const reset = timerUnit => {
    timerUnit.count = 0;
    timerUnit.progressRatio = 0;
    timerUnit.isCompleted = false;
  };
  const step = timerUnit => {
    const { isCompleted, count, duration, progressRatioChangeRate } = timerUnit;
    if (isCompleted) return;
    if (count >= duration) {
      timerUnit.progressRatio = 1;
      timerUnit.onProgress(timerUnit);
      timerUnit.isCompleted = true;
      timerUnit.onComplete(timerUnit);
      return;
    }
    timerUnit.onProgress(timerUnit);
    timerUnit.count += 1;
    timerUnit.progressRatio += progressRatioChangeRate;
  };
  const create$1 = (
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
  const dummyUnit = create$1(0);
  const addOnComplete = (timerUnit, onComplete) => {
    const newUnit = Object.assign({}, timerUnit);
    newUnit.onComplete = () => {
      timerUnit.onComplete(newUnit);
      onComplete(newUnit);
    };
    return newUnit;
  };
  const setChainIndex = (chain, index) => {
    chain.index = index;
    chain.current = chain.units[index];
  };
  const resetChain = chain => {
    loop$1(chain.units, reset);
    setChainIndex(chain, 0);
  };
  const shiftChain = chain => setChainIndex(chain, chain.index + 1);
  const chain = (timers, looped = false) => {
    let newChain;
    const newTimers = new Array(timers.length);
    const shift = () => shiftChain(newChain);
    const lastIndex = timers.length - 1;
    for (let i = 0; i < lastIndex; i += 1) {
      newTimers[i] = addOnComplete(timers[i], shift);
    }
    if (!looped) newTimers[lastIndex] = timers[lastIndex];
    else
      newTimers[lastIndex] = addOnComplete(timers[lastIndex], () =>
        resetChain(newChain)
      );
    newChain = {
      units: newTimers,
      current: newTimers[0],
      index: 0
    };
    return newChain;
  };
  const dummyChain = chain([dummyUnit]);

  /**
   * ---- Line -----------------------------------------------------------------
   */
  const ANGLES = createAngleArray(8);
  const RIGHT_SEQUENCE_OFFSET = { start: 50, end: 150 };
  const SEQUENCE_WIDTH = 10;
  const DATA_UNIT_LENGTH = { start: 2, end: 15 };
  const DATA_UNIT_SHORT_INTERVAL = { start: 3, end: 20 };
  const DATA_UNIT_LONG_INTERVAL = { start: 40, end: 160 };

  const colorCandidates = lazy(() =>
    ["#7189bf", "#df7599", "#ffc785", "#72d6c9", "#202020"].map(code =>
      p.color(code)
    )
  );
  const lineColor = lazy(() => p.color("#202020"));
  const createSequence = (length, offset) => {
    const sequence = [];
    let x = offset;
    while (x < length) {
      const nextX = Math.min(length, x + inRangePow(DATA_UNIT_LENGTH, 3));
      sequence.push({
        color: fromArray(colorCandidates.get()),
        start: x,
        end: nextX
      });
      x = nextX;
      x += inRangePow(
        bool(0.8) ? DATA_UNIT_SHORT_INTERVAL : DATA_UNIT_LONG_INTERVAL,
        2
      );
    }
    return sequence;
  };
  const drawSequence = (sequence, startX, endX, left) => {
    const unitCount = sequence.length;
    const height = (left ? -1 : 1) * SEQUENCE_WIDTH;
    for (let i = 0; i < unitCount; i += 1) {
      const { color, start, end } = sequence[i];
      if (end < startX) continue;
      if (endX < start) continue;
      p.fill(color);
      p.rect(Math.max(startX, start), 0, Math.min(endX, end), height);
    }
  };
  const createLineData = length => {
    return {
      length,
      leftSequence: createSequence(length, 0),
      rightSequence: createSequence(length, inRange(RIGHT_SEQUENCE_OFFSET))
    };
  };
  const createLineGraphics = data => {
    const trimRatio = {
      start: 0,
      end: 0
    };
    const length = data.length;
    const draw = () => {
      const startX = trimRatio.start * length;
      const endX = trimRatio.end * length;
      drawSequence(data.leftSequence, startX, endX, true);
      drawSequence(data.rightSequence, startX, endX, false);
      p.stroke(lineColor.get());
      p.line(startX, 0, endX, 0);
      p.noStroke();
    };
    return {
      data,
      trimRatio,
      draw
    };
  };
  const drawLine = line => {
    const { x, y } = line.startPoint;
    drawTranslatedAndRotated(line.graphics.draw, x, y, line.angle);
  };
  const updateLine = line => step(line.timers.current);
  const createLine = (startPoint, angle, length, onCreate) => {
    const graphics = createLineGraphics(createLineData(length));
    const { data, trimRatio } = graphics;

    let newLine;
    const birthDeathDuration = Math.ceil(data.length / 15);
    const waitDuration = 30;
    const onProgressBirth = timer => {
      trimRatio.end = easeOutCubic(timer.progressRatio);
    };
    const onCompleteBirth = () => {
      for (let i = 0; i < 1000; i += 1) {
        const nextStartPoint = addPolar(startPoint, angle, length);
        const nextAngle = fromArray(ANGLES);
        if (
          angle === nextAngle ||
          nearlyEqual(Math.abs(angle - nextAngle), Math.PI)
        ) {
          continue;
        }
        const nextLength = between(20, 600);
        const nextEndPoint = addPolar(nextStartPoint, nextAngle, nextLength);
        if (!containsPoint(canvas.logicalSize, nextEndPoint, 80)) continue;
        createLine(nextStartPoint, nextAngle, nextLength, onCreate);
        break;
      }
    };
    const onProgressDeath = timer => {
      trimRatio.start = easeInQuad(timer.progressRatio);
    };
    const onCompleteDeath = () => {
      newLine.needsSweep = true;
    };
    const birthTimer = create$1(
      birthDeathDuration,
      onProgressBirth,
      onCompleteBirth
    );
    const waitTimer = create$1(waitDuration);
    const deathTimer = create$1(
      birthDeathDuration,
      onProgressDeath,
      onCompleteDeath
    );
    const timers = chain([birthTimer, waitTimer, deathTimer]);
    newLine = {
      startPoint,
      angle,
      graphics,
      timers,
      onCreate,
      needsSweep: false
    };
    onCreate(newLine);
    return newLine;
  };

  /**
   * ---- Main -----------------------------------------------------------------
   */

  let lines;

  let drawBackground;
  const reset$1 = () => {
    clear(lines);
    const onCreate = line => add(lines, line);
    createLine({ x: 100, y: 200 }, 0, 600, onCreate);
    createLine({ x: 700, y: 600 }, Math.PI, 600, onCreate);
  };
  const initialize = () => {
    const backgroundColor = p.color(248, 248, 252);
    drawBackground = replacePixels.bind(
      null,
      createPixels(() => p.background(backgroundColor))
    );
    p.noStroke();
    p.strokeWeight(2);
    p.rectMode(p.CORNERS);
    lines = create(32);
    reset$1();
  };

  const drawSketch = () => {
    loop(lines, updateLine);
    loop(lines, drawLine);
    sweep(lines);
  };
  const draw = () => {
    drawBackground();
    canvas.drawScaled(drawSketch);
  };

  const mousePressed = () => {};
  const keyTyped = () => {
    switch (p.key) {
      case "p":
        pauseOrResume();
        break;
      case "s":
        p.save("image.png");
        break;
    }
  };

  const setP5Methods = p => {
    p.draw = draw;
    p.mousePressed = mousePressed;
    p.keyTyped = keyTyped;
  };
  startSketch({
    htmlElementId: HTML_ELEMENT_ID,
    logicalCanvasSize: LOGICAL_CANVAS_SIZE,
    initialize,
    setP5Methods
  });
})(p5);
//# sourceMappingURL=sketch.js.map
