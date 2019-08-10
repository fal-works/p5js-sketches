/**
 * -----------------------------------------------------------------------------
 * @module common/easing
 */

import { sq, cubic } from "./math";

/**
 * Linear easing function.
 * @param ratio
 */
export const easeLinear = (ratio: number): number => ratio;

/**
 * easeInQuad.
 * @param ratio
 */
export const easeInQuad = sq;

/**
 * easeOutQuad.
 * @param ratio
 */
export const easeOutQuad = (ratio: number): number => -sq(ratio - 1) + 1;

/**
 * easeInCubic.
 * @param ratio
 */
export const easeInCubic = cubic;

/**
 * easeOutCubic.
 * @param ratio
 */
export const easeOutCubic = (ratio: number): number => cubic(ratio - 1) + 1;

/**
 * easeInQuart.
 * @param ratio
 */
export const easeInQuart = (ratio: number): number => Math.pow(ratio, 4);

/**
 * easeOutQuart.
 * @param ratio
 */
export const easeOutQuart = (ratio: number): number =>
  -Math.pow(ratio - 1, 4) + 1;

const EASE_OUT_BACK_DEFAULT_COEFFICIENT = 1.70158;

/**
 * easeOutBack.
 * @param ratio
 */
export const easeOutBack = (ratio: number): number => {
  const r = ratio - 1;

  return (
    (EASE_OUT_BACK_DEFAULT_COEFFICIENT + 1) * cubic(r) +
    EASE_OUT_BACK_DEFAULT_COEFFICIENT * sq(r) +
    1
  );
};

/**
 * Easing function.
 */
export interface Easing {
  (ratio: number): number;
}

/**
 * Returns an easeOut function.
 * @param exponent - Integer from 1 to 4.
 */
export function getEasingFunction(exponent: number): Easing {
  switch (Math.floor(exponent)) {
    default:
    case 1:
      return easeLinear;
    case 2:
      return easeOutQuad;
    case 3:
      return easeOutCubic;
    case 4:
      return easeOutQuart;
  }
}
