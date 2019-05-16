import * as p5ex from "p5ex";

export function loop<T>(array: T[], callback: (element: T) => any): void {
  const len = array.length;
  for (let i = 0; i < len; i += 1) callback(array[i]);
}

export function alphaColor(p: p5, color: p5.Color, alpha: number): p5.Color {
  return p.color(p.red(color), p.green(color), p.blue(color), alpha);
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
