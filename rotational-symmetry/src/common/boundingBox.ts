/**
 * ------------------------------------------------------------------------
 *  Common bounding box utility
 * ------------------------------------------------------------------------
 */

import { RectangleSize } from "./dataTypes";

export enum FittingOption {
  FIT_TO_BOX,
  FIT_WIDTH,
  FIT_HEIGHT
}

/**
 * Calculates the scale factor for fitting `nonScaledSize` to `targetSize` keeping the original aspect ratio.
 *
 * @param nonScaledSize
 * @param targetSize
 * @param fittingOption
 */
export function calculateScaleFactor(
  nonScaledSize: RectangleSize,
  targetSize: RectangleSize,
  fittingOption?: FittingOption
): number {
  switch (fittingOption) {
    default:
    case FittingOption.FIT_TO_BOX:
      const scaleFactorCandidate = targetSize.width / nonScaledSize.width;
      const nonScaledHeight = nonScaledSize.height;
      const targetHeight = targetSize.height;

      if (scaleFactorCandidate * nonScaledHeight < targetHeight) {
        return scaleFactorCandidate;
      } else {
        return targetHeight / nonScaledHeight;
      }

    case FittingOption.FIT_WIDTH:
      return targetSize.width / nonScaledSize.width;

    case FittingOption.FIT_HEIGHT:
      return targetSize.height / nonScaledSize.height;
  }
}
