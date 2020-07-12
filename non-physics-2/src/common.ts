/**
 * ---- Common ----------------------------------------------------------------
 */

import p5 from "p5";
import * as CCC from "@fal-works/creative-coding-core";
import * as p5ex from "@fal-works/p5-extension";

export const {
  Numeric: { lerp, square },
  ArrayList,
  HSV,
  Random,
  Easing,
  Angle: { QUARTER_PI },
  Timer,
  Timer: { Set: TimerSet },
  Arrays,
} = CCC;

export const {
  onSetup,
  onInstantiate,
  translate,
  undoTranslate,
  drawTransformed,
  ShapeColor,
} = p5ex;

/**
 * Shared p5 instance.
 */
export let p: p5;

onInstantiate.push((p5Instance) => {
  p = p5Instance;
});

/**
 * Shared canvas instance.
 */
export let canvas: p5ex.ScaledCanvas;

/**
 * Alias for `p.drawingContext`.
 */
export let context: CanvasRenderingContext2D;

onSetup.push(() => {
  canvas = p5ex.canvas;
  context = (p as any).drawingContext; // eslint-disable-line
});

export const resetCommon = () => {};
