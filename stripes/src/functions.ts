import * as p5ex from 'p5ex';

export function shufflePixels(p: p5) {
  p.blendMode(p.BLEND);
  p.loadPixels();
  const density = p.pixelDensity();
  const xPixelCount = p.width * density;
  const yPixelCount = p.height * density;

  for (let i = 0, len = 200000 * p.sq(density); i < len; i += 1) {
    const x = p5ex.randomInt(xPixelCount);
    const y = p5ex.randomInt(yPixelCount);
    const index = (y * xPixelCount + x) * 4;
    const otherX = x + p5ex.randomSign(1 + Math.floor(p.sq(Math.random()) * 7 * density));
    const otherY = y + p5ex.randomSign(1 + Math.floor(p.sq(Math.random()) * 7 * density));
    const otherIndex = (otherY * xPixelCount + otherX) * 4;

    if (otherIndex < 0 || otherIndex >= p.pixels.length) continue;

    p.pixels[index] = p.pixels[otherIndex];
    p.pixels[index + 1] = p.pixels[otherIndex + 1];
    p.pixels[index + 2] = p.pixels[otherIndex + 2];
    p.pixels[index + 3] = p.pixels[otherIndex + 3];
  }

  p.updatePixels();
}
