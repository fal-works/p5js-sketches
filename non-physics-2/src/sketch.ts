/**
 * ---- Sketch ----------------------------------------------------------------
 */

import { storePixels, pauseOrResume } from "@fal-works/p5-extension";
import {
  p,
  canvas,
  resetCommon,
  context,
  Timer,
  TimerSet,
  Random,
  Easing,
} from "./common";
import * as ShapeSet from "./shape-set";

// ---- variables | functions ----
let drawBackground: () => void;
const timers = TimerSet.create(64);
let shapes: ShapeSet.Unit[] = [];

// ---- reset & initialize ----
const createBackground = () => {
  p.background(252);
  return storePixels();
};

const createShapeSet = (x: number, y: number) => {
  const shapeSet = ShapeSet.create(x, y);
  shapes.push(shapeSet);

  const appear = Timer.create({
    duration: 60,
    onProgress: (progress) => {
      const ratio = progress.ratio;
      const easedRatio = Easing.Out.expo(ratio);
      shapeSet.visibility = easedRatio;
    },
  });
  const wait = Timer.create({ duration: Random.Integer.between(60, 180) });
  const disappear = Timer.create({
    duration: 60,
    onProgress: (progress) => {
      const ratio = progress.ratio;
      const easedRatio = Easing.In.expo(ratio);
      shapeSet.visibility = 1.0 - easedRatio;
    },
    onComplete: () => {
      shapes.splice(shapes.indexOf(shapeSet), 1);
      createShapeSet(x, y);
    },
  });
  const timer = Timer.chain([appear, wait, disappear]);
  TimerSet.add(timers, timer);
};

const createShapes = () => {
  shapes = [];
  TimerSet.clear(timers);

  const { width, height } = canvas.logicalSize;
  for (let x = width / 20; x < width; x += width / 5) {
    for (let y = height / 20; y < height; y += height / 5) {
      createShapeSet(x, y);
    }
  }
};

export const reset = () => {
  drawBackground = createBackground();

  resetCommon();

  createShapes();
};

export const initialize = (): void => {
  reset();
  p.strokeWeight(2);
  p.noFill();
  const { scaleFactor } = canvas;

  context.shadowOffsetX = scaleFactor * 3;
  context.shadowOffsetY = scaleFactor * 3;
  context.shadowBlur = scaleFactor * 12;
  context.shadowColor = `rgba(0, 0, 0, 0.3)`;
};

// ---- draw ----

const updateSketch = () => {
  TimerSet.step(timers);
};

const drawSketch = () => {
  for (const shapeSet of shapes) ShapeSet.draw(shapeSet);
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
