/**
 * ---- Sketch ----------------------------------------------------------------
 */

import { storePixels, pauseOrResume } from "@fal-works/p5-extension";
import { p, canvas, resetCommon } from "./common";

// ---- variables | functions ----
let drawBackground: () => void;

// ---- reset & initialize ----
export const reset = () => {
  p.background(252);
  drawBackground = storePixels();

  resetCommon();
};

export const initialize = (): void => {
  reset();
};

// ---- draw ----

const updateSketch = () => {};

const drawSketch = () => {};

const draw = (): void => {
  updateSketch();

  drawBackground();
  canvas.drawScaled(drawSketch);
};

// ---- UI ----

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
  draw,
  keyTyped,
};
