import * as p5ex from 'p5ex';
import { createGradationRectangle } from './functions';
import Microbe from './Microbe';

(p5 as any).disableFriendlyErrors = true;

const SKETCH_NAME = 'RectangleMicrobes';

new (p5 as any)();

const sketch = (p: p5ex.p5exClass) => {
  // ---- constants
  let backgroundPixels: number[];

  // ---- variables
  let timeoutId = -1;
  let microbes: p5ex.CleanableSpriteArray<Microbe>;

  // ---- functions
  function createBackgroundPixels(): number[] {
    const g = createGradationRectangle(
      p,
      p.width,
      p.height,
      p.color(255, 255, 255),
      p.color(248, 248, 248),
      p.color(240, 240, 255),
    );
    p.image(g, 0, 0);
    p.loadPixels();

    return p.pixels;
  }

  function mouseIsInCanvas(): boolean {
    if (p.mouseX < 0) return false;
    if (p.mouseX > p.width) return false;
    if (p.mouseY < 0) return false;
    if (p.mouseY > p.height) return false;

    return true;
  }

  function spawn(): void {
    if (microbes.length > 50) return;

    const newMicrobe = new Microbe(p, 6 + p.sq(Math.random()) * 24);
    microbes.push(newMicrobe);
  }

  // ---- Setup & Draw etc.
  p.preload = () => {
  };

  p.setup = () => {
    (window as any).noCanvas();
    p.createScalableCanvas(
      p5ex.ScalableCanvasTypes.FULL,
    );

    backgroundPixels = createBackgroundPixels();
    p.rectMode(p.CENTER);

    microbes = new p5ex.CleanableSpriteArray<Microbe>(256);
  };

  p.draw = () => {
    p.pixels = backgroundPixels;
    p.updatePixels();
    p.scalableCanvas.scale();

    spawn();

    microbes.step();
    microbes.clean();
    microbes.draw();
  };

  p.windowResized = () => {
    p.resizeScalableCanvas();

    if (timeoutId !== -1) clearTimeout(timeoutId);
    timeoutId = setTimeout(
      () => { backgroundPixels = createBackgroundPixels(); },
      200,
    );

    Microbe.resetRegion(p);
  };

  p.mousePressed = () => {

  };

  p.touchMoved = () => {
    if (!mouseIsInCanvas()) return;

    return false;
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);
