/**
 * ---- Main sketch ----------------------------------------------------------
 */

import { getElementOrBody } from "./common/environment";

import { createScaledCanvas, ScaledCanvas } from "./p5util/canvas";
import { createPixels } from "./p5util/drawing";

const HTML_ELEMENT = getElementOrBody("Title");

const sketch = (p: p5): void => {
  // ---- variables
  let canvas: ScaledCanvas;
  let backgroundPixels: number[];
  let backgroundColor: p5.Color;

  // ---- functions

  // ---- initialize & reset
  function initializeStyle() {}

  function initializeData() {}

  function reset() {}

  // ---- core drawing process
  function drawSketch(): void {}

  // ---- setup & draw etc.
  p.preload = () => {};

  p.setup = () => {
    const nonScaledSize = { width: 800, height: 800 };
    canvas = createScaledCanvas(p, HTML_ELEMENT, nonScaledSize);
    backgroundColor = p.color(252, 252, 255);
    backgroundPixels = createPixels(p, (p: p5) => {
      p.background(backgroundColor);
    });

    initializeStyle();
    initializeData();
    reset();
  };

  p.draw = () => {
    p.pixels = backgroundPixels;
    p.updatePixels();

    canvas.drawScaled(drawSketch);
  };

  p.mousePressed = () => {
    reset();
  };

  p.keyTyped = () => {
    if (p.key === "p") p.noLoop();
    if (p.key === "s") p.save("image.png");
  };
};

new p5(sketch, HTML_ELEMENT);
