/**
 * -----------------------------------------------------------------------------
 * @module common/p5util/color
 */

import p5 from "p5";
import { p } from "./shared";

/**
 * Creates a new `p5.Color` instance by replacing the alpha value with `alpha`.
 * @param color
 * @param alpha
 */
export const alphaColor = (color: p5.Color | string, alpha: number) => {
  const colorObject = typeof color === "string" ? p.color(color) : color;
  colorObject.setAlpha(alpha);

  return colorObject;
};
