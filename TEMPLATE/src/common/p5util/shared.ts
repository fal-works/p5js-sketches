/**
 * ---- p5 shared variables --------------------------------------------------
 */

import p5 from "p5";
import { ScaledCanvas } from "./canvas";

/**
 * The shared `p5` instance.
 */
export let p: p5;

/**
 * The shared `ScaledCanvas` instance.
 */
export let canvas: ScaledCanvas;

/**
 * Sets the given `p5` instance to be shared.
 * @param instance
 */
export const setP5Instance = (instance: p5): void => {
  p = instance;
};

/**
 * Sets the given `ScaledCanvas` instance to be shared.
 * @param scaledCanvas
 */
export const setCanvas = (scaledCanvas: ScaledCanvas): void => {
  canvas = scaledCanvas;
};
