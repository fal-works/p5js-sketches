/**
 * Non-Physics 2.
 * Source code in TypeScript: https://github.com/fal-works/p5js-sketches/tree/master/non-physics-2
 *
 * @copyright 2020 FAL
 * @version 0.1.0
 */

(function (p5ex, CCC) {
  "use strict";

  /**
   * ---- Common ----------------------------------------------------------------
   */
  const {
    Numeric: { lerp, square },
    ArrayList,
    HSV,
    Random,
    Easing,
    Angle: { QUARTER_PI },
    Timer,
    Timer: { Set: TimerSet },
    Arrays,
  } = CCC;
  const {
    onSetup,
    onInstantiate,
    translate,
    undoTranslate,
    drawTransformed,
    ShapeColor,
  } = p5ex;
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
  const HTML_ELEMENT_ID = "NonPhysics2";
  /** The logical width of the canvas. */
  const LOGICAL_CANVAS_WIDTH = 800;
  /** The logical height of the canvas. */
  const LOGICAL_CANVAS_HEIGHT = 800;

  /**
   * ---- Shape unit -------------------------------------------------------------
   */
  const rectangle = () => {
    const width = Random.between(40, 90);
    const height = Random.between(40, 90);
    return () => p.rect(0, 0, width, height);
  };
  const triangle = () => {
    const size = Random.between(40, 80);
    switch (Random.Integer.value(4)) {
      case 0:
        return () => p.triangle(0, 0, 0, size, size, size);
      case 1:
        return () => p.triangle(0, 0, size, 0, 0, size);
      case 2:
        return () => p.triangle(0, 0, size, 0, size, size);
      case 3:
        return () => p.triangle(0, size, size, size, size, 0);
      default:
        throw "Unexpected value.";
    }
  };
  const create = (x, y, clockwise, color) => ({
    x,
    y,
    clockwise,
    color,
    drawShape: Math.random() < 0.5 ? rectangle() : triangle(),
  });
  const draw = (unit, visibility) => {
    const { x, y, clockwise, color, drawShape } = unit;
    ShapeColor.apply(color, visibility * 255.0);
    const angle = (clockwise ? 1.0 : -1.0) * visibility * 4.0 * Math.PI;
    drawTransformed(drawShape, x, y, angle, visibility);
  };

  /**
   * ---- Shape set --------------------------------------------------------------
   */
  let blue;
  let purple;
  let green;
  let yellow;
  p5ex.onSetup.push(() => {
    blue = p5ex.ShapeColor.create("#3232FF", undefined, 256);
    purple = p5ex.ShapeColor.create("#B72DE5", undefined, 256);
    green = p5ex.ShapeColor.create("#20D84E", undefined, 256);
    yellow = p5ex.ShapeColor.create("#D8D820", undefined, 256);
  });
  const createUnits = () => {
    const colors = Random.bool(0.7) ? [blue, purple] : [green, yellow];
    const units = [];
    for (let i = 0; i < 3; i += 1)
      units.push(
        create(
          Random.signed(30),
          Random.signed(30),
          Random.bool(0.5),
          Random.Arrays.get(colors)
        )
      );
    return units;
  };
  const create$1 = (x, y) => ({
    x,
    y,
    units: createUnits(),
    visibility: 0.0,
  });
  const draw$1 = (shapeSet) => {
    translate(shapeSet.x, shapeSet.y);
    for (const unit of shapeSet.units) draw(unit, shapeSet.visibility);
    undoTranslate();
  };

  /**
   * ---- Sketch ----------------------------------------------------------------
   */
  let drawBackground;
  const timers = TimerSet.create(64);
  let shapes = [];
  const createBackground = () => {
    p.background(252);
    return p5ex.storePixels();
  };
  const createShapeSet = (x, y) => {
    const shapeSet = create$1(x, y);
    shapes.push(shapeSet);
    const appear = Timer.create({
      duration: 60,
      onProgress: (progress) => {
        const ratio = progress.ratio;
        const easedRatio = Easing.Out.expo(ratio);
        shapeSet.visibility = easedRatio;
      },
    });
    const wait = Timer.create({ duration: Random.Integer.between(60, 180) });
    const disappear = Timer.create({
      duration: 60,
      onProgress: (progress) => {
        const ratio = progress.ratio;
        const easedRatio = Easing.In.expo(ratio);
        shapeSet.visibility = 1.0 - easedRatio;
      },
      onComplete: () => {
        shapes.splice(shapes.indexOf(shapeSet), 1);
        createShapeSet(x, y);
      },
    });
    const timer = Timer.chain([appear, wait, disappear]);
    TimerSet.add(timers, timer);
  };
  const createShapes = () => {
    shapes = [];
    TimerSet.clear(timers);
    const { width, height } = canvas.logicalSize;
    for (let x = width / 20; x < width; x += width / 5) {
      for (let y = height / 20; y < height; y += height / 5) {
        createShapeSet(x, y);
      }
    }
  };
  const reset = () => {
    drawBackground = createBackground();
    createShapes();
  };
  const initialize = () => {
    reset();
    p.strokeWeight(2);
    p.noFill();
    const { scaleFactor } = canvas;
    context.shadowOffsetX = scaleFactor * 3;
    context.shadowOffsetY = scaleFactor * 3;
    context.shadowBlur = scaleFactor * 12;
    context.shadowColor = `rgba(0, 0, 0, 0.3)`;
  };
  const updateSketch = () => {
    TimerSet.step(timers);
  };
  const drawSketch = () => {
    for (const shapeSet of shapes) draw$1(shapeSet);
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
    logicalCanvasWidth: LOGICAL_CANVAS_WIDTH,
    logicalCanvasHeight: LOGICAL_CANVAS_HEIGHT,
    initialize: initialize,
    windowResized: () => canvas.resizeIfNeeded(),
    onCanvasResized: reset,
    p5Methods: p5Methods,
  });
})(p5ex, CreativeCodingCore);
//# sourceMappingURL=sketch.js.map
