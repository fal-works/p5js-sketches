import * as p5ex from 'p5ex';

const SKETCH_NAME = 'Untitled20180630';

const sketch = (p: p5ex.p5exClass) => {
  // ---- variables
  let backgroundColor: p5.Color;
  let backgroundPixels: number[];
  let resetIndicator: boolean = false;
  let resizeIndicator: boolean = false;
  let timeoutId: number = -1;

  let firstArcRotationAngle: number;
  let firstArcEndAngle: number;
  let secondArcRotationAngle: number;
  let secondArcEndAngle: number;
  let linesRotationAngle: number;
  let firstLineStartX: number;
  let firstLineEndX: number;
  let firstLineY: number;
  let secondLineStartX: number;
  let secondLineEndX: number;
  let secondLineY: number;

  // ---- functions
  function drawShape(r: p5 | p5.Graphics): void {
    const g = r as any;

    g.rotate(firstArcRotationAngle);
    g.arc(0, 0, 200, 200, 0, firstArcEndAngle);
    g.rotate(-firstArcRotationAngle);

    g.rotate(secondArcRotationAngle);
    g.arc(0, 0, 230, 230, 0, secondArcEndAngle);
    g.rotate(-secondArcRotationAngle);

    g.rotate(linesRotationAngle);
    g.line(firstLineStartX, firstLineY, firstLineEndX, firstLineY);
    g.line(secondLineStartX, secondLineY, secondLineEndX, secondLineY);
    g.rotate(-linesRotationAngle);
  }

  // ---- Setup & Draw etc.
  p.preload = () => {
  };

  p.setup = () => {
    p.createScalableCanvas(
      p5ex.ScalableCanvasTypes.SQUARE640x640,
    );

    backgroundColor = p.color(255, 255, 255);
    p.rectMode(p.CENTER);
    p.pixelDensity(1);

    p.noFill();
    p.stroke(0, 0, 32);
    p.strokeWeight(2);
    p.imageMode(p.CENTER);

    resetIndicator = true;
    p.noLoop();
  };

  p.draw = () => {
    if (resetIndicator || resizeIndicator) {
      p.background(backgroundColor);
      p5ex.applyRandomTexture(p, 32, true, 192, 192, 255);

      p.loadPixels();
      backgroundPixels = p.pixels;

      resetIndicator = false;

      if (resizeIndicator) {
        resizeIndicator = false;
        if (timeoutId !== -1) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => { p.redraw(); }, 100);
        return;
      }
    }

    p.pixels = backgroundPixels;
    p.updatePixels();

    // p.scalableCanvas.scale();

    firstArcRotationAngle = p.random(p.TWO_PI);
    firstArcEndAngle = p.random(0.3, 0.8) * p.TWO_PI;
    secondArcRotationAngle = p.random(p.TWO_PI);
    secondArcEndAngle = p.random(0.3, 0.8) * p.TWO_PI;
    linesRotationAngle = p.radians(p.random([0, 30, 90, 150]));
    firstLineStartX = -p.random(0.1, 0.35) * p.nonScaledWidth;
    firstLineEndX = p.random(0.1, 0.2) * p.nonScaledWidth;
    firstLineY = -8;
    secondLineStartX = -p.random(0.1, 0.2) * p.nonScaledWidth;
    secondLineEndX = p.random(0.1, 0.35) * p.nonScaledWidth;
    secondLineY = 8;

    const g: any = p.createGraphics(p.width, p.height);
    g.translate(0.5 * g.width, 0.5 * g.height);
    g.scale(p.scalableCanvas.scaleFactor);
    g.noFill();
    g.stroke(0, 0, 64, 12);
    g.strokeWeight(2);
    g.translate(0, 1);
    drawShape(g);
    g.translate(1, -1);
    drawShape(g);
    g.translate(0, 1);
    drawShape(g);
    // g.filter(p.BLUR, 1);
    g.stroke(255, 255, 255);
    g.translate(-1, -1);
    drawShape(g);

    p.translate(0.5 * p.width, 0.5 * p.height);
    p.image(g, 0, 0);

    // p.scalableCanvas.cancelScale();
  };


  p.windowResized = () => {
    resizeIndicator = true;
    p.resizeScalableCanvas();
  };

  p.mousePressed = () => {
    if (!p5ex.mouseIsInCanvas(p)) return;
    p.redraw();
  };

  p.keyTyped = () => {
    if (p.key === 's') p.saveCanvas('image', 'png');
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);
