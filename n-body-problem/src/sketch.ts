/**
 * ---- Sketch ----------------------------------------------------------------
 */

import { storePixels } from "@fal-works/p5-extension";
import { p, canvas, ShapeColor } from "./common";
import { Body } from "./body";
import { Bodies } from "./bodies";

// ---- variables | functions ----
let drawBackground: () => void;
const timeBarColor = ShapeColor.create(null, 64, 1);
const duration = 600;
let properFrameCount = 0;

// ---- reset & initialize ----
export const reset = () => {
  p.background(252);
  drawBackground = storePixels();

  Body.reset();
  Bodies.reset();

  properFrameCount = 0;
};

export const initialize = (): void => {
  p.strokeWeight(2);

  reset();
};

// ---- draw ----

const updateSketch = () => {
  properFrameCount += 1;
  if (properFrameCount >= duration) reset();

  Bodies.update();
};
const drawSketch = () => {
  const { width, height } = canvas.logicalSize;
  ShapeColor.apply(timeBarColor, 255);
  p.rect(0, height - 10, (properFrameCount / duration) * width, height);

  const { x, y } = canvas.logicalCenterPosition;
  p.translate(x, y);
  Bodies.draw();
};

export const draw = (): void => {
  updateSketch();

  drawBackground();
  canvas.drawScaled(drawSketch);
};
