/**
 * ---- Sketch ----------------------------------------------------------------
 */

import { storePixels, pauseOrResume } from "@fal-works/p5-extension";
import { p, canvas, resetCommon } from "./common";
import * as Line from "./line";

// ---- variables | functions ----
let drawBackground: () => void;
let lines: Line.Unit[];

// ---- reset & initialize ----
export const reset = () => {
  p.background(252);

  canvas.drawScaled(() => {
    const { width, height } = canvas.logicalSize;
    p.background(248);
    p.stroke(128, 4);
    p.strokeCap(p.SQUARE);
    p.strokeWeight(2);
    for (let i = 0; i < 5000; i += 1) {
      const x = p.random(0, width);
      const y = p.random(-50, height - 50);
      p.line(x, y, x, y + p.random(50, 100));
    }
  });

  drawBackground = storePixels();

  p.strokeCap(p.ROUND);

  resetCommon();
};

export const initialize = (): void => {
  reset();
  p.stroke(0);
  p.strokeWeight(2);
  lines = [];
  for (
    let y = 0;
    y < canvas.logicalSize.height - Line.cellSize;
    y += Line.cellSize
  ) {
    lines.push(Line.create(y));
  }
};

// ---- draw ----

const updateSketch = () => {
  Line.updateStatic();
  lines.forEach(Line.update);
};

const drawSketch = () => {
  lines.forEach(Line.draw);
};

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
