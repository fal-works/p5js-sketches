/**
 * ---- Common ----------------------------------------------------------------
 */

import p5 from "p5";
import * as CCC from "@fal-works/creative-coding-core";
import * as p5ex from "@fal-works/p5-extension";

export const {
  Vector2D,
  Random,
  Numeric: { hypotenuse2D, lerp },
  Angle: { TWO_PI, PI },
  Timer,
  Easing
} = CCC;

export const { onSetup } = p5ex;

/** Shared p5 instance. */
export let p: p5;

onSetup.push(p5Instance => {
  p = p5Instance;
});

/** Shared canvas instance. */
export let canvas: p5ex.ScaledCanvas;

onSetup.push(() => {
  canvas = p5ex.canvas;
});

/** Shared canvas instance. */
export let renderer: p5 | p5.Graphics;

export const setRenderer = (r: p5 | p5.Graphics) => {
  renderer = r;
  p5ex.setRenderer(r);
};
onSetup.push(setRenderer);

export const resetCommon = () => {};
