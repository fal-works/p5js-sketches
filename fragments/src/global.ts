import p5 from "p5";
import * as p5ex from "@fal-works/p5-extension";

/**
 * Shared p5 instance.
 */
export let p: p5;

p5ex.onSetup.push(() => {
  p = p5ex.p;
});

/**
 * Shared canvas instance.
 */
export let canvas: p5ex.ScaledCanvas;

p5ex.onSetup.push(() => {
  canvas = p5ex.canvas;
});
