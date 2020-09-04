/**
 * Color Grid.
 * Source code in TypeScript: https://github.com/fal-works/p5js-sketches/tree/master/color-grid
 *
 * @copyright 2020 FAL
 * @version 0.1.0
 */

(function (p5ex, CCC) {
  "use strict";

  function _interopNamespace(e) {
    if (e && e.__esModule) {
      return e;
    } else {
      var n = Object.create(null);
      if (e) {
        Object.keys(e).forEach(function (k) {
          if (k !== "default") {
            var d = Object.getOwnPropertyDescriptor(e, k);
            Object.defineProperty(
              n,
              k,
              d.get
                ? d
                : {
                    enumerable: true,
                    get: function () {
                      return e[k];
                    },
                  }
            );
          }
        });
      }
      n["default"] = e;
      return Object.freeze(n);
    }
  }

  const p5ex__namespace = /*#__PURE__*/ _interopNamespace(p5ex);
  const CCC__namespace = /*#__PURE__*/ _interopNamespace(CCC);

  /**
   * ---- Common ----------------------------------------------------------------
   */
  const { Random, Timer, Easing } = CCC__namespace;
  const { onSetup, onInstantiate, Noise } = p5ex__namespace;
  /**
   * Shared p5 instance.
   */
  let p;
  onInstantiate.push((p5Instance) => {
    p = p5Instance;
  });
  /**
   * Shared canvas instance.
   */
  let canvas;
  onSetup.push(() => {
    canvas = p5ex.canvas;
  });

  /**
   * ---- Settings --------------------------------------------------------------
   */
  /** The id of the HTML element to which the canvas should belong. */
  const HTML_ELEMENT_ID = "ColorGrid";
  /** The logical height of the canvas. */
  const LOGICAL_CANVAS_HEIGHT = 800;

  /**
   * ---- Shape -----------------------------------------------------------------
   */
  const create = (x, y, color) => ({
    x: x + Random.Integer.signed(10),
    y: y + Random.Integer.signed(10),
    w: Random.Integer.between(45, 65),
    h: Random.Integer.between(45, 65),
    color,
    noiseX: Noise.withChangeRate(0.002),
    noiseY: Noise.withChangeRate(0.002),
  });
  const draw = (shape, scaleX, scaleY) => {
    const { x, y, w, h, color, noiseX, noiseY } = shape;
    p.fill(color);
    p.rect(
      x + 50 * (noiseX() - 0.5),
      y + 50 * (noiseY() - 0.5),
      scaleX * w,
      scaleY * h
    );
  };

  /**
   * ---- Shape Array ------------------------------------------------------------
   */
  const ArrayType = {
    Row: 0,
    Column: 1,
  };
  const create$1 = (array, type) => ({
    array: array,
    visibility: 0.0,
    type: type,
  });
  const update = (shapes) => {};
  const draw$1 = (shapes) => {
    const { array, visibility, type } = shapes;
    switch (type) {
      case ArrayType.Row:
        for (const shape of array) draw(shape, 1.0, visibility);
        break;
      case ArrayType.Column:
        for (const shape of array) draw(shape, visibility, 1.0);
        break;
    }
  };

  /**
   * ---- Sketch ----------------------------------------------------------------
   */
  let drawBackground;
  const shapeArrays = [];
  const timers = Timer.Set.construct(32);
  const createBackground = () => {
    p.blendMode(p.REPLACE);
    p.background(0, 0, 99);
    return p5ex.storePixels();
  };
  const resetShapes = () => {
    shapeArrays.length = 0;
    const { width, height } = canvas.logicalSize;
    const xInterval = 96;
    const yInterval = 96;
    const columns = Math.floor(width / xInterval) - 1;
    const rows = Math.floor(height / yInterval) - 1;
    const forEachColumn = (callback) => {
      for (
        let i = 0, x = width / 2 - ((columns - 1) / 2) * xInterval;
        i < columns;
        i += 1, x += xInterval
      ) {
        callback(x);
      }
    };
    const forEachRow = (callback) => {
      for (
        let k = 0, y = height / 2 - ((rows - 1) / 2) * yInterval;
        k < rows;
        k += 1, y += yInterval
      ) {
        callback(y);
      }
    };
    const createShape = (x, y, baseHue) => {
      let hue = baseHue + Random.signed(30);
      if (hue < 0) hue += 360;
      else if (360 < hue) hue -= 360;
      return create(x, y, p.color(hue, 100, 30, 1.0));
    };
    const setTimer = (shapeArray, onComplete) => {
      const appear = Timer.create({
        duration: 30,
        onProgress: (progress) =>
          (shapeArray.visibility = Easing.Out.quart(progress.ratio)),
      });
      const wait = Timer.create({ duration: Random.Integer.between(60, 420) });
      const disappear = Timer.create({
        duration: 30,
        onProgress: (progress) =>
          (shapeArray.visibility = 1.0 - Easing.Out.quart(progress.ratio)),
        onComplete: () => {
          onComplete();
          setTimer(shapeArray, onComplete);
        },
      });
      timers.add(Timer.chain([appear, wait, disappear]));
    };
    forEachRow((y) => {
      const createArray = () => {
        const array = [];
        const baseHue = Random.value(360);
        forEachColumn((x) => array.push(createShape(x, y, baseHue)));
        return array;
      };
      const shapeArray = create$1(createArray(), ArrayType.Row);
      setTimer(shapeArray, () => {
        shapeArray.array = createArray();
      });
      shapeArrays.push(shapeArray);
    });
    forEachColumn((x) => {
      const createArray = () => {
        const array = [];
        const baseHue = Random.value(360);
        forEachRow((y) => array.push(createShape(x, y, baseHue)));
        return array;
      };
      const shapeArray = create$1(createArray(), ArrayType.Column);
      setTimer(shapeArray, () => {
        shapeArray.array = createArray();
      });
      shapeArrays.push(shapeArray);
    });
  };
  const reset = () => {
    drawBackground = createBackground();
    resetShapes();
    p.blendMode(p.DIFFERENCE);
  };
  const initialize = () => {
    p.colorMode(p.HSB, 360, 100, 100, 1);
    p.noStroke();
    p.rectMode(p.CENTER);
    reset();
  };
  const updateSketch = () => {
    timers.step();
    for (const array of shapeArrays) update();
  };
  const drawSketch = () => {
    for (const array of shapeArrays) draw$1(array);
  };
  const draw$2 = () => {
    updateSketch();
    drawBackground();
    canvas.drawScaled(drawSketch);
  };
  const keyTyped = () => {
    switch (p.key) {
      case "p":
        p5ex.pauseOrResume();
        break;
      case "g":
        p.save("image.png");
        break;
      case "r":
        reset();
        break;
    }
    return false;
  };
  const p5Methods = {
    draw: draw$2,
    keyTyped,
  };

  /**
   * ---- Main ------------------------------------------------------------------
   */
  p5ex.startSketch({
    htmlElement: HTML_ELEMENT_ID,
    logicalCanvasHeight: LOGICAL_CANVAS_HEIGHT,
    initialize: initialize,
    windowResized: () => canvas.resizeIfNeeded(),
    onCanvasResized: reset,
    p5Methods: p5Methods,
  });
})(p5ex, CreativeCodingCore);
//# sourceMappingURL=sketch.js.map
