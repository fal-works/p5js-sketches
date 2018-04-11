import * as p5ex from 'p5ex';

(p5 as any).disableFriendlyErrors = true;

const SKETCH_NAME = 'ObjectPool';

new (p5 as any)();

const sketch = (p: p5ex.p5exClass) => {
  // ---- constants
  const backgroundColor = p.color(248);
  const canvasRegion = new p5ex.RectangleRegion(0, 0, 640, 640);
  const worldRegion = new p5ex.RectangleRegion(40, 120, 600, 600);
  const regionColor = new p5ex.ShapeColor(p, p.color(0, 24), p.color(252));
  const cursorColor = new p5ex.ShapeColor(p, null, p.color(0, 64));
  const cursorSize = 24;
  const cursorTransformFactor = 0.3;

  // ---- variables
  const entityPool = new p5ex.SpriteArray<Entity>(256);
  const aliveEntities = new p5ex.CleanableSpriteArray<Entity>(256);
  const mousePosition = p.createVector();
  const globalTimer = new p5ex.LoopedFrameCounter(60);

  // ---- functions
  function reviveEntity(position: p5.Vector): void {
    if (!worldRegion.contains(position)) return;

    if (entityPool.length === 0) return;

    const newEntity: Entity = entityPool.pop();
    newEntity.revive(position);
    aliveEntities.push(newEntity);
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
      entityPool,
      worldRegion,
      new p5ex.ShapeColor(p, null, p.color(64), true),
      new p5ex.ShapeColor(p, p.color(128), null, true),
    );

    for (let i = 0; i < 128; i += 1) {
      entityPool.push(
        new Entity(p),
      );
    }

    p.rectMode(p.CORNERS);
    p.ellipseMode(p.CENTER);
    p.strokeWeight(1.5);

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

    entityPool.step();
    entityPool.draw();
    aliveEntities.step();
    aliveEntities.clean();
    aliveEntities.draw();
  };

  p.windowResized = () => {
    p.resizeScalableCanvas();
    p.background(255);
  };

  p.mousePressed = () => {
  };

  p.touchMoved = () => {
    if (canvasRegion.contains(mousePosition)) return false;
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);


class Entity implements p5ex.CleanableSprite {
  private static pool: p5ex.SpriteArray<Entity>;
  private static waitingColumnCount = 32;
  private static size = 12;
  private static region: p5ex.RectangleRegion;
  private static deadShapeColor: p5ex.ShapeColor;
  private static deadLineColor: p5ex.ShapeColor;

  static initialize(
    pool: p5ex.SpriteArray<Entity>,
    region: p5ex.RectangleRegion,
    deadShapeColor: p5ex.ShapeColor,
    deadLineColor: p5ex.ShapeColor,
  ): void {
    this.pool = pool;
    this.region = region;
    this.deadShapeColor = deadShapeColor;
    this.deadLineColor = deadLineColor;
  }

  public isToBeRemoved: boolean = false;
  public isAlive: boolean = false;
  private readonly position: p5.Vector;
  private readonly waitingPosition: p5.Vector;
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
  ) {
    this.waitingPosition = p.createVector();
    this.resetWaitingPosition();
    this.position = p.createVector();
    this.position.set(this.waitingPosition);
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

    }
  }

  clean(): void {
    if (this.isAlive && !Entity.region.contains(this.position)) this.kill();
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
    this.isToBeRemoved = false;
    this.position.set(position);
    const angle = this.p.random(this.p.TWO_PI);
    this.velocity.set(Math.cos(angle), Math.sin(angle));
    this.isAlive = true;
    this.birthTimer.resetCount().on();
  }

  kill(): void {
    this.isToBeRemoved = true;
    this.isAlive = false;
    this.deathPosition.set(this.position);
    this.resetWaitingPosition();
    this.position.set(this.waitingPosition);
    this.deathTimer.resetCount().on();
    this.coolingTimer.resetCount().on();

    Entity.pool.push(this);
  }

  private resetWaitingPosition(): void {
    const index = Entity.pool.length;
    const maxX = Entity.waitingColumnCount;
    const entityInterval = this.p.nonScaledWidth / (maxX + 1);
    this.waitingPosition.set(
      (1 + index % maxX) * entityInterval,
      (1 + Math.floor(index / maxX)) * entityInterval,
    );
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
