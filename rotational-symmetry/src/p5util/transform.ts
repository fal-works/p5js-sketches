/**
 * ------------------------------------------------------------------------
 *  p5.js transformation utility
 * ------------------------------------------------------------------------
 */

/**
 * Runs `drawCallback` translated with `offsetX` and `offsetY`,
 * then restores the transformation by calling `p.translate()` with negative values.
 * Used to avoid calling `p.push()` and `p.pop()` frequently.
 *
 * @param p
 * @param drawCallback
 * @param scaleFactor
 */
export function drawTranslated(
  p: p5,
  drawCallback: (p: p5) => any,
  offsetX: number,
  offsetY: number
): void {
  p.translate(offsetX, offsetY);
  drawCallback(p);
  p.translate(-offsetX, -offsetY);
}

/**
 * Runs `drawCallback` rotated with `angle`,
 * then restores the transformation by calling `p.rotate()` with the negative value.
 * Used to avoid calling `p.push()` and `p.pop()` frequently.
 *
 * @param p
 * @param drawCallback
 * @param scaleFactor
 */
export function drawRotated(
  p: p5,
  drawCallback: (p: p5) => any,
  angle: number
): void {
  p.rotate(angle);
  drawCallback(p);
  p.rotate(-angle);
}

/**
 * Composite of `drawTranslated()` and `drawRotated()`.
 *
 * @param p
 * @param drawCallback
 * @param scaleFactor
 */
export function drawTranslatedAndRotated(
  p: p5,
  drawCallback: (p: p5) => any,
  offsetX: number,
  offsetY: number,
  rotationAngle: number
): void {
  p.translate(offsetX, offsetY);
  drawRotated(p, drawCallback, rotationAngle);
  p.translate(-offsetX, -offsetY);
}

/**
 * Runs `drawCallback` scaled with `scaleFactor`,
 * then restores the transformation by scaling with the inversed factor.
 * Used to avoid calling `p.push()` and `p.pop()` frequently.
 *
 * @param p
 * @param drawCallback
 * @param scaleFactor
 */
export function drawScaled(
  p: p5,
  drawCallback: (p: p5) => any,
  scaleFactor: number
): void {
  p.scale(scaleFactor);
  drawCallback(p);
  p.scale(1 / scaleFactor);
}
