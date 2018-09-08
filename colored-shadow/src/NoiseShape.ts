import * as p5ex from 'p5ex';

export default class NoiseShape implements p5ex.Sprite {
  public offsetPosition: p5.Vector;
  public shapeSize: number;
  public noiseMagnitudeFactor: number;
  public shapeSizeScale: number = 1;

  private readonly vertexCount: number;
  private readonly noiseDistanceScale: number;
  private readonly noiseTimeScale: number;
  private readonly xNoiseParameterOffset: p5.Vector;
  private readonly yNoiseParameterOffset: p5.Vector;
  private readonly curveVertexIndexArray: number[];
  private readonly vertexPositionArray: p5.Vector[];
  private noiseTime: number;

  constructor(
    protected readonly p: p5ex.p5exClass,
    params: {
      shapeSize: number, noiseMagnitudeFactor: number,
      vertexCount?: number, noiseDistanceScale?: number, noiseTimeScale?: number,
    },
  ) {
    this.offsetPosition = p.createVector();
    this.shapeSize = params.shapeSize;
    this.noiseMagnitudeFactor = params.noiseMagnitudeFactor;

    this.vertexCount
      = Math.max(
        6,
        Math.round(p.scalableCanvas.scaleFactor * (params.vertexCount || 0.2 * params.shapeSize)),
      );
    this.noiseDistanceScale = params.noiseDistanceScale || params.shapeSize / 320;
    this.noiseTimeScale = params.noiseTimeScale || 0.005;

    this.xNoiseParameterOffset
      = p.createVector(Math.random(), Math.random(), Math.random()).mult(1024);
    this.yNoiseParameterOffset
      = p.createVector(Math.random(), Math.random(), Math.random()).mult(1024);

    this.curveVertexIndexArray = [];
    for (let i = 0; i < this.vertexCount; i += 1) {
      this.curveVertexIndexArray.push(i);
    }
    this.curveVertexIndexArray.push(0, 1, 2);

    this.vertexPositionArray = [];
    for (let i = 0; i < this.vertexCount; i += 1) {
      this.vertexPositionArray.push(p.createVector());
    }

    this.noiseTime = 0;
    this.step();
  }

  public step(): void {
    this.updateVerticesPosition();
    this.noiseTime += this.noiseTimeScale;
  }

  public draw(): void {
    this.p.beginShape();

    for (let i = 0, len = this.curveVertexIndexArray.length; i < len; i += 1) {
      this.p.curveVertex(
        this.vertexPositionArray[this.curveVertexIndexArray[i]].x,
        this.vertexPositionArray[this.curveVertexIndexArray[i]].y,
      );
    }

    this.p.endShape();
  }

  public updateVerticesPosition(): void {
    const baseDistance = 0.5 * this.shapeSize * this.shapeSizeScale;
    const noiseMagnitude = this.noiseMagnitudeFactor * baseDistance;

    for (let i = 0; i < this.vertexCount; i += 1) {
      const vertexAngle = (i / this.vertexCount) * this.p.TWO_PI;
      const cosine = Math.cos(vertexAngle);
      const sine = Math.sin(vertexAngle);

      const baseX = baseDistance * cosine;
      const baseY = baseDistance * sine;

      const noiseX = (2 * this.p.noise(
        this.xNoiseParameterOffset.x + this.noiseDistanceScale * cosine,
        this.xNoiseParameterOffset.y + this.noiseDistanceScale * sine,
        this.xNoiseParameterOffset.z + this.noiseTime,
      ) - 1) * noiseMagnitude;

      const noiseY = (2 * this.p.noise(
        this.yNoiseParameterOffset.x + this.noiseDistanceScale * cosine,
        this.yNoiseParameterOffset.y + this.noiseDistanceScale * sine,
        this.yNoiseParameterOffset.z + this.noiseTime,
      ) - 1) * noiseMagnitude;

      this.vertexPositionArray[i].set(
        this.offsetPosition.x + baseX + noiseX,
        this.offsetPosition.y + baseY + noiseY,
      );
    }
  }
}
