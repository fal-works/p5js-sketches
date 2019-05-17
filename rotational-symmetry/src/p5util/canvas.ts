/**
 * ---- p5.js canvas utility -------------------------------------------------
 */

import { RectangleSize } from "../common/dataTypes";
import { FittingOption, calculateScaleFactor } from "../common/boundingBox";
import { getElementOrBody, getElementSize } from "../common/environment";

/**
 * -
 */
export interface ScaledCanvas {
  readonly p5Canvas: p5.Renderer;
  readonly scaleFactor: number;
  readonly nonScaledSize: RectangleSize;
}

/**
 * Runs `p.createCanvas()` with the scaled size that fits to `node`.
 * Returns the created canvas and the scale factor.
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
  const maxCanvasSize = getElementSize(
    typeof node === "string" ? getElementOrBody(node) : node
  );
  const scaleFactor = calculateScaleFactor(
    nonScaledSize,
    maxCanvasSize,
    fittingOption
  );

  const canvas = p.createCanvas(
    scaleFactor * nonScaledSize.width,
    scaleFactor * nonScaledSize.height,
    renderer
  );

  return {
    p5Canvas: canvas,
    scaleFactor: scaleFactor,
    nonScaledSize: nonScaledSize
  };
}
