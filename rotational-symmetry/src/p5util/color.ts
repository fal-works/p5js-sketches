/**
 * ---- p5.js color utility --------------------------------------------------
 */

/**
 * Creates a new color with RGB values of `color` and alpha value `alpha`.
 * The original alpha value of `color` will be ignored.
 * @param p
 * @param color
 * @param alpha
 */
export const alphaColor = (p: p5, color: p5.Color, alpha: number) =>
  p.color(p.red(color), p.green(color), p.blue(color), alpha);

/**
 * -
 */
export interface ShapeColor {
  readonly strokeColor: p5.Color | undefined | null;
  readonly fillColor: p5.Color | undefined | null;
}

/**
 * -
 */
export interface ApplyColorFunction {
  (): void;
}

/**
 * Creates a composite function of `p.stroke()` and `p.fill()`.
 * A `null` color will be interpreted as `p.noStroke()` or `p.noFill()`.
 * An `undefined` color will have no effect.
 *
 * @param p - The p5 instance.
 * @param shapeColor - Composite of two colors for `p.stroke()` and `p.fill()`.
 */
export const createApplyColor = (
  p: p5,
  shapeColor: ShapeColor
): ApplyColorFunction => {
  const strokeColor = shapeColor.strokeColor;
  const fillColor = shapeColor.fillColor;

  switch (strokeColor) {
    case undefined:
      switch (fillColor) {
        case undefined:
          return () => {};
        case null:
          return () => p.noFill();
        default:
          return () => p.fill(fillColor);
      }
    case null:
      switch (fillColor) {
        case undefined:
          return () => p.noStroke();
        case null:
          return () => {
            p.noStroke();
            p.noFill();
          };
        default:
          return () => {
            p.noStroke();
            p.fill(fillColor);
          };
      }
    default:
      switch (fillColor) {
        case undefined:
          return () => p.stroke(strokeColor);
        case null:
          return () => {
            p.stroke(strokeColor);
            p.noFill();
          };
        default:
          return () => {
            p.stroke(strokeColor);
            p.fill(fillColor);
          };
      }
  }
};
