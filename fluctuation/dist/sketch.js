/**
 * Fluctuation.
 * Source code in TypeScript: https://github.com/fal-works/p5js-sketches/tree/master/fluctuation
 *
 * @copyright 2020 FAL
 * @version 0.1.0
 */

(function (p5ex) {
  "use strict";

  function _interopNamespace(e) {
    if (e && e.__esModule) return e;
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

  const p5ex__namespace = /*#__PURE__*/ _interopNamespace(p5ex);

  /**
   * ---- Common ----------------------------------------------------------------
   */
  const { onSetup, onInstantiate } = p5ex__namespace;
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
  const HTML_ELEMENT_ID = "Fluctuation";
  /** The logical width of the canvas. */
  const LOGICAL_CANVAS_WIDTH = 720;
  /** The logical height of the canvas. */
  const LOGICAL_CANVAS_HEIGHT = 720;

  const SIZE = 180;
  const NOISE_SCALE = 0.0075;
  const MIN_TIME_SCALE = 0.02;
  const TIME_SCALE_DECAY = 0.92;
  let time = 1000 * Math.random();
  let timeScale = MIN_TIME_SCALE;
  let g;
  const impact = () => {
    timeScale = 0.2;
  };
  const update = () => {
    g.clear();
    g.noStroke();
    g.fill(255, 32);
    const w = g.width;
    const h = g.height;
    const startX = 0.25 * w;
    const startY = 0.25 * h;
    const endX = 0.75 * w;
    const endY = 0.75 * h;
    for (let x = startX; x < endX; x += 1) {
      for (let y = startY; y < endY; y += 1) {
        const offsetMag = 0.5 * SIZE;
        const noiseFactor =
          p5ex.p.noise(time + NOISE_SCALE * x) +
          p5ex.p.noise(-time + NOISE_SCALE * y) -
          1;
        const radius = offsetMag * noiseFactor;
        const angle = 2 * Math.PI * noiseFactor;
        g.circle(x + radius * Math.cos(angle), y + radius * Math.sin(angle), 4);
      }
    }
    time += timeScale;
    timeScale = Math.max(MIN_TIME_SCALE, timeScale * TIME_SCALE_DECAY);
  };
  p5ex.onSetup.push(() => {
    g = p5ex.p.createGraphics(SIZE, SIZE);
    update();
  });
  const draw = () => {
    p5ex.p.imageMode(p5ex.p.CENTER);
    const adjust = -0.1 * SIZE;
    p5ex.p.image(g, adjust, adjust);
  };

  /**
   * ---- Sketch ----------------------------------------------------------------
   */
  const drawSketch = () => {
    const { width, height } = canvas.logicalSize;
    const resolution = 3;
    const intervalX = width / (resolution + 1);
    const intervalY = height / (resolution + 1);
    for (let x = 1; x <= resolution; x += 1) {
      for (let y = 1; y <= resolution; y += 1) {
        p.push();
        p.translate(x * intervalX, y * intervalY);
        draw();
        p.pop();
      }
    }
  };
  const reset = () => {};
  const initialize = () => {
    p.imageMode(p.CENTER);
  };
  const draw$1 = () => {
    update();
    p.background(0);
    canvas.drawScaled(drawSketch);
  };
  const mousePressed = () => impact();
  const keyTyped = () => {
    switch (p.key) {
      case "p":
        p5ex.pauseOrResume();
        break;
      case "g":
        p.save("image.png");
        break;
    }
    return false;
  };
  const p5Methods = {
    keyTyped,
    mousePressed,
    draw: draw$1,
  };

  /**
   * ---- Main ------------------------------------------------------------------
   */
  p5ex.startSketch({
    htmlElement: HTML_ELEMENT_ID,
    logicalCanvasWidth: LOGICAL_CANVAS_WIDTH,
    logicalCanvasHeight: LOGICAL_CANVAS_HEIGHT,
    initialize: initialize,
    windowResized: () => canvas.resizeIfNeeded(),
    onCanvasResized: reset,
    p5Methods: p5Methods,
  });
})(p5ex);
//# sourceMappingURL=sketch.js.map
