export function createGradationRectangle(
  p: p5,
  w: number,
  h: number,
  backgroundColor: p5.Color,
  fromColor: p5.Color,
  toColor: p5.Color,
  gradient: number = 1,
): p5.Graphics {
  const g = p.createGraphics(w, h) as any;
  g.background(backgroundColor);
  g.strokeWeight(2);

  for (let y = 0; y < h; y += 1) {
    const lerpRatio = Math.pow(y / (h - 1), gradient);
    g.stroke(p.lerpColor(fromColor, toColor, lerpRatio));
    g.line(0, y, w - 1, y);
  }

  return g;
}

export function createGradationPixels(
  p: p5,
  w: number,
  h: number,
  backgroundColor: p5.Color,
  fromColor: p5.Color,
  toColor: p5.Color,
): number[] {
  const g = createGradationRectangle(p, w, h, backgroundColor, fromColor, toColor) as any;
  g.loadPixels();

  return g.pixels;
}
