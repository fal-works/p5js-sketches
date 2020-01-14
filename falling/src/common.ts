/**
 * ---- Common ----------------------------------------------------------------
 */

import p5 from "p5";
import * as CCC from "@fal-works/creative-coding-core";
import * as p5ex from "@fal-works/p5-extension";

export const {
  ArrayList,
  Vector2D,
  SimpleDynamics,
  Random,
  Timer,
  Tween,
  Easing,
  Numeric: { cube }
} = CCC;

export const { Noise, ShapeColor } = p5ex;

/**
 * Shared p5 instance.
 */
export let p: p5;

p5ex.onSetup.push(p5Instance => {
  p = p5Instance;
});

/**
 * Shared canvas instance.
 */
export let canvas: p5ex.ScaledCanvas;

p5ex.onSetup.push(() => {
  canvas = p5ex.canvas;
});
