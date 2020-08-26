/**
 * ---- Sketch ----------------------------------------------------------------
 */

import p5 from "p5";
import { storePixels, pauseOrResume } from "@fal-works/p5-extension";
import { p, canvas, resetCommon, context, Mouse } from "./common";
import * as Shape from "./shape";
import * as Epicenter from "./epicenter";

// ---- variables | functions ----
let drawBackground: () => void;
const shapes: Shape.Unit[] = [];
let cursorColor: p5.Color;
let epicenters: Epicenter.Unit[] = [];

// ---- reset & initialize ----
const createBackground = () => {
  p.background(252);
  return storePixels();
};

const resetShapes = () => {
  shapes.length = 0;

  const { width, height } = canvas.logicalSize;

  const xInterval = 64;
  const yInterval = 80;
  const columns = Math.floor(width / xInterval) - 1;
  const rows = Math.floor(height / yInterval) - 1;

  for (
    let i = 0, x = width / 2 - ((columns - 1) / 2) * xInterval;
    i < columns;
    i += 1, x += xInterval
  ) {
    for (
      let k = 0, y = height / 2 - ((rows - 1) / 2) * yInterval;
      k < rows;
      k += 1, y += yInterval
    ) {
      shapes.push(Shape.create(x, y));
    }
  }
};

export const reset = () => {
  drawBackground = createBackground();

  resetCommon();

  resetShapes();
  epicenters.length = 0;
};

export const initialize = (): void => {
  reset();
  p.noStroke();
  p.rectMode(p.CENTER);

  cursorColor = p.color(0, 32, 64, 64);

  const { scaleFactor } = canvas;
  context.shadowOffsetX = scaleFactor * 16;
  context.shadowOffsetY = scaleFactor * 16;
  context.shadowBlur = scaleFactor * 6;
  context.shadowColor = `rgba(0, 0, 0, 0.1)`;
};

// ---- draw ----

const cursorSize = 36.0;
const drawCursor = () => {
  p.fill(cursorColor);
  const t = 0.15 * p.frameCount;
  p.ellipse(
    0.0,
    0.0,
    cursorSize * (1.0 + 0.15 * Math.cos(t)),
    cursorSize * (1.0 + 0.15 * Math.sin(t))
  );
};

const updateSketch = () => {
  for (const shape of shapes) Shape.update(shape);
  epicenters = epicenters.filter(Epicenter.update);

  for (const shape of shapes) {
    for (const epicenter of epicenters) {
      const dist = Math.sqrt(Shape.getDistSq(shape, epicenter.x, epicenter.y));
      const { radius } = epicenter;
      const lastRadius = radius - Epicenter.radiusChangeRate;
      if (lastRadius < dist && dist < radius) Shape.impact(shape);
    }
  }
};

const drawSketch = () => {
  for (const shape of shapes) Shape.draw(shape);

  Mouse.drawAtCursor(drawCursor);
};

const draw = (): void => {
  updateSketch();

  drawBackground();
  canvas.drawScaled(drawSketch);
};

// ---- UI ----

const searchShape = () => {
  Mouse.updatePosition();

  const { x: mx, y: my } = Mouse.position;
  for (const shape of shapes) {
    if (Shape.collides(shape, mx, my, cursorSize / 2)) return shape;
  }
};

const mousePressed = () => {
  Mouse.updatePosition();
  const { x: mx, y: my } = Mouse.position;
  epicenters.push(Epicenter.create(mx, my));
};

const mouseMoved = () => {
  Mouse.updatePosition();
  const shape = searchShape();
  if (shape) Shape.impact(shape);
};

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
  mousePressed,
  mouseMoved,
};
