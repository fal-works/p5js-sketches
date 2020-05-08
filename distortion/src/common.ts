/**
 * ---- Common ----------------------------------------------------------------
 */

import p5 from "p5";
import * as CCC from "@fal-works/creative-coding-core";
import * as p5ex from "@fal-works/p5-extension";

export const { Numeric, Arrays } = CCC;

export const { onSetup, onInstantiate } = p5ex;

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

onSetup.push(() => {
  canvas = p5ex.canvas;
});

export const resetCommon = () => {};
