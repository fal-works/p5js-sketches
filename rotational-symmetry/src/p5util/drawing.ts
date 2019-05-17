/**
 * ------------------------------------------------------------------------
 *  p5.js drawing utility
 * ------------------------------------------------------------------------
 */

/**
 * Sets color to the specified pixel.
 * Should be used in conjunction with loadPixels() and updatePixels().
 * @param renderer - Instance of either p5 or p5.Graphics.
 * @param x - The x index of the pixel.
 * @param y - The y index of the pixel.
 * @param red - The red value (0 - 255).
 * @param green - The green value (0 - 255).
 * @param blue - The blue value (0 - 255).
 * @param pixelDensity - If not specified, renderer.pixelDensity() will be called.
 */
export function setPixel(
  renderer: p5 | p5.Graphics,
  x: number,
  y: number,
  red: number,
  green: number,
  blue: number,
  alpha: number,
  pixelDensity?: number
): void {
  const g = renderer as p5;
  const d = pixelDensity || g.pixelDensity();
  const graphicsPixels = g.pixels;

  for (let i = 0; i < d; i += 1) {
    for (let j = 0; j < d; j += 1) {
      const idx = 4 * ((y * d + j) * g.width * d + (x * d + i));
      graphicsPixels[idx] = red;
      graphicsPixels[idx + 1] = green;
      graphicsPixels[idx + 2] = blue;
      graphicsPixels[idx + 3] = alpha;
    }
  }
}

/**
 * Runs `drawCallback` and `p.loadPixels()`, then returns `p.pixels`.
 * The style and transformations will be restored by using `p.push()` and `p.pop()`.
 * @param p The p5 instance.
 * @param drawCallback
 */
export function createPixels(p: p5, drawCallback: (p: p5) => any): number[] {
  p.push();
  drawCallback(p);
  p.pop();
  p.loadPixels();

  return p.pixels;
}
