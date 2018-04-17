import * as p5ex from 'p5ex';
import GraphNode from './GraphNode';
import PhysicsSpring from './PhysicsSpring';

function log(s: string): void {
  // console.log(s);
}

// function drawNoiseLine(
//   p: p5ex.p5exClass,
//   distance: number,
//   amplitude: number,
//   noiseScale: number,
//   noiseOffset: number,
//   noiseTime: number,
//   startRatio: number = 0,
//   endRatio: number = 1,
//   resolution: number = 100,
// ): void {
//   p.beginShape();

//   for (let i = 0; i <= resolution; i += 1) {
//     const currentRatio = i / resolution;

//     if (currentRatio < startRatio || currentRatio > endRatio) continue;

//     const noiseValue = p.sq(p.noise(noiseScale * i + noiseOffset + noiseTime));
//     const y = amplitude * p.map(noiseValue, 0, 1, -1, 1);
//     const yFactor = Math.sin(p.map(i, 0, resolution, 0, p.PI));
//     p.vertex(
//       i * distance / resolution,
//       yFactor * y,
//     );
//   }

//   p.endShape();
// }

export default class GraphEdge extends PhysicsSpring<GraphNode> implements p5ex.Sprite {
  private static initialColor: p5ex.ShapeColor;
  private static finalColor: p5ex.ShapeColor;
  private static graphEdgeInitialized = false;

  private startPointTimer: p5ex.NonLoopedFrameCounter;
  private endPointTimer: p5ex.NonLoopedFrameCounter;
  public midPoint: p5ex.PhysicsBody;
  private springA: PhysicsSpring<p5ex.PhysicsBody>;
  private springB: PhysicsSpring<p5ex.PhysicsBody>;
  private startRatio = new p5ex.NumberContainer(0);
  private endRatio = new p5ex.NumberContainer(1);
  public nextEdge: GraphEdge | null;

  constructor(p: p5ex.p5exClass, nodeA: GraphNode, nodeB: GraphNode) {
    super(p, nodeA, nodeB, 200, 0.00001);

    if (!GraphEdge.graphEdgeInitialized) {
      GraphEdge.initialColor = new p5ex.ShapeColor(p, p.color(0, 128), null);
      GraphEdge.finalColor = new p5ex.ShapeColor(p, p.color(0, 224), null);
      GraphEdge.graphEdgeInitialized = true;
    }

    this.startPointTimer = new p5ex.NonLoopedFrameCounter(
      0.5 * p.idealFrameRate,
      () => {
        if (this.nextEdge) { this.nextEdge.fire(this.nodeA); }
      },
    ).off();
    this.endPointTimer = new p5ex.NonLoopedFrameCounter(
      0.5 * p.idealFrameRate,
      () => {
        if (this.nextEdge) { this.nextEdge.fire(this.nodeB); }
      },
    ).off();
    this.midPoint = new p5ex.PhysicsBody();
    this.midPoint.position.set(
      0.5 * (nodeA.x + nodeB.x) + p.random(-10, 10),
      0.5 * (nodeA.y + nodeB.y) + p.random(-10, 10),
    );
    this.midPoint.mass = 0.2;
    this.midPoint.setFriction(0.1);
    this.springA = new PhysicsSpring<p5ex.PhysicsBody>(
      p, nodeA, this.midPoint, 0.4 * this.equilibriumLength, 0.005,
    );
    this.springB = new PhysicsSpring<p5ex.PhysicsBody>(
      p, nodeB, this.midPoint, 0.4 * this.equilibriumLength, 0.005,
    );

    this.nextEdge = null;
  }

  step(): void {
    super.step();
    this.startPointTimer.step();
    this.endPointTimer.step();

    this.midPoint.step();

    const distance = p5.Vector.dist(this.nodeA.position, this.nodeB.position);
    this.springA.equilibriumLength = 0.4 * distance;
    this.springA.step();
    this.springB.equilibriumLength = 0.4 * distance;
    this.springB.step();
  }

  draw(): void {
    const curve = new p5ex.QuadraticBezierCurve(
      this.p,
      this.nodeA.position,
      this.midPoint.position,
      this.nodeB.position,
      90,
      this.startRatio,
      this.endRatio,
    );

    GraphEdge.initialColor.applyColor();
    this.p.strokeWeight(1);
    this.startRatio.value = 0;
    this.endRatio.value = 1;
    curve.draw();

    GraphEdge.finalColor.applyColor();
    this.p.strokeWeight(2);
    if (this.endPointTimer.isOn || this.endPointTimer.isCompleted) {
      this.startRatio.value = 0;
      this.endRatio.value = this.endPointTimer.getProgressRatio();
      curve.draw();
    } else if (this.startPointTimer.isOn || this.startPointTimer.isCompleted) {
      this.startRatio.value = 1 - this.startPointTimer.getProgressRatio();
      this.endRatio.value = 1;
      curve.draw();
    }
  }

  fire(node: GraphNode): void {
    log('fire ' + this + ' at ' + node);

    if (node === this.nodeA) {
      this.endPointTimer.on();
    } else if (node === this.nodeB) {
      this.startPointTimer.on();
    }

    node.fireEffect();
  }

  toString(): string {
    return this.nodeA + '-' + this.nodeB;
  }

  isIncidentToEdge(edge: GraphEdge) {
    return this.isIncidentTo(edge.nodeA) || this.isIncidentTo(edge.nodeB);
  }
}
