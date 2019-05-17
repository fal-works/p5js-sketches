/**
 * ------------------------------------------------------------------------
 *  p5.js canvas utility
 * ------------------------------------------------------------------------
 */

import { RectangleSize } from "../common/dataTypes";
import { FittingOption, calculateScaleFactor } from "../common/boundingBox";
import { getElementOrBody, getElementSize } from "../common/environment";

export interface ScaledCanvas {
  p5Canvas: p5.Renderer;
  scaleFactor: number;
}

/**
 * Runs `p.createCanvas()` with the scaled size that fits to `node`.
 * Returns the created canvas ant the scale factor.
 *
 * @param p - The p5 instance.
 * @param node - The HTML element or its ID.
 * @param nonScaledSize
 * @param fittingOption
 * @param renderer
 */
export function createScaledCanvas(
  p: p5,
  node: HTMLElement | string,
  nonScaledSize: RectangleSize,
  fittingOption?: FittingOption,
  renderer?: "p2d" | "webgl" | undefined
): ScaledCanvas {
  let htmlElement: HTMLElement;

  if (typeof node === "string") htmlElement = getElementOrBody(node);
  else htmlElement = node;

  const maxCanvasRegion = getElementSize(htmlElement);
  const scaleFactor = calculateScaleFactor(
    nonScaledSize,
    maxCanvasRegion,
    fittingOption
  );

  const canvas = p.createCanvas(
    scaleFactor * nonScaledSize.width,
    scaleFactor * nonScaledSize.height,
    renderer
  );

  return {
    p5Canvas: canvas,
    scaleFactor: scaleFactor
  };
}
