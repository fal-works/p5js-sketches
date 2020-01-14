/**
 * ---- Main ------------------------------------------------------------------
 */

import p5 from "p5";
import { startSketch, pauseOrResume } from "@fal-works/p5-extension";

import { p } from "./common";
import { HTML_ELEMENT, LOGICAL_CANVAS_SIZE } from "./settings";
import * as sketch from "./sketch";

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
  p.draw = sketch.draw;
  p.keyTyped = keyTyped;
};

startSketch({
  htmlElement: HTML_ELEMENT,
  logicalCanvasSize: LOGICAL_CANVAS_SIZE,
  initialize: sketch.initialize,
  setP5Methods,
  fittingOption: null // set undefined to enable scaling
});
