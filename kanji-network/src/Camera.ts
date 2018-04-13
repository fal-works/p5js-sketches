import * as p5ex from 'p5ex';

export default class Camera {
  public readonly position: p5.Vector;
  public readonly scaleFactor: p5ex.ScaleFactor;
  public region: p5ex.RectangleRegion;

  constructor(protected p: p5ex.p5exClass, scaleFactorValue: number = 0.8) {
    this.position = p.createVector();
    this.scaleFactor = new p5ex.ScaleFactor(p, scaleFactorValue);
    this.updateRegion();
  }

  apply(): void {
    this.p.translate(-this.position.x, -this.position.y);
    this.scaleFactor.applyScale();
  }

  cancel(): void {
    this.scaleFactor.cancel();
    this.p.translate(this.position.x, this.position.y);
  }

  updatePosition(): void {
    const displacementX =
      2 * this.scaleFactor.reciprocalValue *
      this.p.scalableCanvas.getNonScaledValueOf(this.p.mouseX - this.p.pmouseX);
    const displacementY =
      2 * this.scaleFactor.reciprocalValue *
      this.p.scalableCanvas.getNonScaledValueOf(this.p.mouseY - this.p.pmouseY);
    this.position.sub(displacementX, displacementY);
    this.updateRegion();
  }

  protected updateRegion(): void {
    const factor = this.scaleFactor.reciprocalValue;
    const halfWidth = 0.5 * factor * this.p.nonScaledWidth;
    const halfHeight = 0.5 * factor * this.p.nonScaledHeight;
    const x = factor * this.position.x;
    const y = factor * this.position.y;
    this.region = new p5ex.RectangleRegion(
      x - halfWidth, y - halfHeight,
      x + halfWidth, y + halfHeight,
      factor * 32,
    );
  }
}
