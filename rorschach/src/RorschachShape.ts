import * as p5ex from "p5ex";

export class RorschachShape implements p5ex.Sprite {
  private static temporalVector: p5.Vector;
  private static isNotInitialized = true;

  public shapeSize: number;
  public noiseMagnitudeFactor: number;
  public centerPosition: p5.Vector;
  public rotationAngle: number;

  private readonly vertexCount: number;
  private readonly noiseDistanceScale: number;
  private readonly noiseTimeScale: number;
  private readonly xNoiseParameterOffset: p5.Vector;
  private readonly yNoiseParameterOffset: p5.Vector;
  private noiseTime: number;
  private reachedEndOfScreen: boolean;

  public constructor(
    protected p: p5ex.p5exClass,
    protected frameCounter: p5ex.NonLoopedFrameCounter,
    params: {
      shapeSize: number;
      noiseMagnitudeFactor: number;
      vertexCount?: number;
      noiseDistanceScale?: number;
      noiseTimeScale?: number;
    }
  ) {
    this.shapeSize = params.shapeSize;
    this.noiseMagnitudeFactor = params.noiseMagnitudeFactor;
    this.centerPosition = p.createVector();
    this.rotationAngle = 0;

    this.vertexCount =
      params.vertexCount || Math.floor(0.75 * params.shapeSize);
    this.noiseDistanceScale =
      params.noiseDistanceScale || params.shapeSize / 320;
    this.noiseTimeScale = params.noiseTimeScale || 0.005;

    this.xNoiseParameterOffset = p
      .createVector(Math.random(), Math.random())
      .mult(1024);
    this.yNoiseParameterOffset = p
      .createVector(Math.random(), Math.random())
      .mult(1024);

    this.noiseTime = 0;
    this.reachedEndOfScreen = false;

    if (RorschachShape.isNotInitialized) RorschachShape.initializeStatic(p);
  }

  private static initializeStatic(p: p5): void {
    this.temporalVector = p.createVector();
    this.isNotInitialized = false;
  }

  public step(): void {
    this.noiseTime += this.noiseTimeScale;
  }

  public draw(): void {
    if (this.reachedEndOfScreen) return;

    this.p.translate(this.centerPosition.x, this.centerPosition.y);
    this.p.rotate(this.rotationAngle);
    this.drawVertices(+1);
    this.drawVertices(-1);
    this.p.rotate(-this.rotationAngle);
    this.p.translate(-this.centerPosition.x, -this.centerPosition.y);
  }

  private drawVertices(yScaleFactor: number): void {
    const p = this.p;
    const noiseMagnitude = this.noiseMagnitudeFactor * 0.5 * this.shapeSize;
    p.beginShape();

    let currentBasePositionX = -0.5 * this.shapeSize;
    const basePositionIntervalDistance = this.shapeSize / this.vertexCount;
    const progressRatio = this.frameCounter.getProgressRatio();

    for (let i = 0; i < this.vertexCount; i += 1) {
      const distanceFactor =
        progressRatio * p.sq(p.sin((i / this.vertexCount) * p.PI));

      const noiseX =
        (2 *
          p.noise(
            this.xNoiseParameterOffset.x +
              this.noiseDistanceScale * currentBasePositionX,
            this.xNoiseParameterOffset.y + this.noiseTime
          ) -
          1) *
        noiseMagnitude;

      const noiseY =
        (2 *
          p.noise(
            this.yNoiseParameterOffset.x +
              this.noiseDistanceScale * currentBasePositionX,
            this.yNoiseParameterOffset.y + this.noiseTime
          ) -
          1) *
        noiseMagnitude;

      const vertexPositionX = currentBasePositionX + distanceFactor * noiseX;
      const vertexPositionY =
        yScaleFactor * distanceFactor * (0.3 * this.shapeSize + noiseY);
      p.vertex(vertexPositionX, vertexPositionY);

      const rotatedVertexPosition = RorschachShape.temporalVector;
      rotatedVertexPosition.set(vertexPositionX, vertexPositionY);
      rotatedVertexPosition.rotate(this.rotationAngle);
      this.checkScreen(
        this.centerPosition.x + rotatedVertexPosition.x,
        this.centerPosition.y + rotatedVertexPosition.y
      );

      currentBasePositionX += basePositionIntervalDistance;
    }

    p.endShape();
  }

  private checkScreen(
    absolutePositionX: number,
    absolutePositionY: number
  ): void {
    const xMargin = 0.01 * this.p.nonScaledWidth;
    const yMargin = 0.05 * this.p.nonScaledHeight;
    if (
      absolutePositionX < xMargin ||
      absolutePositionX > this.p.nonScaledWidth - xMargin ||
      absolutePositionY < yMargin ||
      absolutePositionY > this.p.nonScaledHeight - yMargin
    ) {
      this.reachedEndOfScreen = true;
    }
  }
}
