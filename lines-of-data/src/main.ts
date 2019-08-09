/**
 * ---- Main -----------------------------------------------------------------
 */

import p5 from "p5";

import * as list from "./common/ds/array-list";
import { ArrayList } from "./common/ds/array-list";
import { sweep } from "./common/ds/sweepable";

import { startSketch } from "./common/p5util/main";
import { p, canvas } from "./common/p5util/shared";
import { createPixels, replacePixels } from "./common/p5util/pixels";
import { pauseOrResume } from "./common/p5util/pause";

import { HTML_ELEMENT_ID, LOGICAL_CANVAS_SIZE } from "./settings";
import * as constants from "./constants";
import { Line, createLine, drawLine, updateLine } from "./line";

// ---- variables ----
let lines: ArrayList<Line>;

// ---- reset & initialize ----

let drawBackground: () => void;

const reset = (): void => {
  list.clear(lines);
  const onCreate = (line: Line) => list.add(lines, line);
  createLine({ x: 100, y: 200 }, 0, 600, onCreate);
  createLine({ x: 700, y: 600 }, Math.PI, 600, onCreate);
};

const initialize = (): void => {
  const backgroundColor = p.color(constants.BACKGROUND_COLOR_ARRAY);
  drawBackground = replacePixels.bind(
    null,
    createPixels(() => p.background(backgroundColor))
  );

  p.noStroke();
  p.strokeWeight(constants.STROKE_WEIGHT);
  p.rectMode(p.CORNERS);

  lines = list.create(constants.LINE_LIST_INITIAL_CAPACITY);

  reset();
};

// ---- draw ----

const drawSketch = (): void => {
  list.loop(lines, updateLine);
  list.loop(lines, drawLine);
  sweep(lines);
};

const draw = (): void => {
  drawBackground();
  canvas.drawScaled(drawSketch);
};

// ---- UI ----

const mousePressed = (): void => {};

const keyTyped = (): void => {
  switch (p.key) {
    case "p":
      pauseOrResume();
      break;
    case "s":
      p.save("image.png");
      break;
  }
};

// ---- start sketch ----

const setP5Methods = (p: p5): void => {
  p.draw = draw;
  p.mousePressed = mousePressed;
  p.keyTyped = keyTyped;
};

startSketch({
  htmlElementId: HTML_ELEMENT_ID,
  logicalCanvasSize: LOGICAL_CANVAS_SIZE,
  initialize,
  setP5Methods
});
