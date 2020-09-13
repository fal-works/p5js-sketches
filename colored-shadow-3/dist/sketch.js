/**
 * Colored Shadow 3.
 * Source code in TypeScript: https://github.com/fal-works/p5js-sketches/tree/master/colored-shadow-3
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
  const { Random } = CCC__namespace;
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
  const HTML_ELEMENT_ID = "ColoredShadow3";
  /** The logical width of the canvas. */
  const LOGICAL_CANVAS_WIDTH = 720;
  /** The logical height of the canvas. */
  const LOGICAL_CANVAS_HEIGHT = 720;

  /**
   * ---- Sketch ----------------------------------------------------------------
   */
  const createColors = (baseHue) => {
    const hue = baseHue || Random.angle();
    const lightness = Random.between(50, 100);
    return {
      stroke: p5ex.cielchColor(lightness, 110, hue, 0.8 * 255),
      shadow: p5ex.cielchColor(lightness, 110, hue, 0.5 * 255),
    };
  };
  const drawRandomShape = (x, y, baseHue) => {
    const colors = createColors(baseHue);
    p.push();
    p.stroke(colors.stroke);
    p.noFill();
    p5ex.setShadow(colors.shadow, 16, 15, 20);
    p.rect(x, y, 100, 100);
    p.pop();
  };
  const drawSketch = () => {
    p.blendMode(p.REPLACE);
    p.background(252);
    p.blendMode(p.MULTIPLY);
    const { width, height } = canvas.logicalSize;
    p.push();
    const interval = Random.between(50, 100);
    for (let x = 100; x < width - 100; x += interval) {
      for (let y = 100; y < height - 100; y += interval) {
        drawRandomShape(x, y, Random.angle());
      }
    }
    p.pop();
  };
  const reset = () => {
    canvas.drawScaled(drawSketch);
  };
  const initialize = () => {
    p.rectMode(p.CENTER);
    p.strokeWeight(8);
    reset();
  };
  const mousePressed = () => reset();
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
    keyTyped,
    mousePressed,
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
})(p5ex, CreativeCodingCore);
//# sourceMappingURL=sketch.js.map
