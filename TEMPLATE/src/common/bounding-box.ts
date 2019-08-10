/**
 * -----------------------------------------------------------------------------
 * @module common/bounding-box
 */

import { RectangleSize } from "./data-types";
import { Vector2D } from "./ds/vector-2d";

/**
 * Calculates the aspect ratio i.e. `width / height`.
 * @param size
 */
export const getAspectRatio = (size: RectangleSize): number =>
  size.width / size.height;

/**
 * Calculates the area i.e. `width * height`.
 * @param size
 */
export const getArea = (size: RectangleSize): number =>
  size.width * size.height;

/**
 * Returns `true` if `size` contains `point`.
 * @param size
 */
export const containsPoint = (
  size: RectangleSize,
  point: Vector2D,
  margin: number
): boolean => {
  const { x, y } = point;
  return (
    x >= margin &&
    y >= margin &&
    x < size.width - margin &&
    y < size.height - margin
  );
};

/**
 * Parameter for `getScaleFactor()`.
 * `FIT_TO_BOX` checks both width and height and returns the smaller scale factor.
 */
export const enum FittingOption {
  FIT_TO_BOX = "FIT_TO_BOX",
  FIT_WIDTH = "FIT_WIDTH",
  FIT_HEIGHT = "FIT_HEIGHT"
}

/**
 * Calculates the scale factor for fitting `nonScaledSize` to `targetSize` keeping the original aspect ratio.
 *
 * @param nonScaledSize
 * @param targetSize
 * @param fittingOption
 */
export const getScaleFactor = (
  nonScaledSize: RectangleSize,
  targetSize: RectangleSize,
  fittingOption?: FittingOption
): number => {
  switch (fittingOption) {
    default:
    case FittingOption.FIT_TO_BOX:
      return Math.min(
        targetSize.width / nonScaledSize.width,
        targetSize.height / nonScaledSize.height
      );

    case FittingOption.FIT_WIDTH:
      return targetSize.width / nonScaledSize.width;

    case FittingOption.FIT_HEIGHT:
      return targetSize.height / nonScaledSize.height;
  }
};
