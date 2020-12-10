/**
 * Layers.
 * Source code in TypeScript: https://github.com/fal-works/p5js-sketches/tree/master/layers
 *
 * @copyright 2020 FAL
 * @version 0.1.0
 */

(function (p5ex, creativeCodingCore, chroma) {
  "use strict";

  function _interopDefaultLegacy(e) {
    return e && typeof e === "object" && "default" in e ? e : { default: e };
  }

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
  const chroma__default = /*#__PURE__*/ _interopDefaultLegacy(chroma);

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
  const HTML_ELEMENT_ID = "Layers";
  /** The logical height of the canvas. */
  const LOGICAL_CANVAS_HEIGHT = 1080;

  /**
   * ---- Rectangle -------------------------------------------------------------
   */
  const maxAlpha = 160;
  const createRectangle = (x, y, width, height, type) => {
    let bounds;
    switch (type) {
      case 0:
        bounds = { x, y, width, height: 0 };
        break;
      case 1:
        bounds = { x, y, width: 0, height };
        break;
    }
    const c = chroma__default["default"]
      .lch(95, 120, Math.random() * 360)
      .rgb();
    return {
      bounds,
      targetBounds: { x, y, width, height },
      color: p.color(c[0], c[1], c[2]),
      alpha: 1,
      targetAlpha: maxAlpha,
      type,
    };
  };
  const easeFactor = 0.05;
  const updateRectangle = (rectangle) => {
    const { bounds, targetBounds, type } = rectangle;
    bounds.x += easeFactor * (targetBounds.x - bounds.x);
    bounds.y += easeFactor * (targetBounds.y - bounds.y);
    bounds.width += easeFactor * (targetBounds.width - bounds.width);
    bounds.height += easeFactor * (targetBounds.height - bounds.height);
    rectangle.alpha += easeFactor * (rectangle.targetAlpha - rectangle.alpha);
    if (maxAlpha - 1 < rectangle.alpha) {
      switch (type) {
        case 0:
          targetBounds.y = bounds.y + bounds.height;
          targetBounds.height = 0;
          break;
        case 1:
          targetBounds.x = bounds.x + bounds.width;
          targetBounds.width = 0;
          break;
      }
      rectangle.targetAlpha = 0;
    }
    return 1 <= rectangle.alpha;
  };
  const drawRectangle = (rectangle) => {
    const { bounds, color, alpha } = rectangle;
    p.fill(p5ex.colorWithAlpha(color, alpha));
    p.rect(bounds.x, bounds.y, bounds.width, bounds.height);
  };

  /**
   * ---- Sketch ----------------------------------------------------------------
   */
  let rectangles = [];
  const addRectangles = () => {
    const { topLeft, bottomRight } = canvas.logicalRegion;
    const { width: canvasWidth, height: canvasHeight } = canvas.logicalSize;
    const minWidth = 0.1 * canvasWidth;
    const minHeight = 0.1 * canvasHeight;
    const maxWidth = 0.7 * canvasWidth;
    const maxHeight = 0.7 * canvasHeight;
    for (let i = 0; i < 4; i += 1) {
      const x = creativeCodingCore.Random.between(
        topLeft.x,
        bottomRight.x - maxWidth
      );
      const y = 0;
      const w = creativeCodingCore.Random.Curved.between(
        creativeCodingCore.Numeric.square,
        minWidth,
        maxWidth
      );
      const h = canvasHeight;
      rectangles.push(createRectangle(x, y, w, h, 1));
    }
    for (let i = 0; i < 3; i += 1) {
      const x = 0;
      const y = creativeCodingCore.Random.between(
        topLeft.y,
        bottomRight.y - maxHeight
      );
      const w = canvasWidth;
      const h = creativeCodingCore.Random.Curved.between(
        creativeCodingCore.Numeric.square,
        minHeight,
        maxHeight
      );
      rectangles.push(createRectangle(x, y, w, h, 0));
    }
  };
  const updateSketch = () => {
    if (p.frameCount % 120 === 1) addRectangles();
    rectangles = rectangles.filter(updateRectangle);
  };
  const drawSketch = () => {
    p.blendMode(p.REPLACE);
    p.background(255);
    p.blendMode(p.MULTIPLY);
    rectangles.forEach(drawRectangle);
  };
  const reset = () => {};
  const initialize = () => {
    p.noStroke();
  };
  const draw = () => {
    updateSketch();
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
    }
    return false;
  };
  const p5Methods = {
    keyTyped,
    draw,
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
})(p5ex, CreativeCodingCore, chroma);
//# sourceMappingURL=sketch.js.map
