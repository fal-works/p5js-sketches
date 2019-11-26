/**
 * ---- Common ----------------------------------------------------------------
 */

import p5 from "p5";
import {
  ArrayList,
  ArrayUtility,
  Random,
  Timer,
  Numeric,
  Easing
} from "@fal-works/creative-coding-core";
import {
  onSetup,
  ScaledCanvas,
  canvas as p5exCanvas,
  hsvColor,
  reverseColor,
  Noise,
  translate,
  undoTranslate
} from "@fal-works/p5-extension";
import { LOGICAL_CANVAS_SIZE } from "./settings";

export { ArrayList, ArrayUtility, Random, Timer };
export const { square, sin, createMap: createNumericMap, floor } = Numeric;
export const { easeOutQuad } = Easing;

export { onSetup, hsvColor, reverseColor, Noise, translate, undoTranslate };

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
export let canvas: ScaledCanvas;

onSetup.push(() => {
  canvas = p5exCanvas;
});
