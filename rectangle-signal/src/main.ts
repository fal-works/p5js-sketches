import * as p5ex from 'p5ex';
import { createGradationRectangle } from './functions';

(p5 as any).disableFriendlyErrors = true;

const SKETCH_NAME = 'RectangleSignal';

new (p5 as any)();

class RectangleSignalUnit implements p5ex.Sprite {
  position: p5.Vector;
  width: number;
  height: number;
  color: p5ex.ShapeColor;
  appearanceDelayTimer: p5ex.NonLoopedFrameCounter;
  appearanceTimer: p5ex.NonLoopedFrameCounter;
  disappearanceDelayTimer: p5ex.NonLoopedFrameCounter;
  disappearanceTimer: p5ex.NonLoopedFrameCounter;
  timers: p5ex.SteppableArray<p5ex.FrameCounter>;

  constructor(
    protected readonly p: p5ex.p5exClass,
    topY: number,
    maxBottomY: number,
    appearanceDelayDuration: number = 0,
  ) {
    const r = Math.random();
    this.width = 5 + p.sq(r) * 600;
    this.height = Math.min(5 + p.sq(1 - r) * 100, maxBottomY - topY);
    this.position = p.createVector(0, topY + 0.5 * this.height);
    this.color = new p5ex.ShapeColor(p, null, p.color(40, 40, 40));
    this.appearanceDelayTimer = new p5ex.NonLoopedFrameCounter(
      appearanceDelayDuration,
      () => { this.appearanceTimer.on(); },
    );
    this.appearanceTimer = new p5ex.NonLoopedFrameCounter(
      30,
      () => { this.disappearanceDelayTimer.on(); },
    ).off();
    this.disappearanceDelayTimer = new p5ex.NonLoopedFrameCounter(
      60,
      () => { this.disappearanceTimer.on(); },
    ).off();
    this.disappearanceTimer = new p5ex.NonLoopedFrameCounter(30).off();
    this.timers = new p5ex.SteppableArray<p5ex.FrameCounter>(4);
    this.timers.pushRawArray([
      this.appearanceDelayTimer,
      this.appearanceTimer,
      this.disappearanceDelayTimer,
      this.disappearanceTimer,
    ]);
  }

  step(): void {
    this.timers.step();
  }

  draw(): void {
    if (this.appearanceDelayTimer.isOn) return;

    let widthFactor = 0;

    if (this.appearanceTimer.isOn) {
      widthFactor = p5ex.easeOutBack(this.appearanceTimer.getProgressRatio());
    } else if (this.disappearanceDelayTimer.isOn) {
      widthFactor = 1;
    } else {
      widthFactor = 1 - Math.pow(this.disappearanceTimer.getProgressRatio(), 4);
    }

    this.color.applyColor();
    this.p.rect(this.position.x, this.position.y, widthFactor * this.width, this.height, 2);
  }
}

const sketch = (p: p5ex.p5exClass) => {
  // ---- constants
  let backgroundPixels: number[];

  // ---- variables
  let signal: p5ex.SpriteArray<RectangleSignalUnit>;
  let timeoutId = -1;

  // ---- functions
  function createBackgroundPixels(): number[] {
    const g = createGradationRectangle(
      p,
      p.width,
      p.height,
      p.color(255, 255, 255),
      p.color(248, 248, 248),
      p.color(228, 224, 232),
      4,
    ) as any;
    p.image(g, 0, 0);
    p.loadPixels();

    return p.pixels;
  }

  function mouseIsInCanvas(): boolean {
    if (p.mouseX < 0) return false;
    if (p.mouseX > p.width) return false;
    if (p.mouseY < 0) return false;
    if (p.mouseY > p.height) return false;

    return true;
  }

  function createSignal(appearanceInterval: number = 0): p5ex.SpriteArray<RectangleSignalUnit> {
    const signal = new p5ex.SpriteArray<RectangleSignalUnit>();

    let y: number = 10;
    let appearanceTiming = 0;

    while (y < p.nonScaledHeight - 15) {
      const unit = new RectangleSignalUnit(p, y, p.nonScaledHeight - 10, appearanceTiming);
      signal.push(unit);
      y += 10 + unit.height;
      appearanceTiming += appearanceInterval;
    }

    return signal;
  }

  function updateSignal(): void {
    if (p.frameCount % 180 !== 0) return;

    if (p.frameCount % 360 === 0) signal = createSignal(4);
    else signal = createSignal();
  }


  // ---- Setup & Draw etc.
  p.preload = () => {
  };

  p.setup = () => {
    (window as any).noCanvas();
    p.createScalableCanvas(
      p5ex.ScalableCanvasTypes.FULL,
    );

    backgroundPixels = createBackgroundPixels();

    p.rectMode(p.CENTER);

    signal = createSignal(4);
  };

  p.draw = () => {
    p.pixels = backgroundPixels;
    p.updatePixels();
    p.scalableCanvas.scale();

    updateSignal();

    signal.step();
    p.translate(0.5 * p.nonScaledWidth, 0);
    signal.draw();
    p.translate(-0.5 * p.nonScaledWidth, 0);
  };

  p.windowResized = () => {
    p.resizeScalableCanvas();

    if (timeoutId !== -1) clearTimeout(timeoutId);
    timeoutId = setTimeout(
      () => { backgroundPixels = createBackgroundPixels(); },
      200,
    );
  };

  p.mousePressed = () => {

  };

  p.touchMoved = () => {
    if (!mouseIsInCanvas()) return;

    return false;
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);
