import * as p5ex from 'p5ex';

const SKETCH_NAME = 'Hypotrochoid';

const sketch = (p: p5ex.p5exClass) => {
  // ---- variables
  let backgroundColor: p5.Color;
  let rc: number;
  let rm: number;
  let rd: number;
  let d: number;
  let rcNoizeOffset: number;
  let rmNoizeOffset: number;
  let rdNoizeOffset: number;

  // ---- functions
  function reset() {
    rcNoizeOffset = p.random(1000);
    rmNoizeOffset = p.random(1000);
    rdNoizeOffset = p.random(1000);
  }

  // ---- Setup & Draw etc.
  p.preload = () => {
  };

  p.setup = () => {
    p.createScalableCanvas(
      p5ex.ScalableCanvasTypes.SQUARE640x640,
    );
    p.stroke(0, 160);
    p.noFill();

    backgroundColor = p.color(252);
    reset();
  };

  p.draw = () => {
    p.background(backgroundColor);
    p.scalableCanvas.scale();

    p.translate(320, 320);

    rc = 3 + 6 * p.noise(rcNoizeOffset + p.frameCount * 0.0005);
    rm = 1 + 6 * p.noise(rmNoizeOffset + p.frameCount * 0.0005);
    rd = 3 + 6 * p.noise(rdNoizeOffset + p.frameCount * 0.01);
    d = rc - rm;

    p.beginShape();
    for (let i = 0, len = 360 * 30; i < len; i += 1) {
      const t = -p.QUARTER_PI + p.TWO_PI * i / 360;
      const x = d * Math.cos(t) + rd * Math.cos(t * d / rm);
      const y = d * Math.sin(t) - rd * Math.sin(t * d / rm);
      p.vertex(30 * x, 30 * y);
    }
    p.endShape();

    p.scalableCanvas.cancelScale();
  };

  p.windowResized = () => {
  };

  p.mousePressed = () => {
    // if (!p5ex.mouseIsInCanvas(p)) return;
    // p.noLoop();
    reset();
  };

  p.keyTyped = () => {
    if (p.keyCode === (p as any).ENTER) p.noLoop();
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);
