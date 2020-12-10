/**
 * ---- Main ------------------------------------------------------------------
 */

import { startSketch } from "@fal-works/p5-extension";

import { canvas } from "./common";
import * as Settings from "./settings";
import * as sketch from "./sketch";

// ---- start sketch ----

startSketch({
  htmlElement: Settings.HTML_ELEMENT_ID,
  logicalCanvasHeight: Settings.LOGICAL_CANVAS_HEIGHT,
  initialize: sketch.initialize, // delete?
  windowResized: () => canvas.resizeIfNeeded(),
  onCanvasResized: sketch.reset,
  p5Methods: sketch.p5Methods,
});
