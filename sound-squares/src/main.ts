import * as p5ex from 'p5ex';
import ObjectPool from './ObjectPool';

(p5 as any).disableFriendlyErrors = true;

const SKETCH_NAME = 'SoundSquares';
const OPENPROCESSING = true;

if (OPENPROCESSING) new (p5 as any)();

// function sum(array: number[]): number {
//   return array.reduce((prev, current, i, array) => {
//     return prev + current;
//   });
// }
// function average(array: number[]): number {
//   return sum(array) / array.length;
// }

class Square implements p5ex.CleanableSprite {
  static color: p5ex.ShapeColor;
  static isInitialized = false;

  public isToBeRemoved: boolean = false;
  protected parent: SquareGenerator;
  protected x: number;
  protected y: number;
  protected size: number;
  protected timer: p5ex.NonLoopedFrameCounter;
  protected shrinkRatio: number = 0;

  constructor(
    protected p: p5ex.p5exClass,
  ) {
    if (!Square.isInitialized) {
      Square.color = new p5ex.ShapeColor(p, p.color(0, 128), undefined, true);
      Square.isInitialized = true;
    }

    this.timer = new p5ex.NonLoopedFrameCounter(30, () => {
    });
  }

  set(
    parent: SquareGenerator,
    x: number,
    y: number,
    size: number,
  ): Square {
    this.isToBeRemoved = false;
    this.parent = parent;
    this.x = x;
    this.y = y;
    this.size = size;
    this.timer.resetCount().on();
    this.shrinkRatio = this.p.random(-0.1, 0.3);

    return this;
  }

  step(): void {
    this.timer.step();
  }

  clean(): void {
    if (this.timer.isCompleted) {
      this.isToBeRemoved = true;
      this.parent.pool.put(this);
    }
  }

  draw(): void {
    const ratio = 1 - this.timer.getProgressRatio();

    if (ratio < 0.001) return;

    Square.color.applyColor(255 * ratio);
    const size = this.size * ((1 - this.shrinkRatio) + this.shrinkRatio * ratio);
    this.p.rect(this.x, this.y, size, size);
  }
}

class SquareGenerator implements p5ex.CleanableSprite {
  public isToBeRemoved = false;
  public isActive: boolean = false;
  protected analyzer: p5.Amplitude;
  protected squares = new p5ex.CleanableSpriteArray<Square>(128);
  protected rotationAngle = Math.PI / 4;
  public pool: ObjectPool<Square>;

  constructor (protected readonly p: p5ex.p5exClass) {
    this.analyzer = new p5.Amplitude();
    this.pool = new ObjectPool(() => { return new Square(p); }, 128);
  }

  step(): void {
    if (!this.isActive) return;

    this.squares.step();

    const sizeScaleFactor = 0.85 * this.p.nonScaledWidth;
    const halfSize = Math.min(
      this.p.random(0.5, 1) * sizeScaleFactor * this.analyzer.getLevel(),
      0.4 * this.p.nonScaledWidth,
    );
    this.generate(halfSize);
    this.generate(halfSize);

    this.rotationAngle += 0.002;
  }

  generate(halfSize: number): void {
    const size = 2 * halfSize;
    let x: number;
    let y: number;

    switch (p5ex.randomInt(4)) {
      default:
      case 0:
        x = 1;
        y = 1;
        break;
      case 1:
        x = -1;
        y = 1;
        break;
      case 2:
        x = -1;
        y = -1;
        break;
      case 3:
        x = 1;
        y = -1;
        break;
    }

    const range = 0.2 * size;
    x *= halfSize - Math.random() * range;
    y *= halfSize - Math.random() * range;

    this.squares.push(
      this.pool.get().set(
        this,
        x,
        y,
        size,
      ),
    );
  }

  clean(): void {
    this.squares.clean();
  }

  draw(): void {
    if (!this.isActive) return;

    this.p.noFill();

    this.p.translate(0.5 * this.p.nonScaledWidth, 0.5 * this.p.nonScaledHeight);
    this.p.rotate(this.rotationAngle);
    this.squares.draw();
  }
}


const sketch = (p: p5ex.p5exClass) => {
  // ---- constants
  const filePath = './assets/bgml060.mp3';
  const soundVolume = 1.0;

  const textColor = p.color(96);

  // const waveformAmplitudeProcessor = (n: number) => {
  //   const sign = n >= 0 ? 1 : -1;
  //   return sign * p5ex.easeOutQuad(Math.abs(n));
  // };

  // const spectrumLowestFrequencyRatio = 0;
  // const spectrumHighestFrequencyRatio = 0.17;

  // ---- variables
  let sound: p5.SoundFile;
  let squareGenerator: SquareGenerator;
  let backgroundPixels: number[];
  let timeoutId = -1;

  // ---- functions
  function createGradationRectangle(
    p: p5,
    w: number,
    h: number,
    backgroundColor: p5.Color,
    fromColor: p5.Color,
    toColor: p5.Color,
  ): p5.Graphics {
    const g = p.createGraphics(w, h) as any;
    g.background(backgroundColor);
    g.strokeWeight(2);

    for (let y = 0; y < h; y += 1) {
      const lerpRatio = y / (h - 1);
      g.stroke(p.lerpColor(fromColor, toColor, lerpRatio));
      g.line(0, y, w - 1, y);
    }

    return g;
  }

  function createBackgroundPixels(): number[] {
    const g = createGradationRectangle(
      p,
      p.width,
      p.height,
      p.color(255, 255, 255),
      p.color(255, 255, 255),
      p.color(244, 244, 248),
    );
    p.image(g, 0, 0);
    p.loadPixels();

    return p.pixels;
  }

  function drawMessage(): void {
    if (squareGenerator.isActive) return;

    p.background(p.color(255));
    p.noStroke();
    p.fill(textColor);
    p.text('Please wait a few seconds for loading music...', 100, 60);
  }

  // ---- Setup & Draw etc.
  p.preload = () => {
    sound = new p5.SoundFile(filePath, () => {
      sound.setVolume(soundVolume);
      sound.loop();
      p.background(255);
      squareGenerator.isActive = true;
    });
  };

  p.setup = () => {
    if (OPENPROCESSING) (window as any).noCanvas();

    p.createScalableCanvas(
      p5ex.ScalableCanvasTypes.SQUARE640x640,
    );

    p.setFrameRate(30);

    p.rectMode(p.CENTER);
    p.textFont('Georgia', 20);

    backgroundPixels = createBackgroundPixels();

    squareGenerator = new SquareGenerator(p);
  };

  p.draw = () => {
    p.pixels = backgroundPixels;
    p.updatePixels();
    p.scalableCanvas.scale();

    drawMessage();

    squareGenerator.step();
    squareGenerator.clean();
    squareGenerator.draw();
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
    // if (sound.isPlaying()) sound.pause(); else sound.play();
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);
