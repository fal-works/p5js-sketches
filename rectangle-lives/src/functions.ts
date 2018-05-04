export function setPixelRange(
  graphics: p5 | p5.Graphics,
  x: number,
  y: number,
  size: number,
  red: number,
  green: number,
  blue: number,
) {
  const g = graphics as any;
  const w = g.width * g.pixelDensity();

  for (let i = 0; i < size; i += 1) {
    for (let j = 0; j < size; j += 1) {
      const idx = 4 * ((y + j) * w + (x + i));
      g.pixels[idx] = red;
      g.pixels[idx + 1] = green;
      g.pixels[idx + 2] = blue;
    }
  }
}
