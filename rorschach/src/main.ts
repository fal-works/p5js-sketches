import * as p5ex from "p5ex";
import { RorschachShape } from "./RorschachShape";

const SKETCH_NAME = "Rorschach";

const sketch = (p: p5ex.p5exClass): void => {
  // ---- variables
  const IDEAL_FRAME_RATE = 60;

  let unitLength: number;

  let backgroundColor: p5.Color;
  let frameCounter: p5ex.NonLoopedFrameCounter;
  let rorschachShape: RorschachShape;
  let rorschachShapeColor: p5ex.ShapeColor;

  // ---- functions
  function initialize(): void {
    unitLength = Math.min(p.nonScaledWidth, p.nonScaledHeight) / 640;
    p.strokeWeight(Math.max(1, 1 * unitLength));

    p.background(backgroundColor);

    const rorschachShapeSize = 480 * unitLength;
    rorschachShape = new RorschachShape(p, frameCounter, {
      shapeSize: rorschachShapeSize,
      vertexCount: Math.floor(1.5 * rorschachShapeSize),
      noiseDistanceScale: p.random(0.005, 0.05), // random(0.3, 1.5),
      noiseMagnitudeFactor: p.random(1, 4),
      noiseTimeScale: 0.0005
    });
    rorschachShape.centerPosition.set(
      0.5 * p.nonScaledWidth,
      0.5 * p.nonScaledHeight
    );
    rorschachShape.rotationAngle = p.PI + p.HALF_PI;

    rorschachShapeColor = new p5ex.ShapeColor(
      p,
      p.color(0, p.random(4, 48)),
      null,
      false
    );

    frameCounter.resetCount();
    frameCounter.on();
    p.loop();
  }

  // ---- Setup & Draw etc.
  p.preload = () => {};

  p.setup = () => {
    p.createScalableCanvas(p5ex.ScalableCanvasTypes.SQUARE640x640);

    p.frameRate(IDEAL_FRAME_RATE);
    p.strokeJoin(p.ROUND);

    backgroundColor = p.color(252);
    frameCounter = new p5ex.NonLoopedFrameCounter(13 * IDEAL_FRAME_RATE, () => {
      p.noLoop();
    });

    initialize();
  };

  p.draw = () => {
    rorschachShape.step();

    p.scalableCanvas.scale();
    rorschachShapeColor.applyColor();
    rorschachShape.draw();
    p.scalableCanvas.cancelScale();

    frameCounter.step();
  };

  p.mousePressed = () => {
    initialize();
  };

  p.keyTyped = () => {
    if (p.key === "p") p.noLoop();

    if (p.keyCode === 83) p.save("rorschach.png");
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);
