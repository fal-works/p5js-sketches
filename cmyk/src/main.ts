import * as p5ex from 'p5ex';

const SKETCH_NAME = 'CMYK';

class ColorObject implements p5ex.CleanableSprite {
  isToBeRemoved: boolean = false;
  isActive: boolean = true;
  remainingBoundCount: number = 1;
  postBirthTimer: p5ex.NonLoopedFrameCounter;
  size: number;

  constructor(
    protected readonly p: p5ex.p5exClass,
    public readonly position: p5.Vector,
    public readonly velocity: p5.Vector,
  ) {
    this.postBirthTimer = new p5ex.NonLoopedFrameCounter(30);

    if (velocity.magSq() < 1.1 * 1.1) velocity.set(p5.Vector.random2D().mult(1.1));
  }

  step() {
    if (!this.isActive) return;

    this.postBirthTimer.step();

    const speedSquared = this.velocity.magSq();
    if (speedSquared > 8) this.velocity.mult(0.95);
    else if (speedSquared < 2) this.velocity.mult(1.1);

    this.position.add(this.velocity);
  }

  clean() {
    if (this.remainingBoundCount > 0) {
      if (this.position.x < 0 || this.position.x > this.p.nonScaledWidth) {
        this.p.constrain(this.position.x, 0, this.p.nonScaledWidth);
        this.velocity.x *= -1;
        this.remainingBoundCount -= 1;
      }

      if (this.position.y < 0 || this.position.y > this.p.nonScaledHeight) {
        this.p.constrain(this.position.y, 0, this.p.nonScaledHeight);
        this.velocity.y *= -1;
        this.remainingBoundCount -= 1;
      }

      return;
    }

    const margin = this.size;

    if (
      this.position.x < -margin || this.position.x > this.p.nonScaledWidth + margin ||
      this.position.y < -margin || this.position.y > this.p.nonScaledHeight + margin
    ) {
      this.isToBeRemoved = true;
    }
  }

  draw() {
  }

  hasColor(color: p5ex.ShapeColor): boolean {
    return true;
  }

  hasCommonColor(otherObject: ColorObject): boolean {
    return true;
  }

  setSize(v: number): void {
  }
}

class UnitColorObject extends ColorObject {
  drawer: p5ex.Drawer;
  rotation: p5ex.AngleQuantity;

  constructor(
    protected readonly p: p5ex.p5exClass,
    public readonly color: p5ex.ShapeColor,
    velocity: p5.Vector,
  ) {
    super(
      p,
      p.createVector(
        p.scalableCanvas.getNonScaledValueOf(p.mouseX),
        p.scalableCanvas.getNonScaledValueOf(p.mouseY),
      ),
      velocity,
    );

    this.rotation = new p5ex.AngleQuantity(p.random(p.TWO_PI), p.random(-1, 1) * 0.01 * p.TWO_PI);
    this.size = 12;
    this.drawer = new p5ex.Drawer(
      p,
      {
        draw: () => {
          p.rect(-0.4 * this.size, -0.4 * this.size, this.size, this.size);
        },
      },
      {
        shapeColorRef: color,
        rotationAngleRef: this.rotation.angleReference,
      },
    );
  }

  step() {
    super.step();
    this.rotation.step();
  }

  draw() {
    if (this.isActive) this.p.translate(this.position.x, this.position.y);
    this.drawer.draw();
    if (this.isActive) this.p.translate(-this.position.x, -this.position.y);
  }

  hasColor(color: p5ex.ShapeColor): boolean {
    return this.color === color;
  }

  hasCommonColor(otherObject: ColorObject): boolean {
    return otherObject.hasColor(this.color);
  }

  setSize(v: number): void {
    this.size = v;
  }
}

class CompositeColorObject extends ColorObject {
  static effectColor: p5ex.ShapeColor;

  constructor(
    p: p5ex.p5exClass,
    protected readonly objectA: ColorObject,
    protected readonly objectB: ColorObject,
  ) {
    super(
      p,
      p5.Vector.add(objectA.position, objectB.position).mult(0.5),
      p5.Vector.add(objectA.velocity, objectB.velocity).mult(0.5),
    );

    objectA.position.set(0, 0);
    objectB.position.set(0, 0);
    objectA.isActive = false;
    objectB.isActive = false;

    this.setSize(Math.max(objectA.size, objectB.size) * 1.2);
  }

  step() {
    super.step();
    this.objectA.step();
    this.objectB.step();
  }

  draw() {
    this.p.translate(this.position.x, this.position.y);
    this.objectA.draw();
    this.objectB.draw();

    if (!this.postBirthTimer.isCompleted) {
      const ratio = this.postBirthTimer.getProgressRatio();

      if (ratio < 1) {
        CompositeColorObject.effectColor.applyColor((1 - ratio) * 255);
        const diameter = 60 * p5ex.easeOutQuart(ratio);
        this.p.strokeWeight((1 - ratio) * 4);
        this.p.ellipse(0, 0, diameter, diameter);
      }
    }

    this.p.translate(-this.position.x, -this.position.y);
  }

