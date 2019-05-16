/**
 * Returns random integer from 0 up to (but not including) the max number.
 */
export function randomInt(maxInt: number): number {
  return Math.floor(Math.random() * maxInt);
}

/**
 * Returns random integer from the min number up to (but not including) the max number.
 */
export function randomIntBetween(minInt: number, maxInt: number): number {
  return minInt + randomInt(maxInt - minInt);
}

export function loop<T>(array: T[], callback: (element: T) => any): void {
  const len = array.length;
  for (let i = 0; i < len; i += 1) callback(array[i]);
}

export function getHTMLElement(id: string): HTMLElement {
  return document.getElementById(id) || document.body;
}

export interface RectangleRegionSize {
  width: number;
  height: number;
}

export enum RegionFittingOption {
  FIT_SIZE,
  FIT_WIDTH,
  FIT_HEIGHT
}

// -----------------------------------------------------

export function getHTMLElementRegionSize(
  node: HTMLElement
): RectangleRegionSize {
  if (node === document.body)
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };

  const boundingClientRect = node.getBoundingClientRect();

  return {
    width: boundingClientRect.width,
    height: boundingClientRect.height
  };
}

export interface ScaledCanvas {
  p5Canvas: p5.Renderer;
  scaleFactor: number;
}

export function calculateRegionFittingScaleFactor(
  nonScaledRegionSize: RectangleRegionSize,
  targetRegionSize: RectangleRegionSize,
  fittingOption?: RegionFittingOption
): number {
  switch (fittingOption) {
    default:
    case RegionFittingOption.FIT_SIZE:
      const scaleFactorCandidate =
        targetRegionSize.width / nonScaledRegionSize.width;
      const nonScaledHeight = nonScaledRegionSize.height;

      if (scaleFactorCandidate * nonScaledHeight < targetRegionSize.height) {
        return scaleFactorCandidate;
      } else {
        return targetRegionSize.height / nonScaledHeight;
      }

    case RegionFittingOption.FIT_WIDTH:
      return targetRegionSize.width / nonScaledRegionSize.width;

    case RegionFittingOption.FIT_HEIGHT:
      return targetRegionSize.height / nonScaledRegionSize.height;
  }
}

export function createScaledCanvas(
  p: p5,
  node: HTMLElement,
  nonScaledRegion: RectangleRegionSize,
  fittingOption?: RegionFittingOption,
  renderer?: "p2d" | "webgl" | undefined
): ScaledCanvas {
  const maxCanvasRegion = getHTMLElementRegionSize(node);
  const scaleFactor = calculateRegionFittingScaleFactor(
    nonScaledRegion,
    maxCanvasRegion,
    fittingOption
  );

  const canvas = p.createCanvas(
    scaleFactor * nonScaledRegion.width,
    scaleFactor * nonScaledRegion.height,
    renderer
  );

  return {
    p5Canvas: canvas,
    scaleFactor: scaleFactor
  };
}

export function alphaColor(p: p5, color: p5.Color, alpha: number): p5.Color {
  return p.color(p.red(color), p.green(color), p.blue(color), alpha);
}

/**
 * Set color to the specified pixel.
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
      setPixel(g, x, y, 0, 0, 0, 255 * Math.random() * factor, pixelDensity);
    }
  }

  g.updatePixels();

  return g as p5.Graphics;
}

export interface ApplyColorFunction {
  (): void;
}

export interface ShapeColor {
  strokeColor: p5.Color | undefined | null;
  fillColor: p5.Color | undefined | null;
}

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
