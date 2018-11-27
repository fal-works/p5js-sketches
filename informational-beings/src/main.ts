import * as p5ex from 'p5ex';

const SKETCH_NAME = 'InformationalBeings';

enum Phase {
  DELAY,
  BIRTH,
  MOTION,
  STOP,
  DEATH,
}

class ShapeElement implements p5ex.CleanableSprite {
  static addElement: (previousPosition: p5.Vector, nextPosition: p5.Vector) => void;

  isToBeRemoved: boolean = false;
  birthDelayTimer: p5ex.NonLoopedFrameCounter;
  birthTimer: p5ex.NonLoopedFrameCounter;
  motionTimer: p5ex.NonLoopedFrameCounter;
  deathDelayTimer: p5ex.NonLoopedFrameCounter;
  deathTimer: p5ex.NonLoopedFrameCounter;
  timers: p5ex.SteppableArray<p5ex.FrameCounter>;
  phase = Phase.DELAY;
  ratio: number = 0;

  constructor(protected p: p5ex.p5exClass, protected position: p5.Vector, protected delayFrameCount: number = 0, protected isGenerator: boolean = true) {
    this.timers = new p5ex.SteppableArray<p5ex.FrameCounter>();

    this.birthDelayTimer = new p5ex.NonLoopedFrameCounter(delayFrameCount, () => { this.birthTimer.on(); this.phase = Phase.BIRTH; }).on();
    this.timers.push(this.birthDelayTimer);
    this.birthTimer = new p5ex.NonLoopedFrameCounter(60, () => { this.motionTimer.on(); this.phase = Phase.MOTION; this.generateNext(); }).off();
    this.timers.push(this.birthTimer);
    this.motionTimer = new p5ex.NonLoopedFrameCounter(30, () => { this.deathDelayTimer.on(); this.phase = Phase.STOP; }).off();
    this.timers.push(this.motionTimer);
    this.deathDelayTimer = new p5ex.NonLoopedFrameCounter(60, () => { this.deathTimer.on(); this.phase = Phase.DEATH; }).off();
    this.timers.push(this.deathDelayTimer);
    this.deathTimer = new p5ex.NonLoopedFrameCounter(90, () => { this.isToBeRemoved = true; }).off();
    this.timers.push(this.deathTimer);
  }

  step() {
    this.timers.step();

    switch (this.phase) {
      case Phase.DELAY:
        break;
      case Phase.BIRTH:
        this.ratio = this.birthTimer.getProgressRatio();
        break;
      case Phase.MOTION:
        this.ratio = this.motionTimer.getProgressRatio();
        break;
      case Phase.STOP:
        this.ratio = 1;
        break;
      case Phase.DEATH:
        this.ratio = this.deathTimer.getProgressRatio();
        break;
    }
  }

  clean() {
  }

  draw() {
    if (this.birthDelayTimer.isOn) return;

    const p = this.p;

    p.translate(this.position.x, this.position.y);

    this.drawShape();

    p.translate(-this.position.x, -this.position.y);
  }

  drawShape(): void {
  }

  generateNext(): void {
    if (!this.isGenerator) return;

    let nextPosition: p5.Vector;
    do {
      nextPosition = this.p.createVector(this.position.x + p5ex.randomSign(this.p.random(50, 320)), this.position.y + p5ex.randomSign(this.p.random(50, 320)));
    }
    while (!this.p.scalableCanvas.region.contains(nextPosition, -100));

    ShapeElement.addElement(this.position, nextPosition);
  }
}

class HiddenGeneratorElement extends ShapeElement {
  constructor(p: p5ex.p5exClass, position: p5.Vector, delayFrameCount: number = 0) {
    super(p, position, delayFrameCount, true);
  }
}

class CircleElement extends ShapeElement {
  shapeColor: p5ex.ShapeColor;

  constructor(p: p5ex.p5exClass, position: p5.Vector, delayFrameCount: number = 0, isGenerator: boolean, color: p5.Color, protected baseSize: number) {
    super(p, position, delayFrameCount, isGenerator);

    this.shapeColor = new p5ex.ShapeColor(p, color, null, true);
  }

