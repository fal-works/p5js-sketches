/**
 * ---- Function --------------------------------------------------------------
 */

import p5 from "p5";
import { p } from "./common";
import { LOGICAL_CANVAS_SIZE } from "./settings";

export function drawGradation(
  fromColor: p5.Color,
  toColor: p5.Color,
  gradient = 1,
  interval = 1
) {
  const { width, height } = LOGICAL_CANVAS_SIZE;
  p.strokeWeight(interval * 2);

  for (let y = 0; y < height; y += interval) {
    const lerpRatio = Math.pow(y / (height - 1), gradient);
    p.stroke(p.lerpColor(fromColor, toColor, lerpRatio));
    p.line(0, y, width - 1, y);
  }
}
