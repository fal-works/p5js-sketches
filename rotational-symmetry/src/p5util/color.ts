/**
 * ------------------------------------------------------------------------
 *  p5.js color utility
 * ------------------------------------------------------------------------
 */

/**
 * Creates a new color with RGB values of `color` and alpha value `alpha`.
 * The original alpha value of `color` will be ignored.
 * @param p
 * @param color
 * @param alpha
 */
export function alphaColor(p: p5, color: p5.Color, alpha: number): p5.Color {
  return p.color(p.red(color), p.green(color), p.blue(color), alpha);
}

export interface ShapeColor {
  strokeColor: p5.Color | undefined | null;
  fillColor: p5.Color | undefined | null;
}

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
export function createApplyColor(
  p: p5,
  shapeColor: ShapeColor
): ApplyColorFunction {
  const strokeColor = shapeColor.strokeColor;
  const fillColor = shapeColor.fillColor;

  if (strokeColor && fillColor) {
    return () => {
      p.stroke(strokeColor);
      p.fill(fillColor);
    };
  }

  if (strokeColor) {
    if (fillColor === null)
      return () => {
        p.stroke(strokeColor);
        p.noFill();
      };
    else
      return () => {
        p.stroke(strokeColor);
      };
  }

  if (fillColor) {
    if (strokeColor === null)
      return () => {
        p.noStroke();
        p.fill(fillColor);
      };
    else return () => p.fill(fillColor);
  }

  if (strokeColor === null) {
    if (fillColor === null) {
      return () => {
        p.noStroke();
        p.noFill();
      };
    } else return () => p.noStroke();
  } else {
    if (fillColor === null) return () => p.noFill();
  }

  return () => {};
}
