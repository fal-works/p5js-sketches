/**
 * ---- Sketch ----------------------------------------------------------------
 */

import { storePixels } from "@fal-works/p5-extension";
import { p, canvas } from "./common";
import { Graph } from "./graph";

// ---- variables | functions ----
let drawBackground: () => void;

// ---- reset & initialize ----
export const reset = () => {
  p.background(252);
  drawBackground = storePixels();

  Graph.reset();
};

export const initialize = (): void => {
  p.imageMode(p.CENTER);

  reset();
};

// ---- draw ----

const updateSketch = () => {
  Graph.update();
  if (p.frameCount % 180 === 0) Graph.changeFocus();
};
const drawSketch = () => {
  Graph.draw();
};

export const draw = (): void => {
  updateSketch();

  drawBackground();
  canvas.drawScaled(drawSketch);
};
