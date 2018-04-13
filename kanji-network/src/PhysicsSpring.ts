import * as p5ex from 'p5ex';
import PhysicsBodyEdge from './PhysicsBodyEdge';

export default class PhysicsSpring<T extends p5ex.PhysicsBody> extends PhysicsBodyEdge<T> {
  private static temporalVector: p5.Vector;
  private static isInitialized = false;

  public equilibriumLength: number;
  public springConstant: number;

  constructor(
    p: p5ex.p5exClass,
    nodeA: T,
    nodeB: T,
    equilibriumLength: number = 100,
    springConstant: number = 0.005,
  ) {
    super(p, nodeA, nodeB);

    if (!PhysicsSpring.isInitialized) {
      PhysicsSpring.temporalVector = p.createVector();
      PhysicsSpring.isInitialized = true;
    }

    this.equilibriumLength = equilibriumLength;
    this.springConstant = springConstant;
  }

  public step(): void {
    super.step();

    const bodyA = this.nodeA;
    const bodyB = this.nodeB;

    const stretchLength = this.p.sqrt(this.distanceSquared) - this.equilibriumLength;

    const tmpVec = PhysicsSpring.temporalVector;
    tmpVec.set(this.relativePositionB);
    tmpVec.setMag(this.springConstant * stretchLength); // set spring force to be applied to A
    bodyA.applyForce(tmpVec);
    tmpVec.mult(-1); // set spring force to be applied to B
    bodyB.applyForce(tmpVec);
  }
}
