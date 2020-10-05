/**
 * ---- Sketch ----------------------------------------------------------------
 */

import { pauseOrResume } from "@fal-works/p5-extension";
import { p, canvas } from "./common";
import * as Shape from "./shape";

// ---- reset & initialize ----
const drawSketch = (): void => {
  const { width, height } = canvas.logicalSize;

  const resolution = 3;
  const intervalX = width / (resolution + 1);
  const intervalY = height / (resolution + 1);
  for (let x = 1; x <= resolution; x += 1) {
    for (let y = 1; y <= resolution; y += 1) {
      p.push();
      p.translate(x * intervalX, y * intervalY);
      Shape.draw();
      p.pop();
    }
  }
};

export const reset = (): void => {};

export const initialize = (): void => {
  p.imageMode(p.CENTER);

  reset();
};

const draw = () => {
  Shape.update();

  p.background(0);
  canvas.drawScaled(drawSketch);
};

// ---- UI ----

const mousePressed = () => Shape.impact();

const keyTyped = () => {
  switch (p.key) {
    case "p":
      pauseOrResume();
      break;
    case "g":
      p.save("image.png");
      break;
    case "r":
      reset();
      break;
  }

  return false;
};

// ---- p5 methods ----

export const p5Methods = {
  keyTyped,
  mousePressed,
  draw,
};
