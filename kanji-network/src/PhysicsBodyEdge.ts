import * as p5ex from 'p5ex';

export default class PhysicsBodyEdge<T extends p5ex.PhysicsBody>
extends p5ex.NaiveEdge<T>
implements p5ex.Steppable {
  public readonly relativePositionA: p5.Vector;
  public readonly relativePositionB: p5.Vector;
  public directionAngleA: number;
  public directionAngleB: number;
  public distanceSquared: number;

  constructor(protected readonly p: p5ex.p5exClass, nodeA: T, nodeB: T) {
    super(nodeA, nodeB);
    this.relativePositionA = p.createVector();
    this.relativePositionB = p.createVector();
    this.update();
  }

  public step(): void {
    this.update();
  }

  private update(): void {
    this.relativePositionA.set(
      this.nodeA.position.x - this.nodeB.position.x,
      this.nodeA.position.y - this.nodeB.position.y,
    );
    this.relativePositionB.set(
      this.nodeB.position.x - this.nodeA.position.x,
      this.nodeB.position.y - this.nodeA.position.y,
    );

    this.directionAngleA = this.relativePositionA.heading();
    this.directionAngleB = this.directionAngleA + this.p.PI;
    if (this.directionAngleB > this.p.TWO_PI) this.directionAngleB -= this.p.TWO_PI;

    this.distanceSquared = p5ex.distSq(this.nodeA.position, this.nodeB.position);
  }

  public getRelativePosition(referenceNode: T): p5.Vector {
    if (referenceNode === this.nodeB) return this.relativePositionA;
    return this.relativePositionB;
  }

  public getDirectionAngle(referenceNode: T): number {
    if (referenceNode === this.nodeB) return this.directionAngleA;
    return this.directionAngleB;
  }
}
