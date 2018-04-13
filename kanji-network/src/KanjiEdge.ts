import * as p5ex from 'p5ex';
import KanjiNode from './KanjiNode';
import PhysicsSpring from './PhysicsSpring';

export default class KanjiEdge extends PhysicsSpring<KanjiNode> implements p5ex.Sprite {
  constructor(p: p5ex.p5exClass, nodeA: KanjiNode, nodeB: KanjiNode) {
    super(p, nodeA, nodeB, 20, 0.001);
  }

  step(): void {
    super.step();
  }

  draw(): void {
    this.p.line(
      this.nodeA.position.x,
      this.nodeA.position.y,
      this.nodeB.position.x,
      this.nodeB.position.y,
    );
  }

  drawHud(): void {
    this.draw();
  }

  toString(): string {
    return this.nodeA + ' -> ' + this.nodeB;
  }
}
