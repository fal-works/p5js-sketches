import * as p5ex from 'p5ex';
import KanjiNode from './KanjiNode';
import KanjiEdge from './KanjiEdge';

export default class KanjiGraph implements p5ex.Sprite {
  private readonly nodes = new p5ex.SpriteArray<KanjiNode>();
  private readonly edges = new p5ex.SpriteArray<KanjiEdge>();
  private readonly nodeMap = new Map<string, KanjiNode>();
  private readonly font: p5.Font;
  private averagePosition: p5.Vector;

  private readonly applyRepulsion = (element: p5ex.PhysicsBody, otherElement: p5ex.PhysicsBody) => {
    // Maybe not correct, but works for now
    element.attractEachOther(
      otherElement,
      -7000000 * this.p.unitAccelerationMagnitude,
      0,
      10000 * this.p.unitAccelerationMagnitude,
      200 * this.p.unitAccelerationMagnitude,
    );
  }

  constructor(protected readonly p: p5ex.p5exClass, lines: string[], font: p5.Font) {
    this.font = font;

    for (const line of lines) {
      const characters = p.split(line, '\t');
      const lastIndex = characters.length - 1;
      const lastCharacter = characters[lastIndex];

      for (let i = 0; i < lastIndex; i += 1) {
        this.addEdge(characters[i], lastCharacter);
      }
    }

    this.averagePosition = p.createVector();
  }

  toString(): string {
    let s = '';

    for (let i = 0, len = this.edges.length; i < len; i += 1) {
      s += this.edges.array[i] + '\n';
    }

    return s;
  }

  step(): void {
    this.edges.step();
    this.nodes.step();
    this.nodes.roundRobin(this.applyRepulsion);
  }

  draw(): void {
    this.p.stroke(0, 0, 0);
    this.edges.draw();
    this.nodes.draw();
  }

  addEdge(predecessorCharacter: string, successorCharacter: string): void {
    const predecessorKanji = this.getOrCreateNode(predecessorCharacter);
    const successorKanji = this.getOrCreateNode(successorCharacter);

    // Check if already added
    for (let i = 0; i < this.edges.length; i += 1) {
      const copmaringEdge = this.edges.get(i);

      if (predecessorKanji === copmaringEdge.nodeA && successorKanji === copmaringEdge.nodeB)
        return;
    }

    this.edges.push(new KanjiEdge(
      this.p, predecessorKanji, successorKanji,
    ));
  }

  getAveragePosition(): p5.Vector {
    this.averagePosition.set(0, 0);

    this.nodes.loop(
      (body: p5ex.PhysicsBody) => {
        this.averagePosition.add(body.position);
      },
    );

    this.averagePosition.div(Math.max(1, this.nodes.length));

    return this.averagePosition;
  }

  private getOrCreateNode(character: string): KanjiNode {
    const existingKanji = this.nodeMap.get(character);

    if (existingKanji) return existingKanji;

    const kanji = new KanjiNode(this.p, character, this.font);
    this.nodeMap.set(character, kanji);
    this.nodes.push(kanji);

    return kanji;
  }
}
