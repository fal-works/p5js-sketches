/**
 * ---- p5.js color utility --------------------------------------------------
 */

0; // dummy code for VSCode to ignore file header

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
 * A symbol for distinguishing functions that apply p5.js color settings.
 */
export const applyColorSymbol = Symbol();

/**
 * Function for applying p5.js color settings
 * (e.g. functions including `stroke()` or `fill()`).
 */
export interface ApplyColorFunction {
  (): void;
  [applyColorSymbol]: never;
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
  let newFunction: Function;

  switch (strokeColor) {
    default:
      switch (fillColor) {
        default:
          newFunction = () => {
            p.stroke(strokeColor);
            p.fill(fillColor);
          };
          break;
        case null:
          newFunction = () => {
            p.stroke(strokeColor);
            p.noFill();
          };
          break;
        case undefined:
          newFunction = () => p.stroke(strokeColor);
          break;
      }
      break;
    case null:
      switch (fillColor) {
        default:
          newFunction = () => {
            p.noStroke();
            p.fill(fillColor);
          };
          break;
        case null:
          newFunction = () => {
            p.noStroke();
            p.noFill();
          };
          break;
        case undefined:
          newFunction = () => p.noStroke();
          break;
      }
      break;
    case undefined:
      switch (fillColor) {
        default:
          newFunction = () => p.fill(fillColor);
          break;
        case null:
          newFunction = () => p.noFill();
          break;
        case undefined:
          newFunction = () => {};
          break;
      }
      break;
  }

  return newFunction as ApplyColorFunction;
};
