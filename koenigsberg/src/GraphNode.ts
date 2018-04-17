import * as p5ex from 'p5ex';

export default class GraphNode extends p5ex.PhysicsBody implements p5ex.Sprite {
  private static nextNodeNumber = 0;
  private static effectColor: p5ex.ShapeColor;
  private static isInitialized = false;

  public readonly nodeNumber;
  private readonly shapeColor: p5ex.ShapeColor;
  private readonly effectTimer: p5ex.NonLoopedFrameCounter;
  private readonly effectPosition: p5.Vector;

  constructor(
    protected readonly p: p5ex.p5exClass,
  ) {
    super();

    if (!GraphNode.isInitialized) {
      GraphNode.effectColor = new p5ex.ShapeColor(p, p.color(0, 192), null, true);
      GraphNode.isInitialized = true;
    }

    this.nodeNumber = GraphNode.nextNodeNumber;
    GraphNode.nextNodeNumber += 1;

    this.position.set(
      p.random(0.25 * p.nonScaledWidth, 0.75 * p.nonScaledWidth),
      p.random(0.25 * p.nonScaledHeight, 0.75 * p.nonScaledHeight),
    );
    this.setFriction(0.1);

    this.shapeColor = new p5ex.ShapeColor(
      p, p.color(64), p.color(p5ex.cielchColor(80, 50, p.random(p.TWO_PI))),
    );

    this.effectTimer = new p5ex.NonLoopedFrameCounter(0.5 * p.idealFrameRate).off();
    this.effectPosition = p.createVector();
  }

  step(): void {
    super.step();
    this.effectTimer.step();
    // if (this.velocity.magSq() < 10000) this.position.sub(this.velocity);
  }

  draw(): void {
    this.shapeColor.applyColor();
    this.p.strokeWeight(1.5);
    this.p.ellipse(this.position.x, this.position.y, 30, 30);

    if (this.effectTimer.isOn) {
      const ratio = this.effectTimer.getProgressRatio();
      GraphNode.effectColor.applyColor((1 - ratio) * 255);
      this.p.strokeWeight(4 * (1 - ratio));
      const diameter = 30 + 40 * p5ex.easeOutQuart(ratio);
      this.p.ellipse(this.effectPosition.x, this.effectPosition.y, diameter, diameter);
    }
  }

  fireEffect(): void {
    this.effectPosition.set(this.position);
    this.effectTimer.resetCount().on();
  }

  toString(): string {
    return this.nodeNumber;
  }
}
