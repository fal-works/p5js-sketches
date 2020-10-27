/**
 * Morph.
 * Source code in TypeScript: https://github.com/fal-works/p5js-sketches/tree/master/morph
 *
 * @copyright 2020 FAL
 * @version 0.1.0
 */

(function (p5ex, CCC) {
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
  const HTML_ELEMENT_ID = "Morph";
  /** The logical width of the canvas. */
  const LOGICAL_CANVAS_WIDTH = 720;
  /** The logical height of the canvas. */
  const LOGICAL_CANVAS_HEIGHT = 720;

  /**
   * ---- Point ----------------------------------------------------------------
   */
  const { PI, cos, sin } = Math;
  const timeScale = 0.01;
  let time = 1024 * Math.random();
  const count = 1000;
  const tick = () => {
    time += timeScale;
  };
  const create = (i, x, y) => ({
    index: i,
    x,
    y,
    targetX: x,
    targetY: y,
  });
  const draw = (point) => {
    const r = 10;
    const theta = time;
    const phi = 2 * PI * (point.index / count);
    const x = r * sin(theta) * cos(phi);
    const y = r * sin(theta) * sin(phi);
    const z = r * cos(theta);
    const size = 4 + 20 * p.noise(x, y, z);
    p.circle(point.x, point.y, size);
  };
  const update = (point) => {
    point.x += 0.1 * (point.targetX - point.x);
    point.y += 0.1 * (point.targetY - point.y);
  };

  /**
   * ---- Sketch ----------------------------------------------------------------
   */
  const { PI: PI$1, cos: cos$1, sin: sin$1 } = Math;
  const points = [];
  const diffuse = () => {
    const { width, height } = canvas.logicalSize;
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    points.forEach((point) => {
      point.targetX = Random.between(-halfWidth, halfWidth);
      point.targetY = Random.between(-halfHeight, halfHeight);
    });
  };
  const circle = () => {
    const maxIndex = points.length;
    const radius = 240;
    const angleInterval = (2 * PI$1) / maxIndex;
    points.forEach((point, i) => {
      const angle = i * angleInterval;
      point.targetX = radius * cos$1(angle);
      point.targetY = radius * sin$1(angle);
    });
  };
  const fan = () => {
    const maxIndex = points.length;
    const radius = 120;
    const angleInterval = (2 * PI$1) / maxIndex;
    points.forEach((point, i) => {
      const angle = i * angleInterval;
      const factor = 1 + sin$1(4 * angle);
      point.targetX = radius * cos$1(angle) * factor;
      point.targetY = radius * sin$1(angle) * factor;
    });
  };
  let backgroundColor;
  let shapeColor;
  p5ex.onSetup.push((p) => {
    backgroundColor = p.color(255, 12);
    shapeColor = p.color(255, 0, 128, 16);
  });
  const drawSketch = () => {
    const { width, height } = canvas.logicalSize;
    p.translate(width / 2, height / 2);
    points.forEach(draw);
  };
  const reset = () => {};
  const initialize = () => {
    p.frameRate(30);
    p.noStroke();
    points.length = 0;
    const { width, height } = canvas.logicalSize;
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    for (let i = 0; i < count; i += 1) {
      points.push(
        create(
          i,
          Random.between(-halfWidth, halfWidth),
          Random.between(-halfHeight, halfHeight)
        )
      );
    }
    circle();
    p.background(255);
  };
  const draw$1 = () => {
    switch (p.frameCount % 180) {
      case 0:
        circle();
        break;
      case 60:
        fan();
        break;
      case 120:
        diffuse();
        break;
    }
    tick();
    points.forEach(update);
    p.blendMode(p.ADD);
    p.fill(backgroundColor);
    p.rect(0, 0, p.width, p.height);
    p.blendMode(p.BLEND);
    p.fill(shapeColor);
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
})(p5ex, CreativeCodingCore);
//# sourceMappingURL=sketch.js.map
