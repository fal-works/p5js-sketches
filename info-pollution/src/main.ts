/**
 * ---- Main ------------------------------------------------------------------
 */

import p5 from "p5";
import { startSketch } from "@fal-works/p5-extension";

import { canvas } from "./common";
import { HTML_ELEMENT_ID, LOGICAL_CANVAS_HEIGHT } from "./settings";
import * as sketch from "./sketch";

// ---- start sketch ----

const setP5Methods = (p: p5): void => {
  Object.assign(p, sketch.p5Methods);

  p.windowResized = () => {
    canvas.resizeIfNeeded(); //TODO: get result and reset sketch only if resized
    sketch.reset();
  };
};

startSketch({
  htmlElement: HTML_ELEMENT_ID,
  logicalCanvasHeight: LOGICAL_CANVAS_HEIGHT,
  initialize: sketch.initialize, // delete?
  setP5Methods // create type for sketch methods? and Object.assign?
});
