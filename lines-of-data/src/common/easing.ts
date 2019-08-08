/**
 * ---- Common easing utility ------------------------------------------------
 */

import { sq, cubic } from "./math";

/**
 * Linear easing function.
 * @param ratio
 */
export function easeLinear(ratio: number) {
  return ratio;
}

/**
 * easeInQuad.
 * @param ratio
 */
export function easeInQuad(ratio: number) {
  return sq(ratio);
}

/**
 * easeOutQuad.
 * @param ratio
 */
export function easeOutQuad(ratio: number) {
  return -sq(ratio - 1) + 1;
}

/**
 * easeInCubic.
 * @param ratio
 */
export function easeInCubic(ratio: number) {
  return cubic(ratio);
}

/**
 * easeOutCubic.
 * @param ratio
 */
export function easeOutCubic(ratio: number) {
  return cubic(ratio - 1) + 1;
}

/**
 * easeInQuart.
 * @param ratio
 */
export function easeInQuart(ratio: number) {
  return Math.pow(ratio, 4);
}

/**
 * easeOutQuart.
 * @param ratio
 */
export function easeOutQuart(ratio: number) {
  return -Math.pow(ratio - 1, 4) + 1;
}

const EASE_OUT_BACK_DEFAULT_COEFFICIENT = 1.70158;

/**
 * easeOutBack.
 * @param ratio
 */
export function easeOutBack(ratio: number) {
  const r = ratio - 1;

  return (
    (EASE_OUT_BACK_DEFAULT_COEFFICIENT + 1) * Math.pow(r, 3) +
    EASE_OUT_BACK_DEFAULT_COEFFICIENT * Math.pow(r, 2) +
    1
  );
}

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
