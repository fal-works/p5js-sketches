import * as p5ex from 'p5ex';

(p5 as any).disableFriendlyErrors = true;

const SKETCH_NAME = 'RectangleLogos';
const OPENPROCESSING = true;

if (OPENPROCESSING) new (p5 as any)();

class Logo implements p5ex.Sprite {
  protected readonly position: p5.Vector;
  protected color: p5ex.ShapeColor;
  protected data: { x: number, y: number, w: number, h: number }[];
  protected readonly appearanceTimer: p5ex.NonLoopedFrameCounter;
  protected readonly pauseTimer: p5ex.NonLoopedFrameCounter;
  protected readonly disappearanceTimer: p5ex.NonLoopedFrameCounter;

  constructor(
    protected readonly p: p5ex.p5exClass,
    protected readonly size: number,
    x: number,
    y: number,
  ) {
    this.position = p.createVector(x + 0.5 * size, y + 0.5 * size);
    this.reset();

    this.appearanceTimer = new p5ex.NonLoopedFrameCounter(
      30,
      () => {
        this.pauseTimer.resetCount().on();
      },
    );
    this.pauseTimer = new p5ex.NonLoopedFrameCounter(
      p5ex.randomIntBetween(60, 180),
      () => {
        this.disappearanceTimer.resetCount().on();
      },
    ).off();
    this.disappearanceTimer = new p5ex.NonLoopedFrameCounter(
      30,
      () => {
        this.appearanceTimer.resetCount().on();
        this.reset();
      },
    ).off();
  }

  reset(): void {
    const p = this.p;
    const size = this.size;
    this.color = new p5ex.ShapeColor(
      p,
      null,
      p.color(p.random(['#000d1a', '#003070', '#808080'])),
    );
    const data: { x: number, y: number, w: number, h: number }[] = [];

    data.push({ x: 0, y: 0, w: p.random(0.3, 0.8) * size, h: p.random(0.05, 0.3) * size });
    data.push({
      x: p.random(-0.2, 0.2) * size,
      y: -0.25 * size,
      w: p.random(0.2, 0.5) * size,
      h: Math.min(p.random(0.05, 0.2) * size, (0.25 * size - (data[0].h / 2 + 0.05 * size)) * 2),
    });
    data.push({
      x: p.random(-0.2, 0.2) * size,
      y: 0.25 * size,
      w: p.random(0.2, 0.5) * size,
      h: Math.min(p.random(0.05, 0.2) * size, (0.25 * size - (data[0].h / 2 + 0.05 * size)) * 2),
    });

    this.data = data;
  }

  step(): void {
    this.appearanceTimer.step();
    this.pauseTimer.step();
    this.disappearanceTimer.step();
  }

  draw(): void {
    const p = this.p;
    this.color.applyColor();
    const scaleFactor = this.appearanceTimer.isOn ?
      p5ex.easeOutQuart(this.appearanceTimer.getProgressRatio()) :
      this.pauseTimer.isOn ? 1 : 1 - p.pow(this.disappearanceTimer.getProgressRatio(), 4);

    if (scaleFactor < 0.001) return;

    p.translate(this.position.x, this.position.y);
    p.scale(scaleFactor);
    p.rotate(-p.QUARTER_PI);
    for (let i = 0, len = this.data.length; i < len; i += 1) {
      p.rect(this.data[i].x, this.data[i].y, this.data[i].w, this.data[i].h);
    }
    p.rotate(p.QUARTER_PI);
    p.scale(1 / scaleFactor);
    p.translate(-this.position.x, -this.position.y);
  }
}

const sketch = (p: p5ex.p5exClass) => {
  // ---- constants
  const columns = 5;
  const rows = 5;
  const backgroundColor = p.color(248);

  // ---- variables
  const logos = new p5ex.SpriteArray<Logo>();

  // ---- Setup & Draw etc.
  p.preload = () => {
  };

  p.setup = () => {
    if (OPENPROCESSING) (window as any).noCanvas();
    p.createScalableCanvas(
        p5ex.ScalableCanvasTypes.SQUARE640x640,
      );

    p.noStroke();
    p.rectMode(p.CENTER);

    const logoAreaWidth = p.nonScaledWidth / columns;
    const logoAreaHeight = p.nonScaledHeight / rows;
    const logoSize = Math.min(logoAreaWidth, logoAreaHeight);

    for (let i = 0; i < columns; i += 1) {
      for (let k = 0; k < rows; k += 1) {
        logos.push(new Logo(p, logoSize, i * logoAreaWidth, k * logoAreaHeight));
      }
    }
  };

  p.draw = () => {
    p.background(backgroundColor);
    p.scalableCanvas.scale();

    logos.step();
    logos.draw();

    p.scalableCanvas.cancelScale();
  };

  p.windowResized = () => {
    p.resizeScalableCanvas();
  };

  p.mousePressed = () => {
  };

  p.touchMoved = () => {
      // return false;
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);
