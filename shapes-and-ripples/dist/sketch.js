/**
 * ShapesAndRipples.
 * Source code in TypeScript: https://github.com/fal-works/p5js-sketches/tree/master/shapes-and-ripples
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
  const { Coordinates2D } = CCC__namespace;
  const {
    onSetup,
    onInstantiate,
    translateRotate,
    undoTranslateRotate,
    Mouse,
  } = p5ex__namespace;
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
  /**
   * Alias for `p.drawingContext`.
   */
  let context;
  onSetup.push(() => {
    canvas = p5ex.canvas;
    context = p.drawingContext;
  });

  /**
   * ---- Settings --------------------------------------------------------------
   */
  /** The id of the HTML element to which the canvas should belong. */
  const HTML_ELEMENT_ID = "ShapesAndRipples";
  /** The logical height of the canvas. */
  const LOGICAL_CANVAS_HEIGHT = 800;

  /**
   * Shape.
   */
  const maxTemperature = 60;
  const rotationVelocityDelayFactor = 0.95;
  const shapeWidth = 6;
  const shapeHeight = 36;
  const create = (x, y) => ({
    x,
    y,
    rotation: 0.0,
    rotationVelocity: 0.0,
    temperature: 0,
  });
  const shapeColors = [];
  p5ex.onSetup.push((p) => {
    const black = p.color(32, 48, 64);
    const blue = p.color(128, 192, 255);
    for (let i = 0; i <= maxTemperature; i += 1) {
      const ratio = i / maxTemperature;
      shapeColors.push(p.lerpColor(black, blue, ratio));
    }
  });
  const impact = (shape) => {
    shape.rotationVelocity = 0.25;
    shape.temperature = maxTemperature;
  };
  const normalizeAngle = (angle) =>
    angle - p.PI * Math.floor((angle + p.HALF_PI) / p.PI);
  const update = (shape) => {
    let { rotation, rotationVelocity } = shape;
    rotation += rotationVelocity;
    const minVel = 0.02;
    if (minVel <= rotationVelocity) {
      rotationVelocity = Math.max(
        rotationVelocityDelayFactor * rotationVelocity,
        minVel
      );
      if (rotationVelocity == minVel) {
        if (Math.abs(normalizeAngle(rotation)) < minVel) {
          rotation = 0.0;
          rotationVelocity = 0.0;
        }
      }
    }
    shape.rotation = rotation;
    shape.rotationVelocity = rotationVelocity;
    if (0 < shape.temperature) shape.temperature -= 1;
  };
  const draw = (shape) => {
    const { x, y, rotation, temperature } = shape;
    translateRotate(x, y, rotation);
    p.fill(shapeColors[temperature]);
    p.rect(0.0, 0.0, shapeWidth, shapeHeight);
    undoTranslateRotate();
  };
  const collisionDistance = 1.5 * (shapeHeight / 2);
  const getDistSq = (shape, x, y) =>
    Coordinates2D.distanceSquared(shape.x, shape.y, x, y);
  const collides = (shape, x, y, colliderRadius) => {
    const dist = collisionDistance + colliderRadius;
    const distSq = dist * dist;
    return getDistSq(shape, x, y) < distSq;
  };

  /**
   * Epicenter.
   */
  const create$1 = (x, y) => ({
    x,
    y,
    radius: 0.0,
  });
  const radiusChangeRate = 12;
  const update$1 = (unit) => {
    unit.radius += radiusChangeRate;
    const canvasSize = canvas.logicalSize;
    const dead = Math.max(canvasSize.width, canvasSize.height) < unit.radius;
    return !dead;
  };

  /**
   * ---- Sketch ----------------------------------------------------------------
   */
  let drawBackground;
  const shapes = [];
  let cursorColor;
  let epicenters = [];
  const createBackground = () => {
    p.background(252);
    return p5ex.storePixels();
  };
  const resetShapes = () => {
    shapes.length = 0;
    const { width, height } = canvas.logicalSize;
    const xInterval = 64;
    const yInterval = 80;
    const columns = Math.floor(width / xInterval) - 1;
    const rows = Math.floor(height / yInterval) - 1;
    for (
      let i = 0, x = width / 2 - ((columns - 1) / 2) * xInterval;
      i < columns;
      i += 1, x += xInterval
    ) {
      for (
        let k = 0, y = height / 2 - ((rows - 1) / 2) * yInterval;
        k < rows;
        k += 1, y += yInterval
      ) {
        shapes.push(create(x, y));
      }
    }
  };
  const reset = () => {
    drawBackground = createBackground();
    resetShapes();
    epicenters.length = 0;
  };
  const initialize = () => {
    reset();
    p.noStroke();
    p.rectMode(p.CENTER);
    cursorColor = p.color(0, 32, 64, 64);
    const { scaleFactor } = canvas;
    context.shadowOffsetX = scaleFactor * 16;
    context.shadowOffsetY = scaleFactor * 16;
    context.shadowBlur = scaleFactor * 6;
    context.shadowColor = `rgba(0, 0, 0, 0.1)`;
  };
  const cursorSize = 36.0;
  const drawCursor = () => {
    p.fill(cursorColor);
    const t = 0.15 * p.frameCount;
    p.ellipse(
      0.0,
      0.0,
      cursorSize * (1.0 + 0.15 * Math.cos(t)),
      cursorSize * (1.0 + 0.15 * Math.sin(t))
    );
  };
  const updateSketch = () => {
    for (const shape of shapes) update(shape);
    epicenters = epicenters.filter(update$1);
    for (const shape of shapes) {
      for (const epicenter of epicenters) {
        const dist = Math.sqrt(getDistSq(shape, epicenter.x, epicenter.y));
        const { radius } = epicenter;
        const lastRadius = radius - radiusChangeRate;
        if (lastRadius < dist && dist < radius) impact(shape);
      }
    }
  };
  const drawSketch = () => {
    for (const shape of shapes) draw(shape);
    Mouse.drawAtCursor(drawCursor);
  };
  const draw$1 = () => {
    updateSketch();
    drawBackground();
    canvas.drawScaled(drawSketch);
  };
  const searchShape = () => {
    Mouse.updatePosition();
    const { x: mx, y: my } = Mouse.position;
    for (const shape of shapes) {
      if (collides(shape, mx, my, cursorSize / 2)) return shape;
    }
  };
  const mousePressed = () => {
    Mouse.updatePosition();
    const { x: mx, y: my } = Mouse.position;
    epicenters.push(create$1(mx, my));
    return false;
  };
  const mouseMoved = () => {
    Mouse.updatePosition();
    const shape = searchShape();
    if (shape) impact(shape);
    return false;
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
    draw: draw$1,
    keyTyped,
    mousePressed,
    mouseMoved,
    mouseDragged: mouseMoved,
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
