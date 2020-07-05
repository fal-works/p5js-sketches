/**
 * ---- Sketch ----------------------------------------------------------------
 */

import { storePixels, pauseOrResume } from "@fal-works/p5-extension";
import {
  p,
  canvas,
  resetCommon,
  context,
  drawTextureRowByRow,
  QUARTER_PI,
  TimerSet,
  Random,
  Easing,
} from "./common";
import * as Line from "./line";

// ---- variables | functions ----
let drawBackground: () => void;
const timers = TimerSet.create(64);
let lines: Line.Unit[] = [];
const easing = {
  easeAppear: Easing.Out.expo,
  easeDisappear: Easing.In.expo,
};

// ---- reset & initialize ----
const createBackground = () => {
  p.background(255);

  const maxY = canvas.logicalSize.height;
  drawTextureRowByRow((setPixelRow, y) => {
    const blackness = Math.pow(y / maxY, 3);
    setPixelRow(
      y,
      255 * (1 - 0.1 * blackness),
      255 * (1 - 0.1 * blackness),
      255 * (1 - 0.08 * blackness),
      255
    );
  }, p);
  return storePixels();
};

const createLines = () => {
  lines = [];
  TimerSet.clear(timers);

  const { width, height } = canvas.logicalSize;
  const countFactor = Math.max(width, height) / Math.min(width, height);
  const count = Math.round(countFactor * 20);

  for (let i = 0; i < count; i += 1) {
    const line = Line.create(
      width * Random.between(0.25, 0.75),
      height * Random.between(0.25, 0.75),
      Random.bool(0.5) ? QUARTER_PI : -QUARTER_PI,
      easing,
      i
    );
    lines.push(line.unit);
    TimerSet.add(timers, line.timer);
  }
};

export const reset = () => {
  drawBackground = createBackground();

  resetCommon();

  createLines();
};

export const initialize = (): void => {
  reset();
  p.strokeWeight(3);
  const { scaleFactor } = canvas;

  context.shadowOffsetX = scaleFactor * 4;
  context.shadowOffsetY = scaleFactor * 16;
  context.shadowBlur = scaleFactor * 12;
  context.shadowColor = `rgba(0, 0, 0, 0.4)`;
};

// ---- draw ----

const updateSketch = () => {
  if (timers.runningComponents.size === 0) createLines();
  TimerSet.step(timers);
};

const drawSketch = () => {
  for (const lineUnit of lines) Line.draw(lineUnit);
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
