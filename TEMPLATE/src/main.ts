/**
 * -----------------------------------------------------------------------------
 * @module main
 */

import p5 from "p5";

import { startSketch } from "./common/p5util/main";
import { p, canvas } from "./common/p5util/shared";

import { pauseOrResume } from "./common/p5util/pause";
import { createPixels, replacePixels } from "./common/p5util/pixels";
import { drawTranslatedAndRotated } from "./common/p5util/transform";

import { HTML_ELEMENT, LOGICAL_CANVAS_SIZE } from "./settings";
import * as constants from "./constants";

// ---- variables | functions ----

let drawBackground: () => void;

// ---- reset & initialize ----

const reset = (): void => {};

const initialize = (): void => {
  const backgroundColor = p.color(constants.BACKGROUND_COLOR);
  const backgroundPixels = createPixels(() => p.background(backgroundColor));
  drawBackground = replacePixels.bind(null, backgroundPixels);

  p.noStroke();
  p.fill(constants.SQUARE_COLOR);
  p.rectMode(p.CENTER);

  reset();
};

// ---- draw ----

const drawSquare = () => p.square(0, 0, constants.SQUARE_SIZE);

const drawSketch = (): void => {
  const center = canvas.logicalCenterPosition;
  drawTranslatedAndRotated(
    drawSquare,
    center.x,
    center.y,
    p.frameCount * constants.ROTATION_SPEED
  );
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
    case "r":
      reset();
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
  htmlElement: HTML_ELEMENT,
  logicalCanvasSize: LOGICAL_CANVAS_SIZE,
  initialize,
  setP5Methods
});
