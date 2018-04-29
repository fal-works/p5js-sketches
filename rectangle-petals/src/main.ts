import * as p5ex from 'p5ex';
import { createGradationRectangle, applyRandomTexture } from './functions';

(p5 as any).disableFriendlyErrors = true;

const SKETCH_NAME = 'RectanglePetals';

new (p5 as any)();

class Petal implements p5ex.CleanableSprite {
  isToBeRemoved: boolean = false;

  position: p5.Vector;
  velocity: p5.Vector;
  rotation: p5ex.AngleQuantity;

  drawer: p5ex.Drawer;
  alphaChannelRef: p5ex.NumberContainer;
  disappearanceTimer: p5ex.NonLoopedFrameCounter;

  constructor(
    protected readonly p: p5ex.p5exClass,
    position: p5.Vector,
    protected readonly shapeColor: p5ex.ShapeColor,
  ) {
    this.position = p.createVector().set(position);
    this.velocity = p.createVector();
    this.rotation = new p5ex.AngleQuantity(
      Math.random() * p.TWO_PI,
      p5ex.randomSign(0.005 * p.TWO_PI),
    );

    this.alphaChannelRef = new p5ex.NumberContainer();

    const width = p.random(40, 100);
    const height = p.random(40, 100);
    this.drawer = new p5ex.Drawer(
      p,
      {
        draw() {
          p.rect(0, 0, width, height, 2);
        },
      },
      {
        positionRef: this.position,
        rotationAngleRef: this.rotation.angleReference,
        shapeColorRef: this.shapeColor,
        alphaChannelRef: this.alphaChannelRef,
      },
    );

    this.disappearanceTimer = new p5ex.NonLoopedFrameCounter(
      3 * p.idealFrameRate,
      () => { this.isToBeRemoved = true; },
    );
  }

  step(): void {
    this.velocity.add(0, 0.1);
    this.position.add(this.velocity);
    this.rotation.step();

    this.disappearanceTimer.step();
    this.alphaChannelRef.value = (1 - this.disappearanceTimer.getProgressRatio()) * 255;
  }

  clean(): void {
  }

  draw(): void {
    if (this.alphaChannelRef.value === 0) return;

    this.drawer.draw();
  }
}

class PetalGenerator implements p5ex.Steppable {
  position: p5.Vector;
  speed: number = 25;
  randomColor: p5ex.RandomShapeColor;

  constructor(
    protected readonly p: p5ex.p5exClass,
    protected readonly petalArray: p5ex.LoopableArray<Petal>,
    baseHue?: number,
  ) {
    this.position = p.createVector(
      Math.random() * p.nonScaledWidth, Math.random() * p.nonScaledHeight,
    );

    this.randomColor = new p5ex.RandomShapeColor().pushCandidateFromFunction(
      () => {
        let hue: number;
        if (baseHue) hue = p.radians(baseHue + p.random(-20, 20));
        else hue = Math.random() * p.TWO_PI;

        return new p5ex.ShapeColor(
          p,
          p.color(p5ex.cielchColor(40, 35, hue, 40)),
          p.color(p5ex.cielchColor(70, 35, hue, 40)),
          true,
        );
      },
      36,
    );
  }

  step(): void {
    const angle = Math.random() * this.p.TWO_PI;
    this.position.add(this.speed * Math.cos(angle), this.speed * Math.sin(angle));
    this.p.scalableCanvas.region.constrain(this.position, -70);
    this.position.set(
      this.p.constrain(this.position.x + this.speed * Math.cos(angle), 0, this.p.nonScaledWidth),
      this.p.constrain(this.position.y + this.speed * Math.sin(angle), 0, this.p.nonScaledHeight),
    );

    this.petalArray.push(
      new Petal(this.p, this.position, this.randomColor.get()),
    );
  }
}

const sketch = (p: p5ex.p5exClass) => {
  // ---- constants
  let backgroundPixels: number[];

  // ---- variables
  let petals: p5ex.CleanableSpriteArray<Petal>;
  let petalGenerators: p5ex.SteppableArray<PetalGenerator>;
  let timeoutId = -1;

  // ---- functions
  function createBackgroundPixels(): number[] {
    const gradation = createGradationRectangle(
      p,
      p.width,
      p.height,
      p.color(255, 255, 255),
      p.color(255, 255, 255),
      p.color(248, 244, 255),
      3,
    );
    const g = applyRandomTexture(gradation, 0.05) as any;
    p.background(255, 255, 255);
    p.image(g, 0, 0);
    p.loadPixels();

    return p.pixels;
  }

  // ---- Setup & Draw etc.
  p.preload = () => {
  };

  p.setup = () => {
    (window as any).noCanvas();
    p.createScalableCanvas(
      p5ex.ScalableCanvasTypes.FULL,
    );

    p.setFrameRate(30);

    backgroundPixels = createBackgroundPixels();

    p.rectMode(p.CENTER);

    petals = new p5ex.CleanableSpriteArray<Petal>();
    petalGenerators = new p5ex.SteppableArray<PetalGenerator>(2);
    petalGenerators.pushRawArray([
      new PetalGenerator(p, petals, 275),
      new PetalGenerator(p, petals, 300),
    ]);
  };

  p.draw = () => {
    p.pixels = backgroundPixels;
    p.updatePixels();
    p.scalableCanvas.scale();

    petalGenerators.step();
    petals.step();
    petals.clean();
    petals.draw();

    p.scalableCanvas.cancelScale();
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
    // return false;
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);
