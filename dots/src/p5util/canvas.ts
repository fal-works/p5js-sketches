/**
 * ---- p5.js canvas utility -------------------------------------------------
 */

import { RectangleSize } from "../common/dataTypes";
import { FittingOption, getScaleFactor } from "../common/boundingBox";
import { getElementOrBody, getElementSize } from "../common/environment";
import { drawScaled } from "./transform";

/**
 * p5.js canvas accompanied by a scale factor.
 */
export interface ScaledCanvas {
  readonly p5Canvas: p5.Renderer;
  readonly scaleFactor: number;
  readonly nonScaledSize: RectangleSize;
  readonly drawScaled: (drawCallback: (p: p5) => void) => void;
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
  const scaleFactor = getScaleFactor(
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
    nonScaledSize: nonScaledSize,
    drawScaled: (drawCallback: (p: p5) => void) =>
      drawScaled(p, drawCallback, scaleFactor)
  };
}
