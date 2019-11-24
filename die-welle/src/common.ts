/**
 * ---- Common ----------------------------------------------------------------
 */

import p5 from "p5";
import * as CCC from "@fal-works/creative-coding-core";
import * as p5ex from "@fal-works/p5-extension";
import { LOGICAL_CANVAS_SIZE } from "./settings";

export const { ArrayList, ArrayUtility, Random, Timer } = CCC;
export const { square, sin, createMap: createNumericMap, floor } = CCC.Numeric;
export const { easeOutQuad } = CCC.Easing;

export const {
  onSetup,
  hsvColor,
  reverseColor,
  Noise,
  translate,
  undoTranslate
} = p5ex;

export const { width, height } = LOGICAL_CANVAS_SIZE;
export const halfHeight = height / 2;

const MARGIN = 100;
export const LEFT_X = -MARGIN;
export const RIGHT_X = width + MARGIN;

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
