/**
 * ---- p5.js color utility --------------------------------------------------
 */

import p5 from "p5";
import { p } from "./shared";

export const alphaColor = (color: p5.Color | string, alpha: number) => {
  const colorObject = typeof color === "string" ? p.color(color) : color;
  const red = p.red(colorObject);
  const green = p.green(colorObject);
  const blue = p.blue(colorObject);
  colorObject.setAlpha(alpha);

  return p.color(red, green, blue, alpha);
};
