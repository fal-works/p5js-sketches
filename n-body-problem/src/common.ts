/**
 * ---- Common ----------------------------------------------------------------
 */

import p5 from "p5";
import * as CCC from "@fal-works/creative-coding-core";
import * as p5ex from "@fal-works/p5-extension";

export const {
  ArrayList,
  ArrayQueue,
  Vector2D,
  RectangleRegion,
  Random,
  SimpleDynamics,
  Kinematics,
  Gravitation,
  Bounce,
  Numeric: { square, max2 }
} = CCC;

export const { onSetup, ShapeColor, drawTranslatedAndRotated } = p5ex;

/**
 * Shared p5 instance.
 */
export let p: p5;

onSetup.push(p5Instance => {
  p = p5Instance;
});

/**
 * Shared canvas instance.
 */
export let canvas: p5ex.ScaledCanvas;

onSetup.push(() => {
  canvas = p5ex.canvas;
});
