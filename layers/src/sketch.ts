/**
 * ---- Sketch ----------------------------------------------------------------
 */

import { pauseOrResume } from "@fal-works/p5-extension";
import { Random, Numeric } from "@fal-works/creative-coding-core";
import { p, canvas } from "./common";
import {
  Rectangle,
  RectangleType,
  createRectangle,
  updateRectangle,
  drawRectangle,
} from "./rectangle";

// ---- variables & functions ----
let rectangles: Rectangle[] = [];

const addRectangles = (): void => {
  const { topLeft, bottomRight } = canvas.logicalRegion;
  const { width: canvasWidth, height: canvasHeight } = canvas.logicalSize;
  const minWidth = 0.1 * canvasWidth;
  const minHeight = 0.1 * canvasHeight;
  const maxWidth = 0.7 * canvasWidth;
  const maxHeight = 0.7 * canvasHeight;
  const hueArray: number[] = [];
  const hue = (): number => {
    let h = 0;
    for (let i = 0; i < 1000; i += 1) {
      h = Random.Integer.value(36) * 10;
      if (!hueArray.includes(h)) break;
    }
    hueArray.push(h);
    return h;
  };

  for (let i = 0; i < 4; i += 1) {
    const w = Random.Curved.between(Numeric.cube, minWidth, maxWidth);
    const h = canvasHeight;
    const x = Random.between(topLeft.x, bottomRight.x - w);
    const y = 0;
    rectangles.push(createRectangle(x, y, w, h, RectangleType.Vertical, hue()));
  }
  for (let i = 0; i < 3; i += 1) {
    const w = canvasWidth;
    const h = Random.Curved.between(Numeric.cube, minHeight, maxHeight);
    const x = 0;
    const y = Random.between(topLeft.y, bottomRight.y - h);
    rectangles.push(
      createRectangle(x, y, w, h, RectangleType.Horizontal, hue())
    );
  }
};

const updateSketch = (): void => {
  if (p.frameCount % 120 === 1) addRectangles();

  rectangles = rectangles.filter(updateRectangle);
};

const drawSketch = (): void => {
  p.blendMode(p.REPLACE);
  p.background(255);
  p.blendMode(p.MULTIPLY);
  rectangles.forEach(drawRectangle);
};

export const reset = (): void => {};

export const initialize = (): void => {
  p.noStroke();
  reset();
};

const draw = () => {
  updateSketch();
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
  keyTyped,
  draw,
};
