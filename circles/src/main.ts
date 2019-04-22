import * as p5ex from "p5ex";

const SKETCH_NAME = "Circles";

const sketch = (p: p5ex.p5exClass): void => {
  // ---- variables
  let backgroundColor: p5.Color;

  // ---- functions
  function initialize(): void {
    p.background(backgroundColor);

    const baseHue = p.random(p.TWO_PI);
    const baseX = p.random(0.45, 0.55) * p.nonScaledWidth;
    const baseY = p.random(0.45, 0.55) * p.nonScaledHeight;

    p.scalableCanvas.scale();

    for (let i = 0; i < 16; i++) {
      if (Math.random() < 0.5) {
        const hueValue =
          (baseHue + p.random(-1, 1) * 0.3 * p.TWO_PI) % p.TWO_PI;
        const circleColor = p5ex.cielchColor(100, 100, hueValue);
        p.fill(circleColor[0], circleColor[1], circleColor[2], 48);
      } else {
        p.noFill();
      }
      const diameter = p.random(300, 400);
      p.ellipse(
        baseX + p.random(-1, 1) * 70,
        baseY + p.random(-1, 1) * 70,
        diameter,
        diameter
      );
    }

    p.scalableCanvas.cancelScale();

    p.redraw();
  }

  // ---- Setup & Draw etc.
  p.preload = () => {};

  p.setup = () => {
    p.createScalableCanvas(p5ex.ScalableCanvasTypes.SQUARE640x640);

    backgroundColor = p.color(252);
    p.noStroke();
    p.stroke(0, 64);

    initialize();

    p.noLoop();
  };

  p.draw = () => {};

  p.mousePressed = () => {
    initialize();
  };

  p.keyTyped = () => {
    if (p.key === "p") p.noLoop();

    if (p.key === "s") p.save("circles.png");
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);
