import * as p5ex from 'p5ex';

(p5 as any).disableFriendlyErrors = true;

const SKETCH_NAME = 'Stripes';

const sketch = (p: p5ex.p5exClass) => {
  // ---- variables
  let backgroundColor: p5.Color;
  let backgroundPixels: number[];
  let timeoutId = -1;
  const huePatterns = [
    [0, 120, 240],
    [0, 30, 60],
    [0, 150, 210],
    [0, 90, 180, 270],
  ];

  // ---- functions
  function drawStripe(color: p5.Color) {
    p.blendMode(p.MULTIPLY);

    p.noStroke();
    p.fill(color);

    const thickness = p.random(5, 70);
    const interval = thickness + p.random(10, 50);
    const length = p.random(0.4, 0.6) * p.nonScaledHeight;
    const y = p.random(-1, 1) * 100;

    let x = -p.random(0.2, 0.3) * p.nonScaledWidth + thickness / 2;
    const maxX = -x;
    const xOffset = p.random(-1, 1) * 100;

    while (x < maxX) {
      p.rect(x + xOffset, y, thickness, length, 3);
      x += interval;
    }
  }

  function reset(): void {
    p.background(backgroundColor);
    p5ex.applyRandomTexture(p, 16);
    p.loadPixels();
    backgroundPixels = p.pixels;
  }

  // ---- Setup & Draw etc.
  p.preload = () => {
  };

  p.setup = () => {
    p.createScalableCanvas(
      p5ex.ScalableCanvasTypes.SQUARE640x640,
    );

    backgroundColor = p.color(255);
    p.rectMode(p.CENTER);
    p.pixelDensity(1);
    reset();

    p.noLoop();
  };

  p.draw = () => {
    p.pixels = backgroundPixels;
    p.updatePixels();

    p.scalableCanvas.scale();
    p.translate(0.5 * p.nonScaledWidth, 0.5 * p.nonScaledHeight);

    const huePattern = p.random(huePatterns);

    for (let i = 0; i < huePattern.length; i += 1) {
      const theta = p.radians(p.random(40, 70));
      const color = p.color(p5ex.cielchColor(
        100 * Math.sin(theta),
        80 + 50 * Math.cos(theta) + p.random(-1, 1) * 10,
        p.random(p.TWO_PI) + p.radians(huePattern[i]),
        128,
      ));

      drawStripe(color);
    }

    p.filter(p.ERODE);

    p.scalableCanvas.cancelScale();
  };

  p.windowResized = () => {
    p.resizeScalableCanvas();

    if (timeoutId !== -1) clearTimeout(timeoutId);
    timeoutId = setTimeout(
      () => {
        reset();
        p.redraw();
      },
      200,
    );
    p.redraw();
  };

  p.mouseClicked = () => {
    p.redraw();
  };

  p.keyTyped = () => {
    if (p.key === 's') p.saveCanvas('stripes', 'png');
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);
