/**
 * -----------------------------------------------------------------------------
 * @module common/p5util/canvas
 */

import p5 from "p5";
import { p } from "./shared";
import { RectangleSize } from "../data-types";
import { FittingOption, getScaleFactor } from "../bounding-box";
import { getElementOrBody, getElementSize } from "../environment";
import { Vector2D } from "../ds/vector-2d";
import { drawScaled } from "./transform";

/**
 * p5.js canvas accompanied by a scale factor.
 */
export interface ScaledCanvas {
  readonly p5Canvas: p5.Renderer;
  readonly scaleFactor: number;
  readonly logicalSize: RectangleSize;
  readonly drawScaled: (drawCallback: () => void) => void;
  readonly logicalCenterPosition: Vector2D;
}

/**
 * Runs `p.createCanvas()` with the scaled size that fits to `node`.
 * Returns the created canvas and the scale factor.
 *
 * @param node - The HTML element or its ID.
 * @param logicalSize
 * @param fittingOption
 * @param renderer
 */
export const createScaledCanvas = (
  node: HTMLElement | string,
  logicalSize: RectangleSize,
  fittingOption?: FittingOption,
  renderer?: "p2d" | "webgl" | undefined
): ScaledCanvas => {
  const maxCanvasSize = getElementSize(
    typeof node === "string" ? getElementOrBody(node) : node
  );
  const scaleFactor = getScaleFactor(logicalSize, maxCanvasSize, fittingOption);

  const canvas = p.createCanvas(
    scaleFactor * logicalSize.width,
    scaleFactor * logicalSize.height,
    renderer
  );

  return {
    p5Canvas: canvas,
    scaleFactor: scaleFactor,
    logicalSize: logicalSize,
    drawScaled: (drawCallback: () => void): void =>
      drawScaled(drawCallback, scaleFactor),
    logicalCenterPosition: {
      x: logicalSize.width / 2,
      y: logicalSize.height / 2
    }
  };
};
