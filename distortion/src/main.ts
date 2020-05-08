/**
 * ---- Main ------------------------------------------------------------------
 */

import { startSketch } from "@fal-works/p5-extension";

import { canvas } from "./common";
import {
  HTML_ELEMENT_ID,
  LOGICAL_CANVAS_WIDTH,
  LOGICAL_CANVAS_HEIGHT,
} from "./settings";
import * as sketch from "./sketch";

// ---- start sketch ----

startSketch({
  htmlElement: HTML_ELEMENT_ID,
  logicalCanvasHeight: LOGICAL_CANVAS_HEIGHT,
  logicalCanvasWidth: LOGICAL_CANVAS_WIDTH,
  initialize: sketch.initialize, // delete?
  windowResized: () => canvas.resizeIfNeeded(),
  onCanvasResized: sketch.reset,
  p5Methods: sketch.p5Methods,
});
