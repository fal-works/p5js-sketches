import * as p5ex from 'p5ex';

abstract class Direction {
  widthFactor: number;
  heightFactor: number;
  abstract changePosition(position: p5.Vector, speed: number): void;
}

abstract class HorizontalDirection extends Direction {
  widthFactor = 1.25;
  heightFactor = 0.75;
}

abstract class VerticalDirection extends Direction {
  widthFactor = 0.75;
  heightFactor = 1.25;
}

class LeftDirection extends HorizontalDirection {
  changePosition(position: p5.Vector, speed: number): void {
    position.x -= speed;
  }
}

class UpDirection extends VerticalDirection {
  changePosition(position: p5.Vector, speed: number): void {
    position.y -= speed;
  }
}

class RightDirection extends HorizontalDirection {
  changePosition(position: p5.Vector, speed: number): void {
    position.x += speed;
  }
}

class DownDirection extends VerticalDirection {
  changePosition(position: p5.Vector, speed: number): void {
    position.y += speed;
  }
}

export default class Microbe implements p5ex.CleanableSprite {
  private static isInitialized = false;
  private static region: p5ex.RectangleRegion;
  private static colors: p5ex.RandomShapeColor;
  private static readonly directions = [
    new LeftDirection(),
    new UpDirection(),
    new RightDirection(),
    new DownDirection(),
  ];

  public static resetRegion(p: p5ex.p5exClass): void {
    Microbe.region = new p5ex.RectangleRegion(0, 0, p.nonScaledWidth, p.nonScaledHeight, 50);
  }

  public isToBeRemoved = false;
  protected readonly position: p5.Vector;
  protected direction: Direction;
  protected readonly shapeColor: p5ex.ShapeColor;
  protected totalElapsedInternalTime: number;
  protected readonly appearanceTimer: p5ex.NonLoopedFrameCounter;
  protected readonly accelerationTimer: p5ex.NonLoopedFrameCounter;
  protected readonly decelerationTimer: p5ex.NonLoopedFrameCounter;

  constructor(protected readonly p: p5ex.p5exClass, protected readonly size: number) {
    if (!Microbe.isInitialized) {
      Microbe.resetRegion(p);
      Microbe.colors =
        new p5ex.RandomShapeColor()
          .pushCandidate(new p5ex.ShapeColor(p, null, p.color(32, 32, 32), true))
          .pushCandidate(new p5ex.ShapeColor(p, null, p.color('#263de2'), true))
          .pushCandidate(new p5ex.ShapeColor(p, null, p.color('#b00101'), true))
          .pushCandidate(new p5ex.ShapeColor(p, null, p.color('#d2a908'), true))
          ;
      Microbe.isInitialized = true;
    }

    const spawnMargin = 100;
    const region = Microbe.region;
    this.position = p.createVector(
      p.random(region.leftPositionX + spawnMargin, region.rightPositionX - spawnMargin),
      p.random(region.topPositionY + spawnMargin, region.bottomPositionY - spawnMargin),
    );
    this.direction = p.random(Microbe.directions);
    this.shapeColor = Microbe.colors.get();
    this.totalElapsedInternalTime = 10000 * Math.random();
    this.appearanceTimer = new p5ex.NonLoopedFrameCounter(120);
    this.accelerationTimer = new p5ex.NonLoopedFrameCounter(60).off();
    this.decelerationTimer = new p5ex.NonLoopedFrameCounter(
      60, () => { this.accelerationTimer.resetCount().on(); },
    ).off();
  }

  step(): void {
    this.appearanceTimer.step();
    this.accelerationTimer.step();
    this.decelerationTimer.step();

    const activityFactor = this.accelerationTimer.isOn ?
      this.accelerationTimer.getProgressRatio() :
      this.decelerationTimer.isOn ?
        (1 - this.decelerationTimer.getProgressRatio()) : 1;
    const elapsedInternalTime = activityFactor * 32 / this.size;
    const speed = 2 * elapsedInternalTime;
    this.direction.changePosition(this.position, speed);
    this.totalElapsedInternalTime += elapsedInternalTime;

    if (Math.random() < 0.01) this.direction = this.p.random(Microbe.directions);

    if (!this.accelerationTimer.isOn && !this.decelerationTimer.isOn && Math.random() < 0.01)
      this.decelerationTimer.resetCount().on();
  }

  clean(): void {
    if (!Microbe.region.contains(this.position)) this.isToBeRemoved = true;
  }

  draw(): void {
    this.shapeColor.applyColor(255 * this.appearanceTimer.getProgressRatio());
    const widthFactor = 1 + 0.25 * Math.sin(0.1 * this.totalElapsedInternalTime);
    const heightFactor = 1 + 0.25 * Math.sin(Math.PI + 0.1 * this.totalElapsedInternalTime);
    this.p.rect(
      this.position.x,
      this.position.y,
      widthFactor * this.direction.widthFactor * this.size,
      heightFactor * this.direction.heightFactor * this.size,
    );
  }
}
