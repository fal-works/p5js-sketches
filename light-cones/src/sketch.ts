/**
 * ---- Sketch ----------------------------------------------------------------
 */

import { storePixels } from "@fal-works/p5-extension";
import { p, canvas, resetCommon, TWO_PI } from "./common";
import * as Cone from "./cone";

// ---- variables | functions ----
let drawBackground: () => void;
const cones: Cone.Unit[] = [];

// ---- reset & initialize ----
export const reset = () => {
  p.background(252);
  drawBackground = storePixels();

  resetCommon();
  Cone.reset();
  cones.length = 0;

  const rotationAngleStep = TWO_PI / 3;
  const hueOffset = p.random(60);
  cones.push(
    Cone.create(0 * rotationAngleStep, hueOffset, 0.001),
    Cone.create(1 * rotationAngleStep, (hueOffset + 150) % 360, -0.001),
    Cone.create(2 * rotationAngleStep, (hueOffset + 210) % 360, 0.003)
  );
};

export const initialize = (): void => {
  p.noStroke();
  p.blendMode(p.HARD_LIGHT);
  p.colorMode(p.HSB, 360, 100, 100, 100);

  reset();
};

// ---- draw ----

const updateSketch = () => {
  cones.forEach(Cone.update);
};

const drawSketch = () => {
  p.translate(canvas.logicalCenterPosition.x, canvas.logicalCenterPosition.y);

  cones.forEach(Cone.draw);
};

export const draw = (): void => {
  updateSketch();

  drawBackground();
  canvas.drawScaled(drawSketch);
};
