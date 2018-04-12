import * as p5ex from 'p5ex';

export default class KanjiNode extends p5ex.PhysicsBody implements p5ex.Sprite {
  private graphics: p5.Graphics;

  constructor(
    protected readonly p: p5ex.p5exClass,
    protected readonly character: string,
    font: p5.Font,
  ) {
    super();
    this.position.set(p.random(-320, 320), p.random(-320, 320));
    this.setFriction(0.07);

    this.graphics = p.createGraphics(40, 40);
    const g = this.graphics as any;
    g.strokeWeight(2);
    g.stroke(128, 128, 128);
    g.rectMode(p.CENTER);
    g.rect(0.5 * g.width, 0.5 * g.height, g.width - 2, g.height - 2, 4);
    g.textAlign(p.CENTER, p.CENTER);
    g.textFont(font, 0.75 * g.height);
    g.noStroke();
    g.fill(32, 32, 32);
    g.text(character, 0.5 * g.width, 0.4 * g.height);
  }

  step(): void {
    super.step();
  }

  draw(): void {
    // this.p.stroke(0, 0, 0);
    // this.p.fill(255, 255, 255);
    // this.p.rect(this.position.x, this.position.y, 30, 30, 4);

    // this.p.noStroke();
    // this.p.fill(0, 0, 0);
    // this.p.text(this.character, this.position.x, this.position.y);

    this.p.image(this.graphics, this.position.x, this.position.y);
  }

  toString(): string {
    return this.character;
  }
}
