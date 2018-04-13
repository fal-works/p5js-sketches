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
    this.setFriction(1);  // !!?!?!?!???

    const graphicsSize = 40;
    this.graphics = p.createGraphics(graphicsSize, graphicsSize);
    const g = this.graphics as any;
    g.pixelDensity(1);  // Not sure if this works
    g.strokeWeight(2);
    g.stroke(32, 32, 32);
    g.fill(255);
    g.rectMode(p.CENTER);
    g.rect(0.5 * g.width, 0.5 * g.height, g.width - 2, g.height - 2, 4);

    // g.ellipseMode(p.CENTER);
    // g.noStroke();
    // g.fill(255, 1024 / graphicsSize);
    // for (let i = 0; i < graphicsSize; i += 1) {
    //   g.ellipse(0.5 * g.width, 0.5 * g.height, i, i);
    // }

    g.textAlign(p.CENTER, p.CENTER);
    g.textFont(font, 0.7 * g.height);
    g.noStroke();
    g.fill(0, 0, 0);
    g.text(character, 0.5 * g.width, 0.38 * g.height);
  }

  step(): void {
    super.step();
    if (this.velocity.magSq() < 10000) this.position.sub(this.velocity);
  }

  draw(): void {
    this.p.image(this.graphics, this.position.x, this.position.y);
    // this.render();
  }

  render(): void {
    // this.p.stroke(0, 0, 0);
    // this.p.fill(255, 255, 255);
    // this.p.rect(this.position.x, this.position.y, 30, 30, 4);

    this.p.noStroke();
    this.p.fill(0, 0, 0);
    this.p.text(this.character, this.position.x, this.position.y);
  }

  drawHud(): void {
    this.p.rect(this.position.x, this.position.y, 30, 30);
  }

  toString(): string {
    return this.character;
  }
}
