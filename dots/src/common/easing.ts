/**
 * ---- Common random utility ------------------------------------------------
 */

0;

/**
 * Linear easing function.
 * @param ratio
 */
export function easeLinear(ratio: number) {
  return ratio;
}

/**
 * easeOutQuad.
 * @param ratio
 */
export function easeOutQuad(ratio: number) {
  return -Math.pow(ratio - 1, 2) + 1;
}

/**
 * easeOutCubic.
 * @param ratio
 */
export function easeOutCubic(ratio: number) {
  return Math.pow(ratio - 1, 3) + 1;
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
