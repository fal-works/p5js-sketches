import * as p5ex from "p5ex";

const SKETCH_NAME = "Kalamari";

interface NumberRange {
  readonly start: number;
  readonly end: number;
}

const sketch = (p: p5ex.p5exClass): void => {
  // ---- variables
  let pointCount: number;
  let backgroundColor: p5.Color;
  let pointList: p5.Vector[];
  let velocityList: p5.Vector[];
  let frameCounter: p5ex.NonLoopedFrameCounter;
  let lightnessRange: NumberRange;
  let chromaRange: NumberRange;
  let hueRange: NumberRange;
  let alphaRange: NumberRange;
  let curveTightnessRange: NumberRange;

  // ---- functions
  function initialize(): void {
    p.background(backgroundColor);

    pointList = [];
    velocityList = [];

    pointCount = p5ex.randomIntBetween(8, 24);

    for (let i = 0; i < pointCount; i++) {
      pointList.push(
        p.createVector(
          p.random(0.15, 0.85) * p.width,
          p.random(0.15, 0.85) * p.height
        )
      );
      velocityList.push(p5.Vector.random2D().mult(p.random(0.05, 0.3)));
    }

    lightnessRange = { start: p.random(0, 100), end: p.random(0, 100) };
    chromaRange = { start: p.random(30, 120), end: p.random(30, 120) };
    hueRange = { start: p.random(p.TWO_PI), end: p.random(p.TWO_PI) };
    curveTightnessRange = { start: p.random(-1, 0.5), end: p.random(-1, 0.5) };
    alphaRange = { start: p.random(8, 32), end: p.random(8, 32) };

    frameCounter
      .resetCount()
      .on(Math.floor(p.random(60, 180) * p.scalableCanvas.scaleFactor));
    p.loop();
  }

  // ---- Setup & Draw etc.
  p.preload = () => {};

  p.setup = () => {
    p.createScalableCanvas(p5ex.ScalableCanvasTypes.SQUARE640x640);

    backgroundColor = p.color(252);
    p.noFill();

    frameCounter = new p5ex.NonLoopedFrameCounter(60, () => {
      p.noLoop();
    }).on();

    initialize();
  };

  p.draw = () => {
    const progressRatio = frameCounter.getProgressRatio();
    const lightnessValue = p.lerp(
      lightnessRange.start,
      lightnessRange.end,
      progressRatio
    );
    const chromaValue = p.lerp(
      chromaRange.start,
      chromaRange.end,
      progressRatio
    );
    const hueValue = p.lerp(hueRange.start, hueRange.end, progressRatio);
    const alphaValue = p.lerp(alphaRange.start, alphaRange.end, progressRatio);
    const curveColor = p.color(
      p5ex.cielchColor(lightnessValue, chromaValue, hueValue, alphaValue)
    );
    p.stroke(curveColor);

    const tightnessValue = p.lerp(
      curveTightnessRange.start,
      curveTightnessRange.end,
      progressRatio
    );
    p.curveTightness(tightnessValue);

    p.beginShape();
    for (let i = 0, len = pointCount + 3; i < len; i++) {
      const index = i % pointCount;
      const point = pointList[index];
      p.curveVertex(point.x, point.y);
      point.add(velocityList[index]);
    }
    p.endShape();

    frameCounter.step();
  };

  p.mousePressed = () => {
    initialize();
  };

  p.keyTyped = () => {
    if (p.key === "p") p.noLoop();

    if (p.keyCode === 83) p.save("kalamari.png");
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);
