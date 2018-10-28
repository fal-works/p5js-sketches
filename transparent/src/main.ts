import * as p5ex from 'p5ex';

const SKETCH_NAME = 'Transparent';

class Rectangle implements p5ex.CleanableSprite {
  isToBeRemoved: boolean = false;
  ratio: number = 0;
  birthTimer: p5ex.NonLoopedFrameCounter;
  deathTimer: p5ex.NonLoopedFrameCounter;
  width: number;
  height: number;
  rotationAngle: number;
  beginDeath: boolean = false;
  rotationAngleFactor: number;

  constructor(protected p: p5ex.p5exClass, protected position: p5.Vector, protected shapeColor: p5ex.ShapeColor, protected globalAngle: number) {
    this.birthTimer = new p5ex.NonLoopedFrameCounter(60).on();
    this.deathTimer = new p5ex.NonLoopedFrameCounter(60, () => { this.isToBeRemoved = true; }).off();
    this.width = p.random(50, 250);
    this.height = p.random(50, 250);
    this.rotationAngle = p5ex.randomInt(3) * p.HALF_PI;
    this.rotationAngleFactor = Math.random() < 0.5 ? -1 : 1;
  }

  step() {
    this.birthTimer.step();
    this.deathTimer.step();

    if (this.birthTimer.isOn) {
      this.ratio = p5ex.easeOutQuart(this.birthTimer.getProgressRatio());
    } else if (this.deathTimer.isOn) {
      this.ratio = 1 - p5ex.easeOutQuart(this.deathTimer.getProgressRatio());
    } else {
      if (this.beginDeath) this.deathTimer.on();
      this.ratio = 1;
    }
  }

  clean() {
  }

  draw() {
    const p = this.p;

    p.push();
    p.translate(this.position.x, this.position.y);
    p.rotate(this.globalAngle + this.rotationAngle + this.rotationAngleFactor * Math.PI * this.ratio);

    this.shapeColor.applyColor();
    this.p.rect(
      -this.width / 2,
      -this.height / 2,
      this.width * this.ratio,
      this.height * this.ratio,
    );

    p.pop();
  }
}

const sketch = (p: p5ex.p5exClass) => {
  // ---- variables
  let backgroundColor: p5.Color;
  let dotColor: p5.Color;
  let rectangles: p5ex.CleanableSpriteArray<Rectangle>;
  let globalAngle: number;

  // ---- functions
  function drawBackground(): void {
    p.push();
    p.translate(p.nonScaledWidth / 2, p.nonScaledHeight / 2);
    p.rotate(globalAngle);
    p.noStroke();
    p.fill(dotColor);

    for (let x = -8; x <= 7; x += 1) {
      for (let y = -7; y <= 7; y += 1) {
        p.ellipse((x + (p.frameCount % 60) / 60) * 50, y * 50, 5, 5);
      }
    }

    p.pop();
  }

  // ---- Setup & Draw etc.
  p.preload = () => {
  };

  p.setup = () => {
    p.createScalableCanvas(
      p5ex.ScalableCanvasTypes.SQUARE640x640,
    );

    rectangles = new p5ex.CleanableSpriteArray<Rectangle>();

    backgroundColor = p.color(255);
    dotColor = p.color(192);

    globalAngle = p.TWO_PI / 24;
  };

  p.draw = () => {
    p.background(backgroundColor);

    p.scalableCanvas.scale();
    drawBackground();

    rectangles.step();
    rectangles.clean();
    p.blendMode(p.DIFFERENCE);
    rectangles.draw();
    p.blendMode(p.BLEND);

    p.scalableCanvas.cancelScale();
  };

  p.windowResized = () => {
  };

  p.mousePressed = () => {
    if (!p5ex.mouseIsInCanvas(p)) return;

    rectangles.loop((r: Rectangle) => { r.beginDeath = true; });

    const hue = Math.random() * p.TWO_PI;
    const whiteColor = p.color(255);
    const strokeColor = p5ex.subtractColor(whiteColor, p.color(p5ex.cielchColor(70, 110, hue)), 42);
    const fillColor = p5ex.subtractColor(whiteColor, p.color(p5ex.cielchColor(70, 110, hue)), 32);
    const shapeColor = new p5ex.ShapeColor(p, strokeColor, fillColor);
    const x = p.scalableCanvas.getNonScaledValueOf(p.mouseX);
    const y = p.scalableCanvas.getNonScaledValueOf(p.mouseY);
    console.log(p.degrees(hue));

    for (let i = 0; i < 6; i += 1) {
      rectangles.push(new Rectangle(p, p.createVector(x + p.random(-30, 30), y + p.random(-30, 30)), shapeColor, globalAngle));
    }
  };

  p.keyTyped = () => {
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);
