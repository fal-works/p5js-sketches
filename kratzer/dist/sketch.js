/**
 * Kratzer.
 * Source code in TypeScript: https://github.com/fal-works/p5js-sketches/tree/master/kratzer
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
  } = CCC;
  const {
    onSetup,
    onInstantiate,
    drawTextureRowByRow,
    translateRotate,
    undoTranslateRotate,
    AlphaColor,
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
  const HTML_ELEMENT_ID = "Kratzer";
  /** The logical height of the canvas. */
  const LOGICAL_CANVAS_HEIGHT = 800;

  /**
   * Line.
   */
  const create = (x, y, angle, easing, delayDuration) => {
    const displacementX = 400 * Math.cos(angle);
    const displacementY = 400 * Math.sin(angle);
    const startX = x - displacementX;
    const startY = y - displacementY;
    const endX = x + displacementX;
    const endY = y + displacementY;
    const unit = {
      x: startX,
      y: startY,
      length: 0,
      angle,
      alpha: 0,
    };
    const { easeAppear, easeDisappear } = easing;
    const length = Random.Curved.between(square, 50, 400);
    const delay = Timer.create({ duration: delayDuration });
    const appear = Timer.create({
      duration: 60,
      onProgress: (progress) => {
        const { ratio } = progress;
        const easedRatio = easeAppear(progress.ratio);
        unit.x = lerp(startX, x, easedRatio);
        unit.y = lerp(startY, y, easedRatio);
        unit.length = length * easedRatio;
        unit.alpha = 255 * ratio;
      },
    });
    const wait = Timer.create({ duration: 60 });
    const disappear = Timer.create({
      duration: 60,
      onProgress: (progress) => {
        const { ratio } = progress;
        const easedRatio = easeDisappear(progress.ratio);
        unit.x = lerp(x, endX, easedRatio);
        unit.y = lerp(y, endY, easedRatio);
        unit.length = length * (1 - easedRatio);
        unit.alpha = 255 * (1 - ratio);
      },
    });
    const timer = Timer.chain([delay, appear, wait, disappear]);
    return { unit, timer };
  };
  let alphaColor;
  p5ex.onSetup.push(() => (alphaColor = AlphaColor.create(32, 256)));
  const draw = (line) => {
    const { x, y, length, angle, alpha } = line;
    if (alpha < 1) return;
    translateRotate(x, y, angle);
    const halfLen = length / 2;
    p.stroke(AlphaColor.get(alphaColor, alpha));
    p.line(-halfLen, 0, halfLen, 0);
    undoTranslateRotate();
  };

  /**
   * ---- Sketch ----------------------------------------------------------------
   */
  let drawBackground;
  const timers = TimerSet.create(64);
  let lines = [];
  const easing = {
    easeAppear: Easing.Out.expo,
    easeDisappear: Easing.In.expo,
  };
  const createBackground = () => {
    p.background(255);
    const maxY = canvas.logicalSize.height;
    drawTextureRowByRow((setPixelRow, y) => {
      const blackness = Math.pow(y / maxY, 3);
      setPixelRow(
        y,
        255 * (1 - 0.1 * blackness),
        255 * (1 - 0.1 * blackness),
        255 * (1 - 0.08 * blackness),
        255
      );
    }, p);
    return p5ex.storePixels();
  };
  const createLines = () => {
    lines = [];
    TimerSet.clear(timers);
    const { width, height } = canvas.logicalSize;
    const countFactor = Math.max(width, height) / Math.min(width, height);
    const count = Math.round(countFactor * 20);
    for (let i = 0; i < count; i += 1) {
      const line = create(
        width * Random.between(0.25, 0.75),
        height * Random.between(0.25, 0.75),
        Random.bool(0.5) ? QUARTER_PI : -QUARTER_PI,
        easing,
        i
      );
      lines.push(line.unit);
      TimerSet.add(timers, line.timer);
    }
  };
  const reset = () => {
    drawBackground = createBackground();
    createLines();
  };
  const initialize = () => {
    reset();
    p.strokeWeight(3);
    const { scaleFactor } = canvas;
    context.shadowOffsetX = scaleFactor * 4;
    context.shadowOffsetY = scaleFactor * 16;
    context.shadowBlur = scaleFactor * 12;
    context.shadowColor = `rgba(0, 0, 0, 0.4)`;
  };
  const updateSketch = () => {
    if (timers.runningComponents.size === 0) createLines();
    TimerSet.step(timers);
  };
  const drawSketch = () => {
    for (const lineUnit of lines) draw(lineUnit);
  };
  const draw$1 = () => {
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
    draw: draw$1,
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