  hasColor(color: p5ex.ShapeColor): boolean {
    return this.objectA.hasColor(color) || this.objectB.hasColor(color);
  }

  hasCommonColor(otherObject: ColorObject): boolean {
    return this.objectA.hasCommonColor(otherObject) || this.objectB.hasCommonColor(otherObject);
  }

  setSize(v: number): void {
    this.size = v;
    this.objectA.setSize(v);
    this.objectB.setSize(v);
  }
}

const sketch = (p: p5ex.p5exClass) => {
  // ---- variables
  let backgroundColor: p5.Color;
  let backgroundPixels: number[];
  let timeoutId: number = -1;

  let colorObjects: p5ex.CleanableSpriteArray<ColorObject>;
  let newColorObjects: p5ex.SpriteArray<ColorObject>;
  let colorArray: p5ex.ShapeColor[];
  let currentColorIndex = 0;
  let cursorColor: p5.Color;
  let mousePosition: p5.Vector;


  // ---- functions
  function reset(): void {
    p.blendMode(p.BLEND);
    p.background(backgroundColor);
    p5ex.applyRandomTexture(p, 8, true, 0, 0, 32);

    p.loadPixels();
    backgroundPixels = p.pixels;

    p.blendMode(p.DIFFERENCE);
  }

  function processCollision(): void {
    colorObjects.roundRobin(
      (element, otherElement) => {
        if (
          element.postBirthTimer.isCompleted &&
          otherElement.postBirthTimer.isCompleted &&
          !element.isToBeRemoved &&
          !otherElement.isToBeRemoved &&
          !element.hasCommonColor(otherElement) &&
          Math.abs(element.position.x - otherElement.position.x) < 10 &&
          Math.abs(element.position.y - otherElement.position.y) < 10
        ) {
          element.isToBeRemoved = true;
          otherElement.isToBeRemoved = true;
          newColorObjects.push(new CompositeColorObject(p, element, otherElement));
        }
      },
    );
  }

  function spawn(angle: number): void {
    newColorObjects.push(
      new UnitColorObject(
        p,
        colorArray[currentColorIndex],
        p5.Vector.fromAngle(angle).mult(8),
      ),
    );
  }

  function drawCursor(): void {
    p.stroke(cursorColor);
    p.strokeWeight(3);
    p.line(mousePosition.x - 10, mousePosition.y, mousePosition.x + 10, mousePosition.y);
    p.line(mousePosition.x, mousePosition.y - 10, mousePosition.x, mousePosition.y + 10);
  }


  // ---- Setup & Draw etc.
  p.preload = () => {
  };

  p.setup = () => {
    p.createScalableCanvas(
      p5ex.ScalableCanvasTypes.SQUARE640x640,
    );

    backgroundColor = p.color(255, 255, 255);

    colorObjects = new p5ex.CleanableSpriteArray<ColorObject>();
    newColorObjects = new p5ex.SpriteArray<ColorObject>();
    colorArray = [
      new p5ex.ShapeColor(p, null, p.color(255, 0, 0)),
      new p5ex.ShapeColor(p, null, p.color(0, 255, 0)),
      new p5ex.ShapeColor(p, null, p.color(0, 0, 255)),
    ];

    CompositeColorObject.effectColor = new p5ex.ShapeColor(p, p.color(255, 255, 255), null, true);

    cursorColor = p.color(160, 160, 160);
    mousePosition = p.createVector(0.5 * p.nonScaledWidth, 0.5 * p.nonScaledHeight);

    reset();
  };

  p.draw = () => {
    p.pixels = backgroundPixels;
    p.updatePixels();

    mousePosition.set(
      p.scalableCanvas.getNonScaledValueOf(p.mouseX),
      p.scalableCanvas.getNonScaledValueOf(p.mouseY),
    );

    p.scalableCanvas.scale();

    colorObjects.step();
    colorObjects.clean();
    colorObjects.draw();

    drawCursor();

    p.scalableCanvas.cancelScale();

    processCollision();

    if (p5ex.mouseIsInCanvas(p) && p.mouseIsPressed && p.frameCount % 2 === 0) {
      const angle = p.TWO_PI * (p.frameCount % 31 / 31);
      spawn(angle);
      spawn(angle + p.PI);
    }

    colorObjects.pushAll(newColorObjects);
    newColorObjects.clear();
  };


  p.windowResized = () => {
    if (timeoutId !== -1) clearTimeout(timeoutId);
    timeoutId = setTimeout(
      () => {
        p.resizeScalableCanvas();
        reset();
      },
      200,
    );
  };

  p.mousePressed = () => {
    // if (p.mouseButton === p.RIGHT) p.noLoop();
    if (p5ex.mouseIsInCanvas(p)) return false;
  };

  p.mouseReleased = () => {
    currentColorIndex = (currentColorIndex + 1) % colorArray.length;
  };

  p.keyTyped = () => {
    // if (p.key === 's') p.saveCanvas('image', 'png');
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);
