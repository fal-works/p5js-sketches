import * as p5ex from 'p5ex';
import Graph from './Graph';

(p5 as any).disableFriendlyErrors = true;

const SKETCH_NAME = 'Koenigsberk';

new (p5 as any)();

const sketch = (p: p5ex.p5exClass) => {
  // ---- constants
  const backgroundColor = p.color(248);

  // ---- variables
  let graph: Graph;

  // ---- functions
  function mouseIsInCanvas(): boolean {
    if (p.mouseX < 0) return false;
    if (p.mouseX > p.width) return false;
    if (p.mouseY < 0) return false;
    if (p.mouseY > p.height) return false;

    return true;
  }

  // ---- Setup & Draw etc.
  p.preload = () => {
  };

  p.setup = () => {
    (window as any).noCanvas();
    p.createScalableCanvas(
      p5ex.ScalableCanvasTypes.FULL,
    );

    p.setFrameRate(30);

    p.ellipseMode(p.CENTER);
    p.strokeWeight(1.5);

    graph = new Graph(p);
  };

  p.draw = () => {
    p.background(backgroundColor);
    p.scalableCanvas.scale();

    graph.step();
    graph.draw();
  };

  p.windowResized = () => {
    p.resizeScalableCanvas();
    p.background(255);
  };

  p.mousePressed = () => {
    graph.reset();
  };

  p.touchMoved = () => {
    if (!mouseIsInCanvas()) return;

    return false;
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);
