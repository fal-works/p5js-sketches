/**
 * ---- Main ------------------------------------------------------------------
 */

import p5 from "p5";
import { startSketch, pauseOrResume } from "@fal-works/p5-extension";

import { p, canvas } from "./common";
import { HTML_ELEMENT_ID, LOGICAL_CANVAS_HEIGHT } from "./settings";
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
  p.windowResized = () => {
    canvas.resizeIfNeeded(); //TODO: get result and reset sketch only if resized
    sketch.reset();
  };
  p.mouseClicked = sketch.reset;
};

startSketch({
  htmlElement: HTML_ELEMENT_ID,
  logicalCanvasHeight: LOGICAL_CANVAS_HEIGHT,
  initialize: sketch.initialize, // delete?
  setP5Methods // create type for sketch methods? and Object.assign?
});