  drawShape() {
    let currentSize: number;
    let weight: number = 1;
    let alpha: number = 255;

    switch (this.phase) {
      case Phase.BIRTH:
        currentSize = this.baseSize * p5ex.easeOutQuart(this.ratio);
        break;
      case Phase.MOTION:
        currentSize = this.baseSize;
        weight += 3 * (1 - p5ex.easeOutQuad(this.ratio));
        break;
      case Phase.STOP:
        currentSize = this.baseSize;
        break;
      case Phase.DEATH:
        currentSize = this.baseSize + 20 * this.p.sq(this.ratio);
        alpha = 255 * (1 - this.ratio);
        weight = weight * (1 - this.ratio);
        if (alpha < 1) return;
        break;
      default:
        currentSize = 0;
    }

    this.shapeColor.applyColor(alpha);
    this.p.strokeWeight(weight);
    this.p.ellipse(0, 0, currentSize, currentSize);
  }
}

class RectangleElement extends ShapeElement {
  shapeColor: p5ex.ShapeColor;

  constructor(
    p: p5ex.p5exClass,
    position: p5.Vector,
    delayFrameCount: number = 0,
    isGenerator: boolean,
    color: p5.Color,
    protected baseWidth: number,
    protected baseHeight: number,
  ) {
    super(p, position, delayFrameCount, isGenerator);

    this.shapeColor = new p5ex.ShapeColor(p, color, null, true);
  }

  drawShape() {
    let currentWidth: number;
    let currentHeight: number;
    let weight: number = 1;
    let alpha: number = 255;

    switch (this.phase) {
      case Phase.BIRTH:
        currentWidth = this.baseWidth * this.p.sq(this.ratio);
        currentHeight = this.baseHeight * p5ex.easeOutQuart(this.ratio);
        break;
      case Phase.MOTION:
        currentWidth = this.baseWidth;
        currentHeight = this.baseHeight;
        weight += 3 * (1 - p5ex.easeOutQuad(this.ratio));
        break;
      case Phase.STOP:
        currentWidth = this.baseWidth;
        currentHeight = this.baseHeight;
        break;
      case Phase.DEATH:
        currentWidth = this.baseWidth + 20 * this.p.sq(this.ratio);
        currentHeight = this.baseHeight * (1 - this.p.sq(this.ratio));
        alpha = 255 * (1 - this.ratio);
        weight = weight * (1 - this.ratio);
        if (alpha < 1) return;
        break;
      default:
        currentWidth = 0;
        currentHeight = 0;
    }

    this.shapeColor.applyColor(alpha);
    this.p.strokeWeight(weight);
    this.p.rect(0, 0, currentWidth, currentHeight);
  }
}

class CellElement extends ShapeElement {
  shapeColor: p5ex.ShapeColor;

  constructor(
    p: p5ex.p5exClass,
    position: p5.Vector,
    delayFrameCount: number = 0,
    color: p5.Color,
    protected offsetPosition: p5.Vector,
  ) {
    super(p, position, delayFrameCount, false);

    this.shapeColor = new p5ex.ShapeColor(p, null, color, true);
  }

  drawShape() {
    if (Math.random() < 0.01) return;

    let sizeRatio: number;
    let alpha: number = 255;

    switch (this.phase) {
      case Phase.BIRTH:
        sizeRatio = p5ex.easeOutQuart(this.ratio);
        break;
      case Phase.MOTION:
        sizeRatio = 1 + 0.25 * (1 - p5ex.easeOutQuart(this.ratio));
        break;
      case Phase.STOP:
        sizeRatio = 1;
        break;
      case Phase.DEATH:
        sizeRatio = 1 - this.ratio;
        alpha = 255 * (1 - this.ratio);
        if (alpha < 1) return;
        break;
      default:
        sizeRatio = 0;
    }

    this.shapeColor.applyColor(alpha);
    this.p.rect(this.offsetPosition.x, this.offsetPosition.y, 10 * sizeRatio, 14 * sizeRatio, 2);
  }
}

class LineElement extends ShapeElement {
  shapeColor: p5ex.ShapeColor;

  constructor(
    p: p5ex.p5exClass,
    position: p5.Vector,
    delayFrameCount: number = 0,
    isGenerator: boolean,
    protected color: p5.Color,
    protected startPosition: p5.Vector,
    protected endPosition: p5.Vector,
  ) {
    super(p, position, delayFrameCount, isGenerator);

    this.shapeColor = new p5ex.ShapeColor(p, color, null, true);
  }

  lerpPosition(start: p5.Vector, end: p5.Vector, ratio: number): p5.Vector {
    return this.p.createVector(
      start.x + (end.x - start.x) * ratio,
      start.y + (end.y - start.y) * ratio,
    );
  }

