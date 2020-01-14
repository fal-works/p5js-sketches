/**
 * ---- Sketch ----------------------------------------------------------------
 */

import { storePixels } from "@fal-works/p5-extension";
import { p, canvas, Noise, cube } from "./common";
import { Dots } from "./dots";
import { Grid } from "./grid";
import { Repeater } from "./repeater";

// ---- variables | functions ----
let drawBackground: () => void;
const repeater = Repeater.create(() => {
  const position = Grid.nextPosition();
  Dots.add(position.x, position.y);
});
const noise = Noise.withChangeRate(0.05);

// ---- reset & initialize ----
const reset = () => {};

export const initialize = (): void => {
  p.background(252);
  drawBackground = storePixels();

  p.noStroke();

  reset();
};

// ---- draw ----

const updateSketch = () => {
  repeater.frequency = 18 * cube(noise());
  Repeater.run(repeater);
  Dots.update();
};
const drawSketch = () => {
  Dots.draw();
};

export const draw = (): void => {
  updateSketch();

  drawBackground();
  canvas.drawScaled(drawSketch);
};
