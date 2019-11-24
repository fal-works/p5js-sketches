/**
 * ---- Main ------------------------------------------------------------------
 */

import p5 from "p5";
import * as p5ex from "@fal-works/p5-extension";

import { HTML_ELEMENT, LOGICAL_CANVAS_SIZE } from "./settings";
import { p, canvas, translate, undoTranslate, halfHeight } from "./common";
import { drawGradation } from "./functions";
import * as Waves from "./waves";

const { startSketch, createPixels, replaceCanvasPixels, pauseOrResume } = p5ex;

// ---- variables | functions ----
let drawBackground: () => void;
const waves = Waves.create();

// ---- reset & initialize ----
const reset = Waves.reset.bind(undefined, waves);

const initialize = (): void => {
  const backgroundPixels = createPixels(() => {
    canvas.drawScaled(() => {
      drawGradation(p.color(255), p.color(240, 244, 255), 4, 4);
    });
  });
  drawBackground = replaceCanvasPixels.bind(undefined, backgroundPixels);

  reset();
};

// ---- draw ----

const updateSketch = Waves.update.bind(undefined, waves);
const drawSketch = () => {
  translate(0, halfHeight);
  Waves.draw(waves);
  undoTranslate();
};

const draw = (): void => {
  updateSketch();

  drawBackground();
  canvas.drawScaled(drawSketch);
};

// ---- UI ----

const keyTyped = (): void => {
  switch (p.key) {
    case "p":
      pauseOrResume();
      break;
    case "g":
      p.save("image.png");
      break;
  }
};

// ---- start sketch ----

const setP5Methods = (p: p5): void => {
  p.draw = draw;
  p.keyTyped = keyTyped;
};

startSketch({
  htmlElement: HTML_ELEMENT,
  logicalCanvasSize: LOGICAL_CANVAS_SIZE,
  initialize,
  setP5Methods,
  fittingOption: null // set undefined to enable scaling
});
