export function createGradationRectangle(
  p: p5,
  w: number,
  h: number,
  backgroundColor: p5.Color,
  fromColor: p5.Color,
  toColor: p5.Color,
): p5.Graphics {
  const g = p.createGraphics(w, h) as any;
  g.background(backgroundColor);
  g.strokeWeight(2);

  for (let y = 0; y < h; y += 1) {
    const lerpRatio = y / (h - 1);
    g.stroke(p.lerpColor(fromColor, toColor, lerpRatio));
    g.line(0, y, w - 1, y);
  }

  return g;
}
