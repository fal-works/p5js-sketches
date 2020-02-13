/**
 * ---- Main ------------------------------------------------------------------
 */

import p5 from "p5";
import { startSketch, pauseOrResume } from "@fal-works/p5-extension";

import { p, canvas } from "./common";
import * as settings from "./settings";
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
  p.preload = sketch.preload.bind(undefined, p);
  Object.assign(p, sketch.p5Methods);
  p.keyTyped = keyTyped;
  p.windowResized = () => {
    canvas.resizeIfNeeded(); //TODO: get result and reset sketch only if resized
    sketch.reset();
  };
};

startSketch({
  htmlElement: settings.HTML_ELEMENT_ID,
  logicalCanvasWidth: settings.LOGICAL_CANVAS_WIDTH,
  logicalCanvasHeight: settings.LOGICAL_CANVAS_HEIGHT,
  initialize: sketch.initialize, // delete?
  setP5Methods
});
