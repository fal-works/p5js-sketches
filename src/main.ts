import * as p5ex from 'p5ex';

(p5 as any).disableFriendlyErrors = true;

const SKETCH_NAME = 'ObjectPool';

new (p5 as any)();

const sketch = (p: p5ex.p5exClass) => {
  // ---- constants
  const backgroundColor = p.color(248);
  const worldRegion = new p5ex.RectangleRegion(40, 120, 600, 600);
  const regionColor = new p5ex.ShapeColor(p, p.color(0, 24), p.color(252));
  const cursorColor = new p5ex.ShapeColor(p, null, p.color(0, 64));
  const cursorSize = 24;
  const cursorTransformFactor = 0.3;

  // ---- variables
  const entities = new p5ex.SpriteArray<Entity>(256);
  const mousePosition = p.createVector();
  const globalTimer = new p5ex.LoopedFrameCounter(60);

  // ---- functions
  function reviveEntity(position: p5.Vector): void {
    if (!worldRegion.contains(position)) return;

    let newEntity: Entity | null = null;

    for (let i = 0; i < entities.length; i += 1) {
      if (!entities.get(i).isAlive) {
        newEntity = entities.get(i);
        break;
      }
    }

    if (newEntity == null) return;

    newEntity.revive(position);
  }

  function drawRegion(p: p5ex.p5exClass): void {
    regionColor.applyColor();
    p.rect(
      worldRegion.leftPositionX,
      worldRegion.topPositionY,
      worldRegion.rightPositionX,
      worldRegion.bottomPositionY,
    );
  }

  function drawCursor(p: p5ex.p5exClass): void {
    const cursorSizeFactor = p.mouseIsPressed ? 0.5 : 1;
    const angle = globalTimer.getProgressRatio() * p.TWO_PI;
    p.blendMode(p.BLEND);
    cursorColor.applyColor();
    p.ellipse(
      mousePosition.x,
      mousePosition.y,
      cursorSizeFactor * cursorSize * (1 + cursorTransformFactor * Math.cos(angle)),
      cursorSizeFactor * cursorSize * (1 + cursorTransformFactor * Math.sin(angle)),
    );
  }


  // ---- Setup & Draw etc.
  p.preload = () => {
  };

  p.setup = () => {
    (window as any).noCanvas();
    p.createScalableCanvas(
      p5ex.ScalableCanvasTypes.SQUARE640x640,
    );

    Entity.initialize(
      worldRegion,
      new p5ex.ShapeColor(p, null, p.color(64), true),
      new p5ex.ShapeColor(p, p.color(128), null, true),
    );

    const maxX = 32;
    const maxY = 4;
    const entityInterval = (p.nonScaledWidth / (maxX + 1));

    for (let y = 0; y < maxY; y += 1) {
      for (let x = 0; x < maxX; x += 1) {
        entities.push(
          new Entity(p, p.createVector((1 + x) * entityInterval, (1 + y) * entityInterval)),
        );
      }
    }

    p.rectMode(p.CORNERS);
    p.ellipseMode(p.CENTER);

    p.background(255);
  };

  p.draw = () => {
    p.blendMode(p.BLEND);
    p.background(backgroundColor);
    p.scalableCanvas.scale();

    globalTimer.step();

    mousePosition.set(
      p.scalableCanvas.getNonScaledValueOf(p.mouseX),
      p.scalableCanvas.getNonScaledValueOf(p.mouseY),
    );

    if (p.mouseIsPressed) reviveEntity(mousePosition);

    drawRegion(p);
    drawCursor(p);

    entities.step();
    entities.draw();
  };

  p.windowResized = () => {
    p.resizeScalableCanvas();
    p.background(255);
  };

  p.mousePressed = () => {
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);


class Entity implements p5ex.Sprite {
  private static size = 12;
  private static region: p5ex.RectangleRegion;
  private static deadShapeColor: p5ex.ShapeColor;
  private static deadLineColor: p5ex.ShapeColor;

  static initialize(
    region: p5ex.RectangleRegion,
    deadShapeColor: p5ex.ShapeColor,
    deadLineColor: p5ex.ShapeColor,
  ): void {
    this.region = region;
    this.deadShapeColor = deadShapeColor;
    this.deadLineColor = deadLineColor;
  }

  public isAlive: boolean = false;
  private readonly position: p5.Vector;
  private readonly velocity: p5.Vector;
  private readonly deathPosition: p5.Vector;

  private readonly properShapeColor: p5ex.ShapeColor;
  private readonly properLineColor: p5ex.ShapeColor;
  private readonly birthTimer = new p5ex.NonLoopedFrameCounter(15).off();
  private readonly deathTimer = new p5ex.NonLoopedFrameCounter(15).off();
  private readonly coolingTimer = new p5ex.NonLoopedFrameCounter(60).off();
  private readonly timers = new p5ex.SteppableArray<p5ex.FrameCounter>(3);

  constructor(
    protected readonly p: p5ex.p5exClass,
    private readonly waitingPosition: p5.Vector,
  ) {
    this.position = p.createVector();
    this.position.set(waitingPosition);
    this.velocity = p.createVector();
    this.deathPosition = p.createVector();

    const properColor = p5ex.subtractColor(
      p.color(255),
      p.color(p5ex.cielchColor(80, 100, p.random(0, p.TWO_PI))),
    );
    this.properShapeColor = new p5ex.ShapeColor(
      p,
      null,
      properColor,
    );
    this.properLineColor = new p5ex.ShapeColor(
      p,
      properColor,
      undefined,
      true,
    );

    this.timers.pushRawArray([this.birthTimer, this.deathTimer, this.coolingTimer]);
  }

  step(): void {
    this.timers.step();

    if (this.isAlive) {
      this.position.add(this.velocity);

      if (!Entity.region.contains(this.position)) this.kill();
    }
  }

  draw(): void {
    if (this.birthTimer.isOn) this.drawBirthLine();
    else if (this.deathTimer.isOn) this.drawDeathLine();

    this.p.blendMode(this.p.DIFFERENCE);
    this.properShapeColor.applyColor();
    this.drawShape();

    if (!this.isAlive) {
      this.p.blendMode(this.p.BLEND);
      Entity.deadShapeColor.applyColor(255 * this.coolingTimer.getProgressRatio());
      this.drawShape();
    }
  }

  revive(position: p5.Vector): void {
    this.position.set(position);
    const angle = this.p.random(this.p.TWO_PI);
    this.velocity.set(Math.cos(angle), Math.sin(angle));
    this.isAlive = true;
    this.birthTimer.resetCount().on();
  }

  kill(): void {
    this.isAlive = false;
    this.deathPosition.set(this.position);
    this.position.set(this.waitingPosition);
    this.deathTimer.resetCount().on();
    this.coolingTimer.resetCount().on();
  }

  private drawShape(): void {
    this.p.ellipse(this.position.x, this.position.y, Entity.size, Entity.size);
  }

  private drawTrimmedLine(
    startPoint: p5.Vector,
    endPoint: p5.Vector,
    startRatio: number,
    endRatio: number,
  ): void {
    const differenceX = endPoint.x - startPoint.x;
    const differenceY = endPoint.y - startPoint.y;
    const actualStartX = startPoint.x + startRatio * differenceX;
    const actualStartY = startPoint.y + startRatio * differenceY;
    const actualEndX = startPoint.x + endRatio * differenceX;
    const actualEndY = startPoint.y + endRatio * differenceY;
    this.p.line(
      actualStartX,
      actualStartY,
      actualEndX,
      actualEndY,
    );
  }

  private drawBirthLine(): void {
    const ratio = this.birthTimer.getProgressRatio();
    this.p.blendMode(this.p.DIFFERENCE);
    this.properLineColor.applyColor(64 + ratio * 191);
    this.drawTrimmedLine(
      this.waitingPosition,
      this.position,
      p5ex.easeLinear(ratio),
      p5ex.easeOutQuart(ratio),
    );
  }

  private drawDeathLine(): void {
    const ratio = this.deathTimer.getProgressRatio();
    this.p.blendMode(this.p.BLEND);
    Entity.deadLineColor.applyColor(64 + ratio * 191);
    this.drawTrimmedLine(
      this.deathPosition,
      this.waitingPosition,
      p5ex.easeLinear(ratio),
      p5ex.easeOutQuart(ratio),
    );
  }
}