  drawShape() {
    let currentStartPosition = this.startPosition;
    let currentEndPosition = this.endPosition;
    let weight: number = 1;
    let alpha: number = 255;

    switch (this.phase) {
      case Phase.BIRTH:
        currentEndPosition = this.lerpPosition(this.startPosition, this.endPosition, p5ex.easeOutQuart(this.ratio));
        break;
      case Phase.MOTION:
        weight += 3 * (1 - p5ex.easeOutQuad(this.ratio));
        break;
      case Phase.STOP:
        break;
      case Phase.DEATH:
        currentStartPosition = this.lerpPosition(this.startPosition, this.endPosition, p5ex.easeOutQuart(this.ratio));
        currentEndPosition = this.lerpPosition(this.startPosition, this.endPosition, 1 + 0.2 * p5ex.easeOutQuad(this.ratio));
        alpha = 255 * (1 - this.ratio);
        weight = weight * (1 - this.ratio);
        if (alpha < 1) return;
        break;
      default:
    }

    this.shapeColor.applyColor(alpha);
    this.p.strokeWeight(weight);
    this.p.line(currentStartPosition.x, currentStartPosition.y, currentEndPosition.x, currentEndPosition.y);
  }
}

const sketch = (p: p5ex.p5exClass) => {
  // ---- variables
  let backgroundColor: p5.Color;
  let shapeElements: p5ex.CleanableSpriteArray<ShapeElement>;
  let colorList: p5.Color[];
  let defaultColor: p5.Color;

  // ---- functions

  // ---- Setup & Draw etc.
  p.preload = () => {
  };

  p.setup = () => {
    p.createScalableCanvas(
      p5ex.ScalableCanvasTypes.SQUARE640x640,
    );

    p.rectMode(p.CENTER);

    shapeElements = new p5ex.CleanableSpriteArray<ShapeElement>();

    backgroundColor = p.color(248, 248, 248);

    defaultColor = p.color(64);
    colorList = [
      defaultColor,
      defaultColor,
      defaultColor,
      p.color(48, 48, 96),
    ];

    ShapeElement.addElement = (previousPosition, nextPosition) => {
      const color = p.random(colorList);
      const rayLine = new LineElement(
        p,
        nextPosition,
        0,
        false,
        defaultColor,
        p5.Vector.sub(previousPosition, nextPosition),
        p.createVector(0, 0),
      );

      switch (p5ex.randomInt(4)) {
        case 0:
          shapeElements.push(rayLine);
          shapeElements.push(new CircleElement(p, nextPosition, 6, true, color, p.random(80, 120)));
          break;
        case 1:
          const circleSize = p.random(80, 120);
          shapeElements.push(rayLine);
          shapeElements.push(new CircleElement(p, nextPosition, 6, true, color, circleSize));
          const angle1 = p.random(p.TWO_PI);
          const angle2 = angle1 + p.radians(p.random(90, 150));
          const angle3 = angle1 - p.radians(p.random(90, 150));
          const position1 = p5.Vector.fromAngle(angle1).mult(circleSize / 2);
          const position2 = p5.Vector.fromAngle(angle2).mult(circleSize / 2);
          const position3 = p5.Vector.fromAngle(angle3).mult(circleSize / 2);
          shapeElements.push(new LineElement(p, nextPosition, 12, false, color, position1, position2));
          shapeElements.push(new LineElement(p, nextPosition, 18, false, color, position2, position3));
          shapeElements.push(new LineElement(p, nextPosition, 24, false, color, position3, position1));
          break;
        case 2:
          shapeElements.push(rayLine);
          shapeElements.push(new RectangleElement(p, nextPosition, 6, true, color, p.random(30, 120), p.random(30, 120)));
          break;
        case 3:
          shapeElements.push(new HiddenGeneratorElement(p, nextPosition, 0));
          const rows = p5ex.randomIntBetween(4, 10);
          const columns = p5ex.randomIntBetween(4, 10);
          for (let x = 0; x < columns; x += 1) {
            for (let y = 0; y < rows; y += 1) {
              shapeElements.push(new CellElement(p, nextPosition, 1 * (y * columns + x), color, p.createVector((-columns / 2 + x) * 14, (-rows / 2 + y) * 18)));
            }
          }
          break;
      }
    };

    shapeElements.push(new CircleElement(p, p.createVector(p.nonScaledWidth / 2, p.nonScaledHeight / 2), 0, true, p.random(colorList), 100));
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
    // if (!p5ex.mouseIsInCanvas(p)) return;
    // p.noLoop();
  };

  p.keyTyped = () => {
    if (p.keyCode === (p as any).ENTER) p.noLoop();
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);
