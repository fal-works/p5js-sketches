import * as p5ex from "p5ex";

export function createGradationRectangle(
  p: p5,
  w: number,
  h: number,
  backgroundColor: p5.Color,
  fromColor: p5.Color,
  toColor: p5.Color,
  gradient: number = 1,
  interval: number = 1
): p5.Graphics {
  const g = p.createGraphics(w, h) as any;
  g.background(backgroundColor);
  g.strokeWeight(interval * 2);

  for (let y = 0; y < h; y += interval) {
    const lerpRatio = Math.pow(y / (h - 1), gradient);
    g.stroke(p.lerpColor(fromColor, toColor, lerpRatio));
    g.line(0, y, w - 1, y);
  }

  return g;
}

export function createRandomTextureGraphics(
  p: p5,
  w: number,
  h: number,
  factor: number
): p5.Graphics {
  const g = p.createGraphics(w, h) as any;
  const width = g.width;
  const height = g.height;
  const pixelDensity = g.pixelDensity();

  g.loadPixels();

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      p5ex.setPixel(
        g,
        x,
        y,
        0,
        0,
        0,
        255 * Math.random() * factor,
        pixelDensity
      );
    }
  }

  g.updatePixels();

  return g as p5.Graphics;
}
