import * as p5ex from 'p5ex';

const SKETCH_NAME = 'CloudChamber';

class InvisibleBody extends p5ex.PhysicsBody {
  shapeColor: p5ex.ShapeColor;

  constructor(protected p: p5ex.p5exClass) {
    super();
    this.setColor();
  }

  setColor() {
    this.shapeColor = new p5ex.ShapeColor(
      this.p,
      null,
      this.p.color(p5ex.cielchColor(90, 100, this.p.TWO_PI * Math.random())),
      true,
    );
  }
}

class AutoInvisibleBody extends InvisibleBody {
  constructor(p: p5ex.p5exClass) {
    super(p);
    this.position.set(p.random(0, p.nonScaledWidth), p.random(0, p.nonScaledHeight));
    this.velocity.set(p5.Vector.fromAngle((0.5 + p5ex.randomInt(4)) * p.HALF_PI).mult(8));
    this.collisionRadius = 20;
  }

  step() {
    super.step();

    if (this.x < 0 || this.x > this.p.nonScaledWidth) {
      this.p.scalableCanvas.region.constrain(this.position);
      this.velocity.set(-1 * this.vx, this.vy);
    }
    if (this.y < 0 || this.y > this.p.nonScaledHeight) {
      this.p.scalableCanvas.region.constrain(this.position);
      this.velocity.set(this.vx, -1 * this.vy);
    }
  }
}

class ManualInvisibleBody extends InvisibleBody {
  constructor(p: p5ex.p5exClass) {
    super(p);
    this.collisionRadius = 20;
  }

  step() {
    const p = this.p;
    this.position.set(p.mouseX / p.scalableCanvas.scaleFactor, p.mouseY / p.scalableCanvas.scaleFactor);
  }
}

class Indicator extends p5ex.PhysicsBody implements p5ex.Sprite {
  static initialColor: p5ex.ShapeColor;

  isOn: boolean = false;
  life: number;
  lifeChange: number;
  shapeColor: p5ex.ShapeColor;

  constructor(protected p: p5ex.p5exClass, x: number, y: number) {
    super();
    this.position.set(x, y);
    this.collisionRadius = 5;
    this.on(Indicator.initialColor);
    this.life = 0.5;
  }

  step() {
    if (!this.isOn) return;

    this.life -= this.lifeChange;
    if (this.life <= 0) this.isOn = false;
  }

  draw() {
    if (!this.isOn) return;

    const ratio = Math.sin(Math.PI * this.life);
    this.shapeColor.applyColor(255 * ratio);
    const diameter = 10 + 2 * ratio;
    this.p.ellipse(this.position.x, this.position.y, diameter, diameter);
  }

  on(shapeColor: p5ex.ShapeColor) {
    if (this.isOn) return;

    this.isOn = true;
    this.life = 1;
    this.lifeChange = this.p.random(0.02, 0.03);
    this.shapeColor = shapeColor;
  }
}

const sketch = (p: p5ex.p5exClass) => {
  // ---- variables
  let backgroundColor: p5.Color;
  let invisibleBodies: p5ex.SteppableArray<p5ex.PhysicsBody>;
  let indicators: p5ex.SpriteArray<Indicator>;
  let mouseCursorColor: p5ex.ShapeColor;
  const collisionCallback = (body: InvisibleBody, indicator: Indicator) => {
    if (body.collides(indicator)) {
      indicator.on(body.shapeColor);
    }
  };
  const setColorCallback = (body: InvisibleBody) => {
    body.setColor();
  };

  // ---- functions
  function drawMouseCursor() {
    mouseCursorColor.applyColor();
    const diameter = 40 + 5 * Math.sin(p.TWO_PI * p.frameCount / 60);
    p.ellipse(
      p.mouseX / p.scalableCanvas.scaleFactor,
      p.mouseY / p.scalableCanvas.scaleFactor,
      diameter,
      diameter,
    );
  }

  // ---- Setup & Draw etc.
  p.preload = () => {
  };

  p.setup = () => {
    p.createScalableCanvas(
      p5ex.ScalableCanvasTypes.SQUARE640x640,
    );
    p.stroke(0, 160);
    p.noFill();

    backgroundColor = p.color(252);

    invisibleBodies = new p5ex.SteppableArray<InvisibleBody>();
    invisibleBodies.push(new ManualInvisibleBody(p));

    for (let i = 0; i < 3; i += 1) {
      invisibleBodies.push(new AutoInvisibleBody(p));
    }

    indicators = new p5ex.SpriteArray<Indicator>(2 * 32 * 32);
    Indicator.initialColor = new p5ex.ShapeColor(p, null, p.color(192), true);

    const interval = 20;
    for (let y = 1, yLen = p.nonScaledHeight / interval; y < yLen; y += 1) {
      const evenRow = y % 2 === 0;
      for (let x = 1, xLen = p.nonScaledWidth / interval; x < xLen; x += 1) {
        indicators.push(new Indicator(p, (x + (evenRow ? 0 : 0.5)) * interval, y * interval));
      }
    }

    mouseCursorColor = new p5ex.ShapeColor(p, null, p.color(0, 0, 128, 32));
  };

  p.draw = () => {
    p.background(backgroundColor);
    invisibleBodies.step();
    indicators.step();
    invisibleBodies.nestedLoopJoin(indicators, collisionCallback);

    p.scalableCanvas.scale();
    indicators.draw();
    drawMouseCursor();
    p.scalableCanvas.cancelScale();
  };

  p.windowResized = () => {
  };

  p.mousePressed = () => {
    // if (!p5ex.mouseIsInCanvas(p)) return;
    // p.noLoop();

    invisibleBodies.loop(setColorCallback);
  };

  p.keyTyped = () => {
    if (p.keyCode === (p as any).ENTER) p.noLoop();
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);
