import * as p5ex from 'p5ex';

const SKETCH_NAME = 'CreativeImagery';

enum ShapeType {
  CIRCLE,
  HALF_CIRCLE,
  SQUARE,
  TRIANGLE,
  RECTANGLE,
  L_SHAPE,
  CROSS,
  RING,
  ARC,
}

class ShapeElement implements p5ex.CleanableSprite {
  private static typeList = [
    ShapeType.CIRCLE,
    ShapeType.HALF_CIRCLE,
    ShapeType.SQUARE,
    ShapeType.TRIANGLE,
    ShapeType.RECTANGLE,
    ShapeType.L_SHAPE,
    ShapeType.CROSS,
    ShapeType.RING,
    ShapeType.ARC,
  ];

  isToBeRemoved: boolean = false;
  shapeType: ShapeType;
  birthDelayTimer: p5ex.NonLoopedFrameCounter;
  birthTimer: p5ex.NonLoopedFrameCounter;
  deathTimer: p5ex.NonLoopedFrameCounter;
  size: number;
  rotationAngle: number;
  beginDeath: boolean = false;
  rotationAngleFactor: number;
  beginBirth = () => { this.birthTimer.on(); };
  die = () => { this.isToBeRemoved = true; };
  currentSize: number = 0;
  currentAngle: number = 0;
  shapeColor: p5ex.ShapeColor;

  constructor(protected p: p5ex.p5exClass, protected position: p5.Vector, protected color: p5.Color) {
    this.shapeType = p.random(ShapeElement.typeList);
    this.birthDelayTimer = new p5ex.NonLoopedFrameCounter(10, this.beginBirth).on();
    this.birthTimer = new p5ex.NonLoopedFrameCounter(30).off();
    this.deathTimer = new p5ex.NonLoopedFrameCounter(30, this.die).off();
    this.size = p.random(20, 50);
    this.rotationAngle = p5ex.randomInt(8) * p.QUARTER_PI;
    this.rotationAngleFactor = Math.random() < 0.5 ? -1 : 1;

    switch (this.shapeType) {
      case ShapeType.CIRCLE:
      case ShapeType.HALF_CIRCLE:
      case ShapeType.SQUARE:
      case ShapeType.TRIANGLE:
      case ShapeType.RECTANGLE:
        this.shapeColor = new p5ex.ShapeColor(p, color, p.color(p.red(color), p.green(color), p.blue(color), 128));
        break;
      case ShapeType.L_SHAPE:
      case ShapeType.CROSS:
      case ShapeType.RING:
      case ShapeType.ARC:
        this.shapeColor = new p5ex.ShapeColor(p, color, null);
        break;
    }
  }

  step() {
    this.birthDelayTimer.step();
    this.birthTimer.step();
    this.deathTimer.step();

    let ratio: number;

    if (this.birthTimer.isOn) {
      ratio = p5ex.easeOutCubic(this.birthTimer.getProgressRatio());
    } else if (this.deathTimer.isOn) {
      ratio = 1 - p5ex.easeOutQuad(this.deathTimer.getProgressRatio());
    } else {
      if (this.beginDeath) this.deathTimer.on();
      ratio = 1;
    }

    this.currentSize = this.size * ratio;
    this.currentAngle = this.rotationAngle + this.rotationAngleFactor * Math.PI * ratio;
  }

  clean() {
  }

  draw() {
    if (this.birthDelayTimer.isOn) return;

    const p = this.p;

    p.push();
    p.translate(this.position.x, this.position.y);
    p.rotate(this.currentAngle);

    this.shapeColor.applyColor();

    switch (this.shapeType) {
      case ShapeType.CIRCLE:
      case ShapeType.RING:
        p.ellipse(0, 0, this.currentSize, this.currentSize);
        break;
      case ShapeType.HALF_CIRCLE:
        p.arc(0, 0, this.currentSize, this.currentSize, 0, p.PI, p.CHORD);
        break;
      case ShapeType.SQUARE:
        p.rect(0, 0, this.currentSize, this.currentSize);
        break;
      case ShapeType.TRIANGLE:
        p.triangle(0, this.currentSize * 0.8, -this.currentSize * 0.3, -this.currentSize * 0.4, this.currentSize * 0.3, -this.currentSize * 0.4);
        break;
      case ShapeType.RECTANGLE:
        p.rect(0, 0, this.currentSize * 2, this.currentSize / 2);
        break;
      case ShapeType.L_SHAPE:
        p.line(0, 0, 0, -this.currentSize * 0.8);
        p.line(0, 0, this.currentSize * 0.6, 0);
        break;
      case ShapeType.CROSS:
        p.line(-this.currentSize * 0.5, 0, this.currentSize * 0.5, 0);
        p.line(0, -this.currentSize * 0.5, 0, this.currentSize * 0.5);
        break;
      case ShapeType.ARC:
        p.arc(0, 0, this.currentSize, this.currentSize, 0, p.PI, p.OPEN);
        break;
    }

    p.pop();
  }
}

const sketch = (p: p5ex.p5exClass) => {
  // ---- variables
  let backgroundColor: p5.Color;
  let shapeElements: p5ex.CleanableSpriteArray<ShapeElement>;
  let colorList: p5.Color[];

  // ---- functions
  function generate(): void {
    shapeElements.loop((e: ShapeElement) => { e.beginDeath = true; });

    const interval = p.nonScaledWidth / 4;

    for (let x = 1; x < 4; x += 1) {
      for (let y = 1; y < 4; y += 1) {
        for (let i = 0; i < 3; i += 1) {
          const position = p.createVector(
            interval * x + p5ex.randomIntBetween(-3, 4) * 10,
            interval * y + p5ex.randomIntBetween(-3, 4) * 10,
          );
          shapeElements.push(new ShapeElement(p, position, p.random(colorList)));
        }
      }
    }
  }

  // ---- Setup & Draw etc.
  p.preload = () => {
  };

  p.setup = () => {
    p.createScalableCanvas(
      p5ex.ScalableCanvasTypes.SQUARE640x640,
    );

    p.rectMode(p.CENTER);
    p.strokeWeight(2);

    shapeElements = new p5ex.CleanableSpriteArray<ShapeElement>();

    backgroundColor = p.color(252);

    colorList = [
      p.color(p5ex.cielchColor(50, 90, p.radians(-90))),
      p.color(p5ex.cielchColor(50, 90, p.radians(60))),
      p.color(p5ex.cielchColor(80, 90, p.radians(90))),
    ];

    generate();
  };

  p.draw = () => {
    p.background(backgroundColor);

    p.scalableCanvas.scale();

    shapeElements.step();
    shapeElements.clean();
    shapeElements.draw();

    p.scalableCanvas.cancelScale();
  };

  p.windowResized = () => {
  };

  p.mousePressed = () => {
    if (!p5ex.mouseIsInCanvas(p)) return;

    generate();
  };

  p.keyTyped = () => {
    if (p.keyCode === (p as any).ENTER) p.noLoop();
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);
