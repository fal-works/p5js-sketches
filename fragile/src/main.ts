import * as p5ex from 'p5ex';

const SKETCH_NAME = 'Fragile';

class Line extends p5ex.NaiveEdge<p5.Vector> implements p5ex.Sprite {
  timer: p5ex.LoopedFrameCounter;
  velocityA: p5.Vector;
  velocityB: p5.Vector;
  surfaceColor: p5ex.ShapeColor;
  edgeColor: p5ex.ShapeColor;

  previousPositionA: p5.Vector;
  previousPositionB: p5.Vector;

  constructor(
    protected readonly p: p5ex.p5exClass,
    v1: p5.Vector,
    v2: p5.Vector,
    protected readonly region: p5ex.RectangleRegion,
  ) {
    super(v1, v2);

    this.previousPositionA = this.nodeA.copy();
    this.previousPositionB = this.nodeB.copy();

    this.velocityA = p5.Vector.random2D().mult(0.5);
    this.velocityB = p5.Vector.random2D().mult(0.5);

    const changeMotion = () => {
      // this.velocityA = p5.Vector.fromAngle(
      //   this.velocityA.heading() + p.PI + p.random(-1, 1) * p.random(1 / 4, 3 / 4) * p.PI,
      // );
      // this.velocityB = p5.Vector.fromAngle(
      //   this.velocityB.heading() + p.PI + p.random(-1, 1) * p.random(1 / 4, 3 / 4) * p.PI,
      // );
      this.velocityA.rotate(p.random(p.TWO_PI));
      this.velocityB.rotate(p.random(p.TWO_PI));
    };
    this.timer = new p5ex.LoopedFrameCounter(120, changeMotion);

    let surfaceAlpha: number = 2;
    let edgeAlpha: number = 4;

    switch (p5ex.randomInt(3)) {
      case 0:
        surfaceAlpha = 2;
        edgeAlpha = 4;
        break;
      case 1:
        surfaceAlpha = 10;
        edgeAlpha = 0;
        break;
      case 2:
        surfaceAlpha = 2;
        edgeAlpha = 36;
        break;
    }

    this.surfaceColor = new p5ex.ShapeColor(p, p.color(0, 0, 16, surfaceAlpha), null, true);
    this.edgeColor = new p5ex.ShapeColor(p, p.color(0, 0, 16, edgeAlpha), null, true);
  }

  step() {
    this.timer.step();

    this.previousPositionA.set(this.nodeA);
    this.previousPositionB.set(this.nodeB);

    this.nodeA.add(this.velocityA);
    this.nodeB.add(this.velocityB);

    if (this.nodeA.x < this.region.leftPositionX || this.nodeA.x > this.region.rightPositionX)
      this.velocityA.x *= -1;

    if (this.nodeA.y < this.region.topPositionY || this.nodeA.y > this.region.bottomPositionY)
      this.velocityA.y *= -1;

    if (this.nodeB.x < this.region.leftPositionX || this.nodeB.x > this.region.rightPositionX)
      this.velocityB.x *= -1;

    if (this.nodeB.y < this.region.topPositionY || this.nodeB.y > this.region.bottomPositionY)
      this.velocityB.y *= -1;

    this.region.constrain(this.nodeA);
    this.region.constrain(this.nodeB);
  }

  draw() {
    this.surfaceColor.applyColor();
    this.p.line(this.nodeA.x, this.nodeA.y, this.nodeB.x, this.nodeB.y);

    this.edgeColor.applyColor();
    this.p.line(this.previousPositionA.x, this.previousPositionA.y, this.nodeA.x, this.nodeA.y);
    this.p.line(this.previousPositionB.x, this.previousPositionB.y, this.nodeB.x, this.nodeB.y);
  }
}

const sketch = (p: p5ex.p5exClass) => {
  // ---- variables
  let backgroundColor: p5.Color;
  // let backgroundPixels: number[];
  let timeoutId: number = -1;
  let looping = true;

  const repetitionPerFrame = 8;
  let myLine: Line;

  // ---- functions
  function reset(): void {
    p.background(backgroundColor);
    p5ex.applyRandomTexture(p, 32, true, 208, 208, 255);

    // p.loadPixels();
    // backgroundPixels = p.pixels;

    const region = new p5ex.RectangleRegion(-200, -200, 200, 200);
    const nodeA = p5.Vector.random2D().mult(50);
    myLine = new Line(p, nodeA, p5.Vector.mult(nodeA, -1), region);
  }

  // ---- Setup & Draw etc.
  p.preload = () => {
  };

  p.setup = () => {
    p.createScalableCanvas(
      p5ex.ScalableCanvasTypes.SQUARE640x640,
    );

    backgroundColor = p.color(255, 255, 255);

    reset();
  };

  p.draw = () => {
    // p.pixels = backgroundPixels;
    // p.updatePixels();

    p.scalableCanvas.scale();
    p.translate(0.5 * p.nonScaledWidth, 0.5 * p.nonScaledHeight);

    for (let i = 0; i < repetitionPerFrame; i += 1) {
      myLine.step();
      myLine.draw();
    }

    p.scalableCanvas.cancelScale();
  };


  p.windowResized = () => {
    p.resizeScalableCanvas();
    if (timeoutId !== -1) clearTimeout(timeoutId);
    timeoutId = setTimeout(reset, 200);
  };

  p.mousePressed = () => {
    if (!p5ex.mouseIsInCanvas(p)) return;

    if (looping) p.noLoop();
    else {
      p.loop();
      reset();
    }

    looping = !looping;
  };

  p.keyTyped = () => {
    if (p.key === 's') p.saveCanvas('fragile', 'png');
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);
