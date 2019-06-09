/**
 * ---- Other functions ------------------------------------------------------
 */

import { RectangleSize } from "./common/dataTypes";
import { setPixel } from "./p5util/drawing";

export function createRandomTextureGraphics(
  p: p5,
  size: RectangleSize,
  factor: number
): p5.Graphics {
  const g = p.createGraphics(size.width, size.height) as any;
  const width = g.width;
  const height = g.height;
  const pixelDensity = g.pixelDensity();

  g.loadPixels();

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      setPixel(g, x, y, 0, 0, 0, 255 * Math.random() * factor, pixelDensity);
    }
  }

  g.updatePixels();

  return g as p5.Graphics;
}
