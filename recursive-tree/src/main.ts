/**
 * ---- Main ------------------------------------------------------------------
 */

import p5 from "p5";
import * as sketch from "./sketch";
import * as common from "./common";

// ---- start sketch ----

new p5((p: p5) => {
  common.initialize(p);
  p.setup = sketch.setup;
  p.draw = sketch.draw;
}, common.container);
