import * as p5ex from 'p5ex';

export default class Attractor {
  static pieceCountLevel: number = 1;

  protected particle: Particle;
  protected graphics: p5.Graphics;
  protected position: p5.Vector;
  protected checkTimer: p5ex.NonLoopedFrameCounter;
  protected disappearanceDelayTimer: p5ex.NonLoopedFrameCounter;
  protected disappearanceTimer: p5ex.NonLoopedFrameCounter;
  protected repetitionPerFrame: number;
  protected color: p5.Color;
  protected layeredGraphics: p5.Graphics;
  protected retryCount: number = 0;

  constructor(
    protected readonly p: p5ex.p5exClass,
    x: number,
    y: number,
    protected readonly size: number,
  ) {
    this.position = p.createVector(x, y);
    this.checkTimer = new p5ex.NonLoopedFrameCounter(
      0.1 * p.idealFrameRate,
      () => {
        if (this.check() || this.retryCount > 10) {
          this.retryCount = 0;
          this.disappearanceDelayTimer.on();
        } else {
          this.retryCount += 1;
          this.reset();
        }
      },
    );
    this.disappearanceTimer = new p5ex.NonLoopedFrameCounter(
      1 * p.idealFrameRate,
      () => { this.reset(); },
    ).off();
    this.repetitionPerFrame = (24000 / p.idealFrameRate) / Attractor.pieceCountLevel;

    this.reset();
  }

  reset(): void {
    const p = this.p;

    this.checkTimer.resetCount().on();
    this.disappearanceDelayTimer = new p5ex.NonLoopedFrameCounter(
      Math.floor(p.random(7, 9) * p.idealFrameRate),
      () => { this.disappearanceTimer.on(); },
    ).off();
    this.disappearanceTimer.resetCount().off();

    this.graphics = p.createGraphics(this.size, this.size);
    (this.graphics as any).pixelDensity(1);
    this.layeredGraphics = p.createGraphics(this.size, this.size);
    (this.layeredGraphics as any).pixelDensity(1);
    (this.layeredGraphics as any).noStroke();

    const g = this.graphics as any;
    g.textFont('Georgia', this.size / 30);

    switch (Math.floor(Math.random() * 3)) {
      default:
      case 0:
        this.color = p.color(224, 255, 255, 32);
        break;
      case 1:
        this.color = p.color(255, 224, 255, 32);
        break;
      case 2:
        this.color = p.color(255, 255, 224, 32);
        break;
    }
    g.stroke(this.color);
    g.translate(this.size / 2, this.size / 2);
    g.rectMode(p.CENTER);

    this.particle = new Particle(this.p, 0.22 * this.size);
  }

  check(): boolean {
    const g: any = this.graphics;
    g.loadPixels();

    let coloredPixelCount = 0;
    let totalAlpha = 0;
    for (let i = 3, len = g.pixels.length; i < len; i += 4) {
      if (g.pixels[i] > 0) {
        coloredPixelCount += 1;
        totalAlpha += g.pixels[i];
      }
    }

    const totalPixels = g.pixels.length / 4;
    const pixelPopulationRatio = coloredPixelCount / totalPixels;
    const alphaValueRatio = totalAlpha / (this.size * 255);
    alphaValueRatio;

    return pixelPopulationRatio > 0.002 && alphaValueRatio > 0.00025;
  }

  draw(): void {
    this.checkTimer.step();

    this.p.setCurrentRenderer(this.graphics);
    this.p.currentRenderer.stroke(this.color);

    for (let i = 0, len = this.repetitionPerFrame; i < len; i += 1) {
      this.particle.draw();
    }

    if (!this.checkTimer.isCompleted) return;

    this.disappearanceDelayTimer.step();
    this.disappearanceTimer.step();

    if (this.disappearanceTimer.isOn) {
      const sz = this.size;
      const layeredGraphics: any = this.layeredGraphics;
      layeredGraphics.copy(this.graphics, 0, 0, sz, sz, 0, 0, sz, sz);

      layeredGraphics.fill(0, 255 * this.disappearanceTimer.getProgressRatio());
      layeredGraphics.rect(0, 0, sz, sz);
      this.p.image(layeredGraphics, this.position.x, this.position.y);
    } else {
      this.p.image(this.graphics, this.position.x, this.position.y);
    }
  }
}

class Particle {
  readonly a: number;
  readonly b: number;
  readonly c: number;
  readonly d: number;
  readonly previousPosition: p5.Vector;
  readonly position: p5.Vector;

  constructor(
    protected readonly p: p5ex.p5exClass,
    protected readonly scaleFactor: number,
  ) {
    this.position = p5.Vector.random2D().mult(p.random(0.01));
    this.previousPosition = p.createVector();

    do {
      this.a = p5ex.randomSign(p.random(0.1, 2.5));
      this.b = p5ex.randomSign(p.random(0.1, 2.5));
      this.c = p5ex.randomSign(p.random(0.1, 2.5));
      this.d = p5ex.randomSign(p.random(0.1, 2.5));
    } while (!this.checkParameters());

    // this.printParameters();

    // this.a = -2;
    // this.b = -2;
    // this.c = -1.2;
    // this.d = 2;
  }

  draw(): void {
    this.previousPosition.set(this.position);
    this.position.set(
      Math.sin(this.a * this.previousPosition.y) - Math.cos(this.b * this.previousPosition.x),
      Math.sin(this.c * this.previousPosition.x) - Math.cos(this.d * this.previousPosition.y),
    );

    const x = this.scaleFactor * this.position.x;
    const y = this.scaleFactor * this.position.y;

    this.p.currentRenderer.point(x, y);
  }

  checkParameters(): boolean {
    return (
      Math.abs(this.a) +
      Math.abs(this.b) +
      Math.abs(this.c) +
      Math.abs(this.d)
      > 4
    );
  }

  printParameters(): void {
    console.log(
      Math.round(this.a * 100) / 100 + ',\n' +
      Math.round(this.b * 100) / 100 + ',\n' +
      Math.round(this.c * 100) / 100 + ',\n' +
      Math.round(this.d * 100) / 100,
    );
  }
}
