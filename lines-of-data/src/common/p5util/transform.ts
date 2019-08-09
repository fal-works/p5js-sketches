/**
 * ---- p5.js transformation utility -----------------------------------------
 */

import p5 from "p5";
import { p } from "./shared";

/**
 * Runs `drawCallback` translated with `offsetX` and `offsetY`,
 * then restores the transformation by calling `p.translate()` with negative values.
 * Used to avoid calling `p.push()` and `p.pop()` frequently.
 *
 * @param drawCallback
 * @param offsetX
 * @param offsetY
 */
export const drawTranslated = (
  drawCallback: () => void | p5,
  offsetX: number,
  offsetY: number
): void => {
  p.translate(offsetX, offsetY);
  drawCallback();
  p.translate(-offsetX, -offsetY);
};

/**
 * Runs `drawCallback` rotated with `angle`,
 * then restores the transformation by calling `p.rotate()` with the negative value.
 * Used to avoid calling `p.push()` and `p.pop()` frequently.
 *
 * @param drawCallback
 * @param angle
 */
export const drawRotated = (
  drawCallback: () => void | p5,
  angle: number
): void => {
  p.rotate(angle);
  drawCallback();
  p.rotate(-angle);
};

/**
 * Composite of `drawTranslated()` and `drawRotated()`.
 *
 * @param drawCallback
 * @param offsetX
 * @param offsetY
 * @param angle
 */
export const drawTranslatedAndRotated = (
  drawCallback: () => void | p5,
  offsetX: number,
  offsetY: number,
  angle: number
): void => {
  p.translate(offsetX, offsetY);
  drawRotated(drawCallback, angle);
  p.translate(-offsetX, -offsetY);
};

/**
 * Runs `drawCallback` scaled with `scaleFactor`,
 * then restores the transformation by scaling with the inversed factor.
 * Used to avoid calling `p.push()` and `p.pop()` frequently.
 *
 * @param drawCallback
 * @param scaleFactor
 */
export const drawScaled = (
  drawCallback: () => void | p5,
  scaleFactor: number
): void => {
  p.scale(scaleFactor);
  drawCallback();
  p.scale(1 / scaleFactor);
};
